import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { assetUrl } from "../../../../lib/assetUrl";
import type { BaijiuAromaId, WineCompendiumBundle } from "../../types";

export function BaijiuAromaTreeView({
  bundle,
  selectedAroma,
  onSelectAroma,
  onSelectBaijiu,
}: {
  bundle: WineCompendiumBundle;
  selectedAroma: BaijiuAromaId | "all";
  onSelectAroma: (id: BaijiuAromaId | "all") => void;
  onSelectBaijiu: (id: string) => void;
}) {
  const active = bundle.baijiuAromas.find((item) => item.id === selectedAroma) ?? bundle.baijiuAromas[0];
  const visibleMonographs = selectedAroma === "all"
    ? bundle.baijiuMonographs
    : bundle.baijiuMonographs.filter((item) => item.aroma === selectedAroma);
  const foundations = bundle.baijiuAromas.filter((item) => item.group === "four-foundational");
  const derived = bundle.baijiuAromas.filter((item) => item.group === "eight-derived");
  const aromaMap = new Map(bundle.baijiuAromas.map((item) => [item.id, item]));

  return (
    <div className="baijiu-view">
      <header className="baijiu-volume-heading"><span>卷一</span><div><h2>十二香型宗谱裂变树</h2><p>从四大基础香型到八大工艺衍生，追踪曲、窖与主体分子的交叉遗传。</p></div></header>
      <section className="baijiu-genealogy">
        <button className={`baijiu-all-aromas${selectedAroma === "all" ? " active" : ""}`} onClick={() => onSelectAroma("all")}>全部香型总览 · 60 款</button>
        <div className="baijiu-tree-row foundations">
          {foundations.map((node) => <AromaNode key={node.id} node={node} active={selectedAroma === node.id} onClick={() => onSelectAroma(node.id)} />)}
        </div>
        <svg className="baijiu-tree-lines" viewBox="0 0 1000 105" preserveAspectRatio="none" aria-hidden="true">
          {derived.map((node, i) => {
            const x = 62.5 + i * 125;
            return node.parentAromas.map((parent, j) => {
              const parentIndex = foundations.findIndex((n) => n.id === parent);
              const px = 125 + Math.max(0, parentIndex) * 250;
              return <path key={`${node.id}-${j}`} d={`M${px} 0 C${px} 50 ${x} 45 ${x} 105`} />;
            });
          })}
        </svg>
        <div className="baijiu-tree-row derived">
          {derived.map((node) => <AromaNode key={node.id} node={node} active={selectedAroma === node.id} onClick={() => onSelectAroma(node.id)} />)}
        </div>
      </section>

      {active && (
        <section className="baijiu-comparator">
          <div className="baijiu-thermometer">
            <span className="mercury" style={{ height: `${Math.min(100, (active.quPeakTempCelsius / 70) * 100)}%` }} />
            <strong>{active.quPeakTempCelsius}℃</strong><small>制曲顶温</small>
          </div>
          <div className="baijiu-comparator-copy">
            <span className="baijiu-kicker">{active.name} · {active.establishedYear}</span>
            <h3>{active.representativeBrand}</h3>
            <p>{active.sensorySignature}</p>
            <dl>
              <div><dt>曲</dt><dd>{active.quDetail}</dd></div>
              <div><dt>窖</dt><dd>{active.pitStructure} · {active.fermentationDays}</dd></div>
              <div><dt>馏</dt><dd>{active.distillationRule}</dd></div>
            </dl>
          </div>
          <div className="baijiu-molecule-panel">
            <h4>气相色谱主体分子</h4>
            <div className="baijiu-tag-row">{active.coreMolecules.map((m) => <span key={m}>{m}</span>)}</div>
            <h4>宴席配伍</h4><p>{active.pairingCuisines.join(" · ")}</p>
            <div className="baijiu-representatives">
              {active.representativeIds.map((id) => {
                const item = bundle.baijiuMonographs.find((m) => m.id === id);
                return item ? <button key={id} onClick={() => onSelectBaijiu(id)}>{item.title}</button> : null;
              })}
            </div>
          </div>
        </section>
      )}

      <section className="baijiu-collection-wall">
        <header><div><span className="baijiu-kicker">馆藏全量索引 · 点击进入本纪</span><h3>{selectedAroma === "all" ? "全部香型" : active.name} · 馆藏名酒全集（共 {visibleMonographs.length} 款）</h3></div></header>
        <div>
          {visibleMonographs.map((item) => (
            <button key={item.id} onClick={() => onSelectBaijiu(item.id)}>
              <EditorialDrinkPhoto src={assetUrl(item.photoUrl ?? "")} alt={item.title} aspectRatio="3/4" fit="contain" accentHex={aromaMap.get(item.aroma)?.colorHex} badge={item.abvOptions} fallbackKind="bottle" />
              <span className="baijiu-card-copy">
                <small>{item.originCore}</small><strong>{item.title}</strong>
                {item.nationalHonorTag && <em>{item.nationalHonorTag}</em>}
                <span>{item.tagline}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="baijiu-scatter">
        <header><h3>酯香张力 × 窖陈醇厚度</h3><button onClick={() => onSelectAroma("all")}>显示全部</button></header>
        <div className="baijiu-scatter-plot">
          <div className="scatter-zone z-bl"><b>清雅净爽域</b><span>低酯香 · 轻窖陈</span></div>
          <div className="scatter-zone z-br"><b>绵柔喷香域</b><span>高酯香 · 轻窖陈</span></div>
          <div className="scatter-zone z-tl"><b>醇厚陈敛域</b><span>低酯香 · 深窖陈</span></div>
          <div className="scatter-zone z-tr"><b>重器陈酿域</b><span>高酯香 · 深窖陈</span></div>
          <span className="axis-y">窖陈醇厚度</span><span className="axis-x">酯香张力 →</span>
          {[60, 70, 80, 90, 100].map((tick) => <span key={`x-${tick}`} className="scatter-tick tick-x" style={{ left: `${6 + ((tick - 56) / 44) * 88}%` }}>{tick}</span>)}
          {[60, 70, 80, 90, 100].map((tick) => <span key={`y-${tick}`} className="scatter-tick tick-y" style={{ bottom: `${8 + ((tick - 50) / 50) * 84}%` }}>{tick}</span>)}
          {bundle.baijiuMonographs.map((item) => {
            const dimmed = selectedAroma !== "all" && item.aroma !== selectedAroma;
            const x = Math.max(6, Math.min(94, 6 + ((item.aromaIntensityScore - 56) / 44) * 88));
            const y = Math.max(8, Math.min(92, 8 + ((item.cellarBodyScore - 50) / 50) * 84));
            const benchmark = ["bj-feitian-maotai", "bj-wuliangye-puwu", "bj-fenjiu-qinghua30", "bj-xifeng-hongxifeng", "bj-dongjiu-baicaoxiang", "bj-jiugui-neican", "bj-hengshui-1915", "bj-guilin-sanhua"].includes(item.id);
            return <button key={item.id} className={`${dimmed ? "dimmed " : ""}${x > 75 ? "flip " : ""}${benchmark ? "benchmark" : ""}`} title={`${item.title} · ${item.aromaIntensityScore}/${item.cellarBodyScore}`} style={{ left: `${x}%`, bottom: `${y}%`, background: aromaMap.get(item.aroma)?.colorHex }} onClick={() => onSelectBaijiu(item.id)}><span>{item.title}</span>{benchmark && <i>{item.title.split(" · ")[0]}</i>}</button>;
          })}
        </div>
      </section>
    </div>
  );
}

function AromaNode({ node, active, onClick }: { node: WineCompendiumBundle["baijiuAromas"][number]; active: boolean; onClick: () => void }) {
  return <button className={`baijiu-aroma-node${active ? " active" : ""}`} style={{ "--aroma": node.colorHex } as React.CSSProperties} onClick={onClick}><strong>{node.name}</strong><span>{node.quType}</span><small>{node.keyEsterOrCompound}</small></button>;
}
