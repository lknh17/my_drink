import { useMemo, useState } from "react";
import { beerMonographToFootprint, useDrinkFootprints } from "../../../../core/drinkFootprints";
import type { BeerFermentationFamily, BeerStyleCategoryId, WineCompendiumBundle } from "../../types";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { assetUrl } from "../../../../lib/assetUrl";
import { BeerGlassIllustration } from "./BeerGlassIllustration";

interface Props {
  bundle: WineCompendiumBundle;
  selectedStyle: BeerStyleCategoryId | "all";
  selectedBeerId: string | null;
  onSelectStyle: (style: BeerStyleCategoryId | "all") => void;
  onSelectBeer: (id: string | null) => void;
}

const RADAR_KEYS = [
  ["hopBitterness", "酒花苦度"],
  ["hopAroma", "酒花果香"],
  ["maltSweetness", "麦芽甜润"],
  ["roastBody", "烘焙焦香"],
  ["crispnessOrSour", "杀口清爽度"],
] as const;

function FlavorRadar({ values }: { values: Record<(typeof RADAR_KEYS)[number][0], number> }) {
  const pts = RADAR_KEYS.map(([key], i) => {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
    const r = 72 * values[key] / 100;
    return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`;
  }).join(" ");
  return <svg className="beer-radar" viewBox="-30 -20 260 240">{[.25, .5, .75, 1].map((r) => <polygon key={r} points={RADAR_KEYS.map((_, i) => `${100 + Math.cos(-Math.PI / 2 + i * Math.PI * 2 / 5) * 72 * r},${100 + Math.sin(-Math.PI / 2 + i * Math.PI * 2 / 5) * 72 * r}`).join(" ")} />)}<polygon className="beer-radar__data" points={pts} />{RADAR_KEYS.map(([key, label], i) => <text key={label} x={100 + Math.cos(-Math.PI / 2 + i * Math.PI * 2 / 5) * 105} y={104 + Math.sin(-Math.PI / 2 + i * Math.PI * 2 / 5) * 96} textAnchor="middle">{label} {values[key]}</text>)}</svg>;
}

const FAMILY_LABELS: Record<BeerFermentationFamily, string> = {
  ale: "艾尔·上层温暖果香发酵",
  lager: "拉格·下层低温清爽慢酵",
  "wild-sour": "野生菌与乳酸酸啤",
};
const GLASS_LABELS = {
  "pilsner-flute": "皮尔森笛型杯", "weizen-vase": "德式小麦高杯", tulip: "郁金香聚香杯",
  "trappist-chalice": "比利时圣杯", "nonic-pint": "英式无缺口品脱杯", "shaker-pint": "美式品脱杯",
  snifter: "斯尼夫特聚香杯", stange: "科隆直筒杯",
} as const;
const splitChips = (value: string) => value.split(/[、，,/]/).map((item) => item.trim()).filter(Boolean);
const bitterness = (ibu: number) => ibu <= 18 ? "几乎不苦·清甜柔和" : ibu <= 35 ? "微苦回甘·清爽平衡" : ibu <= 55 ? "明显柑橘松针爽苦" : "重度酒花苦味冲击";
const body = (plato: string, abv: number) => (Number(plato.match(/[\d.]+/)?.[0] ?? 0) >= 18 || abv >= 8) ? "浓稠醇厚·小口慢品" : (Number(plato.match(/[\d.]+/)?.[0] ?? 0) >= 13 || abv >= 5.5) ? "中等麦香饱满" : "轻盈畅饮";
const scene = (ibu: number, abv: number) => abv >= 8 ? "适合进阶饮者、餐后慢饮或配浓味菜" : ibu >= 36 ? "适合喜欢柑橘酒花的人，配烧烤与辛香菜" : "适合初饮者、聚餐开场与夏日畅饮";
const balance = (ibu: number, abv: number) => Math.max(5, Math.min(95, 50 + (ibu - abv * 6) * 1.2));

export function BeerTaplistReader({ bundle, selectedStyle, selectedBeerId, onSelectStyle, onSelectBeer }: Props) {
  const [origin, setOrigin] = useState<"all" | "world" | "china">("all");
  const [family, setFamily] = useState<BeerFermentationFamily | "all">("all");
  const [passport, setPassport] = useState<"all" | "tasted" | "wish">("all");
  const [query, setQuery] = useState("");
  const { isTasted, isWishlisted, toggleTasted, toggleWishlist, getNote, updateNote } = useDrinkFootprints();
  const beers = useMemo(() => bundle.beerMonographs.filter((b) =>
    (origin === "all" || (origin === "china") === !!b.isChineseRepresentative) &&
    (family === "all" || b.fermentationFamily === family) &&
    (selectedStyle === "all" || b.styleCategory === selectedStyle) &&
    (passport === "all" || (passport === "tasted" ? isTasted(b.id) : isWishlisted(b.id))) &&
    (!query || `${b.title}${b.brewery}${b.bjcpStyleLabel}${b.aromaTags.join("")}`.toLowerCase().includes(query.toLowerCase()))
  ), [bundle.beerMonographs, family, isTasted, isWishlisted, origin, passport, query, selectedStyle]);
  const beer = bundle.beerMonographs.find((b) => b.id === selectedBeerId) ?? beers[0] ?? bundle.beerMonographs[0];
  if (!beer) return <section className="beer-empty">酒头正在接管中。</section>;
  const footprint = beerMonographToFootprint(beer, getNote(beer.id));
  return (
    <section className="beer-taplist">
      <aside className="tap-board">
        <header><small>TONIGHT'S POUR</small><h2>酒头水牌</h2></header>
        <input aria-label="搜索啤酒" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="酒厂 / 风格 / 香气…" />
        <div className="tap-filter-row">{(["all", "world", "china"] as const).map((v) => <button className={origin === v ? "on" : ""} key={v} onClick={() => setOrigin(v)}>{v === "all" ? "全部" : v === "world" ? "世界经典精酿" : "中国百年与本土风土"}</button>)}</div>
        <div className="tap-filter-row">{(["all", "ale", "lager", "wild-sour"] as const).map((v) => <button className={family === v ? "on" : ""} key={v} onClick={() => setFamily(v)}>{v === "all" ? "全部发酵家族" : FAMILY_LABELS[v]}</button>)}</div>
        <select aria-label="风格筛选" value={selectedStyle} onChange={(e) => onSelectStyle(e.target.value as BeerStyleCategoryId | "all")}><option value="all">八大风格 · 全部</option>{bundle.beerStyles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <div className="tap-filter-row">{(["all", "tasted", "wish"] as const).map((v) => <button className={passport === v ? "on" : ""} key={v} onClick={() => setPassport(v)}>{v === "all" ? "馆藏" : v === "tasted" ? "喝过" : "想喝"}</button>)}</div>
        <nav>{beers.map((b) => <button key={b.id} className={b.id === beer.id ? "tap-line on" : "tap-line"} onClick={() => onSelectBeer(b.id)}><b>{b.tapNumber}</b><span>{b.title}<small>{FAMILY_LABELS[b.fermentationFamily]} · {bitterness(b.ibu)}</small></span><i style={{ background: b.srmColorHex }} /></button>)}</nav>
      </aside>
      <article className="tap-dossier">
        <header className="tap-dossier__head"><span className="tap-brass">{beer.tapNumber}</span><div><small>{FAMILY_LABELS[beer.fermentationFamily]}</small><h2>{beer.title}</h2><p>{beer.brewery} · {beer.countryOrRegion}</p></div>{beer.isChineseRepresentative && <b className="china-badge">中国风土酒头</b>}</header>
        <section className="beer-beginner-card"><header><small>BEGINNER TRANSLATOR</small><h3>三秒读懂这杯啤酒</h3></header><div><article><b>苦感体感</b><strong>{bitterness(beer.ibu)}</strong><span>{beer.ibu} IBU</span></article><article><b>酒体浓淡</b><strong>{body(beer.originalGravityPlato, beer.abvNum)}</strong><span>{beer.abv}</span></article><article><b>酒液色泽</b><i style={{ background: beer.srmColorHex }} /><strong>{bundle.beerSrmScale.reduce((a, s) => Math.abs(s.srm - beer.srm) < Math.abs(a.srm - beer.srm) ? s : a).name}</strong></article><article><b>适饮人群与场景</b><strong>{scene(beer.ibu, beer.abvNum)}</strong></article></div></section>
        <div className="tap-hero">
          <div className="beer-dual-showcase"><EditorialDrinkPhoto src={assetUrl(beer.photoUrl ?? "")} alt={`${beer.title}实拍`} aspectRatio="4/3" badge="真实酒款实拍" fallbackKind="beer-glass" /><div><BeerGlassIllustration glassware={beer.glassware} srmColorHex={beer.srmColorHex} beerName={GLASS_LABELS[beer.glassware]} /><p>{beer.foamHeadNote}</p></div></div>
          <div><div className="tap-specs"><span><small>酒精度</small>{beer.abv}</span><span><small>适饮温度</small>{beer.servingTempCelsius}</span></div><div className="pro-brewer-row"><b>专业酿造师参数</b><span>{beer.bjcpStyleLabel}</span><span>{beer.originalGravityPlato}</span><span>IBU {beer.ibu}</span><span>SRM {beer.srm}</span></div><section className="balance-bar"><h3>苦甜天平条</h3><div><i style={{ left: `${balance(beer.ibu, beer.abvNum)}%` }} /></div><p><span>偏麦芽甜润</span><span>黄金平衡</span><span>锐利干苦</span></p><small>把酒花苦度与麦汁浓度放在同一把尺上：指标越靠右，入口越干、苦味越清晰；靠左则更显麦芽甜润。</small></section></div>
        </div>
        <p className="tap-tagline">{beer.tagline}</p>
        <div className="tap-recipe">{[["🌾 麦芽与谷物基底", beer.maltBill], ["🌿 啤酒花香气与苦味", beer.hopsUsed], ["🧪 酵母与特殊工艺", beer.yeastAndProcess]].map(([title, value]) => <section key={title}><h3>{title}</h3><div className="ingredient-chips">{splitChips(value).map((chip) => <span key={chip}>{chip}</span>)}</div></section>)}</div>
        <div className="tap-sensory"><FlavorRadar values={beer.flavorRadar} /><div><h3>香气雷达</h3><p>{beer.aromaTags.join(" · ")}</p><h3>侍饮</h3><p>{beer.servingTempCelsius} · {beer.foodPairings.join(" / ")}</p></div></div>
        <p className="tap-essay">{beer.essay}</p>
        <div className="tap-passport"><button className={isTasted(beer.id) ? "on" : ""} onClick={() => toggleTasted(footprint)}>✓ 喝过</button><button className={isWishlisted(beer.id) ? "on" : ""} onClick={() => toggleWishlist(footprint)}>☆ 想喝</button><textarea aria-label="品饮笔记" value={getNote(beer.id)} onChange={(e) => updateNote(beer.id, e.target.value, footprint)} placeholder="记下泡沫、香气、入口与余韵…" /></div>
      </article>
    </section>
  );
}
