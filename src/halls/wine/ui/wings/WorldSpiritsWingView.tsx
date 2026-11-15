import {
  fullSpiritSpecimens,
  spiritCaskTypes,
  spiritFamilies,
  spiritGlassesAndRituals,
  whiskyRegions,
} from "../../content/spiritsFullCompendium";
import type { SpiritsSubView } from "../../types";
import { SpiritsCraftAndRitualView } from "../spirits/SpiritsCraftAndRitualView";
import { SpiritsGenealogyView } from "../spirits/SpiritsGenealogyView";
import { SpiritsMonographReader } from "../spirits/SpiritsMonographReader";
import { WhiskyAndCaskAtlasView } from "../spirits/WhiskyAndCaskAtlasView";
import type { CuratedWingProps } from "./HuangjiuWingView";
import "../spirits/spirits.css";

type WorldSpiritsWingViewProps = Omit<CuratedWingProps, "activeSubView"> & {
  activeSubView: SpiritsSubView;
};

export function WorldSpiritsWingView({ bundle, selectedSpecimenId, activeSubView, onSubViewChange, onSelectSpecimen, onBackToAtrium }: WorldSpiritsWingViewProps) {
  const specimens = bundle.spiritFamilies?.length ? bundle.spiritSpecimens : fullSpiritSpecimens;
  const families = bundle.spiritFamilies?.length ? bundle.spiritFamilies : spiritFamilies;
  const regions = bundle.whiskyRegions?.length ? bundle.whiskyRegions : whiskyRegions;
  const casks = bundle.spiritCaskTypes?.length ? bundle.spiritCaskTypes : spiritCaskTypes;
  const rituals = bundle.spiritGlassesAndRituals?.length ? bundle.spiritGlassesAndRituals : spiritGlassesAndRituals;
  const view = activeSubView ?? "genealogy";
  const select = (id: string) => onSelectSpecimen(id);
  return <div className="spirits-flagship">
    <header className="spirits-mast"><button onClick={onBackToAtrium}>← 六境门厅</button><div><small>OAK · THE DARK CELLAR</small><h1>橡木 · 世界蒸馏烈酒馆</h1><p>三十二瓶世界坐标、九片威士忌风土与六种橡木桶前世，在紫铜与琥珀光中展开四卷全集。</p></div></header>
    <nav className="spirits-volumes"><button className={view==="genealogy"?"on":""} onClick={()=>onSubViewChange?.("genealogy")}>卷一 · 六大烈酒总谱</button><button className={view==="whisky-cask"?"on":""} onClick={()=>onSubViewChange?.("whisky-cask")}>卷二 · 威士忌与桶陈</button><button className={view==="monographs"?"on":""} onClick={()=>onSubViewChange?.("monographs")}>卷三 · 殿堂烈酒本纪</button><button className={view==="distill-ritual"?"on":""} onClick={()=>onSubViewChange?.("distill-ritual")}>卷四 · 蒸馏与器礼</button></nav>
    <main>{view==="genealogy"&&<SpiritsGenealogyView families={families} specimens={specimens} selectedId={selectedSpecimenId} onSelect={select}/>}
      {view==="whisky-cask"&&<WhiskyAndCaskAtlasView regions={regions} casks={casks} specimens={specimens} onSelect={select}/>}
      {view==="monographs"&&<SpiritsMonographReader specimens={specimens} regions={regions} casks={casks} selectedId={selectedSpecimenId} onSelect={select}/>}
      {view==="distill-ritual"&&<SpiritsCraftAndRitualView rituals={rituals}/>}</main>
  </div>;
}
