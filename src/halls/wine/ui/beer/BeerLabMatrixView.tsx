import { useMemo, useState } from "react";
import type { BeerMonograph, WineCompendiumBundle } from "../../types";

interface Props {
  bundle: WineCompendiumBundle;
  onSelectBeer: (id: string) => void;
}

function balanceRatio(beer: BeerMonograph) {
  const gravity = Number(beer.originalGravityPlato.match(/1\.(\d+)/)?.[1] ?? beer.abvNum * 8);
  return (beer.ibu / Math.max(gravity, 1)).toFixed(2);
}
const shortName = (title: string) => title.split(/[·\s]/).filter(Boolean).slice(0, 2).join(" ").slice(0, 12);
const balancePosition = (beer: BeerMonograph) => Math.max(4, Math.min(96, Number(balanceRatio(beer)) * 65));

export function BeerLabMatrixView({ bundle, onSelectBeer }: Props) {
  const [selectedSrm, setSelectedSrm] = useState<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const matches = useMemo(() => selectedSrm === null ? bundle.beerMonographs : bundle.beerMonographs.filter((b) => Math.abs(b.srm - selectedSrm) <= 3), [bundle.beerMonographs, selectedSrm]);
  const active = bundle.beerMonographs.find((b) => b.id === hovered);
  return (
    <section className="beer-space beer-lab">
      <header className="beer-section-head">
        <span>BACKLIT SRM · IBU / ABV LAB</span><h2>色苦仪 · 从稻草金到帝国黑</h2>
        <p>点亮一枚 SRM 玻璃片，观察麦芽焙燥如何改变透光色；再把苦度投进酒精度坐标，读懂苦甜张力。</p>
      </header>
      <div className="srm-ruler" role="list" aria-label="SRM 色阶">
        {bundle.beerSrmScale.map((swatch) => (
          <button key={swatch.srm} className={selectedSrm === swatch.srm ? "on" : ""} onClick={() => setSelectedSrm(selectedSrm === swatch.srm ? null : swatch.srm)} style={{ "--srm": swatch.hex } as React.CSSProperties}>
            <i /><strong>{swatch.srm}</strong><span>{swatch.name}</span>
          </button>
        ))}
      </div>
      {selectedSrm !== null && (() => {
        const swatch = bundle.beerSrmScale.find((s) => s.srm === selectedSrm)!;
        return <aside className="srm-explanation"><b>SRM {swatch.srm} · {swatch.name}</b><p>{swatch.maltKilningNote}</p><span>{swatch.exampleStyles.join(" · ")} / 馆藏匹配 {matches.length} 款</span></aside>;
      })()}
      <div className="beer-scatter-wrap">
        <svg className="beer-scatter" viewBox="0 0 760 430" role="img" aria-label="啤酒 ABV 与 IBU 二维散点图">
          <rect x="70" y="30" width="330" height="170" className="quad quad--crisp" />
          <rect x="400" y="30" width="330" height="170" className="quad quad--hop" />
          <rect x="70" y="200" width="330" height="180" className="quad quad--malt" />
          <rect x="400" y="200" width="330" height="180" className="quad quad--imperial" />
          <text className="quadrant-watermark" x="90" y="55">清爽解渴区</text><text className="quadrant-watermark" x="570" y="55">酒花果香苦爽区</text>
          <text className="quadrant-watermark" x="90" y="360">麦芽甜醇区</text><text className="quadrant-watermark" x="535" y="360">重烘焙浓稠帝国区</text>
          {[0, 20, 40, 60, 80, 100].map((v) => <g key={v}><line x1="70" x2="730" y1={380 - v * 3.5} y2={380 - v * 3.5} /><text x="42" y={385 - v * 3.5}>{v}</text></g>)}
          {[3, 5, 7, 9, 11, 13].map((v) => <g key={v}><line y1="30" y2="380" x1={70 + (v - 3) * 60} x2={70 + (v - 3) * 60} /><text x={63 + (v - 3) * 60} y="406">{v}%</text></g>)}
          <text className="axis-title" x="360" y="426">ABV 酒精度 %</text>
          <text className="axis-title" transform="rotate(-90 16 240)" x="16" y="240">IBU 国际苦度</text>
          {matches.map((beer) => {
            const x = 70 + Math.max(0, Math.min(11, beer.abvNum - 3)) * 60;
            const y = 380 - Math.min(100, beer.ibu) * 3.5;
            return <g key={beer.id} tabIndex={0} onMouseEnter={() => setHovered(beer.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(beer.id)} onClick={() => onSelectBeer(beer.id)}><circle cx={x} cy={y} r={hovered === beer.id ? 11 : 7} fill={beer.srmColorHex} stroke="#fff" strokeWidth="2"><title>{beer.title}</title></circle>{(hovered === beer.id || beer.tapNumber.endsWith("01") || beer.tapNumber.endsWith("06") || beer.tapNumber.endsWith("10")) && <text className="node-label" x={x + 10} y={y - 9}>{shortName(beer.title)}</text>}</g>;
          })}
        </svg>
        <aside className="beer-lab-readout">
          <small>LIVE BALANCE READOUT</small>
          {active ? <><h3>{active.title}</h3><div className="lab-balance"><b>苦甜天平</b><div><i style={{ left: `${balancePosition(active)}%` }} /></div><p><span>偏麦芽甜润</span><span>黄金平衡</span><span>锐利干苦</span></p></div><p>{active.abv} × {active.ibu} IBU · SRM {active.srm}</p><small>把苦度除以可发酵麦汁强度后视觉化；越靠右，酒花苦味越主导，越靠左则麦芽甜润更明显。</small><button onClick={() => onSelectBeer(active.id)}>接入 {active.tapNumber}</button></> : <><h3>悬停一枚酒液星点</h3><p>这里把专业 BU:GU 换成苦甜天平：左边圆润麦甜，中间平衡，右边锐利干苦。</p></>}
        </aside>
      </div>
    </section>
  );
}
