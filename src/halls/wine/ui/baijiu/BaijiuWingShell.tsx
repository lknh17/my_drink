import type { BaijiuAromaId, BaijiuSubView, WineCompendiumBundle } from "../../types";
import { BaijiuAromaTreeView } from "./BaijiuAromaTreeView";
import { BaijiuCraftView } from "./BaijiuCraftView";
import { BaijiuMonographReader } from "./BaijiuMonographReader";
import { BaijiuTerroirMapView } from "./BaijiuTerroirMapView";
import { BaijiuVesselsView } from "./BaijiuVesselsView";

export interface BaijiuWingShellProps {
  bundle: WineCompendiumBundle;
  activeSubView: BaijiuSubView;
  selectedAroma: BaijiuAromaId | "all";
  selectedZoneId: string | null;
  selectedBaijiuId: string | null;
  selectedVesselId?: string | null;
  onSubViewChange: (subView: BaijiuSubView) => void;
  onSelectAroma: (aroma: BaijiuAromaId | "all") => void;
  onSelectZone: (zoneId: string | null) => void;
  onSelectBaijiu: (id: string | null) => void;
  onBackToAtrium: () => void;
}

const VOLUMES: Array<[BaijiuSubView, string, string]> = [
  ["aromas", "卷一", "香型宗谱"], ["terroir", "卷二", "黄金产区"], ["monographs", "卷三", "名酒本纪"],
  ["craft", "卷四", "固态匠艺"], ["vessels", "卷五", "器礼配餐"],
];

export function BaijiuWingShell(props: BaijiuWingShellProps) {
  const selectBaijiu = (id: string) => { props.onSelectBaijiu(id); props.onSubViewChange("monographs"); };
  return (
    <div className="baijiu-wing-shell">
      <header className="baijiu-wing-masthead">
        <button className="baijiu-back" onClick={props.onBackToAtrium}>← 一院六境</button>
        <div><span className="baijiu-kicker">羊脂白瓷 · 朱砂陶坛 · 鎏金曲印</span><h1>国酿 · 中国白酒馆</h1><p>粮 · 曲 · 窖 · 艺 · 藏</p></div>
        <div className="baijiu-seal">国<br />酿</div>
      </header>
      <nav className="baijiu-volume-nav" aria-label="白酒馆五卷">
        {VOLUMES.map(([id, no, title]) => <button key={id} className={props.activeSubView === id ? "active" : ""} onClick={() => props.onSubViewChange(id)}><small>{no}</small><span>{title}</span></button>)}
      </nav>
      <main>
        {props.activeSubView === "aromas" && <BaijiuAromaTreeView bundle={props.bundle} selectedAroma={props.selectedAroma} onSelectAroma={props.onSelectAroma} onSelectBaijiu={selectBaijiu} />}
        {props.activeSubView === "terroir" && <BaijiuTerroirMapView bundle={props.bundle} selectedZoneId={props.selectedZoneId} onSelectZone={props.onSelectZone} onSelectBaijiu={selectBaijiu} />}
        {props.activeSubView === "monographs" && <BaijiuMonographReader bundle={props.bundle} selectedBaijiuId={props.selectedBaijiuId} selectedAroma={props.selectedAroma} onSelectAroma={props.onSelectAroma} onSelectBaijiu={(id) => props.onSelectBaijiu(id)} />}
        {props.activeSubView === "craft" && <BaijiuCraftView bundle={props.bundle} />}
        {props.activeSubView === "vessels" && <BaijiuVesselsView bundle={props.bundle} selectedVesselId={props.selectedVesselId} />}
      </main>
    </div>
  );
}
