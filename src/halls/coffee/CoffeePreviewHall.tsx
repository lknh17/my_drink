import { useEffect, useMemo, useRef, useState } from "react";
import type { HallId } from "../../core/types";
import { coffeeSpecimenToFootprint, useDrinkFootprints } from "../../core/drinkFootprints";
import { CraftStepDeck, type CraftStepItem } from "../../core/CraftStepDeck";
import { EditorialDrinkPhoto } from "../../core/EditorialDrinkPhoto";
import { WorldTerroirBeltMap, type WorldTerroirMarker } from "../../core/map/WorldTerroirBeltMap";
import { assetUrl } from "../../lib/assetUrl";
import { coffeeBlueprint } from "./content";
import type {
  CoffeeBeltZoneId,
  CoffeePreviewSpecimen,
  CoffeeProcessId,
  CoffeeSensoryRadar,
  RoastLevelId,
} from "./types";
import "./coffee.css";

export interface CoffeePreviewHallProps {
  selectedSpecimenId?: string | null;
  onSelectSpecimen?: (specimenId: string | null) => void;
  onNavigateHall: (hall: HallId) => void;
  onOpenSearch: () => void;
  onOpenPassport: () => void;
  onOpenCalibration?: () => void;
}

const RADAR_AXES: { key: keyof CoffeeSensoryRadar; label: string }[] = [
  { key: "acidity", label: "果酸明亮度" },
  { key: "sweetness", label: "焦糖花蜜甜" },
  { key: "body", label: "醇厚油脂感" },
  { key: "floralFruity", label: "花果调张力" },
  { key: "aftertaste", label: "干净回甘长" },
];

const BELT_ZONE_META: { id: CoffeeBeltZoneId | "all"; label: string; sub: string }[] = [
  { id: "all", label: "全球咖啡带全景", sub: "25°N – 30°S 火山高海拔带" },
  { id: "east-africa", label: "东非大裂谷起源带", sub: "埃塞俄比亚 · 肯尼亚" },
  { id: "central-south-america", label: "中南美火山竞标带", sub: "巴拿马 · 哥伦比亚 · 巴西" },
  { id: "yunnan-asia", label: "中国云南精品庄园带", sub: "保山高黎贡山 · 普洱孟连" },
  { id: "island-terroir", label: "赤道与海岛火山微域", sub: "苏门答腊多巴湖 · 蓝山/科纳" },
];

const COFFEE_MAP_LABELS: Record<string, string> = {
  "origin-ethiopia-yirgacheffe": "埃塞耶加雪菲",
  "origin-kenya-nyeri": "肯尼亚涅里",
  "origin-panama-boquete": "巴拿马波奎特",
  "origin-colombia-huila": "哥伦比亚慧兰",
  "origin-yunnan-baoshan": "中国云南保山潞江坝",
  "origin-yunnan-menglian": "中国云南普洱孟连",
  "origin-sumatra-lintong": "印尼苏门答腊多巴湖",
  "origin-jamaica-kona-island": "牙买加蓝山/科纳",
};

const COFFEE_CRAFT_STEPS: CraftStepItem[] = [
  {
    stepNo: 1, id: "cherry", title: "鲜果分选与五层识果", subtitle: "先认清一颗红樱桃",
    plainAction: "只采糖度达标的全红果，浮选去除空果，再剖开辨认外果皮、果肉、果胶、羊皮纸与银皮生豆。",
    scienceNote: "越成熟的果肉蔗糖与果胶越充足；五层结构决定后续水洗、日晒或蜜处理究竟保留多少糖源。",
    flavorImpact: "成熟度整齐，杯中才会甜而干净；青果混入会带来花生皮、青草与尖涩。",
    keyMetrics: ["果实糖度 ≥20°Brix", "采后 8h 内处理", "浮果与青果剔除"], diagramKind: "coffee-cherry-five-layers",
    photoUrl: "/photos/craft-coffee-step1.jpg", photoCaption: "全红咖啡樱桃手选与浮选",
  },
  {
    stepNo: 2, id: "process", title: "剥层与控酵", subtitle: "水洗、日晒、蜜处理分流",
    plainAction: "按目标风味选择去皮洗胶、整果日晒或保留果胶慢晒，并持续翻动、测温与闻香。",
    scienceNote: "酵母和乳酸菌以果胶糖为底物生成有机酸与芳香酯；氧气、温度和时长决定洁净度与发酵张力。",
    flavorImpact: "水洗更清透明亮，日晒更像熟果酱，蜜处理在清晰度与焦糖甜感间取中道。",
    keyMetrics: ["发酵 12–120h", "罐温 18–24℃", "果胶保留 0–100%"], diagramKind: "coffee-cherry-five-layers",
    photoUrl: "/photos/craft-coffee-step2.jpg", photoCaption: "发酵槽、晒床与果胶层控制",
  },
  {
    stepNo: 3, id: "drying", title: "慢干与脱壳", subtitle: "把风味安全封进生豆",
    plainAction: "在高架床或遮阴棚薄铺翻晒，缓慢降水；稳定后脱去羊皮纸并分级挑除瑕疵豆。",
    scienceNote: "干燥过快会造成外干内湿，过慢又易霉败；均匀水分迁移让细胞结构稳定、风味前体不被破坏。",
    flavorImpact: "干燥均匀带来清甜与耐储性；霉味、发酵过头和木质空洞常在这一关产生。",
    keyMetrics: ["终水分 10–12%", "水活性 0.50–0.60", "慢干 10–28d"], diagramKind: "coffee-cherry-five-layers",
    photoUrl: "/photos/craft-coffee-step3.jpg", photoCaption: "高架床慢干与带壳生豆静置",
  },
  {
    stepNo: 4, id: "roast", title: "烘焙一爆热解", subtitle: "梅纳反应建立甜香",
    plainAction: "让生豆依次经历脱水、梅纳反应与一爆；监听爆裂并依据发展率迅速下豆风冷。",
    scienceNote: "氨基酸与还原糖发生梅纳反应，生成坚果、焦糖与花果香前体；一爆是豆内蒸汽冲破细胞壁的声音。",
    flavorImpact: "短发展锁住茉莉与果酸，长发展增加巧克力醇厚；过快会夹生，过久则焦苦。",
    keyMetrics: ["一爆约 196℃", "DTR 13–22%", "下豆 198–218℃"], diagramKind: "coffee-cherry-five-layers",
    photoUrl: "/photos/craft-coffee-step4.jpg", photoCaption: "滚筒烘焙机一爆与风冷盘",
  },
  {
    stepNo: 5, id: "brew", title: "V60 闷蒸金杯萃取", subtitle: "排气后分段取甜",
    plainAction: "现磨后先用约两倍粉重热水闷蒸排气，再分段稳定绕圈注水，按目标时间截断尾段。",
    scienceNote: "闷蒸释放烘焙产生的 CO₂，让后续水流均匀浸润；研磨、水温、扰动共同控制酸甜苦的溶出顺序。",
    flavorImpact: "合适的 1:16 粉水比得到清透花果香；流速过慢易苦涩，过快则酸薄空洞。",
    keyMetrics: ["闷蒸 25–35s", "粉水比约 1:16", "总时长 2:00–2:30"], diagramKind: "coffee-cherry-five-layers",
    photoUrl: "/photos/craft-coffee-step5.jpg", photoCaption: "V60 闷蒸与分段绕圈注水",
  },
];

interface RoastCurvePoint {
  level: RoastLevelId;
  shortLabel: string;
  agtronRef: string;
  dropTempC: number;
  dtrPct: string;
  x: number;
  y: number;
  beanHex: string;
  chemicalFocus: string;
}

const ROAST_CURVE_POINTS: RoastCurvePoint[] = [
  {
    level: "light",
    shortLabel: "浅烘 Light",
    agtronRef: "#75–#85",
    dropTempC: 198,
    dtrPct: "12–14%",
    x: 245,
    y: 92,
    beanHex: "#B8723E",
    chemicalFocus: "一爆密集初期下豆 · 完整封存柠檬酸、苹果酸与花香萜烯",
  },
  {
    level: "light-medium",
    shortLabel: "中浅 City",
    agtronRef: "#68–#74",
    dropTempC: 204,
    dtrPct: "15–17%",
    x: 282,
    y: 78,
    beanHex: "#9C562C",
    chemicalFocus: "一爆中后段发展 · 明亮果酸与蔗糖梅纳甜感达到黄金平衡",
  },
  {
    level: "medium",
    shortLabel: "中烘 Full City-",
    agtronRef: "#60–#66",
    dropTempC: 210,
    dtrPct: "18–20%",
    x: 318,
    y: 64,
    beanHex: "#7A3E1D",
    chemicalFocus: "一爆结束滑行期 · 焦糖化反应主导，坚果可可与圆润醇度凸显",
  },
  {
    level: "medium-dark",
    shortLabel: "中深 Full City+",
    agtronRef: "#50–#56",
    dropTempC: 217,
    dtrPct: "21–23%",
    x: 352,
    y: 50,
    beanHex: "#522814",
    chemicalFocus: "二爆零星初响 · 有机酸降解转化，木质香料与黑巧绸缎感巅峰",
  },
  {
    level: "dark",
    shortLabel: "意式深烘 Dark",
    agtronRef: "#42–#48",
    dropTempC: 223,
    dtrPct: "24–26%",
    x: 386,
    y: 38,
    beanHex: "#36190D",
    chemicalFocus: "二爆前中段 · 纤维微孔膨胀储气，9 Bar 压萃释放丰厚赤金虎斑油脂",
  },
];

const PROCESS_METRICS: Partial<Record<
  CoffeeProcessId,
  { mucilageRetainedPct: number; clarityScore: number; fermentationScore: number; dryingDays: string }
>> = {
  washed: {
    mucilageRetainedPct: 0,
    clarityScore: 96,
    fermentationScore: 15,
    dryingDays: "10–14 天带壳净晒",
  },
  natural: {
    mucilageRetainedPct: 100,
    clarityScore: 68,
    fermentationScore: 82,
    dryingDays: "18–28 天全果慢晒",
  },
  honey: {
    mucilageRetainedPct: 65,
    clarityScore: 82,
    fermentationScore: 55,
    dryingDays: "14–20 天带果胶晒",
  },
  anaerobic: {
    mucilageRetainedPct: 85,
    clarityScore: 74,
    fermentationScore: 88,
    dryingDays: "48–120h 控压无氧罐",
  },
  "wet-hulled": {
    mucilageRetainedPct: 25,
    clarityScore: 60,
    fermentationScore: 85,
    dryingDays: "含水 32% 半湿脱壳暴晒",
  },
  experimental: {
    mucilageRetainedPct: 90,
    clarityScore: 78,
    fermentationScore: 95,
    dryingDays: "CO₂ 浸渍 + 冷热水锁香",
  },
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function formatDurationSec(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s (浓缩压萃)`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function CoffeeSensoryRadarChart({ radar, accentHex }: { radar: CoffeeSensoryRadar; accentHex: string }) {
  const cx = 92;
  const cy = 90;
  const maxR = 56;

  const polygonPoints = RADAR_AXES.map((axis, idx) => {
    const angle = (360 / RADAR_AXES.length) * idx;
    const val = Math.max(0, Math.min(100, radar[axis.key]));
    const pt = polarToCartesian(cx, cy, (val / 100) * maxR, angle);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg className="coffee-radar-svg" viewBox="0 0 185 175" role="img" aria-label="SCA 五维感官杯测雷达图">
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
            stroke="rgba(43, 25, 17, 0.18)"
            strokeWidth="1"
          />
        );
      })}

      {RADAR_AXES.map((axis, idx) => {
        const angle = (360 / RADAR_AXES.length) * idx;
        const edge = polarToCartesian(cx, cy, maxR, angle);
        const labelPt = polarToCartesian(cx, cy, maxR + 18, angle);
        return (
          <g key={axis.key}>
            <line
              x1={cx}
              y1={cy}
              x2={edge.x}
              y2={edge.y}
              stroke="rgba(43, 25, 17, 0.2)"
              strokeDasharray="2 2"
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#4E3529"
              fontSize="9.2"
              fontWeight="600"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      <polygon
        points={polygonPoints}
        fill="rgba(200, 109, 59, 0.24)"
        stroke={accentHex || "#C86D3B"}
        strokeWidth="2"
      />

      {RADAR_AXES.map((axis, idx) => {
        const angle = (360 / RADAR_AXES.length) * idx;
        const val = radar[axis.key];
        const pt = polarToCartesian(cx, cy, (val / 100) * maxR, angle);
        return (
          <circle
            key={axis.key}
            cx={pt.x}
            cy={pt.y}
            r="3.2"
            fill="#FAF7F1"
            stroke="#2B1911"
            strokeWidth="1.4"
          />
        );
      })}
    </svg>
  );
}

export function CoffeePreviewHall({
  selectedSpecimenId,
  onSelectSpecimen,
  onNavigateHall,
  onOpenSearch,
  onOpenPassport,
  onOpenCalibration,
}: CoffeePreviewHallProps) {
  const { countsByHall, wishlistCountsByHall, isTasted, isWishlisted, toggleTasted, toggleWishlist } =
    useDrinkFootprints();

  const [activeProcessId, setActiveProcessId] = useState<CoffeeProcessId>("washed");
  const [beltFilter, setBeltFilter] = useState<CoffeeBeltZoneId | "all">("all");
  const [selectedOriginId, setSelectedOriginId] = useState<string | null>(null);
  const [lotFilterZone, setLotFilterZone] = useState<CoffeeBeltZoneId | "all">("all");
  const [internalSpecimenId, setInternalSpecimenId] = useState<string>(
    selectedSpecimenId || coffeeBlueprint.specimens[0].id,
  );

  const benchRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedSpecimenId) {
      const matched = coffeeBlueprint.specimens.find((s) => s.id === selectedSpecimenId);
      if (matched) {
        setInternalSpecimenId(matched.id);
        setActiveProcessId(matched.process);
      }
    }
  }, [selectedSpecimenId]);

  const activeSpecimen: CoffeePreviewSpecimen = useMemo(() => {
    const targetId = selectedSpecimenId || internalSpecimenId;
    return (
      coffeeBlueprint.specimens.find((s) => s.id === targetId) ?? coffeeBlueprint.specimens[0]
    );
  }, [selectedSpecimenId, internalSpecimenId]);

  const activeProcess = useMemo(
    () =>
      coffeeBlueprint.processes.find((p) => p.id === activeProcessId) ??
      coffeeBlueprint.processes[0],
    [activeProcessId],
  );

  const activeProcessStat = PROCESS_METRICS[activeProcess.id] ?? {
    mucilageRetainedPct: 50,
    clarityScore: activeProcess.clarityScore ?? 70,
    fermentationScore: activeProcess.fermentationFunkScore ?? 70,
    dryingDays: activeProcess.typicalDays ?? "依处理批次设定",
  };

  const matchingProcessSpecimens = useMemo(
    () => coffeeBlueprint.specimens.filter((s) => s.process === activeProcess.id),
    [activeProcess],
  );

  const filteredOrigins = useMemo(() => {
    if (selectedOriginId) {
      return coffeeBlueprint.origins.filter((o) => o.id === selectedOriginId);
    }
    if (beltFilter === "all") return coffeeBlueprint.origins;
    return coffeeBlueprint.origins.filter((o) => o.zone === beltFilter);
  }, [beltFilter, selectedOriginId]);

  const worldMarkers = useMemo<WorldTerroirMarker[]>(
    () => coffeeBlueprint.origins.flatMap((origin) => origin.coord ? [{
      id: origin.id,
      label: COFFEE_MAP_LABELS[origin.id] ?? origin.name,
      subLabel: origin.elevationRange,
      coord: origin.coord,
      colorHex: origin.zone === "yunnan-asia" ? "#B23A2C" : "#2C6E63",
    }] : []),
    [],
  );

  const filteredLots = useMemo(() => {
    if (lotFilterZone === "all") return coffeeBlueprint.specimens;
    return coffeeBlueprint.specimens.filter((s) => s.beltZone === lotFilterZone);
  }, [lotFilterZone]);

  const activeRoastNode = useMemo(
    () =>
      ROAST_CURVE_POINTS.find((pt) => pt.level === activeSpecimen.roastLevel) ??
      ROAST_CURVE_POINTS[0],
    [activeSpecimen.roastLevel],
  );

  function handleChooseLot(id: string, scrollIntoBench = false) {
    setInternalSpecimenId(id);
    onSelectSpecimen?.(id);
    if (scrollIntoBench && benchRef.current) {
      benchRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function handleSelectRoastLevel(level: RoastLevelId) {
    const candidate = coffeeBlueprint.specimens.find((s) => s.roastLevel === level);
    if (candidate) {
      handleChooseLot(candidate.id, false);
    }
  }

  function handleSelectOrigin(originId: string) {
    const origin = coffeeBlueprint.origins.find((item) => item.id === originId);
    if (!origin) return;
    setSelectedOriginId(originId);
    setBeltFilter(origin.zone);
    setLotFilterZone(origin.zone);
    const [lng, lat] = origin.coord ?? [0, 0];
    const representative = coffeeBlueprint.specimens
      .filter((lot) => lot.beltZone === origin.zone && lot.coord)
      .sort((a, b) => {
        const da = Math.hypot((a.coord?.[0] ?? 0) - lng, (a.coord?.[1] ?? 0) - lat);
        const db = Math.hypot((b.coord?.[0] ?? 0) - lng, (b.coord?.[1] ?? 0) - lat);
        return da - db;
      })[0];
    if (representative) handleChooseLot(representative.id);
  }

  function scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeFootprint = coffeeSpecimenToFootprint(activeSpecimen);
  const activeIsTasted = isTasted(activeSpecimen.id);
  const activeIsWished = isWishlisted(activeSpecimen.id);

  return (
    <div className="coffee-hall" data-testid="coffee-preview-hall">
      {/* Washed Parchment & Nordic Roastery Lab Topbar */}
      <header className="coffee-topbar">
        <div className="zw-topbar-brand">
          <span className="coffee-stamp-seal">咖典</span>
          <div>
            <span className="zw-topbar-kicker" style={{ color: "#7D6355" }}>
              KADIAN · SPECIALTY COFFEE ROASTERY &amp; EXTRACTION LAB
            </span>
            <span className="zw-topbar-title" style={{ color: "#2B1911" }}>
              咖典 · 精品咖啡馆 — 生豆羊皮纸与烘焙萃取实验室预览席位
            </span>
          </div>
        </div>

        <div className="zw-topbar-actions">
          <button
            type="button"
            className="coffee-nav-btn"
            data-testid="coffee-back-portal"
            onClick={() => onNavigateHall("portal")}
          >
            ← 酌味总门户
          </button>
          <button
            type="button"
            className="coffee-nav-btn"
            onClick={() => onNavigateHall("tea")}
          >
            🍵 茗典·茶馆
          </button>
          <button
            type="button"
            className="coffee-nav-btn"
            onClick={() => onNavigateHall("wine")}
          >
            🥃 醺典·酒馆
          </button>
          <button
            type="button"
            className="coffee-nav-btn"
            onClick={onOpenSearch}
          >
            🔍 全局检索 <span className="zw-kbd">⌘K</span>
          </button>
          <button
            type="button"
            className="coffee-nav-btn accent"
            onClick={onOpenPassport}
          >
            📜 品饮护照 · 已品 {countsByHall.total}
            {wishlistCountsByHall.total > 0 ? ` · 想喝 ${wishlistCountsByHall.total}` : ""}
          </button>
          {onOpenCalibration && <button type="button" className="coffee-nav-btn" onClick={onOpenCalibration}>🖼️ 配图校准</button>}
        </div>
      </header>

      <main className="coffee-container">
        {/* Swiss Roastery Spec-Sheet Hero */}
        <section className="coffee-hero-sheet" aria-label="咖典精品咖啡馆总纲">
          <div className="coffee-hero-telemetry-bar">
            <div>
              <span className="coffee-hero-stamp">PHASE III PREVIEW</span>{" "}
              <span style={{ marginLeft: "0.5rem" }}>
                SPEC SHEET NO. KD-2026 · WASHED PARCHMENT #F4EFE6 / ESPRESSO #2B1911 / MAILLARD #C86D3B
              </span>
            </div>
            <span>SCA CUPPING ≥ 85+ · WATER TDS 75ppm · AGTRON GOURMET SCALE</span>
          </div>

          <div className="coffee-hero-body">
            <div>
              <h1 className="coffee-hero-title">
                生豆羊皮纸 · <span>风土处理与梅纳热力学</span>
              </h1>
              <p className="coffee-hero-lead">
                每一杯精品咖啡皆是「种子基因 × 高海拔火山红壤 × 果胶发酵工程 × 烘焙焦糖化曲线 × 金杯流体萃取」的精密接力。
                本馆以水洗羊皮纸与北欧极简烘焙工坊规格单构筑三期蓝图，串联全球咖啡带及中国云南保山高黎贡山、普洱孟连精品庄园。
              </p>

              <div className="coffee-swiss-kpis">
                <div className="coffee-kpi-cell">
                  <span className="coffee-kpi-code">01 · TERROIR BELT</span>
                  <strong>{coffeeBlueprint.origins.length} 大产区</strong>
                  <small>全球咖啡带 + 云南高黎贡/孟连</small>
                </div>
                <div className="coffee-kpi-cell">
                  <span className="coffee-kpi-code">02 · VARIETAL × PROCESS</span>
                  <strong>{coffeeBlueprint.processes.length} 类后制法</strong>
                  <small>水洗 · 日晒 · 蜜 · 厌氧 · 湿刨</small>
                </div>
                <div className="coffee-kpi-cell">
                  <span className="coffee-kpi-code">03 · ROAST &amp; AGTRON</span>
                  <strong>#88 → #44</strong>
                  <small>ROR 升温率 × 梅纳发展率 DTR</small>
                </div>
                <div className="coffee-kpi-cell">
                  <span className="coffee-kpi-code">04 · GOLDEN CUP LOTS</span>
                  <strong>{coffeeBlueprint.specimens.length} 支微批次</strong>
                  <small>已入咖啡护照 {countsByHall.coffee} 支 · TDS 18–22%</small>
                </div>
              </div>

              <div className="coffee-anchor-row">
                <button
                  type="button"
                  className="coffee-anchor-pill"
                  onClick={() => scrollToSection("coffee-process-matrix")}
                >
                  01 生豆六大处理法
                </button>
                <button
                  type="button"
                  className="coffee-anchor-pill"
                  onClick={() => scrollToSection("coffee-origin-belt")}
                >
                  02 全球咖啡带与云南庄园
                </button>
                <button
                  type="button"
                  className="coffee-anchor-pill"
                  onClick={() => scrollToSection("coffee-golden-cup-bench")}
                >
                  03 Agtron 曲线与金杯萃取台
                </button>
                <button
                  type="button"
                  className="coffee-anchor-pill"
                  onClick={() => scrollToSection("coffee-lot-archive")}
                >
                  04 麻袋批次寻豆卡 ({coffeeBlueprint.specimens.length})
                </button>
              </div>
            </div>

            <div className="coffee-hero-diagram" aria-hidden="true">
              <svg width="246" height="198" viewBox="0 0 246 198" fill="none">
                {/* Technical Grid Lines */}
                <line x1="18" y1="168" x2="228" y2="168" stroke="#2B1911" strokeWidth="1.8" />
                <line x1="126" y1="20" x2="126" y2="168" stroke="#A68E80" strokeDasharray="3 3" />

                {/* Left: Coffee Cherry Cross-Section Anatomy */}
                <ellipse
                  cx="68"
                  cy="92"
                  rx="38"
                  ry="46"
                  fill="rgba(178, 58, 44, 0.14)"
                  stroke="#B23A2C"
                  strokeWidth="2"
                />
                <ellipse
                  cx="68"
                  cy="92"
                  rx="29"
                  ry="37"
                  fill="rgba(212, 136, 42, 0.18)"
                  stroke="#C86D3B"
                  strokeWidth="1.4"
                  strokeDasharray="3 2"
                />
                {/* Twin Parchment Seeds */}
                <path
                  d="M54 68 C45 74, 45 110, 54 116 C61 116, 63 108, 63 92 C63 76, 61 68, 54 68 Z"
                  fill="#FAF7F1"
                  stroke="#2B1911"
                  strokeWidth="1.8"
                />
                <path
                  d="M82 68 C91 74, 91 110, 82 116 C75 116, 73 108, 73 92 C73 76, 75 68, 82 68 Z"
                  fill="#FAF7F1"
                  stroke="#2B1911"
                  strokeWidth="1.8"
                />
                <path d="M68 46 C68 35, 76 28, 86 26" stroke="#2C6E63" strokeWidth="2.2" strokeLinecap="round" />
                <text x="68" y="154" textAnchor="middle" fill="#4E3529" fontSize="8.5" fontFamily="monospace">
                  CHERRY &amp; MUCILAGE
                </text>

                {/* Right: 60° Conical V60 Dripper + Spiral Ribs + Glass Server */}
                <polygon
                  points="144,44 220,44 190,104 174,104"
                  fill="#FAF7F1"
                  stroke="#2B1911"
                  strokeWidth="2"
                />
                <path d="M154 44 L178 104 M168 44 L182 104 M208 44 L186 104" stroke="#C86D3B" strokeWidth="1.3" />
                <rect x="164" y="104" width="36" height="5" fill="#2B1911" />
                {/* Glass Range Server */}
                <path
                  d="M164 110 H200 L208 148 C209 158, 198 166, 182 166 C166 166, 155 158, 156 148 Z"
                  fill="rgba(250, 247, 241, 0.8)"
                  stroke="#2B1911"
                  strokeWidth="1.8"
                />
                <path
                  d="M158 141 C170 144, 194 144, 206 141 C206 156, 196 163, 182 163 C168 163, 158 156, 158 141 Z"
                  fill="#C86D3B"
                  opacity="0.88"
                />
                <path d="M201 116 H213 C218 116, 218 142, 211 142 H206" stroke="#2B1911" strokeWidth="1.8" fill="none" />
                <circle cx="182" cy="124" r="2.3" fill="#C86D3B" />
                <circle cx="182" cy="133" r="1.8" fill="#C86D3B" />
                <text x="182" y="34" textAnchor="middle" fill="#2C6E63" fontSize="8.5" fontFamily="monospace">
                  60° SPIRAL CONE
                </text>
              </svg>
              <span className="coffee-diagram-caption">
                ENDOSPERM ANATOMY · 60° SPIRAL EXTRACTION GEOMETRY
              </span>
            </div>
          </div>
        </section>

        {/* 1. Interactive 6 Processing Methods Comparator */}
        <section id="coffee-process-matrix" aria-label="生豆六大后制处理法对比台">
          <div className="coffee-sec-head">
            <div>
              <span className="coffee-sec-kicker">
                POST-HARVEST FERMENTATION · 六大生豆处理法果胶与菌群工程
              </span>
              <h2>咖啡樱桃脱皮、黏膜保留率与发酵风味光谱</h2>
            </div>
            <span className="coffee-sec-sub">
              点击切换 6 种后制工艺，对比果胶层（Mucilage）去留如何改写洁净度与发酵酯香
            </span>
          </div>

          <div className="coffee-process-tabs" role="tablist" aria-label="生豆处理法切换">
            {coffeeBlueprint.processes.map((proc, index) => {
              const isSelected = proc.id === activeProcess.id;
              return (
                <button
                  key={proc.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`coffee-proc-tab${isSelected ? " active" : ""}`}
                  data-testid={`coffee-proc-tab-${proc.id}`}
                  onClick={() => setActiveProcessId(proc.id)}
                >
                  <small>
                    0{index + 1} · {proc.id.toUpperCase()}
                  </small>
                  <strong>{proc.name}</strong>
                </button>
              );
            })}
          </div>

          <article className="coffee-process-inspector" aria-live="polite">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                <span
                  className="zw-liquor-ring"
                  style={{ background: activeProcess.accentHex }}
                />
                <h3 style={{ fontSize: "1.32rem", color: "#2B1911" }}>{activeProcess.name}</h3>
                <span className="coffee-tag mono">{activeProcess.englishName}</span>
                <span className="coffee-tag mono">{activeProcessStat.dryingDays}</span>
              </div>

              <div className="coffee-proc-spec-grid">
                <div className="coffee-spec-cell">
                  <span className="coffee-mono-label">MUCILAGE HANDLING · 果皮果肉与果胶处置</span>
                  <p>{activeProcess.mucilageHandling}</p>
                </div>
                <div className="coffee-spec-cell">
                  <span className="coffee-mono-label">MICROBIAL MECHANISM · 微生物代谢与渗透机制</span>
                  <p>{activeProcess.fermentationMechanism}</p>
                </div>
                <div className="coffee-spec-cell wide">
                  <span className="coffee-mono-label">CUP SIGNATURE · 杯测风味与酸甜质地判词</span>
                  <p>
                    <strong>{activeProcess.cupClarityVsFunk}</strong> — {activeProcess.flavorSignature}
                  </p>
                </div>
              </div>
            </div>

            <aside className="coffee-mucilage-card">
              <div>
                <span className="coffee-mono-label">FERMENTATION TELEMETRY · 处理法量化标尺</span>
                <p style={{ fontSize: "0.82rem", color: "#4E3529", marginBottom: "0.75rem" }}>
                  果胶黏膜含高浓度果糖与果胶酶底物，保留比例与氧气控制直接决定风味走向：
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.2rem" }}>
                      <span>干燥期果胶/果肉包裹率</span>
                      <strong style={{ fontFamily: "var(--font-mono)" }}>
                        {activeProcessStat.mucilageRetainedPct}%
                      </strong>
                    </div>
                    <div className="coffee-bar-track">
                      <div
                        className="coffee-bar-fill"
                        style={{
                          width: `${Math.max(4, activeProcessStat.mucilageRetainedPct)}%`,
                          background: activeProcess.accentHex,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.2rem" }}>
                      <span>杯测风土洁净度 (Clarity)</span>
                      <strong style={{ fontFamily: "var(--font-mono)" }}>
                        {activeProcessStat.clarityScore} / 100
                      </strong>
                    </div>
                    <div className="coffee-bar-track">
                      <div
                        className="coffee-bar-fill"
                        style={{
                          width: `${activeProcessStat.clarityScore}%`,
                          background: "#2C6E63",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.2rem" }}>
                      <span>发酵酯香与甜醇张力 (Funk/Esters)</span>
                      <strong style={{ fontFamily: "var(--font-mono)" }}>
                        {activeProcessStat.fermentationScore} / 100
                      </strong>
                    </div>
                    <div className="coffee-bar-track">
                      <div
                        className="coffee-bar-fill"
                        style={{
                          width: `${activeProcessStat.fermentationScore}%`,
                          background: "#C86D3B",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed #A68E80", paddingTop: "0.65rem" }}>
                <span className="coffee-mono-label">REPRESENTATIVE LOT · 馆藏对应批次样板</span>
                {matchingProcessSpecimens.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.3rem" }}>
                    {matchingProcessSpecimens.map((lot) => (
                      <button
                        key={lot.id}
                        type="button"
                        className="coffee-nav-btn"
                        style={{ padding: "0.28rem 0.62rem", fontSize: "0.76rem" }}
                        onClick={() => handleChooseLot(lot.id, true)}
                      >
                        {lot.lotCode} · 载入金杯台 →
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.78rem", color: "#5E4335" }}>
                    可参考 #COL-HUI-06 双重厌氧热冲击微批次体验先锋发酵风味。
                  </p>
                )}
              </div>
            </aside>
          </article>
        </section>

        <CraftStepDeck
          className="coffee-craft-deck"
          heading="从鲜红咖啡樱桃到金杯手冲 · 五步果层剥离与热解科普"
          subheading="沿着五层果实结构，逐步看懂后制发酵、慢干、烘焙一爆与 V60 闷蒸如何接力塑造杯中酸甜香气。"
          accentHex="#C86D3B"
          steps={COFFEE_CRAFT_STEPS}
        />

        {/* 2. Global Coffee Belt & China Yunnan High-Altitude Estates */}
        <section id="coffee-origin-belt" aria-label="全球咖啡带与中国云南高海拔庄园">
          <div className="coffee-sec-head">
            <div>
              <span className="coffee-sec-kicker">
                GLOBAL BEAN BELT (25°N – 30°S) · 全球四大风土带与中国云南精品产区
              </span>
              <h2>南北回归线咖啡带 · 从东非裂谷到云南高黎贡山</h2>
            </div>

            <div className="coffee-zone-pills" role="group" aria-label="产区风土带筛选">
              {BELT_ZONE_META.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`coffee-zone-pill${beltFilter === z.id ? " active" : ""}`}
                  data-testid={`coffee-belt-${z.id}`}
                  onClick={() => {
                    setSelectedOriginId(null);
                    setBeltFilter(z.id);
                  }}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>

          <WorldTerroirBeltMap
            className="coffee-world-map"
            markers={worldMarkers}
            selectedMarkerId={selectedOriginId}
            onSelectMarker={handleSelectOrigin}
            belts={[{
              id: "golden-coffee-belt",
              label: "黄金咖啡带",
              northLat: 25,
              southLat: -30,
              colorHex: "#C86D3B",
              opacity: 0.13,
            }]}
            title="真实世界大陆 · 黄金咖啡带庄园坐标"
            subtitle="点击庄园针即可聚焦产区卡、筛选豆单并载入距离最近的代表批次"
            accentHex="#2C6E63"
          />

          <div className="coffee-origin-grid">
            {filteredOrigins.map((origin) => {
              const isYunnan = origin.zone === "yunnan-asia";
              const linkedLot = coffeeBlueprint.specimens.find((s) => s.beltZone === origin.zone);
              return (
                <article
                  key={origin.id}
                  className={`coffee-origin-card${isYunnan ? " yunnan" : ""}`}
                >
                  <div className="coffee-origin-meta">
                    <span>⛰️ {origin.elevationRange}</span>
                    <span>采收 {origin.harvestMonths}</span>
                  </div>
                  <h3>{origin.name}</h3>
                  <span style={{ fontSize: "0.75rem", color: "#7D6355", fontFamily: "var(--font-mono)" }}>
                    {origin.latitudeBand}
                  </span>
                  <p className="coffee-origin-desc">{origin.flavorProfile}</p>
                  <div className="coffee-varietal-row">
                    {origin.dominantVarietals.map((v) => (
                      <span key={v} className="coffee-tag">
                        🌱 {v}
                      </span>
                    ))}
                  </div>
                  {linkedLot && (
                    <div style={{ paddingTop: "0.45rem", borderTop: "1px dashed #DCD0BC", marginTop: "0.25rem" }}>
                      <button
                        type="button"
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          color: isYunnan ? "#B23A2C" : "#2C6E63",
                        }}
                        onClick={() => handleChooseLot(linkedLot.id, true)}
                      >
                        品鉴产区代表豆 {linkedLot.lotCode} →
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. Interactive Roast Agtron Curve & Golden-Cup Extraction Dossier */}
        <section
          id="coffee-golden-cup-bench"
          ref={benchRef}
          aria-label="Agtron 烘焙发展曲线与金杯手冲浓缩档案台"
        >
          <div className="coffee-sec-head">
            <div>
              <span className="coffee-sec-kicker">
                AGTRON ROAST CURVE &amp; SCA GOLDEN CUP · 烘焙曲线与金杯分段萃取实验台
              </span>
              <h2>生豆热解曲线 × 五维杯测雷达 × 金杯冲煮处方</h2>
            </div>
            <span className="coffee-sec-sub">
              点击曲线烘焙度节点或下方麻袋批次卡，实时切换 Agtron 色值与分段注水方案
            </span>
          </div>

          <article className="coffee-lab-bench" data-testid="coffee-active-bench">
            <div className="coffee-bench-banner">
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                <span className="coffee-lot-serial">{activeSpecimen.lotCode}</span>
                <span className="coffee-tag mono">{activeSpecimen.roastLabel}</span>
                {activeSpecimen.agtronScore && (
                  <span
                    className="coffee-tag mono"
                    style={{
                      background: "#2B1911",
                      color: "#FAF7F1",
                      borderColor: "#C86D3B",
                      fontWeight: 700,
                    }}
                  >
                    🎯 {activeSpecimen.agtronScore}
                  </span>
                )}
                <span className="coffee-tag">{activeSpecimen.processLabel}</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "#4E3529" }}>
                📍 {activeSpecimen.originLabel} ({activeSpecimen.elevationMeters})
              </span>
            </div>

            <div className="coffee-bench-grid">
              {/* Left Column: Interactive Roast Agtron Curve + 5-Axis Sensory Radar */}
              <div className="coffee-roast-panel">
                <div className="coffee-curve-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                    <span className="coffee-mono-label" style={{ marginBottom: 0 }}>
                      BEAN TEMP &amp; AGTRON ROAST PROFILE · 烘焙升温与下豆发展点
                    </span>
                    <small style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#C86D3B" }}>
                      点击节点切换烘焙度样板
                    </small>
                  </div>

                  <svg
                    className="coffee-curve-svg"
                    viewBox="0 0 430 195"
                    role="img"
                    aria-label="咖啡烘焙温度曲线与 Agtron 节点"
                  >
                    <rect x="38" y="14" width="376" height="146" fill="#FAF7F1" stroke="#C4B399" />
                    {/* Phase Zones: Drying -> Maillard -> Development */}
                    <rect x="38" y="14" width="110" height="146" fill="rgba(44, 110, 99, 0.06)" />
                    <rect x="148" y="14" width="82" height="146" fill="rgba(212, 136, 42, 0.09)" />
                    <rect x="230" y="14" width="184" height="146" fill="rgba(200, 109, 59, 0.11)" />

                    <line x1="148" y1="14" x2="148" y2="160" stroke="#C4B399" strokeDasharray="3 3" />
                    <line x1="230" y1="14" x2="230" y2="160" stroke="#B23A2C" strokeDasharray="3 3" />

                    <text x="92" y="28" textAnchor="middle" fill="#2C6E63" fontSize="8" fontFamily="monospace">
                      脱水期 DRYING
                    </text>
                    <text x="189" y="28" textAnchor="middle" fill="#9A5B25" fontSize="8" fontFamily="monospace">
                      梅纳反应 MAILLARD
                    </text>
                    <text x="322" y="28" textAnchor="middle" fill="#B23A2C" fontSize="8" fontFamily="monospace">
                      一爆后风味发展期 DTR
                    </text>

                    {/* RoR Declining Dashed Line */}
                    <path
                      d="M 78 44 Q 170 76, 260 112 T 392 142"
                      fill="none"
                      stroke="#2C6E63"
                      strokeWidth="1.4"
                      strokeDasharray="4 3"
                      opacity="0.7"
                    />
                    <text x="116" y="54" fill="#2C6E63" fontSize="7.8" fontFamily="monospace">
                      RoR 升温斜率递减
                    </text>

                    {/* Bean Temperature S-Curve (Charge -> Turning Point -> 1st Crack -> 2nd Crack) */}
                    <path
                      d="M 44 48 Q 66 144, 92 138 C 132 130, 184 114, 230 98 C 276 80, 336 56, 396 34"
                      fill="none"
                      stroke="#2B1911"
                      strokeWidth="2.5"
                    />

                    {/* First Crack Marker */}
                    <circle cx="230" cy="98" r="3.5" fill="#B23A2C" />
                    <text x="226" y="113" textAnchor="end" fill="#B23A2C" fontSize="8" fontWeight="700">
                      ⚡ 一爆 196℃
                    </text>

                    {/* 5 Interactive Roast Level Nodes */}
                    {ROAST_CURVE_POINTS.map((pt) => {
                      const isCurrent = pt.level === activeSpecimen.roastLevel;
                      return (
                        <g
                          key={pt.level}
                          className="coffee-roast-node"
                          onClick={() => handleSelectRoastLevel(pt.level)}
                        >
                          {isCurrent && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="12"
                              fill="rgba(200, 109, 59, 0.25)"
                              stroke="#C86D3B"
                              strokeWidth="1.4"
                            />
                          )}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isCurrent ? "6.8" : "5"}
                            fill={pt.beanHex}
                            stroke="#FAF7F1"
                            strokeWidth="1.6"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 10}
                            textAnchor="middle"
                            fill={isCurrent ? "#B23A2C" : "#4E3529"}
                            fontSize={isCurrent ? "8.8" : "7.8"}
                            fontWeight={isCurrent ? "700" : "500"}
                          >
                            {pt.agtronRef}
                          </text>
                        </g>
                      );
                    })}

                    {/* Axes Labels */}
                    <text x="226" y="182" textAnchor="middle" fill="#5E4335" fontSize="8.5" fontFamily="monospace">
                      ROAST TIME (0:00 → 回温点 TP → 1st Crack → 下豆冷却 Drop)
                    </text>
                    <text
                      x="14"
                      y="90"
                      textAnchor="middle"
                      fill="#5E4335"
                      fontSize="8.5"
                      fontFamily="monospace"
                      transform="rotate(-90 14 90)"
                    >
                      BEAN TEMP (℃)
                    </text>
                  </svg>

                  <div style={{ marginTop: "0.45rem", fontSize: "0.78rem", color: "#4E3529", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span>
                      <strong>{activeRoastNode.shortLabel}</strong> · 参考下豆温 {activeRoastNode.dropTempC}℃ (DTR {activeRoastNode.dtrPct})
                    </span>
                    <span style={{ color: "#7D6355" }}>{activeRoastNode.chemicalFocus}</span>
                  </div>
                </div>

                {/* 5-Axis Sensory Radar + Crema/Liquor Swatch + Flavor Notes */}
                <div className="coffee-sensory-box">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span
                        className="zw-liquor-ring"
                        style={{
                          background: activeSpecimen.cremaOrLiquorHex,
                          width: 32,
                          height: 32,
                        }}
                      />
                      <div>
                        <span className="coffee-mono-label" style={{ marginBottom: 0 }}>
                          CREMA / LIQUOR HUE
                        </span>
                        <strong style={{ fontSize: "0.86rem" }}>
                          豆种：{activeSpecimen.varietal}
                        </strong>
                      </div>
                    </div>

                    <div>
                      <span className="coffee-mono-label">CUPPING FLAVOR WHEEL · 干湿香与啜吸风味记述</span>
                      <div className="coffee-lot-notes">
                        {activeSpecimen.flavorNotes.map((note) => (
                          <span key={note} className="coffee-tag" style={{ borderColor: "#2B1911", fontWeight: 600 }}>
                            ✦ {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <CoffeeSensoryRadarChart
                    radar={activeSpecimen.sensoryRadar}
                    accentHex={activeSpecimen.cremaOrLiquorHex}
                  />
                </div>
              </div>

              {/* Right Column: Detailed Golden-Cup Extraction Dossier */}
              <div className="coffee-recipe-panel">
                <div>
                  <span className="coffee-mono-label">
                    GOLDEN CUP EXTRACTION DOSSIER · 金杯冲煮与浓缩参数档案
                  </span>
                  <h3 className="coffee-recipe-title">{activeSpecimen.title}</h3>
                </div>

                <EditorialDrinkPhoto
                  className="coffee-bench-photo"
                  src={assetUrl(activeSpecimen.photoUrl!)}
                  alt={`${activeSpecimen.title}实拍`}
                  aspectRatio="4/3"
                  accentHex={activeSpecimen.cremaOrLiquorHex}
                  badge={activeSpecimen.lotCode}
                  caption={`${activeSpecimen.originLabel} · ${activeSpecimen.processLabel}`}
                  fallbackKind="coffee-cherry"
                />

                <p className="coffee-tagline-quote">「{activeSpecimen.tagline}」</p>

                <div className="coffee-plain-telemetry" aria-label="专业参数白话解读">
                  <span title="Agtron 数字越高通常烘得越浅">Agtron #78 → 极浅烘保留花果酸香</span>
                  <span title="DTR 是一爆后发展时间占总烘焙时间的比例">DTR 13.5% → 发展期短锁住茉莉甜感</span>
                  <span title="1 克咖啡粉搭配约 16 克水">1:16 → 清透手冲黄金粉水比</span>
                </div>

                <div className="coffee-brew-apparatus">
                  <span>
                    <strong>推荐滤杯 / 萃取设备：</strong>
                    {activeSpecimen.goldenCup.brewMethod}
                  </span>
                  <span className="coffee-tag mono">
                    研磨度：{activeSpecimen.goldenCup.grindSizeLabel}
                  </span>
                </div>

                <div className="coffee-recipe-matrix">
                  <div className="coffee-param-box">
                    <span className="coffee-mono-label">DOSE · 粉量</span>
                    <strong>{activeSpecimen.goldenCup.doseGrams} g</strong>
                  </div>
                  <div className="coffee-param-box">
                    <span className="coffee-mono-label">YIELD · 目标液重</span>
                    <strong>{activeSpecimen.goldenCup.yieldMlOrGrams} g / ml</strong>
                  </div>
                  <div className="coffee-param-box">
                    <span className="coffee-mono-label">BREW RATIO · 粉水比</span>
                    <strong>{activeSpecimen.goldenCup.ratioLabel}</strong>
                  </div>
                  <div className="coffee-param-box">
                    <span className="coffee-mono-label">WATER TEMP · 水温</span>
                    <strong>{activeSpecimen.goldenCup.waterTempCelsius} ℃</strong>
                  </div>
                  <div className="coffee-param-box">
                    <span className="coffee-mono-label">TOTAL TIME · 总时长</span>
                    <strong>{formatDurationSec(activeSpecimen.goldenCup.totalTimeSec)}</strong>
                  </div>
                  <div className="coffee-param-box">
                    <span className="coffee-mono-label">AGTRON · 烘焙色值</span>
                    <strong>{activeSpecimen.agtronScore?.split(" ")[1] ?? "#72"}</strong>
                  </div>
                </div>

                <div>
                  <span className="coffee-mono-label">
                    STAGE-BY-STAGE POURING &amp; PRESSURE PROTOCOL · 分段注水/压萃计时轴
                  </span>
                  <div className="coffee-stages-list">
                    {activeSpecimen.goldenCup.pourStages.map((stage, idx) => (
                      <div key={stage} className="coffee-stage-step">
                        <span className="coffee-stage-idx">STAGE 0{idx + 1}</span>
                        <p>{stage}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="coffee-roaster-note">
                  <strong>烘焙师与咖啡师审评手记：</strong>
                  {activeSpecimen.previewNote}
                </p>

                <div className="coffee-bench-actions">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#6E5346" }}>
                    数据同步至跨馆「酌味品饮护照」({activeSpecimen.lotCode})
                  </span>
                  <div className="coffee-fp-group">
                    <button
                      type="button"
                      className={`coffee-fp-btn${activeIsTasted ? " tasted" : ""}`}
                      data-testid="coffee-bench-toggle-tasted"
                      onClick={() => toggleTasted(activeFootprint)}
                    >
                      {activeIsTasted ? "✓ 已杯测喝过" : "+ 标记喝过"}
                    </button>
                    <button
                      type="button"
                      className={`coffee-fp-btn${activeIsWished ? " wished" : ""}`}
                      data-testid="coffee-bench-toggle-wishlist"
                      onClick={() => toggleWishlist(activeFootprint)}
                    >
                      {activeIsWished ? "★ 已入寻豆单" : "♡ 想喝"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* 4. Perforated Bean-Bag Lot Specimen Cards */}
        <section id="coffee-lot-archive" aria-label="烘焙工坊麻袋微批次豆单">
          <div className="coffee-sec-head">
            <div>
              <span className="coffee-sec-kicker">
                ROASTERY LOT ARCHIVE · 生豆麻袋穿孔批次签 ({filteredLots.length} 支)
              </span>
              <h2>馆藏精品微批次寻豆单 · 点击切换上方金杯处方</h2>
            </div>

            <div className="coffee-zone-pills" role="group" aria-label="豆单产区带筛选">
              {BELT_ZONE_META.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`coffee-zone-pill${lotFilterZone === z.id ? " active" : ""}`}
                  onClick={() => setLotFilterZone(z.id)}
                >
                  {z.id === "all" ? `全部豆单 (${coffeeBlueprint.specimens.length})` : z.label.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>

          <div className="coffee-lot-grid">
            {filteredLots.map((lot) => {
              const isCurrent = lot.id === activeSpecimen.id;
              const rec = coffeeSpecimenToFootprint(lot);
              const tasted = isTasted(lot.id);
              const wished = isWishlisted(lot.id);

              return (
                <article
                  key={lot.id}
                  className={`coffee-lot-card${isCurrent ? " active" : ""}`}
                  data-testid={`coffee-lot-card-${lot.id}`}
                  onClick={() => handleChooseLot(lot.id, true)}
                >
                  <div className="coffee-lot-perforation">
                    <strong>{lot.lotCode}</strong>
                    <span>{lot.agtronScore?.split(" / ")[0] ?? lot.roastLabel}</span>
                  </div>

                  <div className="coffee-lot-body">
                    <EditorialDrinkPhoto
                      className="coffee-lot-photo"
                      src={assetUrl(lot.photoUrl!)}
                      alt={`${lot.title}批次实拍`}
                      aspectRatio="4/3"
                      accentHex={lot.cremaOrLiquorHex}
                      fallbackKind="coffee-cherry"
                    />
                    <div className="coffee-lot-head">
                      <span
                        className="zw-liquor-ring"
                        style={{ background: lot.cremaOrLiquorHex }}
                      />
                      <span className="coffee-tag mono">{lot.goldenCup.ratioLabel} · {lot.goldenCup.waterTempCelsius}℃</span>
                    </div>

                    <h4>{lot.title}</h4>

                    <div className="coffee-lot-specs">
                      <span>⛰️ {lot.elevationMeters}</span>
                      <span>⚙️ {lot.process.toUpperCase()}</span>
                    </div>

                    <p style={{ fontSize: "0.78rem", color: "#5E4335", lineHeight: 1.5 }}>
                      {lot.originLabel}
                    </p>

                    <div className="coffee-lot-notes">
                      {lot.flavorNotes.slice(0, 3).map((note) => (
                        <span key={note} className="coffee-tag">
                          {note}
                        </span>
                      ))}
                    </div>

                    <div className="coffee-lot-foot">
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.71rem",
                          fontWeight: 700,
                          color: isCurrent ? "#C86D3B" : "#7D6355",
                        }}
                      >
                        {isCurrent ? "● 当前载入实验台" : "载入金杯台 →"}
                      </span>

                      <div style={{ display: "flex", gap: "0.32rem" }}>
                        <button
                          type="button"
                          className={`coffee-mini-btn${tasted ? " on" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTasted(rec);
                          }}
                        >
                          {tasted ? "✓ 喝过" : "+ 喝过"}
                        </button>
                        <button
                          type="button"
                          className={`coffee-mini-btn${wished ? " wish" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(rec);
                          }}
                        >
                          {wished ? "★ 想喝" : "♡ 想喝"}
                        </button>
                      </div>
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
