import { useEffect, useMemo, useRef, useState } from "react";
import type { HallId } from "../../core/types";
import { useDrinkFootprints, wineSpecimenToFootprint } from "../../core/drinkFootprints";
import { wineBlueprint } from "./content";
import type {
  BaijiuAromaId,
  WinePillarId,
  WinePreviewSpecimen,
  WineStructureRadar,
} from "./types";
import "./wine.css";

export interface WinePreviewHallProps {
  selectedSpecimenId?: string | null;
  onSelectSpecimen?: (specimenId: string | null) => void;
  onNavigateHall: (hall: HallId) => void;
  onOpenSearch: () => void;
  onOpenPassport: () => void;
}

const RADAR_AXES: { key: keyof WineStructureRadar; label: string }[] = [
  { key: "body", label: "酒体醇厚" },
  { key: "aromaIntensity", label: "香气张力" },
  { key: "sweetnessOrMalt", label: "甘润麦芽" },
  { key: "tanninOrPeat", label: "单宁/泥煤" },
  { key: "finishLength", label: "余韵绵长" },
];

const PILLAR_LABELS: Record<WinePillarId, string> = {
  fermented: "酿造酒",
  distilled: "蒸馏酒",
  cocktails: "配制与调酒",
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function buildWedgePath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
): string {
  const p1 = polarToCartesian(cx, cy, outerR, startDeg);
  const p2 = polarToCartesian(cx, cy, outerR, endDeg);
  const p3 = polarToCartesian(cx, cy, innerR, endDeg);
  const p4 = polarToCartesian(cx, cy, innerR, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function WineRadarChart({ radar }: { radar: WineStructureRadar }) {
  const cx = 110;
  const cy = 104;
  const maxR = 68;

  const polygonPoints = RADAR_AXES.map((axis, idx) => {
    const angle = (360 / RADAR_AXES.length) * idx;
    const val = Math.max(0, Math.min(100, radar[axis.key]));
    const pt = polarToCartesian(cx, cy, (val / 100) * maxR, angle);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg className="wine-radar-svg" viewBox="0 0 220 205" role="img" aria-label="五维酒体结构雷达图">
      {[0.33, 0.66, 1].map((scale) => {
        const ringPts = RADAR_AXES.map((_, idx) => {
          const pt = polarToCartesian(cx, cy, maxR * scale, (360 / RADAR_AXES.length) * idx);
          return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        }).join(" ");
        return (
          <polygon
            key={scale}
            points={ringPts}
            fill="none"
            stroke="rgba(212, 148, 58, 0.22)"
            strokeWidth="1"
          />
        );
      })}

      {RADAR_AXES.map((axis, idx) => {
        const angle = (360 / RADAR_AXES.length) * idx;
        const edge = polarToCartesian(cx, cy, maxR, angle);
        const labelPt = polarToCartesian(cx, cy, maxR + 21, angle);
        return (
          <g key={axis.key}>
            <line
              x1={cx}
              y1={cy}
              x2={edge.x}
              y2={edge.y}
              stroke="rgba(212, 148, 58, 0.24)"
              strokeDasharray="2 2"
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#D8C7B4"
              fontSize="10.5"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      <polygon
        points={polygonPoints}
        fill="rgba(212, 148, 58, 0.28)"
        stroke="#EBB35E"
        strokeWidth="2"
      />

      {RADAR_AXES.map((axis, idx) => {
        const angle = (360 / RADAR_AXES.length) * idx;
        const val = radar[axis.key];
        const pt = polarToCartesian(cx, cy, (val / 100) * maxR, angle);
        return <circle key={axis.key} cx={pt.x} cy={pt.y} r="3.5" fill="#F8E7C8" stroke="#7A2332" strokeWidth="1.2" />;
      })}
    </svg>
  );
}

export function WinePreviewHall({
  selectedSpecimenId,
  onSelectSpecimen,
  onNavigateHall,
  onOpenSearch,
  onOpenPassport,
}: WinePreviewHallProps) {
  const { countsByHall, wishlistCountsByHall, isTasted, isWishlisted, toggleTasted, toggleWishlist } =
    useDrinkFootprints();

  const [pillarFilter, setPillarFilter] = useState<WinePillarId | "all">("all");
  const [activeAromaId, setActiveAromaId] = useState<BaijiuAromaId>("jiangxiang");
  const [activeWhiskyId, setActiveWhiskyId] = useState<string>("lagavulin-16");
  const [internalSpecimenId, setInternalSpecimenId] = useState<string>(
    selectedSpecimenId || wineBlueprint.specimens[0].id,
  );

  const dossierRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedSpecimenId) {
      const matched = wineBlueprint.specimens.find((s) => s.id === selectedSpecimenId);
      if (matched) {
        setInternalSpecimenId(matched.id);
        if (matched.baijiuAroma) {
          setActiveAromaId(matched.baijiuAroma);
        }
      }
    }
  }, [selectedSpecimenId]);

  const activeSpecimen: WinePreviewSpecimen = useMemo(() => {
    const targetId = selectedSpecimenId || internalSpecimenId;
    return (
      wineBlueprint.specimens.find((s) => s.id === targetId) ?? wineBlueprint.specimens[0]
    );
  }, [selectedSpecimenId, internalSpecimenId]);

  const filteredSpecimens = useMemo(() => {
    if (pillarFilter === "all") return wineBlueprint.specimens;
    return wineBlueprint.specimens.filter((s) => s.pillar === pillarFilter);
  }, [pillarFilter]);

  const activeAroma = useMemo(
    () =>
      wineBlueprint.baijiuAromas.find((a) => a.id === activeAromaId) ??
      wineBlueprint.baijiuAromas[0],
    [activeAromaId],
  );

  const matchingBaijiuSpecimen = useMemo(
    () => wineBlueprint.specimens.find((s) => s.baijiuAroma === activeAroma.id) ?? null,
    [activeAroma],
  );

  const whiskyPoints = wineBlueprint.whiskyMatrix ?? [];
  const activeWhisky = useMemo(
    () => whiskyPoints.find((w) => w.id === activeWhiskyId) ?? whiskyPoints[0],
    [whiskyPoints, activeWhiskyId],
  );

  function handleChooseSpecimen(id: string, scrollIntoDossier = false) {
    setInternalSpecimenId(id);
    onSelectSpecimen?.(id);
    if (scrollIntoDossier && dossierRef.current) {
      dossierRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeFootprint = wineSpecimenToFootprint(activeSpecimen);
  const activeIsTasted = isTasted(activeSpecimen.id);
  const activeIsWished = isWishlisted(activeSpecimen.id);

  return (
    <div className="wine-hall" data-testid="wine-preview-hall">
      {/* Glowing Dark Cellar Topbar */}
      <header className="wine-topbar">
        <div className="zw-topbar-brand">
          <span className="wine-seal">醺典</span>
          <div>
            <span className="zw-topbar-kicker" style={{ color: "#D4943A" }}>
              XUNDIAN · CELLAR OF SPIRITS, WINE &amp; MIXOLOGY
            </span>
            <span className="zw-topbar-title" style={{ color: "#FAF1E4" }}>
              醺典 · 中外酒馆 — 暗夜酒窖与风味陈酿预览席位
            </span>
          </div>
        </div>

        <div className="zw-topbar-actions">
          <button
            type="button"
            className="wine-nav-pill"
            data-testid="wine-back-portal"
            onClick={() => onNavigateHall("portal")}
          >
            ← 酌味总门户
          </button>
          <button
            type="button"
            className="wine-nav-pill"
            onClick={() => onNavigateHall("tea")}
          >
            🍵 茗典茶馆
          </button>
          <button
            type="button"
            className="wine-nav-pill"
            onClick={() => onNavigateHall("coffee")}
          >
            ☕ 咖典咖啡馆
          </button>
          <button
            type="button"
            className="wine-nav-pill"
            onClick={onOpenSearch}
          >
            🔍 全局检索 <span className="zw-kbd">⌘K</span>
          </button>
          <button
            type="button"
            className="wine-nav-pill passport"
            onClick={onOpenPassport}
          >
            📜 品饮护照 · 已品 {countsByHall.total}
            {wishlistCountsByHall.total > 0 ? ` · 想喝 ${wishlistCountsByHall.total}` : ""}
          </button>
        </div>
      </header>

      <main className="wine-container">
        {/* Subterranean Hero Vault */}
        <section className="wine-hero" aria-label="醺典酒馆总纲">
          <div>
            <div className="wine-status-ribbon">
              <span className="wine-status-dot" />
              ARCHITECTURAL PREVIEW · 第二座大楼 · 二期领域契约已就绪
            </div>
            <h1 className="wine-hero-title">
              暗夜酒窖 · <span>琥珀流金与曲火分馏</span>
            </h1>
            <p className="wine-hero-lead">
              酒的宇宙由「糖化发酵菌群 × 蒸馏提纯物理 × 橡木陶坛微氧陈藏 × 侍酒温区杯型」共同铸就。
              本馆以黑曜石酒窖与威士忌琥珀金构筑二期架构蓝图，贯通中国固态十二香型白酒、绍兴冬酿黄酒、旧世界风土葡萄酒、海岛泥煤威士忌与古典鸡尾酒平衡术。
            </p>

            <div className="wine-hero-metrics">
              <div className="wine-metric-tile">
                <strong>3 大支柱</strong>
                <span>酿造 · 蒸馏 · 调酒</span>
              </div>
              <div className="wine-metric-tile">
                <strong>{wineBlueprint.baijiuAromas.length} 种香型</strong>
                <span>曲药 × 窖池 × 酯分子谱</span>
              </div>
              <div className="wine-metric-tile">
                <strong>{whiskyPoints.length} 维星标</strong>
                <span>威士忌泥煤 × 橡木桶坐标</span>
              </div>
              <div className="wine-metric-tile">
                <strong>{wineBlueprint.specimens.length} 款样板</strong>
                <span>已入酒馆护照 {countsByHall.wine} 款</span>
              </div>
            </div>

            <div className="wine-hero-anchors">
              <button
                type="button"
                className="wine-anchor-btn"
                onClick={() => scrollToSection("wine-pillars")}
              >
                三大工艺支柱
              </button>
              <button
                type="button"
                className="wine-anchor-btn"
                onClick={() => scrollToSection("wine-baijiu-wheel")}
              >
                白酒十二香型轮
              </button>
              <button
                type="button"
                className="wine-anchor-btn"
                onClick={() => scrollToSection("wine-whisky-matrix")}
              >
                泥煤×橡木桶星图
              </button>
              <button
                type="button"
                className="wine-anchor-btn"
                onClick={() => scrollToSection("wine-sommelier-dossier")}
              >
                侍酒师典藏酒单
              </button>
            </div>
          </div>

          <div className="wine-hero-emblem" aria-hidden="true">
            <svg width="240" height="205" viewBox="0 0 240 205" fill="none">
              <defs>
                <linearGradient id="copperStill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EBB35E" />
                  <stop offset="55%" stopColor="#B86B43" />
                  <stop offset="100%" stopColor="#6D3820" />
                </linearGradient>
                <linearGradient id="burgundyGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4943A" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#7A2332" stopOpacity="0.92" />
                </linearGradient>
              </defs>
              {/* Pot Still Swan Neck Silhouette */}
              <path
                d="M42 172 C42 138, 62 124, 68 106 C72 90, 66 72, 74 56 C82 38, 108 32, 134 46 L152 58"
                stroke="url(#copperStill)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <ellipse cx="72" cy="148" rx="34" ry="24" fill="rgba(184,107,67,0.18)" stroke="url(#copperStill)" strokeWidth="2.4" />
              <path d="M54 108 H90 L82 82 H62 Z" fill="rgba(212,148,58,0.14)" stroke="url(#copperStill)" strokeWidth="2" />
              {/* Glencairn Tasting Glass */}
              <path
                d="M148 76 H188 L194 114 C196 134, 182 148, 168 148 C154 148, 140 134, 142 114 Z"
                fill="rgba(255,244,225,0.05)"
                stroke="#E8C284"
                strokeWidth="2"
              />
              <path
                d="M144 115 C156 119, 180 119, 192 115 C192 133, 180 145, 168 145 C156 145, 144 133, 144 115 Z"
                fill="url(#burgundyGlow)"
              />
              <path d="M161 148 L156 172 H180 L175 148" stroke="#E8C284" strokeWidth="2" />
              <line x1="26" y1="174" x2="214" y2="174" stroke="rgba(212,148,58,0.38)" strokeWidth="1.5" />
              <circle cx="152" cy="64" r="3" fill="#F3C778" />
              <circle cx="168" cy="96" r="2.2" fill="#F3C778" opacity="0.8" />
            </svg>
            <span className="wine-hero-emblem-caption">
              SOLID-STATE QU · COPPER SWAN-NECK · CASK MATURATION
            </span>
          </div>
        </section>

        {/* 1. Three Pillars Switcher */}
        <section id="wine-pillars" aria-label="中外酒学三大支柱">
          <div className="wine-sec-head">
            <div>
              <span className="wine-sec-kicker">ONTOLOGY PILLARS · 酿造 · 蒸馏 · 调酒三大支柱</span>
              <h2>液态发酵与提纯的三种底层语法</h2>
            </div>
            <div className="wine-pillar-tabs" role="tablist" aria-label="支柱酒单筛选">
              <button
                type="button"
                className={`wine-pillar-tab${pillarFilter === "all" ? " active" : ""}`}
                onClick={() => setPillarFilter("all")}
              >
                全部样板 ({wineBlueprint.specimens.length})
              </button>
              {wineBlueprint.pillars.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`wine-pillar-tab${pillarFilter === p.id ? " active" : ""}`}
                  onClick={() =>
                    setPillarFilter((prev) => (prev === p.id ? "all" : p.id))
                  }
                >
                  {PILLAR_LABELS[p.id]}
                </button>
              ))}
            </div>
          </div>

          <div className="wine-pillar-grid">
            {wineBlueprint.pillars.map((pillar) => {
              const selected = pillarFilter === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  className={`wine-pillar-card${selected ? " selected" : ""}`}
                  style={{ "--pillar-accent": pillar.accentHex } as React.CSSProperties}
                  onClick={() =>
                    setPillarFilter((prev) => (prev === pillar.id ? "all" : pillar.id))
                  }
                >
                  <div className="wine-pillar-top">
                    <span className="wine-pillar-kicker">{pillar.kicker}</span>
                    <span className="wine-abv-pill">{pillar.abvRange}</span>
                  </div>
                  <h3>{pillar.title}</h3>
                  <div className="wine-pillar-craft">{pillar.coreCraft}</div>
                  <p className="wine-pillar-summary">{pillar.summary}</p>
                  <div className="wine-tag-list">
                    {pillar.signatureCategories.map((cat) => (
                      <span key={cat} className="wine-mini-tag">
                        {cat}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Interactive Chinese Baijiu 12-Aroma Wheel */}
        <section id="wine-baijiu-wheel" aria-label="中国白酒十二大香型轮">
          <div className="wine-sec-head">
            <div>
              <span className="wine-sec-kicker">
                CHINESE SOLID-STATE BAIJIU · 十二大香型曲药与酯类图谱
              </span>
              <h2>中国白酒十二香型 · 曲为酒骨 × 窖为酒魂</h2>
            </div>
            <span className="wine-sec-sub">
              点击左侧轮盘扇区或香型铭牌，解析大曲/小曲/麸曲、泥窖/石窖/地缸与核心呈香分子
            </span>
          </div>

          <div className="wine-baijiu-workbench">
            <div className="wine-wheel-panel">
              <div className="wine-wheel-svg-wrap">
                <svg
                  className="wine-wheel-svg"
                  viewBox="0 0 340 340"
                  role="group"
                  aria-label="白酒十二香型交互轮盘"
                >
                  <circle
                    cx="170"
                    cy="170"
                    r="156"
                    fill="rgba(15, 12, 10, 0.7)"
                    stroke="rgba(212, 148, 58, 0.25)"
                  />
                  {wineBlueprint.baijiuAromas.map((aroma, idx) => {
                    const step = 360 / wineBlueprint.baijiuAromas.length;
                    const startDeg = idx * step - step / 2;
                    const endDeg = startDeg + step;
                    const midDeg = idx * step;
                    const isCurrent = aroma.id === activeAroma.id;
                    const pathD = buildWedgePath(
                      170,
                      170,
                      54,
                      isCurrent ? 151 : 144,
                      startDeg + 1.2,
                      endDeg - 1.2,
                    );
                    const lblPos = polarToCartesian(170, 170, 104, midDeg);
                    const shortTitle = aroma.name.replace(/（.*）/, "").replace("香型", "");

                    return (
                      <g
                        key={aroma.id}
                        className="wine-wheel-sector"
                        onClick={() => setActiveAromaId(aroma.id)}
                      >
                        <path
                          d={pathD}
                          fill={
                            isCurrent
                              ? "rgba(212, 148, 58, 0.36)"
                              : idx % 2 === 0
                                ? "rgba(122, 35, 50, 0.24)"
                                : "rgba(44, 34, 28, 0.78)"
                          }
                          stroke={isCurrent ? "#F2C06E" : "rgba(212, 148, 58, 0.28)"}
                          strokeWidth={isCurrent ? "2" : "1"}
                        />
                        <text
                          x={lblPos.x}
                          y={lblPos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isCurrent ? "#FFF8EB" : "#D9C8B6"}
                          fontSize={isCurrent ? "12" : "10.8"}
                          fontWeight={isCurrent ? "700" : "500"}
                        >
                          {shortTitle}
                        </text>
                      </g>
                    );
                  })}
                  <circle
                    cx="170"
                    cy="170"
                    r="48"
                    fill="#161210"
                    stroke="#D4943A"
                    strokeWidth="1.6"
                  />
                  <text
                    x="170"
                    y="163"
                    textAnchor="middle"
                    fill="#EBB35E"
                    fontSize="12"
                    fontWeight="700"
                  >
                    十二香型
                  </text>
                  <text
                    x="170"
                    y="181"
                    textAnchor="middle"
                    fill="#B7A38E"
                    fontSize="9.5"
                  >
                    {activeAroma.name.replace(/（.*）/, "")}
                  </text>
                </svg>
              </div>

              <div className="wine-aroma-chip-grid">
                {wineBlueprint.baijiuAromas.map((aroma) => (
                  <button
                    key={aroma.id}
                    type="button"
                    className={`wine-aroma-chip${aroma.id === activeAroma.id ? " active" : ""}`}
                    data-testid={`baijiu-aroma-${aroma.id}`}
                    onClick={() => setActiveAromaId(aroma.id)}
                  >
                    {aroma.name.replace(/（.*）/, "")}
                  </button>
                ))}
              </div>
            </div>

            <article className="wine-aroma-dossier" aria-live="polite">
              <div className="wine-aroma-head">
                <div>
                  <div className="wine-aroma-title-row">
                    <span
                      className="zw-liquor-ring"
                      style={{ background: activeAroma.colorHex }}
                    />
                    <h3>{activeAroma.name}</h3>
                    <span className="wine-abv-pill">{activeAroma.originRegion}</span>
                  </div>
                  <p style={{ marginTop: "0.4rem", fontSize: "0.86rem", color: "#CAB8A4" }}>
                    代表名酒谱系：{activeAroma.representativeBrand}
                  </p>
                </div>

                {matchingBaijiuSpecimen && (
                  <button
                    type="button"
                    className="wine-anchor-btn"
                    onClick={() => handleChooseSpecimen(matchingBaijiuSpecimen.id, true)}
                  >
                    查阅典藏样板 →
                  </button>
                )}
              </div>

              <div className="wine-aroma-specs-grid">
                <div className="wine-spec-box">
                  <span className="wine-spec-label">QU STARTER · 制曲温度与糖化发酵剂</span>
                  <p>{activeAroma.quType}</p>
                </div>
                <div className="wine-spec-box">
                  <span className="wine-spec-label">VESSEL · 窖池材质与发酵方式</span>
                  <p>{activeAroma.fermentationVessel}</p>
                </div>
                <div className="wine-spec-box full">
                  <span className="wine-spec-label">
                    KEY ESTERS &amp; COMPOUNDS · 主体呈香酯类与标志性风味分子
                  </span>
                  <p>{activeAroma.keyEsterOrCompound}</p>
                </div>
              </div>

              <div className="wine-sensory-quote">
                「国家评酒感官判词：{activeAroma.sensorySignature}」
              </div>
            </article>
          </div>
        </section>

        {/* 3. Whisky Peat x Sherry/Oak 2D Coordinate Scatter Matrix */}
        {whiskyPoints.length > 0 && activeWhisky && (
          <section id="wine-whisky-matrix" aria-label="威士忌泥煤与橡木桶二维星图">
            <div className="wine-sec-head">
              <div>
                <span className="wine-sec-kicker">
                  SINGLE MALT COORDINATES · 泥煤烟熏酚值 × 雪莉/水楢橡木桶矩阵
                </span>
                <h2>单一麦芽威士忌风味二维星图</h2>
              </div>
              <span className="wine-sec-sub">
                横轴：大麦泥煤烘烤强度（Peat） · 纵轴：Oloroso 雪莉桶与水楢木脂香贡献度（Cask）
              </span>
            </div>

            <div className="wine-whisky-workbench">
              <div className="wine-scatter-card">
                <svg
                  className="wine-scatter-svg"
                  viewBox="0 0 620 370"
                  role="img"
                  aria-label="威士忌泥煤与橡木桶散点矩阵"
                >
                  {/* Plot Frame */}
                  <rect
                    x="64"
                    y="24"
                    width="524"
                    height="296"
                    rx="10"
                    fill="rgba(14, 11, 9, 0.78)"
                    stroke="rgba(212, 148, 58, 0.28)"
                  />
                  {/* Mid Quadrant Crosshairs */}
                  <line
                    x1="326"
                    y1="24"
                    x2="326"
                    y2="320"
                    stroke="rgba(212, 148, 58, 0.2)"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="64"
                    y1="172"
                    x2="588"
                    y2="172"
                    stroke="rgba(212, 148, 58, 0.2)"
                    strokeDasharray="4 4"
                  />

                  {/* Quadrant Watermarks */}
                  <text x="82" y="48" fill="rgba(232, 177, 92, 0.42)" fontSize="11">
                    ↖ 重雪莉 / 水楢木果脯檀香象限
                  </text>
                  <text x="410" y="48" fill="rgba(232, 177, 92, 0.42)" fontSize="11">
                    泥煤烟熏 × 雪莉桶交响象限 ↗
                  </text>
                  <text x="82" y="306" fill="rgba(212, 197, 180, 0.35)" fontSize="11">
                    ↙ 波本桶清雅花果蜂蜜象限
                  </text>
                  <text x="415" y="306" fill="rgba(212, 197, 180, 0.35)" fontSize="11">
                    纯粹海岛重泥煤药箱象限 ↘
                  </text>

                  {/* Axis Labels */}
                  <text x="326" y="352" textAnchor="middle" fill="#D4943A" fontSize="11.5">
                    泥煤烟熏度 Peat Smoke Score (0 → 100) →
                  </text>
                  <text
                    x="22"
                    y="172"
                    textAnchor="middle"
                    fill="#D4943A"
                    fontSize="11.5"
                    transform="rotate(-90 22 172)"
                  >
                    雪莉桶 / 东方橡木脂香度 (0 → 100) →
                  </text>

                  {/* Whisky Nodes */}
                  {whiskyPoints.map((pt) => {
                    const cx = 64 + (pt.peatScore / 100) * 524;
                    const cy = 320 - (pt.sherryOakScore / 100) * 296;
                    const isSel = pt.id === activeWhisky.id;
                    const labelLeft = pt.peatScore > 75;
                    return (
                      <g
                        key={pt.id}
                        className="wine-scatter-node"
                        onClick={() => setActiveWhiskyId(pt.id)}
                      >
                        {isSel && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="16"
                            fill="rgba(212, 148, 58, 0.22)"
                            stroke="#F1BF6E"
                            strokeWidth="1.2"
                          />
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSel ? "8.5" : "6.5"}
                          fill={pt.colorHex}
                          stroke="#FAF2E6"
                          strokeWidth={isSel ? "2.2" : "1.4"}
                        />
                        <text
                          x={labelLeft ? cx - 12 : cx + 12}
                          y={cy + 4}
                          textAnchor={labelLeft ? "end" : "start"}
                          fill={isSel ? "#FFF8EB" : "#D6C5B2"}
                          fontSize={isSel ? "11.5" : "10.5"}
                          fontWeight={isSel ? "700" : "400"}
                        >
                          {pt.name.split(" ")[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <aside className="wine-whisky-inspector" aria-live="polite">
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span
                    className="zw-liquor-ring"
                    style={{ background: activeWhisky.colorHex, width: 28, height: 28 }}
                  />
                  <div>
                    <span className="wine-pillar-kicker">{activeWhisky.region}</span>
                    <h3 style={{ fontSize: "1.18rem", color: "#FAF1E4" }}>{activeWhisky.name}</h3>
                  </div>
                </div>

                <div className="wine-meter-row">
                  <div className="wine-meter-top">
                    <span>泥煤烟熏酚值强度 (Peat)</span>
                    <strong>{activeWhisky.peatScore} / 100</strong>
                  </div>
                  <div className="wine-meter-track">
                    <div
                      className="wine-meter-fill"
                      style={{
                        width: `${activeWhisky.peatScore}%`,
                        background: "linear-gradient(90deg, #9E8E7E, #EBB35E)",
                      }}
                    />
                  </div>
                </div>

                <div className="wine-meter-row">
                  <div className="wine-meter-top">
                    <span>雪莉桶 / 橡木陈酿浓醇度 (Oak)</span>
                    <strong>{activeWhisky.sherryOakScore} / 100</strong>
                  </div>
                  <div className="wine-meter-track">
                    <div
                      className="wine-meter-fill"
                      style={{
                        width: `${activeWhisky.sherryOakScore}%`,
                        background: "linear-gradient(90deg, #B86B43, #7A2332)",
                      }}
                    />
                  </div>
                </div>

                <div className="wine-spec-box">
                  <span className="wine-spec-label">SENSORY COORDINATE · 坐标风味速写</span>
                  <p>{activeWhisky.flavorTag}</p>
                </div>

                <div className="wine-whisky-list">
                  {whiskyPoints.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      className={`wine-aroma-chip${w.id === activeWhisky.id ? " active" : ""}`}
                      onClick={() => setActiveWhiskyId(w.id)}
                    >
                      {w.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* 4. Sommelier Specimen Master Dossier & Cellar Rack */}
        <section
          id="wine-sommelier-dossier"
          ref={dossierRef}
          aria-label="侍酒师典藏样板档案与酒单"
        >
          <div className="wine-sec-head">
            <div>
              <span className="wine-sec-kicker">
                SOMMELIER SPECIMEN DOSSIER · 二期标准酒志卡片契约预览
              </span>
              <h2>侍酒师典藏样板酒单（{filteredSpecimens.length} 款）</h2>
            </div>
            <span className="wine-sec-sub">
              点击下方任意酒款切换上方五维结构雷达与侍酒仪轨，支持直接收入跨馆品饮护照
            </span>
          </div>

          {/* Active Specimen Detailed Dossier */}
          <article className="wine-dossier-panel" data-testid="wine-active-dossier">
            <div>
              <div className="wine-dossier-badges">
                <span className="wine-abv-pill">{activeSpecimen.abv}</span>
                <span className="wine-mini-tag">
                  {activeSpecimen.subtitle ?? PILLAR_LABELS[activeSpecimen.pillar]}
                </span>
                {activeSpecimen.baijiuAroma && (
                  <span className="wine-mini-tag">
                    香型编码：{activeSpecimen.baijiuAroma.toUpperCase()}
                  </span>
                )}
              </div>

              <h3 className="wine-dossier-title">{activeSpecimen.title}</h3>
              <p className="wine-dossier-origin">📍 产区风土：{activeSpecimen.originLabel}</p>

              <p className="wine-dossier-tagline">{activeSpecimen.tagline}</p>

              <div className="wine-tag-list" style={{ marginTop: "0.85rem" }}>
                {activeSpecimen.aromaWheelTags.map((tag) => (
                  <span key={tag} className="wine-mini-tag">
                    ✦ {tag}
                  </span>
                ))}
              </div>

              <div className="wine-dossier-craft-grid">
                <div className="wine-spec-box">
                  <span className="wine-spec-label">RAW MATERIAL · 酿造谷果与水源曲药</span>
                  <p>{activeSpecimen.baseRawMaterial}</p>
                </div>
                <div className="wine-spec-box">
                  <span className="wine-spec-label">FERMENTATION &amp; AGING · 发酵蒸馏与陈藏</span>
                  <p>{activeSpecimen.fermentationAndAging}</p>
                </div>
              </div>

              <div className="wine-ritual-grid">
                <div className="wine-ritual-item">
                  <small>GLASSWARE · 推荐侍酒器皿</small>
                  <span>{activeSpecimen.serving.glassware}</span>
                </div>
                <div className="wine-ritual-item">
                  <small>TEMPERATURE · 最佳侍酒温区</small>
                  <span>{activeSpecimen.serving.servingTempCelsius}</span>
                </div>
                {activeSpecimen.serving.decantingOrDilution && (
                  <div className="wine-ritual-item">
                    <small>DECANTING / WATER · 醒酒与兑水</small>
                    <span>{activeSpecimen.serving.decantingOrDilution}</span>
                  </div>
                )}
                <div className="wine-ritual-item">
                  <small>PAIRING · 餐酒风味配伍</small>
                  <span>{activeSpecimen.serving.foodPairing}</span>
                </div>
              </div>

              <p className="wine-dossier-note">{activeSpecimen.previewNote}</p>
            </div>

            <div className="wine-dossier-side">
              <div className="wine-liquor-showcase">
                <span
                  className="wine-liquor-orb"
                  style={{ background: activeSpecimen.liquorColorHex }}
                />
                <div>
                  <span className="wine-spec-label" style={{ marginBottom: "0.1rem" }}>
                    LIQUOR HUE · 酒液色泽审评
                  </span>
                  <strong style={{ fontSize: "0.88rem", color: "#F7EFE3" }}>
                    {activeSpecimen.liquorColorLabel}
                  </strong>
                </div>
              </div>

              <WineRadarChart radar={activeSpecimen.structureRadar} />

              <div className="wine-footprint-actions">
                <button
                  type="button"
                  className={`wine-fp-btn${activeIsTasted ? " tasted" : ""}`}
                  data-testid="wine-dossier-toggle-tasted"
                  onClick={() => toggleTasted(activeFootprint)}
                >
                  {activeIsTasted ? "✓ 已品鉴打卡" : "+ 标记喝过"}
                </button>
                <button
                  type="button"
                  className={`wine-fp-btn${activeIsWished ? " wished" : ""}`}
                  data-testid="wine-dossier-toggle-wishlist"
                  onClick={() => toggleWishlist(activeFootprint)}
                >
                  {activeIsWished ? "★ 已入心愿单" : "♡ 想喝"}
                </button>
              </div>
            </div>
          </article>

          {/* 9-Card Specimen Cellar Grid */}
          <div className="wine-specimen-grid">
            {filteredSpecimens.map((item) => {
              const isCurrent = item.id === activeSpecimen.id;
              const rec = wineSpecimenToFootprint(item);
              const tasted = isTasted(item.id);
              const wished = isWishlisted(item.id);

              return (
                <article
                  key={item.id}
                  className={`wine-specimen-card${isCurrent ? " active" : ""}`}
                  data-testid={`wine-specimen-card-${item.id}`}
                  onClick={() => handleChooseSpecimen(item.id, false)}
                >
                  <div className="wine-card-head">
                    <div className="wine-card-head-left">
                      <span
                        className="zw-liquor-ring"
                        style={{ background: item.liquorColorHex }}
                      />
                      <span className="wine-mini-tag">
                        {item.subtitle ?? PILLAR_LABELS[item.pillar]}
                      </span>
                    </div>
                    <span className="wine-abv-pill">{item.abv}</span>
                  </div>

                  <h4>{item.title}</h4>
                  <span className="wine-card-origin">{item.originLabel}</span>
                  <p className="wine-card-tagline">{item.tagline}</p>

                  <div className="wine-tag-list">
                    {item.aromaWheelTags.slice(0, 3).map((t) => (
                      <span key={t} className="wine-mini-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="wine-card-footer">
                    <span style={{ fontSize: "0.75rem", color: isCurrent ? "#EBB35E" : "#9E8E7E" }}>
                      {isCurrent ? "● 当前展开侍酒档案" : "点击展开侍酒卡"}
                    </span>
                    <div className="wine-card-mini-actions">
                      <button
                        type="button"
                        className={`wine-mini-btn${tasted ? " on" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTasted(rec);
                        }}
                      >
                        {tasted ? "✓ 喝过" : "+ 喝过"}
                      </button>
                      <button
                        type="button"
                        className={`wine-mini-btn${wished ? " wish-on" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(rec);
                        }}
                      >
                        {wished ? "★ 想喝" : "♡ 想喝"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
