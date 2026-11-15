import { useMemo, useState } from "react";
import {
  PROVINCE_LIST,
  PROVINCE_META,
  type DrinkDomainHallId,
  type DrinkFootprintRecord,
  type DrinkRouteTarget,
} from "./types";
import {
  baijiuMonographToFootprint,
  beerMonographToFootprint,
  cocktailToFootprint,
  coffeeBeanToFootprint,
  coffeeBeverageToFootprint,
  grapeWineToFootprint,
  huangjiuToFootprint,
  teaMonographToFootprint,
  useDrinkFootprints,
  worldSpiritToFootprint,
} from "./drinkFootprints";
import {
  CHINA_TEA_ZONE_SHORT_META,
  TEA_CATEGORY_SHORT_META,
  type ChinaTeaZoneId,
  type TeaCategoryId,
  type TeaCompendiumBundle,
} from "../halls/tea/types";
import type { BaijiuAromaId, WineCompendiumBundle, WineWingId } from "../halls/wine/types";
import type { CoffeeCompendiumBundle } from "../halls/coffee/types";

export interface DrinkPassportModalProps {
  open: boolean;
  onClose: () => void;
  teaBundle?: TeaCompendiumBundle;
  wineBundle?: WineCompendiumBundle;
  coffeeBundle?: CoffeeCompendiumBundle;
  onNavigate?: (target: DrinkRouteTarget) => void;
}

type PassportTab = "tasted" | "wishlist" | "catalog";

const ALL_TEA_CATEGORIES: TeaCategoryId[] = [
  "green",
  "white",
  "yellow",
  "oolong",
  "black",
  "dark",
  "scented",
];

const ALL_TEA_ZONES: ChinaTeaZoneId[] = ["jiangnan", "huanan", "xinan", "jiangbei"];
const ALL_BAIJIU_AROMAS: BaijiuAromaId[] = ["jiangxiang", "nongxiang", "qingxiang", "mixiang", "fengxiang", "jianxiang", "dongxiang", "zhimaxiang", "texiang", "fuyuxiang", "laobaigan", "chiweixiang"];

export function DrinkPassportModal({
  open,
  onClose,
  teaBundle,
  wineBundle,
  coffeeBundle,
  onNavigate,
}: DrinkPassportModalProps) {
  const {
    tasted,
    wishlist,
    visitedProvinces,
    unlockedTeaCategories,
    teaCategoryCounts,
    unlockedTeaZones,
    teaZoneCounts,
    countsByHall,
    wishlistCountsByHall,
    isTasted,
    isWishlisted,
    getNote,
    toggleTasted,
    toggleWishlist,
    updateNote,
  } = useDrinkFootprints();

  const [tab, setTab] = useState<PassportTab>("tasted");
  const [hallFilter, setHallFilter] = useState<DrinkDomainHallId | "all">("all");
  const [teaCatFilter, setTeaCatFilter] = useState<TeaCategoryId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const catalogRecords = useMemo<DrinkFootprintRecord[]>(() => {
    if (!open) return tasted;
    return [
      ...(teaBundle?.monographs ?? []).map((m) => teaMonographToFootprint(m, getNote(m.id) || undefined)),
      ...(wineBundle?.baijiuMonographs ?? []).map((m) => baijiuMonographToFootprint(m, getNote(m.id) || undefined)),
      ...(wineBundle?.beerMonographs ?? []).map((m) => beerMonographToFootprint(m, getNote(m.id) || undefined)),
      ...(wineBundle?.huangjiuSpecimens ?? []).map((m) => huangjiuToFootprint(m, getNote(m.id) || undefined)),
      ...(wineBundle?.grapeSpecimens ?? []).map((m) => grapeWineToFootprint(m, getNote(m.id) || undefined)),
      ...(wineBundle?.spiritSpecimens ?? []).map((m) => worldSpiritToFootprint(m, getNote(m.id) || undefined)),
      ...(wineBundle?.cocktailSpecimens ?? []).map((m) => cocktailToFootprint(m, getNote(m.id) || undefined)),
      ...(coffeeBundle?.beans ?? []).map((m) => coffeeBeanToFootprint(m, getNote(m.id) || undefined)),
      ...(coffeeBundle?.beverages ?? []).map((m) => coffeeBeverageToFootprint(m, getNote(m.id) || undefined)),
    ];
  }, [open, teaBundle, wineBundle, coffeeBundle, tasted, getNote]);

  const tastedIds = useMemo(() => new Set(tasted.map((x) => x.id)), [tasted]);
  const aromaProgress = useMemo(() => new Map(ALL_BAIJIU_AROMAS.map((aroma) => [
    aroma,
    wineBundle?.baijiuMonographs.filter((x) => x.aroma === aroma && tastedIds.has(x.id)).length ?? 0,
  ])), [wineBundle, tastedIds]);
  const wingStats = useMemo<Array<[WineWingId, string, number]>>(() => [
    ["baijiu", "国酿·白酒", wineBundle?.baijiuMonographs.filter((x) => tastedIds.has(x.id)).length ?? 0],
    ["beer", "麦律·啤酒", wineBundle?.beerMonographs.filter((x) => tastedIds.has(x.id)).length ?? 0],
    ["huangjiu", "古越·黄酒", wineBundle?.huangjiuSpecimens.filter((x) => tastedIds.has(x.id)).length ?? 0],
    ["grape", "风土·葡萄", wineBundle?.grapeSpecimens.filter((x) => tastedIds.has(x.id)).length ?? 0],
    ["spirits", "橡木·烈酒", wineBundle?.spiritSpecimens.filter((x) => tastedIds.has(x.id)).length ?? 0],
    ["cocktails", "微醺·调酒", wineBundle?.cocktailSpecimens.filter((x) => tastedIds.has(x.id)).length ?? 0],
  ], [wineBundle, tastedIds]);

  const visibleRecords = useMemo(() => {
    const source = tab === "tasted" ? tasted : tab === "wishlist" ? wishlist : catalogRecords;
    const q = searchQuery.trim().toLowerCase();
    return source
      .filter((rec) => {
        if (hallFilter !== "all" && rec.hall !== hallFilter) return false;
        if (teaCatFilter !== "all") {
          if (rec.hall !== "tea" || rec.subGroupKey !== teaCatFilter) return false;
        }
        if (q) {
          const noteText = getNote(rec.id) || rec.note || "";
          return (
            rec.title.toLowerCase().includes(q) ||
            rec.categoryLabel.toLowerCase().includes(q) ||
            rec.originLabel.toLowerCase().includes(q) ||
            noteText.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .slice(0, 80);
  }, [tab, tasted, wishlist, catalogRecords, hallFilter, teaCatFilter, searchQuery, getNote]);

  if (!open) return null;

  function resolveTargetForRecord(rec: DrinkFootprintRecord): DrinkRouteTarget {
    if (rec.hall === "tea") {
      return {
        hall: "tea",
        sub: "monographs",
        cat: rec.subGroupKey,
        tea: rec.id,
      };
    }
    if (rec.hall === "wine") {
      if (wineBundle?.baijiuMonographs.some((x) => x.id === rec.id)) return { hall: "wine", wing: "baijiu", wsub: "monographs", specimen: rec.id };
      if (wineBundle?.beerMonographs.some((x) => x.id === rec.id)) return { hall: "wine", wing: "beer", wsub: "taplist", specimen: rec.id };
      const wing: WineWingId = wineBundle?.huangjiuSpecimens.some((x) => x.id === rec.id) ? "huangjiu"
        : wineBundle?.grapeSpecimens.some((x) => x.id === rec.id) ? "grape"
        : wineBundle?.spiritSpecimens.some((x) => x.id === rec.id) ? "spirits"
        : "cocktails";
      return { hall: "wine", wing, specimen: rec.id };
    }
    if (coffeeBundle?.beverages.some((x) => x.id === rec.id)) {
      return { hall: "coffee", csub: "brewing", drink: rec.id };
    }
    return { hall: "coffee", csub: "monographs", specimen: rec.id };
  }

  return (
    <div
      className="zw-modal-backdrop"
      data-testid="drink-passport-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="zw-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="酌味 · 个人品饮护照与风味手记"
      >
        <header className="zw-modal-header">
          <div className="zw-modal-header-left">
            <span className="zw-seal">茶帖</span>
            <div>
              <span className="zw-modal-kicker">
                PERSONAL TASTING PASSPORT · 跨馆品饮护照与私房审评手记
              </span>
              <h2>
                酌味品饮护照 · 已品 {countsByHall.total} 款 · 想喝 {wishlistCountsByHall.total} 款
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="zw-modal-close"
            data-testid="drink-passport-close"
            onClick={onClose}
          >
            ✕ 收起护照
          </button>
        </header>

        <div className="zw-modal-body">
          {/* 1. 三馆品饮统计概览 */}
          <section className="zw-passport-stats" aria-label="三馆品饮统计">
            <div className="zw-stat-card">
              <span className="zw-stat-label">🍵 茗典 · 中华茶馆</span>
              <strong className="zw-stat-value">{countsByHall.tea} 款已品</strong>
              <small className="zw-stat-sub">
                已解锁 {unlockedTeaCategories.size} / 7 茶类 · 想喝 {wishlistCountsByHall.tea} 款
              </small>
            </div>
            <div className="zw-stat-card">
              <span className="zw-stat-label">🥃 醺典 · 中外酒馆</span>
              <strong className="zw-stat-value">{countsByHall.wine} 款已品</strong>
              <small className="zw-stat-sub">想喝心愿单 {wishlistCountsByHall.wine} 款</small>
            </div>
            <div className="zw-stat-card">
              <span className="zw-stat-label">☕ 咖典 · 精品咖啡馆</span>
              <strong className="zw-stat-value">{countsByHall.coffee} 款已品</strong>
              <small className="zw-stat-sub">想喝心愿单 {wishlistCountsByHall.coffee} 款</small>
            </div>
            <div className="zw-stat-card">
              <span className="zw-stat-label">🗺️ 中华风土点亮省份</span>
              <strong className="zw-stat-value">{visitedProvinces.size} / 34 省</strong>
              <small className="zw-stat-sub">
                四大茶区已踏足 {unlockedTeaZones.size} / 4 大区
              </small>
            </div>
          </section>

          {wineBundle && (
            <section className="zw-passport-section">
              <div className="zw-passport-sec-head">
                <h4>中国白酒十二香型点亮进度（{Array.from(aromaProgress.values()).filter(Boolean).length} / 12）</h4>
                <span>每品饮一款对应香型名酒，即点亮一枚曲印</span>
              </div>
              <div className="zw-tea-badge-grid">
                {wineBundle.baijiuAromas.map((aroma) => {
                  const count = aromaProgress.get(aroma.id) ?? 0;
                  return <div key={aroma.id} className={`zw-tea-cat-badge${count ? " unlocked" : ""}`}>
                    <span className="zw-liquor-ring" style={{ background: aroma.colorHex }} />
                    <strong>{aroma.name}</strong><small>{count ? `已品 ${count} 款` : "待点亮"}</small>
                  </div>;
                })}
              </div>
              <div className="zw-passport-sec-head" style={{ marginTop: "1.2rem" }}>
                <h4>酒之六境品饮统计</h4><span>六套异构酒类世界的个人探索进度</span>
              </div>
              <div className="zw-zone-row">
                {wingStats.map(([wing, label, count]) => <button key={wing} className={`zw-zone-card${count ? " unlocked" : ""}`} onClick={() => onNavigate?.({ hall: "wine", wing })}>
                  <strong>{label}</strong><span className="zw-search-badge">{count ? `✓ ${count} 款` : "未解锁"}</span>
                </button>)}
              </div>
            </section>
          )}

          {coffeeBundle && (
            <section className="zw-passport-section">
              <div className="zw-passport-sec-head">
                <h4>咖典 · 咖啡品饮统计（寻豆 + 饮品）</h4>
                <span>六卷全集中的个人杯测与配方探索</span>
              </div>
              <div className="zw-zone-row">
                <button className={`zw-zone-card${coffeeBundle.beans.some((x) => tastedIds.has(x.id)) ? " unlocked" : ""}`} onClick={() => onNavigate?.({ hall: "coffee", csub: "monographs" })}>
                  <strong>寻豆本纪</strong>
                  <span className="zw-search-badge">{coffeeBundle.beans.filter((x) => tastedIds.has(x.id)).length} / {coffeeBundle.beans.length} 款</span>
                </button>
                <button className={`zw-zone-card${coffeeBundle.beverages.some((x) => tastedIds.has(x.id)) ? " unlocked" : ""}`} onClick={() => onNavigate?.({ hall: "coffee", csub: "brewing" })}>
                  <strong>饮品萃取</strong>
                  <span className="zw-search-badge">{coffeeBundle.beverages.filter((x) => tastedIds.has(x.id)).length} / {coffeeBundle.beverages.length} 款</span>
                </button>
              </div>
            </section>
          )}

          {/* 2. 六大茶类 + 再加工花茶 (6+1) 解锁徽章 */}
          <section className="zw-passport-section">
            <div className="zw-passport-sec-head">
              <h4>中华六大茶类 + 花茶品鉴印谱（已点亮 {unlockedTeaCategories.size} / 7 席）</h4>
              <span>
                {teaCatFilter === "all"
                  ? "点击任意茶类徽章可筛选下方记录"
                  : "已启用单茶类筛选 · 再次点击恢复全部"}
              </span>
            </div>
            <div className="zw-tea-badge-grid">
              {ALL_TEA_CATEGORIES.map((catId) => {
                const meta = TEA_CATEGORY_SHORT_META[catId];
                const count = teaCategoryCounts[catId] ?? 0;
                const unlocked = count > 0;
                const selected = teaCatFilter === catId;
                return (
                  <button
                    key={catId}
                    type="button"
                    className={`zw-tea-cat-badge${unlocked ? " unlocked" : ""}${
                      selected ? " selected" : ""
                    }`}
                    data-testid={`passport-tea-cat-${catId}`}
                    onClick={() => {
                      setHallFilter("tea");
                      setTeaCatFilter((prev) => (prev === catId ? "all" : catId));
                    }}
                  >
                    <span
                      className="zw-liquor-ring"
                      style={{ background: meta.liquorHex }}
                    />
                    <strong>{meta.shortLabel}</strong>
                    <small>{unlocked ? `已品 ${count} 款` : "待品鉴"}</small>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. 中国四大茶区与省域足迹 */}
          <section className="zw-passport-section">
            <div className="zw-passport-sec-head">
              <h4>中国四大茶区与省域风土足迹</h4>
              <span>
                已点亮：
                {visitedProvinces.size > 0
                  ? Array.from(visitedProvinces)
                      .map((p) => PROVINCE_META[p]?.shortName ?? p)
                      .join(" · ")
                  : "暂未点亮产区省份"}
              </span>
            </div>
            <div className="zw-zone-row">
              {ALL_TEA_ZONES.map((zid) => {
                const zMeta = CHINA_TEA_ZONE_SHORT_META[zid];
                const cnt = teaZoneCounts[zid] ?? 0;
                const unlocked = unlockedTeaZones.has(zid);
                return (
                  <div
                    key={zid}
                    className={`zw-zone-card${unlocked ? " unlocked" : ""}`}
                  >
                    <div>
                      <strong style={{ fontSize: "0.86rem", fontFamily: "var(--font-serif)" }}>
                        {zMeta.name}
                      </strong>
                      <div style={{ fontSize: "0.73rem", color: "var(--ink-muted)" }}>
                        含 {zMeta.provinces.length} 省市区
                      </div>
                    </div>
                    <span
                      className="zw-search-badge"
                      style={
                        unlocked
                          ? { borderColor: zMeta.colorHex, color: zMeta.colorHex }
                          : undefined
                      }
                    >
                      {unlocked ? `✓ ${cnt} 款` : "未解锁"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="zw-chip-row" style={{ marginTop: "0.2rem" }}>
              {PROVINCE_LIST.filter((p) => visitedProvinces.has(p.id)).map((p) => (
                <span key={p.id} className="zw-search-badge">
                  ✓ {p.shortName}
                </span>
              ))}
            </div>
          </section>

          {/* 4. 账本列表与筛选栏 */}
          <section className="zw-passport-section">
            <div className="zw-passport-sec-head">
              <div className="zw-chip-row">
                <button
                  type="button"
                  className={`zw-chip${tab === "tasted" ? " on" : ""}`}
                  onClick={() => setTab("tasted")}
                >
                  ✓ 已品饮账本 ({countsByHall.total})
                </button>
                <button
                  type="button"
                  className={`zw-chip${tab === "wishlist" ? " on" : ""}`}
                  onClick={() => setTab("wishlist")}
                >
                  ♡ 想喝心愿单 ({wishlistCountsByHall.total})
                </button>
                {catalogRecords.length > 0 && (
                  <button
                    type="button"
                    className={`zw-chip${tab === "catalog" ? " on" : ""}`}
                    onClick={() => setTab("catalog")}
                  >
                    📖 全馆馆藏速打卡 ({catalogRecords.length})
                  </button>
                )}
              </div>

              <div className="zw-chip-row">
                {(
                  [
                    { id: "all", label: "全部三馆" },
                    { id: "tea", label: "🍵 茶馆" },
                    { id: "wine", label: "🥃 酒馆" },
                    { id: "coffee", label: "☕ 咖啡馆" },
                  ] as { id: DrinkDomainHallId | "all"; label: string }[]
                ).map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`zw-chip${hallFilter === h.id ? " on" : ""}`}
                    onClick={() => {
                      setHallFilter(h.id);
                      if (h.id !== "tea") setTeaCatFilter("all");
                    }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="zw-search-input-wrap" style={{ padding: "0.48rem 0.8rem" }}>
              <span aria-hidden="true">🔍</span>
              <input
                type="search"
                className="zw-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="筛选护照内茶名、产区或审评笔记..."
              />
              {(searchQuery || teaCatFilter !== "all" || hallFilter !== "all") && (
                <button
                  type="button"
                  className="zw-chip"
                  onClick={() => {
                    setSearchQuery("");
                    setTeaCatFilter("all");
                    setHallFilter("all");
                  }}
                >
                  重置筛选
                </button>
              )}
            </div>

            <div className="zw-passport-list">
              {visibleRecords.length === 0 ? (
                <div style={{ padding: "1.8rem", textAlign: "center", color: "var(--ink-muted)" }}>
                  当前筛选条件下暂无记录，可在各展馆图志卡片上点击「喝过」或「想喝」收录。
                </div>
              ) : (
                visibleRecords.map((rec) => {
                  const recTasted = isTasted(rec.id);
                  const recWished = isWishlisted(rec.id);
                  const savedNote = getNote(rec.id) || rec.note || "";
                  const isEditing = editingId === rec.id;

                  return (
                    <article key={rec.id} className="zw-passport-card">
                      <div className="zw-passport-card-top">
                        <div className="zw-passport-card-title">
                          <span
                            className="zw-liquor-ring"
                            style={{ background: rec.liquorColorHex ?? "#35685F" }}
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>
                                {rec.title}
                              </strong>
                              <span className="zw-search-badge">{rec.categoryLabel}</span>
                            </div>
                            <small style={{ color: "var(--ink-muted)" }}>{rec.originLabel}</small>
                          </div>
                        </div>

                        <div className="zw-chip-row">
                          <button
                            type="button"
                            className={`zw-chip${recTasted ? " on" : ""}`}
                            onClick={() => toggleTasted(rec)}
                          >
                            {recTasted ? "✓ 已喝过" : "+ 标记喝过"}
                          </button>
                          <button
                            type="button"
                            className={`zw-chip${recWished ? " on" : ""}`}
                            onClick={() => toggleWishlist(rec)}
                          >
                            {recWished ? "★ 已想喝" : "♡ 想喝"}
                          </button>
                          <button
                            type="button"
                            className="zw-chip"
                            onClick={() => {
                              if (isEditing) {
                                setEditingId(null);
                              } else {
                                setEditingId(rec.id);
                                setNoteDraft(savedNote);
                              }
                            }}
                          >
                            ✎ 审评手记
                          </button>
                          {onNavigate && (
                            <button
                              type="button"
                              className="zw-chip"
                              onClick={() => {
                                onNavigate(resolveTargetForRecord(rec));
                                onClose();
                              }}
                            >
                              查阅图志 →
                            </button>
                          )}
                        </div>
                      </div>

                      {savedNote && !isEditing && (
                        <p style={{ fontSize: "0.85rem", color: "var(--ink-secondary)" }}>
                          「{savedNote}」
                        </p>
                      )}

                      {isEditing && (
                        <div className="zw-passport-note-box">
                          <textarea
                            className="zw-passport-note-input"
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="记录汤色、香气前中后调、器皿水温与回甘体感..."
                          />
                          <div className="zw-chip-row" style={{ justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              className="zw-chip"
                              onClick={() => setEditingId(null)}
                            >
                              取消
                            </button>
                            <button
                              type="button"
                              className="zw-chip on"
                              onClick={() => {
                                updateNote(rec.id, noteDraft, rec);
                                setEditingId(null);
                              }}
                            >
                              保存审评手记
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
