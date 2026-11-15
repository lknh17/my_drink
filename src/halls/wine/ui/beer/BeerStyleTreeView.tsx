import { useState } from "react";
import { EditorialDrinkPhoto } from "../../../../core/EditorialDrinkPhoto";
import { assetUrl } from "../../../../lib/assetUrl";
import type { BeerFermentationFamily, BeerStyleCategoryId, WineCompendiumBundle } from "../../types";

interface Props {
  bundle: WineCompendiumBundle;
  selectedStyle: BeerStyleCategoryId | "all";
  onSelectStyle: (style: BeerStyleCategoryId | "all") => void;
  onSelectBeer: (id: string) => void;
}

const FAMILIES: Array<{ id: BeerFermentationFamily; title: string; latin: string; temp: string; note: string }> = [
  { id: "ale", title: "艾尔·上层温暖果香发酵", latin: "Saccharomyces cerevisiae", temp: "16–24℃", note: "温暖发酵更容易长出香蕉、梨、柑橘与香料气息，常见于小麦、IPA、世涛和修道院啤酒。" },
  { id: "lager", title: "拉格·下层低温清爽慢酵", latin: "Saccharomyces pastorianus", temp: "7–13℃", note: "低温慢慢发酵并冷藏熟成，果香更克制，麦香更干净，收口尤其清爽。" },
  { id: "wild-sour", title: "野生菌与乳酸酸啤", latin: "Brettanomyces · Lactobacillus", temp: "自然季候", note: "野生酵母与乳酸菌接力，带来柑橘酸、酸奶、干草与木桶般复杂气息。" },
];
const FAMILY_LABELS: Record<BeerFermentationFamily, string> = Object.fromEntries(FAMILIES.map((x) => [x.id, x.title])) as Record<BeerFermentationFamily, string>;
const bitterness = (range: string) => Number(range.match(/\d+/)?.[0] ?? 0) <= 18 ? "柔和少苦，初饮友好" : Number(range.match(/\d+/)?.[0] ?? 0) <= 35 ? "微苦回甘，餐桌百搭" : "酒花苦感鲜明，爽脆提神";
const strength = (range: string) => Number(range.match(/\d+(?:\.\d+)?/)?.[0] ?? 0) >= 8 ? "高酒精·慢慢小口喝" : Number(range.match(/\d+(?:\.\d+)?/)?.[0] ?? 0) >= 5.5 ? "中等饱满" : "轻盈畅饮";

export function BeerStyleTreeView({ bundle, selectedStyle, onSelectStyle, onSelectBeer }: Props) {
  const [family, setFamily] = useState<BeerFermentationFamily | "all">("all");
  const styles = bundle.beerStyles.filter((item) => family === "all" || item.family === family);
  return (
    <section className="beer-space beer-style-tree">
      <header className="beer-section-head">
        <span>YEAST DYNASTIES · BJCP EVOLUTION</span>
        <h2>谱系卷 · 三分天下</h2>
        <p>温度决定酵母代谢的语法，菌种决定一杯啤酒如何讲述果香、麦芽与酸度。</p>
      </header>
      <div className="beer-family-comparator">
        {FAMILIES.map((item) => (
          <button key={item.id} className={family === item.id ? "on" : ""} onClick={() => setFamily(family === item.id ? "all" : item.id)}>
            <small>{item.latin}</small><strong>{item.title}</strong><b>{item.temp}</b><span>{item.note}</span>
          </button>
        ))}
      </div>
      <div className="beer-style-grid">
        {styles.map((style) => (
          <article key={style.id} className={selectedStyle === style.id ? "beer-style-card on" : "beer-style-card"} style={{ "--style-color": style.colorHex } as React.CSSProperties}>
            <button className="beer-style-card__main" onClick={() => onSelectStyle(selectedStyle === style.id ? "all" : style.id)}>
              <span className="beer-style-card__family">{FAMILY_LABELS[style.family]}</span>
              <h3>{style.name}</h3><em>{style.englishName}</em>
              <p>{style.sensorySummary}</p>
              <dl>
                <div><dt>YEAST / TEMP</dt><dd>{style.yeastAndTemp}</dd></div>
                <div><dt>酒精强度</dt><dd>{strength(style.typicalAbvRange)} · {style.typicalAbvRange}</dd></div>
                <div><dt>入口苦感</dt><dd>{bitterness(style.typicalIbuRange)} · {style.typicalIbuRange}</dd></div>
                <div><dt>酒液颜色</dt><dd><i className="style-srm-dot" style={{ background: style.colorHex }} />{style.typicalSrmRange}</dd></div>
              </dl>
            </button>
            <div className="beer-representatives">
              {style.representativeBeerIds.map((id) => {
                const beer = bundle.beerMonographs.find((item) => item.id === id);
                return beer ? <button className="beer-rep-card" key={id} onClick={() => onSelectBeer(id)}><EditorialDrinkPhoto src={assetUrl(beer.photoUrl ?? "")} alt={beer.title} aspectRatio="4/3" fallbackKind="beer-glass" /><span>{beer.tapNumber}<b>{beer.title}</b></span></button> : null;
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
