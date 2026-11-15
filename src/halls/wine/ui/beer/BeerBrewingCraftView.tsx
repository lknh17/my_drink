import { useState } from "react";
import { CraftStepDeck, type CraftStepItem } from "../../../../core/CraftStepDeck";
import { assetUrl } from "../../../../lib/assetUrl";
import type { BeerGlassId, WineCompendiumBundle } from "../../types";
import { BeerGlassIllustration } from "./BeerGlassIllustration";

interface Props { bundle: WineCompendiumBundle }

const STEPS: CraftStepItem[] = [
  { stepNo: 1, id: "malt", title: "制麦焙烤色度演变", subtitle: "从稻草金到帝国黑", plainAction: "让大麦发芽唤醒酶，再用不同火力焙干或烘烤。", scienceNote: "萌发制造淀粉酶；升温触发美拉德反应与焦糖化，颜色逐级加深。", flavorImpact: "浅焙像饼干蜂蜜，深焙走向咖啡、可可与焦香。", keyMetrics: ["萌发 3–5 天", "焙燥 45–85℃", "特种麦芽最高 220℃"], diagramKind: "beer-hot-cold-brewing", photoUrl: assetUrl("/photos/craft-beer-step1.jpg") },
  { stepNo: 2, id: "mash", title: "糖化酶解麦汁过滤", subtitle: "把淀粉剪成可发酵糖", plainAction: "把粉碎麦芽与热水混合，分段保温后过滤出清亮麦汁。", scienceNote: "α/β 淀粉酶像剪刀，把长链淀粉切成麦芽糖与糊精。", flavorImpact: "低温糖化更干爽，高温糖化留下更多饱满甜润酒体。", keyMetrics: ["62–72℃", "pH 5.2–5.6", "约 60–90 分钟"], diagramKind: "beer-hot-cold-brewing", photoUrl: assetUrl("/photos/craft-beer-step2.jpg") },
  { stepNo: 3, id: "boil", title: "铜釜煮沸热端异构化苦花", subtitle: "热端制造稳定苦味", plainAction: "麦汁滚沸时分批投入苦花、风味花和香气花。", scienceNote: "酒花 α-酸受热异构化变得可溶，同时蛋白凝固、杂菌被杀灭。", flavorImpact: "投得早偏苦，投得晚保留柑橘、草本与松针香。", keyMetrics: ["100℃", "60–90 分钟", "苦花早投"], diagramKind: "beer-hot-cold-brewing", photoUrl: assetUrl("/photos/craft-beer-step3.jpg") },
  { stepNo: 4, id: "ferment", title: "锥形罐控温发酵与冷端 Dry-Hopping 锁果香", subtitle: "酵母造酒，冷投留香", plainAction: "迅速冷却麦汁、接种酵母；主酵后在冷端投入芳香酒花。", scienceNote: "酵母把糖变成酒精与 CO₂；低温干投减少挥发油受热损失。", flavorImpact: "温度决定果酯与洁净度，干投决定芒果、柑橘和松脂顶香。", keyMetrics: ["拉格 7–13℃", "艾尔 16–24℃", "干投 2–5 天"], diagramKind: "beer-hot-cold-brewing", photoUrl: assetUrl("/photos/craft-beer-step4.jpg") },
  { stepNo: 5, id: "mature", title: "熟成碳化与氮气/瓶内二发", subtitle: "决定泡沫与入口触感", plainAction: "冷贮澄清，再选择强制充 CO₂、氮气打酒或瓶内加糖二发。", scienceNote: "低温让蛋白与酵母沉降；溶解气体形成不同大小和速度的气泡。", flavorImpact: "CO₂ 脆爽，氮气绵密，瓶内二发则带细泡与继续陈化能力。", keyMetrics: ["冷贮 0–4℃", "瓶内二发 1–4 周", "氮气泡更细"], diagramKind: "beer-hot-cold-brewing", photoUrl: assetUrl("/photos/craft-beer-step5.jpg") },
];

export function BeerBrewingCraftView({ bundle }: Props) {
  const [glassId, setGlassId] = useState<BeerGlassId>(bundle.beerGlassware[0]?.id ?? "pilsner-flute");
  const glass = bundle.beerGlassware.find((g) => g.id === glassId) ?? bundle.beerGlassware[0];
  return <section className="beer-space beer-craft">
    <header className="beer-section-head"><span>BREWHOUSE · COLD SIDE</span><h2>酿造卷 · 热端与冷端</h2><p>沿铜釜、发酵罐与酒头行进，辨认苦味萃取和香气保存截然相反的温度逻辑。</p></header>
    <CraftStepDeck steps={STEPS} heading="啤酒五步冷热端科学长卷" subheading="一边看设备剖面，一边看真实工坊：从麦粒、铜釜到锥罐和杯中泡沫。" accentHex="#3a6b34" />
    {glass && <div className="glass-cabinet"><div className="glass-cabinet__stage"><BeerGlassIllustration glassware={glass.id} srmColorHex="#C8781E" beerName={glass.name} /><div><small>GLASS FLUID DYNAMICS</small><h3>{glass.name} · {glass.englishName}</h3><b>{glass.volumeMl} ml</b><p><strong>锁泡：</strong>{glass.headRetentionMechanics}</p><p><strong>聚香：</strong>{glass.aromaFocusingNote}</p><span>{glass.bestForStyles.join(" · ")}</span></div></div><nav>{bundle.beerGlassware.map((g) => <button key={g.id} className={g.id === glass.id ? "on" : ""} onClick={() => setGlassId(g.id)}><BeerGlassIllustration glassware={g.id} srmColorHex="#B96519" beerName={g.name} /><b>{g.name}</b></button>)}</nav></div>}
  </section>;
}
