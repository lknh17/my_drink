import { useEffect, useMemo, useState } from "react";
import {
  TEA_CATEGORY_SHORT_META,
  TEA_WARE_CATEGORY_LABELS,
  type TeaCategoryId,
  type TeaCompendiumBundle,
  type TeaMonograph,
  type TeaPairingRule,
  type TeaWareCategoryId,
  type TeaWareItem,
} from "../types";
import {
  LiquorCupBadge,
  resolveMatchingWareId,
  SongRunningHead,
  TeaEditorialPhoto,
} from "./LiquorCupBadge";

export interface TeaWareGalleryViewProps {
  bundle: TeaCompendiumBundle;
  selectedCategory: TeaCategoryId | "all";
  selectedTeaId?: string | null;
  selectedWareId?: string | null;
  onSelectCategory: (cat: TeaCategoryId | "all") => void;
  onSelectWare?: (wareId: string | null) => void;
  onOpenTea: (teaId: string, category?: TeaCategoryId) => void;
  onJumpToSpectrum?: (cat: TeaCategoryId) => void;
}

const CATEGORY_ORDER: TeaCategoryId[] = [
  "green",
  "white",
  "yellow",
  "oolong",
  "black",
  "dark",
  "scented",
];

const WARE_CATEGORY_ORDER: TeaWareCategoryId[] = [
  "zisha",
  "gaiwan",
  "jianzhan",
  "celadon",
  "chaozhou",
  "kettle",
];

const WARE_CATEGORY_ACCENTS: Record<TeaWareCategoryId, string> = {
  zisha: "#A6402C",
  gaiwan: "#35685F",
  jianzhan: "#2E3D44",
  celadon: "#467A70",
  chaozhou: "#9A5B25",
  kettle: "#5B554E",
};

const WARE_CATEGORY_SUBTITLES: Record<TeaWareCategoryId, string> = {
  zisha: "双气孔胎骨 · 聚香蓄热养包浆",
  gaiwan: "零气孔白瓷 · 明镜试茶不夺香",
  jianzhan: "高铁厚胎 · 蓄热软水斗茶盏",
  celadon: "温润如玉 · 玛瑙入釉映汤色",
  chaozhou: "朱泥薄胎 · 孟臣若深工夫席",
  kettle: "银铁煮水 · 活水提温发老韵",
};

const FALLBACK_PAIRING_RULES: Record<
  TeaCategoryId,
  Omit<TeaPairingRule, "recommendedWareIds">
> = {
  green: {
    teaCategory: "green",
    waterTempRange: "80℃ – 85℃",
    scientificRationale:
      "绿茶未经发酵，富含鲜灵茶氨酸与易氧化叶绿素。宜择敞口高透玻璃杯或薄胎白瓷盖碗，导热散热迅捷，避免高温积热导致芽叶黄熟与儿茶素过量析出苦涩。",
    tabooNote:
      "切忌厚壁紫砂壶合盖高温闷泡，否则嫩芽瞬间熟汤褐变，尽失清鲜豆兰本香。",
  },
  white: {
    teaCategory: "white",
    waterTempRange: "88℃ – 95℃（老白茶可沸水煮饮）",
    scientificRationale:
      "新白茶毫香清鲜，宜用零气孔薄胎白瓷盖碗快进快出以锁住毫香蜜韵；三年以上陈年老白茶内含黄酮与多糖转化丰厚，宜用紫泥壶闷泡或银壶/老陶壶文火慢煮。",
    tabooNote:
      "新白毫银针忌沸水直击芽心与紫砂闷泡；陈年寿眉若用过薄敞口杯低温冲泡则难激枣香药韵。",
  },
  yellow: {
    teaCategory: "yellow",
    waterTempRange: "85℃ – 88℃",
    scientificRationale:
      "黄茶经轻度闷黄，兼具嫩芽鲜醇与温和甘香。薄胎白瓷盖碗或汝窑青瓷杯既能适度散热护嫩芽，又可清晰观赏君山银针「三起三落」或黄汤明净之态。",
    tabooNote:
      "忌吸附性过强之粗砂泥壶夺去清雅甜醇毫香，亦忌滚水久坐闷坏嫩黄叶底。",
  },
  oolong: {
    teaCategory: "oolong",
    waterTempRange: "96℃ – 100℃ 滚沸水",
    scientificRationale:
      "乌龙茶富含高沸点芳香萜烯醇与焙火吡嗪类物质。潮州朱泥小品壶与高白薄胎盖碗收缩率高、胎质致密，聚热扬香极佳；传统紫砂水平壶双气孔结构更可修饰足火岩茶燥感，令茶汤醇厚顺滑。",
    tabooNote:
      "忌大肚宽口低温慢泡（温度不足则高沸点兰花香、桂皮香与岩韵锁于叶内无法释放）；高香单丛慎用气孔过粗之段泥壶吸香。",
  },
  black: {
    teaCategory: "black",
    waterTempRange: "88℃ – 92℃（金骏眉等嫩芽 85℃）",
    scientificRationale:
      "全发酵红茶茶黄素与茶红素丰盈，汤色红艳金圈。景德镇高白瓷盖碗内壁洁白如雪，最能映衬「金圈琥珀光」并忠实还原花果蜜糖香；陈年滇红或正山小种亦可配绛坡泥/朱泥小壶增稠润感。",
    tabooNote:
      "细嫩芽头红茶切忌 100℃ 沸水紧盖闷泡，否则极易泛酸显涩、掩盖清甜花蜜香。",
  },
  dark: {
    teaCategory: "dark",
    waterTempRange: "98℃ – 100℃ 沸水冲泡或煮饮",
    scientificRationale:
      "普洱熟茶、陈年生普、安化黑茶及六堡茶内质深沉。宜兴底槽清/紫泥紫砂壶具备优良双气孔透气性与高蓄热值，能持续维持 95℃+ 高温激发陈香木质韵，同时吸附微弱堆味仓味；配铁壶或银壶煮水更添山泉软滑活性。",
    tabooNote:
      "忌水温低于 92℃（低温水散漫浮于表面，汤薄寡淡且易显水味）；紫砂壶须严格「一壶侍一茶」，切忌生熟混泡串味。",
  },
  scented: {
    teaCategory: "scented",
    waterTempRange: "88℃ – 92℃",
    scientificRationale:
      "茉莉花茶等再加工窨制茶灵魂在于鲜灵吐香与冰糖甜韵。必须选用零气孔高温白瓷或青花三才盖碗，揭盖即闻高扬鲜花芬芳，釉面丝毫不吸夺花魂。",
    tabooNote:
      "严忌与普洱、重焙火岩茶共用紫砂壶——多孔陶土不仅吸尽清雅茉莉花香，更会令整把紫砂壶永久串味。",
  },
};

function WareMiniSvg({
  category,
  color = "currentColor",
}: {
  category: TeaWareCategoryId;
  color?: string;
}) {
  switch (category) {
    case "zisha":
      return (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <ellipse cx="14" cy="16" rx="7.5" ry="5.5" stroke={color} strokeWidth="1.7" />
          <path d="M 9.5 11.5 Q 14 9.5 18.5 11.5" stroke={color} strokeWidth="1.5" />
          <circle cx="14" cy="9.2" r="1.3" fill={color} />
          <path d="M 6.5 15 Q 3.5 13 3 11.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 21.5 14 Q 25 14 24.5 17.5 Q 24 19.5 21 18.5" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case "gaiwan":
      return (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M 6 12 Q 14 21 22 12 Z" stroke={color} strokeWidth="1.7" />
          <path d="M 7.5 10.8 Q 14 7.5 20.5 10.8" stroke={color} strokeWidth="1.6" />
          <line x1="12" y1="7.6" x2="16" y2="7.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="14" cy="20.5" rx="7.5" ry="1.8" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "jianzhan":
      return (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M 5 9.5 L 10.5 19.5 L 17.5 19.5 L 23 9.5 Z" stroke={color} strokeWidth="1.8" />
          <rect x="11.2" y="19.5" width="5.6" height="1.8" fill={color} />
          <line x1="14" y1="11" x2="14" y2="17.5" stroke={color} strokeWidth="1.2" strokeDasharray="1.5 1.5" />
        </svg>
      );
    case "chaozhou":
      return (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <ellipse cx="11.5" cy="15.5" rx="5.5" ry="4.2" stroke={color} strokeWidth="1.6" />
          <circle cx="11.5" cy="10.5" r="1.1" fill={color} />
          <path d="M 6 14.5 L 3.2 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 19.5 15.5 Q 20.2 19 22 19 Q 23.8 19 24.5 15.5 Z" stroke={color} strokeWidth="1.5" />
          <line x1="3.5" y1="21" x2="25" y2="21" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "kettle":
      return (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M 9 12 Q 9 5.5 14 5.5 Q 19 5.5 19 12" stroke={color} strokeWidth="1.6" />
          <rect x="7.5" y="12" width="13" height="9" rx="3.5" stroke={color} strokeWidth="1.7" />
          <path d="M 7.5 15.5 Q 4.5 14.5 4 12.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M 7.5 10.5 Q 8.8 19 14 19 Q 19.2 19 20.5 10.5 Z" stroke={color} strokeWidth="1.7" />
          <ellipse cx="14" cy="20.8" rx="8" ry="1.6" stroke={color} strokeWidth="1.4" />
        </svg>
      );
  }
}

export function TeaWareGalleryView({
  bundle,
  selectedCategory,
  selectedTeaId = null,
  selectedWareId = null,
  onSelectCategory,
  onSelectWare,
  onOpenTea,
  onJumpToSpectrum,
}: TeaWareGalleryViewProps) {
  const initialCategory: TeaCategoryId = useMemo(() => {
    if (selectedCategory !== "all") return selectedCategory;
    if (selectedTeaId) {
      const found = bundle.monographs.find((t) => t.id === selectedTeaId);
      if (found) return found.category;
    }
    return bundle.pairingMatrix[0]?.teaCategory ?? "oolong";
  }, [selectedCategory, selectedTeaId, bundle.monographs, bundle.pairingMatrix]);

  const [matcherCategory, setMatcherCategory] = useState<TeaCategoryId>(initialCategory);
  const [pickedTeaId, setPickedTeaId] = useState<string>(selectedTeaId ?? "");
  const [wareCatFilter, setWareCatFilter] = useState<TeaWareCategoryId | "all">("all");
  const [onlyRecommendedForMatcher, setOnlyRecommendedForMatcher] = useState(false);

  // Sync matcher category when external selectedCategory changes
  useEffect(() => {
    if (selectedCategory !== "all") {
      setMatcherCategory(selectedCategory);
      setPickedTeaId((prev) => {
        if (!prev) return "";
        const found = bundle.monographs.find((m) => m.id === prev);
        return found && found.category === selectedCategory ? prev : "";
      });
    }
  }, [selectedCategory, bundle.monographs]);

  // Sync picked tea when external selectedTeaId arrives (e.g. jumping from MonographReader)
  useEffect(() => {
    if (!selectedTeaId) return;
    const found = bundle.monographs.find((m) => m.id === selectedTeaId);
    if (found) {
      setPickedTeaId(found.id);
      setMatcherCategory(found.category);
    }
  }, [selectedTeaId, bundle.monographs]);

  // Ensure externally highlighted vessel is visible in the cabinet and scroll gently to it
  useEffect(() => {
    if (!selectedWareId) return;
    const targetWare = bundle.teaware.find((w) => w.id === selectedWareId);
    if (!targetWare) return;

    if (wareCatFilter !== "all" && targetWare.category !== wareCatFilter) {
      setWareCatFilter("all");
    }
    if (onlyRecommendedForMatcher) {
      setOnlyRecommendedForMatcher(false);
    }

    const timer = window.setTimeout(() => {
      const el = document.getElementById(`tea-ware-card-${selectedWareId}`);
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [selectedWareId, bundle.teaware, wareCatFilter, onlyRecommendedForMatcher]);

  const activePickedTea = useMemo<TeaMonograph | null>(() => {
    if (!pickedTeaId) return null;
    return bundle.monographs.find((m) => m.id === pickedTeaId) ?? null;
  }, [pickedTeaId, bundle.monographs]);

  // Active pairing rule from bundle.pairingMatrix with complete scholarly fallback
  const activePairingRule = useMemo<TeaPairingRule>(() => {
    const exact = bundle.pairingMatrix.find((r) => r.teaCategory === matcherCategory);
    const fb = FALLBACK_PAIRING_RULES[matcherCategory];
    const fallbackWareIds = bundle.teaware
      .filter((w) => w.bestForCategories.includes(matcherCategory))
      .map((w) => w.id);

    if (exact) {
      return {
        teaCategory: matcherCategory,
        recommendedWareIds:
          exact.recommendedWareIds.length > 0 ? exact.recommendedWareIds : fallbackWareIds,
        waterTempRange: exact.waterTempRange || fb.waterTempRange,
        scientificRationale: exact.scientificRationale || fb.scientificRationale,
        tabooNote: exact.tabooNote || fb.tabooNote,
      };
    }

    return {
      ...fb,
      teaCategory: matcherCategory,
      recommendedWareIds: fallbackWareIds,
    };
  }, [bundle.pairingMatrix, bundle.teaware, matcherCategory]);

  // Resolve optimal TeaWareItems for the active matcher state
  const recommendedWares = useMemo<TeaWareItem[]>(() => {
    const map = new Map<string, TeaWareItem>();
    for (const w of bundle.teaware) map.set(w.id, w);

    const ordered: TeaWareItem[] = [];
    const seen = new Set<string>();

    // If a specific tea is chosen, prioritize its resolved vessel first
    if (activePickedTea) {
      const matchedSpecificId = resolveMatchingWareId(
        activePickedTea.brewing.vessel,
        bundle.teaware,
        activePickedTea.category,
      );
      if (matchedSpecificId && map.has(matchedSpecificId)) {
        seen.add(matchedSpecificId);
        ordered.push(map.get(matchedSpecificId)!);
      }
    }

    for (const wid of activePairingRule.recommendedWareIds) {
      const item = map.get(wid);
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        ordered.push(item);
      }
    }

    if (ordered.length === 0) {
      for (const w of bundle.teaware) {
        if (w.bestForCategories.includes(matcherCategory) && !seen.has(w.id)) {
          seen.add(w.id);
          ordered.push(w);
        }
      }
    }

    return ordered;
  }, [bundle.teaware, activePairingRule, activePickedTea, matcherCategory]);

  const recommendedWareIdSet = useMemo(
    () => new Set(recommendedWares.map((w) => w.id)),
    [recommendedWares],
  );

  // Teas in current matcher category for quick chip selection
  const categorySampleTeas = useMemo(
    () => bundle.monographs.filter((m) => m.category === matcherCategory).slice(0, 6),
    [bundle.monographs, matcherCategory],
  );

  // Highlighted ware item if selectedWareId is active
  const highlightedWare = useMemo<TeaWareItem | null>(() => {
    if (!selectedWareId) return null;
    return bundle.teaware.find((w) => w.id === selectedWareId) ?? null;
  }, [selectedWareId, bundle.teaware]);

  // Counts per 6 teaware categories
  const wareCategoryCounts = useMemo(() => {
    const counts: Record<TeaWareCategoryId, number> = {
      zisha: 0,
      gaiwan: 0,
      jianzhan: 0,
      celadon: 0,
      chaozhou: 0,
      kettle: 0,
    };
    for (const w of bundle.teaware) {
      counts[w.category] = (counts[w.category] ?? 0) + 1;
    }
    return counts;
  }, [bundle.teaware]);

  // Filtered teaware items in the 6-Category Museum Cabinet
  const filteredTeaware = useMemo(() => {
    return bundle.teaware.filter((w) => {
      if (wareCatFilter !== "all" && w.category !== wareCatFilter) return false;
      if (onlyRecommendedForMatcher) {
        return (
          recommendedWareIdSet.has(w.id) || w.bestForCategories.includes(matcherCategory)
        );
      }
      return true;
    });
  }, [bundle.teaware, wareCatFilter, onlyRecommendedForMatcher, recommendedWareIdSet, matcherCategory]);

  function handlePickMatcherCategory(catId: TeaCategoryId) {
    setMatcherCategory(catId);
    if (activePickedTea && activePickedTea.category !== catId) {
      setPickedTeaId("");
    }
    onSelectCategory(catId);
  }

  function handlePickSpecificTea(teaId: string) {
    setPickedTeaId(teaId);
    if (!teaId) return;
    const found = bundle.monographs.find((m) => m.id === teaId);
    if (found) {
      setMatcherCategory(found.category);
      onSelectCategory(found.category);
      const matchedWareId = resolveMatchingWareId(
        found.brewing.vessel,
        bundle.teaware,
        found.category,
      );
      if (matchedWareId) {
        onSelectWare?.(matchedWareId);
      }
    }
  }

  function handleFocusWareCard(wareId: string) {
    onSelectWare?.(wareId);
    const el = document.getElementById(`tea-ware-card-${wareId}`);
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  const activeCatMeta = TEA_CATEGORY_SHORT_META[matcherCategory];

  return (
    <div className="tea-ware-view" data-testid="tea-ware-gallery-view">
      {/* 1. Interactive 看茶择器 Scientific Matcher */}
      <section className="tea-folio-panel" aria-label="看茶择器热力学与材质配伍矩阵">
        <SongRunningHead
          volumeTag="茗典 · 卷四 · 器道"
          title="中华茶器图谱与「看茶择器」科学配伍矩阵"
          subtitle="器为茶之父：从双气孔率吸附、釉面致密度、导热系数与蓄热散热动力学，推演每一席茶的黄金司茶器皿"
          rightSlot={
            <span>
              馆藏经典茶器 {bundle.teaware.length} 席 · 配伍法则 {Math.max(7, bundle.pairingMatrix.length)} 席
            </span>
          }
        />

        <div className="tea-matcher-layout">
          {/* Left Selector Console: Pick by 7 TeaCategoryIds OR Specific TeaMonograph */}
          <div className="tea-matcher-console" data-testid="teaware-matcher-console">
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}>
                  壹 · 按七大茶类择器
                </strong>
                <span style={{ fontSize: "0.73rem", color: "var(--tea-ink-muted)" }}>
                  点选茶类即时演算
                </span>
              </div>

              <div className="tea-matcher-cat-grid" role="group" aria-label="看茶择器茶类选择">
                {CATEGORY_ORDER.map((cid) => {
                  const meta = TEA_CATEGORY_SHORT_META[cid];
                  const isSelected = matcherCategory === cid;
                  return (
                    <button
                      key={cid}
                      type="button"
                      className={`tea-matcher-cat-btn${isSelected ? " active" : ""}`}
                      data-testid={`matcher-cat-btn-${cid}`}
                      onClick={() => handlePickMatcherCategory(cid)}
                    >
                      <LiquorCupBadge liquorColorHex={meta.liquorHex} size="xs" />
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", display: "block" }}>
                          {meta.shortLabel}
                        </strong>
                        <small style={{ fontSize: "0.7rem", color: "var(--tea-ink-muted)" }}>
                          {meta.name.split("·")[1]?.trim() ?? "传统工艺"}
                        </small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ paddingTop: "0.75rem", borderTop: "1px dashed var(--tea-rule-outer)" }}>
              <label
                htmlFor="tea-matcher-monograph-select"
                style={{
                  display: "block",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: "0.94rem",
                  marginBottom: "0.45rem",
                }}
              >
                贰 · 或指定馆藏名茶精准配器
              </label>

              <select
                id="tea-matcher-monograph-select"
                className="tea-matcher-select"
                data-testid="matcher-tea-select"
                value={pickedTeaId}
                onChange={(e) => handlePickSpecificTea(e.target.value)}
              >
                <option value="">
                  — 查看「{activeCatMeta.shortLabel}」全品类通用配器法则 —
                </option>
                {CATEGORY_ORDER.map((cid) => {
                  const groupTeas = bundle.monographs.filter((m) => m.category === cid);
                  if (groupTeas.length === 0) return null;
                  return (
                    <optgroup key={cid} label={TEA_CATEGORY_SHORT_META[cid].name}>
                      {groupTeas.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}（{t.subStyle} · 推荐：{t.brewing.vessel}）
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>

              {categorySampleTeas.length > 0 && (
                <div style={{ marginTop: "0.6rem" }}>
                  <small style={{ display: "block", fontSize: "0.73rem", color: "var(--tea-ink-muted)", marginBottom: "0.35rem" }}>
                    「{activeCatMeta.shortLabel}」代表茶款速选：
                  </small>
                  <div className="zw-chip-row">
                    {categorySampleTeas.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`zw-chip${pickedTeaId === t.id ? " on" : ""}`}
                        style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}
                        onClick={() =>
                          handlePickSpecificTea(pickedTeaId === t.id ? "" : t.id)
                        }
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Scientific Pairing Readout */}
          <div className="tea-matcher-readout" data-testid="teaware-matcher-readout">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.88rem" }}>
              {/* Top Category & Water Temp Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <LiquorCupBadge
                    liquorColorHex={
                      activePickedTea ? activePickedTea.liquorColorHex : activeCatMeta.liquorHex
                    }
                    size="md"
                  />
                  <div>
                    <span className="zw-search-badge" style={{ borderColor: "var(--tea-celadon)", color: "var(--tea-celadon)" }}>
                      看茶择器诊断 · {activeCatMeta.name}
                    </span>
                    <h3 style={{ fontSize: "1.24rem", marginTop: "0.22rem" }}>
                      {activePickedTea
                        ? `《${activePickedTea.title}》与${activeCatMeta.shortLabel}配器方案`
                        : `${activeCatMeta.shortLabel}黄金择器与热力学配伍`}
                    </h3>
                  </div>
                </div>

                <div
                  className="tea-spec-cell"
                  style={{ padding: "0.48rem 0.85rem", borderColor: "var(--tea-amber)", background: "var(--tea-ivory)" }}
                >
                  <span className="tea-spec-label">科学注水温域</span>
                  <strong className="tea-spec-val" style={{ color: "var(--tea-amber)" }} data-testid="matcher-water-temp">
                    🌡️ {activePairingRule.waterTempRange}
                  </strong>
                </div>
              </div>

              {/* Specific Monograph Brewing Callout when a tea is selected */}
              {activePickedTea && (
                <div
                  className="tea-dossier-box"
                  style={{
                    borderColor: "var(--tea-celadon)",
                    background: "linear-gradient(180deg, #FCFBF7 0%, #EEF4F1 100%)",
                  }}
                  data-testid="matcher-specific-tea-box"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
                    <h5 style={{ margin: 0, fontSize: "0.82rem", color: "var(--tea-celadon-deep)" }}>
                      🍵 单茶行家司茶档案 · 《{activePickedTea.title}》（{activePickedTea.subStyle}）
                    </h5>
                    <div className="zw-chip-row">
                      <button
                        type="button"
                        className="zw-chip"
                        style={{ fontSize: "0.73rem", padding: "0.15rem 0.5rem" }}
                        onClick={() => onOpenTea(activePickedTea.id, activePickedTea.category)}
                      >
                        披阅单茶本纪 →
                      </button>
                      <button
                        type="button"
                        className="zw-chip"
                        style={{ fontSize: "0.73rem", padding: "0.15rem 0.5rem" }}
                        onClick={() => setPickedTeaId("")}
                      >
                        × 返回茶类通则
                      </button>
                    </div>
                  </div>
                  <p style={{ marginTop: "0.35rem", fontSize: "0.83rem", color: "var(--tea-ink)" }}>
                    <strong>本席点名茶器：</strong>
                    {activePickedTea.brewing.vessel} · <strong>定点水温：</strong>
                    {activePickedTea.brewing.tempCelsius}℃ · <strong>投茶比：</strong>
                    {activePickedTea.brewing.leafGrams}g / {activePickedTea.brewing.waterMl}ml
                  </p>
                  <p style={{ marginTop: "0.18rem", fontSize: "0.79rem", color: "var(--tea-ink-secondary)" }}>
                    <strong>执壶手法：</strong>
                    {activePickedTea.brewing.pouringTechnique}
                  </p>
                </div>
              )}

              {/* Optimal Recommended Vessels */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                  <strong style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem" }}>
                    首选适配茶器（点击卡片在下方博物柜高亮审视）：
                  </strong>
                  {onJumpToSpectrum && (
                    <button
                      type="button"
                      className="zw-chip"
                      style={{ fontSize: "0.74rem", padding: "0.18rem 0.55rem" }}
                      onClick={() => onJumpToSpectrum(matcherCategory)}
                    >
                      查看{activeCatMeta.shortLabel}光谱 →
                    </button>
                  )}
                </div>

                <div className="tea-matcher-ware-grid">
                  {recommendedWares.map((ware, idx) => {
                    const isFocused = selectedWareId === ware.id;
                    return (
                      <button
                        key={ware.id}
                        type="button"
                        className={`tea-matcher-ware-card${isFocused ? " active" : ""}`}
                        data-testid={`matcher-recommended-ware-${ware.id}`}
                        onClick={() => handleFocusWareCard(ware.id)}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem", width: "100%" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: WARE_CATEGORY_ACCENTS[ware.category] }}>
                            <WareMiniSvg category={ware.category} color={WARE_CATEGORY_ACCENTS[ware.category]} />
                            <small style={{ fontWeight: 600, fontSize: "0.74rem" }}>
                              {idx === 0 ? "★ 首选良器" : "适配良器"} · {TEA_WARE_CATEGORY_LABELS[ware.category]}
                            </small>
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "var(--tea-celadon)" }}>定位 ↓</span>
                        </div>
                        <strong style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", color: "var(--tea-ink)" }}>
                          {ware.name}
                        </strong>
                        <small style={{ fontSize: "0.75rem", color: "var(--tea-ink-muted)" }}>
                          {ware.origin} · 容量 {ware.volumeRange}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scientific Material & Thermal Rationale */}
              <div className="tea-dossier-box" data-testid="matcher-scientific-rationale">
                <h5>🔬 胎骨孔隙率 · 导热系数与茶汤化学配伍机理</h5>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.68 }}>
                  {activePairingRule.scientificRationale}
                </p>
              </div>
            </div>

            {/* Taboo Warning Callout */}
            <div className="tea-taboo-callout" data-testid="matcher-taboo-callout">
              <strong style={{ color: "var(--tea-cinnabar)", fontFamily: "var(--font-serif)" }}>
                ⚠️ 司茶择器禁忌：
              </strong>
              {activePairingRule.tabooNote}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Six-Category TeaWare Museum Cabinet */}
      <section className="tea-folio-panel parchment" aria-label="六大茶器博物典藏柜">
        <SongRunningHead
          volumeTag="器道博物典藏"
          title="中华六大茶器谱系 · 窑口泥料与传世器型图志"
          subtitle="甄选宜兴紫砂、景德镇白瓷盖碗、建阳铁胎建盏、汝窑龙泉青瓷、潮汕朱泥手拉壶与金银铁煮水器"
          rightSlot={
            <div className="zw-chip-row">
              {highlightedWare && (
                <button
                  type="button"
                  className="zw-chip on"
                  data-testid="clear-highlighted-ware-btn"
                  onClick={() => onSelectWare?.(null)}
                >
                  ★ 当前点亮：{highlightedWare.name}（点击取消高亮）
                </button>
              )}
              <button
                type="button"
                className={`zw-chip${onlyRecommendedForMatcher ? " on" : ""}`}
                data-testid="cabinet-filter-matcher-only"
                onClick={() => setOnlyRecommendedForMatcher((v) => !v)}
              >
                {onlyRecommendedForMatcher
                  ? `✓ 仅显示「${activeCatMeta.shortLabel}」适泡器皿`
                  : `筛选「${activeCatMeta.shortLabel}」适泡器皿`}
              </button>
            </div>
          }
        />

        {/* 6+1 Category Filter Tabs */}
        <div className="tea-ware-cat-bar" role="tablist" aria-label="六大茶器门类筛选">
          <button
            type="button"
            role="tab"
            aria-selected={wareCatFilter === "all"}
            className={`tea-ware-cat-tab${wareCatFilter === "all" ? " active" : ""}`}
            data-testid="ware-cat-tab-all"
            onClick={() => setWareCatFilter("all")}
          >
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}>全部茶器总览</div>
              <small style={{ fontSize: "0.71rem", opacity: 0.82 }}>六大谱系全收录</small>
            </div>
            <span className="zw-search-badge" style={{ color: "var(--tea-ink)" }}>
              {bundle.teaware.length}
            </span>
          </button>

          {WARE_CATEGORY_ORDER.map((wcid) => {
            const isActive = wareCatFilter === wcid;
            const count = wareCategoryCounts[wcid] ?? 0;
            return (
              <button
                key={wcid}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`tea-ware-cat-tab${isActive ? " active" : ""}`}
                data-testid={`ware-cat-tab-${wcid}`}
                onClick={() => setWareCatFilter(isActive ? "all" : wcid)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.48rem", minWidth: 0 }}>
                  <WareMiniSvg
                    category={wcid}
                    color={isActive ? "#FCFBF7" : WARE_CATEGORY_ACCENTS[wcid]}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.86rem" }}>
                      {TEA_WARE_CATEGORY_LABELS[wcid]}
                    </div>
                    <small style={{ fontSize: "0.69rem", opacity: 0.82, display: "block" }}>
                      {WARE_CATEGORY_SUBTITLES[wcid]}
                    </small>
                  </div>
                </div>
                <span className="zw-search-badge" style={{ color: "var(--tea-ink)", flexShrink: 0 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Museum Cabinet Grid */}
        {filteredTeaware.length === 0 ? (
          <div className="tea-dossier-box" style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <p>当前器类筛选下暂无条目。</p>
            <div style={{ marginTop: "0.65rem" }}>
              <button
                type="button"
                className="zw-pill-btn"
                onClick={() => {
                  setWareCatFilter("all");
                  setOnlyRecommendedForMatcher(false);
                }}
              >
                恢复全部馆藏茶器
              </button>
            </div>
          </div>
        ) : (
          <div className="tea-ware-cabinet-grid">
            {filteredTeaware.map((ware) => {
              const isHighlighted = selectedWareId === ware.id;
              const isMatcherRecommended = recommendedWareIdSet.has(ware.id);
              const accentHex = WARE_CATEGORY_ACCENTS[ware.category] ?? "#35685F";

              const matchingSampleTeas = bundle.monographs
                .filter((t) => ware.bestForCategories.includes(t.category))
                .slice(0, 3);

              return (
                <article
                  key={ware.id}
                  id={`tea-ware-card-${ware.id}`}
                  className={`tea-ware-card${isHighlighted ? " highlighted" : ""}`}
                  data-testid={`tea-ware-card-${ware.id}`}
                >
                  <TeaEditorialPhoto
                    id={ware.id}
                    photoUrl={ware.photoUrl}
                    title={ware.name}
                    subtitle={`${ware.origin} · 容量 ${ware.volumeRange}`}
                    badge={TEA_WARE_CATEGORY_LABELS[ware.category]}
                    accentHex={accentHex}
                    kind="teaware"
                    wareCategory={ware.category}
                    height={196}
                    caption={`${ware.origin} · 黄金容量 ${ware.volumeRange}`}
                  />

                  <div className="tea-ware-card-body">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span
                        className="zw-search-badge"
                        style={{ borderColor: accentHex, color: accentHex }}
                      >
                        {TEA_WARE_CATEGORY_LABELS[ware.category]} · {ware.origin}
                      </span>

                      <div className="zw-chip-row">
                        <span className="zw-search-badge" style={{ fontFamily: "var(--font-mono)" }}>
                          {ware.volumeRange}
                        </span>
                        {isMatcherRecommended && (
                          <span
                            className="zw-search-badge"
                            style={{
                              borderColor: "var(--tea-celadon)",
                              background: "var(--tea-celadon-soft)",
                              color: "var(--tea-celadon-deep)",
                              fontWeight: 600,
                            }}
                          >
                            ★ {activeCatMeta.shortLabel}适配
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.16rem" }}>{ware.name}</h3>
                      <button
                        type="button"
                        className={`zw-chip${isHighlighted ? " on" : ""}`}
                        style={{ fontSize: "0.72rem", padding: "0.16rem 0.5rem", flexShrink: 0 }}
                        onClick={() => onSelectWare?.(isHighlighted ? null : ware.id)}
                      >
                        {isHighlighted ? "✓ 已聚焦" : "聚焦"}
                      </button>
                    </div>

                    <p style={{ fontSize: "0.84rem", color: "var(--tea-ink-secondary)", lineHeight: 1.62 }}>
                      {ware.description}
                    </p>

                    <div className="tea-dossier-kv">
                      <div className="tea-dossier-box">
                        <h5>胎骨泥料与气孔结构</h5>
                        <p>{ware.materialAndPorosity}</p>
                      </div>
                      <div className="tea-dossier-box">
                        <h5>导热与蓄热散热特性</h5>
                        <p>{ware.thermalBehavior}</p>
                      </div>
                      <div className="tea-dossier-box">
                        <h5>非遗造器与工艺亮点</h5>
                        <p>{ware.craftHighlight}</p>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.8rem", color: "var(--tea-celadon-deep)", lineHeight: 1.55 }}>
                      <strong>择器理据：</strong>
                      {ware.pairingReason}
                    </p>

                    {/* Clickable Best-For Categories */}
                    <div style={{ paddingTop: "0.5rem", borderTop: "1px dashed var(--tea-rule-inner)" }}>
                      <small style={{ display: "block", fontSize: "0.73rem", color: "var(--tea-ink-muted)", marginBottom: "0.35rem" }}>
                        宜泡茶类（点击联动上方择器矩阵）：
                      </small>
                      <div className="zw-chip-row">
                        {ware.bestForCategories.map((cid) => {
                          const cm = TEA_CATEGORY_SHORT_META[cid];
                          const active = matcherCategory === cid;
                          return (
                            <button
                              key={cid}
                              type="button"
                              className={`zw-chip${active ? " on" : ""}`}
                              style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem", display: "inline-flex", alignItems: "center", gap: "0.32rem" }}
                              data-testid={`ware-${ware.id}-best-cat-${cid}`}
                              onClick={() => {
                                handlePickMatcherCategory(cid);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              <LiquorCupBadge liquorColorHex={cm.liquorHex} size="xs" />
                              <span>宜 · {cm.shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Avoid Categories */}
                    <div>
                      <small style={{ display: "block", fontSize: "0.73rem", color: "var(--tea-ink-muted)", marginBottom: "0.32rem" }}>
                        配器禁忌与慎用茶类：
                      </small>
                      {ware.avoidCategories.length > 0 ? (
                        <div className="zw-chip-row">
                          {ware.avoidCategories.map((cid) => (
                            <button
                              key={cid}
                              type="button"
                              className="tea-ware-avoid-chip"
                              onClick={() => {
                                handlePickMatcherCategory(cid);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              慎泡 · {TEA_CATEGORY_SHORT_META[cid]?.shortLabel ?? cid}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="zw-search-badge" style={{ color: "var(--tea-bud)", borderColor: "rgba(88, 139, 87, 0.4)" }}>
                          ✓ 釉面致密纯净 · 诸茶百搭无串味之虞
                        </span>
                      )}
                    </div>

                    {/* Representative Teas Quick Jump */}
                    {matchingSampleTeas.length > 0 && (
                      <div style={{ paddingTop: "0.48rem", borderTop: "1px dashed var(--tea-rule-inner)", marginTop: "auto" }}>
                        <small style={{ display: "block", fontSize: "0.72rem", color: "var(--tea-ink-muted)", marginBottom: "0.32rem" }}>
                          馆藏绝配名茶实证（点击直入本纪）：
                        </small>
                        <div className="zw-chip-row">
                          {matchingSampleTeas.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              className="zw-chip"
                              style={{ fontSize: "0.74rem", padding: "0.18rem 0.52rem" }}
                              onClick={() => onOpenTea(t.id, t.category)}
                            >
                              🍵 {t.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
