import { useEffect, useMemo, useState } from "react";
import type { DrinkRouteTarget } from "./types";
import { assetUrl } from "../lib/assetUrl";

interface LedgerEntry {
  id: string;
  title?: string;
  hall?: string;
  sourceKind?: string;
  width?: number;
  height?: number;
  bytes?: number;
  sourceProvider?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  semanticScore?: number;
  totalScore?: number;
  status?: string;
  query?: string;
  needsRecheck?: boolean;
}

interface Candidate {
  url: string;
  title: string;
  width: number;
  height: number;
  provider: string;
  semanticScore: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: DrinkRouteTarget) => void;
}

const FILTERS = [
  ["all", "全部"],
  ["tea", "中华茶馆"],
  ["baijiu", "国酿·白酒"],
  ["beer", "麦律·啤酒"],
  ["curated", "黄酒/葡萄/烈酒/调酒"],
  ["coffee", "精品咖啡"],
  ["craft", "制作工序实拍"],
  ["warning", "待复核/低分预警"],
] as const;

function groupFor(entry: LedgerEntry) {
  const kind = entry.sourceKind ?? "";
  if (kind === "craft-step") return "craft";
  if (kind.startsWith("baijiu")) return "baijiu";
  if (kind.startsWith("beer")) return "beer";
  if (["huangjiu-specimen", "grape-specimen", "grape-region", "grape-oak-glass", "spirit-specimen", "spirit-glass-ritual", "cocktail-specimen"].includes(kind)) return "curated";
  if (kind.startsWith("coffee-")) return "coffee";
  if (entry.hall === "coffee") return "coffee";
  if (entry.hall === "tea") return "tea";
  return entry.hall ?? "other";
}

function routeFor(entry: LedgerEntry): DrinkRouteTarget {
  const kind = entry.sourceKind ?? "";
  if (kind === "tea-monograph") return { hall: "tea", sub: "monographs", tea: entry.id };
  if (kind === "tea-mountain") return { hall: "tea", sub: "terroir", mtn: entry.id };
  if (kind === "teaware") return { hall: "tea", sub: "teaware", ware: entry.id };
  if (kind === "baijiu-monograph") return { hall: "wine", wing: "baijiu", wsub: "monographs", specimen: entry.id };
  if (kind === "baijiu-zone") return { hall: "wine", wing: "baijiu", wsub: "terroir", zone: entry.id };
  if (kind === "baijiu-vessel") return { hall: "wine", wing: "baijiu", wsub: "vessels", specimen: entry.id };
  if (kind === "beer-monograph") return { hall: "wine", wing: "beer", wsub: "taplist", specimen: entry.id };
  if (kind === "coffee-specimen" || kind === "coffee-bean") return { hall: "coffee", csub: "monographs", specimen: entry.id };
  if (kind === "coffee-origin") return { hall: "coffee", csub: "terroir", origin: entry.id };
  if (kind === "coffee-drink") return { hall: "coffee", csub: "brewing", drink: entry.id };
  if (kind === "coffee-brew") return { hall: "coffee", csub: "brewing" };
  if (kind === "coffee-equipment") return { hall: "coffee", csub: "equipment", gear: entry.id };
  if (kind === "coffee-ecology") return { hall: "coffee", csub: "ecology" };
  if (kind === "grape-region") return { hall: "wine", wing: "grape", wsub: "terroir" };
  if (kind === "grape-oak-glass") return { hall: "wine", wing: "grape", wsub: "sommelier" };
  if (kind === "spirit-glass-ritual") return { hall: "wine", wing: "spirits", wsub: "distill-ritual" };
  if (kind === "craft-step") {
    if (entry.hall === "tea") return { hall: "tea", sub: "spectrum" };
    if (entry.hall === "coffee") return { hall: "coffee", csub: "botany" };
    if (entry.id.includes("baijiu")) return { hall: "wine", wing: "baijiu", wsub: "craft" };
    if (entry.id.includes("beer")) return { hall: "wine", wing: "beer", wsub: "craft" };
  }
  const wing = kind.startsWith("huangjiu") ? "huangjiu" : kind.startsWith("grape") ? "grape" : kind.startsWith("spirit") ? "spirits" : "cocktails";
  return { hall: "wine", wing, specimen: entry.id };
}

export function PhotoCalibrationModal({ open, onClose, onNavigate }: Props) {
  const [items, setItems] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState({ total: 0, verified: 0 });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LedgerEntry | null>(null);
  const [query, setQuery] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [cacheVersion, setCacheVersion] = useState(Date.now());

  const loadLedger = async () => {
    const response = await fetch(`${assetUrl("/photos/semantic-ledger.json")}?v=${Date.now()}`);
    if (!response.ok) throw new Error("无法读取配图语义账本");
    const data = await response.json();
    setItems(Object.values(data.items ?? {}));
    setSummary(data.summary ?? { total: 0, verified: 0 });
  };

  useEffect(() => {
    if (!open) return;
    loadLedger().catch((error) => setMessage(String(error)));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onClose]);

  const visible = useMemo(() => items.filter((item) => {
    const warning = item.status !== "VERIFIED" || item.needsRecheck || (item.semanticScore ?? 0) < 65;
    if (filter === "warning" ? !warning : filter !== "all" && groupFor(item) !== filter) return false;
    const needle = search.trim().toLowerCase();
    return !needle || `${item.id} ${item.title} ${item.sourceTitle}`.toLowerCase().includes(needle);
  }), [items, filter, search]);

  const openEditor = (entry: LedgerEntry) => {
    setSelected(entry);
    setQuery(entry.query ?? entry.title ?? entry.id);
    setDirectUrl("");
    setCandidates([]);
    setMessage("");
  };

  const findCandidates = async () => {
    if (!selected) return;
    setBusy(true);
    setMessage("正在检索高清候选图…");
    try {
      const params = new URLSearchParams({ id: selected.id, q: query });
      const response = await fetch(`${assetUrl("__photo_audit/candidates")}?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "候选检索失败");
      setCandidates(data);
      setMessage(data.length ? `找到 ${data.length} 张候选图` : "未找到合格候选图，请调整关键词");
    } catch (error) {
      setMessage(String(error));
    } finally {
      setBusy(false);
    }
  };

  const applyUrl = async (url: string, title = "") => {
    if (!selected || !url) return;
    setBusy(true);
    setMessage("正在下载、验清晰度并写入语义账本…");
    try {
      const response = await fetch(assetUrl("__photo_audit/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, url, title, query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "校准写入失败");
      await loadLedger();
      setCacheVersion(data.timestamp ?? Date.now());
      setSelected((prev) => prev ? { ...prev, ...data.entry } : prev);
      setMessage(`已校准：${data.entry.width} × ${data.entry.height} · ${Math.round(data.entry.bytes / 1024)} KB`);
    } catch (error) {
      setMessage(String(error));
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;
  return (
    <div className="photo-calibration-modal" role="dialog" aria-modal="true" aria-label="全馆配图语义巡检与数据校准工作台">
      <header>
        <div><small>PHOTO SEMANTIC AUDIT · LOCAL CURATION DESK</small><h2>全馆配图语义巡检与数据校准工作台</h2><p>{summary.verified} / {summary.total} 张通过高清校验</p></div>
        <button onClick={onClose} aria-label="关闭配图校准">×</button>
      </header>
      <nav>
        {FILTERS.map(([id, label]) => <button key={id} className={filter === id ? "on" : ""} onClick={() => setFilter(id)}>{label}</button>)}
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索酒款、茶名、工序或资产 ID…" />
      </nav>
      <main>
        <section className="photo-calibration-grid" aria-label={`当前显示 ${visible.length} 张配图`}>
          {visible.map((entry) => <article key={entry.id} className={entry.status !== "VERIFIED" || (entry.semanticScore ?? 0) < 65 ? "warning" : ""}>
            <img src={`${assetUrl(`/photos/${entry.id}.jpg`)}?v=${cacheVersion}`} alt={entry.title ?? entry.id} loading="lazy" />
            <div><small>{entry.sourceKind} · {entry.id}</small><h3>{entry.title ?? entry.id}</h3><p>{entry.width ?? 0} × {entry.height ?? 0} · {Math.round((entry.bytes ?? 0) / 1024)} KB</p><p>{entry.sourceProvider ?? "none"} · 语义 {entry.semanticScore ?? 0}</p><em title={entry.sourceTitle}>{entry.sourceTitle || "暂无来源标题"}</em></div>
            <button onClick={() => openEditor(entry)}>校准换图</button>
          </article>)}
        </section>
        {selected && <aside className="photo-calibration-drawer">
          <button className="drawer-close" onClick={() => setSelected(null)}>×</button>
          <small>CALIBRATING · {selected.id}</small><h3>{selected.title}</h3>
          <img className="current-photo" src={`${assetUrl(`/photos/${selected.id}.jpg`)}?v=${cacheVersion}`} alt={selected.title ?? selected.id} />
          <label>高精度检索词<textarea value={query} onChange={(e) => setQuery(e.target.value)} /></label>
          <button disabled={busy} onClick={findCandidates}>检索 8 张高清候选</button>
          <div className="photo-candidates">{candidates.map((candidate) => <button key={candidate.url} disabled={busy} onClick={() => applyUrl(candidate.url, candidate.title)}><img src={candidate.url} alt={candidate.title} /><span>{candidate.width} × {candidate.height} · {candidate.semanticScore} 分</span><em>{candidate.title}</em></button>)}</div>
          <label>或粘贴图片直链<input value={directUrl} onChange={(e) => setDirectUrl(e.target.value)} placeholder="https://…/photo.jpg" /></label>
          <button disabled={busy || !directUrl} onClick={() => applyUrl(directUrl)}>下载并立即校准</button>
          <button className="navigate" onClick={() => { onNavigate(routeFor(selected)); onClose(); }}>跳转至所在展席</button>
          {message && <p className="calibration-message">{message}</p>}
        </aside>}
      </main>
    </div>
  );
}
