import type { WineCompendiumBundle, WineWingId } from "../types";
import { WINE_WING_META } from "../types";

export function WineAtriumView({
  bundle,
  onEnterWing,
  onOpenSpecimen,
}: {
  bundle: WineCompendiumBundle;
  onEnterWing: (wing: WineWingId, subView?: string) => void;
  onOpenSpecimen: (wing: WineWingId, specimenId: string) => void;
}) {
  const cards: Array<{
    wing: Exclude<WineWingId, "atrium">;
    thesis: string;
    count: number;
    picks: { id: string; title: string }[];
    spaces: string[];
  }> = [
    {
      wing: "baijiu",
      thesis: "固态谷物蒸馏 · 羊脂白瓷与朱砂陶坛",
      count: bundle.baijiuMonographs.length,
      picks: bundle.baijiuMonographs.slice(0, 3),
      spaces: ["十二香型", "河谷产区", "名酒本纪", "固态匠艺", "中华酒器"],
    },
    {
      wing: "beer",
      thesis: "麦芽与酒花酿造 · 奶油泡沫与翠绿鲜香",
      count: bundle.beerMonographs.length,
      picks: bundle.beerMonographs.slice(0, 3),
      spaces: ["酵母谱系", "SRM×IBU色苦仪", "精酿酒单", "酿造杯型"],
    },
    {
      wing: "huangjiu",
      thesis: "糯米双边复式发酵 · 冬酿温饮",
      count: bundle.huangjiuSpecimens.length,
      picks: bundle.huangjiuSpecimens.slice(0, 3),
      spaces: ["图志酒单", "冬酿匠艺"],
    },
    {
      wing: "grape",
      thesis: "32 款中外名庄 · 四卷全集",
      count: bundle.grapeSpecimens.length,
      picks: bundle.grapeSpecimens.slice(0, 3),
      spaces: ["品种谱", "风土分级", "名庄本纪", "酿造侍酒"],
    },
    {
      wing: "spirits",
      thesis: "32 款殿堂烈酒 · 四卷全集",
      count: bundle.spiritSpecimens.length,
      picks: bundle.spiritSpecimens.slice(0, 3),
      spaces: ["六大烈酒谱", "威士忌桶陈", "烈酒本纪", "蒸馏与器饮"],
    },
    {
      wing: "cocktails",
      thesis: "液态建筑 · 比例、温度与稀释",
      count: bundle.cocktailSpecimens.length,
      picks: bundle.cocktailSpecimens.slice(0, 3),
      spaces: ["图志酒单", "调酒匠艺"],
    },
  ];

  return (
    <div className="wine-atrium">
      <section className="wine-atrium-hero">
        <span className="wine-eyebrow">一院六境 · 酒之总门厅</span>
        <h1>酒不是一种饮料，而是六套文明的液态方法</h1>
        <p>
          白酒以谷物固态发酵后蒸馏，啤酒让麦芽与酒花共同酿造；黄酒依靠米、曲的双边复式发酵，
          葡萄酒忠实记录果实与风土，威士忌与干邑交给壶式蒸馏和橡木岁月，而鸡尾酒则以比例、
          温度与稀释搭建液态建筑。六境共享“酒”之名，却拥有不可互换的原料、微生物、器皿与审美。
        </p>
        <div className="wine-manifesto-axis" aria-label="六种酒类方法">
          {["谷物固态蒸馏", "麦芽酒花酿造", "米曲双边发酵", "葡萄风土酿造", "壶馏橡木桶陈", "液态比例建筑"].map(
            (label, i) => <span key={label}><b>{String(i + 1).padStart(2, "0")}</b>{label}</span>,
          )}
        </div>
      </section>

      <section className="wine-pavilion-grid" aria-label="酒之六境">
        {cards.map((card, index) => {
          const meta = WINE_WING_META[card.wing];
          return (
            <article
              key={card.wing}
              className={`wine-pavilion-card wine-pavilion-${card.wing}${index < 2 ? " flagship" : ""}`}
              style={{ "--wing-accent": meta.accentHex, "--wing-bg": meta.bgHex } as React.CSSProperties}
            >
              <button className="wine-pavilion-main" onClick={() => onEnterWing(card.wing)}>
                <span className="wine-pavilion-seal">{meta.sealChar}</span>
                <span className="wine-eyebrow">{meta.aestheticLabel}</span>
                <h2>{meta.name}</h2>
                <p>{card.thesis}</p>
                <strong>{card.count} 篇馆藏档案 →</strong>
              </button>
              <div className="wine-space-pills">
                {card.spaces.map((space, subIndex) => (
                  <button
                    key={space}
                    onClick={() => {
                      const subViews: Record<Exclude<WineWingId, "atrium">, string[]> = {
                        baijiu: ["aromas", "terroir", "monographs", "craft", "vessels"],
                        beer: ["styles", "lab", "taplist", "craft"],
                        huangjiu: ["catalog", "craft"],
                        grape: ["varietals", "terroir", "monographs", "sommelier"],
                        spirits: ["genealogy", "whisky-cask", "monographs", "distill-ritual"],
                        cocktails: ["catalog", "craft"],
                      };
                      onEnterWing(card.wing, subViews[card.wing][subIndex]);
                    }}
                  >
                    {space}
                  </button>
                ))}
              </div>
              <div className="wine-pavilion-picks">
                {card.picks.map((pick) => (
                  <button key={pick.id} onClick={() => onOpenSpecimen(card.wing, pick.id)}>{pick.title}</button>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
