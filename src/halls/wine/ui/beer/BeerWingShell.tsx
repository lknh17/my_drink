import type { BeerStyleCategoryId, BeerSubView, WineCompendiumBundle } from "../../types";
import { BeerBrewingCraftView } from "./BeerBrewingCraftView";
import { BeerLabMatrixView } from "./BeerLabMatrixView";
import { BeerStyleTreeView } from "./BeerStyleTreeView";
import { BeerTaplistReader } from "./BeerTaplistReader";
import "./beer.css";

export interface BeerWingShellProps {
  bundle: WineCompendiumBundle;
  activeSubView: BeerSubView;
  selectedStyle: BeerStyleCategoryId | "all";
  selectedBeerId: string | null;
  onSubViewChange: (view: BeerSubView) => void;
  onSelectStyle: (style: BeerStyleCategoryId | "all") => void;
  onSelectBeer: (id: string | null) => void;
  onBackToAtrium: () => void;
}

const NAV: Array<{ id: BeerSubView; no: string; name: string; en: string }> = [
  { id: "styles", no: "I", name: "谱系卷", en: "Yeast Dynasties" },
  { id: "lab", no: "II", name: "色苦仪", en: "SRM × IBU Lab" },
  { id: "taplist", no: "III", name: "酒单卷", en: "Tap Dossiers" },
  { id: "craft", no: "IV", name: "酿造卷", en: "Brewing Craft" },
];

export function BeerWingShell(props: BeerWingShellProps) {
  const openBeer = (id: string | null) => { props.onSelectBeer(id); if (id) props.onSubViewChange("taplist"); };
  return <div className="beer-wing">
    <header className="beer-masthead">
      <button className="beer-back" onClick={props.onBackToAtrium}>← 酒之六境</button>
      <div><small>MÀI LǛ · BEER & CRAFT ARCHIVE</small><h1>麦律 <i>·</i> 啤酒与精酿馆</h1><p>水 · 麦芽 · 酒花 · 酵母</p></div>
      <span className="beer-seal">麦<br />律</span>
    </header>
    <nav className="beer-wing-nav">{NAV.map((n) => <button key={n.id} className={props.activeSubView === n.id ? "on" : ""} onClick={() => props.onSubViewChange(n.id)}><b>{n.no}</b><span>{n.name}<small>{n.en}</small></span></button>)}</nav>
    <main>
      {props.activeSubView === "styles" && <BeerStyleTreeView bundle={props.bundle} selectedStyle={props.selectedStyle} onSelectStyle={props.onSelectStyle} onSelectBeer={openBeer} />}
      {props.activeSubView === "lab" && <BeerLabMatrixView bundle={props.bundle} onSelectBeer={openBeer} />}
      {props.activeSubView === "taplist" && <BeerTaplistReader bundle={props.bundle} selectedStyle={props.selectedStyle} selectedBeerId={props.selectedBeerId} onSelectStyle={props.onSelectStyle} onSelectBeer={props.onSelectBeer} />}
      {props.activeSubView === "craft" && <BeerBrewingCraftView bundle={props.bundle} />}
    </main>
    <footer className="beer-footer"><span>麦芽琥珀</span><i>✦</i><span>酒花翠绿</span><i>✦</i><span>铜釜泡沫</span></footer>
  </div>;
}
