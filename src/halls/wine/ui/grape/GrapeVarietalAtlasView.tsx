import { useMemo, useState } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { assetUrl } from "../../../../lib/assetUrl";
import type { GrapeVarietalMeta, GrapeWineSpecimen } from "../../types";

export interface GrapeVarietalAtlasViewProps {
  varietals: GrapeVarietalMeta[];
  wines: GrapeWineSpecimen[];
  onSelectWine: (id: string) => void;
}

export function GrapeVarietalAtlasView({ varietals, wines, onSelectWine }: GrapeVarietalAtlasViewProps) {
  const [color, setColor] = useState<"red" | "white">("red");
  const visible = varietals.filter((item) => item.colorType === color);
  const [selectedId, setSelectedId] = useState<GrapeVarietalMeta["id"] | undefined>(visible[0]?.id);
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0];
  const matching = useMemo(
    () => selected ? wines.filter((wine) => wine.varietalId === selected.id) : [],
    [selected, wines],
  );

  return <section className="grape-volume grape-varietal-volume">
    <header className="grape-volume-head"><small>VOLUME I · AMPELOGRAPHY</small><h2>卷一 · 十二品种谱</h2><p>把果皮厚度、单宁与天然酸度放回同一张坐标图；点击每颗葡萄，展开它在全球与中国酒窖中的全部馆藏。</p></header>
    <div className="grape-segment" role="group" aria-label="葡萄颜色">
      <button className={color === "red" ? "on" : ""} onClick={() => { setColor("red"); setSelectedId(varietals.find((x) => x.colorType === "red")?.id); }}>红葡萄 · 7</button>
      <button className={color === "white" ? "on" : ""} onClick={() => { setColor("white"); setSelectedId(varietals.find((x) => x.colorType === "white")?.id); }}>白葡萄 · 5</button>
    </div>
    <div className="grape-scatter-layout">
      <svg className="grape-scatter" viewBox="0 0 760 480" role="img" aria-label="果皮厚度与天然酸度二维品种矩阵">
        <rect x="72" y="28" width="650" height="380" rx="4" />
        {[0,25,50,75,100].map((n) => <g key={n}><line x1={72+n*6.5} x2={72+n*6.5} y1="28" y2="408" /><line x1="72" x2="722" y1={408-n*3.8} y2={408-n*3.8} /><text x={72+n*6.5} y="432" textAnchor="middle">{n}</text><text x="58" y={412-n*3.8} textAnchor="end">{n}</text></g>)}
        <text x="397" y="468" textAnchor="middle" className="axis-title">果皮厚度与单宁 · SKIN / TANNIN</text>
        <text transform="translate(18 220) rotate(-90)" textAnchor="middle" className="axis-title">天然酸度与芳香张力 · ACID / AROMA</text>
        {visible.map((item) => {
          const x = 72 + item.skinThicknessAndTannin * 6.5;
          const y = 408 - item.naturalAcidityAndAroma * 3.8;
          const active = item.id === selected?.id;
          return <g key={item.id} className={active ? "active" : ""} role="button" tabIndex={0} onClick={() => setSelectedId(item.id)} onKeyDown={(e) => { if (e.key === "Enter") setSelectedId(item.id); }}>
            <circle cx={x} cy={y} r={active ? 18 : 13} fill={item.colorHex} />
            <text x={x + 19} y={y + 4}>{item.name}</text>
          </g>;
        })}
      </svg>
      {selected && <article className="grape-varietal-card" style={{ "--varietal": selected.colorHex } as React.CSSProperties}>
        <small>{selected.originClassic}</small><h3>{selected.name}</h3><em>{selected.englishName}</em>
        <p>{selected.summary}</p>
        <div className="grape-aroma-chips">{selected.signatureAromas.map((x) => <span key={x}>{x}</span>)}</div>
        <dl><div><dt>气候偏好</dt><dd>{selected.climatePreference}</dd></div><div><dt>陈年潜力</dt><dd>{selected.agingPotential}</dd></div><div><dt>酒体指数</dt><dd>{selected.bodyScore} / 100</dd></div></dl>
        {selected.id === "marselan" && <aside><b>中国名片 · MARSELAN</b><p>{selected.chinaAdaptationNote}</p><p>小粒厚皮适应西北干燥日照，颜色深却能保持细腻单宁，正在形成区别于法国南部的中国表达。</p></aside>}
      </article>}
    </div>
    <section className="grape-matched-cellar"><header><small>FULL MATCHING CELLAR</small><h3>{selected?.name} · 馆藏名酒 {matching.length} 款</h3></header><div>
      {matching.map((wine) => <button key={wine.id} onClick={() => onSelectWine(wine.id)}>
        <EditorialDrinkPhoto src={assetUrl(wine.photoUrl ?? "")} alt={wine.title} aspectRatio="4/3" fallbackKind="bottle" />
        <small>{wine.classificationBadge}</small><strong>{wine.title}</strong><span>{wine.originAppellation}</span>
      </button>)}
    </div></section>
  </section>;
}
