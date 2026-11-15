import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import maplibregl, { type Map as MlMap } from "maplibre-gl";
import { PROVINCE_META, type ProvinceId } from "../types";
import { assetUrl } from "../../lib/assetUrl";
import { SouthChinaSea } from "./Inset";

export type TerroirBasemapMode = "topo" | "satellite" | "street";

export interface TerroirMarkerItem {
  id: string;
  kind?: "mountain" | "tea" | "spot" | "estate";
  title: string;
  subtitle?: string;
  badge?: string;
  elevation?: string;
  coord: [number, number];
  defaultZoom?: number;
  colorHex?: string;
  isTasted?: boolean;
}

export interface TerroirMapStageProps {
  markers: TerroirMarkerItem[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (markerId: string) => void;
  center?: [number, number];
  zoom?: number;
  defaultBasemap?: TerroirBasemapMode;
  basemap?: TerroirBasemapMode;
  onBasemapChange?: (mode: TerroirBasemapMode) => void;
  provinceBoundary?: ProvinceId | null;
  title?: string;
  subtitle?: string;
  height?: number | string;
  className?: string;
  renderOverlayCard?: (marker: TerroirMarkerItem) => ReactNode;
}

const TILE = 256;
const DEFAULT_CHINA_TEA_CENTER: [number, number] = [111.5, 27.2];
const DEFAULT_CHINA_TEA_ZOOM = 5;

const TILE_URL: Record<TerroirBasemapMode, (z: number, y: number, x: number) => string> = {
  topo: (z, y, x) => assetUrl(`tiles-cache/topo/${z}/${y}/${x}.jpg`),
  satellite: (z, y, x) => assetUrl(`tiles-cache/satellite/${z}/${y}/${x}.jpg`),
  street: (z, y, x) => assetUrl(`tiles-cache/street/${z}/${y}/${x}.jpg`),
};

const DIRECT_FALLBACK_URL: Record<TerroirBasemapMode, (z: number, y: number, x: number) => string> = {
  topo: (z, y, x) =>
    z >= 14
      ? `https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`
      : `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`,
  satellite: (z, y, x) => `https://webst02.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}`,
  street: (z, y, x) =>
    `https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
};

function worldPx(lng: number, lat: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;
  return { x, y, scale };
}

export function TerroirMapStage({
  markers,
  selectedMarkerId = null,
  onSelectMarker,
  center,
  zoom,
  defaultBasemap = "topo",
  basemap: controlledBasemap,
  onBasemapChange,
  provinceBoundary = null,
  title = "高山云雾 · 风土实测地形沙盘",
  subtitle,
  height = 540,
  className = "",
  renderOverlayCard,
}: TerroirMapStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const mlContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);

  const [internalBasemap, setInternalBasemap] = useState<TerroirBasemapMode>(defaultBasemap);
  const activeBasemap = controlledBasemap ?? internalBasemap;

  const initialCenter = center ?? DEFAULT_CHINA_TEA_CENTER;
  const initialZoom = zoom ?? DEFAULT_CHINA_TEA_ZOOM;

  const [cameraCenter, setCameraCenter] = useState<[number, number]>(initialCenter);
  const [cameraZoom, setCameraZoom] = useState<number>(initialZoom);
  const [stageSize, setStageSize] = useState({ w: 960, h: 540 });
  const [webglReady, setWebglReady] = useState(false);

  const activeMarker = useMemo(
    () => (selectedMarkerId ? markers.find((m) => m.id === selectedMarkerId) ?? null : null),
    [markers, selectedMarkerId],
  );

  function switchBasemap(mode: TerroirBasemapMode) {
    setInternalBasemap(mode);
    onBasemapChange?.(mode);
  }

  // Measure container size for fallback slippy tiles & projected pins
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 80 && rect.height > 80) {
        setStageSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Initialize MapLibre GL stage
  useEffect(() => {
    const container = mlContainerRef.current;
    if (!container) return;
    let map: MlMap | null = null;

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      map = new maplibregl.Map({
        container,
        style: {
          version: 8,
          sources: {
            topo: {
              type: "raster",
              tiles: [`${origin}${assetUrl("tiles-cache/topo/{z}/{y}/{x}.jpg")}`],
              tileSize: 256,
            },
            satellite: {
              type: "raster",
              tiles: [`${origin}${assetUrl("tiles-cache/satellite/{z}/{y}/{x}.jpg")}`],
              tileSize: 256,
            },
            street: {
              type: "raster",
              tiles: [`${origin}${assetUrl("tiles-cache/street/{z}/{y}/{x}.jpg")}`],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "bg",
              type: "background",
              paint: { "background-color": "rgba(239, 236, 226, 0)" },
            },
            {
              id: "layer-topo",
              type: "raster",
              source: "topo",
              layout: { visibility: activeBasemap === "topo" ? "visible" : "none" },
            },
            {
              id: "layer-satellite",
              type: "raster",
              source: "satellite",
              layout: { visibility: activeBasemap === "satellite" ? "visible" : "none" },
            },
            {
              id: "layer-street",
              type: "raster",
              source: "street",
              layout: { visibility: activeBasemap === "street" ? "visible" : "none" },
            },
          ],
        },
        center: initialCenter,
        zoom: initialZoom,
        pitch: 0,
        bearing: 0,
        minZoom: 3.5,
        maxZoom: 16,
        attributionControl: false,
      });

      map.on("load", () => {
        setWebglReady(true);
      });

      map.on("move", () => {
        if (!map) return;
        const c = map.getCenter();
        setCameraCenter([c.lng, c.lat]);
        setCameraZoom(map.getZoom());
      });

      mapRef.current = map;
    } catch {
      setWebglReady(false);
    }

    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync basemap layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !webglReady) return;
    try {
      (["topo", "satellite", "street"] as TerroirBasemapMode[]).forEach((mode) => {
        const lid = `layer-${mode}`;
        if (map.getLayer(lid)) {
          map.setLayoutProperty(lid, "visibility", activeBasemap === mode ? "visible" : "none");
        }
      });
    } catch {
      // ignore
    }
  }, [activeBasemap, webglReady]);

  // Fly to external center/zoom changes
  useEffect(() => {
    if (!center) return;
    const targetZ = zoom ?? cameraZoom;
    setCameraCenter(center);
    if (typeof zoom === "number") setCameraZoom(zoom);
    if (mapRef.current && webglReady) {
      try {
        mapRef.current.flyTo({
          center,
          zoom: targetZ,
          pitch: 0,
          duration: 720,
          essential: true,
        });
      } catch {
        // fallback handled by state
      }
    }
  }, [center?.[0], center?.[1], zoom, webglReady]);

  // Fly to selected marker when selectedMarkerId updates
  useEffect(() => {
    if (!activeMarker) return;
    const targetZoom = activeMarker.defaultZoom ?? 9.5;
    setCameraCenter(activeMarker.coord);
    setCameraZoom(targetZoom);
    if (mapRef.current && webglReady) {
      try {
        mapRef.current.flyTo({
          center: activeMarker.coord,
          zoom: targetZoom,
          pitch: 0,
          duration: 780,
          essential: true,
        });
      } catch {
        // fallback handled by state
      }
    }
  }, [activeMarker?.id, webglReady]);

  // Optional province GeoJSON boundary overlay inside MapLibre
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !webglReady) return;
    const srcId = "terroir-prov-boundary";
    const lineLayerId = "terroir-prov-line";

    const cleanup = () => {
      try {
        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map.getSource(srcId)) map.removeSource(srcId);
      } catch {
        // ignore
      }
    };

    cleanup();
    if (!provinceBoundary) return cleanup;
    const meta = PROVINCE_META[provinceBoundary];
    if (!meta) return cleanup;

    let cancelled = false;
    fetch(assetUrl(`data/${meta.geoJsonFile}`))
      .then((r) => r.json())
      .then((geojson) => {
        if (cancelled || !mapRef.current) return;
        try {
          mapRef.current.addSource(srcId, { type: "geojson", data: geojson });
          mapRef.current.addLayer({
            id: lineLayerId,
            type: "line",
            source: srcId,
            paint: {
              "line-color": "#A6402C",
              "line-width": 1.6,
              "line-opacity": 0.65,
            },
          });
        } catch {
          // ignore if style changed
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [provinceBoundary, webglReady]);

  function handleMarkerClick(marker: TerroirMarkerItem) {
    onSelectMarker?.(marker.id);
    const targetZoom = marker.defaultZoom ?? 9.5;
    setCameraCenter(marker.coord);
    setCameraZoom(targetZoom);
    if (mapRef.current && webglReady) {
      try {
        mapRef.current.flyTo({
          center: marker.coord,
          zoom: targetZoom,
          pitch: 0,
          duration: 760,
          essential: true,
        });
      } catch {
        // ignore
      }
    }
  }

  function resetOverview() {
    const targetC = center ?? DEFAULT_CHINA_TEA_CENTER;
    const targetZ = zoom ?? DEFAULT_CHINA_TEA_ZOOM;
    setCameraCenter(targetC);
    setCameraZoom(targetZ);
    if (mapRef.current && webglReady) {
      try {
        mapRef.current.flyTo({
          center: targetC,
          zoom: targetZ,
          pitch: 0,
          bearing: 0,
          duration: 700,
          essential: true,
        });
      } catch {
        // ignore
      }
    }
  }

  // Slippy tile & coordinate projection for instant rendering and crisp DOM pin alignment
  const scene = useMemo(() => {
    const z = Math.max(4, Math.min(15, Math.round(cameraZoom)));
    const centerPx = worldPx(cameraCenter[0], cameraCenter[1], z);
    const originX = centerPx.x - stageSize.w / 2;
    const originY = centerPx.y - stageSize.h / 2;
    const x0 = Math.floor(originX / TILE);
    const y0 = Math.floor(originY / TILE);
    const x1 = Math.floor((originX + stageSize.w) / TILE);
    const y1 = Math.floor((originY + stageSize.h) / TILE);
    const maxTile = 2 ** z;
    const tiles: { x: number; y: number; left: number; top: number }[] = [];
    for (let x = x0; x <= x1; x += 1) {
      for (let y = y0; y <= y1; y += 1) {
        if (x < 0 || y < 0 || x >= maxTile || y >= maxTile) continue;
        tiles.push({ x, y, left: x * TILE - originX, top: y * TILE - originY });
      }
    }
    const project = (lng: number, lat: number) => {
      const pt = worldPx(lng, lat, z);
      return { x: pt.x - originX, y: pt.y - originY };
    };
    return { z, tiles, project };
  }, [cameraCenter, cameraZoom, stageSize]);

  return (
    <div
      ref={stageRef}
      className={`zw-terroir-stage mode-${activeBasemap} ${className}`.trim()}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
      data-testid="terroir-map-stage"
    >
      <header className="zw-terroir-hud">
        <div className="zw-terroir-hud-left">
          <strong style={{ fontFamily: "var(--font-serif)" }}>{title}</strong>
          {subtitle && <span style={{ color: "#5C6660" }}>· {subtitle}</span>}
          <span className="zw-terroir-coords">
            {cameraCenter[1].toFixed(2)}°N, {cameraCenter[0].toFixed(2)}°E · z{scene.z}
          </span>
        </div>

        <div className="zw-terroir-controls">
          <div className="zw-basemap-seg" role="group" aria-label="底图模式切换">
            <button
              type="button"
              className={activeBasemap === "topo" ? "on" : ""}
              data-testid="terroir-basemap-topo"
              onClick={() => switchBasemap("topo")}
            >
              等高地形
            </button>
            <button
              type="button"
              className={activeBasemap === "satellite" ? "on" : ""}
              data-testid="terroir-basemap-satellite"
              onClick={() => switchBasemap("satellite")}
            >
              卫星地貌
            </button>
            <button
              type="button"
              className={activeBasemap === "street" ? "on" : ""}
              data-testid="terroir-basemap-street"
              onClick={() => switchBasemap("street")}
            >
              街区水系
            </button>
          </div>

          <div className="zw-zoom-group">
            <button
              type="button"
              title="放大"
              onClick={() => {
                const nextZ = Math.min(15, Math.round(cameraZoom + 1));
                setCameraZoom(nextZ);
                mapRef.current?.zoomTo(nextZ);
              }}
            >
              +
            </button>
            <span>z{scene.z}</span>
            <button
              type="button"
              title="缩小"
              onClick={() => {
                const nextZ = Math.max(4, Math.round(cameraZoom - 1));
                setCameraZoom(nextZ);
                mapRef.current?.zoomTo(nextZ);
              }}
            >
              −
            </button>
          </div>

          <button
            type="button"
            className="zw-chip"
            style={{ background: "#F7F5EE", color: "#1E2421" }}
            onClick={resetOverview}
          >
            重置视野
          </button>
        </div>
      </header>

      {/* Instant 0ms local disk tile fallback layer */}
      <div className="zw-terroir-tiles-fallback" aria-hidden="true">
        {scene.tiles.map((tile) => (
          <img
            key={`ttile-${activeBasemap}-${scene.z}-${tile.x}-${tile.y}`}
            className="zw-terroir-static-tile"
            alt=""
            width={TILE}
            height={TILE}
            style={{ left: tile.left, top: tile.top }}
            src={TILE_URL[activeBasemap](scene.z, tile.y, tile.x)}
            onError={(e) => {
              const target = e.currentTarget;
              const fb = DIRECT_FALLBACK_URL[activeBasemap](scene.z, tile.y, tile.x);
              if (target.src !== fb) target.src = fb;
            }}
          />
        ))}
      </div>

      {/* MapLibre GL WebGL Canvas */}
      <div
        ref={mlContainerRef}
        className="zw-terroir-ml-canvas"
        style={{ opacity: webglReady ? 1 : 0 }}
      />

      {/* Interactive Terroir Markers Layer */}
      <div className="zw-terroir-pins-layer">
        {markers.map((m, idx) => {
          const projected = webglReady && mapRef.current
            ? mapRef.current.project([m.coord[0], m.coord[1]])
            : null;
          const pt = projected ?? scene.project(m.coord[0], m.coord[1]);
          if (pt.x < -50 || pt.x > stageSize.w + 50 || pt.y < -50 || pt.y > stageSize.h + 50) {
            return null;
          }
          const isSelected = activeMarker?.id === m.id;
          const accent = m.colorHex ?? "#35685F";
          return (
            <button
              key={m.id}
              type="button"
              className={`zw-terroir-pin${isSelected ? " active" : ""}`}
              style={{
                left: `${pt.x}px`,
                top: `${pt.y}px`,
                borderColor: accent,
              }}
              data-testid={`terroir-pin-${m.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick(m);
              }}
            >
              <span className="zw-terroir-pin-dot" style={{ background: accent }}>
                {m.isTasted ? "✓" : idx + 1}
              </span>
              <span>{m.title}</span>
            </button>
          );
        })}
      </div>

      <SouthChinaSea visible={scene.z <= 6} />

      {activeMarker && renderOverlayCard && (
        <div className="zw-terroir-overlay-slot">
          {renderOverlayCard(activeMarker)}
        </div>
      )}

      <aside className="zw-terroir-jumper" aria-label="产区快速定位">
        <div className="zw-terroir-jumper-context">
          <strong>{activeMarker?.title ?? "全国产区索引"}</strong>
          <span>
            {activeMarker?.subtitle ?? title} ·{" "}
            {(activeMarker?.coord[1] ?? cameraCenter[1]).toFixed(2)}°N /{" "}
            {(activeMarker?.coord[0] ?? cameraCenter[0]).toFixed(2)}°E
          </span>
        </div>
        <div className="zw-terroir-jumper-list">
          {markers.map((marker, index) => (
            <button
              key={`jump-${marker.id}`}
              type="button"
              className={activeMarker?.id === marker.id ? "active" : ""}
              onClick={() => handleMarkerClick(marker)}
              title={marker.subtitle}
            >
              <b>{index + 1}</b>{marker.title}
            </button>
          ))}
          <button type="button" className="overview" onClick={resetOverview}>
            查看全国全景 z{Math.round(zoom ?? DEFAULT_CHINA_TEA_ZOOM)}
          </button>
        </div>
      </aside>
    </div>
  );
}
