import { WHISKY_CASK_PEAT_MATRIX } from "../content";
import type { WineCompendiumBundle } from "../types";
import { baijiuAromas, baijiuBelts, baijiuZones } from "./baijiuMetaAndTerroir";
import { baijiuSauceAndStrongA } from "./baijiuSauceAndStrongA";
import { baijiuStrongB } from "./baijiuStrongB";
import { baijiuLightAndDerived } from "./baijiuLightAndDerived";
import {
  baijiuCraftStages,
  baijiuDistillationCuts,
  baijiuVessels,
} from "./baijiuCraftAndVessels";
import {
  beerGlassware,
  beerSrmScale,
  beerStyles,
  worldBeerMonographs,
} from "./beerMetaAndWorld";
import { chineseBeerMonographs } from "./beerChineseMonographs";
import {
  fullGrapeSpecimens,
  grapeOakAndGlass,
  grapeRegions,
  grapeVarietals,
} from "./grapeFullCompendium";
import {
  fullSpiritSpecimens,
  spiritCaskTypes,
  spiritFamilies,
  spiritGlassesAndRituals,
  whiskyRegions,
} from "./spiritsFullCompendium";
import {
  cocktailSpecimens,
  huangjiuSpecimens,
} from "./fourCuratedWings";

export { wineBlueprint } from "../content";

export const wineCompendium: WineCompendiumBundle = {
  baijiuAromas,
  baijiuBelts,
  baijiuZones,
  baijiuMonographs: [
    ...baijiuSauceAndStrongA,
    ...baijiuStrongB,
    ...baijiuLightAndDerived,
  ],
  baijiuCraftStages,
  baijiuDistillationCuts,
  baijiuVessels,
  beerStyles,
  beerSrmScale,
  beerGlassware,
  beerMonographs: [...worldBeerMonographs, ...chineseBeerMonographs],
  huangjiuSpecimens,
  grapeSpecimens: fullGrapeSpecimens,
  grapeVarietals,
  grapeRegions,
  grapeOakAndGlass,
  spiritSpecimens: fullSpiritSpecimens,
  spiritFamilies,
  whiskyRegions,
  spiritCaskTypes,
  spiritGlassesAndRituals,
  whiskyMatrix: WHISKY_CASK_PEAT_MATRIX,
  cocktailSpecimens,
};
