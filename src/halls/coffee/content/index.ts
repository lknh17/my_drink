import type { CoffeeCompendiumBundle } from "../types";
import { coffeeBeans } from "./beansWorldAndChina";
import { coffeeBeverages, coffeeBrewMethods } from "./beveragesAndBrewing";
import {
  coffeeOrigins as originDefinitions,
  coffeeProcesses,
  coffeeSpecies,
  coffeeVarietals,
} from "./botanyAndOrigins";
import { coffeeCityEcologies, coffeeEquipment, coffeeWaves } from "./equipmentAndEcology";

export { coffeeBlueprint } from "../content";
export { coffeeBeans } from "./beansWorldAndChina";
export { coffeeBeverages, coffeeBrewMethods } from "./beveragesAndBrewing";
export { coffeeProcesses, coffeeSpecies, coffeeVarietals } from "./botanyAndOrigins";
export { coffeeCityEcologies, coffeeEquipment, coffeeWaves } from "./equipmentAndEcology";

export const coffeeOrigins = originDefinitions.map((origin) => ({
  ...origin,
  representativeBeanIds: coffeeBeans
    .filter((bean) => bean.originId === origin.id)
    .map((bean) => bean.id),
}));

export const coffeeCompendium: CoffeeCompendiumBundle = {
  species: coffeeSpecies,
  varietals: coffeeVarietals,
  processes: coffeeProcesses,
  origins: coffeeOrigins,
  beans: coffeeBeans,
  beverages: coffeeBeverages,
  brewMethods: coffeeBrewMethods,
  equipment: coffeeEquipment,
  waves: coffeeWaves,
  cityEcologies: coffeeCityEcologies,
};
