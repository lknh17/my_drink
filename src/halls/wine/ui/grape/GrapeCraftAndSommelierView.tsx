import { useState } from "react";
import { CraftStepDeck, type CraftStepItem } from "../../../../core/CraftStepDeck";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { assetUrl } from "../../../../lib/assetUrl";
import type { GrapeOakAndGlassItem } from "../../types";

export interface GrapeCraftAndSommelierViewProps { items:GrapeOakAndGlassItem[] }
const STEPS:CraftStepItem[]=[
  {stepNo:1,id:"harvest",title:"分区采收与分选",subtitle:"酸、糖与酚成熟的第一道判断",plainAction:"按地块、品种和成熟度分批采收，剔除腐败果。",scienceNote:"温度与氧化从离开藤蔓即开始影响香气前体。",flavorImpact:"决定果味纯净度、酸度与潜在酒精。",keyMetrics:["手采 8–18℃","糖酸与籽成熟并读"],diagramKind:"grape-maceration-champagne",photoUrl:"/photos/craft-grape-harvest.jpg"},
  {stepNo:2,id:"red",title:"红酒带皮浸渍",subtitle:"花青素与单宁的萃取窗口",plainAction:"破皮发酵，以淋皮或压帽管理酒帽。",scienceNote:"酒精与热量逐步溶出果皮花青素和籽梗单宁。",flavorImpact:"塑造颜色、涩感、酒体与陈年骨架。",keyMetrics:["24–30℃","浸渍 7–30 天"],diagramKind:"grape-maceration-champagne",photoUrl:"/photos/craft-grape-2.jpg"},
  {stepNo:3,id:"white",title:"白酒低氧压榨",subtitle:"先分离果皮再低温发酵",plainAction:"整串或轻柔压榨，澄清汁液后隔氧发酵。",scienceNote:"低温减缓挥发与氧化，保留酯类和硫醇香。",flavorImpact:"形成柑橘、白花与脆爽酸线。",keyMetrics:["压榨 <1.2bar","发酵 12–18℃"],diagramKind:"grape-maceration-champagne",photoUrl:"/photos/craft-grape-1.jpg"},
  {stepNo:4,id:"sparkling",title:"瓶中二次发酵",subtitle:"气泡与酒泥自溶",plainAction:"基酒加糖酵母装瓶，酒泥陈年后转瓶除渣。",scienceNote:"密闭二发令二氧化碳溶解，酵母自溶释放甘露蛋白。",flavorImpact:"细密气泡叠加布里欧修和烤坚果。",keyMetrics:["二发约 6bar","酒泥 ≥15月"],diagramKind:"grape-maceration-champagne",photoUrl:"/photos/craft-grape-4.jpg"},
  {stepNo:5,id:"sweet",title:"贵腐、冰酒与加强",subtitle:"三条保存糖分的路径",plainAction:"贵腐脱水、冰冻压榨，或加入葡萄蒸馏酒中止发酵。",scienceNote:"水分减少或酵母被抑制，使糖酸风味同步浓缩。",flavorImpact:"产生蜂蜜、杏脯、果酱与坚果氧化香。",keyMetrics:["冰酒采收 ≤-8℃","加强酒 17–20%"],diagramKind:"grape-maceration-champagne",photoUrl:"/photos/craft-grape-3.jpg"},
  {stepNo:6,id:"maturation",title:"橡木桶与瓶陈",subtitle:"微氧、聚合与缓慢演化",plainAction:"依品种选择桶种、桶龄与烘烤度，再调配装瓶。",scienceNote:"微氧推动单宁聚合，木质素释放香草醛和烟熏分子。",flavorImpact:"涩感变细，果香转向雪松、坚果与林地。",keyMetrics:["桶陈 6–24月","新桶比例 0–100%"],diagramKind:"grape-maceration-champagne",photoUrl:"/photos/craft-grape-5.jpg"},
];

function Stemware({kind}:{kind:string}){
  const decanter=kind.includes("decanter");
  const burgundy=kind.includes("burgundy");
  const champagne=kind.includes("champagne");
  const port=kind.includes("port");
  const bowl=burgundy?70:champagne?30:port?38:52;
  const height=champagne?122:port?78:105;
  return <svg viewBox="0 0 180 220" className="grape-stemware-svg" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="4">
    {decanter?<><path d="M75 25h30l-7 52c3 25 57 42 57 80 0 30-30 42-65 42s-65-12-65-42c0-38 54-55 57-80z"/><path d="M39 158c28 13 76 13 102 0"/></>:<><path d={`M${90-bowl/2} 25 Q${90-bowl/2-4} ${25+height*.65} 90 ${25+height} Q${90+bowl/2+4} ${25+height*.65} ${90+bowl/2} 25Z`}/><path d={`M90 ${25+height}v${178-(25+height)}M58 190h64`}/></>}
  </g></svg>;
}

export function GrapeCraftAndSommelierView({items}:GrapeCraftAndSommelierViewProps){
  const barrels=items.filter((x)=>x.kind==="oak-barrel"), glasses=items.filter((x)=>x.kind==="stemware-decanter");
  const [oak,setOak]=useState(barrels[0]?.id),[glass,setGlass]=useState(glasses[0]?.id);
  const activeOak=barrels.find((x)=>x.id===oak)??barrels[0], activeGlass=glasses.find((x)=>x.id===glass)??glasses[0];
  return <section className="grape-volume grape-craft-volume">
    <header className="grape-volume-head"><small>VOLUME IV · CRAFT & SOMMELIER RITUAL</small><h2>卷四 · 酿造、橡木桶与侍酒器礼</h2><p>六条工艺岔路、四种木桶语言与六件水晶器物，把田间果实翻译成杯中的结构。</p></header>
    <CraftStepDeck steps={STEPS} heading="红 · 白 · 起泡 · 贵腐 · 冰酒 · 加强酒工艺分流" subheading="A 轨看科学剖面，B 轨看酒庄现场；切换步骤比较果皮接触、温度、气泡与糖分保存。" accentHex="#6E1D2C"/>
    <header className="grape-subhead"><small>OAK TEXTURE & TOAST LAB</small><h3>法国桶 vs 美国桶 vs 大桶 · 烘烤度实验室</h3></header>
    <div className="grape-oak-lab"><nav>{barrels.map((x)=><button key={x.id} className={oak===x.id?"on":""} onClick={()=>setOak(x.id)}><b>{x.name}</b><span>{x.specBadge}</span></button>)}</nav>{activeOak&&<article><EditorialDrinkPhoto src={assetUrl(activeOak.photoUrl??"")} alt={activeOak.name} aspectRatio="16/9" fallbackKind="craft-workshop" badge="桶材与纹理"/><div><small>{activeOak.englishName}</small><h3>{activeOak.name}</h3><b>{activeOak.specBadge}</b><p>{activeOak.physicalMechanism}</p><p>{activeOak.flavorOrAromaImpact}</p><div>{activeOak.bestForStyles.map((x)=><span key={x}>{x}</span>)}</div></div></article>}</div>
    <header className="grape-subhead"><small>CRYSTAL FLUID DYNAMICS</small><h3>六大杯型与醒酒器流体学陈列柜</h3></header>
    <div className="grape-glass-cabinet"><nav>{glasses.map((x)=><button key={x.id} className={glass===x.id?"on":""} onClick={()=>setGlass(x.id)}><Stemware kind={x.id}/><span>{x.name}</span></button>)}</nav>{activeGlass&&<article><div className="grape-glass-portrait"><Stemware kind={activeGlass.id}/></div><EditorialDrinkPhoto src={assetUrl(activeGlass.photoUrl??"")} alt={activeGlass.name} aspectRatio="4/3" fit="contain" fallbackKind="wine-decanter"/><div><small>{activeGlass.englishName}</small><h3>{activeGlass.name}</h3><b>{activeGlass.specBadge}</b><p>{activeGlass.physicalMechanism}</p><p>{activeGlass.flavorOrAromaImpact}</p><strong>适合 · {activeGlass.bestForStyles.join(" / ")}</strong></div></article>}</div>
  </section>;
}
