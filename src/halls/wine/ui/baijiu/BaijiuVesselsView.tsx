import { useEffect, useState } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { assetUrl } from "../../../../lib/assetUrl";
import type { BaijiuVesselItem, WineCompendiumBundle } from "../../types";

type VesselFilter = BaijiuVesselItem["functionCategory"] | "all";
const FILTERS: Array<[VesselFilter, string]> = [["all", "全器类"], ["ancient-ritual", "古礼祭祀"], ["warming-pouring", "温酒斟注"], ["cellar-storage", "窖藏陈化"], ["modern-tasting", "现代品鉴"]];
const CUISINES = ["川菜", "鲁菜", "粤菜", "苏菜", "浙菜", "闽菜", "湘菜", "徽菜"];

export function BaijiuVesselsView({
  bundle,
  selectedVesselId,
}: {
  bundle: WineCompendiumBundle;
  selectedVesselId?: string | null;
}) {
  const [filter, setFilter] = useState<VesselFilter>("all");
  const [activeAroma, setActiveAroma] = useState(bundle.baijiuAromas[0]?.id);
  const vessels = bundle.baijiuVessels.filter((v) => filter === "all" || v.functionCategory === filter);
  const aroma = bundle.baijiuAromas.find((a) => a.id === activeAroma);
  useEffect(() => {
    if (!selectedVesselId) return;
    setFilter("all");
    requestAnimationFrame(() => document.getElementById(`baijiu-${selectedVesselId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, [selectedVesselId]);
  return (
    <div className="baijiu-view">
      <header className="baijiu-volume-heading"><span>卷五</span><div><h2>三千年中华酒器与宴席配伍</h2><p>器以载礼，也以材质、口沿与容量塑造温度、聚香和入口速度。</p></div></header>
      <div className="baijiu-vessel-filters">{FILTERS.map(([id, label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}</div>
      <section className="baijiu-cabinet">
        {vessels.map((vessel) => <article id={`baijiu-${vessel.id}`} key={vessel.id} className={selectedVesselId === vessel.id ? "active" : undefined}>
          <div className="baijiu-cabinet-image"><EditorialDrinkPhoto src={assetUrl(vessel.photoUrl ?? "")} alt={vessel.name} aspectRatio="4/3" accentHex="#B5852A" badge={vessel.material} fallbackKind="porcelain-cup" /></div>
          <span>{vessel.era} · {vessel.material}</span><h3>{vessel.name}</h3><small>{vessel.capacityLabel}</small><p>{vessel.description}</p><details><summary>器物解剖</summary><p>{vessel.physicalAndSensoryNote}</p><p>{vessel.craftHighlight}</p></details>
        </article>)}
      </section>
      <section className="baijiu-pairing-matrix">
        <header><div><span className="baijiu-kicker">十二香型 × 八大菜系</span><h2>中华宴席硬菜黄金配伍表</h2></div><p>点击香型，查看酸、脂、辣与酒体之间的平衡建议。</p></header>
        <div className="pairing-aromas">{bundle.baijiuAromas.map((a) => <button key={a.id} className={a.id === activeAroma ? "active" : ""} onClick={() => setActiveAroma(a.id)}>{a.name}</button>)}</div>
        <div className="pairing-table"><div className="pairing-intro"><h3>{aroma?.name}</h3><p>{aroma?.sensorySignature}</p><strong>首选：{aroma?.pairingCuisines.join(" · ")}</strong></div>{CUISINES.map((cuisine, i) => { const match = aroma?.pairingCuisines.some((p) => p.includes(cuisine.replace("菜", ""))) ?? false; return <div key={cuisine} className={match ? "best" : i % 3 === 0 ? "good" : ""}><b>{cuisine}</b><span>{match ? "黄金配伍" : i % 3 === 0 ? "适宜" : "谨慎搭配"}</span><i>{match ? "●●●" : i % 3 === 0 ? "●●○" : "●○○"}</i></div>; })}</div>
      </section>
    </div>
  );
}
