import type { LngLat, ProvinceId } from "../../core/types";

export type { CoffeeSubView } from "../../core/types";

export type CoffeeProcessId =
  | "washed"
  | "natural"
  | "honey"
  | "anaerobic"
  | "wet-hulled"
  | "experimental"
  | "carbonic-maceration"
  | "thermal-shock"
  | "swiss-water-decaf";

export type RoastLevelId =
  | "light"
  | "light-medium"
  | "medium"
  | "medium-dark"
  | "dark";

export type CoffeeBeltZoneId =
  | "east-africa"
  | "central-south-america"
  | "yunnan-asia"
  | "island-terroir";

export type CoffeeVarietalId =
  | "gesha"
  | "bourbon"
  | "typica"
  | "sl28-sl34"
  | "catimor"
  | "heirloom"
  | "pacamara";

export interface GoldenCupRecipe {
  brewMethod: string;
  doseGrams: number;
  yieldMlOrGrams: number;
  ratioLabel: string;
  waterTempCelsius: number;
  grindSizeLabel: string;
  totalTimeSec: number;
  pourStages: string[];
}

export interface CoffeeSensoryRadar {
  acidity: number;
  sweetness: number;
  body: number;
  floralFruity: number;
  aftertaste: number;
}

export interface CoffeeProcessMeta {
  id: CoffeeProcessId;
  name: string;
  englishName: string;
  mucilageHandling: string;
  fermentationMechanism: string;
  cupClarityVsFunk: string;
  flavorSignature: string;
  accentHex: string;
  retainedFruitLayers?: string[];
  clarityScore?: number;
  fermentationFunkScore?: number;
  sweetnessScore?: number;
  typicalDays?: string;
}

export interface CoffeeOriginRegionSpec {
  id: string;
  zone: CoffeeBeltZoneId;
  name: string;
  countryOrProvince: string;
  province?: ProvinceId;
  latitudeBand: string;
  elevationRange: string;
  harvestMonths: string;
  dominantVarietals: string[];
  flavorProfile: string;
  coord?: LngLat;
  isChinaTerroir?: boolean;
  defaultZoom?: number;
  soilAndMicroclimate?: string;
  processingTradition?: string;
  representativeBeanIds?: string[];
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface CoffeePreviewSpecimen {
  id: string;
  /** 豆袋批次编号，如 "LOT #ETH-YRG-01" */
  lotCode: string;
  title: string;
  originLabel: string;
  beltZone: CoffeeBeltZoneId;
  province?: ProvinceId;
  coord?: LngLat;
  elevationMeters: string;
  varietal: string;
  process: CoffeeProcessId;
  processLabel: string;
  roastLevel: RoastLevelId;
  roastLabel: string;
  agtronScore?: string;
  cremaOrLiquorHex: string;
  flavorNotes: string[];
  sensoryRadar: CoffeeSensoryRadar;
  goldenCup: GoldenCupRecipe;
  tagline: string;
  previewNote: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface CoffeeBlueprintBundle {
  processes: CoffeeProcessMeta[];
  origins: CoffeeOriginRegionSpec[];
  specimens: CoffeePreviewSpecimen[];
}

export interface CoffeeSpeciesMeta {
  id: "arabica" | "canephora-robusta" | "liberica";
  name: string;
  latinName: string;
  chromosomes: string;
  elevationBand: string;
  caffeinePct: string;
  sugarAndLipidNote: string;
  flavorCharacter: string;
  globalSharePct: number;
}

export interface CoffeeVarietalMeta {
  id: string;
  name: string;
  englishName: string;
  lineageGroup: "typica-bourbon" | "ethiopian-landrace" | "hybrid-introgressed";
  geneticOrigin: string;
  elevationRequirement: string;
  beanSizeAndShape: string;
  yieldVsQuality: string;
  signatureNotes: string[];
  storySummary: string;
  representativeBeanIds: string[];
}

export interface CoffeeBeanMonograph extends CoffeePreviewSpecimen {
  originId: string;
  varietalId?: string;
  categoryRole: "single-origin-filter" | "soe-espresso" | "classic-blend" | "decaf";
  densityAndMoisture?: string;
  recommendedBrewMethodIds?: string[];
  essay: string;
}

export type CoffeeDrinkCategoryId =
  | "black-espresso"
  | "milk-velvet"
  | "iced-layered"
  | "signature-creative";

export interface CoffeeCupLayer {
  label: string;
  ratioPct: number;
  mlAmount: number;
  tempNote?: string;
  colorHex: string;
  textureNote: string;
}

export interface CoffeeBeverageRecipe {
  id: string;
  title: string;
  englishTitle: string;
  category: CoffeeDrinkCategoryId;
  originCityOrEra: string;
  cupVessel: string;
  totalVolumeMl: number;
  servingTemp: string;
  espressoBaseSpec: string;
  milkAndFoamNote: string;
  layers: CoffeeCupLayer[];
  tasteBalance: {
    strength: number;
    milkSweetness: number;
    foamThickness: number;
    refreshingness: number;
  };
  keyTechniqueTip: string;
  commonMistake: string;
  tagline: string;
  description: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export type BrewMethodId =
  | "hario-v60"
  | "kalita-wave"
  | "french-press"
  | "aeropress"
  | "siphon"
  | "moka-pot"
  | "cold-brew-ice-drip";

export interface BrewMethodWorkbenchSpec {
  id: BrewMethodId;
  name: string;
  englishName: string;
  extractionPhysics:
    | "percolation"
    | "immersion"
    | "vapor-pressure"
    | "vacuum-hybrid"
    | "cold-slow";
  grindLabel: string;
  grindMicrons: string;
  saltSugarAnalogy: string;
  baseDoseGrams: number;
  baseWaterGrams: number;
  ratioNumber: number;
  waterTempCelsius: number;
  totalTimeSec: number;
  filterType: string;
  cupClarityScore: number;
  bodyTextureScore: number;
  stages: {
    label: string;
    startSec: number;
    endSec: number;
    waterRatioMultiplier: number;
    actionTip: string;
  }[];
  scientificPrinciple: string;
  troubleshootingTip: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export type CoffeeEquipmentCategoryId =
  | "grinder-burr"
  | "dripper"
  | "espresso-machine"
  | "immersion-pressure"
  | "kettle-scale-prep"
  | "science-lab";

export type BurrGeometryType = "conical" | "flat" | "ghost-tooth";

export interface CoffeeEquipmentItem {
  id: string;
  name: string;
  englishName: string;
  category: CoffeeEquipmentCategoryId;
  burrType?: BurrGeometryType;
  inventorOrOrigin: string;
  coreMaterialAndSpec: string;
  fluidOrGrindMechanics: string;
  particleOrCupImpact: string;
  prosAndCons: string;
  bestForBrewMethods: string[];
  baristaProTip: string;
  description: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface CoffeeWaveEra {
  id: string;
  waveLabel: string;
  years: string;
  title: string;
  roastAndBeanStyle: string;
  representativeIcons: string[];
  philosophyCore: string;
  summary: string;
}

export interface CoffeeCityEcologyCard {
  id: string;
  cityOrRegion: string;
  country: string;
  isChinaFocus?: boolean;
  kicker: string;
  signatureDrinkOrRitual: string;
  cafeSpaceCulture: string;
  summary: string;
  wiki?: string;
  query?: string;
  photoUrl?: string;
}

export interface CoffeeCompendiumBundle {
  species: CoffeeSpeciesMeta[];
  varietals: CoffeeVarietalMeta[];
  processes: CoffeeProcessMeta[];
  origins: CoffeeOriginRegionSpec[];
  beans: CoffeeBeanMonograph[];
  beverages: CoffeeBeverageRecipe[];
  brewMethods: BrewMethodWorkbenchSpec[];
  equipment: CoffeeEquipmentItem[];
  waves: CoffeeWaveEra[];
  cityEcologies: CoffeeCityEcologyCard[];
}
