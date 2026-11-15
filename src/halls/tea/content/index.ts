import type { TeaCompendiumBundle } from "../types";
import { teaCategoriesMeta } from "./categoriesMeta";
import { chinaTeaZones, teaMountains } from "./zonesAndMountains";
import { greenTeas } from "./monographs/greenTeas";
import { whiteAndYellowTeas } from "./monographs/whiteAndYellowTeas";
import { oolongTeas } from "./monographs/oolongTeas";
import { blackTeas } from "./monographs/blackTeas";
import { darkAndScentedTeas } from "./monographs/darkAndScentedTeas";
import { teaWareItems, teaPairingMatrix } from "./teaware";
import { teaHistoryEras, seasonalTeaGuides } from "./chronicles";

export const allTeaMonographs = [
  ...greenTeas,
  ...whiteAndYellowTeas,
  ...oolongTeas,
  ...blackTeas,
  ...darkAndScentedTeas,
];

/**
 * 茗典 · 中华茶馆全量数据包 (`TeaCompendiumBundle`)
 * 涵盖：7 大茶类（六大茶类 + 再加工花茶）、4 大茶区、20 座核心名山、
 * 70 款传世名茶本纪、18 席经典茶器、7 则看茶择器科学配伍、6 幕千年茶史与 4 时二十四节气茶历。
 */
export const teaCompendium: TeaCompendiumBundle = {
  categories: teaCategoriesMeta,
  zones: chinaTeaZones,
  mountains: teaMountains,
  monographs: allTeaMonographs,
  teaware: teaWareItems,
  pairingMatrix: teaPairingMatrix,
  eras: teaHistoryEras,
  seasons: seasonalTeaGuides,
};

export {
  teaCategoriesMeta,
  chinaTeaZones,
  teaMountains,
  greenTeas,
  whiteAndYellowTeas,
  oolongTeas,
  blackTeas,
  darkAndScentedTeas,
  teaWareItems,
  teaPairingMatrix,
  teaHistoryEras,
  seasonalTeaGuides,
};
