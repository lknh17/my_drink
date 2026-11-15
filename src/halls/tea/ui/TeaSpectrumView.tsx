import { useEffect, useMemo, useState } from "react";
import { CraftStepDeck, type CraftStepItem } from "../../../core/CraftStepDeck";
import type { CraftDiagramKind } from "../../../core/CraftSvgDiagrams";
import {
  teaMonographToFootprint,
  useDrinkFootprints,
} from "../../../core/drinkFootprints";
import {
  TEA_CATEGORY_SHORT_META,
  type TeaCategoryId,
  type TeaCategoryMeta,
  type TeaCompendiumBundle,
  type TeaMonograph,
} from "../types";
import { LiquorCupBadge, SongRunningHead } from "./LiquorCupBadge";

export interface TeaSpectrumViewProps {
  bundle: TeaCompendiumBundle;
  selectedCategory: TeaCategoryId | "all";
  onSelectCategory: (cat: TeaCategoryId | "all") => void;
  onOpenTea: (teaId: string, category?: TeaCategoryId) => void;
  onJumpToMountain?: (mountainId: string) => void;
}

const CATEGORY_ORDER: TeaCategoryId[] = [
  "green",
  "white",
  "yellow",
  "oolong",
  "black",
  "dark",
  "scented",
];

const WATERSHED_KEYWORDS = [
  "杀青",
  "萎凋",
  "闷黄",
  "摇青",
  "做青",
  "炭焙",
  "发酵",
  "红变",
  "渥堆",
  "陈化",
  "窨制",
  "伺花",
];

const TEA_CRAFT_SCIENCE: Record<TeaCategoryId, {
  diagram: CraftDiagramKind;
  photo: string;
  accent: string;
  steps: CraftStepItem[];
}> = {
  green: {
    diagram: "tea-fixation-killgreen", photo: "/photos/craft-tea-green.jpg", accent: "#588B57",
    steps: [
      { stepNo: 1, id: "green-spread", title: "鲜叶薄摊", subtitle: "先散青气、匀水分", plainAction: "将春芽薄摊在竹匾，轻翻不闷堆，让表面水与低沸点青草气先散去。", scienceNote: "叶片仍在呼吸，少量失水使细胞膜通透性温和上升，为均匀受热做准备。", flavorImpact: "摊得匀，成茶清香不生青；摊过头则鲜爽变薄。", keyMetrics: ["叶温 20–25℃", "含水 75→68%", "薄摊 2–6h"], diagramKind: "tea-fixation-killgreen", photoUrl: "/photos/craft-tea-green.jpg" },
      { stepNo: 2, id: "green-fix", title: "高温杀青", subtitle: "80℃叶温快速钝酶", plainAction: "以 180–220℃热锅抛炒，或用 100℃蒸汽快速穿透鲜叶，闷抖结合散掉水汽。", scienceNote: "叶温迅速超过 80℃后，多酚氧化酶 PPO / POD 失活，阻断儿茶素褐变并锁住叶绿素。", flavorImpact: "保留茶氨酸鲜甜与清汤绿叶；温度不足会红梗，过火则焦边。", keyMetrics: ["锅温 180–220℃", "核心叶温 ≥80℃", "2–8min"], diagramKind: "tea-fixation-killgreen", photoUrl: "/photos/craft-tea-green.jpg" },
      { stepNo: 3, id: "green-shape", title: "揉捻辉锅", subtitle: "塑形并足干提香", plainAction: "趁热揉捻或理条，再以较低锅温辉锅，边炒边压形成扁、针、曲等茶形。", scienceNote: "轻度细胞破损帮助冲泡浸出；末段低水分下发生温和热香反应。", flavorImpact: "形成豆香、栗香与利落回甘，并把含水率降到安全线。", keyMetrics: ["叶温 60–90℃", "终水分 4–6%", "足干 20–60min"], diagramKind: "tea-fixation-killgreen", photoUrl: "/photos/craft-tea-green.jpg" },
    ],
  },
  white: {
    diagram: "tea-withering-sun", photo: "/photos/craft-tea-white.jpg", accent: "#A98B47",
    steps: [
      { stepNo: 1, id: "white-spread", title: "薄摊开青", subtitle: "银毫芽叶不堆压", plainAction: "鲜叶不炒不揉，单层摊在水筛上，让每片芽叶都能接触微风。", scienceNote: "气孔蒸腾启动缓慢走水，细胞仍保持完整，避免机械破壁带来猛烈氧化。", flavorImpact: "保住毫香与清甜，避免闷红、酸馊。", keyMetrics: ["摊叶厚 1–2cm", "叶温 22–28℃", "RH 60–75%"], diagramKind: "tea-withering-sun", photoUrl: "/photos/craft-tea-white.jpg" },
      { stepNo: 2, id: "white-wither", title: "复式萎凋", subtitle: "日光与室内交替走水", plainAction: "根据阳光和风力把水筛移入移出，日晒与阴晾交替，轻并筛让水分重新均衡。", scienceNote: "长时呼吸消耗青草气，蛋白质水解增加游离氨基酸，少量多酚缓慢氧化。", flavorImpact: "生成毫香、晒香、杏仁与清蜜甜，而非强烈红茶果香。", keyMetrics: ["25–30℃", "36–72h", "含水 75→15%"], diagramKind: "tea-withering-sun", photoUrl: "/photos/craft-tea-white.jpg" },
      { stepNo: 3, id: "white-dry", title: "文火足干", subtitle: "停酶封香、留陈化空间", plainAction: "以低温竹笼或烘干机缓慢足干，不用高火抢香。", scienceNote: "把水分降到微生物安全线，同时不过度破坏黄酮与后续陈化所需成分。", flavorImpact: "新茶甜净，存放后逐渐出现枣香、药香与温润感。", keyMetrics: ["烘温 50–80℃", "终水分 ≤7%", "复火 1–2 次"], diagramKind: "tea-withering-sun", photoUrl: "/photos/craft-tea-white.jpg" },
    ],
  },
  yellow: {
    diagram: "tea-smothering-yellow", photo: "/photos/craft-tea-yellow.jpg", accent: "#C49B2D",
    steps: [
      { stepNo: 1, id: "yellow-fix", title: "温和杀青", subtitle: "先钝酶、仍留湿热", plainAction: "锅炒杀青后不把叶片完全烘干，保留柔软和水汽。", scienceNote: "酶被钝化，后续转黄主要依靠湿热非酶促反应而非猛烈氧化。", flavorImpact: "去掉生青底味，为黄汤甜醇打底。", keyMetrics: ["锅温 120–180℃", "叶温 ≥75℃", "含水约 45–55%"], diagramKind: "tea-smothering-yellow", photoUrl: "/photos/craft-tea-yellow.jpg" },
      { stepNo: 2, id: "yellow-smother", title: "牛皮纸闷黄", subtitle: "湿热包覆慢转甜", plainAction: "趁热用牛皮纸包覆或堆积，以初闷、复闷多轮观察叶色和香气。", scienceNote: "湿热促使叶绿素脱镁、酯型儿茶素裂解，多糖与蛋白温和水解。", flavorImpact: "苦涩降低，形成黄叶黄汤、玉米甜与锅巴栗香。", keyMetrics: ["45–65℃", "RH >85%", "6–48h"], diagramKind: "tea-smothering-yellow", photoUrl: "/photos/craft-tea-yellow.jpg" },
      { stepNo: 3, id: "yellow-dry", title: "文火拉干", subtitle: "固定黄变与甜香", plainAction: "摊开散热后分段低火烘炒至足干，及时停止闷黄。", scienceNote: "降水终止湿热转化，适度热反应补足熟甜香而不焦化。", flavorImpact: "汤感甜醇温和，避免闷过头产生酸馊或暗褐。", keyMetrics: ["烘温 70–100℃", "终水分 5–7%", "叶色黄绿"], diagramKind: "tea-smothering-yellow", photoUrl: "/photos/craft-tea-yellow.jpg" },
    ],
  },
  oolong: {
    diagram: "tea-shaking-oolong", photo: "/photos/craft-tea-oolong.jpg", accent: "#9A5B25",
    steps: [
      { stepNo: 1, id: "oolong-sun", title: "晒青凉青", subtitle: "先软化叶片、建立走水势", plainAction: "开面叶短时日晒后移入室内凉青，让梗脉水分向叶肉重新分配。", scienceNote: "轻微失水提高膜通透性，萜烯糖苷开始释放芳香前体。", flavorImpact: "青气退去，兰花和熟果香有了基础。", keyMetrics: ["叶温 28–35℃", "失水 8–15%", "晒 15–40min"], diagramKind: "tea-shaking-oolong", photoUrl: "/photos/craft-tea-oolong.jpg" },
      { stepNo: 2, id: "oolong-shake", title: "摇青做青", subtitle: "动静交替造红镶边", plainAction: "竹筛摇动碰伤叶缘，再静置走水，重复 3–7 轮且逐轮加重。", scienceNote: "叶缘细胞破损后局部 PPO 氧化，梗脉水分与芳香物质向叶面迁移。", flavorImpact: "形成绿叶红镶边、兰花果香与厚实音韵；过摇会红熟发酸。", keyMetrics: ["摇青 3–7轮", "室温 22–26℃", "氧化 20–70%"], diagramKind: "tea-shaking-oolong", photoUrl: "/photos/craft-tea-oolong.jpg" },
      { stepNo: 3, id: "oolong-roast", title: "杀青揉捻与炭焙", subtitle: "定格发酵、文火慢炖", plainAction: "高温杀青停止氧化，揉捻塑形后用炭火复焙、退火再焙。", scienceNote: "热力钝酶并驱水，复焙促使糖氨反应与低沸青草气逸散。", flavorImpact: "轻焙显花香，足火出现岩韵、熟果、焦糖与木质暖香。", keyMetrics: ["杀青叶温 ≥80℃", "焙温 90–120℃", "终水分 4–6%"], diagramKind: "tea-shaking-oolong", photoUrl: "/photos/craft-tea-oolong.jpg" },
    ],
  },
  black: {
    diagram: "tea-fermentation-black", photo: "/photos/craft-tea-black.jpg", accent: "#A6402C",
    steps: [
      { stepNo: 1, id: "black-wither", title: "萎凋软化", subtitle: "浓缩细胞液、退青草气", plainAction: "鲜叶在萎凋槽中通风失水，直至叶梗柔软、折而不断。", scienceNote: "呼吸与水解使氨基酸、可溶性糖增加，细胞膜逐渐通透。", flavorImpact: "为花蜜甜打底，也让后续揉捻不碎不青。", keyMetrics: ["22–28℃", "8–18h", "含水 75→60%"], diagramKind: "tea-fermentation-black", photoUrl: "/photos/craft-tea-black.jpg" },
      { stepNo: 2, id: "black-roll", title: "充分揉捻", subtitle: "机械破壁让酶与底物相遇", plainAction: "加压揉捻至叶汁外溢、条索紧结，控制发热并适时解块。", scienceNote: "细胞壁破裂后儿茶素与 PPO 在氧气中充分接触，氧化链迅速启动。", flavorImpact: "决定红茶浓度和汤感；揉不足味薄，过度则碎涩。", keyMetrics: ["揉捻 45–90min", "叶温 <35℃", "细胞破损率 >80%"], diagramKind: "tea-fermentation-black", photoUrl: "/photos/craft-tea-black.jpg" },
      { stepNo: 3, id: "black-ferment", title: "控温全发酵", subtitle: "茶黄素与茶红素成金圈", plainAction: "将湿叶薄摊在高湿暖室，闻到花果香、叶色转铜红后立即高温烘干。", scienceNote: "儿茶素氧化聚合生成茶黄素 TF 与茶红素 TR，干燥再令酶失活。", flavorImpact: "TF 带来鲜亮金圈与爽度，TR 贡献红汤醇厚与甜润。", keyMetrics: ["25–30℃", "RH 90–95%", "2–5h"], diagramKind: "tea-fermentation-black", photoUrl: "/photos/craft-tea-black.jpg" },
    ],
  },
  dark: {
    diagram: "tea-pile-dark", photo: "/photos/craft-tea-dark.jpg", accent: "#5C3929",
    steps: [
      { stepNo: 1, id: "dark-base", title: "毛茶初制", subtitle: "杀青揉捻、晒干成底坯", plainAction: "成熟叶杀青揉捻后晒干或初烘，形成适合后发酵的毛茶。", scienceNote: "适度保留粗纤维、多糖与可供微生物利用的底物。", flavorImpact: "底坯干净，后期才有陈香而非杂霉味。", keyMetrics: ["含水 8–12%", "粗老度适中", "无焦边烟味"], diagramKind: "tea-pile-dark", photoUrl: "/photos/craft-tea-dark.jpg" },
      { stepNo: 2, id: "dark-pile", title: "洒水渥堆", subtitle: "湿热菌群接力转化", plainAction: "毛茶洒水堆积并覆盖保温，定期翻堆散热、补氧、均匀发酵。", scienceNote: "曲霉、酵母等分泌胞外酶，水解多糖与蛋白，多酚聚合为茶褐素。", flavorImpact: "刚烈苦涩转为红浓顺滑、枣甜木香；失控会烧堆或霉败。", keyMetrics: ["45–60℃", "含水 25–35%", "7–45d"], diagramKind: "tea-pile-dark", photoUrl: "/photos/craft-tea-dark.jpg" },
      { stepNo: 3, id: "dark-age", title: "发花与干仓陈化", subtitle: "金花菌与时间继续雕琢", plainAction: "茯砖控温控湿发花，其他黑茶压制后在清洁干仓微氧陈放。", scienceNote: "冠突散囊菌代谢与缓慢氧化继续降低刺激性、重组香气和多糖质感。", flavorImpact: "出现菌花、木香、参枣与米汤般稠滑回甘。", keyMetrics: ["发花 25–30℃", "干仓 RH 50–68%", "陈化数月至数十年"], diagramKind: "tea-pile-dark", photoUrl: "/photos/craft-tea-dark.jpg" },
    ],
  },
  scented: {
    diagram: "tea-scenting-jasmine", photo: "/photos/craft-tea-scented.jpg", accent: "#8A713B",
    steps: [
      { stepNo: 1, id: "scented-flower", title: "伺花养花", subtitle: "等待子夜开放吐香", plainAction: "午后采含苞茉莉，摊开通风养花，等花冠开放、香气达到峰值。", scienceNote: "花蕾升温开放时释放芳樟醇、苯甲醇等挥发性芳香分子。", flavorImpact: "伺花准确才有鲜灵花香；生花不香，死花带闷馊。", keyMetrics: ["花温 32–38℃", "开放率 ≥80%", "晚间 20–23时"], diagramKind: "tea-scenting-jasmine", photoUrl: "/photos/craft-tea-scented.jpg" },
      { stepNo: 2, id: "scented-scent", title: "茶花拌合窨制", subtitle: "温湿梯度让茶坯吸香", plainAction: "把极干茶坯与鲜花分层拌匀，静置窨花，中途通花散热并及时起花。", scienceNote: "干燥多孔叶面通过吸附与氢键络合捕捉香分，同时吸收鲜花水汽。", flavorImpact: "形成入汤不浮的鲜灵花韵，而非表面香精感。", keyMetrics: ["22–28℃", "6–12h/窨", "堆温 <45℃"], diagramKind: "tea-scenting-jasmine", photoUrl: "/photos/craft-tea-scented.jpg" },
      { stepNo: 3, id: "scented-repeat", title: "复火多窨一提", subtitle: "去水、再吸香、鲜花收尾", plainAction: "筛去花渣后低温复火，再用新花重复 4–9 次，最后少量优花提香。", scienceNote: "复火恢复茶坯吸附能力；多轮浓度梯度让香气逐层进入叶片孔隙。", flavorImpact: "碗中不见花，汤里却有清透持久的茉莉魂。", keyMetrics: ["复火 70–90℃", "4–9窨", "终水分 ≤8.5%"], diagramKind: "tea-scenting-jasmine", photoUrl: "/photos/craft-tea-scented.jpg" },
    ],
  },
};

function isWatershedStep(stepText: string): boolean {
  return WATERSHED_KEYWORDS.some((kw) => stepText.includes(kw));
}

const SVG_W = 860;
const SVG_H = 490;
const PAD_L = 68;
const PAD_R = 34;
const PAD_T = 36;
const PAD_B = 58;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

function projectStarPoint(fermentationPct: number, roastScore: number): [number, number] {
  const clampedX = Math.max(0, Math.min(100, fermentationPct));
  const clampedY = Math.max(0, Math.min(100, roastScore));
  const x = PAD_L + (clampedX / 100) * PLOT_W;
  const y = PAD_T + ((100 - clampedY) / 100) * PLOT_H;
  return [x, y];
}

export function TeaSpectrumView({
  bundle,
  selectedCategory,
  onSelectCategory,
  onOpenTea,
  onJumpToMountain,
}: TeaSpectrumViewProps) {
  const { isTasted, toggleTasted, teaCategoryCounts } = useDrinkFootprints();
  const [hoveredTeaId, setHoveredTeaId] = useState<string | null>(null);
  const [onlyTastedHighlight, setOnlyTastedHighlight] = useState(false);
  const [craftWorkshopCategory, setCraftWorkshopCategory] = useState<TeaCategoryId>(
    selectedCategory === "all" ? "green" : selectedCategory,
  );
  useEffect(() => {
    if (selectedCategory !== "all") setCraftWorkshopCategory(selectedCategory);
  }, [selectedCategory]);

  const categoryMap = useMemo(() => {
    const map = new Map<TeaCategoryId, TeaCategoryMeta>();
    for (const c of bundle.categories) {
      map.set(c.id, c);
    }
    return map;
  }, [bundle.categories]);

  const orderedCategories = useMemo(() => {
    return CATEGORY_ORDER.map((id) => {
      const found = categoryMap.get(id);
      const fallback = TEA_CATEGORY_SHORT_META[id];
      const count = bundle.monographs.filter((m) => m.category === id).length;
      return {
        id,
        shortLabel: fallback.shortLabel,
        sealChar: fallback.sealChar,
        name: found?.name ?? fallback.name,
        englishName: found?.englishName ?? id.toUpperCase(),
        fermentationRange: found?.fermentationRange ?? "传统工艺区间",
        keyCraft: found?.keyCraft ?? "核心制茶工序",
        liquorHex: found?.representativeLiquorHex ?? fallback.liquorHex,
        liquorLabel: found?.representativeLiquorLabel ?? "清澈明亮",
        natureNote: found?.natureNote ?? "四时皆宜，依体质酌饮",
        storageNote: found?.storageNote ?? "避光、密封、防潮、防异味",
        summary: found?.summary ?? "",
        craftFlowSteps: found?.craftFlowSteps ?? [],
        count,
      };
    });
  }, [categoryMap, bundle.monographs]);

  // Deterministic anti-overlap projection for 2D Star-Map nodes
  const plottedNodes = useMemo(() => {
    const placed: { x: number; y: number }[] = [];
    return bundle.monographs.map((tea, index) => {
      const [rawX, rawY] = projectStarPoint(tea.fermentationPct, tea.roastScore);
      let x = rawX;
      let y = rawY;

      // Gentle spiral nudge if another node is within 9px
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const collision = placed.some(
          (p) => Math.hypot(p.x - x, p.y - y) < 9.5,
        );
        if (!collision) break;
        const angle = ((index + attempt * 2.39996) % (Math.PI * 2));
        const radius = 7 + attempt * 3.2;
        x = Math.max(PAD_L + 8, Math.min(SVG_W - PAD_R - 8, rawX + Math.cos(angle) * radius));
        y = Math.max(PAD_T + 8, Math.min(SVG_H - PAD_B - 8, rawY + Math.sin(angle) * radius));
      }

      placed.push({ x, y });
      return { tea, x, y };
    });
  }, [bundle.monographs]);

  // Subtle category zone halos computed from plotted nodes per category
  const categoryHalos = useMemo(() => {
    return orderedCategories
      .map((cat) => {
        const pts = plottedNodes.filter((n) => n.tea.category === cat.id);
        if (pts.length === 0) return null;
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const rx = Math.max(36, (maxX - minX) / 2 + 24);
        const ry = Math.max(28, (maxY - minY) / 2 + 22);
        return {
          id: cat.id,
          label: cat.shortLabel,
          colorHex: cat.liquorHex,
          cx,
          cy,
          rx,
          ry,
        };
      })
      .filter((h): h is NonNullable<typeof h> => Boolean(h));
  }, [orderedCategories, plottedNodes]);

  // Active inspected tea in the Star-Map sidebar
  const inspectedTea = useMemo<TeaMonograph | null>(() => {
    if (hoveredTeaId) {
      const found = bundle.monographs.find((t) => t.id === hoveredTeaId);
      if (found) return found;
    }
    if (selectedCategory !== "all") {
      return bundle.monographs.find((t) => t.category === selectedCategory) ?? bundle.monographs[0] ?? null;
    }
    return bundle.monographs[0] ?? null;
  }, [hoveredTeaId, selectedCategory, bundle.monographs]);

  const activeCategoryDetail = useMemo(
    () =>
      selectedCategory === "all"
        ? null
        : orderedCategories.find((c) => c.id === selectedCategory) ?? null,
    [selectedCategory, orderedCategories],
  );

  const categoryMonographs = useMemo(() => {
    if (selectedCategory === "all") return bundle.monographs;
    return bundle.monographs.filter((m) => m.category === selectedCategory);
  }, [bundle.monographs, selectedCategory]);

  return (
    <div className="tea-spectrum-view" data-testid="tea-spectrum-view">
      {/* 1. 七彩茶汤色谱横轴 (7-Cup Liquor Chromatic Bar) */}
      <section className="tea-folio-panel" aria-label="七彩茶汤色谱横轴">
        <SongRunningHead
          volumeTag="茗典 · 卷一 · 谱系"
          title="中华六大茶类与花茶 · 七盏茶汤色谱仪"
          subtitle="一叶嘉木演万物：循多酚氧化酶促反应与火功陈化，俯瞰景德镇白瓷审评盏中之汤色渐变"
          rightSlot={
            <button
              type="button"
              className={`zw-chip${selectedCategory === "all" ? " on" : ""}`}
              data-testid="spectrum-cat-all"
              onClick={() => onSelectCategory("all")}
            >
              全部七席总览 ({bundle.monographs.length}款)
            </button>
          }
        />

        <div className="tea-chromatic-bar" role="group" aria-label="茶类汤色筛选盏">
          {orderedCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const tastedCount = teaCategoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                className={`tea-chromatic-cup-card${isSelected ? " active" : ""}`}
                data-testid={`chromatic-cup-${cat.id}`}
                onClick={() => onSelectCategory(isSelected ? "all" : cat.id)}
              >
                <LiquorCupBadge
                  liquorColorHex={cat.liquorHex}
                  size="lg"
                  interactive
                  label={`${cat.shortLabel} · ${cat.liquorLabel}`}
                />
                <span className="tea-chromatic-cup-name">
                  {cat.shortLabel}
                </span>
                <span className="tea-chromatic-cup-ferm">{cat.fermentationRange}</span>
                <span className="tea-chromatic-cup-liquor">{cat.liquorLabel}</span>
                <span className="tea-chromatic-cup-count">
                  馆藏 {cat.count} 款{tastedCount > 0 ? ` · 已品 ${tastedCount}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. 二维散点星图：发酵度 (0-100%) × 焙火/陈化度 (0-100) */}
      <section className="tea-folio-panel parchment" aria-label="发酵度与焙火陈化二维星图">
        <SongRunningHead
          volumeTag="茶味经纬星图"
          title="发酵度 (0–100%) × 焙火与陈化度 (0–100) 二维风味散点图"
          subtitle="横轴映射茶多酚酶促氧化/渥堆深度，纵轴映射炭焙火功与岁月转化强度；悬停审评单茶，点击直入本纪精读"
          rightSlot={
            <div className="zw-chip-row">
              <button
                type="button"
                className={`zw-chip${onlyTastedHighlight ? " on" : ""}`}
                onClick={() => setOnlyTastedHighlight((v) => !v)}
              >
                {onlyTastedHighlight ? "✓ 仅高亮已品茶款" : "高亮我的已品足迹"}
              </button>
            </div>
          }
        />

        {/* Quick Category Filter Pills */}
        <div className="zw-chip-row" style={{ marginBottom: "0.9rem" }}>
          <span className="zw-chip-label">星图聚焦：</span>
          <button
            type="button"
            className={`zw-chip${selectedCategory === "all" ? " on" : ""}`}
            onClick={() => onSelectCategory("all")}
          >
            全谱系星群 ({bundle.monographs.length})
          </button>
          {orderedCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`zw-chip${selectedCategory === cat.id ? " on" : ""}`}
              onClick={() =>
                onSelectCategory(selectedCategory === cat.id ? "all" : cat.id)
              }
            >
              {cat.sealChar} · {cat.shortLabel} ({cat.count})
            </button>
          ))}
        </div>

        <div className="tea-starmap-grid">
          <div className="tea-starmap-canvas-wrap">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="tea-starmap-svg"
              role="img"
              aria-label="中国茶发酵度与焙火陈化度二维风味星图"
              data-testid="tea-spectrum-starmap"
            >
              {/* Grid lines: X (Fermentation 0-100%) */}
              {[0, 15, 30, 50, 70, 85, 100].map((pct) => {
                const [gx] = projectStarPoint(pct, 0);
                return (
                  <g key={`gx-${pct}`}>
                    <line
                      x1={gx}
                      y1={PAD_T}
                      x2={gx}
                      y2={SVG_H - PAD_B}
                      stroke="#DFDACB"
                      strokeWidth={pct === 0 || pct === 50 || pct === 100 ? 1.2 : 0.8}
                      strokeDasharray={pct === 0 ? undefined : "4 4"}
                    />
                    <text
                      x={gx}
                      y={SVG_H - PAD_B + 18}
                      textAnchor="middle"
                      fontSize="10.5"
                      fill="#68736D"
                      fontFamily="var(--font-mono)"
                    >
                      {pct}%
                    </text>
                  </g>
                );
              })}

              {/* Grid lines: Y (Roast & Aging 0-100) */}
              {[0, 25, 50, 75, 100].map((score) => {
                const [, gy] = projectStarPoint(0, score);
                return (
                  <g key={`gy-${score}`}>
                    <line
                      x1={PAD_L}
                      y1={gy}
                      x2={SVG_W - PAD_R}
                      y2={gy}
                      stroke="#DFDACB"
                      strokeWidth={score === 0 || score === 50 || score === 100 ? 1.2 : 0.8}
                      strokeDasharray={score === 0 ? undefined : "4 4"}
                    />
                    <text
                      x={PAD_L - 10}
                      y={gy + 3.5}
                      textAnchor="end"
                      fontSize="10.5"
                      fill="#68736D"
                      fontFamily="var(--font-mono)"
                    >
                      {score}
                    </text>
                  </g>
                );
              })}

              {/* Axis Titles & Semantic Quadrant Captions */}
              <text
                x={PAD_L + PLOT_W / 2}
                y={SVG_H - 12}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#1E2421"
                fontFamily="var(--font-serif)"
              >
                酶促氧化 / 微生物发酵度 Fermentation Degree (0% 杀青锁鲜 → 50% 摇青半发酵 → 100% 全发酵/渥堆)
              </text>

              <text
                x={18}
                y={PAD_T + PLOT_H / 2}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#1E2421"
                fontFamily="var(--font-serif)"
                transform={`rotate(-90, 18, ${PAD_T + PLOT_H / 2})`}
              >
                焙火功力与陈化度 Roast & Aging (0 清鲜 → 100 足火/陈年)
              </text>

              {/* Quadrant Scholarly Watermarks */}
              <text x={PAD_L + 14} y={SVG_H - PAD_B - 12} fontSize="10" fill="#588B57" opacity="0.72">
                ↙ 低发酵 · 鲜爽毫香区（绿茶 / 新白茶 / 轻黄茶）
              </text>
              <text x={PAD_L + PLOT_W * 0.34} y={PAD_T + 20} fontSize="10" fill="#9A5B25" opacity="0.78">
                ↑ 半发酵 · 岩骨炭焙与高香区（武夷岩茶 / 凤凰单丛）
              </text>
              <text x={SVG_W - PAD_R - 12} y={PAD_T + 20} textAnchor="end" fontSize="10" fill="#A6402C" opacity="0.78">
                ↗ 渥堆陈化与烟熏醇厚区（熟普 / 老六堡 / 松烟小种）
              </text>

              {/* Category Zone Halos */}
              <g className="tea-starmap-halos">
                {categoryHalos.map((halo) => {
                  const active = selectedCategory === "all" || selectedCategory === halo.id;
                  return (
                    <g key={`halo-${halo.id}`} opacity={active ? 1 : 0.18}>
                      <ellipse
                        cx={halo.cx}
                        cy={halo.cy}
                        rx={halo.rx}
                        ry={halo.ry}
                        fill={halo.colorHex}
                        fillOpacity={selectedCategory === halo.id ? 0.16 : 0.08}
                        stroke={halo.colorHex}
                        strokeWidth={selectedCategory === halo.id ? 1.4 : 0.8}
                        strokeDasharray="5 4"
                      />
                    </g>
                  );
                })}
              </g>

              {/* Crosshair on Inspected Node */}
              {inspectedTea && (() => {
                const targetNode = plottedNodes.find((n) => n.tea.id === inspectedTea.id);
                if (!targetNode) return null;
                return (
                  <g pointerEvents="none">
                    <line
                      x1={targetNode.x}
                      y1={PAD_T}
                      x2={targetNode.x}
                      y2={SVG_H - PAD_B}
                      stroke="#35685F"
                      strokeWidth="0.9"
                      strokeDasharray="3 3"
                      opacity="0.55"
                    />
                    <line
                      x1={PAD_L}
                      y1={targetNode.y}
                      x2={SVG_W - PAD_R}
                      y2={targetNode.y}
                      stroke="#35685F"
                      strokeWidth="0.9"
                      strokeDasharray="3 3"
                      opacity="0.55"
                    />
                  </g>
                );
              })()}

              {/* Plotted Tea Monograph Nodes */}
              <g className="tea-starmap-nodes">
                {plottedNodes.map(({ tea, x, y }, idx) => {
                  const catMatch =
                    selectedCategory === "all" || tea.category === selectedCategory;
                  const tasted = isTasted(tea.id);
                  const dimmed =
                    !catMatch || (onlyTastedHighlight && !tasted);
                  const isInspected = inspectedTea?.id === tea.id;
                  const showLabel =
                    isInspected ||
                    (selectedCategory !== "all" && catMatch) ||
                    idx % 5 === 0;

                  return (
                    <g
                      key={tea.id}
                      transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
                      className="tea-star-node"
                      opacity={dimmed ? 0.17 : 1}
                      data-testid={`starmap-node-${tea.id}`}
                      onMouseEnter={() => setHoveredTeaId(tea.id)}
                      onFocus={() => setHoveredTeaId(tea.id)}
                      onClick={() => onOpenTea(tea.id, tea.category)}
                    >
                      {isInspected && (
                        <circle
                          r={14}
                          fill={tea.liquorColorHex}
                          opacity={0.28}
                        />
                      )}
                      {tasted && (
                        <circle
                          r={10.5}
                          fill="none"
                          stroke="#35685F"
                          strokeWidth={1.4}
                        />
                      )}
                      <circle
                        className="node-core"
                        r={isInspected ? 7.6 : 6}
                        fill={tea.liquorColorHex}
                        stroke={isInspected ? "#1E2421" : "#FCFBF7"}
                        strokeWidth={isInspected ? 2.2 : 1.7}
                      />
                      {showLabel && !dimmed && (
                        <text
                          x={0}
                          y={-10.5}
                          textAnchor="middle"
                          fontSize={isInspected ? "11.5" : "9.8"}
                          fontWeight={isInspected ? "700" : "500"}
                          fontFamily="var(--font-serif)"
                          fill="#1E2421"
                          style={{
                            paintOrder: "stroke",
                            stroke: "rgba(252, 251, 247, 0.92)",
                            strokeWidth: "2.8px",
                          }}
                        >
                          {tea.title}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Right Inspection Panel */}
          <aside className="tea-starmap-inspector" aria-live="polite" data-testid="starmap-inspector">
            {inspectedTea ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem" }}>
                    <span className="zw-search-badge" style={{ borderColor: "#35685F", color: "#35685F" }}>
                      {TEA_CATEGORY_SHORT_META[inspectedTea.category]?.shortLabel} · {inspectedTea.subStyle}
                    </span>
                    <button
                      type="button"
                      className={`zw-chip${isTasted(inspectedTea.id) ? " on" : ""}`}
                      onClick={() => toggleTasted(teaMonographToFootprint(inspectedTea))}
                    >
                      {isTasted(inspectedTea.id) ? "✓ 已品" : "+ 喝过"}
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <LiquorCupBadge
                      liquorColorHex={inspectedTea.liquorColorHex}
                      size="lg"
                      label={inspectedTea.liquorColorLabel}
                    />
                    <div>
                      <h3 style={{ fontSize: "1.28rem" }}>{inspectedTea.title}</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--tea-ink-muted)", marginTop: "0.18rem" }}>
                        {inspectedTea.provinceLabel} · {inspectedTea.originCore}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--tea-amber)", marginTop: "0.14rem" }}>
                        汤色：{inspectedTea.liquorColorLabel}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.84rem", color: "var(--tea-ink-secondary)", lineHeight: 1.55 }}>
                    {inspectedTea.tagline}
                  </p>

                  <div className="tea-inspector-metrics">
                    <div className="tea-metric-tile">
                      <small>发酵度坐标</small>
                      <strong>{inspectedTea.fermentationPct}%</strong>
                    </div>
                    <div className="tea-metric-tile">
                      <small>焙火 / 陈化度</small>
                      <strong>{inspectedTea.roastScore} / 100</strong>
                    </div>
                    <div className="tea-metric-tile">
                      <small>适制茶树良种</small>
                      <strong style={{ fontSize: "0.84rem" }}>{inspectedTea.cultivar}</strong>
                    </div>
                    <div className="tea-metric-tile">
                      <small>行家司茶水温</small>
                      <strong>{inspectedTea.brewing.tempCelsius}℃</strong>
                    </div>
                  </div>

                  <div>
                    <small style={{ display: "block", fontSize: "0.74rem", color: "var(--tea-ink-muted)", marginBottom: "0.35rem" }}>
                      前中后调香气谱：
                    </small>
                    <div className="zw-chip-row">
                      {inspectedTea.aromaNotes.map((note) => (
                        <span key={note} className="zw-search-badge">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", paddingTop: "0.65rem", borderTop: "1px dashed var(--tea-rule-outer)" }}>
                  <button
                    type="button"
                    className="zw-pill-btn primary"
                    style={{ flex: 1, justifyContent: "center" }}
                    data-testid="starmap-open-monograph-btn"
                    onClick={() => onOpenTea(inspectedTea.id, inspectedTea.category)}
                  >
                    披阅《{inspectedTea.title}》本纪 →
                  </button>
                  {onJumpToMountain && inspectedTea.mountainId && (
                    <button
                      type="button"
                      className="zw-pill-btn"
                      onClick={() => onJumpToMountain(inspectedTea.mountainId)}
                    >
                      ⛰️ 探山场
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p style={{ color: "var(--tea-ink-muted)" }}>移动鼠标至星图节点以查阅单茶风味坐标。</p>
            )}
          </aside>
        </div>
      </section>

      {/* 3. 制茶生化分水岭与工序对比 (Biochemistry & Craft Flow Comparator) */}
      <section className="tea-folio-panel" aria-label="六大茶类制茶生化与工序分水岭">
        <div className="tea-craft-workshop">
          <SongRunningHead
            volumeTag="七艺双轨工坊"
            title="七大茶类核心制茶工艺双轨科普工坊"
            subtitle="左轨看叶片细胞、酶与水分如何变化，右轨看真实工序现场；逐步回答工匠在做什么、内部为何变化、最终如何落进杯中。"
          />
          <nav className="tea-craft-workshop-tabs" aria-label="选择茶类工艺科普">
            {orderedCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={craftWorkshopCategory === cat.id ? "active" : ""}
                onClick={() => {
                  setCraftWorkshopCategory(cat.id);
                  onSelectCategory(cat.id);
                }}
              >
                <span>{cat.sealChar}</span>
                {cat.shortLabel}
              </button>
            ))}
          </nav>
          <CraftStepDeck
            key={craftWorkshopCategory}
            heading={`${TEA_CATEGORY_SHORT_META[craftWorkshopCategory].name} · 核心工序科学长卷`}
            subheading={categoryMap.get(craftWorkshopCategory)?.keyCraft}
            accentHex={TEA_CRAFT_SCIENCE[craftWorkshopCategory].accent}
            steps={TEA_CRAFT_SCIENCE[craftWorkshopCategory].steps}
          />
        </div>

        {activeCategoryDetail ? (
          <>
            <SongRunningHead
              volumeTag={`生化解剖 · ${activeCategoryDetail.shortLabel}`}
              title={`${activeCategoryDetail.name} — 决定性工艺分水岭：${activeCategoryDetail.keyCraft}`}
              subtitle={activeCategoryDetail.summary}
              rightSlot={
                <button
                  type="button"
                  className="zw-chip"
                  onClick={() => onSelectCategory("all")}
                >
                  ← 返回七大茶类对照矩阵
                </button>
              }
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {/* Step-by-step craft flow chain */}
              <div className="tea-dossier-box">
                <h5>标准制茶工序链（朱砂框为决定该茶类品质走向的酶学/物理分水岭）</h5>
                <div className="tea-craft-flow-chain" style={{ marginTop: "0.45rem" }}>
                  {activeCategoryDetail.craftFlowSteps.map((step, i) => (
                    <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      <span className={`tea-craft-step${isWatershedStep(step) ? " watershed" : ""}`}>
                        <small style={{ fontFamily: "var(--font-mono)", opacity: 0.75 }}>0{i + 1}</small>
                        {step}
                      </span>
                      {i < activeCategoryDetail.craftFlowSteps.length - 1 && (
                        <span className="tea-craft-arrow">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="tea-taste-craft-split">
                <div className="tea-dossier-box">
                  <h5>茶性寒温与体感特征</h5>
                  <p>{activeCategoryDetail.natureNote}</p>
                </div>
                <div className="tea-dossier-box">
                  <h5>科学存茶与陈化铁律</h5>
                  <p>{activeCategoryDetail.storageNote}</p>
                </div>
              </div>

              {/* Representative Teas of Selected Category */}
              <div>
                <h4 style={{ fontSize: "1rem", marginBottom: "0.65rem" }}>
                  本卷收录之「{activeCategoryDetail.shortLabel}」代表名茶（共 {categoryMonographs.length} 款，点击进入三态审评）
                </h4>
                <div className="tea-comparator-matrix">
                  {categoryMonographs.map((tea) => (
                    <article
                      key={tea.id}
                      className="tea-cat-matrix-card"
                      style={{ cursor: "pointer" }}
                      onClick={() => onOpenTea(tea.id, tea.category)}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <LiquorCupBadge liquorColorHex={tea.liquorColorHex} size="sm" />
                          <div>
                            <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>
                              {tea.title}
                            </strong>
                            <small style={{ display: "block", color: "var(--tea-ink-muted)", fontSize: "0.76rem" }}>
                              {tea.provinceLabel} · {tea.subStyle}
                            </small>
                          </div>
                        </div>
                        <span className="zw-search-badge">
                          发酵 {tea.fermentationPct}% · 火功 {tea.roastScore}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tea-ink-secondary)" }}>
                        {tea.tagline}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <SongRunningHead
              volumeTag="制茶化学分水岭"
              title="六大茶类 + 再加工花茶 · 核心酶促工艺与茶性对照总谱"
              subtitle="同采自茶树鲜叶（Camellia sinensis），因杀青、萎凋、闷黄、摇青、全发酵、渥堆与窨花之分野，化生七重天地"
            />

            <div className="tea-comparator-matrix">
              {orderedCategories.map((cat) => {
                const repTeas = bundle.monographs
                  .filter((m) => m.category === cat.id)
                  .slice(0, 4);

                return (
                  <article key={cat.id} className="tea-cat-matrix-card">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <LiquorCupBadge liquorColorHex={cat.liquorHex} size="md" />
                          <div>
                            <h3 style={{ fontSize: "1.06rem" }}>{cat.name}</h3>
                            <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--tea-ink-muted)" }}>
                              {cat.englishName} · {cat.fermentationRange}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="zw-chip"
                          onClick={() => onSelectCategory(cat.id)}
                        >
                          详考 →
                        </button>
                      </div>

                      <div className="tea-dossier-box" style={{ padding: "0.48rem 0.65rem" }}>
                        <h5>决定性工艺分水岭：{cat.keyCraft}</h5>
                        <div className="tea-craft-flow-chain" style={{ marginTop: "0.3rem", gap: "0.28rem" }}>
                          {cat.craftFlowSteps.map((st, idx) => (
                            <span
                              key={st}
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.14rem 0.42rem",
                                borderRadius: "4px",
                                border: isWatershedStep(st)
                                  ? "1px solid var(--tea-cinnabar)"
                                  : "1px solid var(--tea-rule-inner)",
                                color: isWatershedStep(st) ? "var(--tea-cinnabar)" : "var(--tea-ink-secondary)",
                                background: isWatershedStep(st) ? "var(--tea-cinnabar-soft)" : "var(--tea-ivory)",
                                fontWeight: isWatershedStep(st) ? 600 : 400,
                              }}
                            >
                              {idx > 0 ? `→ ${st}` : st}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: "0.82rem", color: "var(--tea-ink-secondary)", lineHeight: 1.55 }}>
                        {cat.summary}
                      </p>

                      <div style={{ fontSize: "0.76rem", color: "var(--tea-ink-muted)", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span><strong>茶性：</strong>{cat.natureNote}</span>
                        <span><strong>存藏：</strong>{cat.storageNote}</span>
                      </div>
                    </div>

                    <div style={{ paddingTop: "0.55rem", borderTop: "1px dashed var(--tea-rule-inner)" }}>
                      <small style={{ display: "block", fontSize: "0.72rem", color: "var(--tea-ink-muted)", marginBottom: "0.35rem" }}>
                        代表传世名茶（点击披阅）：
                      </small>
                      <div className="zw-chip-row">
                        {repTeas.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className="zw-chip"
                            onClick={() => onOpenTea(t.id, t.category)}
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
