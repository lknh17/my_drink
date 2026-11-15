import { useMemo, useState } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { grapeWineToFootprint, useDrinkFootprints } from "../../../../core/drinkFootprints";
import { assetUrl } from "../../../../lib/assetUrl";
import type { GrapeVarietalMeta, GrapeWineSpecimen, GrapeWineStyleType } from "../../types";

export interface GrapeMonographReaderProps {
  wines: GrapeWineSpecimen[];
  varietals: GrapeVarietalMeta[];
  selectedWineId: string | null;
  onSelectWine: (id: string) => void;
}
const WORLD = { all:"全部", "old-world":"旧世界", "new-world":"新世界", "china-terroir":"中国精品酒庄" } as const;
const STYLE: Record<GrapeWineStyleType,string> = { red:"红",white:"白",sparkling:"起泡","sweet-fortified":"甜加强" };
const STRUCTURE = { tannin:"单宁",acidity:"酸度",body:"酒体",sweetness:"甜度",oak:"橡木桶" };

export function GrapeMonographReader({ wines, varietals, selectedWineId, onSelectWine }: GrapeMonographReaderProps) {
  const [world,setWorld]=useState<keyof typeof WORLD>("all");
  const [style,setStyle]=useState<GrapeWineStyleType|"all">("all");
  const [varietal,setVarietal]=useState("all");
  const [passport,setPassport]=useState<"all"|"tasted"|"wish">("all");
  const [query,setQuery]=useState("");
  const footprints=useDrinkFootprints();
  const filtered=useMemo(()=>wines.filter((wine)=>
    (world==="all"||wine.worldGroup===world)&&(style==="all"||wine.styleType===style)&&
    (varietal==="all"||wine.varietalId===varietal)&&(passport==="all"||(passport==="tasted"?footprints.isTasted(wine.id):footprints.isWishlisted(wine.id)))&&
    (!query||`${wine.title}${wine.originAppellation}${wine.grapeVarietals}${wine.aromaNotes.join("")}`.toLowerCase().includes(query.toLowerCase()))
  ),[wines,world,style,varietal,passport,query,footprints.tastedIds,footprints.wishlistIds]);
  const active=wines.find((x)=>x.id===selectedWineId)??filtered[0]??wines[0];
  if(!active) return null;
  const fp=grapeWineToFootprint(active);
  return <section className="grape-volume grape-monograph-volume">
    <header className="grape-volume-head"><small>VOLUME III · ESTATE LABEL FOLIO</small><h2>卷三 · 名庄本纪</h2><p>三十二张酒标不是排名，而是三十二个理解品种、地块、分级和侍酒窗口的入口。</p></header>
    <div className="grape-cellar-reader">
      <aside className="grape-cellar-index">
        <small>WINE CELLAR INDEX · {filtered.length}</small><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="搜索酒庄 / 产区 / 香气" />
        <div className="grape-mini-tabs">{Object.entries(WORLD).map(([id,label])=><button key={id} className={world===id?"on":""} onClick={()=>setWorld(id as keyof typeof WORLD)}>{label}</button>)}</div>
        <div className="grape-mini-tabs"><button className={style==="all"?"on":""} onClick={()=>setStyle("all")}>全酒型</button>{Object.entries(STYLE).map(([id,label])=><button key={id} className={style===id?"on":""} onClick={()=>setStyle(id as GrapeWineStyleType)}>{label}</button>)}</div>
        <select value={varietal} onChange={(e)=>setVarietal(e.target.value)}><option value="all">十二品种 · 全部</option>{varietals.map((x)=><option key={x.id} value={x.id}>{x.name} · {x.englishName}</option>)}</select>
        <div className="grape-mini-tabs"><button className={passport==="all"?"on":""} onClick={()=>setPassport("all")}>全部</button><button className={passport==="tasted"?"on":""} onClick={()=>setPassport("tasted")}>✓ 喝过</button><button className={passport==="wish"?"on":""} onClick={()=>setPassport("wish")}>☆ 想喝</button></div>
        <nav>{filtered.map((wine)=><button key={wine.id} className={wine.id===active.id?"on":""} onClick={()=>onSelectWine(wine.id)}><i style={{background:wine.liquorColorHex}}/><span>{wine.title}<small>{wine.country} · {wine.classificationBadge}</small></span></button>)}</nav>
      </aside>
      <article className="grape-label-folio">
        <header><div><small>{active.worldGroup?.toUpperCase()} · {active.classificationBadge}</small><h2>{active.title}</h2><p>{active.originAppellation} · {active.grapeVarietals}</p></div><span className="grape-classification-badge">{active.classificationBadge}</span></header>
        <div className="grape-folio-hero">
          <EditorialDrinkPhoto src={assetUrl(active.photoUrl??"")} alt={active.title} aspectRatio="3/4" badge="庄园酒标实拍" fallbackKind="bottle" />
          <div className="grape-rim-panel"><div className="grape-rim-ring" style={{"--wine":active.liquorColorHex} as React.CSSProperties}><i/></div><small>WINE RIM COLOR</small><h3>{active.rimColorNote??"宝石红 / 金黄边缘"}</h3><p>倾斜酒杯观察核心与边缘：紫红提示年轻，石榴与砖红标记演化；白酒从柠檬绿走向金黄与琥珀。</p><b>适饮窗口 · {active.drinkingWindow}</b></div>
        </div>
        <blockquote>{active.tagline}</blockquote>
        <div className="grape-structure">{Object.entries(active.structureBars).map(([key,value])=><div key={key}><span>{STRUCTURE[key as keyof typeof STRUCTURE]}</span><i><b style={{width:`${value}%`}}/></i><em>{value}</em></div>)}</div>
        <div className="grape-service-grid"><section><small>VINEYARD & CELLAR</small><h3>风土与酿造</h3><p>{active.climateAndSoil}</p><p>{active.vinificationAndOak}</p></section><section><small>SOMMELIER SERVICE</small><h3>杯型与醒酒</h3><p>{active.sommelierService.glass} · {active.sommelierService.tempCelsius}</p><p>{active.sommelierService.decant}</p></section></div>
        <div className="grape-pairings"><section><small>WESTERN TABLE</small><h3>西餐配伍</h3><p>{active.sommelierService.pairings.join(" · ")}</p></section><section><small>CHINESE TABLE</small><h3>中餐配伍</h3><p>{active.chineseFoodPairings?.join(" · ")}</p></section></div>
        <div className="grape-aroma-chips">{active.aromaNotes.map((x)=><span key={x}>{x}</span>)}</div><p className="grape-estate-essay">{active.essay}</p>
        <div className="grape-passport"><button className={footprints.isTasted(active.id)?"on":""} onClick={()=>footprints.toggleTasted(fp)}>✓ 喝过</button><button className={footprints.isWishlisted(active.id)?"on":""} onClick={()=>footprints.toggleWishlist(fp)}>☆ 想喝</button><textarea value={footprints.getNote(active.id)} onChange={(e)=>footprints.updateNote(active.id,e.target.value,fp)} placeholder="写下年份、开瓶时间、香气变化与配餐笔记…" /></div>
      </article>
    </div>
  </section>;
}
