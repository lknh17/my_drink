import { useEffect, useState, type CSSProperties } from "react";
import { CraftSvgDiagram, type CraftDiagramKind } from "./CraftSvgDiagrams";
import { EditorialDrinkPhoto } from "./EditorialDrinkPhoto";

export interface CraftStepItem {
  stepNo: string | number;
  id: string;
  title: string;
  subtitle: string;
  plainAction: string;
  scienceNote: string;
  flavorImpact: string;
  keyMetrics: string[];
  diagramKind?: CraftDiagramKind;
  photoUrl?: string;
  photoCaption?: string;
}

export interface CraftStepDeckProps {
  steps: CraftStepItem[];
  heading: string;
  subheading?: string;
  accentHex?: string;
  initialStepId?: string;
  className?: string;
}

export function CraftStepDeck({
  steps,
  heading,
  subheading,
  accentHex = "#35685F",
  initialStepId,
  className = "",
}: CraftStepDeckProps) {
  const [activeId, setActiveId] = useState(initialStepId ?? steps[0]?.id ?? "");
  useEffect(() => {
    if (!steps.some((step) => step.id === activeId)) {
      setActiveId(initialStepId ?? steps[0]?.id ?? "");
    }
  }, [steps, activeId, initialStepId]);
  const active = steps.find((step) => step.id === activeId) ?? steps[0];

  if (!active) return null;
  return (
    <section
      className={`zw-craft-deck ${className}`.trim()}
      style={{ "--craft-accent": accentHex } as CSSProperties}
    >
      <header className="zw-craft-deck-heading">
        <span>双轨图文科普工坊 · CRAFT SCIENCE ATLAS</span>
        <h2>{heading}</h2>
        {subheading && <p>{subheading}</p>}
      </header>
      <nav className="zw-craft-timeline" aria-label={`${heading}步骤`}>
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={step.id === active.id ? "active" : ""}
            onClick={() => setActiveId(step.id)}
            aria-current={step.id === active.id ? "step" : undefined}
          >
            <b>{String(step.stepNo || index + 1).padStart(2, "0")}</b>
            <span>{step.title}<small>{step.subtitle}</small></span>
          </button>
        ))}
      </nav>
      <div className="zw-craft-visual-track">
        <div>
          {active.diagramKind ? (
            <CraftSvgDiagram kind={active.diagramKind} accentHex={accentHex} title={active.title} />
          ) : (
            <CraftSvgDiagram kind="beer-hot-cold-brewing" accentHex={accentHex} title={active.title} />
          )}
          <span className="zw-craft-track-label">A · 科学剖面图</span>
        </div>
        <div>
          <EditorialDrinkPhoto
            src={active.photoUrl}
            alt={`${active.title}工序实拍`}
            aspectRatio="16/9"
            accentHex={accentHex}
            badge="工序实拍"
            caption={active.photoCaption ?? `${active.title} · 现场工艺观察`}
            fallbackKind="craft-workshop"
          />
          <span className="zw-craft-track-label">B · 工坊现场</span>
        </div>
      </div>
      <div className="zw-craft-explain-grid">
        <article><small>01 · 工匠怎么操作</small><h3>先看手上动作</h3><p>{active.plainAction}</p></article>
        <article><small>02 · 内部发生什么</small><h3>再看物理与生化</h3><p>{active.scienceNote}</p></article>
        <article><small>03 · 如何决定风味</small><h3>最后回到杯中</h3><p>{active.flavorImpact}</p></article>
      </div>
      <div className="zw-craft-metrics" aria-label="关键工艺指标">
        <strong>关键工艺窗口</strong>
        {active.keyMetrics.map((metric) => <span key={metric}>{metric}</span>)}
      </div>
    </section>
  );
}
