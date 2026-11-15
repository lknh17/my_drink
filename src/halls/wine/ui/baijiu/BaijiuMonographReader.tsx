import { useMemo, useState } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { baijiuMonographToFootprint, useDrinkFootprints } from "../../../../core/drinkFootprints";
import { assetUrl } from "../../../../lib/assetUrl";
import type { BaijiuAromaId, BaijiuMonograph, WineCompendiumBundle } from "../../types";
import { BaijiuPorcelainCup } from "./BaijiuPorcelainCup";

export function BaijiuMonographReader({
  bundle,
  selectedBaijiuId,
  selectedAroma,
  onSelectAroma,
  onSelectBaijiu,
}: {
  bundle: WineCompendiumBundle;
  selectedBaijiuId: string | null;
  selectedAroma: BaijiuAromaId | "all";
  onSelectAroma: (id: BaijiuAromaId | "all") => void;
  onSelectBaijiu: (id: string) => void;
}) {
  const footprints = useDrinkFootprints();
  const [query, setQuery] = useState("");
  const [honorsOnly, setHonorsOnly] = useState(false);
  const [passport, setPassport] = useState<"all" | "tasted" | "wishlist">("all");
  const filtered = useMemo(() => bundle.baijiuMonographs.filter((item) => {
    const text = `${item.title}${item.subSchool}${item.provinceLabel}${item.originCore}`.toLowerCase();
    return (selectedAroma === "all" || item.aroma === selectedAroma) && (!honorsOnly || item.nationalHonorTag)
      && (passport === "all" || (passport === "tasted" ? footprints.isTasted(item.id) : footprints.isWishlisted(item.id)))
      && text.includes(query.trim().toLowerCase());
  }), [bundle, selectedAroma, honorsOnly, passport, query, footprints.tastedSet, footprints.wishlistSet]);
  const item = bundle.baijiuMonographs.find((m) => m.id === selectedBaijiuId) ?? filtered[0] ?? bundle.baijiuMonographs[0];
  if (!item) return <p className="baijiu-empty">本纪档案正在编校。</p>;

  const footprint = baijiuMonographToFootprint(item, footprints.getNote(item.id));
  return (
    <div className="baijiu-reader">
      <aside className="baijiu-reader-index">
        <span className="baijiu-kicker">卷三 · 名酒本纪索引</span>
        <input aria-label="检索白酒" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="酒名、省份、产区…" />
        <select value={selectedAroma} onChange={(e) => onSelectAroma(e.target.value as BaijiuAromaId | "all")}><option value="all">十二香型 · 全部</option>{bundle.baijiuAromas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        <label><input type="checkbox" checked={honorsOnly} onChange={(e) => setHonorsOnly(e.target.checked)} /> 仅看国家名酒金奖</label>
        <div className="baijiu-filter-tabs">{(["all", "tasted", "wishlist"] as const).map((id) => <button key={id} className={passport === id ? "active" : ""} onClick={() => setPassport(id)}>{id === "all" ? "全部" : id === "tasted" ? "喝过" : "想喝"}</button>)}</div>
        <div className="baijiu-index-scroll">{filtered.map((m) => <button key={m.id} className={m.id === item.id ? "active" : ""} onClick={() => onSelectBaijiu(m.id)}><span>{m.title}</span><small>{m.provinceLabel} · {bundle.baijiuAromas.find((a) => a.id === m.aroma)?.name}</small>{m.nationalHonorTag && <b>金奖</b>}</button>)}</div>
      </aside>
      <article className="baijiu-folio">
        <header className="baijiu-folio-header">
          <div><span className="baijiu-kicker">{item.subSchool} · {item.originCore}</span><h1>{item.title}</h1><p>{item.tagline}</p>{item.nationalHonorTag && <strong className="baijiu-honor">{item.nationalHonorTag}</strong>}</div>
          <div className="baijiu-folio-visuals">
            <EditorialDrinkPhoto src={assetUrl(item.photoUrl ?? "")} alt={item.title} aspectRatio="3/4" fit="contain" accentHex={item.liquorHueHex} badge={item.abvOptions} fallbackKind="bottle" />
            <BaijiuPorcelainCup hue={item.liquorHueHex} title={item.title} size={190} />
          </div>
        </header>
        <section className="baijiu-inscription-grid">
          <Plaque char="粮" title="五谷配方" text={item.grainFormula} /><Plaque char="曲" title="制曲" text={item.quCraft} />
          <Plaque char="窖" title="窖池轮次" text={item.pitAndCycle} /><Plaque char="藏" title="陈藏勾调" text={item.agingAndBlend} />
          <Plaque char="度" title="酒精度" text={item.abvOptions} /><Plaque char="香" title="主体分子" text={item.keyCompounds.join(" · ")} />
        </section>
        <section className="baijiu-sensory-section">
          <div><h2>国标四步感官审评</h2><ol className="baijiu-four-steps"><li><b>眼观</b>{item.liquorBeadNote}</li><li><b>鼻闻</b>{item.noseNotes.join(" · ")}</li><li><b>口尝</b>{item.palateNote}</li><li><b>空杯</b>{item.emptyCupNote}</li></ol></div>
          <SensoryRadar item={item} />
        </section>
        <section className="baijiu-service-card"><h2>侍酒醒酒与硬菜配伍</h2><div><b>{item.servingRitual.vessel}</b><span>{item.servingRitual.tempCelsius} · 醒酒 {item.servingRitual.decantMinutes}</span></div><p>{item.servingRitual.foodPairings.join(" · ")}</p></section>
        <section className="baijiu-essay"><h2>酒志</h2><p>{item.essay}</p></section>
        <section className="baijiu-notebook">
          <div><button className={footprints.isTasted(item.id) ? "active" : ""} onClick={() => footprints.toggleTasted(footprint)}>✓ 喝过</button><button className={footprints.isWishlisted(item.id) ? "active" : ""} onClick={() => footprints.toggleWishlist(footprint)}>☆ 想喝</button></div>
          <textarea aria-label="个人品饮笔记" value={footprints.getNote(item.id)} onChange={(e) => footprints.updateNote(item.id, e.target.value, footprint)} placeholder="记录酒花、前中后段与空杯留香…" />
        </section>
      </article>
    </div>
  );
}

function Plaque({ char, title, text }: { char: string; title: string; text: string }) { return <div className="baijiu-plaque"><span>{char}</span><div><b>{title}</b><p>{text}</p></div></div>; }

function SensoryRadar({ item }: { item: BaijiuMonograph }) {
  const entries = Object.entries(item.sensoryRadar);
  const points = entries.map(([, value], i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; const r = Number(value) * .82; return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`; }).join(" ");
  const labels = ["酯香", "粮甜", "酒体", "顺滑", "留香"];
  return <figure className="baijiu-radar"><svg viewBox="0 0 200 200">{[20, 40, 60, 80].map((r) => <polygon key={r} points={Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`; }).join(" ")} />)}<polygon className="data" points={points} />{labels.map((label, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; return <text key={label} x={100 + Math.cos(a) * 94} y={104 + Math.sin(a) * 90} textAnchor="middle">{label}</text>; })}</svg><figcaption>五轴感官雷达</figcaption></figure>;
}
