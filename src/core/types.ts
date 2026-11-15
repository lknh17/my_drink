export type LngLat = [number, number];

export type HallId = "portal" | "tea" | "wine" | "coffee";

export type DrinkDomainHallId = Exclude<HallId, "portal">;

export type CoffeeSubView =
  | "botany"
  | "terroir"
  | "monographs"
  | "brewing"
  | "equipment"
  | "ecology";

export type ProvinceId =
  | "bj"
  | "tj"
  | "he"
  | "sx"
  | "nm"
  | "ln"
  | "jl"
  | "hl"
  | "sh"
  | "js"
  | "zj"
  | "ah"
  | "fj"
  | "jx"
  | "sd"
  | "ha"
  | "hb"
  | "hn"
  | "gd"
  | "gx"
  | "hi"
  | "cq"
  | "sc"
  | "gz"
  | "yn"
  | "xz"
  | "sn"
  | "gs"
  | "qh"
  | "nx"
  | "xj"
  | "tw"
  | "hk"
  | "mo";

export interface ProvinceMeta {
  id: ProvinceId;
  name: string;
  shortName: string;
  adcode: string;
  centroid: LngLat;
  defaultZoom: number;
  geoJsonFile: string;
}

export const PROVINCE_META: Record<ProvinceId, ProvinceMeta> = {
  bj: { id: "bj", name: "北京市", shortName: "北京", adcode: "110000", centroid: [116.4, 40.0], defaultZoom: 8, geoJsonFile: "bj-110000-full.json" },
  tj: { id: "tj", name: "天津市", shortName: "天津", adcode: "120000", centroid: [117.25, 39.15], defaultZoom: 8, geoJsonFile: "tj-120000-full.json" },
  he: { id: "he", name: "河北省", shortName: "河北", adcode: "130000", centroid: [115.5, 38.6], defaultZoom: 6, geoJsonFile: "he-130000-full.json" },
  sx: { id: "sx", name: "山西省", shortName: "山西", adcode: "140000", centroid: [112.4, 37.6], defaultZoom: 6, geoJsonFile: "sx-140000-full.json" },
  nm: { id: "nm", name: "内蒙古自治区", shortName: "内蒙古", adcode: "150000", centroid: [113.5, 43.5], defaultZoom: 5, geoJsonFile: "nm-150000-full.json" },
  ln: { id: "ln", name: "辽宁省", shortName: "辽宁", adcode: "210000", centroid: [122.6, 41.2], defaultZoom: 6, geoJsonFile: "ln-210000-full.json" },
  jl: { id: "jl", name: "吉林省", shortName: "吉林", adcode: "220000", centroid: [126.2, 43.6], defaultZoom: 6, geoJsonFile: "jl-220000-full.json" },
  hl: { id: "hl", name: "黑龙江省", shortName: "黑龙江", adcode: "230000", centroid: [127.8, 47.2], defaultZoom: 5, geoJsonFile: "hl-230000-full.json" },
  sh: { id: "sh", name: "上海市", shortName: "上海", adcode: "310000", centroid: [121.47, 31.23], defaultZoom: 9, geoJsonFile: "sh-310000-full.json" },
  js: { id: "js", name: "江苏省", shortName: "江苏", adcode: "320000", centroid: [119.5, 32.9], defaultZoom: 6, geoJsonFile: "js-320000-full.json" },
  zj: { id: "zj", name: "浙江省", shortName: "浙江", adcode: "330000", centroid: [120.4, 29.2], defaultZoom: 6, geoJsonFile: "zj-330000-full.json" },
  ah: { id: "ah", name: "安徽省", shortName: "安徽", adcode: "340000", centroid: [117.3, 31.8], defaultZoom: 6, geoJsonFile: "ah-340000-full.json" },
  fj: { id: "fj", name: "福建省", shortName: "福建", adcode: "350000", centroid: [118.2, 25.9], defaultZoom: 6, geoJsonFile: "fj-350000-full.json" },
  jx: { id: "jx", name: "江西省", shortName: "江西", adcode: "360000", centroid: [115.6, 27.6], defaultZoom: 6, geoJsonFile: "jx-360000-full.json" },
  sd: { id: "sd", name: "山东省", shortName: "山东", adcode: "370000", centroid: [118.2, 36.3], defaultZoom: 6, geoJsonFile: "sd-370000-full.json" },
  ha: { id: "ha", name: "河南省", shortName: "河南", adcode: "410000", centroid: [113.6, 33.9], defaultZoom: 6, geoJsonFile: "ha-410000-full.json" },
  hb: { id: "hb", name: "湖北省", shortName: "湖北", adcode: "420000", centroid: [112.3, 30.9], defaultZoom: 6, geoJsonFile: "hb-420000-full.json" },
  hn: { id: "hn", name: "湖南省", shortName: "湖南", adcode: "430000", centroid: [111.7, 27.6], defaultZoom: 6, geoJsonFile: "hn-430000-full.json" },
  gd: { id: "gd", name: "广东省", shortName: "广东", adcode: "440000", centroid: [113.4, 23.1], defaultZoom: 6, geoJsonFile: "gd-440000-full.json" },
  gx: { id: "gx", name: "广西壮族自治区", shortName: "广西", adcode: "450000", centroid: [108.6, 23.6], defaultZoom: 6, geoJsonFile: "gx-450000-full.json" },
  hi: { id: "hi", name: "海南省", shortName: "海南", adcode: "460000", centroid: [109.8, 19.2], defaultZoom: 7, geoJsonFile: "hi-460000-full.json" },
  cq: { id: "cq", name: "重庆市", shortName: "重庆", adcode: "500000", centroid: [107.2, 29.9], defaultZoom: 7, geoJsonFile: "cq-500000-full.json" },
  sc: { id: "sc", name: "四川省", shortName: "四川", adcode: "510000", centroid: [103.2, 30.5], defaultZoom: 6, geoJsonFile: "sc-510000-full.json" },
  gz: { id: "gz", name: "贵州省", shortName: "贵州", adcode: "520000", centroid: [106.8, 26.7], defaultZoom: 6, geoJsonFile: "gz-520000-full.json" },
  yn: { id: "yn", name: "云南省", shortName: "云南", adcode: "530000", centroid: [101.5, 24.8], defaultZoom: 6, geoJsonFile: "yn-530000-full.json" },
  xz: { id: "xz", name: "西藏自治区", shortName: "西藏", adcode: "540000", centroid: [88.5, 31.2], defaultZoom: 5, geoJsonFile: "xz-540000-full.json" },
  sn: { id: "sn", name: "陕西省", shortName: "陕西", adcode: "610000", centroid: [108.9, 35.2], defaultZoom: 6, geoJsonFile: "sn-610000-full.json" },
  gs: { id: "gs", name: "甘肃省", shortName: "甘肃", adcode: "620000", centroid: [101.5, 37.8], defaultZoom: 5, geoJsonFile: "gs-620000-full.json" },
  qh: { id: "qh", name: "青海省", shortName: "青海", adcode: "630000", centroid: [96.5, 35.6], defaultZoom: 5, geoJsonFile: "qh-630000-full.json" },
  nx: { id: "nx", name: "宁夏回族自治区", shortName: "宁夏", adcode: "640000", centroid: [106.2, 37.3], defaultZoom: 7, geoJsonFile: "nx-640000-full.json" },
  xj: { id: "xj", name: "新疆维吾尔自治区", shortName: "新疆", adcode: "650000", centroid: [85.2, 41.5], defaultZoom: 5, geoJsonFile: "xj-650000-full.json" },
  tw: { id: "tw", name: "台湾省", shortName: "台湾", adcode: "710000", centroid: [121.0, 23.8], defaultZoom: 7, geoJsonFile: "tw-710000-full.json" },
  hk: { id: "hk", name: "香港特别行政区", shortName: "香港", adcode: "810000", centroid: [114.17, 22.32], defaultZoom: 10, geoJsonFile: "hk-810000-full.json" },
  mo: { id: "mo", name: "澳门特别行政区", shortName: "澳门", adcode: "820000", centroid: [113.55, 22.18], defaultZoom: 11, geoJsonFile: "mo-820000-full.json" },
};

export const PROVINCE_LIST: ProvinceMeta[] = Object.values(PROVINCE_META);

export const ADCODE_TO_PROVINCE: Record<string, ProvinceId> = Object.fromEntries(
  PROVINCE_LIST.map((p) => [p.adcode, p.id]),
) as Record<string, ProvinceId>;

export const PROVINCE_TO_ADCODE: Record<ProvinceId, string> = Object.fromEntries(
  PROVINCE_LIST.map((p) => [p.id, p.adcode]),
) as Record<ProvinceId, string>;

export const PROVINCE_LABELS: Record<ProvinceId, string> = Object.fromEntries(
  PROVINCE_LIST.map((p) => [p.id, p.name]),
) as Record<ProvinceId, string>;

export interface HallMetaSpec {
  id: HallId;
  code: string;
  name: string;
  shortName: string;
  englishKicker: string;
  aestheticTitle: string;
  accentHex: string;
  icon: string;
}

export const HALL_META: Record<HallId, HallMetaSpec> = {
  portal: {
    id: "portal",
    code: "酌",
    name: "酌味 · 饮品全集长廊",
    shortName: "总门户",
    englishKicker: "ZHUOWEI GRAND COMPENDIUM",
    aestheticTitle: "博物馆中庭 · 三馆三联画立面",
    accentHex: "#35685F",
    icon: "🏛️",
  },
  tea: {
    id: "tea",
    code: "茗",
    name: "茗典 · 中华茶馆",
    shortName: "中华茶馆",
    englishKicker: "MINGDIAN · CHINESE TEA COMPENDIUM",
    aestheticTitle: "天青素宣 · 宋韵山岚",
    accentHex: "#35685F",
    icon: "🍵",
  },
  wine: {
    id: "wine",
    code: "醺",
    name: "醺典 · 中外酒馆",
    shortName: "中外酒馆",
    englishKicker: "XUNDIAN · SPIRITS, WINE & BREW",
    aestheticTitle: "一院六境 · 白瓷丹砂与麦芽酒花",
    accentHex: "#A62121",
    icon: "🥃",
  },
  coffee: {
    id: "coffee",
    code: "咖",
    name: "咖典 · 精品咖啡馆",
    shortName: "精品咖啡馆",
    englishKicker: "KADIAN · SPECIALTY COFFEE LAB",
    aestheticTitle: "生豆羊皮纸 · 烘焙实验室",
    accentHex: "#C86D3B",
    icon: "☕",
  },
};

/** 跨馆统一品饮打卡与种草记录 */
export interface DrinkFootprintRecord {
  id: string;
  hall: "tea" | "wine" | "coffee";
  title: string;
  categoryLabel: string;
  originLabel: string;
  province?: ProvinceId;
  /** 如茶馆的 TeaCategoryId ("green" | "oolong" ...) 或酒馆/咖啡馆的子类 key */
  subGroupKey?: string;
  /** 如茶馆的四大茶区 ChinaTeaZoneId ("jiangnan" | "huanan" | "xinan" | "jiangbei") */
  zoneId?: string;
  liquorColorHex?: string;
  photoUrl?: string;
  coord?: LngLat;
  note?: string;
  timestamp?: number;
}

export type WineWingId =
  | "atrium"
  | "baijiu"
  | "beer"
  | "huangjiu"
  | "grape"
  | "spirits"
  | "cocktails";

export type DrinkSearchKind =
  | "hall"
  | "tea-monograph"
  | "tea-mountain"
  | "tea-ware"
  | "tea-category"
  | "tea-era"
  | "wine-specimen"
  | "baijiu-monograph"
  | "baijiu-terroir"
  | "baijiu-vessel"
  | "beer-monograph"
  | "huangjiu-specimen"
  | "grape-specimen"
  | "spirit-specimen"
  | "cocktail-specimen"
  | "wine-wing"
  | "coffee-specimen"
  | "grape-varietal"
  | "grape-region"
  | "spirit-cask"
  | "coffee-bean"
  | "coffee-drink"
  | "coffee-equipment"
  | "coffee-origin";

export interface DrinkRouteTarget {
  hall: HallId;
  sub?: "spectrum" | "terroir" | "monographs" | "teaware" | "chronicles";
  cat?: string;
  mtn?: string;
  tea?: string;
  ware?: string;
  specimen?: string;
  wing?: WineWingId;
  wsub?: string;
  aroma?: string;
  bstyle?: string;
  zone?: string;
  csub?: CoffeeSubView;
  drink?: string;
  gear?: string;
  origin?: string;
  varietal?: string;
}

/** 跨馆全局检索统一词条 */
export interface GlobalSearchItem {
  id: string;
  kind: DrinkSearchKind;
  hall: DrinkDomainHallId;
  title: string;
  subtitle: string;
  badge: string;
  accentHex?: string;
  province?: ProvinceId;
  keywords: string[];
  photoUrl?: string;
  target: DrinkRouteTarget;
  footprintRecord?: DrinkFootprintRecord;
}
