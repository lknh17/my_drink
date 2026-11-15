import { useCallback, useMemo, useState } from "react";
import type { HallId } from "../../../core/types";
import { useDrinkFootprints } from "../../../core/drinkFootprints";
import {
  TEA_CATEGORY_SHORT_META,
  TEA_WARE_CATEGORY_LABELS,
  type TeaCategoryId,
  type TeaCompendiumBundle,
  type TeaMonograph,
  type TeaSubView,
} from "../types";
import { LiquorCupBadge, resolveMatchingWareId } from "./LiquorCupBadge";
import { TeaChroniclesView } from "./TeaChroniclesView";
import { TeaMonographReader } from "./TeaMonographReader";
import { TeaSpectrumView } from "./TeaSpectrumView";
import { TeaTerroirAtlasView } from "./TeaTerroirAtlasView";
import { TeaWareGalleryView } from "./TeaWareGalleryView";
import "./tea.css";

export interface TeaHallShellProps {
  bundle: TeaCompendiumBundle;
  activeSubView: TeaSubView;
  selectedCategory: TeaCategoryId | "all";
  selectedMountainId: string | null;
  selectedTeaId: string | null;
  selectedWareId?: string | null;
  onSubViewChange: (sub: TeaSubView) => void;
  onSelectCategory: (cat: TeaCategoryId | "all") => void;
  onSelectMountain: (mountainId: string | null) => void;
  onSelectTea: (teaId: string | null) => void;
  onSelectWare?: (wareId: string | null) => void;
  onNavigateHall: (hall: HallId) => void;
  onOpenSearch: () => void;
  onOpenPassport: () => void;
  onOpenCalibration?: () => void;
}

const VESSEL_MATCH_KEYWORDS = [
  "水平壶",
  "朱泥",
  "西施",
  "石瓢",
  "仿古",
  "井栏",
  "紫泥",
  "底槽清",
  "段泥",
  "紫砂",
  "白瓷盖碗",
  "青花盖碗",
  "三才盖碗",
  "盖碗",
  "玻璃杯",
  "白瓷",
  "青花",
  "建盏",
  "兔毫",
  "油滴",
  "鹧鸪斑",
  "汝窑",
  "龙泉",
  "青瓷",
  "哥窑",
  "天青",
  "潮汕",
  "潮州",
  "手拉壶",
  "孟臣",
  "若深",
  "工夫",
  "银壶",
  "老铁壶",
  "铁壶",
  "陶壶",
  "煮茶",
];

/**
 * Matches a free-form `brewing.vessel` string and `TeaMonograph` against `bundle.teaware`
 * using name substrings, traditional vessel craft keywords, and `bundle.pairingMatrix`.
 */
function matchClosestTeawareId(
  vesselText: string,
  tea: TeaMonograph,
  bundle: TeaCompendiumBundle,
): string | null {
  const { teaware, pairingMatrix } = bundle;
  if (!teaware.length) return null;

  const clean = vesselText.trim().toLowerCase();

  // 1. Direct ID or full-name substring hit
  const directHit = teaware.find(
    (w) =>
      w.id.toLowerCase() === clean ||
      clean.includes(w.name.toLowerCase()) ||
      w.name.toLowerCase().includes(clean),
  );
  if (directHit) return directHit.id;

  // 2. Multi-signal scoring across vessel keywords, pairingMatrix, and category compatibility
  const pairingRule = pairingMatrix.find((r) => r.teaCategory === tea.category);
  const pairingSet = new Set(pairingRule?.recommendedWareIds ?? []);
  const helperResolvedId = resolveMatchingWareId(vesselText, teaware, tea.category);
  const hitKeywords = VESSEL_MATCH_KEYWORDS.filter((kw) => vesselText.includes(kw));

  let bestId: string | null = null;
  let bestScore = -Infinity;

  for (const ware of teaware) {
    let score = 0;
    const searchableWareText = `${ware.name} ${TEA_WARE_CATEGORY_LABELS[ware.category]} ${ware.materialAndPorosity} ${ware.description}`;

    for (const kw of hitKeywords) {
      if (ware.name.includes(kw)) score += 8;
      else if (searchableWareText.includes(kw)) score += 4;
    }

    if (helperResolvedId === ware.id) score += 5;
    if (pairingSet.has(ware.id)) score += 4;
    if (ware.bestForCategories.includes(tea.category)) score += 2;
    if (ware.avoidCategories.includes(tea.category)) score -= 6;

    if (score > bestScore) {
      bestScore = score;
      bestId = ware.id;
    }
  }

  if (bestId && bestScore > 0) {
    return bestId;
  }

  // 3. Pairing matrix primary vessel for tea.category
  if (pairingRule) {
    const matrixItem = pairingRule.recommendedWareIds
      .map((id) => teaware.find((w) => w.id === id))
      .find(Boolean);
    if (matrixItem) return matrixItem.id;
  }

  return helperResolvedId ?? teaware[0]?.id ?? null;
}

function safeScrollTop() {
  if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * 「茗典 · 中华茶馆」Song-Dynasty Celadon & Rice-Paper Folio Shell
 * Orchestrates all 5 scholarly tea volumes with seamless cross-space navigation.
 */
export function TeaHallShell({
  bundle,
  activeSubView,
  selectedCategory,
  selectedMountainId,
  selectedTeaId,
  selectedWareId,
  onSubViewChange,
  onSelectCategory,
  onSelectMountain,
  onSelectTea,
  onSelectWare,
  onNavigateHall,
  onOpenSearch,
  onOpenPassport,
  onOpenCalibration,
}: TeaHallShellProps) {
  const { countsByHall, unlockedTeaCategories } = useDrinkFootprints();
  const [internalWareId, setInternalWareId] = useState<string | null>(null);

  const effectiveWareId = selectedWareId !== undefined ? selectedWareId : internalWareId;

  const handleSelectWare = useCallback(
    (wareId: string | null) => {
      setInternalWareId(wareId);
      onSelectWare?.(wareId);
    },
    [onSelectWare],
  );

  const handleOpenTea = useCallback(
    (teaId: string, category?: TeaCategoryId) => {
      const targetTea = bundle.monographs.find((m) => m.id === teaId);
      const resolvedCat = category ?? targetTea?.category;
      if (resolvedCat && selectedCategory !== "all" && selectedCategory !== resolvedCat) {
        onSelectCategory(resolvedCat);
      }
      onSelectTea(teaId);
      onSubViewChange("monographs");
      safeScrollTop();
    },
    [bundle.monographs, selectedCategory, onSelectCategory, onSelectTea, onSubViewChange],
  );

  const handleJumpToMountain = useCallback(
    (mountainId: string) => {
      onSelectMountain(mountainId);
      onSubViewChange("terroir");
      safeScrollTop();
    },
    [onSelectMountain, onSubViewChange],
  );

  const handleJumpToSpectrum = useCallback(
    (cat: TeaCategoryId) => {
      onSelectCategory(cat);
      onSubViewChange("spectrum");
      safeScrollTop();
    },
    [onSelectCategory, onSubViewChange],
  );

  const handleJumpToWare = useCallback(
    (vesselText: string, tea: TeaMonograph) => {
      const matchedId = matchClosestTeawareId(vesselText, tea, bundle);
      onSelectCategory(tea.category);
      handleSelectWare(matchedId);
      onSubViewChange("teaware");
      safeScrollTop();
    },
    [bundle, onSelectCategory, handleSelectWare, onSubViewChange],
  );

  const folioTabs = useMemo(
    () =>
      [
        {
          id: "spectrum" as TeaSubView,
          vol: "卷一",
          label: "谱系卷 · 六大茶类光谱",
          count: bundle.categories.length,
          unit: "席",
        },
        {
          id: "terroir" as TeaSubView,
          vol: "卷二",
          label: "风土卷 · 名山地形沙盘",
          count: bundle.mountains.length,
          unit: "山",
        },
        {
          id: "monographs" as TeaSubView,
          vol: "卷三",
          label: "本纪卷 · 传世名茶图志",
          count: bundle.monographs.length,
          unit: "款",
        },
        {
          id: "teaware" as TeaSubView,
          vol: "卷四",
          label: "器道卷 · 看茶择器矩阵",
          count: bundle.teaware.length,
          unit: "器",
        },
        {
          id: "chronicles" as TeaSubView,
          vol: "卷五",
          label: "茶脉卷 · 茶史与四时历",
          count: bundle.eras.length,
          unit: "纪",
        },
      ] as const,
    [
      bundle.categories.length,
      bundle.mountains.length,
      bundle.monographs.length,
      bundle.teaware.length,
      bundle.eras.length,
    ],
  );

  const activeCategoryMeta =
    selectedCategory !== "all" ? TEA_CATEGORY_SHORT_META[selectedCategory] : null;

  return (
    <div className="tea-hall" data-testid="tea-hall-shell">
      {/* Song-Celadon Sticky Topbar & 5-Volume Folio Navigation */}
      <header className="tea-shell-header">
        <div className="tea-topbar-row">
          <div className="tea-topbar-left">
            <button
              type="button"
              className="tea-back-portal-btn"
              data-testid="tea-back-portal-btn"
              onClick={() => onNavigateHall("portal")}
            >
              ← 酌味总门户
            </button>

            <span className="tea-brand-divider" aria-hidden="true" />

            <div className="tea-brand-group">
              <span className="tea-cinnabar-seal" aria-hidden="true">
                茗
              </span>
              <div className="tea-brand-titles">
                <span className="tea-brand-kicker">
                  MINGDIAN · SONG-FOLIO CHINESE TEA COMPENDIUM
                </span>
                <div className="tea-brand-main">
                  <h1>茗典 · 中华茶馆</h1>
                  <span className="tea-brand-sub">天青素宣 · 宋韵山岚</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tea-topbar-right">
            <div className="tea-hall-switcher" role="group" aria-label="跨馆切换">
              <button
                type="button"
                className="tea-hall-switch-btn wine"
                data-testid="tea-switch-wine-btn"
                onClick={() => onNavigateHall("wine")}
              >
                🍷 醺典·酒馆
              </button>
              <button
                type="button"
                className="tea-hall-switch-btn coffee"
                data-testid="tea-switch-coffee-btn"
                onClick={() => onNavigateHall("coffee")}
              >
                ☕ 咖典·咖啡馆
              </button>
            </div>

            <button
              type="button"
              className="tea-action-btn"
              data-testid="tea-open-search-btn"
              onClick={onOpenSearch}
            >
              🔍 检索 <span className="zw-kbd">⌘K</span>
            </button>

            <button
              type="button"
              className="tea-action-btn passport"
              data-testid="tea-open-passport-btn"
              onClick={onOpenPassport}
            >
              📜 品饮护照
              <span className="tea-passport-count" data-testid="tea-passport-count">
                {countsByHall.tea}
              </span>
            </button>
            {onOpenCalibration && <button type="button" className="tea-action-btn" onClick={onOpenCalibration}>🖼️ 配图校准</button>}
          </div>
        </div>

        {/* 5-Space Folio Navigation Bar */}
        <nav className="tea-subnav-bar" aria-label="茗典五卷分馆导航">
          <div className="tea-subnav-inner">
            <div className="tea-folio-tabs" role="tablist">
              {folioTabs.map((tab) => {
                const isActive = activeSubView === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`tea-folio-tab${isActive ? " active" : ""}`}
                    data-testid={`tea-subview-tab-${tab.id}`}
                    onClick={() => {
                      onSubViewChange(tab.id);
                      safeScrollTop();
                    }}
                  >
                    <span className="tea-folio-tab-vol">{tab.vol}</span>
                    <span className="tea-folio-tab-name">{tab.label}</span>
                    <span className="tea-folio-tab-en">({tab.count})</span>
                  </button>
                );
              })}
            </div>

            <div className="tea-subnav-context">
              {activeCategoryMeta && (
                <button
                  type="button"
                  className="zw-chip on"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.14rem 0.52rem",
                    fontSize: "0.73rem",
                  }}
                  title="点击清除全局茶类聚焦"
                  onClick={() => onSelectCategory("all")}
                >
                  <LiquorCupBadge liquorColorHex={activeCategoryMeta.liquorHex} size="xs" />
                  <span>聚焦：{activeCategoryMeta.shortLabel} ×</span>
                </button>
              )}
              <span>
                点亮 {unlockedTeaCategories.size}/7 茶类 · 已品 {countsByHall.tea}/{bundle.monographs.length} 席
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Scholarly Stage */}
      <main className="tea-main-stage">
        {activeSubView === "spectrum" && (
          <TeaSpectrumView
            bundle={bundle}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            onOpenTea={handleOpenTea}
            onJumpToMountain={handleJumpToMountain}
          />
        )}

        {activeSubView === "terroir" && (
          <TeaTerroirAtlasView
            bundle={bundle}
            selectedMountainId={selectedMountainId}
            onSelectMountain={onSelectMountain}
            onOpenTea={handleOpenTea}
          />
        )}

        {activeSubView === "monographs" && (
          <TeaMonographReader
            bundle={bundle}
            selectedCategory={selectedCategory}
            selectedTeaId={selectedTeaId}
            onSelectCategory={onSelectCategory}
            onSelectTea={onSelectTea}
            onJumpToMountain={handleJumpToMountain}
            onJumpToWare={handleJumpToWare}
            onJumpToSpectrum={handleJumpToSpectrum}
          />
        )}

        {activeSubView === "teaware" && (
          <TeaWareGalleryView
            bundle={bundle}
            selectedCategory={selectedCategory}
            selectedTeaId={selectedTeaId}
            selectedWareId={effectiveWareId}
            onSelectCategory={onSelectCategory}
            onSelectWare={handleSelectWare}
            onOpenTea={handleOpenTea}
            onJumpToSpectrum={handleJumpToSpectrum}
          />
        )}

        {activeSubView === "chronicles" && (
          <TeaChroniclesView
            bundle={bundle}
            onOpenTea={handleOpenTea}
            onJumpToSpectrum={handleJumpToSpectrum}
            onJumpToWare={() => {
              onSubViewChange("teaware");
              safeScrollTop();
            }}
          />
        )}
      </main>
    </div>
  );
}
