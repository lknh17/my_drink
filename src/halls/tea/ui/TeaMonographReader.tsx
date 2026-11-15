import { useEffect, useMemo, useState } from "react";
import { CraftSvgDiagram, type CraftDiagramKind } from "../../../core/CraftSvgDiagrams";
import {
  teaMonographToFootprint,
  useDrinkFootprints,
} from "../../../core/drinkFootprints";
import {
  CHINA_TEA_ZONE_SHORT_META,
  TEA_CATEGORY_SHORT_META,
  type ChinaTeaZoneId,
  type TeaCategoryId,
  type TeaCompendiumBundle,
  type TeaMonograph,
} from "../types";
import { BrewingRitualWidget } from "./BrewingRitualWidget";
import {
  LiquorCupBadge,
  SongRunningHead,
  TeaEditorialPhoto,
} from "./LiquorCupBadge";

export interface TeaMonographReaderProps {
  bundle: TeaCompendiumBundle;
  selectedCategory: TeaCategoryId | "all";
  selectedTeaId: string | null;
  onSelectCategory: (cat: TeaCategoryId | "all") => void;
  onSelectTea: (teaId: string | null) => void;
  onJumpToMountain: (mountainId: string) => void;
  onJumpToWare: (vesselText: string, tea: TeaMonograph) => void;
  onJumpToSpectrum: (cat: TeaCategoryId) => void;
}

type FootprintFilterMode = "all" | "tasted" | "wishlist";

const CATEGORY_ORDER: TeaCategoryId[] = [
  "green",
  "white",
  "yellow",
  "oolong",
  "black",
  "dark",
  "scented",
];

const ZONE_ORDER: ChinaTeaZoneId[] = ["jiangnan", "huanan", "xinan", "jiangbei"];

const CATEGORY_CRAFT_DIAGRAM: Record<TeaCategoryId, CraftDiagramKind> = {
  green: "tea-fixation-killgreen",
  white: "tea-withering-sun",
  yellow: "tea-smothering-yellow",
  oolong: "tea-shaking-oolong",
  black: "tea-fermentation-black",
  dark: "tea-pile-dark",
  scented: "tea-scenting-jasmine",
};

function explainTeaCraftStep(step: string, category: TeaCategoryId): {
  action: string;
  science: string;
  flavor: string;
} {
  if (/青锅|辉锅|杀青|锅炒/.test(step)) return {
    action: "用手感、叶温和抛炒节奏控制铁锅热力；青锅先杀青塑形，辉锅再低火收干提香。",
    science: "叶温快速越过 80℃，PPO/POD 酶被钝化；后段均匀失水并发生温和热香反应。",
    flavor: "锁住绿叶、茶氨酸与鲜爽，形成豆香栗香；不足会生青红梗，过火则焦苦。",
  };
  if (/摇青|做青|凉青|晒青/.test(step)) return {
    action: "竹筛摇动碰伤叶缘，再静置凉青走水，动静交替并逐轮加重。",
    science: "叶缘局部破壁氧化，梗脉水分与萜烯芳香前体向叶肉迁移，形成绿叶红镶边。",
    flavor: "决定兰花、熟果与岩韵的层次；摇轻香薄，摇重则红熟发酸。",
  };
  if (/炭|焙|烘|足干|干燥/.test(step)) return {
    action: "以毛火去水，再用文火慢炖或复火，期间摊凉退火，让内外水分重新均衡。",
    science: "水分降到安全线，低沸青草气逸散，糖与氨基酸的温和热反应增加熟甜香。",
    flavor: category === "oolong" ? "炭焙把花香压入茶汤，形成焦糖、熟果与岩骨暖香。" : "稳住香气并延长保存，火急会焦，火弱则返青。",
  };
  if (/渥堆|发花|陈化|堆/.test(step)) return {
    action: "洒水堆积、覆盖保温并定期翻堆；压制后继续在清洁干仓或发花室转化。",
    science: "曲霉、酵母与冠突散囊菌释放胞外酶，水解多糖并促使多酚聚合为茶褐素。",
    flavor: "把刚烈苦涩磨成红浓顺滑、木香枣甜与米汤感；温湿失控会产生霉败。",
  };
  if (/发酵|揉捻|揉切/.test(step)) return {
    action: "先充分揉捻挤出茶汁，再把湿叶薄摊于暖湿环境，闻香看色决定何时烘干停酶。",
    science: "细胞破壁后儿茶素、氧化酶与氧气相遇，生成茶黄素和茶红素。",
    flavor: "茶黄素带来鲜亮金圈，茶红素贡献红汤醇厚与花果蜜甜。",
  };
  if (/闷黄|包闷/.test(step)) return {
    action: "杀青后趁叶片湿热用牛皮纸包覆，初闷、复闷间反复开包观察。",
    science: "湿热促使叶绿素脱镁、酯型儿茶素裂解，是非酶促转黄而非红茶式发酵。",
    flavor: "降低苦涩青气，形成黄叶黄汤、玉米甜与温和醇润。",
  };
  if (/窨|花|提花|起花/.test(step)) return {
    action: "等鲜花夜间开放吐香，与极干茶坯拌合，通花散热、筛花复火后再多次复窨。",
    science: "多孔叶面吸附芳樟醇等挥发分子，温湿浓度梯度推动花香进入茶坯。",
    flavor: "让花香真正入汤而不只浮在表面，形成鲜灵、清透、持久的茉莉韵。",
  };
  if (/萎凋|薄摊|摊放/.test(step)) return {
    action: "把鲜叶薄摊通风，白茶以日光与室内复式长萎凋，其他茶类则以柔软叶片为度。",
    science: "气孔蒸腾与缓慢呼吸促使水分迁移、蛋白水解和青草气挥发。",
    flavor: "增加氨基酸甜感与花香前体；闷堆会红变酸馊，过度则汤薄。",
  };
  return {
    action: `茶师完成「${step}」，以手感、叶温、含水率与香气共同判断终点。`,
    science: "这一步调节细胞完整度、水分迁移和酶活性，为下一道工序建立可控条件。",
    flavor: "细节决定香气是否纯净、汤感是否饱满，以及回甘能否持久。",
  };
}

export function TeaMonographReader({
  bundle,
  selectedCategory,
  selectedTeaId,
  onSelectCategory,
  onSelectTea,
  onJumpToMountain,
  onJumpToWare,
  onJumpToSpectrum,
}: TeaMonographReaderProps) {
  const {
    isTasted,
    isWishlisted,
    getNote,
    toggleTasted,
    toggleWishlist,
    updateNote,
  } = useDrinkFootprints();

  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<ChinaTeaZoneId | "all">("all");
  const [footprintFilter, setFootprintFilter] = useState<FootprintFilterMode>("all");
  const [noteEditorOpen, setNoteEditorOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [activeCraftStepIndex, setActiveCraftStepIndex] = useState(0);

  // When an external navigation selects a specific tea, relax local filters if they'd hide it
  useEffect(() => {
    if (!selectedTeaId) return;
    const target = bundle.monographs.find((m) => m.id === selectedTeaId);
    if (!target) return;
    if (zoneFilter !== "all" && target.zone !== zoneFilter) {
      setZoneFilter("all");
    }
    if (footprintFilter === "tasted" && !isTasted(target.id)) {
      setFootprintFilter("all");
    } else if (footprintFilter === "wishlist" && !isWishlisted(target.id)) {
      setFootprintFilter("all");
    }
  }, [selectedTeaId, bundle.monographs, zoneFilter, footprintFilter, isTasted, isWishlisted]);

  const filteredMonographs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bundle.monographs.filter((tea) => {
      if (selectedCategory !== "all" && tea.category !== selectedCategory) return false;
      if (zoneFilter !== "all" && tea.zone !== zoneFilter) return false;
      if (footprintFilter === "tasted" && !isTasted(tea.id)) return false;
      if (footprintFilter === "wishlist" && !isWishlisted(tea.id)) return false;
      if (!q) return true;
      return (
        tea.title.toLowerCase().includes(q) ||
        tea.subStyle.toLowerCase().includes(q) ||
        tea.provinceLabel.toLowerCase().includes(q) ||
        tea.originCore.toLowerCase().includes(q) ||
        tea.cultivar.toLowerCase().includes(q) ||
        tea.aromaNotes.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [
    bundle.monographs,
    selectedCategory,
    zoneFilter,
    footprintFilter,
    searchQuery,
    isTasted,
    isWishlisted,
  ]);

  // Active tea: honor explicit selectedTeaId first, otherwise first in filtered list or bundle
  const activeTea = useMemo<TeaMonograph | null>(() => {
    if (selectedTeaId) {
      const exact = bundle.monographs.find((t) => t.id === selectedTeaId);
      if (exact) return exact;
    }
    return filteredMonographs[0] ?? bundle.monographs[0] ?? null;
  }, [selectedTeaId, bundle.monographs, filteredMonographs]);

  // Sync note editor state when switching activeTea
  useEffect(() => {
    setNoteEditorOpen(false);
    setNoteDraft(activeTea ? getNote(activeTea.id) : "");
    setActiveCraftStepIndex(0);
  }, [activeTea?.id, getNote]);

  // Group filtered monographs by category in canonical order
  const groupedSidebar = useMemo(() => {
    return CATEGORY_ORDER.map((cid) => ({
      categoryId: cid,
      meta: TEA_CATEGORY_SHORT_META[cid],
      items: filteredMonographs.filter((t) => t.category === cid),
    })).filter((g) => g.items.length > 0);
  }, [filteredMonographs]);

  const resolvedMountain = useMemo(() => {
    if (!activeTea) return null;
    return bundle.mountains.find((m) => m.id === activeTea.mountainId) ?? null;
  }, [activeTea, bundle.mountains]);

  // Prev / Next navigation inside filteredMonographs (or all monographs fallback)
  const navPool = filteredMonographs.length > 0 ? filteredMonographs : bundle.monographs;
  const activeIdx = activeTea ? navPool.findIndex((t) => t.id === activeTea.id) : -1;
  const prevTea = activeIdx > 0 ? navPool[activeIdx - 1] : null;
  const nextTea = activeIdx >= 0 && activeIdx < navPool.length - 1 ? navPool[activeIdx + 1] : null;

  if (!activeTea) {
    return (
      <div className="tea-folio-panel">
        <p style={{ color: "var(--tea-ink-muted)" }}>馆藏茶志正在装帧载入中…</p>
      </div>
    );
  }

  const catMeta = TEA_CATEGORY_SHORT_META[activeTea.category];
  const zoneMeta = CHINA_TEA_ZONE_SHORT_META[activeTea.zone];
  const tasted = isTasted(activeTea.id);
  const wishlisted = isWishlisted(activeTea.id);
  const savedNote = getNote(activeTea.id);
  const activeCraftStep = activeTea.craftSteps[activeCraftStepIndex] ?? activeTea.craftSteps[0] ?? "核心制茶";
  const activeCraftExplanation = explainTeaCraftStep(activeCraftStep, activeTea.category);

  const radarAxes: { key: keyof TeaMonograph["tasteRadar"]; label: string; desc: string; color: string }[] = [
    { key: "freshness", label: "鲜爽度 Freshness", desc: "茶氨酸与鲜叶嫩度带来的清冽活性", color: "#588B57" },
    { key: "aroma", label: "馥郁度 Aroma", desc: "挥发性花果木质芳香物质之高扬层次", color: "#9A5B25" },
    { key: "body", label: "醇厚度 Body", desc: "水浸出物、果胶与茶汤包裹稠滑感", color: "#35685F" },
    { key: "aftertaste", label: "回甘生津 Aftertaste & Qi", desc: "咽后喉底甘露返涌与山场茶气绵长度", color: "#A6402C" },
  ];

  return (
    <div className="tea-monograph-layout" data-testid="tea-monograph-reader">
      {/* Left Sticky Tea Index Sidebar */}
      <aside className="tea-index-sidebar" aria-label="传世名茶本纪目录">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <strong style={{ fontFamily: "var(--font-serif)", fontSize: "0.96rem" }}>
            本纪茶目索引
          </strong>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.73rem", color: "var(--tea-ink-muted)" }}>
            {filteredMonographs.length} / {bundle.monographs.length} 席
          </span>
        </div>

        <div className="tea-sidebar-search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜茶名、山场、品种、香型..."
            data-testid="monograph-sidebar-search"
          />
          {searchQuery && (
            <button type="button" className="zw-chip" onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>

        {/* 7 Categories Filter */}
        <div className="zw-chip-row" role="group" aria-label="茶类筛选">
          <button
            type="button"
            className={`zw-chip${selectedCategory === "all" ? " on" : ""}`}
            style={{ padding: "0.2rem 0.5rem", fontSize: "0.74rem" }}
            onClick={() => onSelectCategory("all")}
          >
            全类
          </button>
          {CATEGORY_ORDER.map((cid) => (
            <button
              key={cid}
              type="button"
              className={`zw-chip${selectedCategory === cid ? " on" : ""}`}
              style={{ padding: "0.2rem 0.48rem", fontSize: "0.74rem" }}
              onClick={() => onSelectCategory(selectedCategory === cid ? "all" : cid)}
            >
              {TEA_CATEGORY_SHORT_META[cid].sealChar}
            </button>
          ))}
        </div>

        {/* 4 Tea Zones + Footprint Status Filter */}
        <div className="zw-chip-row" role="group" aria-label="茶区与足迹筛选">
          {ZONE_ORDER.map((zid) => (
            <button
              key={zid}
              type="button"
              className={`zw-chip${zoneFilter === zid ? " on" : ""}`}
              style={{ padding: "0.18rem 0.46rem", fontSize: "0.72rem" }}
              onClick={() => setZoneFilter((prev) => (prev === zid ? "all" : zid))}
            >
              {CHINA_TEA_ZONE_SHORT_META[zid].shortLabel}
            </button>
          ))}
          <button
            type="button"
            className={`zw-chip${footprintFilter === "tasted" ? " on" : ""}`}
            style={{ padding: "0.18rem 0.46rem", fontSize: "0.72rem" }}
            onClick={() =>
              setFootprintFilter((prev) => (prev === "tasted" ? "all" : "tasted"))
            }
          >
            ✓ 喝过
          </button>
          <button
            type="button"
            className={`zw-chip${footprintFilter === "wishlist" ? " on" : ""}`}
            style={{ padding: "0.18rem 0.46rem", fontSize: "0.72rem" }}
            onClick={() =>
              setFootprintFilter((prev) => (prev === "wishlist" ? "all" : "wishlist"))
            }
          >
            ♡ 想喝
          </button>
        </div>

        {/* Grouped Tea Entries */}
        <div className="tea-sidebar-groups" role="listbox" aria-label="名茶词条列表">
          {groupedSidebar.length === 0 ? (
            <div style={{ padding: "1.2rem 0.5rem", textAlign: "center", fontSize: "0.8rem", color: "var(--tea-ink-muted)" }}>
              暂无匹配茶款
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="zw-chip"
                  onClick={() => {
                    setSearchQuery("");
                    setZoneFilter("all");
                    setFootprintFilter("all");
                    onSelectCategory("all");
                  }}
                >
                  重置全部筛选
                </button>
              </div>
            </div>
          ) : (
            groupedSidebar.map((group) => (
              <div key={group.categoryId}>
                <div className="tea-sidebar-group-title">
                  <span>{group.meta.name}</span>
                  <span>{group.items.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  {group.items.map((item) => {
                    const isCurrent = item.id === activeTea.id;
                    const itemTasted = isTasted(item.id);
                    const itemWished = isWishlisted(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isCurrent}
                        className={`tea-sidebar-entry${isCurrent ? " active" : ""}`}
                        data-testid={`monograph-sidebar-item-${item.id}`}
                        onClick={() => onSelectTea(item.id)}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.48rem", minWidth: 0 }}>
                          <LiquorCupBadge liquorColorHex={item.liquorColorHex} size="xs" />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.title}
                          </span>
                        </span>
                        <span style={{ fontSize: "0.72rem", color: isCurrent ? "var(--tea-celadon)" : "var(--tea-ink-faint)", flexShrink: 0 }}>
                          {itemTasted ? "✓" : itemWished ? "♡" : item.provinceLabel.slice(0, 2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Wide-Column Monograph Folio Reader */}
      <article className="tea-monograph-article" data-testid={`monograph-detail-${activeTea.id}`}>
        {/* 1. Header & Terroir Nameplate */}
        <section className="tea-folio-panel">
          <SongRunningHead
            volumeTag="茗典 · 卷三 · 本纪"
            title={`${catMeta.shortLabel}世家 · ${activeTea.subStyle}`}
            rightSlot={
              <span>
                本纪编号：{activeTea.id.toUpperCase()} · 第 {Math.max(1, activeIdx + 1)} / {navPool.length} 席
              </span>
            }
          />

          <div className="tea-nameplate-top">
            <div style={{ flex: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                <span className="tea-cinnabar-seal sm">{catMeta.sealChar}</span>
                <span className="zw-search-badge" style={{ borderColor: zoneMeta.colorHex, color: zoneMeta.colorHex }}>
                  {zoneMeta.name} · {activeTea.provinceLabel}
                </span>
                {activeTea.heritageTag && (
                  <span className="zw-search-badge" style={{ borderColor: "var(--tea-cinnabar)", color: "var(--tea-cinnabar)", background: "var(--tea-cinnabar-soft)" }}>
                    ✦ {activeTea.heritageTag}
                  </span>
                )}
              </div>

              <h1 className="tea-monograph-title">{activeTea.title}</h1>
              <p className="tea-monograph-tagline">「{activeTea.tagline}」</p>
            </div>

            {/* Passport & Personal Tasting Note Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className={`zw-pill-btn${tasted ? " primary" : ""}`}
                data-testid="monograph-toggle-tasted"
                onClick={() => toggleTasted(teaMonographToFootprint(activeTea, savedNote || undefined))}
              >
                {tasted ? "✓ 已收入品饮护照" : "+ 标记喝过"}
              </button>

              <button
                type="button"
                className={`zw-pill-btn${wishlisted ? " active" : ""}`}
                data-testid="monograph-toggle-wishlist"
                onClick={() => toggleWishlist(teaMonographToFootprint(activeTea, savedNote || undefined))}
              >
                {wishlisted ? "★ 已在想喝单" : "♡ 想喝"}
              </button>

              <button
                type="button"
                className="zw-pill-btn"
                data-testid="monograph-edit-note-btn"
                onClick={() => {
                  setNoteDraft(savedNote);
                  setNoteEditorOpen((v) => !v);
                }}
              >
                ✎ {savedNote ? "修改审评手记" : "撰写品茗手记"}
              </button>
            </div>
          </div>

          {/* Personal Tasting Note Display / Inline Editor */}
          {(savedNote || noteEditorOpen) && (
            <div
              style={{
                marginTop: "0.95rem",
                padding: "0.85rem 1rem",
                borderRadius: "6px",
                border: "1px dashed var(--tea-celadon)",
                background: "rgba(53, 104, 95, 0.05)",
              }}
            >
              {!noteEditorOpen ? (
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", color: "var(--tea-celadon-deep)" }}>
                    <strong>【我的私房茶帖】</strong>「{savedNote}」
                  </p>
                  <button
                    type="button"
                    className="zw-chip"
                    onClick={() => {
                      setNoteDraft(savedNote);
                      setNoteEditorOpen(true);
                    }}
                  >
                    编辑
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--tea-celadon-deep)" }}>
                    记录你的《{activeTea.title}》私房审评手记（年份、山场批次、器皿水温与喉韵体感）：
                  </label>
                  <textarea
                    className="zw-passport-note-input"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="例如：2025明前头采，85℃白瓷盖碗快出，豆香清冽，三泡后喉底冰糖甜明显..."
                    data-testid="monograph-note-textarea"
                  />
                  <div className="zw-chip-row" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="zw-chip"
                      onClick={() => setNoteEditorOpen(false)}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className="zw-chip on"
                      data-testid="monograph-save-note-btn"
                      onClick={() => {
                        updateNote(activeTea.id, noteDraft, teaMonographToFootprint(activeTea));
                        setNoteEditorOpen(false);
                      }}
                    >
                      保存至品饮护照
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6-Cell Botanical & Terroir Spec Nameplate */}
          <div className="tea-spec-nameplate-grid">
            <button
              type="button"
              className="tea-spec-cell clickable"
              style={{ textAlign: "left" }}
              data-testid="monograph-jump-mountain-btn"
              onClick={() => onJumpToMountain(activeTea.mountainId)}
            >
              <span className="tea-spec-label">所属核心茶山（点击开启地形沙盘 →）</span>
              <span className="tea-spec-val" style={{ color: "var(--tea-celadon-deep)" }}>
                ⛰️ {resolvedMountain?.name ?? activeTea.provinceLabel}
              </span>
            </button>

            <div className="tea-spec-cell">
              <span className="tea-spec-label">核心微产区 Origin Core</span>
              <span className="tea-spec-val">{activeTea.originCore}</span>
            </div>

            <div className="tea-spec-cell">
              <span className="tea-spec-label">海拔与地貌带 Elevation</span>
              <span className="tea-spec-val">{activeTea.elevationRange}</span>
            </div>

            <div className="tea-spec-cell">
              <span className="tea-spec-label">适制茶树良种 Cultivar</span>
              <span className="tea-spec-val">🌿 {activeTea.cultivar}</span>
            </div>

            <div className="tea-spec-cell">
              <span className="tea-spec-label">采摘标准与节令 Plucking</span>
              <span className="tea-spec-val">{activeTea.pluckingStandard}</span>
            </div>

            <button
              type="button"
              className="tea-spec-cell clickable"
              style={{ textAlign: "left" }}
              onClick={() => onJumpToSpectrum(activeTea.category)}
            >
              <span className="tea-spec-label">发酵 × 火功坐标（查看光谱星图 →）</span>
              <span className="tea-spec-val">
                发酵 {activeTea.fermentationPct}% · 焙火/陈化 {activeTea.roastScore}
              </span>
            </button>
          </div>

          {/* Hero Specimen Photo + Porcelain Liquor Cup Split */}
          <div className="tea-hero-sensory-split" style={{ marginTop: "1.15rem" }}>
            <TeaEditorialPhoto
              id={activeTea.id}
              photoUrl={activeTea.photoUrl}
              title={activeTea.title}
              subtitle={`${activeTea.provinceLabel} · ${activeTea.originCore}`}
              badge={catMeta.shortLabel}
              accentHex={activeTea.liquorColorHex}
              kind="tea"
              height={285}
              caption={`${activeTea.title} · ${activeTea.subStyle}（${activeTea.originCore}）`}
            />

            <div className="tea-liquor-showcase-card">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--tea-ink-muted)" }}>
                PORCELAIN CUP LIQUOR · 标准白瓷盏汤色
              </span>
              <LiquorCupBadge
                liquorColorHex={activeTea.liquorColorHex}
                size="xl"
                label={`${activeTea.title}：${activeTea.liquorColorLabel}`}
              />
              <div>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", display: "block" }}>
                  {activeTea.liquorColorLabel}
                </strong>
                <small style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--tea-ink-muted)" }}>
                  色值标本 {activeTea.liquorColorHex.toUpperCase()}
                </small>
              </div>
              <div className="zw-chip-row" style={{ justifyContent: "center" }}>
                {activeTea.aromaNotes.map((note) => (
                  <span key={note} className="zw-search-badge">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Professional 3-State Sensory Evaluation Panel (干茶 · 茶汤 · 叶底) */}
        <section className="tea-folio-panel parchment" aria-label="专业茶叶审评三态卡">
          <SongRunningHead
            volumeTag="感官审评三态"
            title="干茶外形 · 汤色香气 · 叶底活性"
            subtitle="依循中华茶叶感官审评法，从干茶条索色泽、开汤水色香阶到冲泡后叶底舒展度，立体鉴别真味"
          />

          <div className="tea-three-states-grid">
            <div className="tea-state-card">
              <div className="tea-state-card-head">
                <span className="tea-state-num">壹 · 干茶外形</span>
                <span style={{ fontSize: "0.75rem", color: "var(--tea-ink-muted)" }}>Dry Leaf</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--tea-ink)", lineHeight: 1.7 }}>
                {activeTea.dryLeafNote}
              </p>
            </div>

            <div className="tea-state-card">
              <div className="tea-state-card-head">
                <span className="tea-state-num">贰 · 汤色与香气</span>
                <LiquorCupBadge liquorColorHex={activeTea.liquorColorHex} size="xs" />
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--tea-ink)", lineHeight: 1.65 }}>
                <strong>标准汤色：</strong>
                {activeTea.liquorColorLabel}
              </p>
              <div className="zw-chip-row" style={{ marginTop: "0.2rem" }}>
                {activeTea.aromaNotes.map((aroma, idx) => (
                  <span key={aroma} className="zw-search-badge" style={{ background: "var(--tea-ivory)" }}>
                    {idx === 0 ? "前调" : idx === activeTea.aromaNotes.length - 1 ? "尾韵" : "中调"} · {aroma}
                  </span>
                ))}
              </div>
            </div>

            <div className="tea-state-card">
              <div className="tea-state-card-head">
                <span className="tea-state-num">叁 · 叶底特征</span>
                <span style={{ fontSize: "0.75rem", color: "var(--tea-ink-muted)" }}>Infused Leaf</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--tea-ink)", lineHeight: 1.7 }}>
                {activeTea.infusedLeafNote}
              </p>
            </div>
          </div>
        </section>

        {/* 3. 4-Axis Taste & Qi Bars + Core Craft Process Chain */}
        <section className="tea-folio-panel" aria-label="四维滋味量化与制茶工序链">
          <div className="tea-taste-craft-split">
            <div>
              <h3 style={{ fontSize: "1.08rem", marginBottom: "0.75rem" }}>
                茶汤四维风味与茶气指标
              </h3>
              <div className="tea-radar-bars">
                {radarAxes.map((axis) => {
                  const val = Math.max(0, Math.min(100, activeTea.tasteRadar[axis.key]));
                  return (
                    <div key={axis.key} className="tea-radar-row">
                      <div className="tea-radar-row-top">
                        <div>
                          <strong style={{ fontFamily: "var(--font-serif)" }}>{axis.label}</strong>
                          <small style={{ color: "var(--tea-ink-muted)", marginLeft: "0.45rem", fontSize: "0.73rem" }}>
                            {axis.desc}
                          </small>
                        </div>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.82rem" }}>
                          {val} / 100
                        </span>
                      </div>
                      <div className="tea-radar-track">
                        <div
                          className="tea-radar-fill"
                          style={{ width: `${val}%`, background: axis.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.85rem" }}>
              <div>
                <h3 style={{ fontSize: "1.08rem", marginBottom: "0.75rem" }}>
                  传统非遗制茶核心工序链
                </h3>
                <div className="tea-craft-flow-chain">
                  {activeTea.craftSteps.map((step, idx) => (
                    <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <button
                        type="button"
                        className={`tea-craft-step interactive${idx === activeCraftStepIndex ? " active" : ""}`}
                        title={explainTeaCraftStep(step, activeTea.category).action}
                        aria-pressed={idx === activeCraftStepIndex}
                        onClick={() => setActiveCraftStepIndex(idx)}
                      >
                        <small style={{ fontFamily: "var(--font-mono)", color: "var(--tea-celadon)" }}>
                          {idx + 1}
                        </small>
                        {step}
                      </button>
                      {idx < activeTea.craftSteps.length - 1 && (
                        <span className="tea-craft-arrow">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="tea-monograph-craft-explainer" aria-live="polite">
                <CraftSvgDiagram
                  kind={CATEGORY_CRAFT_DIAGRAM[activeTea.category]}
                  accentHex={activeTea.liquorColorHex}
                  title={`${activeTea.title} · ${activeCraftStep}`}
                />
                <div className="tea-monograph-craft-copy">
                  <span>当前工序 · {String(activeCraftStepIndex + 1).padStart(2, "0")}</span>
                  <h4>{activeCraftStep}</h4>
                  <p><strong>手上动作：</strong>{activeCraftExplanation.action}</p>
                  <p><strong>叶片内部：</strong>{activeCraftExplanation.science}</p>
                  <p><strong>杯中灵魂：</strong>{activeCraftExplanation.flavor}</p>
                </div>
              </div>

              <div className="tea-dossier-box">
                <h5>风土与工艺互文</h5>
                <p>
                  采自{activeTea.provinceLabel}{activeTea.originCore}（{activeTea.elevationRange}）之「{activeTea.cultivar}」，按「{activeTea.pluckingStandard}」采摘，经上述 {activeTea.craftSteps.length} 道工序精制而成。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Brewing Ritual Widget */}
        <BrewingRitualWidget
          tea={activeTea}
          onJumpToWare={onJumpToWare}
        />

        {/* 5. Deep Tea Gazetteer Essay & Famous Spots */}
        <section className="tea-folio-panel" aria-label="本纪茶志正文与寻茶地标">
          <SongRunningHead
            volumeTag="茶志精读"
            title={`《${activeTea.title}》风土源流与品鉴本纪`}
          />

          <p className="tea-gazetteer-essay">{activeTea.essay}</p>

          {activeTea.famousSpots.length > 0 && (
            <div style={{ marginTop: "1.35rem", paddingTop: "1.05rem", borderTop: "1px dashed var(--tea-rule-outer)" }}>
              <h4 style={{ fontSize: "0.98rem", marginBottom: "0.65rem" }}>
                📍 寻茶访古地标 · 核心产村、老字号茶庄与博物馆
              </h4>
              <div className="tea-spots-grid">
                {activeTea.famousSpots.map((spot) => (
                  <div key={`${spot.name}-${spot.locationHint}`} className="tea-dossier-box">
                    <h5 style={{ color: "var(--tea-ink)", fontSize: "0.88rem" }}>
                      {spot.name}
                    </h5>
                    <small style={{ display: "block", color: "var(--tea-celadon)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                      {spot.locationHint}
                    </small>
                    {spot.note && <p style={{ fontSize: "0.79rem" }}>{spot.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prev / Next Monograph Navigation */}
          <footer
            style={{
              marginTop: "1.4rem",
              paddingTop: "1rem",
              borderTop: "2px double var(--tea-rule-outer)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.8rem",
              flexWrap: "wrap",
            }}
          >
            {prevTea ? (
              <button
                type="button"
                className="zw-pill-btn"
                onClick={() => {
                  onSelectTea(prevTea.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ← 上一席：{prevTea.title}
              </button>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "var(--tea-ink-faint)" }}>已至卷首第一席</span>
            )}

            {nextTea ? (
              <button
                type="button"
                className="zw-pill-btn"
                onClick={() => {
                  onSelectTea(nextTea.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                下一席：{nextTea.title} →
              </button>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "var(--tea-ink-faint)" }}>已至本筛选卷末席</span>
            )}
          </footer>
        </section>
      </article>
    </div>
  );
}
