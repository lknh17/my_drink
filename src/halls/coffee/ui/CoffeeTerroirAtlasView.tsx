import { useState } from "react";
import { EditorialDrinkPhoto } from "../../../core/EditorialDrinkPhoto";
import { WorldTerroirBeltMap } from "../../../core/map/WorldTerroirBeltMap";
import { TerroirMapStage } from "../../../core/map/TerroirMapStage";
import type { CoffeeBeltZoneId, CoffeeCompendiumBundle } from "../types";

const ZONES: Array<[CoffeeBeltZoneId, string]> = [["east-africa","东非起源带"],["central-south-america","中南美火山竞标带"],["yunnan-asia","中国精品庄园带"],["island-terroir","赤道海岛微域"]];

export function CoffeeTerroirAtlasView({ bundle, selectedOriginId, onSelectOrigin, onSelectBean }: { bundle: CoffeeCompendiumBundle; selectedOriginId: string | null; onSelectOrigin: (id: string | null) => void; onSelectBean: (id: string) => void }) {
  const [zone, setZone] = useState<CoffeeBeltZoneId | "all">("all");
  const visible = zone === "all" ? bundle.origins : bundle.origins.filter((item) => item.zone === zone);
  const china = bundle.origins.filter((item) => item.isChinaTerroir && item.coord);
  const selected = bundle.origins.find((item) => item.id === selectedOriginId);
  return <div className="coffee-volume">
    <header className="coffee-title"><span>VOLUME II · COFFEE BELT ATLAS</span><h1>全球咖啡带与中国庄园风土</h1><p>25°N–30°S 的热带高地，以及正在重写精品咖啡叙事的云南微域。</p></header>
    <section><div className="coffee-filterbar"><button className={zone==="all"?"active":""} onClick={()=>setZone("all")}>全部产区</button>{ZONES.map(([id,label])=><button className={zone===id?"active":""} key={id} onClick={()=>setZone(id)}>{label}</button>)}</div>
      <WorldTerroirBeltMap className="coffee-world-map" title="全球精品咖啡带" subtitle="点击坐标读取庄园档案" markers={visible.filter(o=>o.coord).map(o=>({id:o.id,label:o.name,subLabel:o.elevationRange,coord:o.coord!,colorHex:o.isChinaTerroir?"#B23A2C":"#2C6E63"}))} belts={[{id:"coffee",label:"COFFEE BELT",northLat:25,southLat:-30,colorHex:"#C86D3B",opacity:.13}]} selectedMarkerId={selectedOriginId} onSelectMarker={onSelectOrigin} accentHex="#C86D3B"/>
      <div className="coffee-origin-grid">{visible.map((item)=><article className={`coffee-origin-card ${item.isChinaTerroir?"yunnan":""}`} key={item.id}><EditorialDrinkPhoto src={item.photoUrl} alt={item.name} badge={item.countryOrProvince} caption={`${item.elevationRange} · ${item.harvestMonths}`} fallbackKind="coffee-cherry"/><h3>{item.name}</h3><div className="coffee-origin-meta"><span>{item.latitudeBand}</span><span>{item.harvestMonths}</span></div><p>{item.soilAndMicroclimate ?? item.flavorProfile}</p><div className="coffee-tags">{item.dominantVarietals.map(v=><span key={v}>{v}</span>)}</div>{item.representativeBeanIds?.map(id=><button className="coffee-link" key={id} onClick={()=>onSelectBean(id)}>代表庄园豆 ↗</button>)}</article>)}</div>
    </section>
    <section><div className="coffee-sec-head"><div><span className="coffee-sec-kicker">CHINA TERROIR SANDBOX</span><h2>中国咖啡风土沙盘</h2></div></div>
      <TerroirMapStage markers={china.map(o=>({id:o.id,kind:"estate",title:o.name,subtitle:o.soilAndMicroclimate,badge:o.countryOrProvince,elevation:o.elevationRange,coord:o.coord!,defaultZoom:o.defaultZoom,colorHex:"#B23A2C"}))} selectedMarkerId={china.some(o=>o.id===selectedOriginId)?selectedOriginId:null} onSelectMarker={onSelectOrigin} center={selected?.coord ?? [101.3,24.5]} zoom={selected?.defaultZoom ?? 5.6} defaultBasemap="topo" title="中国咖啡风土沙盘" subtitle="云南 · 海南 · 台湾庄园地形与卫星双读" height={620} renderOverlayCard={(marker)=>{const item=china.find(o=>o.id===marker.id); return item?<article className="coffee-map-dossier"><h3>{item.name}</h3><b>{item.elevationRange}</b><p>{item.soilAndMicroclimate}</p><p>{item.processingTradition}</p></article>:null;}}/>
    </section>
  </div>;
}
