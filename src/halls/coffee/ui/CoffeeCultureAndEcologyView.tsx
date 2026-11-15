import { useState } from "react";
import { EditorialDrinkPhoto } from "../../../core/EditorialDrinkPhoto";
import type { CoffeeCompendiumBundle } from "../types";

export function CoffeeCultureAndEcologyView({bundle}:{bundle:CoffeeCompendiumBundle}) {
  const [waveId,setWaveId]=useState(bundle.waves[0]?.id??""); const [china,setChina]=useState(false);
  const wave=bundle.waves.find(w=>w.id===waveId)??bundle.waves[0]; const cities=bundle.cityEcologies.filter(c=>Boolean(c.isChinaFocus)===china);
  return <div className="coffee-volume"><header className="coffee-title"><span>VOLUME VI · WAVES & URBAN ECOLOGY</span><h1>全球浪潮与馆店生态文化志</h1><p>从也门修道院、启蒙沙龙到庄园直贸和林下荫栽，咖啡是一套持续演进的城市与农业生态。</p></header>
    <section><div className="coffee-sec-head"><div><span className="coffee-sec-kicker">MILLENNIUM TIMELINE</span><h2>千年传播与四次浪潮</h2></div></div><div className="coffee-wave-line">{bundle.waves.map((w,i)=><button className={wave?.id===w.id?"active":""} key={w.id} onClick={()=>setWaveId(w.id)}><b>{String(i+1).padStart(2,"0")}</b><span>{w.years}</span><strong>{w.waveLabel}</strong></button>)}</div>{wave&&<article className="coffee-wave-feature"><small>{wave.years} · {wave.waveLabel}</small><h2>{wave.title}</h2><p>{wave.summary}</p><dl><dt>豆与烘焙</dt><dd>{wave.roastAndBeanStyle}</dd><dt>核心哲学</dt><dd>{wave.philosophyCore}</dd></dl><div className="coffee-tags">{wave.representativeIcons.map(x=><span key={x}>{x}</span>)}</div></article>}</section>
    <section><div className="coffee-sec-head"><div><span className="coffee-sec-kicker">CITY ECOLOGY ATLAS</span><h2>世界与中国咖啡城市</h2></div></div><div className="coffee-filterbar"><button className={!china?"active":""} onClick={()=>setChina(false)}>全球传奇咖啡之城</button><button className={china?"active":""} onClick={()=>setChina(true)}>中国咖啡生态专题</button></div><div className="coffee-city-grid">{cities.map(city=><article className="coffee-city-card" key={city.id}><EditorialDrinkPhoto src={city.photoUrl} alt={city.cityOrRegion} aspectRatio="16/9" badge={city.country} caption={city.kicker} fallbackKind="craft-workshop"/><div><small>{city.kicker}</small><h3>{city.cityOrRegion}</h3><p>{city.summary}</p><blockquote><b>标志仪式</b>{city.signatureDrinkOrRitual}</blockquote><p><b>空间生态：</b>{city.cafeSpaceCulture}</p></div></article>)}</div></section>
  </div>;
}
