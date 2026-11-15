import { useState } from "react";
import { CraftStepDeck, type CraftStepItem } from "../../../../core/CraftStepDeck";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { huangjiuToFootprint, useDrinkFootprints } from "../../../../core/drinkFootprints";
import { assetUrl } from "../../../../lib/assetUrl";
import type { HuangjiuSugarType, WineCompendiumBundle } from "../../types";
import "./wings.css";

export interface CuratedWingProps {
  bundle: WineCompendiumBundle;
  selectedSpecimenId: string | null;
  activeSubView?: string | null;
  onSubViewChange?: (sub: string | null) => void;
  onSelectSpecimen: (id: string | null) => void;
  onBackToAtrium: () => void;
}
const SUGARS: Array<{ id: HuangjiuSugarType; name: string; range: string; note: string }> = [
  { id: "dry-yuanhong", name: "元红 · 干型", range: "≤15 g/L", note: "发酵彻底，鲜爽咸香" },
  { id: "semi-dry-jiafan", name: "加饭 / 花雕 · 半干", range: "15–40 g/L", note: "加米复酿，醇厚平衡" },
  { id: "semi-sweet-shanniang", name: "善酿 · 半甜", range: "40–100 g/L", note: "以酒代水，甜润丰腴" },
  { id: "sweet-xiangxue", name: "香雪 · 甜型", range: ">100 g/L", note: "糟烧代水，浓甜少酸" },
  { id: "sake-makgeolli", name: "东亚米酒对照", range: "精米步合", note: "清酒与马格利的并行坐标" },
];
const CRAFT_STEPS: CraftStepItem[] = [
  ["soak","浸米浆酸","让糯米吸水并以浆水乳酸护航","冬季长时间浸米，保留浆水调节酸度。","米粒吸水膨胀，乳酸环境压住杂菌。","形成柔和酸骨架与干净米香。",["低温 10–15 天","浆水微酸"]],
  ["steam","蒸汽炊饭","蒸熟但不煮烂","以蒸汽把糯米蒸透，再摊开降温。","淀粉糊化，变成曲霉酶容易拆解的结构。","决定酒体是否细腻、米甜是否完整。",["蒸透不糊","摊凉至 25–30℃"]],
  ["jar","摊饭落缸麦曲酒药双边发酵","糖化与酒化同时发生","熟饭、麦曲、酒药和浆水一同落缸。","霉菌把淀粉变糖，酵母同步把糖变酒精。","带来绍兴酒独有的米曲鲜味和醇厚。",["10–18℃","60–90 天"]],
  ["rake","昼夜开耙控温","用耙子管理发酵热量","按昼夜温升开耙搅拌、散热并补氧。","避免罐心过热，同时让菌群均匀工作。","压住粗酸与杂味，保留细致果香。",["看温开耙","峰值约 30℃"]],
  ["press","压榨煎酒","把酒液与酒糟分开并热杀菌","成熟酒醪压榨澄清，再缓慢加热煎酒。","加热终止微生物活动并稳定蛋白。","酒体更澄亮，坚果与熟谷物香被固定。",["煎酒 85–90℃","缓慢压榨"]],
  ["seal","荷叶泥头封坛陈酿","让陶坛缓慢呼吸","酒入陶坛，以荷叶、竹箬和泥头封口入库。","陶壁微量透氧推动酯化与氧化熟成。","新鲜米香转为枣干、核桃和焦糖陈香。",["陶坛 3–20 年","微氧陈化"]],
].map(([id,title,subtitle,plainAction,scienceNote,flavorImpact,keyMetrics], i) => ({ id: String(id), title: String(title), subtitle: String(subtitle), plainAction: String(plainAction), scienceNote: String(scienceNote), flavorImpact: String(flavorImpact), keyMetrics: keyMetrics as string[], stepNo: i + 1, diagramKind: "huangjiu-double-ferment", photoUrl: assetUrl(`/photos/craft-huangjiu-${i + 1}.jpg`) }));

export function HuangjiuWingView({ bundle, selectedSpecimenId, activeSubView, onSubViewChange, onSelectSpecimen, onBackToAtrium }: CuratedWingProps) {
  const [sugar, setSugar] = useState<HuangjiuSugarType | "all">("all");
  const { isTasted, isWishlisted, toggleTasted, toggleWishlist } = useDrinkFootprints();
  const list = bundle.huangjiuSpecimens.filter((x) => sugar === "all" || x.sugarType === sugar);
  const active = bundle.huangjiuSpecimens.find((x) => x.id === selectedSpecimenId) ?? list[0];
  const view = activeSubView === "craft" ? "craft" : "catalog";
  return <div className="curated-wing huangjiu-wing">
    <header className="curated-mast"><button onClick={onBackToAtrium}>← 六境门厅</button><div><small>ANCIENT YUE · RICE WINE</small><h1>古越 · 黄酒与东方米酒馆</h1><p>稽山鉴水，冬酿春榨；糯米、麦曲与时间叠成温润的琥珀。</p></div></header>
    <main>
      <nav className="curated-subtabs"><button className={view === "catalog" ? "on" : ""} onClick={() => onSubViewChange?.("catalog")}>典藏酒单与风土</button><button className={view === "craft" ? "on" : ""} onClick={() => onSubViewChange?.("craft")}>酿造工艺科普</button></nav>
    {view === "catalog" ? <>
      <section className="hj-sugar-scale"><header><small>RESIDUAL SUGAR SPECTRUM</small><h2>总糖分 · 干湿四阶尺</h2></header><div>{SUGARS.map((s) => <button key={s.id} className={sugar === s.id ? "on" : ""} onClick={() => setSugar(sugar === s.id ? "all" : s.id)}><b>{s.range}</b><strong>{s.name}</strong><span>{s.note}</span></button>)}</div></section>
      <section className="hj-calendar"><header><small>24 SOLAR TERMS</small><h2>冬酿二十四节气</h2></header><div><article><b>秋分</b><span>制麦曲</span><p>燥热渐退，曲块培养酵母、霉菌与乳酸菌群。</p></article><article><b>立冬</b><span>开酿</span><p>低温投料抑制杂菌，糯米糖化与酒精发酵并行。</p></article><article><b>大寒</b><span>养醅</span><p>越冬缓酵聚拢氨基酸、乳酸与琥珀色泽。</p></article><article><b>立春</b><span>榨酒泥封</span><p>压榨、煎酒杀菌，陶坛荷叶泥封后静待陈年。</p></article></div></section>
      <div className="curated-reader">
        <nav>{list.map((x) => <button key={x.id} className={active?.id === x.id ? "on" : ""} onClick={() => onSelectSpecimen(x.id)}><EditorialDrinkPhoto className="curated-nav-photo" src={assetUrl(x.photoUrl ?? "")} alt={x.title} aspectRatio="1/1" fallbackKind="bottle" /><span>{x.title}<small>{x.originLabel} · {x.sugarLabel}</small></span></button>)}</nav>
        {active && (() => { const fp = huangjiuToFootprint(active); return <article className="hj-dossier"><EditorialDrinkPhoto className="curated-hero-photo" src={assetUrl(active.photoUrl ?? "")} alt={active.title} aspectRatio="4/3" badge="馆藏实拍" fallbackKind="bottle" /><header><span>{active.sugarLabel}</span><h2>{active.title}</h2><p>{active.originLabel} · {active.abv} · 陈藏 {active.agingYears}</p></header><div className="liquor-orb" style={{ "--liquor": active.liquorColorHex } as React.CSSProperties}>温</div><h3>{active.tagline}</h3><dl><div><dt>米与水</dt><dd>{active.riceAndWater}</dd></div><div><dt>曲与酒母</dt><dd>{active.quAndStarter}</dd></div><div><dt>鲜味结构</dt><dd>{active.aminoAcidUmamiNote}</dd></div></dl><aside><b>温酒礼</b><p>{active.warmingAndServing}</p><strong>佐餐 · {active.foodPairings.join(" / ")}</strong></aside><p className="curated-essay">{active.essay}</p><div className="passport-actions"><button className={isTasted(active.id) ? "on" : ""} onClick={() => toggleTasted(fp)}>✓ 喝过</button><button className={isWishlisted(active.id) ? "on" : ""} onClick={() => toggleWishlist(fp)}>☆ 想喝</button></div></article>; })()}
      </div>
      </> : <CraftStepDeck steps={CRAFT_STEPS} heading="绍兴冬酿 · 双边复式发酵六步长卷" subheading="从一粒浸透的糯米，到荷叶泥头下缓慢呼吸的陶坛。" accentHex="#8f3d2e" />}
    </main>
  </div>;
}
