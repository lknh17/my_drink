import { useCallback, useEffect, useMemo, useState } from "react";
import type { DrinkFootprintRecord, ProvinceId } from "./types";
import type { ChinaTeaZoneId, TeaCategoryId, TeaMonograph } from "../halls/tea/types";
import { TEA_CATEGORY_SHORT_META } from "../halls/tea/types";
import type {
  BaijiuMonograph,
  BeerMonograph,
  CocktailRecipeSpecimen,
  GrapeWineSpecimen,
  HuangjiuSpecimen,
  WinePreviewSpecimen,
  WorldSpiritSpecimen,
} from "../halls/wine/types";
import type {
  CoffeeBeanMonograph,
  CoffeeBeverageRecipe,
  CoffeePreviewSpecimen,
} from "../halls/coffee/types";

export const DRINK_FOOTPRINTS_STORAGE_KEY = "zhuowei.drink.footprints.v1";
const SYNC_EVENT = "zhuowei-drink-footprints-sync";

export interface DrinkFootprintStoreState {
  version: 1;
  tasted: DrinkFootprintRecord[];
  wishlist: DrinkFootprintRecord[];
  notes: Record<string, string>;
}

const VALID_TEA_CATEGORIES = new Set<string>([
  "green",
  "white",
  "yellow",
  "oolong",
  "black",
  "dark",
  "scented",
]);

const VALID_TEA_ZONES = new Set<string>(["jiangnan", "huanan", "xinan", "jiangbei"]);

const DEFAULT_STORE_STATE: DrinkFootprintStoreState = {
  version: 1,
  tasted: [
    {
      id: "west-lake-longjing",
      hall: "tea",
      title: "西湖龙井",
      categoryLabel: "绿茶 · 扁炒青",
      originLabel: "浙江杭州 · 狮峰龙井核心产区",
      province: "zj",
      subGroupKey: "green",
      zoneId: "jiangnan",
      liquorColorHex: "#C9DC78",
      note: "明前头采糙米色，85℃玻璃杯中投，嫩豆香与兰底交融，鲜爽甘冽。",
      timestamp: 1762600000000,
    },
    {
      id: "wuyi-rougui",
      hall: "tea",
      title: "武夷正岩肉桂",
      categoryLabel: "乌龙茶 · 闽北岩茶",
      originLabel: "福建武夷山 · 三坑两涧丹霞正岩",
      province: "fj",
      subGroupKey: "oolong",
      zoneId: "huanan",
      liquorColorHex: "#C46E26",
      note: "中足火炭焙，盖香桂皮辛锐，入口霸气醇厚，岩骨花香落水明显。",
      timestamp: 1762650000000,
    },
    {
      id: "fuding-baihaoyinzhen",
      hall: "tea",
      title: "福鼎白毫银针",
      categoryLabel: "白茶 · 单芽微发酵",
      originLabel: "福建福鼎 · 太姥山高海拔产区",
      province: "fj",
      subGroupKey: "white",
      zoneId: "huanan",
      liquorColorHex: "#EFE4BA",
      note: "芽头肥壮满披白毫如雪，日光萎凋锁住毫香蜜韵，清甜润泽。",
      timestamp: 1762700000000,
    },
  ],
  wishlist: [
    {
      id: "menghai-laobanzhang",
      hall: "tea",
      title: "老班章古树生普",
      categoryLabel: "黑茶/普洱茶 · 晒青古树",
      originLabel: "云南西双版纳 · 勐海布朗山",
      province: "yn",
      subGroupKey: "dark",
      zoneId: "xinan",
      liquorColorHex: "#E3B64C",
      note: "待寻正春古树单株，体验茶气刚烈与山野苦尽甘来之霸韵。",
      timestamp: 1762750000000,
    },
    {
      id: "fenghuang-milaixiang",
      hall: "tea",
      title: "乌岽蜜兰香单丛",
      categoryLabel: "乌龙茶 · 广东单丛",
      originLabel: "广东潮州 · 凤凰山乌岽天池",
      province: "gd",
      subGroupKey: "oolong",
      zoneId: "huanan",
      liquorColorHex: "#D48B32",
      timestamp: 1762780000000,
    },
  ],
  notes: {
    "west-lake-longjing": "明前头采糙米色，85℃玻璃杯中投，嫩豆香与兰底交融，鲜爽甘冽。",
    "wuyi-rougui": "中足火炭焙，盖香桂皮辛锐，入口霸气醇厚，岩骨花香落水明显。",
    "fuding-baihaoyinzhen": "芽头肥壮满披白毫如雪，日光萎凋锁住毫香蜜韵，清甜润泽。",
    "menghai-laobanzhang": "待寻正春古树单株，体验茶气刚烈与山野苦尽甘来之霸韵。",
  },
};

function emitSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }
}

function normalizeRecord(rec: DrinkFootprintRecord, notes: Record<string, string>): DrinkFootprintRecord {
  const syncedNote = notes[rec.id] ?? rec.note;
  return {
    ...rec,
    photoUrl: rec.photoUrl ?? `/photos/${rec.id}.jpg`,
    note: syncedNote,
    timestamp: rec.timestamp ?? Date.now(),
  };
}

export function loadDrinkFootprintState(): DrinkFootprintStoreState {
  if (typeof window === "undefined") return DEFAULT_STORE_STATE;
  try {
    const raw = window.localStorage.getItem(DRINK_FOOTPRINTS_STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_STATE;
    const parsed = JSON.parse(raw) as Partial<DrinkFootprintStoreState>;
    if (!parsed || typeof parsed !== "object") return DEFAULT_STORE_STATE;
    const notes = parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {};
    const tasted = Array.isArray(parsed.tasted)
      ? parsed.tasted.map((r) => normalizeRecord(r, notes))
      : DEFAULT_STORE_STATE.tasted;
    const wishlist = Array.isArray(parsed.wishlist)
      ? parsed.wishlist.map((r) => normalizeRecord(r, notes))
      : DEFAULT_STORE_STATE.wishlist;
    return { version: 1, tasted, wishlist, notes };
  } catch {
    return DEFAULT_STORE_STATE;
  }
}

function saveDrinkFootprintState(next: DrinkFootprintStoreState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRINK_FOOTPRINTS_STORAGE_KEY, JSON.stringify(next));
    emitSync();
  } catch {
    // ignore quota or private mode errors
  }
}

export function teaMonographToFootprint(tea: TeaMonograph, note?: string): DrinkFootprintRecord {
  const catShort = TEA_CATEGORY_SHORT_META[tea.category]?.shortLabel ?? tea.category;
  return {
    id: tea.id,
    hall: "tea",
    title: tea.title,
    categoryLabel: `${catShort} · ${tea.subStyle}`,
    originLabel: `${tea.provinceLabel} · ${tea.originCore}`,
    province: tea.province,
    subGroupKey: tea.category,
    zoneId: tea.zone,
    liquorColorHex: tea.liquorColorHex,
    photoUrl: tea.photoUrl ?? `/photos/${tea.id}.jpg`,
    coord: tea.coord,
    note,
    timestamp: Date.now(),
  };
}

export function wineSpecimenToFootprint(item: WinePreviewSpecimen, note?: string): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "wine",
    title: item.title,
    categoryLabel: `${item.abv} · ${item.subtitle ?? item.pillar}`,
    originLabel: item.originLabel,
    province: item.province,
    subGroupKey: item.pillar,
    liquorColorHex: item.liquorColorHex,
    photoUrl: item.photoUrl,
    coord: item.coord,
    note,
    timestamp: Date.now(),
  };
}

export function baijiuMonographToFootprint(
  item: BaijiuMonograph,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "wine",
    title: item.title,
    categoryLabel: `${item.subSchool} · ${item.abvOptions}`,
    originLabel: `${item.provinceLabel} · ${item.originCore}`,
    province: item.province,
    subGroupKey: item.aroma,
    zoneId: item.terroirZoneId,
    liquorColorHex: item.liquorHueHex,
    photoUrl: item.photoUrl,
    coord: item.coord,
    note,
    timestamp: Date.now(),
  };
}

export function beerMonographToFootprint(
  item: BeerMonograph,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "wine",
    title: item.title,
    categoryLabel: `${item.tapNumber} · ${item.bjcpStyleLabel} · ${item.abv}`,
    originLabel: `${item.brewery} · ${item.countryOrRegion}`,
    province: item.province,
    subGroupKey: item.styleCategory,
    liquorColorHex: item.srmColorHex,
    photoUrl: item.photoUrl,
    note,
    timestamp: Date.now(),
  };
}

export function huangjiuToFootprint(
  item: HuangjiuSpecimen,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "wine",
    title: item.title,
    categoryLabel: `${item.sugarLabel} · ${item.abv}`,
    originLabel: item.originLabel,
    province: item.province,
    subGroupKey: item.sugarType,
    liquorColorHex: item.liquorColorHex,
    photoUrl: item.photoUrl,
    note,
    timestamp: Date.now(),
  };
}

export function grapeWineToFootprint(
  item: GrapeWineSpecimen,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "wine",
    title: item.title,
    categoryLabel: `${item.styleType} · ${item.abv}`,
    originLabel: `${item.country} · ${item.originAppellation}`,
    province: item.province,
    subGroupKey: item.styleType,
    liquorColorHex: item.liquorColorHex,
    photoUrl: item.photoUrl,
    note,
    timestamp: Date.now(),
  };
}

export function worldSpiritToFootprint(
  item: WorldSpiritSpecimen,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "wine",
    title: item.title,
    categoryLabel: `${item.category} · ${item.abv}`,
    originLabel: item.originRegion,
    subGroupKey: item.category,
    liquorColorHex: item.liquorColorHex,
    photoUrl: item.photoUrl,
    note,
    timestamp: Date.now(),
  };
}

export function cocktailToFootprint(
  item: CocktailRecipeSpecimen,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "wine",
    title: item.title,
    categoryLabel: `${item.method} · ${item.abvEstimate}`,
    originLabel: item.eraOrOrigin,
    subGroupKey: item.method,
    liquorColorHex: item.liquorColorHex,
    photoUrl: item.photoUrl,
    note,
    timestamp: Date.now(),
  };
}

export function coffeeSpecimenToFootprint(item: CoffeePreviewSpecimen, note?: string): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "coffee",
    title: item.title,
    categoryLabel: `${item.processLabel} · ${item.roastLabel}`,
    originLabel: item.originLabel,
    province: item.province,
    subGroupKey: item.process,
    liquorColorHex: item.cremaOrLiquorHex,
    photoUrl: item.photoUrl,
    coord: item.coord,
    note,
    timestamp: Date.now(),
  };
}

export function coffeeBeanToFootprint(
  item: CoffeeBeanMonograph,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "coffee",
    title: item.title,
    categoryLabel: `${item.categoryRole} · ${item.processLabel} · ${item.roastLabel}`,
    originLabel: item.originLabel,
    province: item.province,
    subGroupKey: item.categoryRole,
    zoneId: item.originId,
    liquorColorHex: item.cremaOrLiquorHex,
    photoUrl: item.photoUrl,
    coord: item.coord,
    note,
    timestamp: Date.now(),
  };
}

export function coffeeBeverageToFootprint(
  item: CoffeeBeverageRecipe,
  note?: string,
): DrinkFootprintRecord {
  return {
    id: item.id,
    hall: "coffee",
    title: item.title,
    categoryLabel: `${item.category} · ${item.totalVolumeMl}ml`,
    originLabel: item.originCityOrEra,
    subGroupKey: item.category,
    liquorColorHex: item.layers[0]?.colorHex,
    photoUrl: item.photoUrl,
    note,
    timestamp: Date.now(),
  };
}

export function toggleTastedDrink(itemOrId: DrinkFootprintRecord | string): DrinkFootprintStoreState {
  const cur = loadDrinkFootprintState();
  const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
  const exists = cur.tasted.some((r) => r.id === id);

  let nextTasted: DrinkFootprintRecord[];
  const nextNotes = { ...cur.notes };

  if (exists) {
    nextTasted = cur.tasted.filter((r) => r.id !== id);
  } else if (typeof itemOrId !== "string") {
    if (itemOrId.note && !nextNotes[id]) {
      nextNotes[id] = itemOrId.note;
    }
    nextTasted = [normalizeRecord(itemOrId, nextNotes), ...cur.tasted];
  } else {
    // Allow promoting from wishlist by id if present
    const fromWish = cur.wishlist.find((w) => w.id === id);
    if (!fromWish) return cur;
    nextTasted = [normalizeRecord(fromWish, nextNotes), ...cur.tasted];
  }

  const next: DrinkFootprintStoreState = {
    version: 1,
    tasted: nextTasted,
    wishlist: cur.wishlist,
    notes: nextNotes,
  };
  saveDrinkFootprintState(next);
  return next;
}

export function toggleWishlistDrink(itemOrId: DrinkFootprintRecord | string): DrinkFootprintStoreState {
  const cur = loadDrinkFootprintState();
  const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
  const exists = cur.wishlist.some((r) => r.id === id);

  let nextWishlist: DrinkFootprintRecord[];
  const nextNotes = { ...cur.notes };

  if (exists) {
    nextWishlist = cur.wishlist.filter((r) => r.id !== id);
  } else if (typeof itemOrId !== "string") {
    if (itemOrId.note && !nextNotes[id]) {
      nextNotes[id] = itemOrId.note;
    }
    nextWishlist = [normalizeRecord(itemOrId, nextNotes), ...cur.wishlist];
  } else {
    return cur;
  }

  const next: DrinkFootprintStoreState = {
    version: 1,
    tasted: cur.tasted,
    wishlist: nextWishlist,
    notes: nextNotes,
  };
  saveDrinkFootprintState(next);
  return next;
}

export function updateDrinkNote(
  id: string,
  note: string,
  fallbackRecord?: DrinkFootprintRecord,
): DrinkFootprintStoreState {
  const cur = loadDrinkFootprintState();
  const trimmed = note.trim();
  const nextNotes = { ...cur.notes };
  if (trimmed) {
    nextNotes[id] = trimmed;
  } else {
    delete nextNotes[id];
  }

  let nextTasted = cur.tasted.map((r) => (r.id === id ? { ...r, note: trimmed || undefined } : r));
  const nextWishlist = cur.wishlist.map((r) =>
    r.id === id ? { ...r, note: trimmed || undefined } : r,
  );

  if (
    trimmed &&
    fallbackRecord &&
    !nextTasted.some((r) => r.id === id) &&
    !nextWishlist.some((r) => r.id === id)
  ) {
    nextTasted = [normalizeRecord({ ...fallbackRecord, note: trimmed }, nextNotes), ...nextTasted];
  }

  const next: DrinkFootprintStoreState = {
    version: 1,
    tasted: nextTasted,
    wishlist: nextWishlist,
    notes: nextNotes,
  };
  saveDrinkFootprintState(next);
  return next;
}

export function setDrinksTastedBatch(
  items: DrinkFootprintRecord[],
  tasted: boolean,
): DrinkFootprintStoreState {
  const cur = loadDrinkFootprintState();
  const targetIds = new Set(items.map((i) => i.id));
  let nextTasted: DrinkFootprintRecord[];

  if (tasted) {
    const existing = new Set(cur.tasted.map((r) => r.id));
    const additions = items
      .filter((i) => !existing.has(i.id))
      .map((i) => normalizeRecord(i, cur.notes));
    nextTasted = [...additions, ...cur.tasted];
  } else {
    nextTasted = cur.tasted.filter((r) => !targetIds.has(r.id));
  }

  const next: DrinkFootprintStoreState = {
    version: 1,
    tasted: nextTasted,
    wishlist: cur.wishlist,
    notes: cur.notes,
  };
  saveDrinkFootprintState(next);
  return next;
}

export function inferTeaZoneFromProvince(prov?: ProvinceId): ChinaTeaZoneId | undefined {
  if (!prov) return undefined;
  if (["zj", "ah", "js", "jx", "hn", "hb", "sh"].includes(prov)) return "jiangnan";
  if (["fj", "gd", "gx", "hi", "tw", "hk", "mo"].includes(prov)) return "huanan";
  if (["yn", "sc", "gz", "cq", "xz"].includes(prov)) return "xinan";
  if (["ha", "sd", "sn", "gs"].includes(prov)) return "jiangbei";
  return undefined;
}

export function useDrinkFootprints() {
  const [state, setState] = useState<DrinkFootprintStoreState>(() => loadDrinkFootprintState());

  useEffect(() => {
    const sync = () => setState(loadDrinkFootprintState());
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const tastedIds = useMemo(() => state.tasted.map((r) => r.id), [state.tasted]);
  const tastedSet = useMemo(() => new Set(tastedIds), [tastedIds]);

  const wishlistIds = useMemo(() => state.wishlist.map((r) => r.id), [state.wishlist]);
  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  const visitedProvinces = useMemo(() => {
    const set = new Set<ProvinceId>();
    for (const r of state.tasted) {
      if (r.province) set.add(r.province);
    }
    return set;
  }, [state.tasted]);

  const unlockedTeaCategories = useMemo(() => {
    const set = new Set<TeaCategoryId>();
    for (const r of state.tasted) {
      if (r.hall === "tea" && r.subGroupKey && VALID_TEA_CATEGORIES.has(r.subGroupKey)) {
        set.add(r.subGroupKey as TeaCategoryId);
      }
    }
    return set;
  }, [state.tasted]);

  const teaCategoryCounts = useMemo(() => {
    const counts: Record<TeaCategoryId, number> = {
      green: 0,
      white: 0,
      yellow: 0,
      oolong: 0,
      black: 0,
      dark: 0,
      scented: 0,
    };
    for (const r of state.tasted) {
      if (r.hall === "tea" && r.subGroupKey && VALID_TEA_CATEGORIES.has(r.subGroupKey)) {
        const key = r.subGroupKey as TeaCategoryId;
        counts[key] += 1;
      }
    }
    return counts;
  }, [state.tasted]);

  const unlockedTeaZones = useMemo(() => {
    const set = new Set<ChinaTeaZoneId>();
    for (const r of state.tasted) {
      if (r.hall !== "tea") continue;
      if (r.zoneId && VALID_TEA_ZONES.has(r.zoneId)) {
        set.add(r.zoneId as ChinaTeaZoneId);
      } else {
        const inferred = inferTeaZoneFromProvince(r.province);
        if (inferred) set.add(inferred);
      }
    }
    return set;
  }, [state.tasted]);

  const teaZoneCounts = useMemo(() => {
    const counts: Record<ChinaTeaZoneId, number> = {
      jiangnan: 0,
      huanan: 0,
      xinan: 0,
      jiangbei: 0,
    };
    for (const r of state.tasted) {
      if (r.hall !== "tea") continue;
      const zid =
        r.zoneId && VALID_TEA_ZONES.has(r.zoneId)
          ? (r.zoneId as ChinaTeaZoneId)
          : inferTeaZoneFromProvince(r.province);
      if (zid) counts[zid] += 1;
    }
    return counts;
  }, [state.tasted]);

  const countsByHall = useMemo(() => {
    let tea = 0;
    let wine = 0;
    let coffee = 0;
    for (const r of state.tasted) {
      if (r.hall === "tea") tea += 1;
      else if (r.hall === "wine") wine += 1;
      else if (r.hall === "coffee") coffee += 1;
    }
    return { tea, wine, coffee, total: state.tasted.length };
  }, [state.tasted]);

  const wishlistCountsByHall = useMemo(() => {
    let tea = 0;
    let wine = 0;
    let coffee = 0;
    for (const r of state.wishlist) {
      if (r.hall === "tea") tea += 1;
      else if (r.hall === "wine") wine += 1;
      else if (r.hall === "coffee") coffee += 1;
    }
    return { tea, wine, coffee, total: state.wishlist.length };
  }, [state.wishlist]);

  const toggleTasted = useCallback((itemOrId: DrinkFootprintRecord | string) => {
    setState(toggleTastedDrink(itemOrId));
  }, []);

  const toggleWishlist = useCallback((itemOrId: DrinkFootprintRecord | string) => {
    setState(toggleWishlistDrink(itemOrId));
  }, []);

  const updateNote = useCallback(
    (id: string, note: string, fallbackRecord?: DrinkFootprintRecord) => {
      setState(updateDrinkNote(id, note, fallbackRecord));
    },
    [],
  );

  const setBatchTasted = useCallback((items: DrinkFootprintRecord[], tasted: boolean) => {
    setState(setDrinksTastedBatch(items, tasted));
  }, []);

  const isTasted = useCallback((id: string) => tastedSet.has(id), [tastedSet]);
  const isWishlisted = useCallback((id: string) => wishlistSet.has(id), [wishlistSet]);
  const getNote = useCallback((id: string) => state.notes[id] ?? "", [state.notes]);

  return {
    tasted: state.tasted,
    wishlist: state.wishlist,
    notes: state.notes,
    tastedIds,
    tastedSet,
    wishlistIds,
    wishlistSet,
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
    setBatchTasted,
  };
}
