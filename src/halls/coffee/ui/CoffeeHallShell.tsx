import type { CoffeeSubView, HallId } from "../../../core/types";
import { useDrinkFootprints } from "../../../core/drinkFootprints";
import type { CoffeeCompendiumBundle } from "../types";
import { CoffeeBotanyAndProcessView } from "./CoffeeBotanyAndProcessView";
import { CoffeeTerroirAtlasView } from "./CoffeeTerroirAtlasView";
import { CoffeeBeanMonographReader } from "./CoffeeBeanMonographReader";
import { CoffeeBeverageAndBrewLabView } from "./CoffeeBeverageAndBrewLabView";
import { CoffeeEquipmentGalleryView } from "./CoffeeEquipmentGalleryView";
import { CoffeeCultureAndEcologyView } from "./CoffeeCultureAndEcologyView";
import "../coffee.css";
import "./coffeeHall.css";

export interface CoffeeHallShellProps {
  bundle: CoffeeCompendiumBundle;
  activeSubView: CoffeeSubView;
  selectedOriginId: string | null;
  selectedBeanId: string | null;
  selectedDrinkId: string | null;
  selectedGearId: string | null;
  onSubViewChange: (sub: CoffeeSubView) => void;
  onSelectOrigin: (originId: string | null) => void;
  onSelectBean: (beanId: string | null) => void;
  onSelectDrink: (drinkId: string | null) => void;
  onSelectGear: (gearId: string | null) => void;
  onNavigateHall: (hall: HallId) => void;
  onOpenSearch: () => void;
  onOpenPassport: () => void;
  onOpenCalibration?: () => void;
}

export function CoffeeHallShell(props: CoffeeHallShellProps) {
  const { countsByHall } = useDrinkFootprints();
  const volumes: Array<{ id: CoffeeSubView; label: string }> = [
    { id: "botany", label: "卷一 · 树种与后制" },
    { id: "terroir", label: `卷二 · 全球与云南庄园 (${props.bundle.origins.length})` },
    { id: "monographs", label: `卷三 · 寻豆本纪 (${props.bundle.beans.length})` },
    { id: "brewing", label: `卷四 · 饮品与萃取 (${props.bundle.beverages.length})` },
    { id: "equipment", label: `卷五 · 器具道场 (${props.bundle.equipment.length})` },
    { id: "ecology", label: `卷六 · 浪潮与生态 (${props.bundle.cityEcologies.length})` },
  ];
  const goBean = (id: string) => { props.onSelectBean(id); props.onSubViewChange("monographs"); };
  const goOrigin = (id: string) => { props.onSelectOrigin(id); props.onSubViewChange("terroir"); };
  const goBrew = () => props.onSubViewChange("brewing");
  const goGear = (id: string) => { props.onSelectGear(id); props.onSubViewChange("equipment"); };

  return (
    <div className="coffee-hall" data-testid="coffee-hall-shell" data-coffee-subview={props.activeSubView}>
      <header className="coffee-topbar">
        <button type="button" className="coffee-home" onClick={() => props.onNavigateHall("portal")}>← 酌味总门户</button>
        <div className="coffee-brand">
          <span className="coffee-stamp-seal">咖典</span>
          <strong>咖典 · 精品咖啡全集</strong>
        </div>
        <div className="zw-topbar-actions">
          <button type="button" className="coffee-nav-btn" onClick={() => props.onNavigateHall("tea")}>🍵 茗典·茶馆</button>
          <button type="button" className="coffee-nav-btn" onClick={() => props.onNavigateHall("wine")}>🥃 醺典·酒馆</button>
          <button type="button" className="coffee-nav-btn" onClick={props.onOpenSearch}>⌘K 检索</button>
          <button type="button" className="coffee-nav-btn" onClick={props.onOpenPassport}>📜 品饮护照 · {countsByHall.coffee}</button>
          {props.onOpenCalibration && (
            <button type="button" className="coffee-nav-btn" onClick={props.onOpenCalibration}>🖼️ 配图校准</button>
          )}
        </div>
      </header>
      <nav className="coffee-volume-nav" aria-label="咖典六卷">
        {volumes.map((volume) => <button key={volume.id} type="button" className={volume.id === props.activeSubView ? "active" : ""} onClick={() => props.onSubViewChange(volume.id)}>{volume.label}</button>)}
      </nav>
      <main className="coffee-container">
        {props.activeSubView === "botany" && <CoffeeBotanyAndProcessView bundle={props.bundle} onSelectBean={goBean} />}
        {props.activeSubView === "terroir" && <CoffeeTerroirAtlasView bundle={props.bundle} selectedOriginId={props.selectedOriginId} onSelectOrigin={props.onSelectOrigin} onSelectBean={goBean} />}
        {props.activeSubView === "monographs" && <CoffeeBeanMonographReader bundle={props.bundle} selectedBeanId={props.selectedBeanId} onSelectBean={props.onSelectBean} onSelectOrigin={goOrigin} onOpenBrewing={goBrew} />}
        {props.activeSubView === "brewing" && <CoffeeBeverageAndBrewLabView bundle={props.bundle} selectedDrinkId={props.selectedDrinkId} onSelectDrink={props.onSelectDrink} onSelectGear={goGear} />}
        {props.activeSubView === "equipment" && <CoffeeEquipmentGalleryView bundle={props.bundle} selectedGearId={props.selectedGearId} onSelectGear={props.onSelectGear} />}
        {props.activeSubView === "ecology" && <CoffeeCultureAndEcologyView bundle={props.bundle} />}
      </main>
    </div>
  );
}
