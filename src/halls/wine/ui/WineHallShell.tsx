import type { DrinkRouteTarget, HallId, WineWingId } from "../../../core/types";
import type {
  BaijiuAromaId,
  BaijiuSubView,
  BeerSubView,
  BeerStyleCategoryId,
  GrapeSubView,
  SpiritsSubView,
  WineCompendiumBundle,
} from "../types";
import { WINE_WING_META } from "../types";
import { WineAtriumView } from "./WineAtriumView";
import { BaijiuWingShell } from "./baijiu/BaijiuWingShell";
import { BeerWingShell } from "./beer/BeerWingShell";
import { CocktailWingView } from "./wings/CocktailWingView";
import { GrapeWineWingView } from "./wings/GrapeWineWingView";
import { HuangjiuWingView } from "./wings/HuangjiuWingView";
import { WorldSpiritsWingView } from "./wings/WorldSpiritsWingView";
import "./baijiu/baijiu.css";
import "./wineShell.css";

export interface WineHallShellProps {
  bundle: WineCompendiumBundle;
  activeWing: WineWingId;
  activeSubView: string | null;
  selectedAroma: BaijiuAromaId | "all";
  selectedBeerStyle: BeerStyleCategoryId | "all";
  selectedZoneId: string | null;
  selectedSpecimenId: string | null;
  onWingChange: (wing: WineWingId, subView?: string | null) => void;
  onSubViewChange: (subView: string | null) => void;
  onSelectAroma: (aroma: BaijiuAromaId | "all") => void;
  onSelectBeerStyle: (style: BeerStyleCategoryId | "all") => void;
  onSelectZone: (zoneId: string | null) => void;
  onSelectSpecimen: (specimenId: string | null, wing?: WineWingId) => void;
  onNavigateHall: (hall: HallId) => void;
  onNavigate: (target: DrinkRouteTarget) => void;
  onOpenSearch: () => void;
  onOpenPassport: () => void;
  onOpenCalibration?: () => void;
}

const WING_ORDER: WineWingId[] = [
  "atrium",
  "baijiu",
  "beer",
  "huangjiu",
  "grape",
  "spirits",
  "cocktails",
];
const WING_RIBBON_LABEL: Record<WineWingId, string> = {
  atrium: "六境门厅",
  baijiu: "国酿·中国白酒 (60)",
  beer: "麦律·啤酒精酿 (32)",
  huangjiu: "古越·黄酒米酒 (8)",
  grape: "风土·葡萄酒",
  spirits: "橡木·世界烈酒",
  cocktails: "微醺·鸡尾酒 (8)",
};

export function WineHallShell(props: WineHallShellProps) {
  const specimenWing = props.selectedSpecimenId
    ? props.bundle.baijiuMonographs.some((x) => x.id === props.selectedSpecimenId) ? "baijiu"
      : props.bundle.beerMonographs.some((x) => x.id === props.selectedSpecimenId) ? "beer"
      : props.bundle.huangjiuSpecimens.some((x) => x.id === props.selectedSpecimenId) ? "huangjiu"
      : props.bundle.grapeSpecimens.some((x) => x.id === props.selectedSpecimenId) ? "grape"
      : props.bundle.spiritSpecimens.some((x) => x.id === props.selectedSpecimenId) ? "spirits"
      : props.bundle.cocktailSpecimens.some((x) => x.id === props.selectedSpecimenId) ? "cocktails"
      : null
    : null;
  const effectiveWing =
    props.activeWing === "atrium" && specimenWing ? specimenWing : props.activeWing;
  const meta = WINE_WING_META[effectiveWing];
  const baijiuSubView: BaijiuSubView =
    (["aromas", "terroir", "monographs", "craft", "vessels"].includes(props.activeSubView ?? "")
      ? props.activeSubView
      : !props.activeSubView && props.selectedSpecimenId && specimenWing === "baijiu"
        ? "monographs"
        : "aromas") as BaijiuSubView;
  const beerSubView: BeerSubView =
    (["styles", "lab", "taplist", "craft"].includes(props.activeSubView ?? "")
      ? props.activeSubView
      : !props.activeSubView && props.selectedSpecimenId && specimenWing === "beer"
        ? "taplist"
        : "styles") as BeerSubView;
  const grapeSubView: GrapeSubView =
    (["varietals", "terroir", "monographs", "sommelier"].includes(props.activeSubView ?? "")
      ? props.activeSubView
      : "varietals") as GrapeSubView;
  const spiritsSubView: SpiritsSubView =
    (["genealogy", "whisky-cask", "monographs", "distill-ritual"].includes(
      props.activeSubView ?? "",
    )
      ? props.activeSubView
      : "genealogy") as SpiritsSubView;

  const selectCurated = (id: string | null) =>
    props.onSelectSpecimen(id, effectiveWing);

  return (
    <div className="wine-hall-shell" data-wine-wing={effectiveWing}>
      <header className="zw-topbar">
        <button className="zw-topbar-brand" onClick={() => props.onNavigateHall("portal")}>
          <span className="zw-seal">{meta.sealChar}</span>
          <span>
            <span className="zw-topbar-kicker">XUNDIAN · SIX WINE WINGS</span>
            <span className="zw-topbar-title">{meta.name}</span>
          </span>
        </button>
        <div className="zw-topbar-actions">
          <button className="zw-pill-btn" onClick={() => props.onNavigateHall("tea")}>茗典·茶馆</button>
          <button className="zw-pill-btn" onClick={() => props.onNavigateHall("coffee")}>咖典·咖啡馆</button>
          <button className="zw-pill-btn" onClick={props.onOpenSearch}>全局检索 <span className="zw-kbd">⌘K</span></button>
          <button className="zw-pill-btn" onClick={props.onOpenPassport}>品饮护照</button>
          {props.onOpenCalibration && <button className="zw-pill-btn" onClick={props.onOpenCalibration}>🖼️ 配图校准</button>}
        </div>
      </header>

      <nav className="wine-wing-ribbon" aria-label="酒之六境">
          {WING_ORDER.map((wing) => {
            const wingMeta = WINE_WING_META[wing];
            const ribbonLabel =
              wing === "grape"
                ? `风土·葡萄酒 (${props.bundle.grapeSpecimens.length})`
                : wing === "spirits"
                  ? `橡木·世界烈酒 (${props.bundle.spiritSpecimens.length})`
                  : WING_RIBBON_LABEL[wing];
            return (
              <button
                key={wing}
                className={effectiveWing === wing ? "on" : ""}
                onClick={() => props.onWingChange(wing, null)}
              >
                <span>{wingMeta.sealChar}</span>
                {ribbonLabel}
              </button>
            );
          })}
      </nav>

      {effectiveWing === "atrium" && (
        <WineAtriumView
          bundle={props.bundle}
          onEnterWing={props.onWingChange}
          onOpenSpecimen={(wing, id) => props.onSelectSpecimen(id, wing)}
        />
      )}
      {effectiveWing === "baijiu" && (
        <BaijiuWingShell
          bundle={props.bundle}
          activeSubView={baijiuSubView}
          selectedAroma={props.selectedAroma}
          selectedZoneId={props.selectedZoneId}
          selectedBaijiuId={specimenWing === "baijiu" ? props.selectedSpecimenId : null}
          selectedVesselId={baijiuSubView === "vessels" ? props.selectedSpecimenId : null}
          onSubViewChange={props.onSubViewChange}
          onSelectAroma={props.onSelectAroma}
          onSelectZone={props.onSelectZone}
          onSelectBaijiu={(id) => props.onSelectSpecimen(id, "baijiu")}
          onBackToAtrium={() => props.onWingChange("atrium", null)}
        />
      )}
      {effectiveWing === "beer" && (
        <BeerWingShell
          bundle={props.bundle}
          activeSubView={beerSubView}
          selectedStyle={props.selectedBeerStyle}
          selectedBeerId={specimenWing === "beer" ? props.selectedSpecimenId : null}
          onSubViewChange={props.onSubViewChange}
          onSelectStyle={props.onSelectBeerStyle}
          onSelectBeer={(id) => props.onSelectSpecimen(id, "beer")}
          onBackToAtrium={() => props.onWingChange("atrium", null)}
        />
      )}
      {effectiveWing === "huangjiu" && <HuangjiuWingView bundle={props.bundle} activeSubView={props.activeSubView} onSubViewChange={props.onSubViewChange} selectedSpecimenId={props.selectedSpecimenId} onSelectSpecimen={selectCurated} onBackToAtrium={() => props.onWingChange("atrium", null)} />}
      {effectiveWing === "grape" && <GrapeWineWingView bundle={props.bundle} activeSubView={grapeSubView} onSubViewChange={props.onSubViewChange} selectedSpecimenId={props.selectedSpecimenId} onSelectSpecimen={selectCurated} onBackToAtrium={() => props.onWingChange("atrium", null)} />}
      {effectiveWing === "spirits" && <WorldSpiritsWingView bundle={props.bundle} activeSubView={spiritsSubView} onSubViewChange={props.onSubViewChange} selectedSpecimenId={props.selectedSpecimenId} onSelectSpecimen={selectCurated} onBackToAtrium={() => props.onWingChange("atrium", null)} />}
      {effectiveWing === "cocktails" && <CocktailWingView bundle={props.bundle} activeSubView={props.activeSubView} onSubViewChange={props.onSubViewChange} selectedSpecimenId={props.selectedSpecimenId} onSelectSpecimen={selectCurated} onBackToAtrium={() => props.onWingChange("atrium", null)} />}
    </div>
  );
}
