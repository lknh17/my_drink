import { useState } from "react";
import { CraftStepDeck, type CraftStepItem } from "../../../../core/CraftStepDeck";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { cocktailToFootprint, useDrinkFootprints } from "../../../../core/drinkFootprints";
import { assetUrl } from "../../../../lib/assetUrl";
import type { CocktailMethod } from "../../types";
import type { CuratedWingProps } from "./HuangjiuWingView";
import "./wings.css";
const CRAFT_STEPS: CraftStepItem[] = [
  {stepNo:1,id:"stir",title:"Stirred 层流控融水",subtitle:"搅拌不是慢，而是精确",plainAction:"烈酒与冰在调酒杯中平稳画圈，达到目标温度即滤出。",scienceNote:"低剪切层流减少气泡，冰块表面均匀换热并加入可控融水。",flavorImpact:"酒体透明丝滑，适合马天尼、尼格罗尼与古典。",keyMetrics:["搅拌 20–40 秒","融水约 15–25%"],diagramKind:"cocktail-ice-thermodynamics",photoUrl:assetUrl("/photos/craft-cocktail-1.jpg")},
  {stepNo:2,id:"shake",title:"Shaken 撞击乳化",subtitle:"高速降温、充气与乳化",plainAction:"酸、甜、烈酒与冰在摇壶中强力撞击；蛋白款先干摇。",scienceNote:"湍流快速换热，空气被卷入，蛋白和柑橘形成细小乳化结构。",flavorImpact:"口感轻盈、有泡沫，酸味边缘更柔软。",keyMetrics:["摇 8–15 秒","成酒约 -5–0℃"],diagramKind:"cocktail-ice-thermodynamics",photoUrl:assetUrl("/photos/craft-cocktail-2.jpg")},
  {stepNo:3,id:"ice",title:"大冰球手凿透明冰",subtitle:"控制温度变化的几何学",plainAction:"定向冷冻得到透明冰，再手凿成大方冰或冰球。",scienceNote:"体积越大、相对表面积越小，升温后融化更慢。",flavorImpact:"让古典类鸡尾酒在杯中缓慢舒展，不会迅速水掉。",keyMetrics:["定向冷冻","大冰低表面积"],diagramKind:"cocktail-ice-thermodynamics",photoUrl:assetUrl("/photos/craft-cocktail-3.jpg")},
  {stepNo:4,id:"oil",title:"柑橘油脂喷雾",subtitle:"最后一秒建立鼻前顶香",plainAction:"削下新鲜果皮，在杯口上方挤压油囊并轻擦杯缘。",scienceNote:"疏水精油形成微滴，漂浮在酒面并随饮用持续挥发。",flavorImpact:"橙、柠檬或葡萄柚顶香先于入口抵达鼻腔。",keyMetrics:["只取彩色外皮","避开苦白瓤"],diagramKind:"cocktail-ice-thermodynamics",photoUrl:assetUrl("/photos/craft-cocktail-4.jpg")},
];

export function CocktailWingView({ bundle, selectedSpecimenId, activeSubView, onSubViewChange, onSelectSpecimen, onBackToAtrium }: CuratedWingProps) {
  const [method, setMethod] = useState<CocktailMethod | "eastern" | "all">("all");
  const { isTasted, isWishlisted, toggleTasted, toggleWishlist } = useDrinkFootprints();
  const list = bundle.cocktailSpecimens.filter((x) => method === "all" || (method === "eastern" ? x.isEasternFusion : x.method === method));
  const active = bundle.cocktailSpecimens.find((x) => x.id === selectedSpecimenId) ?? list[0];
  const maxMl = active ? Math.max(...active.ingredients.map((i) => i.amountMl), 1) : 1;
  const view = activeSubView === "craft" ? "craft" : "catalog";
  return <div className="curated-wing cocktail-wing">
    <header className="curated-mast"><button onClick={onBackToAtrium}>← 六境门厅</button><div><small>SLIGHTLY TIPSY · SPEAKEASY No. 06</small><h1>微醺 · 鸡尾酒调酒馆</h1><p>液态建筑、冰的几何与吧勺节拍，在翡翠苦精和黄铜灯影间成形。</p></div></header>
    <main>
      <nav className="curated-subtabs"><button className={view === "catalog" ? "on" : ""} onClick={() => onSubViewChange?.("catalog")}>典藏酒单与风土</button><button className={view === "craft" ? "on" : ""} onClick={() => onSubViewChange?.("craft")}>调酒工艺科普</button></nav>
      {view === "catalog" ? <>
      <nav className="cocktail-methods">{(["all", "stirred", "shaken", "built", "eastern"] as const).map((m) => <button key={m} className={method === m ? "on" : ""} onClick={() => setMethod(m)}><b>{m === "all" ? "ALL" : m.toUpperCase()}</b>{m === "all" ? "全酒单" : m === "stirred" ? "搅拌" : m === "shaken" ? "摇合" : m === "built" ? "直调" : "东方茶酒特调"}</button>)}</nav>
      <div className="cocktail-menu">{list.map((x) => <button key={x.id} className={active?.id === x.id ? "on" : ""} onClick={() => onSelectSpecimen(x.id)}><EditorialDrinkPhoto src={assetUrl(x.photoUrl ?? "")} alt={x.title} aspectRatio="4/3" fallbackKind="wine-decanter" /><span>{x.method}</span><strong>{x.title}</strong><em>{x.englishTitle}</em><small>{x.eraOrOrigin}</small></button>)}</div>
      {active && (() => { const fp = cocktailToFootprint(active); return <article className="cocktail-dossier">
        <EditorialDrinkPhoto className="curated-hero-photo" src={assetUrl(active.photoUrl ?? "")} alt={active.title} aspectRatio="16/9" badge="成品实拍" fallbackKind="wine-decanter" />
        <header><small>{active.eraOrOrigin} · {active.abvEstimate}</small><h2>{active.title}</h2><em>{active.englishTitle}</em><p>{active.tagline}</p></header>
        <div className="liquid-architecture"><section className="recipe-glass">{active.ingredients.map((i) => <div key={i.name} style={{ height: `${Math.max(18, i.amountMl / maxMl * 90)}px`, background: i.colorHex }}><b>{i.amountMl} ml</b><span>{i.name}</span><small>{i.role}</small></div>)}</section><section><small>LIQUID ARCHITECTURE</small><h3>配方比例柱状杯</h3><p>每一层按毫升比例显示；基酒搭骨架，修饰酒连接香气，酸苦与东方茶材刻出张力。</p><div className="bar-specs"><span><b>技法</b>{active.method}</span><span><b>杯型</b>{active.glassware}</span><span><b>冰型</b>{active.iceSpec}</span><span><b>装饰</b>{active.garnish}</span></div></section></div>
        <div className="balance-meter">{Object.entries(active.balanceAxis).map(([k, v]) => <div key={k}><span>{({ spiritStrength: "烈度", sweetRichness: "甜润", sourBitterTension: "酸苦张力", dilutionChill: "融水冰镇" } as Record<string, string>)[k]}</span><i><b style={{ width: `${v}%` }} /></i><em>{v}</em></div>)}</div>
        <section className="bartender-steps"><small>BARTENDER'S SEQUENCE</small><h3>调酒师步骤</h3><ol>{active.preparationSteps.map((s, i) => <li key={s}><b>{String(i + 1).padStart(2, "0")}</b><p>{s}</p></li>)}</ol></section>
        <p className="cocktail-tags">{active.flavorTags.join(" ◆ ")}</p><p className="curated-essay">{active.essay}</p><div className="passport-actions"><button className={isTasted(active.id) ? "on" : ""} onClick={() => toggleTasted(fp)}>✓ 喝过</button><button className={isWishlisted(active.id) ? "on" : ""} onClick={() => toggleWishlist(fp)}>☆ 想喝</button></div>
      </article>; })()}
      </> : <CraftStepDeck steps={CRAFT_STEPS} heading="鸡尾酒液态建筑与冰温流体力学" subheading="同样是降温和加水，搅拌、摇合、大冰与柑橘油为何给出四种完全不同的触感。" accentHex="#cfa15a" />}
    </main>
  </div>;
}
