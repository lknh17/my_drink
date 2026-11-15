import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const hubBase = process.env.HUB_BASE_PATH?.replace(/\/$/, "");
const base = hubBase ? `${hubBase}/` : "/";

const LOCAL_TILES_CACHE_ROOT = path.resolve(process.cwd(), "public", "tiles-cache");
const LOCAL_TILES_WRITE_ROOT = (() => {
  try {
    return fs.lstatSync(LOCAL_TILES_CACHE_ROOT).isSymbolicLink()
      ? path.resolve(process.cwd(), "public", ".tiles-cache-local")
      : LOCAL_TILES_CACHE_ROOT;
  } catch {
    return LOCAL_TILES_CACHE_ROOT;
  }
})();
const FALLBACK_FOOD_TILES_CACHE_ROOT = path.resolve(
  process.cwd(),
  "..",
  "my_food",
  "public",
  "tiles-cache",
);

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const PHOTO_AUDIT_SCRIPT = path.resolve(process.cwd(), "scripts", "drink_photo_audit.py");

function runPhotoAudit(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    execFile("python3", [PHOTO_AUDIT_SCRIPT, ...args], {
      cwd: process.cwd(),
      timeout: 120_000,
      maxBuffer: 4 * 1024 * 1024,
    }, (error, stdout, stderr) => {
      const output = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "";
      if (error) {
        try {
          const parsed = JSON.parse(output);
          reject(new Error(parsed.error ?? stderr.trim() ?? error.message));
        } catch {
          reject(new Error(stderr.trim() || output || error.message));
        }
        return;
      }
      try {
        resolve(JSON.parse(output));
      } catch {
        reject(new Error(`Photo audit returned invalid JSON: ${output.slice(0, 300)}`));
      }
    });
  });
}

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk: Buffer) => {
      raw += chunk.toString("utf8");
      if (raw.length > 64_000) reject(new Error("Request body too large"));
    });
    req.on("end", () => {
      try { resolve(JSON.parse(raw || "{}")); }
      catch { reject(new Error("Invalid JSON body")); }
    });
    req.on("error", reject);
  });
}

function sendJson(res: any, status: number, payload: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function upstreamTileUrls(mode: string, z: number, y: number, x: number): string[] {
  if (mode === "street") {
    return [
      `https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
      `https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
    ];
  }
  if (mode === "satellite") {
    return [
      `https://webst02.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}`,
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    ];
  }
  if (mode === "ref") {
    return [
      `https://webst02.is.autonavi.com/appmaptile?style=8&x=${x}&y=${y}&z=${z}`,
      `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/${z}/${y}/${x}`,
    ];
  }
  // mode === "topo"
  if (z >= 14) {
    return [
      `https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    ];
  }
  return [
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`,
    `https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
  ];
}

function findValidCachedTile(mode: string, zStr: string, yStr: string, xStr: string): string | null {
  const z = Number(zStr);
  const roots = [
    LOCAL_TILES_WRITE_ROOT,
    LOCAL_TILES_CACHE_ROOT,
    FALLBACK_FOOD_TILES_CACHE_ROOT,
  ];
  for (const root of roots) {
    const candidate = path.join(root, mode, zStr, yStr, `${xStr}.jpg`);
    try {
      if (fs.existsSync(candidate)) {
        const stat = fs.statSync(candidate);
        if (stat.size > 400 && !(z >= 8 && stat.size === 2521)) {
          return candidate;
        }
      }
    } catch {
      // try next cache root
    }
  }
  return null;
}

async function fetchValidTileBuffer(mode: string, z: number, y: number, x: number): Promise<Buffer | null> {
  const urls = upstreamTileUrls(mode, z, y, x);
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6500);
      const resp = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!resp.ok) continue;
      const arr = await resp.arrayBuffer();
      const buf = Buffer.from(arr);
      if (z >= 8 && buf.length <= 3600 && url.includes("arcgisonline.com")) {
        continue;
      }
      if (buf.length > 400) {
        return buf;
      }
    } catch {
      // try next fallback URL
    }
  }
  return null;
}

function attachZhuoweiMiddleware(middlewares: {
  use: (fn: (req: any, res: any, next: () => void) => void) => void;
}) {
  const baseNoSlash = base.replace(/\/$/, "");
  middlewares.use(async (req, res, next) => {
    if (!req.url) return next();
    const requestUrl = new URL(req.url, "http://localhost");
    const normPathname = baseNoSlash && requestUrl.pathname.startsWith(`${baseNoSlash}/`)
      ? requestUrl.pathname.slice(baseNoSlash.length)
      : requestUrl.pathname;
    if (req.method === "GET" && normPathname === "/__photo_audit/candidates") {
      const id = requestUrl.searchParams.get("id") ?? "";
      const query = requestUrl.searchParams.get("q") ?? "";
      if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) return sendJson(res, 400, { error: "Invalid photo id" });
      try {
        return sendJson(res, 200, await runPhotoAudit(["--candidates", id, "--query", query]));
      } catch (error) {
        return sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
    if (req.method === "POST" && normPathname === "/__photo_audit/apply") {
      try {
        const body = await readJsonBody(req);
        const id = typeof body.id === "string" ? body.id : "";
        const url = typeof body.url === "string" ? body.url : "";
        if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) return sendJson(res, 400, { error: "Invalid photo id" });
        if (!/^https?:\/\//i.test(url)) return sendJson(res, 400, { error: "Only http(s) image URLs are accepted" });
        const entry = await runPhotoAudit(["--set-url", id, "--url", url]);
        return sendJson(res, 200, { entry, timestamp: Date.now() });
      } catch (error) {
        return sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
    if (baseNoSlash && req.url.startsWith(`${baseNoSlash}${baseNoSlash}/`)) {
      req.url = req.url.replace(new RegExp(`^${baseNoSlash}${baseNoSlash}/`), base);
    } else if (req.url.startsWith("/my_drink/my_drink/")) {
      req.url = req.url.replace(/^\/my_drink\/my_drink\//, base);
    } else if (base === "/" && (req.url.startsWith("/drink/") || req.url.startsWith("/my_drink/"))) {
      req.url = req.url.replace(/^\/(my_)?drink\//, "/") || "/";
    } else if (
      base !== "/" &&
      (req.url.startsWith("/photos/") ||
        req.url.startsWith("/data/") ||
        req.url.startsWith("/tiles-cache/"))
    ) {
      req.url = `${baseNoSlash}${req.url}`;
    }

    // Local disk-caching tile proxy: /(drink/|my_drink/)?tiles-cache/:mode/:z/:y/:x.jpg
    const cleanUrl = req.url.split("?")[0];
    const tileMatch = cleanUrl.match(
      /\/tiles-cache\/(topo|satellite|street|ref)\/(\d+)\/(\d+)\/(\d+)\.jpg$/,
    );
    if (tileMatch) {
      const [, mode, zStr, yStr, xStr] = tileMatch;
      const z = Number(zStr);
      const y = Number(yStr);
      const x = Number(xStr);

      const cachedPath = findValidCachedTile(mode, zStr, yStr, xStr);
      if (cachedPath) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        fs.createReadStream(cachedPath).pipe(res);
        return;
      }

      const buf = await fetchValidTileBuffer(mode, z, y, x);
      if (buf) {
        const writeTarget = path.join(LOCAL_TILES_WRITE_ROOT, mode, zStr, yStr, `${xStr}.jpg`);
        try {
          fs.mkdirSync(path.dirname(writeTarget), { recursive: true });
          fs.writeFileSync(writeTarget, buf);
        } catch {
          // ignore write errors
        }
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.end(buf);
        return;
      }
    }

    next();
  });
}

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: "zhuowei-dual-base-and-tile-cache",
      configureServer(server) {
        attachZhuoweiMiddleware(server.middlewares);
      },
      configurePreviewServer(server) {
        attachZhuoweiMiddleware(server.middlewares);
      },
    },
  ],
  server: {
    host: process.env.HOST ?? "::",
    port: Number(process.env.PORT ?? 5197),
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: process.env.HOST ?? "127.0.0.1",
    port: Number(process.env.PORT ?? 4177),
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 6500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/maplibre-gl")) {
            return "vendor-maplibre";
          }
          if (id.includes("node_modules/react")) {
            return "vendor-react";
          }
          if (id.includes("/src/halls/tea/content")) {
            return "tea-content";
          }
          if (id.includes("/src/halls/wine/")) {
            return "wine-content";
          }
          if (id.includes("/src/halls/coffee/")) {
            return "coffee-content";
          }
          return undefined;
        },
      },
    },
  },
});
