import type { ProvinceId } from "../../core/types";

export type TeaCategoryId =
  | "green"
  | "white"
  | "yellow"
  | "oolong"
  | "black"
  | "dark"
  | "scented";

export type ChinaTeaZoneId = "jiangnan" | "huanan" | "xinan" | "jiangbei";

export type TeaSubView =
  | "spectrum"
  | "terroir"
  | "monographs"
  | "teaware"
  | "chronicles";

export type TeaWareCategoryId =
  | "zisha"
  | "gaiwan"
  | "jianzhan"
  | "celadon"
  | "chaozhou"
  | "kettle";

export interface BrewingProfile {
  vessel: string;
  leafGrams: number;
  waterMl: number;
  tempCelsius: number;
  pouringTechnique: string;
  /** 1-6 泡逐泡参考出汤秒数，如 [8, 8, 12, 18, 25, 40] */
  infusionsSec: number[];
  infusionNotes: string;
  /** 可选：逐泡风味演变简注 */
  perInfusionNotes?: string[];
}

export interface TeaTasteRadar {
  freshness: number;
  aroma: number;
  body: number;
  aftertaste: number;
}

export interface TeaFamousSpot {
  name: string;
  locationHint: string;
  note?: string;
}

export interface TeaMonograph {
  id: string;
  title: string;
  category: TeaCategoryId;
  /** 如 "闽北乌龙 · 正岩肉桂" */
  subStyle: string;
  zone: ChinaTeaZoneId;
  mountainId: string;
  province: ProvinceId;
  provinceLabel: string;
  /** 如 "武夷山正岩慧苑坑 / 牛栏坑" */
  originCore: string;
  /** 如 "350m - 650m 丹霞谷地" */
  elevationRange: string;
  /** 适制茶树品种 */
  cultivar: string;
  /** 采摘标准与节令 */
  pluckingStandard: string;
  /** 发酵度数值 (0-100)，用于风味星图横轴定位 */
  fermentationPct: number;
  /** 焙火/陈化度数值 (0-100)，用于二维坐标纵轴定位 */
  roastScore: number;
  /** 标准茶汤色值 */
  liquorColorHex: string;
  /** 如 "深橙黄明亮 · 琥珀清透" */
  liquorColorLabel: string;
  /** 干茶条索审评 */
  dryLeafNote: string;
  /** 叶底特征审评 */
  infusedLeafNote: string;
  /** 香气前中后调标签 */
  aromaNotes: string[];
  tasteRadar: TeaTasteRadar;
  /** 核心制茶工序链 */
  craftSteps: string[];
  heritageTag?: string;
  tagline: string;
  /** 260-380 字深度茶志正文 */
  essay: string;
  brewing: BrewingProfile;
  famousSpots: TeaFamousSpot[];
  coord: [number, number];
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface TeaCategoryMeta {
  id: TeaCategoryId;
  name: string;
  englishName: string;
  fermentationRange: string;
  keyCraft: string;
  representativeLiquorHex: string;
  representativeLiquorLabel: string;
  natureNote: string;
  storageNote: string;
  summary: string;
  craftFlowSteps: string[];
}

export interface ChinaTeaZoneMeta {
  id: ChinaTeaZoneId;
  name: string;
  kicker: string;
  provinces: ProvinceId[];
  climateAndSoil: string;
  dominantCategories: TeaCategoryId[];
  colorHex: string;
  summary: string;
}

export interface TeaMountainSpec {
  id: string;
  name: string;
  zone: ChinaTeaZoneId;
  province: ProvinceId;
  provinceLabel: string;
  coord: [number, number];
  defaultZoom: number;
  elevation: string;
  landformAndSoil: string;
  microClimate: string;
  coreVillagesOrPeaks: string[];
  representativeTeaIds: string[];
  terroirNote: string;
  famousSpots?: { name: string; locationHint: string; note?: string }[];
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface TeaWareItem {
  id: string;
  name: string;
  category: TeaWareCategoryId;
  origin: string;
  materialAndPorosity: string;
  thermalBehavior: string;
  volumeRange: string;
  bestForCategories: TeaCategoryId[];
  avoidCategories: TeaCategoryId[];
  pairingReason: string;
  craftHighlight: string;
  description: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface TeaPairingRule {
  teaCategory: TeaCategoryId;
  recommendedWareIds: string[];
  waterTempRange: string;
  scientificRationale: string;
  tabooNote: string;
}

export interface TeaHistoryEra {
  id: string;
  dynasty: string;
  years: string;
  methodTitle: string;
  keyFigureOrClassic: string;
  teaForm: string;
  utensils: string[];
  aestheticCore: string;
  summary: string;
}

export interface SeasonalTeaGuide {
  seasonId: "spring" | "summer" | "autumn" | "winter";
  seasonTitle: string;
  solarTerms: string;
  bodyNeeds: string;
  recommendedCategories: TeaCategoryId[];
  recommendedTeaIds: string[];
  brewingTip: string;
  poeticNote: string;
}

export interface TeaCompendiumBundle {
  categories: TeaCategoryMeta[];
  zones: ChinaTeaZoneMeta[];
  mountains: TeaMountainSpec[];
  monographs: TeaMonograph[];
  teaware: TeaWareItem[];
  pairingMatrix: TeaPairingRule[];
  eras: TeaHistoryEra[];
  seasons: SeasonalTeaGuide[];
}

export const TEA_CATEGORY_SHORT_META: Record<
  TeaCategoryId,
  { id: TeaCategoryId; name: string; shortLabel: string; sealChar: string; liquorHex: string }
> = {
  green: { id: "green", name: "绿茶 · 不发酵", shortLabel: "绿茶", sealChar: "绿", liquorHex: "#C5D86D" },
  white: { id: "white", name: "白茶 · 微发酵", shortLabel: "白茶", sealChar: "白", liquorHex: "#EFE3B8" },
  yellow: { id: "yellow", name: "黄茶 · 轻发酵", shortLabel: "黄茶", sealChar: "黄", liquorHex: "#E6C25A" },
  oolong: { id: "oolong", name: "乌龙茶（青茶）· 半发酵", shortLabel: "乌龙", sealChar: "青", liquorHex: "#C97A2B" },
  black: { id: "black", name: "红茶 · 全发酵", shortLabel: "红茶", sealChar: "红", liquorHex: "#B53D24" },
  dark: { id: "dark", name: "黑茶 · 后发酵", shortLabel: "黑茶", sealChar: "黑", liquorHex: "#5C2318" },
  scented: { id: "scented", name: "再加工花茶 · 窨制", shortLabel: "花茶", sealChar: "花", liquorHex: "#E2D59B" },
};

export const CHINA_TEA_ZONE_SHORT_META: Record<
  ChinaTeaZoneId,
  { id: ChinaTeaZoneId; name: string; shortLabel: string; colorHex: string; provinces: ProvinceId[] }
> = {
  jiangnan: {
    id: "jiangnan",
    name: "江南茶区",
    shortLabel: "江南",
    colorHex: "#35685F",
    provinces: ["zj", "ah", "js", "jx", "hn", "hb", "sh"],
  },
  huanan: {
    id: "huanan",
    name: "华南茶区",
    shortLabel: "华南",
    colorHex: "#9A5B25",
    provinces: ["fj", "gd", "gx", "hi", "tw", "hk", "mo"],
  },
  xinan: {
    id: "xinan",
    name: "西南茶区",
    shortLabel: "西南",
    colorHex: "#A6402C",
    provinces: ["yn", "sc", "gz", "cq", "xz"],
  },
  jiangbei: {
    id: "jiangbei",
    name: "江北茶区",
    shortLabel: "江北",
    colorHex: "#588B57",
    provinces: ["ha", "sd", "sn", "gs"],
  },
};

export const TEA_WARE_CATEGORY_LABELS: Record<TeaWareCategoryId, string> = {
  zisha: "宜兴紫砂",
  gaiwan: "白瓷与青花盖碗",
  jianzhan: "建阳建盏",
  celadon: "汝窑与龙泉青瓷",
  chaozhou: "潮汕工夫茶器",
  kettle: "银壶与老铁壶煮水器",
};
