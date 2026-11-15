import { useMemo, useState } from "react";
import { CraftStepDeck, type CraftStepItem } from "../../../core/CraftStepDeck";
import { EditorialDrinkPhoto } from "../../../core/EditorialDrinkPhoto";
import type { CoffeeCompendiumBundle } from "../types";

export function CoffeeBotanyAndProcessView({ bundle, onSelectBean }: { bundle: CoffeeCompendiumBundle; onSelectBean: (id: string) => void }) {
  const [processId, setProcessId] = useState(bundle.processes[0]?.id ?? "");
  const process = bundle.processes.find((item) => item.id === processId) ?? bundle.processes[0];
  const layers = ["Skin 果皮", "Pulp 果肉", "Mucilage 果胶", "Parchment 羊皮纸", "Silver-skin Green Bean 银皮生豆"];
  const retained = new Set(process?.retainedFruitLayers ?? []);
  const steps = useMemo<CraftStepItem[]>(() => bundle.processes.map((item, index) => ({
    stepNo: index + 1, id: item.id, title: item.name, subtitle: item.englishName,
    plainAction: item.mucilageHandling, scienceNote: item.fermentationMechanism,
    flavorImpact: item.flavorSignature, keyMetrics: [item.typicalDays ?? "依批次监测", item.cupClarityVsFunk],
    diagramKind: "coffee-cherry-five-layers",
    photoUrl: `/photos/craft-coffee-proc-${item.id}.jpg`,
    photoCaption: `${item.name} · 生豆后制现场`,
  })), [bundle.processes]);
  if (!process) return null;
  return <div className="coffee-volume">
    <header className="coffee-title"><span>VOLUME I · GENETICS & POST-HARVEST</span><h1>树种基因与后制处理科学</h1><p>从染色体、品种迁徙到果胶发酵，把杯中风味还原为可读的植物学。</p></header>
    <section><div className="coffee-sec-head"><div><span className="coffee-sec-kicker">SPECIES COMPARATOR</span><h2>三大商业物种</h2></div></div>
      <div className="coffee-species-grid">{bundle.species.map((item) => <article className="coffee-sheet" key={item.id}><EditorialDrinkPhoto src={`/photos/craft-coffee-species-${item.id}.jpg`} alt={item.name} aspectRatio="16/9" badge={item.chromosomes} fallbackKind="coffee-cherry" /><small>{item.latinName}</small><h3>{item.name}</h3><b>{item.chromosomes}</b><dl><dt>海拔</dt><dd>{item.elevationBand}</dd><dt>咖啡因</dt><dd>{item.caffeinePct}</dd><dt>全球份额</dt><dd>{item.globalSharePct}%</dd></dl><p>{item.flavorCharacter}</p></article>)}</div>
    </section>
    <section><div className="coffee-sec-head"><div><span className="coffee-sec-kicker">GENEALOGY GRID</span><h2>十款传奇品种血统</h2></div></div>
      <div className="coffee-card-grid">{bundle.varietals.map((item) => { const repBean = bundle.beans.find((b) => item.representativeBeanIds.includes(b.id)); return <article className="coffee-sheet" key={item.id}>{repBean?.photoUrl && <EditorialDrinkPhoto src={repBean.photoUrl} alt={item.name} aspectRatio="16/9" badge={item.englishName} caption={`代表豆 · ${repBean.title}`} fallbackKind="coffee-cherry" />}<small>{item.lineageGroup}</small><h3>{item.name} <i>{item.englishName}</i></h3><p>{item.geneticOrigin}</p><div className="coffee-tags">{item.signatureNotes.map((n) => <span key={n}>{n}</span>)}</div><p>{item.storySummary}</p>{item.representativeBeanIds.map((id) => <button className="coffee-link" key={id} onClick={() => onSelectBean(id)}>查看代表豆 ↗</button>)}</article>; })}</div>
    </section>
    <section><div className="coffee-sec-head"><div><span className="coffee-sec-kicker">CHERRY CUTAWAY</span><h2>咖啡樱桃五层 × 八大处理法</h2></div></div>
      <div className="coffee-process-tabs">{bundle.processes.map((item) => <button className={`coffee-proc-tab ${item.id === process.id ? "active" : ""}`} key={item.id} onClick={() => setProcessId(item.id)}><strong>{item.name}</strong><small>{item.englishName}</small></button>)}</div>
      <div className="coffee-cutaway-layout"><svg viewBox="0 0 560 300" className="coffee-cutaway" role="img" aria-label="咖啡樱桃五层剖面">{layers.map((layer, index) => { const active = retained.size === 0 || [...retained].some((x) => layer.toLowerCase().includes(x.toLowerCase()) || x.toLowerCase().includes(layer.split(" ")[0].toLowerCase())); return <g key={layer}><ellipse cx="190" cy="150" rx={150-index*25} ry={115-index*18} fill={active ? process.accentHex : "#ddd2c3"} opacity={.92-index*.08} stroke="#2b1911" strokeWidth="2"/><text x="370" y={58+index*46} fill={active ? "#2b1911" : "#9b8a7c"}>{layer}</text><line x1={190+(150-index*25)} y1={95+index*20} x2="355" y2={54+index*46} stroke="#6d5549"/></g>})}</svg>
        <article className="coffee-sheet"><h3>{process.name} · {process.englishName}</h3><p>{process.mucilageHandling}</p><p>{process.fermentationMechanism}</p>{[["清晰度",process.clarityScore],["发酵张力",process.fermentationFunkScore],["甜感",process.sweetnessScore]].map(([label,value]) => <div className="coffee-meter" key={String(label)}><span>{label}</span><i><b style={{width:`${Number(value ?? 5)*10}%`,background:process.accentHex}} /></i></div>)}</article>
      </div>
      <CraftStepDeck className="coffee-craft-deck" steps={steps} initialStepId={process.id} heading="后制处理工艺台" subheading="切换步骤，比较果胶、发酵与干燥如何改变风味。" accentHex={process.accentHex}/>
    </section>
  </div>;
}
