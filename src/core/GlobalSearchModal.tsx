import { useEffect, useMemo, useState } from "react";
import {
  HALL_META,
  type DrinkRouteTarget,
  type GlobalSearchItem,
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
  TEA_CATEGORY_SHORT_META,
  TEA_WARE_CATEGORY_LABELS,
  type TeaCompendiumBundle,
} from "../halls/tea/types";
import type { WineCompendiumBundle } from "../halls/wine/types";
import type { CoffeeCompendiumBundle } from "../halls/coffee/types";

export interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: DrinkRouteTarget) => void;
  teaBundle: TeaCompendiumBundle;
  wineBundle: WineCompendiumBundle;
  coffeeBundle: CoffeeCompendiumBundle;
  extraItems?: GlobalSearchItem[];
}

type SearchScopeFilter =
  | "all"
  | "tea-monograph"
  | "tea-mountain"
  | "tea-ware"
  | "wine"
  | "coffee";

const HOT_SEARCH_TERMS = [
  "西湖龙井",
  "肉桂",
  "凤凰单丛",
  "白毫银针",
  "普洱",
  "祁门红茶",
  "武夷山",
  "紫砂",
  "建盏",
  "酱香",
  "瑰夏",
];

const BUILTIN_PREVIEW_SEARCH_ITEMS: GlobalSearchItem[] = [
  {
    id: "hall-tea",
    kind: "hall",
    hall: "tea",
    title: "茗典 · 中华茶馆",
    subtitle: "天青素宣 · 六大茶类与花茶光谱、四大茶区20座核心名山、传世名茶本纪与看茶择器",
    badge: "第一展馆 · 全量开放",
    accentHex: "#35685F",
    keywords: ["茶馆", "中国茶", "六大茶类", "茗典", "tea"],
    target: { hall: "tea", sub: "spectrum" },
  },
  {
    id: "hall-wine",
    kind: "hall",
    hall: "wine",
    title: "醺典 · 中外酒馆（一院六境）",
    subtitle: "羊脂白瓷中国白酒、麦芽精酿、黄酒、葡萄酒、世界烈酒与鸡尾酒六境全馆",
    badge: "第二展馆 · 全境开馆",
    accentHex: "#A62121",
    keywords: ["酒馆", "白酒", "威士忌", "葡萄酒", "黄酒", "鸡尾酒", "醺典", "wine"],
    target: { hall: "wine", wing: "atrium" },
  },
  {
    id: "hall-coffee",
    kind: "hall",
    hall: "coffee",
    title: "咖典 · 精品咖啡馆（六卷全集）",
    subtitle: "树种后制、庄园风土、32款寻豆本纪、16款饮品萃取、20件器具与浪潮生态",
    badge: "第三展馆 · 全集开馆",
    accentHex: "#C86D3B",
    keywords: ["咖啡馆", "手冲", "浓缩", "水洗", "日晒", "厌氧", "云南咖啡", "咖典", "coffee"],
    target: { hall: "coffee" },
  },
  {
    id: "wine-chishui-jiangxiang",
    kind: "wine-specimen",
    hall: "wine",
    title: "赤水河谷大曲酱香白酒样板",
    subtitle: "53% vol · 红缨子糯高粱 · 12987端午制曲重阳下沙 · 贵州遵义仁怀",
    badge: "醺典预览 · 蒸馏酒",
    accentHex: "#D4943A",
    province: "gz",
    keywords: ["白酒", "酱香", "茅台镇", "赤水河", "高粱", "大曲"],
    target: { hall: "wine", specimen: "wine-chishui-jiangxiang" },
    footprintRecord: {
      id: "wine-chishui-jiangxiang",
      hall: "wine",
      title: "赤水河谷大曲酱香白酒",
      categoryLabel: "蒸馏酒 · 酱香型白酒",
      originLabel: "贵州遵义 · 赤水河谷核心产区",
      province: "gz",
      subGroupKey: "distilled",
      liquorColorHex: "#EFE6C8",
    },
  },
  {
    id: "wine-shaoxing-huadiao",
    kind: "wine-specimen",
    hall: "wine",
    title: "绍兴鉴湖古法冬酿花雕黄酒",
    subtitle: "15% vol · 精白糯米与鉴湖源头水 · 麦曲草药酒药双边发酵陈酿",
    badge: "醺典预览 · 酿造酒",
    accentHex: "#B86B43",
    province: "zj",
    keywords: ["黄酒", "绍兴", "花雕", "鉴湖", "酿造酒", "糯米"],
    target: { hall: "wine", specimen: "wine-shaoxing-huadiao" },
    footprintRecord: {
      id: "wine-shaoxing-huadiao",
      hall: "wine",
      title: "绍兴鉴湖冬酿花雕黄酒",
      categoryLabel: "酿造酒 · 干型/半干黄酒",
      originLabel: "浙江绍兴 · 鉴湖水系",
      province: "zj",
      subGroupKey: "fermented",
      liquorColorHex: "#9E531E",
    },
  },
  {
    id: "wine-islay-peat-whisky",
    kind: "wine-specimen",
    hall: "wine",
    title: "苏格兰艾雷岛重泥煤单一麦芽威士忌",
    subtitle: "46% vol · 泥煤烘麦酚值 50ppm · 波本与雪莉双桶海风陈年",
    badge: "醺典预览 · 蒸馏酒",
    accentHex: "#C9882B",
    keywords: ["威士忌", "艾雷岛", "泥煤", "单一麦芽", "whisky", "islay"],
    target: { hall: "wine", specimen: "wine-islay-peat-whisky" },
    footprintRecord: {
      id: "wine-islay-peat-whisky",
      hall: "wine",
      title: "艾雷岛重泥煤单一麦芽威士忌",
      categoryLabel: "蒸馏酒 · 单一麦芽威士忌",
      originLabel: "苏格兰 · 艾雷岛 Islay",
      subGroupKey: "distilled",
      liquorColorHex: "#D4943A",
    },
  },
  {
    id: "coffee-panama-gesha-washed",
    kind: "coffee-specimen",
    hall: "coffee",
    title: "巴拿马波奎特高海拔水洗瑰夏 (Gesha)",
    subtitle: "1750m · 浅度烘焙 · 佛手柑 / 白色茉莉花 / 蜜桃清茶感 · V60 1:16",
    badge: "咖典预览 · 水洗浅烘",
    accentHex: "#2C6E63",
    keywords: ["瑰夏", "巴拿马", "水洗", "茉莉花", "佛手柑", "gesha", "手冲"],
    target: { hall: "coffee", specimen: "coffee-panama-gesha-washed" },
    footprintRecord: {
      id: "coffee-panama-gesha-washed",
      hall: "coffee",
      title: "巴拿马波奎特水洗瑰夏",
      categoryLabel: "水洗处理 · 浅度烘焙",
      originLabel: "巴拿马 · 波奎特火山高地",
      subGroupKey: "washed",
      liquorColorHex: "#B96B35",
    },
  },
  {
    id: "coffee-yunnan-baoshan-typica",
    kind: "coffee-specimen",
    hall: "coffee",
    title: "中国云南保山高黎贡山日晒铁皮卡",
    subtitle: "1450m · 中浅烘焙 · 梅子果脯 / 红糖甜感 / 乌龙茶尾韵",
    badge: "咖典预览 · 云南风土",
    accentHex: "#C86D3B",
    province: "yn",
    keywords: ["云南咖啡", "保山", "高黎贡山", "铁皮卡", "日晒", "typica"],
    target: { hall: "coffee", specimen: "coffee-yunnan-baoshan-typica" },
    footprintRecord: {
      id: "coffee-yunnan-baoshan-typica",
      hall: "coffee",
      title: "云南保山高黎贡山日晒铁皮卡",
      categoryLabel: "日晒处理 · 中浅烘焙",
      originLabel: "云南保山 · 潞江坝高黎贡山麓",
      province: "yn",
      subGroupKey: "natural",
      liquorColorHex: "#8C4823",
    },
  },
];

export function GlobalSearchModal({
  open,
  onClose,
  onNavigate,
  teaBundle,
  wineBundle,
  coffeeBundle,
  extraItems = [],
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScopeFilter>("all");
  const [focusIdx, setFocusIdx] = useState(0);

  const { isTasted, toggleTasted } = useDrinkFootprints();

  const searchIndex = useMemo<GlobalSearchItem[]>(() => {
    const items: GlobalSearchItem[] = [...BUILTIN_PREVIEW_SEARCH_ITEMS.slice(0, 3)];

    // 1. Tea monographs
    for (const tea of teaBundle.monographs) {
      const catMeta = TEA_CATEGORY_SHORT_META[tea.category];
      items.push({
        id: `tea-${tea.id}`,
        kind: "tea-monograph",
        hall: "tea",
        title: tea.title,
        subtitle: `${tea.provinceLabel} · ${tea.originCore} · ${tea.cultivar} · 香气：${tea.aromaNotes.join(" / ")}`,
        badge: `${catMeta?.shortLabel ?? tea.category} · ${tea.subStyle}`,
        accentHex: tea.liquorColorHex,
        province: tea.province,
        keywords: [
          tea.title,
          tea.id,
          tea.subStyle,
          tea.provinceLabel,
          tea.originCore,
          tea.cultivar,
          tea.tagline,
          tea.liquorColorLabel,
          ...tea.aromaNotes,
          ...tea.famousSpots.map((s) => s.name),
        ],
        photoUrl: tea.photoUrl,
        target: { hall: "tea", sub: "monographs", cat: tea.category, tea: tea.id },
        footprintRecord: teaMonographToFootprint(tea),
      });
    }

    // 2. Tea mountains
    for (const mtn of teaBundle.mountains) {
      items.push({
        id: `mtn-${mtn.id}`,
        kind: "tea-mountain",
        hall: "tea",
        title: mtn.name,
        subtitle: `${mtn.provinceLabel} · 海拔 ${mtn.elevation} · 核心村寨：${mtn.coreVillagesOrPeaks.join("、")}`,
        badge: "名山风土沙盘",
        accentHex: "#35685F",
        province: mtn.province,
        keywords: [
          mtn.name,
          mtn.id,
          mtn.provinceLabel,
          mtn.landformAndSoil,
          mtn.microClimate,
          mtn.terroirNote,
          ...mtn.coreVillagesOrPeaks,
        ],
        photoUrl: mtn.photoUrl,
        target: { hall: "tea", sub: "terroir", mtn: mtn.id },
      });
    }

    // 3. Teaware
    for (const ware of teaBundle.teaware) {
      items.push({
        id: `ware-${ware.id}`,
        kind: "tea-ware",
        hall: "tea",
        title: ware.name,
        subtitle: `${ware.origin} · ${ware.materialAndPorosity} · ${ware.pairingReason}`,
        badge: `茶器 · ${TEA_WARE_CATEGORY_LABELS[ware.category]}`,
        accentHex: "#9A5B25",
        keywords: [
          ware.name,
          ware.id,
          ware.origin,
          ware.materialAndPorosity,
          ware.craftHighlight,
          ware.pairingReason,
          TEA_WARE_CATEGORY_LABELS[ware.category],
        ],
        photoUrl: ware.photoUrl,
        target: { hall: "tea", sub: "teaware", ware: ware.id },
      });
    }

    // 4. Wine hall: 54 baijiu + zones/vessels + 32 beers + 34 curated specimens
    for (const w of wineBundle.baijiuMonographs) items.push({
      id: `baijiu-${w.id}`, kind: "baijiu-monograph", hall: "wine", title: w.title,
      subtitle: `${w.provinceLabel} · ${w.originCore} · ${w.abvOptions} · ${w.noseNotes.join(" / ")}`,
      badge: `国酿 · ${w.subSchool}`, accentHex: w.liquorHueHex, province: w.province,
      keywords: [w.id, w.title, w.subSchool, w.originCore, w.grainFormula, w.quCraft, w.tagline, ...w.noseNotes, ...w.keyCompounds],
      photoUrl: w.photoUrl, target: { hall: "wine", wing: "baijiu", wsub: "monographs", aroma: w.aroma, specimen: w.id },
      footprintRecord: baijiuMonographToFootprint(w),
    });
    for (const z of wineBundle.baijiuZones) items.push({
      id: `baijiu-zone-${z.id}`, kind: "baijiu-terroir", hall: "wine", title: z.name,
      subtitle: `${z.provinceLabel} · ${z.riverOrSpring} · ${z.coreTownsOrDistilleries.join(" / ")}`,
      badge: "国酿 · 黄金产区", accentHex: "#A62121", province: z.province,
      keywords: [z.id, z.name, z.riverOrSpring, z.geologyAndMicrobes, z.climateFeature, ...z.coreTownsOrDistilleries],
      photoUrl: z.photoUrl, target: { hall: "wine", wing: "baijiu", wsub: "terroir", zone: z.id },
    });
    for (const v of wineBundle.baijiuVessels) items.push({
      id: `baijiu-vessel-${v.id}`, kind: "baijiu-vessel", hall: "wine", title: v.name,
      subtitle: `${v.era} · ${v.material} · ${v.physicalAndSensoryNote}`, badge: "国酿 · 器礼",
      accentHex: "#B5852A", keywords: [v.id, v.name, v.era, v.material, v.craftHighlight, v.description],
      photoUrl: v.photoUrl, target: { hall: "wine", wing: "baijiu", wsub: "vessels", specimen: v.id },
    });
    for (const w of wineBundle.beerMonographs) items.push({
      id: `beer-${w.id}`, kind: "beer-monograph", hall: "wine", title: w.title,
      subtitle: `${w.brewery} · ${w.countryOrRegion} · ${w.abv} · ${w.ibu} IBU`,
      badge: `麦律 · ${w.tapNumber}`, accentHex: w.srmColorHex, province: w.province,
      keywords: [w.id, w.title, w.brewery, w.countryOrRegion, w.bjcpStyleLabel, w.tagline, ...w.aromaTags],
      photoUrl: w.photoUrl, target: { hall: "wine", wing: "beer", wsub: "taplist", bstyle: w.styleCategory, specimen: w.id },
      footprintRecord: beerMonographToFootprint(w),
    });
    for (const w of wineBundle.huangjiuSpecimens) items.push({ id: `huangjiu-${w.id}`, kind: "huangjiu-specimen", hall: "wine", title: w.title, subtitle: `${w.originLabel} · ${w.sugarLabel} · ${w.abv}`, badge: "古越 · 黄酒米酒", accentHex: w.liquorColorHex, province: w.province, keywords: [w.id, w.title, w.originLabel, w.riceAndWater, w.quAndStarter, w.tagline], photoUrl: w.photoUrl, target: { hall: "wine", wing: "huangjiu", specimen: w.id }, footprintRecord: huangjiuToFootprint(w) });
    for (const w of wineBundle.grapeSpecimens) items.push({ id: `grape-${w.id}`, kind: "grape-specimen", hall: "wine", title: w.title, subtitle: `${w.country} · ${w.originAppellation} · ${w.grapeVarietals}`, badge: "风土 · 葡萄酒", accentHex: w.liquorColorHex, province: w.province, keywords: [w.id, w.title, w.country, w.originAppellation, w.grapeVarietals, w.tagline, ...w.aromaNotes], photoUrl: w.photoUrl, target: { hall: "wine", wing: "grape", wsub: "monographs", specimen: w.id }, footprintRecord: grapeWineToFootprint(w) });
    for (const r of wineBundle.grapeRegions ?? []) items.push({ id: `grape-region-${r.id}`, kind: "grape-region", hall: "wine", title: r.name, subtitle: `${r.country} · ${r.classificationSystem} · ${r.climateAndSoil}`, badge: "风土 · 产区分级", accentHex: "#6E1D2C", province: r.province, keywords: [r.id, r.name, r.country, r.classificationSystem, r.terroirSummary, ...r.signatureVarietals], photoUrl: r.photoUrl, target: { hall: "wine", wing: "grape", wsub: "terroir" } });
    for (const v of wineBundle.grapeVarietals ?? []) items.push({ id: `grape-varietal-${v.id}`, kind: "grape-varietal", hall: "wine", title: v.name, subtitle: `${v.englishName} · ${v.originClassic} · ${v.signatureAromas.join(" / ")}`, badge: "风土 · 品种谱", accentHex: v.colorHex, keywords: [v.id, v.name, v.englishName, v.originClassic, v.summary, ...v.signatureAromas], target: { hall: "wine", wing: "grape", wsub: "varietals", varietal: v.id } });
    for (const w of wineBundle.spiritSpecimens) items.push({ id: `spirit-${w.id}`, kind: "spirit-specimen", hall: "wine", title: w.title, subtitle: `${w.originRegion} · ${w.category} · ${w.abv}`, badge: "橡木 · 世界烈酒", accentHex: w.liquorColorHex, keywords: [w.id, w.title, w.originRegion, w.baseMaterial, w.stillType, w.caskAndAging, w.tagline, ...w.nosesAndPalate], photoUrl: w.photoUrl, target: { hall: "wine", wing: "spirits", wsub: "monographs", specimen: w.id }, footprintRecord: worldSpiritToFootprint(w) });
    for (const r of wineBundle.whiskyRegions ?? []) items.push({ id: `whisky-region-${r.id}`, kind: "spirit-cask", hall: "wine", title: r.name, subtitle: `${r.country} · ${r.styleSignature} · ${r.peatProfile}`, badge: "橡木 · 威士忌产区", accentHex: "#D4943A", keywords: [r.id, r.name, r.country, r.styleSignature, r.peatProfile, ...r.signatureDistilleries], target: { hall: "wine", wing: "spirits", wsub: "whisky-cask" } });
    for (const c of wineBundle.spiritCaskTypes ?? []) items.push({ id: `spirit-cask-${c.id}`, kind: "spirit-cask", hall: "wine", title: c.name, subtitle: `${c.woodSpecies} · ${c.previousLiquid} · ${c.signatureFlavors.join(" / ")}`, badge: "橡木 · 桶陈实验室", accentHex: c.colorTintHex, keywords: [c.id, c.name, c.englishName, c.woodSpecies, c.previousLiquid, ...c.signatureFlavors], target: { hall: "wine", wing: "spirits", wsub: "whisky-cask" } });
    for (const w of wineBundle.cocktailSpecimens) items.push({ id: `cocktail-${w.id}`, kind: "cocktail-specimen", hall: "wine", title: w.title, subtitle: `${w.englishTitle} · ${w.method} · ${w.abvEstimate}`, badge: "微醺 · 鸡尾酒", accentHex: w.liquorColorHex, keywords: [w.id, w.title, w.englishTitle, w.eraOrOrigin, w.glassware, w.tagline, ...w.flavorTags, ...w.ingredients.map((i) => i.name)], photoUrl: w.photoUrl, target: { hall: "wine", wing: "cocktails", specimen: w.id }, footprintRecord: cocktailToFootprint(w) });

    // 5. Coffee six-volume live index
    for (const c of coffeeBundle.beans) items.push({
      id: `coffee-bean-${c.id}`, kind: "coffee-bean", hall: "coffee", title: c.title,
      subtitle: `${c.originLabel} · ${c.elevationMeters} · ${c.processLabel} · ${c.flavorNotes.join(" / ")}`,
      badge: `咖典 · 寻豆本纪 · ${c.roastLabel}`, accentHex: c.cremaOrLiquorHex, province: c.province,
      keywords: [c.id, c.title, c.lotCode, c.originLabel, c.varietal, c.processLabel, c.essay, ...c.flavorNotes],
      photoUrl: c.photoUrl, target: { hall: "coffee", csub: "monographs", specimen: c.id },
      footprintRecord: coffeeBeanToFootprint(c),
    });
    for (const c of coffeeBundle.beverages) items.push({
      id: `coffee-drink-${c.id}`, kind: "coffee-drink", hall: "coffee", title: c.title,
      subtitle: `${c.englishTitle} · ${c.originCityOrEra} · ${c.espressoBaseSpec}`,
      badge: "咖典 · 饮品萃取", accentHex: c.layers[0]?.colorHex ?? "#C86D3B",
      keywords: [c.id, c.title, c.englishTitle, c.originCityOrEra, c.cupVessel, c.keyTechniqueTip, ...c.layers.map((x) => x.label)],
      photoUrl: c.photoUrl, target: { hall: "coffee", csub: "brewing", drink: c.id },
      footprintRecord: coffeeBeverageToFootprint(c),
    });
    for (const c of coffeeBundle.equipment) items.push({
      id: `coffee-equipment-${c.id}`, kind: "coffee-equipment", hall: "coffee", title: c.name,
      subtitle: `${c.englishName} · ${c.coreMaterialAndSpec} · ${c.particleOrCupImpact}`,
      badge: "咖典 · 器具道场", accentHex: "#2C6E63",
      keywords: [c.id, c.name, c.englishName, c.category, c.inventorOrOrigin, c.fluidOrGrindMechanics, ...c.bestForBrewMethods],
      photoUrl: c.photoUrl, target: { hall: "coffee", csub: "equipment", gear: c.id },
    });
    for (const c of coffeeBundle.origins) items.push({
      id: `coffee-origin-${c.id}`, kind: "coffee-origin", hall: "coffee", title: c.name,
      subtitle: `${c.countryOrProvince} · ${c.elevationRange} · ${c.flavorProfile}`,
      badge: "咖典 · 庄园风土", accentHex: "#2C6E63", province: c.province,
      keywords: [c.id, c.name, c.countryOrProvince, c.latitudeBand, c.flavorProfile, c.soilAndMicroclimate ?? "", ...c.dominantVarietals],
      photoUrl: c.photoUrl, target: { hall: "coffee", csub: "terroir", origin: c.id },
    });

    if (extraItems.length > 0) {
      items.push(...extraItems);
    }

    return items;
  }, [teaBundle, wineBundle, coffeeBundle, extraItems]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return searchIndex
      .filter((item) => {
        if (scope === "wine" && item.hall !== "wine") return false;
        if (scope === "coffee" && item.hall !== "coffee") return false;
        if (scope !== "all" && scope !== "wine" && scope !== "coffee" && item.kind !== scope) return false;
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(q))
        );
      })
      .slice(0, 128);
  }, [searchIndex, query, scope]);

  useEffect(() => {
    setFocusIdx(0);
  }, [query, scope, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIdx((prev) => Math.min(Math.max(0, filteredItems.length - 1), prev + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Enter" && filteredItems[focusIdx]) {
        const activeEl = document.activeElement;
        if (activeEl && activeEl.tagName === "INPUT") {
          e.preventDefault();
          onNavigate(filteredItems[focusIdx].target);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filteredItems, focusIdx, onNavigate, onClose]);

  if (!open) return null;

  return (
    <div
      className="zw-modal-backdrop"
      data-testid="global-search-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="zw-modal-dialog zw-search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="酌味 · 跨馆全局检索台"
      >
        <header className="zw-modal-header">
          <div className="zw-modal-header-left">
            <span className="zw-seal">检索</span>
            <div>
              <span className="zw-modal-kicker">
                CROSS-HALL COMPENDIUM PALETTE · 跨馆风物秒级检索 (⌘K)
              </span>
              <h3>检索传世名茶、核心茶山、经典茶器、中外佳酿与精品咖啡豆</h3>
            </div>
          </div>
          <button
            type="button"
            className="zw-modal-close"
            data-testid="global-search-close"
            onClick={onClose}
          >
            关闭 ESC
          </button>
        </header>

        <div className="zw-modal-body">
          <div className="zw-search-input-wrap">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              className="zw-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入茶名、山头村寨、品种、香型、茶器或产区（如：龙井、牛栏坑、蜜兰香、建盏、瑰夏...）"
              data-testid="global-search-input"
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="zw-chip"
                onClick={() => setQuery("")}
              >
                清除
              </button>
            )}
          </div>

          <div className="zw-chip-row" role="group" aria-label="检索门类筛选">
            <span className="zw-chip-label">馆藏范围：</span>
            {(
              [
                { id: "all", label: `全部词条 (${searchIndex.length})` },
                { id: "tea-monograph", label: `🍵 传世名茶 (${teaBundle.monographs.length})` },
                { id: "tea-mountain", label: `⛰️ 核心茶山 (${teaBundle.mountains.length})` },
                { id: "tea-ware", label: `🏺 茶器图谱 (${teaBundle.teaware.length})` },
                { id: "wine", label: `🥃 醺典六境 (${wineBundle.baijiuMonographs.length + wineBundle.beerMonographs.length + wineBundle.huangjiuSpecimens.length + wineBundle.grapeSpecimens.length + wineBundle.spiritSpecimens.length + wineBundle.cocktailSpecimens.length})` },
                { id: "coffee", label: `☕ 咖典六卷 (${coffeeBundle.beans.length + coffeeBundle.beverages.length + coffeeBundle.equipment.length + coffeeBundle.origins.length})` },
              ] as { id: SearchScopeFilter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`zw-chip${scope === tab.id ? " on" : ""}`}
                onClick={() => setScope(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="zw-chip-row" role="group" aria-label="热门检索词">
            <span className="zw-chip-label">酌味热词：</span>
            {HOT_SEARCH_TERMS.map((kw) => (
              <button
                key={kw}
                type="button"
                className={`zw-chip${query === kw ? " on" : ""}`}
                onClick={() => setQuery((prev) => (prev === kw ? "" : kw))}
              >
                {kw}
              </button>
            ))}
          </div>

          <div className="zw-search-results" role="listbox" aria-label="检索结果列表">
            {filteredItems.length === 0 ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--ink-muted)" }}>
                未找到与「{query}」匹配的饮品或茶器词条，请尝试切换范围或输入品种/产区关键词。
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const hallMeta = HALL_META[item.hall];
                const rec = item.footprintRecord;
                const tasted = rec ? isTasted(rec.id) : false;
                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={idx === focusIdx}
                    className={`zw-search-item${idx === focusIdx ? " focused" : ""}`}
                    data-testid={`search-hit-${item.id}`}
                    onMouseEnter={() => setFocusIdx(idx)}
                    onClick={() => {
                      onNavigate(item.target);
                      onClose();
                    }}
                  >
                    <div className="zw-search-item-main">
                      <span
                        className="zw-liquor-ring"
                        style={{ background: item.accentHex ?? hallMeta.accentHex }}
                        title={hallMeta.name}
                      />
                      <div className="zw-search-item-text">
                        <div className="zw-search-item-title-row">
                          <strong>{item.title}</strong>
                          <span className="zw-search-badge">{item.badge}</span>
                        </div>
                        <span className="zw-search-sub">{item.subtitle}</span>
                      </div>
                    </div>

                    <div className="zw-search-item-right">
                      {rec && (
                        <button
                          type="button"
                          className={`zw-chip${tasted ? " on" : ""}`}
                          title={tasted ? "已收入品饮护照" : "一键打卡喝过"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTasted(rec);
                          }}
                        >
                          {tasted ? "✓ 已品" : "+ 喝过"}
                        </button>
                      )}
                      <span className="zw-kbd">↵ 前往</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
