import { useEffect, useMemo, useState } from "react";
import type { TeaMonograph } from "../types";

export interface BrewingRitualWidgetProps {
  tea: TeaMonograph;
  onJumpToWare?: (vesselText: string, tea: TeaMonograph) => void;
}

function describeWaterBoilStage(temp: number): string {
  if (temp <= 82) return "蟹眼初生 · 微沸晾凉护嫩芽";
  if (temp <= 88) return "鱼眼轻沸 · 鲜爽高香不熟汤";
  if (temp <= 94) return "涌泉连珠 · 柔顺激发花果甜香";
  return "滚沸腾波 · 高温激荡岩骨陈韵";
}

function buildFallbackInfusionNote(tea: TeaMonograph, idx: number, total: number): string {
  const aromas = tea.aromaNotes.length > 0 ? tea.aromaNotes : ["清雅茶香", "内质醇香"];
  const firstAroma = aromas[0];
  const midAromas = aromas.slice(0, 2).join("与");
  const tailAroma = aromas[aromas.length - 1];

  if (idx === 0) {
    return `【头泡 · 醒叶扬香】沸水初润干茶，表层高挥发性芳香物质率先释出，杯盖与汤面${firstAroma}清锐初绽，入口鲜灵探路。`;
  }
  if (idx === 1) {
    return `【二泡 · 茶魂初盛】叶片舒展过半，茶多酚、氨基酸与糖类协调浸出，${midAromas}饱满馥郁，汤感厚度陡升。`;
  }
  if (idx === 2) {
    return `【三泡 · 鼎盛肉骨】内质释放达黄金峰值，山场风土气韵与喉底回甘全面铺开，汤色最是明艳透亮，宜细啜慢品。`;
  }
  if (idx < total - 1) {
    return `【第${idx + 1}泡 · 醇和转甜】刺激收敛感渐褪，果胶质令茶汤愈发绵滑柔润，舌底鸣泉生津，${tailAroma}幽长不散。`;
  }
  return `【第${idx + 1}泡 · 尾水甘露】适当延长时间坐杯静待，深层多糖与木质/毫香尾韵徐徐析出，清甜纯净，余味绕梁。`;
}

export function BrewingRitualWidget({
  tea,
  onJumpToWare,
}: BrewingRitualWidgetProps) {
  const { brewing } = tea;
  const infusions = brewing.infusionsSec.length > 0 ? brewing.infusionsSec : [8, 10, 15, 22, 30, 45];

  const [activeSteepIdx, setActiveSteepIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(() => (infusions[0] ?? 10) * 1000);
  const [timerFinished, setTimerFinished] = useState(false);

  // Reset steep selection and timer when switching to a different tea
  useEffect(() => {
    const firstSec = tea.brewing.infusionsSec[0] ?? 10;
    setActiveSteepIdx(0);
    setTimerRunning(false);
    setTimerFinished(false);
    setRemainingMs(firstSec * 1000);
  }, [tea.id, tea.brewing.infusionsSec]);

  const targetSec = infusions[activeSteepIdx] ?? 10;
  const targetMs = Math.max(1000, targetSec * 1000);

  // Live 100ms countdown tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= 100) {
          setTimerRunning(false);
          setTimerFinished(true);
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  function selectSteep(idx: number) {
    const sec = infusions[idx] ?? 10;
    setActiveSteepIdx(idx);
    setTimerRunning(false);
    setTimerFinished(false);
    setRemainingMs(sec * 1000);
  }

  function handleStartPause() {
    if (timerFinished || remainingMs <= 0) {
      setTimerFinished(false);
      setRemainingMs(targetMs);
      setTimerRunning(true);
      return;
    }
    setTimerRunning((prev) => !prev);
  }

  function handleResetTimer() {
    setTimerRunning(false);
    setTimerFinished(false);
    setRemainingMs(targetMs);
  }

  const maxSec = useMemo(() => Math.max(...infusions, 15), [infusions]);
  const ratioValue = Math.max(1, Math.round(brewing.waterMl / Math.max(0.5, brewing.leafGrams)));

  const currentSteepNote =
    brewing.perInfusionNotes?.[activeSteepIdx] ??
    buildFallbackInfusionNote(tea, activeSteepIdx, infusions.length);

  const progressPct = Math.min(100, Math.max(0, ((targetMs - remainingMs) / targetMs) * 100));

  return (
    <section
      className="tea-brewing-widget"
      aria-label="行家司茶冲泡实验卡"
      data-testid="brewing-ritual-widget"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
        <div>
          <span className="tea-fishtail">〖 行家司茶实验席 〗</span>
          <h3 style={{ fontSize: "1.15rem", marginTop: "0.35rem" }}>
            器水温时 · 《{tea.title}》标准审评与工夫冲泡法
          </h3>
        </div>
        <span className="zw-search-badge" style={{ borderColor: "#35685F", color: "#35685F" }}>
          支持 {infusions.length}+ 道连续冲泡 · 内置逐泡实测读秒器
        </span>
      </div>

      {/* 4 Key Brewing Parameters */}
      <div className="tea-brew-params-grid">
        <button
          type="button"
          className="tea-brew-param-box vessel-link"
          style={{ textAlign: "left" }}
          data-testid="brewing-vessel-jump-btn"
          onClick={() => onJumpToWare?.(brewing.vessel, tea)}
        >
          <span className="tea-spec-label">推荐茶器（点击查阅器道 →）</span>
          <strong className="tea-spec-val" style={{ color: "var(--tea-celadon-deep)" }}>
            🏺 {brewing.vessel}
          </strong>
          <small style={{ fontSize: "0.72rem", color: "var(--tea-celadon)" }}>
            查看胎釉孔隙与聚香配伍原理
          </small>
        </button>

        <div className="tea-brew-param-box">
          <span className="tea-spec-label">黄金投茶水比</span>
          <strong className="tea-spec-val">
            ⚖️ {brewing.leafGrams}g / {brewing.waterMl}ml
          </strong>
          <small style={{ fontSize: "0.72rem", color: "var(--tea-ink-muted)" }}>
            标准茶水比约 1 : {ratioValue}
          </small>
        </div>

        <div className="tea-brew-param-box">
          <span className="tea-spec-label">适宜注水水温</span>
          <strong className="tea-spec-val" style={{ color: brewing.tempCelsius >= 95 ? "var(--tea-cinnabar)" : "var(--tea-celadon-deep)" }}>
            🌡️ {brewing.tempCelsius}℃
          </strong>
          <small style={{ fontSize: "0.72rem", color: "var(--tea-ink-muted)" }}>
            {describeWaterBoilStage(brewing.tempCelsius)}
          </small>
        </div>

        <div className="tea-brew-param-box">
          <span className="tea-spec-label">执壶注水手法</span>
          <strong className="tea-spec-val" style={{ fontSize: "0.86rem" }}>
            💧 {brewing.pouringTechnique}
          </strong>
          <small style={{ fontSize: "0.72rem", color: "var(--tea-ink-muted)" }}>
            循水流缓急调控浸出速率
          </small>
        </div>
      </div>

      {/* Interactive 1-N Infusions Steep Curve + Live Steep Timer */}
      <div className="tea-steep-curve-stage">
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
            <strong style={{ fontSize: "0.86rem", fontFamily: "var(--font-serif)" }}>
              1–{infusions.length} 泡逐道出汤秒数曲线（点击任一泡切换风味解析与读秒）
            </strong>
            <span style={{ fontSize: "0.74rem", color: "var(--tea-ink-muted)" }}>
              当前选中：第 {activeSteepIdx + 1} 泡（{targetSec} 秒）
            </span>
          </div>

          <div className="tea-steep-bars" role="group" aria-label="逐泡出汤曲线">
            {infusions.map((sec, idx) => {
              const barHeightPx = Math.max(22, Math.round((sec / maxSec) * 102));
              const isSelected = idx === activeSteepIdx;
              return (
                <button
                  key={`steep-${idx}`}
                  type="button"
                  className={`tea-steep-col${isSelected ? " active" : ""}`}
                  data-testid={`steep-step-${idx + 1}`}
                  onClick={() => selectSteep(idx)}
                >
                  <span className="tea-steep-sec-lbl">{sec}s</span>
                  <span
                    className="tea-steep-bar-pillar"
                    style={{ height: `${barHeightPx}px` }}
                  />
                  <span className="tea-steep-num-lbl">第{idx + 1}泡</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Steep Flavor Evolution + Live Countdown Timer */}
        <div className="tea-steep-timer-card" data-testid="steep-timer-panel">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="zw-search-badge" style={{ borderColor: "var(--tea-amber)", color: "var(--tea-amber)" }}>
                第 {activeSteepIdx + 1} 泡风味演变
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.15rem", fontWeight: 700, color: timerFinished ? "var(--tea-cinnabar)" : "var(--tea-ink)" }}>
                {(remainingMs / 1000).toFixed(1)}s / {targetSec}s
              </span>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--tea-ink-secondary)", lineHeight: 1.58 }}>
              {currentSteepNote}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            <div className="tea-timer-progress-track">
              <div
                className="tea-timer-progress-fill"
                style={{ width: `${progressPct.toFixed(1)}%` }}
              />
            </div>

            {timerFinished && (
              <div style={{ fontSize: "0.78rem", color: "var(--tea-cinnabar)", fontWeight: 600 }}>
                ✓ 第 {activeSteepIdx + 1} 泡已达黄金出汤点，请即刻出汤沥干叶底！
              </div>
            )}

            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="zw-pill-btn primary"
                style={{ flex: 1, justifyContent: "center", padding: "0.38rem 0.7rem" }}
                data-testid="steep-timer-toggle-btn"
                onClick={handleStartPause}
              >
                {timerRunning
                  ? "⏸ 暂停读秒"
                  : timerFinished
                    ? `↻ 重泡第 ${activeSteepIdx + 1} 泡`
                    : `▶ 开始第 ${activeSteepIdx + 1} 泡计时 (${targetSec}s)`}
              </button>

              <button
                type="button"
                className="zw-pill-btn"
                style={{ padding: "0.38rem 0.65rem" }}
                onClick={handleResetTimer}
              >
                重置
              </button>

              {activeSteepIdx < infusions.length - 1 && (
                <button
                  type="button"
                  className="zw-pill-btn"
                  style={{ padding: "0.38rem 0.65rem" }}
                  onClick={() => selectSteep(activeSteepIdx + 1)}
                >
                  下一泡 →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Tea Master Brewing Guidance */}
      <div className="tea-dossier-box" style={{ background: "rgba(252, 251, 247, 0.85)" }}>
        <h5>司茶总诀 · 冲泡要领</h5>
        <p>{brewing.infusionNotes}</p>
      </div>
    </section>
  );
}
