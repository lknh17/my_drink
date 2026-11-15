import { useMemo, useState } from "react";
import {
  PROVINCE_META,
  type ProvinceId,
} from "../../../core/types";
import { useDrinkFootprints } from "../../../core/drinkFootprints";
import {
  ChinaProvinceMap,
  type ChinaMapLegendItem,
  type ChinaMapMarker,
} from "../../../core/map/ChinaProvinceMap";
import {
  TerroirMapStage,
  type TerroirBasemapMode,
  type TerroirMarkerItem,
} from "../../../core/map/TerroirMapStage";
import {
  CHINA_TEA_ZONE_SHORT_META,
  TEA_CATEGORY_SHORT_META,
  type ChinaTeaZoneId,
  type TeaCategoryId,
  type TeaCompendiumBundle,
  type TeaMonograph,
  type TeaMountainSpec,
} from "../types";
import {
  LiquorCupBadge,
  SongRunningHead,
  TeaEditorialPhoto,
} from "./LiquorCupBadge";

export interface TeaTerroirAtlasViewProps {
  bundle: TeaCompendiumBundle;
  selectedMountainId: string | null;
  onSelectMountain: (mountainId: string | null) => void;
  onOpenTea: (teaId: string, category?: TeaCategoryId) => void;
}

type MacroColorMode = "zones" | "dominant" | "footprints";
type TerroirStageLayout = "dual" | "macro" | "sandbox";

const ZONE_ORDER: ChinaTeaZoneId[] = ["jiangnan", "huanan", "xinan", "jiangbei"];

export function TeaTerroirAtlasView({
  bundle,
  selectedMountainId,
  onSelectMountain,
  onOpenTea,
}: TeaTerroirAtlasViewProps) {
  const { visitedProvinces, isTasted, tasted, wishlist } = useDrinkFootprints();

  const [layoutMode, setLayoutMode] = useState<TerroirStageLayout>("dual");
  const [macroColorMode, setMacroColorMode] = useState<MacroColorMode>("zones");
  const [activeZoneFilter, setActiveZoneFilter] = useState<ChinaTeaZoneId | "all">("all");
  const [selectedProvince, setSelectedProvince] = useState<ProvinceId | "all">("all");
  const [mtnSearch, setMtnSearch] = useState("");
  const [basemap, setBasemap] = useState<TerroirBasemapMode>("topo");
  const [showTeaPinsOnStage, setShowTeaPinsOnStage] = useState(false);

  // Resolve zones metadata with fallback
  const zonesList = useMemo(() => {
    return ZONE_ORDER.map((zid) => {
      const found = bundle.zones.find((z) => z.id === zid);
      const fb = CHINA_TEA_ZONE_SHORT_META[zid];
      const mtnCount = bundle.mountains.filter((m) => m.zone === zid).length;
      const teaCount = bundle.monographs.filter((t) => t.zone === zid).length;
      return {
        id: zid,
        name: found?.name ?? fb.name,
        kicker: found?.kicker ?? `${fb.shortLabel}核心风土带`,
        provinces: found?.provinces ?? fb.provinces,
        climateAndSoil: found?.climateAndSoil ?? "季风湿润，微酸红黄壤与高山云雾滋养",
        dominantCategories: found?.dominantCategories ?? (["green", "oolong", "black"] as TeaCategoryId[]),
        colorHex: found?.colorHex ?? fb.colorHex,
        summary: found?.summary ?? "",
        mtnCount,
        teaCount,
      };
    });
  }, [bundle.zones, bundle.mountains, bundle.monographs]);

  // Active selected mountain (default to first mountain if none selected)
  const activeMountain = useMemo<TeaMountainSpec | null>(() => {
    if (selectedMountainId) {
      const m = bundle.mountains.find((item) => item.id === selectedMountainId);
      if (m) return m;
    }
    if (activeZoneFilter !== "all") {
      const m = bundle.mountains.find((item) => item.zone === activeZoneFilter);
      if (m) return m;
    }
    return bundle.mountains[0] ?? null;
  }, [selectedMountainId, activeZoneFilter, bundle.mountains]);

  // Filtered mountains in directory
  const filteredMountains = useMemo(() => {
    const q = mtnSearch.trim().toLowerCase();
    return bundle.mountains.filter((m) => {
      if (activeZoneFilter !== "all" && m.zone !== activeZoneFilter) return false;
      if (selectedProvince !== "all" && m.province !== selectedProvince) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.provinceLabel.toLowerCase().includes(q) ||
        m.landformAndSoil.toLowerCase().includes(q) ||
        m.coreVillagesOrPeaks.some((v) => v.toLowerCase().includes(q))
      );
    });
  }, [bundle.mountains, activeZoneFilter, selectedProvince, mtnSearch]);

  // Compute province colors & badges for ChinaProvinceMap according to macroColorMode
  const macroMapData = useMemo(() => {
    const provinceColors: Partial<Record<ProvinceId, string>> = {};
    const provinceBadges: Partial<Record<ProvinceId, string>> = {};
    const legendItems: ChinaMapLegendItem[] = [];

    if (macroColorMode === "zones") {
      for (const z of zonesList) {
        for (const p of z.provinces) {
          provinceColors[p] = z.colorHex;
          provinceBadges[p] = `${z.name} · 代表茶类：${z.dominantCategories
            .map((c) => TEA_CATEGORY_SHORT_META[c]?.shortLabel ?? c)
            .join("/")}`;
        }
        legendItems.push({
          id: z.id,
          label: z.name,
          colorHex: z.colorHex,
          count: z.teaCount,
          active: activeZoneFilter === z.id,
        });
      }
    } else if (macroColorMode === "dominant") {
      // Dominant tea category per province computed from monographs
      const provCatCounts = new Map<ProvinceId, Record<string, number>>();
      for (const t of bundle.monographs) {
        const rec = provCatCounts.get(t.province) ?? {};
        rec[t.category] = (rec[t.category] ?? 0) + 1;
        provCatCounts.set(t.province, rec);
      }

      for (const z of zonesList) {
        for (const p of z.provinces) {
          const counts = provCatCounts.get(p);
          let topCat: TeaCategoryId = z.dominantCategories[0] ?? "green";
          let topN = 0;
          if (counts) {
            for (const [catKey, cnt] of Object.entries(counts)) {
              if (cnt > topN) {
                topN = cnt;
                topCat = catKey as TeaCategoryId;
              }
            }
          }
          const catMeta = TEA_CATEGORY_SHORT_META[topCat];
          provinceColors[p] = catMeta.liquorHex;
          provinceBadges[p] = `主导茶类：${catMeta.shortLabel}${topN > 0 ? `（收录 ${topN} 款名茶）` : ""}`;
        }
      }

      (["green", "white", "yellow", "oolong", "black", "dark", "scented"] as TeaCategoryId[]).forEach(
        (cid) => {
          const meta = TEA_CATEGORY_SHORT_META[cid];
          legendItems.push({
            id: cid,
            label: meta.shortLabel,
            colorHex: meta.liquorHex,
            count: bundle.monographs.filter((m) => m.category === cid).length,
          });
        },
      );
    } else {
      // Footprints lighting mode
      const tastedByProv = new Map<ProvinceId, number>();
      for (const r of tasted) {
        if (r.hall === "tea" && r.province) {
          tastedByProv.set(r.province, (tastedByProv.get(r.province) ?? 0) + 1);
        }
      }
      const wishedProvs = new Set<ProvinceId>();
      for (const w of wishlist) {
        if (w.hall === "tea" && w.province) wishedProvs.add(w.province);
      }

      for (const z of zonesList) {
        for (const p of z.provinces) {
          const cnt = tastedByProv.get(p) ?? 0;
          if (cnt > 0) {
            provinceColors[p] = "#35685F";
            provinceBadges[p] = `✓ 已点亮品茗足迹（已喝过 ${cnt} 款）`;
          } else if (wishedProvs.has(p)) {
            provinceColors[p] = "#D4943A";
            provinceBadges[p] = "♡ 心愿单待寻茶产区";
          } else {
            provinceColors[p] = "#DCE3DF";
            provinceBadges[p] = `${z.name} · 待解锁品茗足迹`;
          }
        }
      }

      legendItems.push(
        { id: "visited", label: "✓ 已品茗点亮省份", colorHex: "#35685F", count: visitedProvinces.size },
        { id: "wishlist", label: "♡ 心愿单产区", colorHex: "#D4943A", count: wishedProvs.size },
        { id: "unvisited", label: "待探索产茶省", colorHex: "#DCE3DF" },
      );
    }

    const highlightedProvinces =
      activeZoneFilter !== "all"
        ? zonesList.find((z) => z.id === activeZoneFilter)?.provinces
        : undefined;

    const markers: ChinaMapMarker[] = bundle.mountains.map((m) => ({
      id: m.id,
      label: m.name,
      subLabel: `${m.provinceLabel} · 海拔 ${m.elevation}`,
      coord: m.coord,
      province: m.province,
      colorHex: CHINA_TEA_ZONE_SHORT_META[m.zone]?.colorHex ?? "#A6402C",
      active: activeMountain?.id === m.id,
    }));

    return { provinceColors, provinceBadges, legendItems, highlightedProvinces, markers };
  }, [
    macroColorMode,
    zonesList,
    activeZoneFilter,
    bundle.monographs,
    bundle.mountains,
    tasted,
    wishlist,
    visitedProvinces,
    activeMountain?.id,
  ]);

  // Markers for MapLibre TerroirMapStage
  const sandboxMarkers = useMemo<TerroirMarkerItem[]>(() => {
    const mtnPins: TerroirMarkerItem[] = bundle.mountains.map((m) => {
      const mtnTeas = bundle.monographs.filter(
        (t) => t.mountainId === m.id || m.representativeTeaIds.includes(t.id),
      );
      const anyTasted = mtnTeas.some((t) => isTasted(t.id));
      return {
        id: m.id,
        kind: "mountain",
        title: m.name,
        subtitle: `${m.provinceLabel} · ${m.elevation}`,
        badge: CHINA_TEA_ZONE_SHORT_META[m.zone]?.shortLabel,
        elevation: m.elevation,
        coord: m.coord,
        defaultZoom: m.defaultZoom,
        colorHex: CHINA_TEA_ZONE_SHORT_META[m.zone]?.colorHex ?? "#35685F",
        isTasted: anyTasted,
      };
    });

    if (!showTeaPinsOnStage) return mtnPins;

    const teaPins: TerroirMarkerItem[] = bundle.monographs.map((t) => ({
      id: `tea-pin-${t.id}`,
      kind: "tea",
      title: `🍵 ${t.title}`,
      subtitle: `${t.originCore} · ${t.elevationRange}`,
      coord: t.coord,
      defaultZoom: 11,
      colorHex: "#9A5B25",
      isTasted: isTasted(t.id),
    }));

    return [...mtnPins, ...teaPins];
  }, [bundle.mountains, bundle.monographs, showTeaPinsOnStage, isTasted]);

  // Representative teas & famous spots for active mountain dossier
  const activeMountainTeas = useMemo<TeaMonograph[]>(() => {
    if (!activeMountain) return [];
    const seen = new Set<string>();
    const list: TeaMonograph[] = [];

    for (const tid of activeMountain.representativeTeaIds) {
      const found = bundle.monographs.find((t) => t.id === tid);
      if (found && !seen.has(found.id)) {
        seen.add(found.id);
        list.push(found);
      }
    }
    for (const t of bundle.monographs) {
      if (t.mountainId === activeMountain.id && !seen.has(t.id)) {
        seen.add(t.id);
        list.push(t);
      }
    }
    return list;
  }, [activeMountain, bundle.monographs]);

  const activeMountainSpots = useMemo(() => {
    if (!activeMountain) return [];
    if (activeMountain.famousSpots && activeMountain.famousSpots.length > 0) {
      return activeMountain.famousSpots;
    }
    return activeMountainTeas.flatMap((t) => t.famousSpots).slice(0, 4);
  }, [activeMountain, activeMountainTeas]);

  function handlePickMountain(mtnId: string) {
    onSelectMountain(mtnId);
  }

  const activeZoneDetail = useMemo(
    () =>
      activeZoneFilter === "all"
        ? zonesList.find((z) => z.id === (activeMountain?.zone ?? "jiangnan")) ?? zonesList[0]
        : zonesList.find((z) => z.id === activeZoneFilter) ?? zonesList[0],
    [activeZoneFilter, activeMountain?.zone, zonesList],
  );

  return (
    <div className="tea-terroir-view" data-testid="tea-terroir-view">
      {/* Top Mode & Four Tea Zones Strip */}
      <section className="tea-folio-panel" aria-label="中国四大茶区总纲">
        <SongRunningHead
          volumeTag="茗典 · 卷二 · 风土"
          title="中国四大茶区省域图谱与二十名山微域地形沙盘"
          subtitle="「高山云雾出好茶」：从北纬18°至37°季风省域格局，下潜至三坑两涧、狮龙云虎梅、班章易武与太姥乌岽山场"
          rightSlot={
            <div className="zw-chip-row">
              {(
                [
                  { id: "dual", label: "全景联动（省界+地形）" },
                  { id: "macro", label: "仅看宏观省域" },
                  { id: "sandbox", label: "沉浸名山地形沙盘" },
                ] as { id: TerroirStageLayout; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`zw-chip${layoutMode === m.id ? " on" : ""}`}
                  onClick={() => setLayoutMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          }
        />

        {/* 4 Tea Zones Interactive Cards */}
        <div className="tea-zones-strip" role="group" aria-label="中国四大茶区选择">
          {zonesList.map((zone) => {
            const isSelected = activeZoneFilter === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                className={`tea-zone-folio-card${isSelected ? " active" : ""}`}
                style={isSelected ? { borderColor: zone.colorHex } : undefined}
                data-testid={`tea-zone-card-${zone.id}`}
                onClick={() =>
                  setActiveZoneFilter((prev) => (prev === zone.id ? "all" : zone.id))
                }
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: zone.colorHex,
                        display: "inline-block",
                      }}
                    />
                    <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>
                      {zone.name}
                    </strong>
                  </span>
                  <span className="zw-search-badge">
                    {zone.mtnCount} 山 · {zone.teaCount} 茶
                  </span>
                </div>
                <small style={{ color: "var(--tea-celadon)", fontWeight: 600, fontSize: "0.75rem" }}>
                  {zone.kicker}
                </small>
                <p style={{ fontSize: "0.78rem", color: "var(--tea-ink-muted)", lineHeight: 1.45 }}>
                  {zone.climateAndSoil}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Layer 1: Macro 34-Province China Tea Atlas */}
      {layoutMode !== "sandbox" && (
        <section className="tea-folio-panel parchment" aria-label="宏观省域风土地图">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
            <div className="zw-chip-row" role="group" aria-label="省域地图着色模式">
              <span className="zw-chip-label">省界着色维度：</span>
              <button
                type="button"
                className={`zw-chip${macroColorMode === "zones" ? " on" : ""}`}
                data-testid="terroir-color-mode-zones"
                onClick={() => setMacroColorMode("zones")}
              >
                🗺️ 中国四大茶区
              </button>
              <button
                type="button"
                className={`zw-chip${macroColorMode === "dominant" ? " on" : ""}`}
                data-testid="terroir-color-mode-dominant"
                onClick={() => setMacroColorMode("dominant")}
              >
                🍵 各省主导茶类
              </button>
              <button
                type="button"
                className={`zw-chip${macroColorMode === "footprints" ? " on" : ""}`}
                data-testid="terroir-color-mode-footprints"
                onClick={() => setMacroColorMode("footprints")}
              >
                📜 品茗足迹点亮 ({visitedProvinces.size}省)
              </button>
            </div>

            {(activeZoneFilter !== "all" || selectedProvince !== "all") && (
              <button
                type="button"
                className="zw-chip"
                onClick={() => {
                  setActiveZoneFilter("all");
                  setSelectedProvince("all");
                }}
              >
                ✕ 重置茶区/省份筛选
              </button>
            )}
          </div>

          <div className="tea-macro-layout">
            <ChinaProvinceMap
              provinceColors={macroMapData.provinceColors}
              provinceBadges={macroMapData.provinceBadges}
              selectedProvince={selectedProvince}
              highlightedProvinces={macroMapData.highlightedProvinces}
              onSelectProvince={setSelectedProvince}
              markers={macroMapData.markers}
              selectedMarkerId={activeMountain?.id ?? null}
              onSelectMarker={(mtnId) => handlePickMountain(mtnId)}
              legendItems={macroMapData.legendItems}
              onSelectLegend={(legendId) => {
                if (macroColorMode === "zones") {
                  const zid = legendId as ChinaTeaZoneId;
                  setActiveZoneFilter((prev) => (prev === zid ? "all" : zid));
                }
              }}
              title="中华三十四省域茶区与二十名山坐标总图"
              subtitle="点击省份查看市州边界，点击赤金/黛青山标直飞下方等高线地形沙盘"
              height={460}
            />

            {/* Macro Zone & Province Scholarly Summary */}
            <aside className="tea-starmap-inspector">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    className="zw-search-badge"
                    style={{
                      borderColor: activeZoneDetail?.colorHex,
                      color: activeZoneDetail?.colorHex,
                    }}
                  >
                    宏观风土考 · {activeZoneDetail?.name}
                  </span>
                  {selectedProvince !== "all" && (
                    <span className="zw-search-badge">
                      当前聚焦：{PROVINCE_META[selectedProvince]?.name}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: "1.18rem" }}>
                  {selectedProvince !== "all"
                    ? `${PROVINCE_META[selectedProvince]?.name}产茶风土与名山`
                    : activeZoneDetail?.name}
                </h3>

                <p style={{ fontSize: "0.84rem", color: "var(--tea-ink-secondary)", lineHeight: 1.6 }}>
                  {activeZoneDetail?.summary || activeZoneDetail?.climateAndSoil}
                </p>

                <div className="tea-dossier-box">
                  <h5>水热土壤禀赋</h5>
                  <p>{activeZoneDetail?.climateAndSoil}</p>
                </div>

                <div>
                  <small style={{ display: "block", fontSize: "0.74rem", color: "var(--tea-ink-muted)", marginBottom: "0.35rem" }}>
                    主导适制茶类：
                  </small>
                  <div className="zw-chip-row">
                    {activeZoneDetail?.dominantCategories.map((cid) => (
                      <span key={cid} className="zw-search-badge">
                        {TEA_CATEGORY_SHORT_META[cid]?.shortLabel ?? cid}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <small style={{ display: "block", fontSize: "0.74rem", color: "var(--tea-ink-muted)", marginBottom: "0.35rem" }}>
                    {selectedProvince !== "all"
                      ? `本省收录名山（点击飞往地形沙盘）：`
                      : `本区核心名山代表（点击飞往地形沙盘）：`}
                  </small>
                  <div className="zw-chip-row">
                    {filteredMountains.slice(0, 8).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`zw-chip${activeMountain?.id === m.id ? " on" : ""}`}
                        onClick={() => handlePickMountain(m.id)}
                      >
                        ⛰️ {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* Layer 2: Micro 20 Famous Tea Mountains Terrain Sandbox + Dossier */}
      {layoutMode !== "macro" && (
        <section className="tea-folio-panel" aria-label="二十核心名山地形沙盘与风土志">
          <SongRunningHead
            volumeTag="实测山场沙盘"
            title="二十座中华核心名茶山 · 等高线地形与卫星地貌沙盘"
            subtitle="默认开启等高线地形图（Topo），可一键切换卫星遥感（Satellite）审视武夷丹霞坑涧、西湖群山与云南古茶林海拔肌理"
            rightSlot={
              <div className="zw-chip-row">
                <button
                  type="button"
                  className={`zw-chip${showTeaPinsOnStage ? " on" : ""}`}
                  onClick={() => setShowTeaPinsOnStage((v) => !v)}
                >
                  {showTeaPinsOnStage ? "✓ 已叠加名茶产点坐标" : "+ 叠加全部名茶微产区坐标"}
                </button>
              </div>
            }
          />

          <div className="tea-sandbox-master-detail">
            {/* Left Column: 20 Famous Mountains Directory */}
            <aside className="tea-mtn-directory" aria-label="二十名山目录">
              <div className="tea-sidebar-search">
                <span aria-hidden="true">🔍</span>
                <input
                  type="search"
                  value={mtnSearch}
                  onChange={(e) => setMtnSearch(e.target.value)}
                  placeholder="搜名山、坑涧、村寨..."
                  aria-label="检索茶山村寨"
                />
              </div>

              <div className="zw-chip-row">
                <button
                  type="button"
                  className={`zw-chip${activeZoneFilter === "all" ? " on" : ""}`}
                  onClick={() => setActiveZoneFilter("all")}
                >
                  全部({bundle.mountains.length})
                </button>
                {ZONE_ORDER.map((zid) => (
                  <button
                    key={zid}
                    type="button"
                    className={`zw-chip${activeZoneFilter === zid ? " on" : ""}`}
                    onClick={() => setActiveZoneFilter((prev) => (prev === zid ? "all" : zid))}
                  >
                    {CHINA_TEA_ZONE_SHORT_META[zid].shortLabel}
                  </button>
                ))}
              </div>

              <div className="tea-mtn-list" role="listbox" aria-label="名山列表">
                {filteredMountains.map((m, idx) => {
                  const active = activeMountain?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`tea-mtn-item-btn${active ? " active" : ""}`}
                      data-testid={`mountain-dir-item-${m.id}`}
                      onClick={() => handlePickMountain(m.id)}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}>
                          {String(idx + 1).padStart(2, "0")}. {m.name}
                        </div>
                        <small style={{ fontSize: "0.72rem", color: active ? undefined : "var(--tea-ink-muted)" }}>
                          {m.provinceLabel} · {m.elevation}
                        </small>
                      </div>
                      <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>→</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Center Column: MapLibre GL TerroirMapStage */}
            <TerroirMapStage
              markers={sandboxMarkers}
              selectedMarkerId={activeMountain?.id ?? null}
              onSelectMarker={(markerId) => {
                if (markerId.startsWith("tea-pin-")) {
                  const tid = markerId.replace(/^tea-pin-/, "");
                  const foundTea = bundle.monographs.find((t) => t.id === tid);
                  if (foundTea) onOpenTea(foundTea.id, foundTea.category);
                  return;
                }
                handlePickMountain(markerId);
              }}
              center={activeMountain?.coord}
              zoom={activeMountain?.defaultZoom ?? 8.5}
              defaultBasemap="topo"
              basemap={basemap}
              onBasemapChange={setBasemap}
              provinceBoundary={activeMountain?.province ?? null}
              title={activeMountain ? `${activeMountain.name}` : "中华核心茶山沙盘"}
              subtitle={activeMountain ? `海拔 ${activeMountain.elevation}` : undefined}
              height={620}
            />

            {/* Right Column: Rich Mountain Terroir Dossier Panel */}
            <aside className="tea-mtn-dossier" data-testid="mountain-dossier-panel">
              {activeMountain ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span
                      className="zw-search-badge"
                      style={{
                        borderColor: CHINA_TEA_ZONE_SHORT_META[activeMountain.zone]?.colorHex,
                        color: CHINA_TEA_ZONE_SHORT_META[activeMountain.zone]?.colorHex,
                      }}
                    >
                      {CHINA_TEA_ZONE_SHORT_META[activeMountain.zone]?.name} · {activeMountain.provinceLabel}
                    </span>
                    <span className="zw-search-badge" style={{ fontFamily: "var(--font-mono)" }}>
                      海拔 {activeMountain.elevation}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1.32rem" }}>{activeMountain.name}</h3>
                    <small style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--tea-ink-muted)" }}>
                      坐标：{activeMountain.coord[1].toFixed(3)}°N, {activeMountain.coord[0].toFixed(3)}°E
                    </small>
                  </div>

                  <TeaEditorialPhoto
                    id={activeMountain.id}
                    photoUrl={activeMountain.photoUrl}
                    title={activeMountain.name}
                    subtitle={`${activeMountain.provinceLabel} · ${activeMountain.elevation}`}
                    badge="名山志"
                    accentHex={CHINA_TEA_ZONE_SHORT_META[activeMountain.zone]?.colorHex ?? "#35685F"}
                    kind="mountain"
                    height={158}
                  />

                  <div className="tea-dossier-kv">
                    <div className="tea-dossier-box">
                      <h5>岩层地貌与土壤母质</h5>
                      <p>{activeMountain.landformAndSoil}</p>
                    </div>
                    <div className="tea-dossier-box">
                      <h5>高山云雾微域气候</h5>
                      <p>{activeMountain.microClimate}</p>
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: "0.78rem", color: "var(--tea-celadon)", marginBottom: "0.4rem" }}>
                      核心山场 / 峰涧村寨谱系
                    </h5>
                    <div className="zw-chip-row">
                      {activeMountain.coreVillagesOrPeaks.map((peak) => (
                        <span key={peak} className="zw-search-badge" style={{ background: "var(--tea-paper)" }}>
                          ⛰️ {peak}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: "0.84rem", color: "var(--tea-ink-secondary)", lineHeight: 1.68 }}>
                    {activeMountain.terroirNote}
                  </p>

                  {/* Representative Teas of this Mountain */}
                  <div style={{ paddingTop: "0.55rem", borderTop: "1px dashed var(--tea-rule-outer)" }}>
                    <h5 style={{ fontSize: "0.82rem", color: "var(--tea-ink)", marginBottom: "0.5rem" }}>
                      本山孕育之传世名茶（点击披阅三态本纪）
                    </h5>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.48rem" }}>
                      {activeMountainTeas.map((tea) => (
                        <button
                          key={tea.id}
                          type="button"
                          className="tea-mtn-item-btn"
                          style={{ border: "1px solid var(--tea-rule-inner)" }}
                          data-testid={`dossier-tea-link-${tea.id}`}
                          onClick={() => onOpenTea(tea.id, tea.category)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <LiquorCupBadge liquorColorHex={tea.liquorColorHex} size="xs" />
                            <div>
                              <strong style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem" }}>
                                {tea.title}
                                {isTasted(tea.id) ? " ✓" : ""}
                              </strong>
                              <small style={{ display: "block", fontSize: "0.73rem", color: "var(--tea-ink-muted)" }}>
                                {tea.subStyle} · {tea.liquorColorLabel}
                              </small>
                            </div>
                          </div>
                          <span style={{ fontSize: "0.76rem", color: "var(--tea-celadon)" }}>本纪 →</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Famous Tea Houses / Museums */}
                  {activeMountainSpots.length > 0 && (
                    <div style={{ paddingTop: "0.5rem", borderTop: "1px dashed var(--tea-rule-inner)" }}>
                      <h5 style={{ fontSize: "0.78rem", color: "var(--tea-ink-muted)", marginBottom: "0.4rem" }}>
                        寻茶访古地标与茶寮博物
                      </h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.38rem" }}>
                        {activeMountainSpots.map((spot) => (
                          <div
                            key={`${spot.name}-${spot.locationHint}`}
                            style={{
                              fontSize: "0.78rem",
                              padding: "0.45rem 0.6rem",
                              borderRadius: "5px",
                              background: "var(--tea-paper)",
                              border: "1px solid var(--tea-rule-inner)",
                            }}
                          >
                            <strong>📍 {spot.name}</strong>
                            <span style={{ color: "var(--tea-ink-muted)" }}> · {spot.locationHint}</span>
                            {spot.note && (
                              <div style={{ color: "var(--tea-ink-secondary)", marginTop: "0.12rem" }}>
                                {spot.note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: "var(--tea-ink-muted)" }}>请从左侧目录或地图点选一座核心茶山。</p>
              )}
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}
