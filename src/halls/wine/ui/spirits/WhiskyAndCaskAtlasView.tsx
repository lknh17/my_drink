import { useState, type CSSProperties } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import type { SpiritCaskTypeSpec, WhiskyRegionSpec, WorldSpiritSpecimen } from "../../types";

interface Props { regions: WhiskyRegionSpec[]; casks: SpiritCaskTypeSpec[]; specimens: WorldSpiritSpecimen[]; onSelect: (id:string) => void }
export function WhiskyAndCaskAtlasView({ regions, casks, specimens, onSelect }: Props) {
  const [regionId,setRegionId]=useState(regions[0]?.id ?? "");
  const [caskId,setCaskId]=useState(casks[0]?.id ?? "");
  const region=regions.find(x=>x.id===regionId) ?? regions[0];
  const cask=casks.find(x=>x.id===caskId) ?? casks[0];
  const whiskies=specimens.filter(x=>x.category==="single-malt-whisky");
  if(!region || !cask) return null;
  return <section className="spirit-volume">
    <header><span className="spirit-kicker">VOLUME II · WHISKY & OAK</span><h2>卷二 · 威士忌产区与橡木桶实验室</h2><p>九片气候版图与六种橡木桶前世，解释泥煤、发酵与木材如何重排同一杯麦芽酒。</p></header>
    <div className="region-layout"><nav className="region-list">{regions.map(x=><button key={x.id} className={x.id===region.id?"on":""} onClick={()=>setRegionId(x.id)}><small>{x.country}</small><strong>{x.name}</strong></button>)}</nav><article className="cellar-card"><small>{region.peatProfile}</small><h3>{region.name}</h3><p>{region.summary}</p><b>{region.styleSignature}</b><div className="spirit-pills">{region.signatureDistilleries.map(x=><button key={x}>{x}</button>)}</div></article></div>
    <div className="cask-lab"><div><span className="spirit-kicker">CASK SEASONING MATRIX</span><h3>橡木桶前世染色与风味实验室</h3><div className="spirit-pills">{casks.map(x=><button key={x.id} className={x.id===cask.id?"on":""} onClick={()=>setCaskId(x.id)}>{x.name}</button>)}</div><article className="cellar-card"><small>{cask.woodSpecies} · {cask.toastOrCharLevel}</small><h3>{cask.englishName}</h3><p>前世：{cask.previousLiquid}</p><p>{cask.vanillinAndTanninNote}</p><b>{cask.signatureFlavors.join(" · ")}</b><div className="bottle-grid">{specimens.filter(x=>x.caskTypeIds?.includes(cask.id)).map(x=><button key={x.id} onClick={()=>onSelect(x.id)}><EditorialDrinkPhoto src={x.photoUrl} alt={x.title} aspectRatio="3/4" fit="contain" fallbackKind="bottle"/><strong>{x.title}</strong><span>{x.caskAndAging}</span></button>)}</div></article></div><div className="cask-glass"><div className="tasting-glass" style={{"--liquor":cask.colorTintHex} as CSSProperties}><i /></div><p>{cask.colorLabel} · {cask.colorTintHex}</p></div></div>
    <div><span className="spirit-kicker">PEAT × SHERRY</span><h3>泥煤度 × 雪莉桶浓郁度二维散点图</h3><div className="scatter"><span className="y">泥煤烟熏度 ↑</span><span className="x">雪莉桶脂香度 →</span>{whiskies.map(x=>{const richness=x.radar.caskRichness; return <button key={x.id} onClick={()=>onSelect(x.id)} style={{left:`${Math.max(4,Math.min(96,richness))}%`,bottom:`${Math.max(3,Math.min(96,x.radar.peatOrSmoke))}%`,"--dot":x.liquorColorHex} as CSSProperties}><i />{x.title.split(" ")[0]}</button>})}</div></div>
  </section>
}
