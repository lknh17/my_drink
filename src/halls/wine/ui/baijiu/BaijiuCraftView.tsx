import { useState } from "react";
import { CraftStepDeck, type CraftStepItem } from "../../../../core/CraftStepDeck";
import type { CraftDiagramKind } from "../../../../core/CraftSvgDiagrams";
import { assetUrl } from "../../../../lib/assetUrl";
import type { WineCompendiumBundle } from "../../types";

const FERMENTERS = [
  ["百年老泥窖", "浓香", "泥壁连续续糟，己酸菌群代际富集"],
  ["紫红泥条石窖", "酱 / 特香", "条石控湿，窖底泥参与复合生香"],
  ["陶制地缸", "清 / 老白干", "缸体隔土，清洁发酵抑制杂味"],
  ["荆条麻纸大酒海", "凤香陈藏", "荆条骨架、麻纸猪血涂层微氧熟化"],
];

export function BaijiuCraftView({ bundle }: { bundle: WineCompendiumBundle }) {
  const [cutIndex, setCutIndex] = useState(0);
  const cut = bundle.baijiuDistillationCuts[cutIndex];
  const diagrams: CraftDiagramKind[] = ["baijiu-qu-gradient", "baijiu-qu-gradient", "baijiu-qu-gradient", "baijiu-four-pits", "baijiu-zengtong-still", "baijiu-zengtong-still", "baijiu-four-pits"];
  const steps: CraftStepItem[] = bundle.baijiuCraftStages.map((item, index) => ({
    stepNo: item.stepNo, id: item.id, title: item.title, subtitle: item.subtitle,
    plainAction: item.subtitle, scienceNote: item.scientificPrinciple, flavorImpact: item.aromaDivergenceNote,
    keyMetrics: item.keyMetrics.split("；"), diagramKind: diagrams[index],
    photoUrl: assetUrl(`/photos/craft-baijiu-step${index + 1}.jpg`),
    photoCaption: `白酒固态酿造第 ${index + 1} 步 · ${item.title}`,
  }));
  return (
    <div className="baijiu-view">
      <header className="baijiu-volume-heading"><span>卷四</span><div><h2>固态蒸馏七步匠艺</h2><p>粮、曲、窖、甑、摘、藏、勾，将微生物时间转化为澄澈酒体。</p></div></header>
      <CraftStepDeck steps={steps} heading="白酒固态酿造七步科学长卷" subheading="每一步并看设备剖面、工坊实拍与杯中风味后果。" accentHex="#A62121" className="baijiu-craft-deck" />
      <section className="baijiu-fermenters"><header><h2>四种发酵容器解剖</h2><p>容器并非包装，而是香型微生物生态的边界条件。</p></header><div>{FERMENTERS.map(([name, aroma, note], i) => <article key={name}><div className={`fermenter-shape f${i}`}><span /></div><small>{aroma}</small><h3>{name}</h3><p>{note}</p></article>)}</div></section>
      <section className="baijiu-cuts-lab">
        <div className="baijiu-distillation-visual"><div className="baijiu-foam-bowl" style={{ "--foam-scale": `${1.35 - cutIndex * .13}`, "--foam-life": `${2.8 - cutIndex * .25}s` } as React.CSSProperties}><div>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div><span>{cut?.beadName}</span></div><DistillationCurve activeIndex={cutIndex} count={bundle.baijiuDistillationCuts.length} /></div>
        <div className="baijiu-cut-controls"><span className="baijiu-kicker">交互式 · 看花摘酒轮次模拟器</span><h2>{cut?.cutName ?? "摘酒轮次"}</h2><input aria-label="摘酒轮次" type="range" min={0} max={Math.max(0, bundle.baijiuDistillationCuts.length - 1)} value={cutIndex} onChange={(e) => setCutIndex(Number(e.target.value))} /><div className="cut-labels">{bundle.baijiuDistillationCuts.map((c, i) => <button key={c.id} className={i === cutIndex ? "active" : ""} onClick={() => setCutIndex(i)}>{c.cutName}</button>)}</div>{cut && <dl><div><dt>酒度</dt><dd>{cut.abvRange}</dd></div><div><dt>酒花</dt><dd>{cut.beadSizeAndDuration}</dd></div><div><dt>酯酸</dt><dd>{cut.esterAlcoholNote}</dd></div><div><dt>勾调</dt><dd>{cut.usageInBlend}</dd></div></dl>}</div>
      </section>
    </div>
  );
}

function DistillationCurve({ activeIndex, count }: { activeIndex: number; count: number }) {
  const x = 56 + (activeIndex / Math.max(1, count - 1)) * 468;
  return <figure className="baijiu-distillation-curve"><svg viewBox="0 0 580 230" role="img" aria-label="蒸馏过程中酒精度下降、主体酯先升后降、酸度后段上升曲线"><path className="grid" d="M56 20V190H548M56 62H548M56 104H548M56 146H548" /><path className="abv" d="M56 35C180 48 310 91 548 174" /><path className="ester" d="M56 148C145 42 275 48 548 157" /><path className="acid" d="M56 177C310 176 410 143 548 58" /><line className="cursor" x1={x} x2={x} y1="20" y2="190" /><text x="66" y="32">酒精度</text><text x="240" y="50">主体酯峰值</text><text x="472" y="52">酸度</text><text x="56" y="214">酒头</text><text x="278" y="214">酒心</text><text x="510" y="214">酒尾</text></svg><figcaption>馏出时间 → 酒度、酯香与酸度动态</figcaption></figure>;
}
