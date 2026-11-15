import {
  fullGrapeSpecimens,
  grapeOakAndGlass,
  grapeRegions,
  grapeVarietals,
} from "../../content/grapeFullCompendium";
import type { GrapeSubView } from "../../types";
import { GrapeCraftAndSommelierView } from "../grape/GrapeCraftAndSommelierView";
import { GrapeMonographReader } from "../grape/GrapeMonographReader";
import { GrapeTerroirAndClassificationView } from "../grape/GrapeTerroirAndClassificationView";
import { GrapeVarietalAtlasView } from "../grape/GrapeVarietalAtlasView";
import "../grape/grape.css";
import type { CuratedWingProps } from "./HuangjiuWingView";

type GrapeWineWingViewProps = Omit<CuratedWingProps, "activeSubView"> & {
  activeSubView: GrapeSubView;
};

export function GrapeWineWingView({ bundle, selectedSpecimenId, activeSubView, onSubViewChange, onSelectSpecimen, onBackToAtrium }: GrapeWineWingViewProps) {
  const varietals = bundle.grapeVarietals?.length ? bundle.grapeVarietals : grapeVarietals;
  const regions = bundle.grapeRegions?.length ? bundle.grapeRegions : grapeRegions;
  const oakAndGlass = bundle.grapeOakAndGlass?.length ? bundle.grapeOakAndGlass : grapeOakAndGlass;
  const wines = bundle.grapeSpecimens.length >= 32 ? bundle.grapeSpecimens : fullGrapeSpecimens;
  const view = activeSubView ?? "varietals";
  const openWine = (id: string) => {
    onSelectSpecimen(id);
    onSubViewChange?.("monographs");
  };
  return <div className="grape-flagship">
    <header className="grape-flagship-mast"><button onClick={onBackToAtrium}>← 六境门厅</button><div><small>TERROIR · ESTATE CELLAR · FOUR VOLUMES</small><h1>风土 · 世界与中国葡萄酒馆</h1><p>十二品种、十九座风土坐标、三十二款名庄酒标与完整侍酒器礼，构成一座可阅读、可比较、可打卡的庄园酒窖。</p></div></header>
    <nav className="grape-volume-nav" aria-label="葡萄酒馆四卷">
      <button className={view === "varietals" ? "on" : ""} onClick={() => onSubViewChange?.("varietals")}><b>壹</b><span>品种谱<small>十二贵族葡萄矩阵</small></span></button>
      <button className={view === "terroir" ? "on" : ""} onClick={() => onSubViewChange?.("terroir")}><b>贰</b><span>风土与分级<small>世界酒带 · 中国四区</small></span></button>
      <button className={view === "monographs" ? "on" : ""} onClick={() => onSubViewChange?.("monographs")}><b>叁</b><span>名庄本纪<small>三十二款酒标精读</small></span></button>
      <button className={view === "sommelier" ? "on" : ""} onClick={() => onSubViewChange?.("sommelier")}><b>肆</b><span>酿造与侍酒<small>橡木桶 · 水晶器礼</small></span></button>
    </nav>
    {view === "varietals" && <GrapeVarietalAtlasView varietals={varietals} wines={wines} onSelectWine={openWine}/>}
    {view === "terroir" && <GrapeTerroirAndClassificationView regions={regions} wines={wines} onSelectWine={openWine}/>}
    {view === "monographs" && <GrapeMonographReader wines={wines} varietals={varietals} selectedWineId={selectedSpecimenId} onSelectWine={onSelectSpecimen}/>}
    {view === "sommelier" && <GrapeCraftAndSommelierView items={oakAndGlass}/>}
  </div>;
}
