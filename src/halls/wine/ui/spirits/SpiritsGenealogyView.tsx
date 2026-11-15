import { useMemo, useState } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { WorldTerroirBeltMap, type WorldTerroirMarker } from "../../../../core/map/WorldTerroirBeltMap";
import { assetUrl } from "../../../../lib/assetUrl";
import type { SpiritFamilyMeta, WorldSpiritCategory, WorldSpiritSpecimen } from "../../types";

interface Props {
  families: SpiritFamilyMeta[];
  specimens: WorldSpiritSpecimen[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SpiritsGenealogyView({ families, specimens, selectedId, onSelect }: Props) {
  const [familyId, setFamilyId] = useState<WorldSpiritCategory>(families[0]?.id ?? "single-malt-whisky");
  const family = families.find((item) => item.id === familyId) ?? families[0];
  const bottles = specimens.filter((item) => item.category === familyId);
  const markers = useMemo<WorldTerroirMarker[]>(() => specimens.filter((item) => item.coord).map((item) => ({
    id:item.id,label:item.title.split(" ")[0],subLabel:item.originRegion,coord:item.coord!,colorHex:item.liquorColorHex,
  })), [specimens]);
  if (!family) return null;
  return <section className="spirit-volume">
    <header><span className="spirit-kicker">VOLUME I · DISTILLED GENEALOGY</span><h2>卷一 · 六大烈酒总谱</h2><p>沿糖源植物、发酵酒醪、蒸馏器与陈年法规四个节点，追踪每一家族如何从农作物走向杯中。</p></header>
    <div className="family-tree">
      <nav className="family-rail">{families.map((item) => <button key={item.id} className={item.id === family.id ? "on" : ""} onClick={() => setFamilyId(item.id)}><small>{item.englishName}</small><strong>{item.name}</strong></button>)}</nav>
      <div>
        <div className="process-tree">
          <article><small>01 · BOTANICAL / GRAIN</small><h3>糖源植物</h3><p>{family.rawSugarSource}</p></article>
          <article><small>02 · FERMENTATION</small><h3>发酵酒醪</h3><p>{family.fermentationWash}</p></article>
          <article><small>03 · STILL</small><h3>壶式 / 柱式</h3><p>{family.stillArchitecture}</p></article>
          <article><small>04 · MATURATION</small><h3>陈年法规</h3><p>{family.agingLaw}</p></article>
        </div>
        <p>{family.summary}</p><div className="spirit-pills">{family.subStyles.map((style) => <button key={style}>{style}</button>)}<button>{family.abvTypical}</button></div>
        <div className="bottle-grid">{bottles.map((item) => <button key={item.id} className={selectedId === item.id ? "on" : ""} onClick={() => onSelect(item.id)}><EditorialDrinkPhoto src={assetUrl(item.photoUrl ?? "")} alt={item.title} aspectRatio="3/4" fit="contain" warmFilter fallbackKind="bottle" /><strong>{item.title}</strong><span>{item.originRegion}</span></button>)}</div>
      </div>
    </div>
    <WorldTerroirBeltMap markers={markers} selectedMarkerId={selectedId} onSelectMarker={onSelect} title="32 款世界烈酒原产坐标" subtitle="从艾雷岛泥煤海岸到宜兰亚热带酒窖、哈利斯科红土与马提尼克甘蔗田。" accentHex="#D4943A" />
  </section>;
}
