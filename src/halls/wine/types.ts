import type { LngLat, ProvinceId, WineWingId } from "../../core/types";

export type { WineWingId } from "../../core/types";

export type WinePillarId = "fermented" | "distilled" | "cocktails";

export type WineSubCategoryId =
  | "baijiu"
  | "huangjiu"
  | "grape-wine"
  | "whisky"
  | "brandy-rum-gin"
  | "beer-sake"
  | "classic-cocktail";

/** 中国白酒十二大经典香型标识 */
export type BaijiuAromaId =
  | "jiangxiang"
  | "nongxiang"
  | "qingxiang"
  | "mixiang"
  | "fengxiang"
  | "jianxiang"
  | "dongxiang"
  | "zhimaxiang"
  | "texiang"
  | "fuyuxiang"
  | "laobaigan"
  | "chiweixiang";

export interface WinePillarMeta {
  id: WinePillarId;
  title: string;
  englishTitle: string;
  kicker: string;
  coreCraft: string;
  abvRange: string;
  signatureCategories: string[];
  accentHex: string;
  summary: string;
}

export interface BaijiuAromaSpec {
  id: BaijiuAromaId;
  name: string;
  representativeBrand: string;
  originRegion: string;
  province?: ProvinceId;
  quType: string;
  fermentationVessel: string;
  keyEsterOrCompound: string;
  sensorySignature: string;
  colorHex: string;
}

export interface ServingRitualSpec {
  glassware: string;
  servingTempCelsius: string;
  decantingOrDilution?: string;
  foodPairing: string;
}

export interface WineStructureRadar {
  body: number;
  aromaIntensity: number;
  sweetnessOrMalt: number;
  tanninOrPeat: number;
  finishLength: number;
}

export interface WhiskyCaskPeatPoint {
  id: string;
  name: string;
  region: string;
  /** 泥煤烟熏度 0-100 */
  peatScore: number;
  /** 雪莉桶/橡木脂香度 0-100 */
  sherryOakScore: number;
  flavorTag: string;
  colorHex: string;
}

export interface WinePreviewSpecimen {
  id: string;
  title: string;
  subtitle?: string;
  pillar: WinePillarId;
  subCategory?: WineSubCategoryId;
  baijiuAroma?: BaijiuAromaId;
  originLabel: string;
  province?: ProvinceId;
  coord?: LngLat;
  /** 如 "53% vol" 或 "13.5% vol" */
  abv: string;
  baseRawMaterial: string;
  fermentationAndAging: string;
  liquorColorHex: string;
  liquorColorLabel: string;
  aromaWheelTags: string[];
  structureRadar: WineStructureRadar;
  serving: ServingRitualSpec;
  tagline: string;
  previewNote: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface WineBlueprintBundle {
  pillars: WinePillarMeta[];
  baijiuAromas: BaijiuAromaSpec[];
  specimens: WinePreviewSpecimen[];
  whiskyMatrix?: WhiskyCaskPeatPoint[];
}

export interface WineWingMetaSpec {
  name: string;
  shortName: string;
  sealChar: string;
  aestheticLabel: string;
  accentHex: string;
  bgHex: string;
  isDarkTheme: boolean;
  countHint: string;
}

export const WINE_WING_META: Record<WineWingId, WineWingMetaSpec> = {
  atrium: {
    name: "一院六境 · 酒之总门厅",
    shortName: "六境门厅",
    sealChar: "醺",
    aestheticLabel: "曲米素宣 · 陶金丹砂",
    accentHex: "#A62121",
    bgHex: "#F7F3EB",
    isDarkTheme: false,
    countHint: "六境总谱",
  },
  baijiu: {
    name: "国酿 · 中国白酒馆",
    shortName: "中国白酒",
    sealChar: "酿",
    aestheticLabel: "羊脂白瓷 · 朱砂陶坛 · 鎏金曲印",
    accentHex: "#A62121",
    bgHex: "#FAF8F4",
    isDarkTheme: false,
    countHint: "54 款名酒",
  },
  beer: {
    name: "麦律 · 啤酒与精酿馆",
    shortName: "啤酒精酿",
    sealChar: "麦",
    aestheticLabel: "麦芽琥珀 · 酒花翠绿 · 铜釜泡沫",
    accentHex: "#3A6B34",
    bgHex: "#FBF6EC",
    isDarkTheme: false,
    countHint: "32+ 款酒头",
  },
  huangjiu: {
    name: "古越 · 黄酒与东方米酒馆",
    shortName: "黄酒米酒",
    sealChar: "越",
    aestheticLabel: "稽山鉴水 · 花雕泥封",
    accentHex: "#8F3D2E",
    bgHex: "#F6F1E7",
    isDarkTheme: false,
    countHint: "8 款典藏",
  },
  grape: {
    name: "风土 · 世界与中国葡萄酒馆",
    shortName: "葡萄酒",
    sealChar: "葡",
    aestheticLabel: "酒庄羊皮纸 · 勃艮第宝石红",
    accentHex: "#6E1D2C",
    bgHex: "#F8F4EE",
    isDarkTheme: false,
    countHint: "32 款名庄",
  },
  spirits: {
    name: "橡木 · 世界蒸馏烈酒馆",
    shortName: "世界烈酒",
    sealChar: "橡",
    aestheticLabel: "暗夜橡木桶 · 紫铜泥煤流金",
    accentHex: "#D4943A",
    bgHex: "#13100E",
    isDarkTheme: true,
    countHint: "32 款烈酒",
  },
  cocktails: {
    name: "微醺 · 鸡尾酒调酒馆",
    shortName: "鸡尾酒",
    sealChar: "调",
    aestheticLabel: "摩登暗调吧台 · 翡翠苦精与黄铜",
    accentHex: "#CFA15A",
    bgHex: "#10181B",
    isDarkTheme: true,
    countHint: "8 款配方",
  },
};

export type BaijiuSubView = "aromas" | "terroir" | "monographs" | "craft" | "vessels";
export type BaijiuBaseAromaGroup = "four-foundational" | "eight-derived";

export interface BaijiuAromaGenealogyNode extends BaijiuAromaSpec {
  group: BaijiuBaseAromaGroup;
  parentAromas: BaijiuAromaId[];
  establishedYear: string;
  quPeakTempCelsius: number;
  quDetail: string;
  pitStructure: string;
  fermentationDays: string;
  distillationRule: string;
  coreMolecules: string[];
  esterProfileSummary: string;
  typicalAbv: string;
  representativeIds: string[];
  pairingCuisines: string[];
}

export type BaijiuBeltId =
  | "chishui-guizhou"
  | "chuannan-yangtze"
  | "jianghuai-wetland"
  | "fenhe-north"
  | "qinling-zhongyuan"
  | "lingnan-karst-plateau";

export interface BaijiuTerroirBeltMeta {
  id: BaijiuBeltId;
  name: string;
  kicker: string;
  provinces: ProvinceId[];
  colorHex: string;
  waterAndClimate: string;
  dominantAromas: BaijiuAromaId[];
  summary: string;
}

export interface BaijiuTerroirZone {
  id: string;
  name: string;
  belt: BaijiuBeltId;
  province: ProvinceId;
  provinceLabel: string;
  coord: LngLat;
  defaultZoom: number;
  riverOrSpring: string;
  geologyAndMicrobes: string;
  climateFeature: string;
  coreTownsOrDistilleries: string[];
  dominantAromas: BaijiuAromaId[];
  representativeBaijiuIds: string[];
  terroirNote: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface BaijiuMonograph {
  id: string;
  title: string;
  aroma: BaijiuAromaId;
  subSchool: string;
  terroirZoneId: string;
  province: ProvinceId;
  provinceLabel: string;
  originCore: string;
  waterAndMicroecology: string;
  nationalHonorTag?: string;
  grainFormula: string;
  quCraft: string;
  pitAndCycle: string;
  abvOptions: string;
  agingAndBlend: string;
  keyCompounds: string[];
  aromaIntensityScore: number;
  cellarBodyScore: number;
  liquorHueHex: string;
  liquorBeadNote: string;
  noseNotes: string[];
  palateNote: string;
  emptyCupNote: string;
  sensoryRadar: {
    esterAroma: number;
    grainSweetness: number;
    bodyRichness: number;
    smoothness: number;
    emptyCupPersistence: number;
  };
  servingRitual: {
    vessel: string;
    tempCelsius: string;
    decantMinutes: string;
    foodPairings: string[];
  };
  tagline: string;
  essay: string;
  coord: LngLat;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface BaijiuCraftStage {
  stepNo: number;
  id: string;
  title: string;
  subtitle: string;
  keyMetrics: string;
  scientificPrinciple: string;
  aromaDivergenceNote: string;
}

export interface BaijiuDistillationCut {
  id: string;
  cutName: string;
  beadName: string;
  abvRange: string;
  beadSizeAndDuration: string;
  esterAlcoholNote: string;
  usageInBlend: string;
}

export interface BaijiuVesselItem {
  id: string;
  name: string;
  era: string;
  material: string;
  capacityLabel: string;
  functionCategory: "ancient-ritual" | "warming-pouring" | "cellar-storage" | "modern-tasting";
  physicalAndSensoryNote: string;
  craftHighlight: string;
  description: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export type BeerSubView = "styles" | "lab" | "taplist" | "craft";
export type BeerFermentationFamily = "ale" | "lager" | "wild-sour";
export type BeerStyleCategoryId =
  | "crisp-lager"
  | "wheat-wit"
  | "hoppy-ipa"
  | "belgian-abbey"
  | "malty-bock-amber"
  | "dark-stout-porter"
  | "wild-sour-fruit"
  | "chinese-terroir-craft";
export type BeerGlassId =
  | "pilsner-flute"
  | "weizen-vase"
  | "tulip"
  | "trappist-chalice"
  | "nonic-pint"
  | "shaker-pint"
  | "snifter"
  | "stange";

export interface BeerStyleMeta {
  id: BeerStyleCategoryId;
  name: string;
  englishName: string;
  family: BeerFermentationFamily;
  yeastAndTemp: string;
  typicalAbvRange: string;
  typicalIbuRange: string;
  typicalSrmRange: string;
  colorHex: string;
  sensorySummary: string;
  representativeBeerIds: string[];
}

export interface BeerSrmSwatch {
  srm: number;
  name: string;
  englishName: string;
  hex: string;
  maltKilningNote: string;
  exampleStyles: string[];
}

export interface BeerGlassSpec {
  id: BeerGlassId;
  name: string;
  englishName: string;
  volumeMl: number;
  headRetentionMechanics: string;
  aromaFocusingNote: string;
  bestForStyles: string[];
}

export interface BeerMonograph {
  id: string;
  tapNumber: string;
  title: string;
  brewery: string;
  countryOrRegion: string;
  isChineseRepresentative?: boolean;
  province?: ProvinceId;
  fermentationFamily: BeerFermentationFamily;
  styleCategory: BeerStyleCategoryId;
  bjcpStyleLabel: string;
  originalGravityPlato: string;
  abv: string;
  abvNum: number;
  ibu: number;
  srm: number;
  srmColorHex: string;
  foamHeadNote: string;
  maltBill: string;
  hopsUsed: string;
  yeastAndProcess: string;
  aromaTags: string[];
  flavorRadar: {
    hopBitterness: number;
    hopAroma: number;
    maltSweetness: number;
    roastBody: number;
    crispnessOrSour: number;
  };
  glassware: BeerGlassId;
  servingTempCelsius: string;
  foodPairings: string[];
  tagline: string;
  essay: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export type HuangjiuSugarType =
  | "dry-yuanhong"
  | "semi-dry-jiafan"
  | "semi-sweet-shanniang"
  | "sweet-xiangxue"
  | "sake-makgeolli";

export interface HuangjiuSpecimen {
  id: string;
  title: string;
  sugarType: HuangjiuSugarType;
  sugarLabel: string;
  totalSugarGPerL: number;
  originLabel: string;
  province?: ProvinceId;
  riceAndWater: string;
  quAndStarter: string;
  agingYears: string;
  abv: string;
  liquorColorHex: string;
  aminoAcidUmamiNote: string;
  warmingAndServing: string;
  foodPairings: string[];
  tagline: string;
  essay: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export type GrapeWineStyleType = "red" | "white" | "sparkling" | "sweet-fortified";

export type GrapeSubView = "varietals" | "terroir" | "monographs" | "sommelier";

export type GrapeVarietalId =
  | "cabernet-sauvignon"
  | "pinot-noir"
  | "merlot"
  | "syrah"
  | "nebbiolo"
  | "sangiovese"
  | "marselan"
  | "chardonnay"
  | "riesling"
  | "sauvignon-blanc"
  | "gewurztraminer"
  | "chenin-blanc";

export interface GrapeVarietalMeta {
  id: GrapeVarietalId;
  name: string;
  englishName: string;
  colorType: "red" | "white";
  originClassic: string;
  skinThicknessAndTannin: number;
  naturalAcidityAndAroma: number;
  bodyScore: number;
  colorHex: string;
  signatureAromas: string[];
  climatePreference: string;
  agingPotential: string;
  chinaAdaptationNote?: string;
  summary: string;
  representativeWineIds: string[];
}

export interface GrapeWineRegionSpec {
  id: string;
  name: string;
  country: string;
  worldGroup: "old-world" | "new-world" | "china-terroir";
  province?: ProvinceId;
  coord: LngLat;
  latitudeLabel: string;
  classificationSystem: string;
  climateAndSoil: string;
  signatureVarietals: string[];
  representativeWineIds: string[];
  terroirSummary: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface GrapeOakAndGlassItem {
  id: string;
  kind: "oak-barrel" | "stemware-decanter";
  name: string;
  englishName: string;
  specBadge: string;
  physicalMechanism: string;
  flavorOrAromaImpact: string;
  bestForStyles: string[];
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface GrapeWineSpecimen {
  id: string;
  title: string;
  styleType: GrapeWineStyleType;
  originAppellation: string;
  country: string;
  isChineseTerroir?: boolean;
  province?: ProvinceId;
  grapeVarietals: string;
  climateAndSoil: string;
  vinificationAndOak: string;
  abv: string;
  liquorColorHex: string;
  structureBars: {
    tannin: number;
    acidity: number;
    body: number;
    sweetness: number;
    oak: number;
  };
  aromaNotes: string[];
  sommelierService: {
    glass: string;
    tempCelsius: string;
    decant: string;
    pairings: string[];
  };
  tagline: string;
  essay: string;
  varietalId?: GrapeVarietalId;
  regionId?: string;
  worldGroup?: "old-world" | "new-world" | "china-terroir";
  classificationBadge?: string;
  drinkingWindow?: string;
  rimColorNote?: string;
  chineseFoodPairings?: string[];
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export type WorldSpiritCategory =
  | "single-malt-whisky"
  | "cognac-brandy"
  | "rum"
  | "gin"
  | "agave-tequila-mezcal"
  | "vodka";

export type SpiritsSubView =
  | "genealogy"
  | "whisky-cask"
  | "monographs"
  | "distill-ritual";

export interface SpiritFamilyMeta {
  id: WorldSpiritCategory;
  name: string;
  englishName: string;
  rawSugarSource: string;
  fermentationWash: string;
  stillArchitecture: string;
  agingLaw: string;
  abvTypical: string;
  accentHex: string;
  summary: string;
  subStyles: string[];
  representativeSpiritIds: string[];
}

export interface WhiskyRegionSpec {
  id: string;
  name: string;
  country: string;
  coord: LngLat;
  styleSignature: string;
  peatProfile: string;
  signatureDistilleries: string[];
  representativeSpiritIds: string[];
  summary: string;
}

export interface SpiritCaskTypeSpec {
  id: string;
  name: string;
  englishName: string;
  woodSpecies: string;
  previousLiquid: string;
  toastOrCharLevel: string;
  colorTintHex: string;
  colorLabel: string;
  vanillinAndTanninNote: string;
  signatureFlavors: string[];
  representativeSpiritIds: string[];
}

export interface SpiritGlassAndRitualItem {
  id: string;
  name: string;
  englishName: string;
  category: "glassware" | "ice-water-science";
  specBadge: string;
  fluidAndAromaMechanics: string;
  bestForSpirits: string[];
  practicalTip: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface WorldSpiritSpecimen {
  id: string;
  title: string;
  category: WorldSpiritCategory;
  originRegion: string;
  baseMaterial: string;
  stillType: string;
  caskAndAging: string;
  abv: string;
  peatPpm?: number;
  liquorColorHex: string;
  nosesAndPalate: string[];
  radar: {
    peatOrSmoke: number;
    caskRichness: number;
    floralFruity: number;
    spiceWarmth: number;
    finishLength: number;
  };
  servingNote: string;
  tagline: string;
  essay: string;
  subRegionLabel?: string;
  whiskyRegionId?: string;
  caskTypeIds?: string[];
  ageStatement?: string;
  coord?: LngLat;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export type CocktailMethod = "stirred" | "shaken" | "built";

export interface CocktailIngredientPart {
  name: string;
  amountMl: number;
  role: "base" | "modifier" | "acid-bitter" | "tea-eastern";
  colorHex: string;
}

export interface CocktailRecipeSpecimen {
  id: string;
  title: string;
  englishTitle: string;
  eraOrOrigin: string;
  isEasternFusion?: boolean;
  method: CocktailMethod;
  glassware: string;
  iceSpec: string;
  garnish: string;
  abvEstimate: string;
  liquorColorHex: string;
  ingredients: CocktailIngredientPart[];
  balanceAxis: {
    spiritStrength: number;
    sweetRichness: number;
    sourBitterTension: number;
    dilutionChill: number;
  };
  flavorTags: string[];
  preparationSteps: string[];
  tagline: string;
  essay: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface WineCompendiumBundle {
  baijiuAromas: BaijiuAromaGenealogyNode[];
  baijiuBelts: BaijiuTerroirBeltMeta[];
  baijiuZones: BaijiuTerroirZone[];
  baijiuMonographs: BaijiuMonograph[];
  baijiuCraftStages: BaijiuCraftStage[];
  baijiuDistillationCuts: BaijiuDistillationCut[];
  baijiuVessels: BaijiuVesselItem[];
  beerStyles: BeerStyleMeta[];
  beerSrmScale: BeerSrmSwatch[];
  beerGlassware: BeerGlassSpec[];
  beerMonographs: BeerMonograph[];
  huangjiuSpecimens: HuangjiuSpecimen[];
  grapeSpecimens: GrapeWineSpecimen[];
  grapeVarietals?: GrapeVarietalMeta[];
  grapeRegions?: GrapeWineRegionSpec[];
  grapeOakAndGlass?: GrapeOakAndGlassItem[];
  spiritSpecimens: WorldSpiritSpecimen[];
  spiritFamilies?: SpiritFamilyMeta[];
  whiskyRegions?: WhiskyRegionSpec[];
  spiritCaskTypes?: SpiritCaskTypeSpec[];
  spiritGlassesAndRituals?: SpiritGlassAndRitualItem[];
  whiskyMatrix: WhiskyCaskPeatPoint[];
  cocktailSpecimens: CocktailRecipeSpecimen[];
}
