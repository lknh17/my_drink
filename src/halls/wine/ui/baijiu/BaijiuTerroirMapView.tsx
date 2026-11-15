import { useMemo, useState } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { ChinaProvinceMap } from "../../../../core/map/ChinaProvinceMap";
import { TerroirMapStage } from "../../../../core/map/TerroirMapStage";
import { useDrinkFootprints } from "../../../../core/drinkFootprints";
import type { ProvinceId } from "../../../../core/types";
import { assetUrl } from "../../../../lib/assetUrl";
import type { WineCompendiumBundle } from "../../types";

type MapMode = "belts" | "aromas" | "footprints";

export function BaijiuTerroirMapView({
  bundle,
  selectedZoneId,
  onSelectZone,
  onSelectBaijiu,
}: {
  bundle: WineCompendiumBundle;
  selectedZoneId: string | null;
  onSelectZone: (id: string | null) => void;
  onSelectBaijiu: (id: string) => void;
}) {
  const [mode, setMode] = useState<MapMode>("belts");
  const [selectedProvince, setSelectedProvince] = useState<ProvinceId | "all">("all");
  const footprints = useDrinkFootprints();
  const selected = bundle.baijiuZones.find((zone) => zone.id === selectedZoneId) ?? null;
  const summaryZone = selected ?? bundle.baijiuZones[0];
  const activeBelt = bundle.baijiuBelts.find((belt) => belt.id === summaryZone?.belt);
  const aromaColors = new Map(bundle.baijiuAromas.map((a) => [a.id, a.colorHex]));
  const beltColors = new Map(bundle.baijiuBelts.map((b) => [b.id, b.colorHex]));

  const provinceColors = useMemo(() => {
    const colors: Partial<Record<ProvinceId, string>> = {};
    for (const zone of bundle.baijiuZones) {
      if (mode === "footprints") colors[zone.province] = footprints.visitedProvinces.has(zone.province) ? "#A62121" : "#E9E1D4";
      else if (mode === "aromas") colors[zone.province] = aromaColors.get(zone.dominantAromas[0]) ?? "#B5852A";
      else colors[zone.province] = beltColors.get(zone.belt) ?? "#B5852A";
    }
    return colors;
  }, [bundle, mode, footprints.visitedProvinces]);

  const markers = bundle.baijiuZones.map((zone) => ({
    id: zone.id, label: zone.name, subLabel: zone.riverOrSpring, coord: zone.coord,
    province: zone.province, colorHex: beltColors.get(zone.belt), badge: zone.dominantAromas.join(" · "),
  }));

  return (
    <div className="baijiu-view">
      <header className="baijiu-volume-heading"><span>卷二</span><div><h2>六大黄金名酒河谷带</h2><p>从 34 省宏观着色进入 14 座核心微域，读取河流、地质与窖池菌群。</p></div></header>
      <div className="baijiu-map-modes">
        {([["belts", "六大名酒河谷带"], ["aromas", "各省代表香型"], ["footprints", "饮酒足迹点亮"]] as const).map(([id, label]) => <button key={id} className={mode === id ? "active" : ""} onClick={() => setMode(id)}>{label}</button>)}
      </div>
      <section className="baijiu-map-master">
        <div>
          <ChinaProvinceMap
            className="baijiu-china-map"
            height={520}
            title="中国白酒风土总图"
            subtitle="点击省域或产区圆点进入微生态沙盘"
            provinceColors={provinceColors}
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
            markers={markers}
            selectedMarkerId={selectedZoneId}
            onSelectMarker={onSelectZone}
            legendItems={mode === "belts" ? bundle.baijiuBelts.map((belt) => ({ id: belt.id, label: belt.name, colorHex: belt.colorHex })) : []}
          />
        </div>
        {summaryZone && <aside className="baijiu-map-summary">
          <span className="baijiu-kicker">{activeBelt?.kicker}</span>
          <h3>{activeBelt?.name}</h3><p>{activeBelt?.summary}</p>
          <EditorialDrinkPhoto src={assetUrl(summaryZone.photoUrl ?? "")} alt={summaryZone.name} aspectRatio="4/3" accentHex={activeBelt?.colorHex} badge={summaryZone.provinceLabel} caption={summaryZone.riverOrSpring} fallbackKind="craft-workshop" />
          <h4>{summaryZone.name}</h4><p>{summaryZone.terroirNote}</p>
        </aside>}
      </section>
      <section className="baijiu-zone-ledger">
        <div className="baijiu-zone-list">
          {bundle.baijiuZones.map((zone, i) => <button key={zone.id} className={zone.id === selectedZoneId ? "active" : ""} onClick={() => onSelectZone(zone.id)}><b>{String(i + 1).padStart(2, "0")}</b><span>{zone.name}<small>{zone.provinceLabel} · {zone.riverOrSpring}</small></span></button>)}
        </div>
        <div className="baijiu-micro-map">
          <TerroirMapStage
            height={560}
            title="河谷微生态沙盘"
            subtitle={selected?.name ?? "选择一座核心产区"}
            markers={bundle.baijiuZones.map((zone) => ({ id: zone.id, title: zone.name, subtitle: zone.riverOrSpring, coord: zone.coord, defaultZoom: zone.defaultZoom, colorHex: beltColors.get(zone.belt) }))}
            selectedMarkerId={selectedZoneId}
            onSelectMarker={onSelectZone}
            center={selected?.coord ?? [106.2, 29.1]}
            zoom={selected?.defaultZoom ?? 5}
            defaultBasemap="topo"
            provinceBoundary={selected?.province ?? null}
            renderOverlayCard={() => selected && <article className="baijiu-zone-card"><span>{selected.provinceLabel}</span><h3>{selected.name}</h3><p><b>地质菌群</b>{selected.geologyAndMicrobes}</p><p><b>气候</b>{selected.climateFeature}</p><p>{selected.terroirNote}</p><div>{selected.representativeBaijiuIds.map((id) => { const item = bundle.baijiuMonographs.find((m) => m.id === id); return item ? <button key={id} onClick={() => onSelectBaijiu(id)}>{item.title}</button> : null; })}</div></article>}
          />
        </div>
      </section>
    </div>
  );
}
