import { useState } from "react";
import { WorldTerroirBeltMap } from "../../../../core/map/WorldTerroirBeltMap";
import { TerroirMapStage } from "../../../../core/map/TerroirMapStage";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { assetUrl } from "../../../../lib/assetUrl";
import type { GrapeWineRegionSpec, GrapeWineSpecimen } from "../../types";

export interface GrapeTerroirAndClassificationViewProps {
  regions: GrapeWineRegionSpec[];
  wines: GrapeWineSpecimen[];
  onSelectWine: (id: string) => void;
}

const SYSTEMS = [
  { id:"old", title:"旧世界 · 地名先于品种", badge:"AOC/AOP · DOCG · Prädikatswein", text:"法国把法定边界、品种与产量写入 AOP；勃艮第分的是葡萄园地块，波尔多 1855 分的是酒庄。意大利 DOCG 强调法定产区，德国 Prädikatswein 以采收成熟度构成传统阶梯。" },
  { id:"new", title:"新世界 · 品种与酒庄先行", badge:"AVA · GI · DO", text:"美国、澳洲、新西兰与智利多以地理边界保护来源，酒标更直接标示品种和酒庄；酿造自由度较高，微气候、克隆和酒庄风格成为核心叙事。" },
  { id:"china", title:"中国 · 极端风土新坐标", badge:"地理标志 · 酒庄分级探索", text:"贺兰山冲积扇、香格里拉高山峡谷、蓬莱海岸与天山戈壁没有照搬单一欧洲范式，而在埋土、灌溉、高海拔与海洋气候中建立自己的地块语言。" },
];

export function GrapeTerroirAndClassificationView({ regions, wines, onSelectWine }: GrapeTerroirAndClassificationViewProps) {
  const [system, setSystem] = useState("old");
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0]?.id);
  const china = regions.filter((x) => x.worldGroup === "china-terroir");
  const selectedRegion = regions.find((x) => x.id === selectedRegionId) ?? regions[0];
  const activeSystem = SYSTEMS.find((x) => x.id === system)!;
  return <section className="grape-volume grape-terroir-volume">
    <header className="grape-volume-head"><small>VOLUME II · TERROIR & CLASSIFICATION</small><h2>卷二 · 风土与分级</h2><p>同一条 30°–50° 葡萄黄金带上，旧世界用法定地名累积历史，新世界用酒庄与品种书写自由，中国则用极端地貌提出新答案。</p></header>
    <div className="grape-system-tabs">{SYSTEMS.map((x) => <button key={x.id} className={system === x.id ? "on" : ""} onClick={() => setSystem(x.id)}><b>{x.title}</b><span>{x.badge}</span></button>)}</div>
    <article className="grape-classification-note"><small>CLASSIFICATION READER</small><h3>{activeSystem.badge}</h3><p>{activeSystem.text}</p></article>
    <WorldTerroirBeltMap
      markers={regions.filter((x) => x.worldGroup !== "china-terroir").map((x) => ({ id:x.id,label:x.name.replace(/法国|意大利|西班牙|德国|匈牙利|美国|澳洲|新西兰|智利/g,""),subLabel:x.classificationSystem,coord:x.coord }))}
      selectedMarkerId={selectedRegionId}
      onSelectMarker={setSelectedRegionId}
      belts={[{id:"north",label:"北半球葡萄酒带",northLat:50,southLat:30,colorHex:"#6E1D2C",opacity:.11},{id:"south",label:"南半球葡萄酒带",northLat:-30,southLat:-50,colorHex:"#4A6141",opacity:.11}]}
      title="世界 30°–50° 葡萄黄金带" subtitle="点击坐标阅读分级、土壤与代表酒款。" accentHex="#6E1D2C"
    />
    {selectedRegion && <article className="grape-region-readout"><div><small>{selectedRegion.latitudeLabel} · {selectedRegion.country}</small><h3>{selectedRegion.name}</h3><b>{selectedRegion.classificationSystem}</b><p>{selectedRegion.climateAndSoil}</p><p>{selectedRegion.terroirSummary}</p></div><div>{selectedRegion.representativeWineIds.map((id) => { const wine=wines.find((x)=>x.id===id); return wine && <button key={id} onClick={()=>onSelectWine(id)}>{wine.title}<span>打开名庄本纪 →</span></button>; })}</div></article>}
    <header className="grape-subhead"><small>CHINA FOUR TERROIRS</small><h3>中国四大精品葡萄酒风土区</h3></header>
    <TerroirMapStage markers={china.map((x) => ({id:x.id,kind:"estate",title:x.name.replace("中国",""),subtitle:x.climateAndSoil,badge:x.classificationSystem,coord:x.coord,defaultZoom:6.3,colorHex:"#6E1D2C"}))} selectedMarkerId={china.some((x)=>x.id===selectedRegionId) ? selectedRegionId : null} onSelectMarker={setSelectedRegionId} center={[105,35]} zoom={3.7} title="贺兰山 · 香格里拉 · 蓬莱 · 天山" subtitle="等高地形与卫星地貌双读" height={500} />
    <div className="grape-china-regions">{china.map((item) => <article key={item.id} className={item.id === selectedRegionId ? "on" : ""} onClick={() => setSelectedRegionId(item.id)}>
      <EditorialDrinkPhoto src={assetUrl(item.photoUrl ?? "")} alt={item.name} aspectRatio="16/9" fallbackKind="craft-workshop" />
      <small>{item.latitudeLabel} · {item.classificationSystem}</small><h3>{item.name}</h3><p>{item.climateAndSoil}</p>
      <div>{item.representativeWineIds.map((id) => { const wine=wines.find((x)=>x.id===id); return wine && <button key={id} onClick={(e)=>{e.stopPropagation();onSelectWine(id);}}>{wine.title}</button>; })}</div>
    </article>)}</div>
  </section>;
}
