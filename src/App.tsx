import { useCallback, useEffect, useState } from "react";
import type { CoffeeSubView, DrinkRouteTarget, HallId, WineWingId } from "./core/types";
import { GlobalSearchModal } from "./core/GlobalSearchModal";
import { DrinkPassportModal } from "./core/DrinkPassportModal";
import { PhotoCalibrationModal } from "./core/PhotoCalibrationModal";
import { DrinkGrandPortal } from "./portal/DrinkGrandPortal";
import { teaCompendium } from "./halls/tea/content";
import { TeaHallShell } from "./halls/tea/ui/TeaHallShell";
import type { TeaCategoryId, TeaSubView } from "./halls/tea/types";
import { wineCompendium } from "./halls/wine/content/index";
import type { BaijiuAromaId, BeerStyleCategoryId } from "./halls/wine/types";
import { WineHallShell } from "./halls/wine/ui/WineHallShell";
import { coffeeCompendium } from "./halls/coffee/content/index";
import { CoffeeHallShell } from "./halls/coffee/ui/CoffeeHallShell";

const VALID_HALLS = new Set<string>(["portal", "tea", "wine", "coffee"]);
const VALID_TEA_SUBS = new Set<string>([
  "spectrum",
  "terroir",
  "monographs",
  "teaware",
  "chronicles",
]);
const VALID_TEA_CATS = new Set<string>([
  "all",
  "green",
  "white",
  "yellow",
  "oolong",
  "black",
  "dark",
  "scented",
]);
const VALID_WINE_WINGS = new Set<string>([
  "atrium",
  "baijiu",
  "beer",
  "huangjiu",
  "grape",
  "spirits",
  "cocktails",
]);
const VALID_BAIJIU_AROMAS = new Set<string>([
  "all",
  "jiangxiang",
  "nongxiang",
  "qingxiang",
  "mixiang",
  "fengxiang",
  "jianxiang",
  "dongxiang",
  "zhimaxiang",
  "texiang",
  "fuyuxiang",
  "laobaigan",
  "chiweixiang",
]);
const VALID_BEER_STYLES = new Set<string>([
  "all",
  "crisp-lager",
  "wheat-wit",
  "hoppy-ipa",
  "belgian-abbey",
  "malty-bock-amber",
  "dark-stout-porter",
  "wild-sour-fruit",
  "chinese-terroir-craft",
]);
const VALID_COFFEE_SUBS = new Set<string>([
  "botany",
  "terroir",
  "monographs",
  "brewing",
  "equipment",
  "ecology",
]);

interface RouteState {
  hall: HallId;
  sub: TeaSubView;
  cat: TeaCategoryId | "all";
  mtn: string | null;
  tea: string | null;
  ware: string | null;
  wing: WineWingId;
  wsub: string | null;
  aroma: BaijiuAromaId | "all";
  bstyle: BeerStyleCategoryId | "all";
  zone: string | null;
  specimen: string | null;
  csub: CoffeeSubView;
  origin: string | null;
  drink: string | null;
  gear: string | null;
}

function parseHashToRouteState(hashStr: string): RouteState {
  const raw = hashStr.replace(/^#/, "");
  const params = new URLSearchParams(raw);

  const hallParam = params.get("hall");
  const subParam = params.get("sub");
  const catParam = params.get("cat");
  const mtnParam = params.get("mtn");
  const teaParam = params.get("tea");
  const wareParam = params.get("ware");
  const wingParam = params.get("wing");
  const wsubParam = params.get("wsub");
  const aromaParam = params.get("aroma");
  const bstyleParam = params.get("bstyle");
  const zoneParam = params.get("zone");
  const specimenParam = params.get("specimen");
  const csubParam = params.get("csub");
  const originParam = params.get("origin");
  const drinkParam = params.get("drink");
  const gearParam = params.get("gear");

  let hall: HallId = "portal";
  if (hallParam && VALID_HALLS.has(hallParam)) {
    hall = hallParam as HallId;
  } else if (subParam || catParam || mtnParam || teaParam || wareParam) {
    hall = "tea";
  }

  let sub: TeaSubView = "spectrum";
  if (subParam && VALID_TEA_SUBS.has(subParam)) {
    sub = subParam as TeaSubView;
  } else if (teaParam) {
    sub = "monographs";
  } else if (mtnParam) {
    sub = "terroir";
  } else if (wareParam) {
    sub = "teaware";
  }

  const cat: TeaCategoryId | "all" =
    catParam && VALID_TEA_CATS.has(catParam) ? (catParam as TeaCategoryId | "all") : "all";
  const wing: WineWingId =
    wingParam && VALID_WINE_WINGS.has(wingParam) ? (wingParam as WineWingId) : "atrium";
  const aroma: BaijiuAromaId | "all" =
    aromaParam && VALID_BAIJIU_AROMAS.has(aromaParam)
      ? (aromaParam as BaijiuAromaId | "all")
      : "all";
  const bstyle: BeerStyleCategoryId | "all" =
    bstyleParam && VALID_BEER_STYLES.has(bstyleParam)
      ? (bstyleParam as BeerStyleCategoryId | "all")
      : "all";
  let csub: CoffeeSubView =
    csubParam && VALID_COFFEE_SUBS.has(csubParam)
      ? (csubParam as CoffeeSubView)
      : "botany";
  if (!csubParam) {
    if (gearParam) csub = "equipment";
    else if (drinkParam) csub = "brewing";
    else if (specimenParam) csub = "monographs";
    else if (originParam) csub = "terroir";
  }

  return {
    hall,
    sub,
    cat,
    mtn: mtnParam || null,
    tea: teaParam || null,
    ware: wareParam || null,
    wing,
    wsub: wsubParam || null,
    aroma,
    bstyle,
    zone: zoneParam || null,
    specimen: specimenParam || null,
    csub,
    origin: originParam || null,
    drink: drinkParam || null,
    gear: gearParam || null,
  };
}

export function App() {
  const [route, setRoute] = useState<RouteState>(() =>
    typeof window !== "undefined"
      ? parseHashToRouteState(window.location.hash)
      : {
          hall: "portal",
          sub: "spectrum",
          cat: "all",
          mtn: null,
          tea: null,
          ware: null,
          wing: "atrium",
          wsub: null,
          aroma: "all",
          bstyle: "all",
          zone: null,
          specimen: null,
          csub: "botany",
          origin: null,
          drink: null,
          gear: null,
        },
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [passportOpen, setPassportOpen] = useState(false);
  const [calibrationOpen, setCalibrationOpen] = useState(false);

  // Listen to browser back/forward hash changes
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashToRouteState(window.location.hash));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Sync [data-hall] onto root <html> and serialize state back into URL hash
  useEffect(() => {
    document.documentElement.dataset.hall = route.hall;
    document.documentElement.dataset.wineWing = route.hall === "wine" ? route.wing : "";

    const params = new URLSearchParams();
    params.set("hall", route.hall);

    if (route.hall === "tea") {
      params.set("sub", route.sub);
      if (route.cat && route.cat !== "all") {
        params.set("cat", route.cat);
      }
      if (route.mtn) {
        params.set("mtn", route.mtn);
      }
      if (route.tea) {
        params.set("tea", route.tea);
      }
      if (route.ware) {
        params.set("ware", route.ware);
      }
    } else if (route.hall === "wine") {
      params.set("wing", route.wing);
      if (route.wsub) params.set("wsub", route.wsub);
      if (route.aroma !== "all") params.set("aroma", route.aroma);
      if (route.bstyle !== "all") params.set("bstyle", route.bstyle);
      if (route.zone) params.set("zone", route.zone);
      if (route.specimen) params.set("specimen", route.specimen);
    } else if (route.hall === "coffee") {
      params.set("csub", route.csub);
      if (route.origin) params.set("origin", route.origin);
      if (route.specimen) params.set("specimen", route.specimen);
      if (route.drink) params.set("drink", route.drink);
      if (route.gear) params.set("gear", route.gear);
    }

    const nextHash = `#${params.toString()}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [route]);

  // Global Cmd+K / Ctrl+K shortcut for cross-hall search palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setCalibrationOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavigate = useCallback((target: DrinkRouteTarget) => {
    setRoute((prev) => {
      const nextHall = target.hall;
      const nextWing = nextHall === "wine" ? target.wing ?? prev.wing : prev.wing;
      let nextSub: TeaSubView = target.sub ?? prev.sub;
      if (nextHall === "tea" && !target.sub) {
        if (target.tea) nextSub = "monographs";
        else if (target.mtn) nextSub = "terroir";
        else if (target.ware) nextSub = "teaware";
        else nextSub = "spectrum";
      }

      const nextCat: TeaCategoryId | "all" =
        target.cat && VALID_TEA_CATS.has(target.cat)
          ? (target.cat as TeaCategoryId | "all")
          : nextHall === "tea" && !target.sub && !target.tea
            ? "all"
            : prev.cat;
      let nextCoffeeSub = target.csub ?? prev.csub;
      if (nextHall === "coffee" && !target.csub) {
        if (target.gear) nextCoffeeSub = "equipment";
        else if (target.drink) nextCoffeeSub = "brewing";
        else if (target.specimen) nextCoffeeSub = "monographs";
        else if (target.origin) nextCoffeeSub = "terroir";
      }

      return {
        hall: nextHall,
        sub: nextSub,
        cat: nextCat,
        mtn: target.mtn ?? null,
        tea: target.tea ?? null,
        ware: target.ware ?? null,
        wing: nextWing,
        wsub:
          nextHall === "wine"
            ? target.wsub ??
              (target.specimen
                ? nextWing === "baijiu"
                  ? "monographs"
                  : nextWing === "beer"
                    ? "taplist"
                    : null
                : null)
            : prev.wsub,
        aroma:
          nextHall === "wine" && target.aroma && VALID_BAIJIU_AROMAS.has(target.aroma)
            ? (target.aroma as BaijiuAromaId | "all")
            : nextHall === "wine"
              ? prev.aroma
              : prev.aroma,
        bstyle:
          nextHall === "wine" && target.bstyle && VALID_BEER_STYLES.has(target.bstyle)
            ? (target.bstyle as BeerStyleCategoryId | "all")
            : prev.bstyle,
        zone: nextHall === "wine" ? target.zone ?? null : prev.zone,
        specimen: target.specimen ?? null,
        csub: nextCoffeeSub,
        origin: nextHall === "coffee" ? target.origin ?? null : prev.origin,
        drink: nextHall === "coffee" ? target.drink ?? null : prev.drink,
        gear: nextHall === "coffee" ? target.gear ?? null : prev.gear,
      };
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNavigateHall = useCallback((hall: HallId) => {
    setRoute((prev) => ({
      ...prev,
      hall,
      specimen: hall === "wine" || hall === "coffee" ? prev.specimen : null,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className="zw-app"
      data-hall={route.hall}
      data-sub={route.hall === "tea" ? route.sub : undefined}
      data-wine-wing={route.hall === "wine" ? route.wing : undefined}
      data-testid="app"
    >
      {route.hall === "portal" && (
        <DrinkGrandPortal
          teaBundle={teaCompendium}
          wineBundle={wineCompendium}
          coffeeBundle={coffeeCompendium}
          onEnterHall={(hall) => handleNavigateHall(hall)}
          onNavigate={handleNavigate}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenPassport={() => setPassportOpen(true)}
          onOpenCalibration={() => setCalibrationOpen(true)}
        />
      )}

      {route.hall === "tea" && (
        <TeaHallShell
          bundle={teaCompendium}
          activeSubView={route.sub}
          selectedCategory={route.cat}
          selectedMountainId={route.mtn}
          selectedTeaId={route.tea}
          selectedWareId={route.ware}
          onSubViewChange={(sub) =>
            setRoute((prev) => ({ ...prev, sub }))
          }
          onSelectCategory={(cat) =>
            setRoute((prev) => ({ ...prev, cat }))
          }
          onSelectMountain={(mtn) =>
            setRoute((prev) => ({ ...prev, mtn }))
          }
          onSelectTea={(tea) =>
            setRoute((prev) => ({
              ...prev,
              tea,
              sub: tea ? "monographs" : prev.sub,
            }))
          }
          onSelectWare={(ware) =>
            setRoute((prev) => ({ ...prev, ware }))
          }
          onNavigateHall={handleNavigateHall}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenPassport={() => setPassportOpen(true)}
          onOpenCalibration={() => setCalibrationOpen(true)}
        />
      )}

      {route.hall === "wine" && (
        <WineHallShell
          bundle={wineCompendium}
          activeWing={route.wing}
          activeSubView={route.wsub}
          selectedAroma={route.aroma}
          selectedBeerStyle={route.bstyle}
          selectedZoneId={route.zone}
          selectedSpecimenId={route.specimen}
          onWingChange={(wing, wsub = null) =>
            setRoute((prev) => ({ ...prev, wing, wsub, specimen: null }))
          }
          onSubViewChange={(wsub) => {
            const leavesSpecimenView = Boolean(
              wsub && ["aromas", "terroir", "craft", "vessels", "styles", "lab"].includes(wsub),
            );
            setRoute((prev) => ({
              ...prev,
              wsub,
              specimen: leavesSpecimenView ? null : prev.specimen,
            }));
            if (leavesSpecimenView) window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onSelectAroma={(aroma) => setRoute((prev) => ({ ...prev, aroma }))}
          onSelectBeerStyle={(bstyle) => setRoute((prev) => ({ ...prev, bstyle }))}
          onSelectZone={(zone) => setRoute((prev) => ({ ...prev, zone }))}
          onSelectSpecimen={(specimen, wing) =>
            setRoute((prev) => {
              const targetWing = wing ?? prev.wing;
              return {
                ...prev,
                specimen,
                wing: targetWing,
                wsub:
                  specimen && targetWing === "baijiu"
                    ? "monographs"
                    : specimen && targetWing === "beer"
                      ? "taplist"
                      : prev.wsub,
              };
            })
          }
          onNavigateHall={handleNavigateHall}
          onNavigate={handleNavigate}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenPassport={() => setPassportOpen(true)}
          onOpenCalibration={() => setCalibrationOpen(true)}
        />
      )}

      {route.hall === "coffee" && (
        <CoffeeHallShell
          bundle={coffeeCompendium}
          activeSubView={route.csub}
          selectedOriginId={route.origin}
          selectedBeanId={route.specimen}
          selectedDrinkId={route.drink}
          selectedGearId={route.gear}
          onSubViewChange={(csub) =>
            setRoute((prev) => ({
              ...prev,
              csub,
              specimen: null,
              drink: null,
              gear: null,
            }))
          }
          onSelectOrigin={(origin) =>
            setRoute((prev) => ({ ...prev, origin, csub: origin ? "terroir" : prev.csub }))
          }
          onSelectBean={(specimen) =>
            setRoute((prev) => ({ ...prev, specimen, csub: specimen ? "monographs" : prev.csub }))
          }
          onSelectDrink={(drink) =>
            setRoute((prev) => ({ ...prev, drink, csub: drink ? "brewing" : prev.csub }))
          }
          onSelectGear={(gear) =>
            setRoute((prev) => ({ ...prev, gear, csub: gear ? "equipment" : prev.csub }))
          }
          onNavigateHall={handleNavigateHall}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenPassport={() => setPassportOpen(true)}
          onOpenCalibration={() => setCalibrationOpen(true)}
        />
      )}

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
        teaBundle={teaCompendium}
        wineBundle={wineCompendium}
        coffeeBundle={coffeeCompendium}
      />

      <DrinkPassportModal
        open={passportOpen}
        onClose={() => setPassportOpen(false)}
        teaBundle={teaCompendium}
        wineBundle={wineCompendium}
        coffeeBundle={coffeeCompendium}
        onNavigate={handleNavigate}
      />

      <PhotoCalibrationModal
        open={calibrationOpen}
        onClose={() => setCalibrationOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
