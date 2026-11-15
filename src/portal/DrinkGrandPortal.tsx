import { useMemo, useState } from "react";
import type { DrinkFootprintRecord, DrinkRouteTarget } from "../core/types";
import {
  baijiuMonographToFootprint,
  beerMonographToFootprint,
  cocktailToFootprint,
  coffeeBeanToFootprint,
  coffeeBeverageToFootprint,
  grapeWineToFootprint,
  huangjiuToFootprint,
  teaMonographToFootprint,
  useDrinkFootprints,
  worldSpiritToFootprint,
} from "../core/drinkFootprints";
import {
  TEA_CATEGORY_SHORT_META,
  type TeaCategoryId,
  type TeaCompendiumBundle,
  type TeaMonograph,
  type TeaSubView,
} from "../halls/tea/types";
import type { WineCompendiumBundle } from "../halls/wine/types";
import type { CoffeeCompendiumBundle, CoffeeSubView } from "../halls/coffee/types";
import "./portal.css";

export interface DrinkGrandPortalProps {
  teaBundle: TeaCompendiumBundle;
  wineBundle: WineCompendiumBundle;
  coffeeBundle: CoffeeCompendiumBundle;
  onEnterHall: (hall: "tea" | "wine" | "coffee") => void;
  onNavigate: (target: DrinkRouteTarget) => void;
  onOpenSearch: () => void;
  onOpenPassport: () => void;
  onOpenCalibration?: () => void;
}

type ShichenPeriodId =
  | "mao-chen"
  | "si-wu"
  | "wei-shen"
  | "you-xu"
  | "hai-zi";

interface ShichenPeriodMeta {
  id: ShichenPeriodId;
  title: string;
  hours: string;
  moodKicker: string;
  poeticGuidance: string;
  preferredTeaCats: TeaCategoryId[];
  preferredTeaKeywords: string[];
  coffeeIds: string[];
  wineIds: string[];
}

interface ShichenRecommendationCard {
  id: string;
  hall: "tea" | "wine" | "coffee";
  hallLabel: string;
  title: string;
  subtitle: string;
  originLabel: string;
  liquorColorHex: string;
  pairingReason: string;
  ctaText: string;
  target: DrinkRouteTarget;
  footprint: DrinkFootprintRecord;
}

const TEA_SUB_PILLS: { sub: TeaSubView; label: string; hint: string }[] = [
  { sub: "spectrum", label: "谱系卷", hint: "6+1 茶类发酵与焙火光谱" },
  { sub: "terroir", label: "风土卷", hint: "四大茶区与名山微气候沙盘" },
  { sub: "monographs", label: "本纪卷", hint: "传世名茶审评与冲泡全书" },
  { sub: "teaware", label: "器道卷", hint: "紫砂盖碗建盏看茶择器矩阵" },
  { sub: "chronicles", label: "茶脉卷", hint: "唐煎宋点明清泡与四时茶席" },
];

const COFFEE_SUB_PILLS: { sub: CoffeeSubView; label: string }[] = [
  { sub: "botany", label: "树种后制" },
  { sub: "terroir", label: "庄园风土" },
  { sub: "monographs", label: "寻豆本纪" },
  { sub: "brewing", label: "饮品萃取" },
  { sub: "equipment", label: "器具道场" },
  { sub: "ecology", label: "浪潮生态" },
];

const SHICHEN_PERIODS: ShichenPeriodMeta[] = [
  {
    id: "mao-chen",
    title: "卯辰·朝露鲜茗",
    hours: "05:00 – 09:00",
    moodKicker: "DAWN DEW · 升发清阳 · 嫩芽与白花晨光",
    poeticGuidance:
      "晨起阳气初升，宜饮不发酵明前鲜绿茶、微发酵毫香白茶，或一杯高海拔茉莉花香浅烘手冲唤醒感官。",
    preferredTeaCats: ["green", "white", "scented"],
    preferredTeaKeywords: ["龙井", "碧螺春", "银针", "毛峰", "安吉", "茉莉"],
    coffeeIds: ["coffee-panama-gesha-washed", "coffee-ethiopia-gedeb-natural"],
    wineIds: [],
  },
  {
    id: "si-wu",
    title: "巳午·岩骨醒神",
    hours: "09:00 – 13:00",
    moodKicker: "HIGH NOON · 专注思辨 · 岩韵焙火与虎斑浓缩",
    poeticGuidance:
      "巳午案牍劳形、脾胃运化正盛，宜借武夷丹霞岩骨乌龙、高香凤凰单丛，或 9 Bar 黄金油脂浓缩提振神思。",
    preferredTeaCats: ["oolong", "yellow"],
    preferredTeaKeywords: ["肉桂", "水仙", "大红袍", "单丛", "铁观音", "冻顶"],
    coffeeIds: ["drink-espresso", "coffee-kenya-nyeri-sl28"],
    wineIds: [],
  },
  {
    id: "wei-shen",
    title: "未申·手冲寻豆",
    hours: "13:00 – 17:00",
    moodKicker: "AFTERNOON LAB · 申时茶会与精品手冲风味漫游",
    poeticGuidance:
      "午后斜阳入窗，最宜架起 V60 滤杯慢冲云南高黎贡山与哥伦比亚厌氧微批次，或瀹一壶蜜香温润的工夫红茶。",
    preferredTeaCats: ["black", "white", "scented"],
    preferredTeaKeywords: ["祁门", "金骏眉", "滇红", "正山小种", "白牡丹"],
    coffeeIds: ["coffee-yunnan-baoshan-typica", "drink-flat-white"],
    wineIds: ["westmalle-tripel"],
  },
  {
    id: "you-xu",
    title: "酉戌·微醺琥珀",
    hours: "17:00 – 21:00",
    moodKicker: "TWILIGHT APERITIVO · 华灯初上 · 餐前开胃与欢聚佳酿",
    poeticGuidance:
      "暮色四合、庖厨飘香，从佛罗伦萨血橙苦甜尼格罗尼启幕，佐勃艮第黑皮诺、二十年冬酿花雕或赤水河陈年酱香。",
    preferredTeaCats: ["dark", "black"],
    preferredTeaKeywords: ["熟茶", "普洱", "六堡", "茯砖"],
    coffeeIds: ["drink-dirty", "coffee-yunnan-menglian-honey"],
    wineIds: ["classic-negroni", "kuaijishan-20-jiafan", "bj-feitian-maotai"],
  },
  {
    id: "hai-zi",
    title: "亥子·围炉陈韵",
    hours: "21:00 – 01:00",
    moodKicker: "MIDNIGHT HEARTH · 夜深静思 · 岁月陈茶与泥煤水楢",
    poeticGuidance:
      "万籁俱寂之时，或温炉煮一壶老白茶与勐海陈年熟普安抚身心，或独酌艾雷岛海风泥煤与山崎水楢木东方檀韵。",
    preferredTeaCats: ["dark", "white"],
    preferredTeaKeywords: ["老白茶", "寿眉", "普洱", "班章", "易武", "六堡"],
    coffeeIds: ["coffee-sumatra-mandheling-wethulled"],
    wineIds: ["ardbeg-10", "yamazaki-12", "chumen-chenpi-puer-stout"],
  },
];

const ONTOLOGY_ROWS = [
  {
    code: "AXIS 01 · BOTANICAL",
    title: "植物学本源与风土器官",
    teaTitle: "山茶科多年生木本 · 鲜嫩芽叶 (Camellia sinensis)",
    teaDesc:
      "采摘一芽一叶至成熟驻芽，富含茶多酚（儿茶素）、L-茶氨酸与芳香萜烯糖苷；风土凝结于海拔云雾漫射光与烂石砾壤。",
    wineTitle: "禾本科谷物淀粉 / 欧亚种酿酒葡萄果实",
    wineDesc:
      "高粱糯米小麦提供支链淀粉供曲霉糖化，葡萄果皮提供花青素单宁与天然果糖；产区河谷微生态与石灰岩坡向决定骨架。",
    coffeeTitle: "茜草科常绿灌木 · 咖啡樱桃双生种子内胚乳",
    coffeeDesc:
      "取果实最深处的两瓣生豆种子（Arabica 染色体 44 条），南北回归线高海拔火山灰冷凉昼夜温差孕育高密度硬豆。",
  },
  {
    code: "AXIS 02 · CRAFT",
    title: "酶促 / 菌群 / 热物理转化",
    teaTitle: "内源多酚氧化酶（PPO）梯度调控 × 锅炒炭焙",
    teaDesc:
      "从高温杀青零发酵（绿茶）、日光萎凋微发酵（白茶）、摇青做青半发酵（乌龙）到渥堆微生物后发酵（黑茶），形成 0%–100% 连续光谱。",
    wineTitle: "曲霉酵母双边复式发酵 × 沸点分馏与木桶呼吸",
    wineDesc:
      "东方大曲泥窖/地缸百菌共生，西方壶式紫铜天鹅颈二次蒸馏切割酒心，再经陶坛酯化或雪莉/波本/水楢橡木桶十年醇化。",
    coffeeTitle: "果胶后制无氧/日晒发酵 × 200℃ 梅纳焦糖化热解",
    coffeeDesc:
      "先由水洗、日晒、蜜或厌氧控压改写生豆前体物，再于烘焙机 10–14 分钟内经历脱水、梅纳反应与一爆（First Crack）精准锁香。",
  },
  {
    code: "AXIS 03 · TERROIR",
    title: "地理空间尺度与坐标语法",
    teaTitle: "中国四大茶区 × 二十核心名山（三坑两涧 / 一山一味）",
    teaDesc:
      "江南、华南、西南、江北四域分野，微缩至狮峰白砂土、武夷丹霞坑涧、凤凰山乌岽海拔梯度与西双版纳古茶山寨。",
    wineTitle: "赤水河酱酒峡谷 × 旧世界 Climat × 苏格兰海岛产区",
    wineDesc:
      "茅台镇紫红泥河谷、绍兴鉴湖软水、勃艮第夜丘石墙地块、艾雷岛海藻泥煤沼泽——菌群与水源不可异地复制。",
    coffeeTitle: "全球南北纬 25° 咖啡带 × 中国云南高黎贡/孟连庄园",
    coffeeDesc:
      "东非裂谷基因源头、巴拿马巴鲁火山云林、哥伦比亚安第斯梯田，以及北回归线极限风土云南保山潞江坝与普洱精品庄园。",
  },
  {
    code: "AXIS 04 · EXTRACTION",
    title: "器皿热学与液态萃取曲线",
    teaTitle: "看茶择器（紫砂双气孔 / 薄胎白瓷）× 多泡数汤色演进",
    teaDesc:
      "80℃ 玻璃杯中投赏绿芽，100℃ 紫砂/潮州朱泥沸水激发岩骨单丛，历经 1–8 泡从表层高扬花香次第舒展至木质冰糖韵。",
    wineTitle: "收口闻香郁金香杯 / 格林凯恩杯 × 侍酒温区与醒酒兑水",
    wineDesc:
      "无需冲煮而重『侍酒解封』：53% 酱香室温分酒器静醒，黑皮诺 16℃ 大肚杯聚香，威士忌滴入数滴软水破除疏水酯键。",
    coffeeTitle: "60° 锥形滤杯分段手冲 / 9 Bar 高压乳化金杯萃取",
    coffeeDesc:
      "严控研磨粒径（260–880μm）、粉水比（1:15 或 1:2）与 86–93℃ 水温，追求 SCA 金杯准则 18%–22% 黄金萃取率。",
  },
];

function getInitialShichenByHour(): ShichenPeriodId {
  if (typeof window === "undefined") return "mao-chen";
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return "mao-chen";
  if (h >= 9 && h < 13) return "si-wu";
  if (h >= 13 && h < 17) return "wei-shen";
  if (h >= 17 && h < 21) return "you-xu";
  return "hai-zi";
}

function pickTeaForShichen(monographs: TeaMonograph[], meta: ShichenPeriodMeta): TeaMonograph[] {
  if (monographs.length === 0) return [];
  const scored = monographs.map((tea, idx) => {
    let score = 0;
    const catPos = meta.preferredTeaCats.indexOf(tea.category);
    if (catPos !== -1) score += 30 - catPos * 6;
    for (const kw of meta.preferredTeaKeywords) {
      if (tea.title.includes(kw) || tea.subStyle.includes(kw)) {
        score += 25;
      }
    }
    return { tea, score, idx };
  });
  scored.sort((a, b) => b.score - a.score || a.idx - b.idx);
  return scored.slice(0, 2).map((s) => s.tea);
}

export function DrinkGrandPortal({
  teaBundle,
  wineBundle,
  coffeeBundle,
  onEnterHall,
  onNavigate,
  onOpenSearch,
  onOpenPassport,
  onOpenCalibration,
}: DrinkGrandPortalProps) {
  const { countsByHall, wishlistCountsByHall, isTasted, isWishlisted, toggleTasted, toggleWishlist } =
    useDrinkFootprints();

  const [activeShichenId, setActiveShichenId] = useState<ShichenPeriodId>(getInitialShichenByHour);

  // Smart live counts with architectural fallbacks while tea content bundle scales
  const teaCategoryCount = teaBundle.categories.length >= 7 ? teaBundle.categories.length : 7;
  const teaMountainCount = teaBundle.mountains.length > 1 ? teaBundle.mountains.length : 20;
  const teaMonographCount = teaBundle.monographs.length > 1 ? teaBundle.monographs.length : 66;
  const teaWareCount = teaBundle.teaware.length > 1 ? teaBundle.teaware.length : 18;

  const activeShichen = useMemo(
    () => SHICHEN_PERIODS.find((p) => p.id === activeShichenId) ?? SHICHEN_PERIODS[0],
    [activeShichenId],
  );

  const shichenCards = useMemo<ShichenRecommendationCard[]>(() => {
    const cards: ShichenRecommendationCard[] = [];
    const wineCards: ShichenRecommendationCard[] = [];

    // 1. Tea items from teaBundle.monographs
    const matchedTeas = pickTeaForShichen(teaBundle.monographs, activeShichen);
    for (const tea of matchedTeas) {
      const catMeta = TEA_CATEGORY_SHORT_META[tea.category];
      cards.push({
        id: tea.id,
        hall: "tea",
        hallLabel: `🍵 茗典 · ${catMeta?.shortLabel ?? "名茶"}`,
        title: tea.title,
        subtitle: `${tea.subStyle} · ${tea.brewing.tempCelsius}℃ ${tea.brewing.vessel.split(" / ")[0]}`,
        originLabel: `${tea.provinceLabel} · ${tea.originCore}`,
        liquorColorHex: tea.liquorColorHex,
        pairingReason: `${tea.tagline} 香气呈 ${tea.aromaNotes.slice(0, 3).join("、")}。`,
        ctaText: "展卷阅茶志 →",
        target: { hall: "tea", sub: "monographs", cat: tea.category, tea: tea.id },
        footprint: teaMonographToFootprint(tea),
      });
    }

    // 2. Coffee beans and beverages from the live six-volume compendium
    for (const cid of activeShichen.coffeeIds) {
      const bean = coffeeBundle.beans.find((c) => c.id === cid);
      const drink = coffeeBundle.beverages.find((c) => c.id === cid);
      if (bean) cards.push({
        id: bean.id, hall: "coffee", hallLabel: `☕ 咖典 · ${bean.roastLabel.split(" · ")[0]}`,
        title: bean.title, subtitle: `${bean.lotCode} · ${bean.goldenCup.ratioLabel} / ${bean.goldenCup.waterTempCelsius}℃`,
        originLabel: `${bean.originLabel} (${bean.elevationMeters})`, liquorColorHex: bean.cremaOrLiquorHex,
        pairingReason: `${bean.tagline} 杯测风味：${bean.flavorNotes.slice(0, 3).join(" · ")}。`,
        ctaText: "展开寻豆本纪 →", target: { hall: "coffee", csub: "monographs", specimen: bean.id },
        footprint: coffeeBeanToFootprint(bean),
      });
      else if (drink) cards.push({
        id: drink.id, hall: "coffee", hallLabel: `☕ 咖典 · ${drink.englishTitle}`,
        title: drink.title, subtitle: `${drink.totalVolumeMl}ml · ${drink.servingTemp}`,
        originLabel: drink.originCityOrEra, liquorColorHex: drink.layers[0]?.colorHex ?? "#C86D3B",
        pairingReason: drink.tagline, ctaText: "打开饮品萃取台 →",
        target: { hall: "coffee", csub: "brewing", drink: drink.id },
        footprint: coffeeBeverageToFootprint(drink),
      });
    }

    // 3. Wine items from the live six-wing compendium
    for (const wid of activeShichen.wineIds) {
      const baijiu = wineBundle.baijiuMonographs.find((x) => x.id === wid);
      const beer = wineBundle.beerMonographs.find((x) => x.id === wid);
      const huangjiu = wineBundle.huangjiuSpecimens.find((x) => x.id === wid);
      const grape = wineBundle.grapeSpecimens.find((x) => x.id === wid);
      const spirit = wineBundle.spiritSpecimens.find((x) => x.id === wid);
      const cocktail = wineBundle.cocktailSpecimens.find((x) => x.id === wid);
      if (baijiu) wineCards.push({ id: baijiu.id, hall: "wine", hallLabel: `🥃 国酿 · ${baijiu.abvOptions}`, title: baijiu.title, subtitle: baijiu.subSchool, originLabel: `${baijiu.provinceLabel} · ${baijiu.originCore}`, liquorColorHex: baijiu.liquorHueHex, pairingReason: `${baijiu.tagline} ${baijiu.noseNotes.slice(0, 3).join(" · ")}。`, ctaText: "展卷阅名酒志 →", target: { hall: "wine", wing: "baijiu", wsub: "monographs", specimen: baijiu.id }, footprint: baijiuMonographToFootprint(baijiu) });
      else if (beer) wineCards.push({ id: beer.id, hall: "wine", hallLabel: `🍺 麦律 · ${beer.abv}`, title: beer.title, subtitle: beer.bjcpStyleLabel, originLabel: beer.countryOrRegion, liquorColorHex: beer.srmColorHex, pairingReason: `${beer.tagline} ${beer.aromaTags.slice(0, 3).join(" · ")}。`, ctaText: "查看酒头档案 →", target: { hall: "wine", wing: "beer", wsub: "taplist", specimen: beer.id }, footprint: beerMonographToFootprint(beer) });
      else if (huangjiu) wineCards.push({ id: huangjiu.id, hall: "wine", hallLabel: `🍶 古越 · ${huangjiu.abv}`, title: huangjiu.title, subtitle: huangjiu.sugarLabel, originLabel: huangjiu.originLabel, liquorColorHex: huangjiu.liquorColorHex, pairingReason: huangjiu.tagline, ctaText: "查阅冬酿档案 →", target: { hall: "wine", wing: "huangjiu", specimen: huangjiu.id }, footprint: huangjiuToFootprint(huangjiu) });
      else if (grape) wineCards.push({ id: grape.id, hall: "wine", hallLabel: `🍷 风土 · ${grape.abv}`, title: grape.title, subtitle: grape.originAppellation, originLabel: grape.country, liquorColorHex: grape.liquorColorHex, pairingReason: `${grape.tagline} ${grape.aromaNotes.slice(0, 3).join(" · ")}。`, ctaText: "查阅酒庄档案 →", target: { hall: "wine", wing: "grape", specimen: grape.id }, footprint: grapeWineToFootprint(grape) });
      else if (spirit) wineCards.push({ id: spirit.id, hall: "wine", hallLabel: `🥃 橡木 · ${spirit.abv}`, title: spirit.title, subtitle: spirit.category, originLabel: spirit.originRegion, liquorColorHex: spirit.liquorColorHex, pairingReason: `${spirit.tagline} ${spirit.nosesAndPalate.slice(0, 3).join(" · ")}。`, ctaText: "进入暗夜酒窖 →", target: { hall: "wine", wing: "spirits", specimen: spirit.id }, footprint: worldSpiritToFootprint(spirit) });
      else if (cocktail) wineCards.push({ id: cocktail.id, hall: "wine", hallLabel: `🍸 微醺 · ${cocktail.abvEstimate}`, title: cocktail.title, subtitle: cocktail.englishTitle, originLabel: cocktail.eraOrOrigin, liquorColorHex: cocktail.liquorColorHex, pairingReason: `${cocktail.tagline} ${cocktail.flavorTags.slice(0, 3).join(" · ")}。`, ctaText: "打开调酒配方 →", target: { hall: "wine", wing: "cocktails", specimen: cocktail.id }, footprint: cocktailToFootprint(cocktail) });
    }

    return activeShichen.wineIds.length > 0
      ? [...wineCards, ...cards].slice(0, 3)
      : cards.slice(0, 3);
  }, [teaBundle.monographs, wineBundle, coffeeBundle, activeShichen]);

  // Flagship Tea Showcase Cards (diverse across categories when full bundle is loaded)
  const showcaseTeas = useMemo<TeaMonograph[]>(() => {
    const list = teaBundle.monographs;
    if (list.length <= 8) return list;
    const seenCats = new Set<string>();
    const picked: TeaMonograph[] = [];
    for (const item of list) {
      if (!seenCats.has(item.category)) {
        seenCats.add(item.category);
        picked.push(item);
      }
      if (picked.length >= 8) break;
    }
    for (const item of list) {
      if (picked.length >= 8) break;
      if (!picked.some((p) => p.id === item.id)) {
        picked.push(item);
      }
    }
    return picked;
  }, [teaBundle.monographs]);

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="portal-promenade" data-testid="drink-grand-portal">
      {/* Sticky Museum Promenade Header */}
      <header className="portal-header">
        <div className="portal-brand">
          <span className="portal-seal">酌味</span>
          <div>
            <span className="portal-kicker">
              CHINESE TEA · WORLD SPIRITS &amp; WINE · SPECIALTY COFFEE
            </span>
            <span className="portal-title-main">酌味 · 饮品全集</span>
          </div>
        </div>

        <div className="portal-header-actions">
          <button
            type="button"
            className="portal-action-btn"
            data-testid="portal-open-search"
            onClick={onOpenSearch}
          >
            🔍 全局检索 <span className="zw-kbd">⌘K</span>
          </button>
          <button
            type="button"
            className="portal-action-btn passport"
            data-testid="portal-open-passport"
            onClick={onOpenPassport}
          >
            📜 品饮护照
            <span className="portal-passport-badge">{countsByHall.total}</span>
            {wishlistCountsByHall.total > 0 && (
              <span style={{ fontSize: "0.76rem", opacity: 0.86 }}>
                · 想喝 {wishlistCountsByHall.total}
              </span>
            )}
          </button>
          {onOpenCalibration && <button type="button" className="portal-action-btn" onClick={onOpenCalibration}>🖼️ 配图校准</button>}
        </div>
      </header>

      <main className="portal-container">
        {/* Grand Atrium Manifesto */}
        <section className="portal-atrium-intro" aria-label="酌味饮品全集总序">
          <div>
            <div className="portal-atrium-eyebrow">
              🏛️ ONE GRAND ATRIUM · THREE AUTONOMOUS PAVILIONS · 一枢三馆数字博物志
            </div>
            <h1>
              草木风土 · 岁月曲火 · <span>烘焙金杯的三重宇宙</span>
            </h1>
            <p className="portal-atrium-desc">
              世界三大经典饮品——中华茶、中外酒、精品咖啡，各自拥有截然不同的植物学基因、微生物/热化学工艺与器皿仪式。
              「酌味」摒弃千篇一律的通用模板，以博物馆中庭串联三座独立美学展馆，用统一跨馆检索与品饮护照记录你的每一口风土足迹。
            </p>
          </div>

          <div className="portal-atrium-quicknav">
            <button
              type="button"
              className="portal-anchor-chip"
              onClick={() => scrollToId("portal-triptych-facades")}
            >
              三馆立面三联屏
            </button>
            <button
              type="button"
              className="portal-anchor-chip"
              onClick={() => scrollToId("portal-ontology-matrix")}
            >
              三饮知识本体长卷
            </button>
            <button
              type="button"
              className="portal-anchor-chip"
              onClick={() => scrollToId("portal-shichen-stream")}
            >
              十二时辰引饮流
            </button>
            <button
              type="button"
              className="portal-anchor-chip"
              onClick={() => scrollToId("portal-tea-showcase")}
            >
              镇馆名茶速览
            </button>
          </div>
        </section>

        {/* 1. Architectural Triptych (三座独立美学展馆立面三联屏) */}
        <section
          id="portal-triptych-facades"
          className="portal-triptych"
          aria-label="三座独立美学展馆立面三联屏"
        >
          {/* 第一座大楼 · 茗典 · 中华茶馆 */}
          <article className="portal-facade tea-facade" data-testid="portal-card-tea">
            <div className="portal-facade-top">
              <span className="portal-building-no">PAVILION I · 第一座大楼</span>
              <span className="portal-status-pill">● 首期全量开馆</span>
            </div>

            <div className="portal-facade-motif-row">
              <div>
                <h2 className="portal-facade-title">茗典 · 中华茶馆</h2>
                <p className="portal-facade-subtitle">天青素宣 · 宋韵山岚 · RU-KILN CELADON</p>
              </div>

              {/* Custom Teacup & Distant Misty Mountain SVG Motif */}
              <svg width="78" height="66" viewBox="0 0 78 66" fill="none" aria-hidden="true">
                <path
                  d="M6 34 L22 14 L36 28 L52 8 L72 34 Z"
                  fill="rgba(53, 104, 95, 0.14)"
                  stroke="#35685F"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 38 H58 C57 50, 49 56, 39 56 C29 56, 21 50, 20 38 Z"
                  fill="#FCFBF7"
                  stroke="#35685F"
                  strokeWidth="2"
                />
                <ellipse cx="39" cy="38" rx="19" ry="4" fill="#C9DC78" stroke="#35685F" strokeWidth="1.5" />
                <path d="M27 58 H51" stroke="#9A5B25" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M35 28 C33 23, 37 20, 35 15" stroke="#588B57" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M43 30 C41 25, 45 22, 43 17" stroke="#588B57" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>

            <p className="portal-facade-summary">
              以宋代汝窑天青与宣纸墨韵构筑全量中国茶百科。横贯六大茶类与再加工花茶酶促光谱，纵览四大茶区二十座核心名山微气候沙盘、传世名茶本纪与看茶择器科学。
            </p>

            <div className="tea-stats-strip">
              <div className="tea-stat-item">
                <strong>{teaCategoryCount} 类</strong>
                <span>6+1 发酵谱系</span>
              </div>
              <div className="tea-stat-item">
                <strong>{teaMountainCount} 座</strong>
                <span>名山风土沙盘</span>
              </div>
              <div className="tea-stat-item">
                <strong>{teaMonographCount} 款</strong>
                <span>传世名茶本纪</span>
              </div>
              <div className="tea-stat-item">
                <strong>{teaWareCount} 器</strong>
                <span>看茶择器图谱</span>
              </div>
            </div>

            <div className="tea-subspace-box">
              <span className="tea-subspace-label">FIVE SUB-GALLERIES · 直达茶馆五大分卷</span>
              <div className="tea-subspace-pills">
                {TEA_SUB_PILLS.map((pill) => (
                  <button
                    key={pill.sub}
                    type="button"
                    className="tea-sub-pill"
                    title={pill.hint}
                    data-testid={`portal-tea-sub-${pill.sub}`}
                    onClick={() => onNavigate({ hall: "tea", sub: pill.sub })}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="portal-cta-btn tea-cta"
              data-testid="portal-enter-tea"
              onClick={() => onEnterHall("tea")}
            >
              <span>🍵 步入中华茶馆</span>
              <span>已品 {countsByHall.tea} 款 →</span>
            </button>
          </article>

          {/* 第二座大楼 · 醺典 · 中外酒馆 */}
          <article className="portal-facade wine-facade" data-testid="portal-card-wine">
            <div className="portal-facade-top">
              <span className="portal-building-no">PAVILION II · 第二座大楼</span>
              <span className="portal-status-pill">全境开馆 · 一院六境</span>
            </div>

            <div className="portal-facade-motif-row">
              <div>
                <h2 className="portal-facade-title">醺典 · 中外酒馆</h2>
                <p className="portal-facade-subtitle">羊脂白瓷 · 朱砂丹印 · 麦芽鎏金 · SIX WINE WINGS</p>
              </div>

              {/* Custom Pot-Still & Glencairn Glass SVG Motif */}
              <svg width="78" height="66" viewBox="0 0 78 66" fill="none" aria-hidden="true">
                <path
                  d="M12 56 C12 42, 20 36, 22 28 C24 20, 22 14, 28 10 C34 6, 44 8, 50 16"
                  stroke="#D4943A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <ellipse cx="24" cy="46" rx="13" ry="10" fill="rgba(212, 148, 58, 0.16)" stroke="#D4943A" strokeWidth="1.6" />
                <path
                  d="M48 22 H66 L68 38 C69 46, 63 51, 57 51 C51 51, 45 46, 46 38 Z"
                  fill="rgba(255, 244, 226, 0.06)"
                  stroke="#EBB35E"
                  strokeWidth="1.6"
                />
                <path
                  d="M47 38 C52 40, 62 40, 67 38 C67 45, 62 49, 57 49 C52 49, 47 45, 47 38 Z"
                  fill="#7A2332"
                />
                <path d="M54 51 L51 58 H63 L60 51" stroke="#EBB35E" strokeWidth="1.5" />
              </svg>
            </div>

            <p className="portal-facade-summary">
              从羊脂白瓷中的中国白酒，到麦芽泡沫下的世界精酿，再沿冬酿米酒、葡萄风土、橡木桶陈与摩登调酒展开六套不可互换的液态文明。
            </p>

            <div className="wine-highlights-list">
              <div className="wine-hl-row">
                <span>✦ 中国白酒十二香型 · 六大名酒带</span>
                <small>{wineBundle.baijiuMonographs.length} 款本纪</small>
              </div>
              <div className="wine-hl-row">
                <span>✦ 中外精酿 · SRM × IBU 色苦实验室</span>
                <small>{wineBundle.beerMonographs.length} 座酒头</small>
              </div>
              <div className="wine-hl-row">
                <span>✦ 黄酒 · 葡萄酒 · 烈酒 · 鸡尾酒</span>
                <small>60 款白酒 · 32 款精酿 · 32 款葡萄酒 · 32 款世界烈酒 · 全境 172 款佳酿</small>
              </div>
              <div className="wine-wing-pills" aria-label="酒馆六境直达">
                {([
                  ["baijiu", "国酿·白酒"], ["beer", "麦律·啤酒"], ["huangjiu", "古越·黄酒"],
                  ["grape", "风土·葡萄"], ["spirits", "橡木·烈酒"], ["cocktails", "微醺·调酒"],
                ] as const).map(([wing, label]) => (
                  <button key={wing} type="button" onClick={() => onNavigate({ hall: "wine", wing })}>{label}</button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="portal-cta-btn wine-cta"
              data-testid="portal-enter-wine"
              onClick={() => onEnterHall("wine")}
            >
              <span>🥃 步入一院六境</span>
              <span>已品 {countsByHall.wine} 款 →</span>
            </button>
          </article>

          {/* 第三座大楼 · 咖典 · 精品咖啡馆 */}
          <article className="portal-facade coffee-facade" data-testid="portal-card-coffee">
            <div className="portal-facade-top">
              <span className="portal-building-no">PAVILION III · 第三座大楼</span>
              <span className="portal-status-pill">全集开馆 · 六卷大成</span>
            </div>

            <div className="portal-facade-motif-row">
              <div>
                <h2 className="portal-facade-title">咖典 · 精品咖啡馆</h2>
                <p className="portal-facade-subtitle">生豆羊皮纸 · 烘焙实验室 · ROASTERY LAB</p>
              </div>

              {/* Custom V60 Dripper & Coffee Cherry SVG Motif */}
              <svg width="78" height="66" viewBox="0 0 78 66" fill="none" aria-hidden="true">
                <ellipse cx="22" cy="34" rx="13" ry="16" fill="rgba(178, 58, 44, 0.15)" stroke="#B23A2C" strokeWidth="1.7" />
                <path d="M18 25 C14 28, 14 40, 18 43 C21 43, 21 25, 18 25 Z" fill="#FAF7F1" stroke="#2B1911" strokeWidth="1.4" />
                <path d="M26 25 C30 28, 30 40, 26 43 C23 43, 23 25, 26 25 Z" fill="#FAF7F1" stroke="#2B1911" strokeWidth="1.4" />
                <polygon points="40,14 72,14 60,38 52,38" fill="#FAF7F1" stroke="#2B1911" strokeWidth="1.8" />
                <line x1="47" y1="14" x2="54" y2="38" stroke="#C86D3B" strokeWidth="1.3" />
                <line x1="65" y1="14" x2="58" y2="38" stroke="#C86D3B" strokeWidth="1.3" />
                <path d="M47 40 H65 L68 55 H44 Z" fill="#C86D3B" stroke="#2B1911" strokeWidth="1.6" />
              </svg>
            </div>

            <p className="portal-facade-summary">
              从树种基因、樱桃后制与庄园风土，到寻豆本纪、意式饮品、手冲萃取、器具科学与城市浪潮生态，六卷共同构成精品咖啡完整知识闭环。
            </p>

            <div className="coffee-spec-box">
              <div className="coffee-spec-line">
                <span>世界与云南寻豆本纪</span>
                <code>{coffeeBundle.beans.length} BEANS</code>
              </div>
              <div className="coffee-spec-line">
                <span>经典意式、奶咖与创意配方</span>
                <code>{coffeeBundle.beverages.length} DRINKS</code>
              </div>
              <div className="coffee-spec-line">
                <span>磨豆、滤杯、意式与精密器具</span>
                <code>{coffeeBundle.equipment.length} TOOLS</code>
              </div>
              <div className="coffee-spec-line">
                <span>全球咖啡带与中国云南风土</span>
                <code>{coffeeBundle.origins.length} ORIGINS</code>
              </div>
              <div className="coffee-volume-pills" aria-label="咖典六卷直达">
                {COFFEE_SUB_PILLS.map((pill) => (
                  <button key={pill.sub} type="button" onClick={() => onNavigate({ hall: "coffee", csub: pill.sub })}>
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="portal-cta-btn coffee-cta"
              data-testid="portal-enter-coffee"
              onClick={() => onEnterHall("coffee")}
            >
              <span>☕ 步入精品咖啡六卷全集</span>
              <span>已品 {countsByHall.coffee} 款 →</span>
            </button>
          </article>
        </section>

        {/* 2. Three-Drink Ontology Matrix (三饮知识本体对照长卷) */}
        <section id="portal-ontology-matrix" aria-label="三饮知识本体对照长卷">
          <div className="portal-sec-header">
            <div>
              <span className="portal-sec-kicker">
                THREE-DRINK ONTOLOGY SCROLL · 为什么茶、酒、咖啡绝不能套用同一张美食卡片
              </span>
              <h2>三饮知识本体对照长卷 · 植物基因 × 发酵热学 × 风土器皿</h2>
            </div>
            <span className="portal-sec-sub">
              每一座分馆的底层数据结构皆由其物理化学本体独立推导
            </span>
          </div>

          <div className="portal-ontology-scroll">
            <div className="portal-ontology-head-grid">
              <div className="portal-onto-corner">
                <strong>ONTOLOGY AXES</strong>
                <span>四重核心维度对照</span>
              </div>
              <div className="portal-onto-col-head">
                <span className="zw-liquor-ring" style={{ background: "#35685F" }} />
                <div>
                  <strong>🍵 茗典 · 中华茶学</strong>
                  <small>CAMELLIA SINENSIS · 鲜叶酶促体系</small>
                </div>
              </div>
              <div className="portal-onto-col-head">
                <span className="zw-liquor-ring" style={{ background: "#D4943A" }} />
                <div>
                  <strong>🥃 醺典 · 中外酒学</strong>
                  <small>SACCHARIFICATION &amp; STILL · 曲火乙醇体系</small>
                </div>
              </div>
              <div className="portal-onto-col-head">
                <span className="zw-liquor-ring" style={{ background: "#C86D3B" }} />
                <div>
                  <strong>☕ 咖典 · 精品咖啡学</strong>
                  <small>COFFEA ARABICA · 果胶热解萃取体系</small>
                </div>
              </div>
            </div>

            {ONTOLOGY_ROWS.map((row) => (
              <div key={row.code} className="portal-ontology-row">
                <div className="portal-onto-axis">
                  <code>{row.code}</code>
                  <strong>{row.title}</strong>
                </div>
                <div className="portal-onto-cell">
                  <strong>{row.teaTitle}</strong>
                  <p>{row.teaDesc}</p>
                </div>
                <div className="portal-onto-cell">
                  <strong>{row.wineTitle}</strong>
                  <p>{row.wineDesc}</p>
                </div>
                <div className="portal-onto-cell">
                  <strong>{row.coffeeTitle}</strong>
                  <p>{row.coffeeDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 「晨茶 · 午咖 · 夜酒」十二时辰引饮推荐流 */}
        <section id="portal-shichen-stream" aria-label="晨茶午咖夜酒十二时辰引饮推荐流">
          <div className="portal-sec-header">
            <div>
              <span className="portal-sec-kicker">
                TWELVE SHICHEN RITUAL STREAM · 晨茶 · 午咖 · 夜酒的一日节律
              </span>
              <h2>十二时辰引饮流 · 顺应昼夜节律的跨馆风味席</h2>
            </div>
            <span className="portal-sec-sub">
              切换五个时辰段，实时调取茶馆、咖啡馆与酒馆馆藏真品并一键打卡
            </span>
          </div>

          <div className="portal-shichen-tabs" role="tablist" aria-label="十二时辰时段选择">
            {SHICHEN_PERIODS.map((period) => {
              const selected = period.id === activeShichen.id;
              return (
                <button
                  key={period.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`portal-shichen-tab${selected ? " active" : ""}`}
                  data-testid={`shichen-tab-${period.id}`}
                  onClick={() => setActiveShichenId(period.id)}
                >
                  <span className="portal-shichen-time">{period.hours}</span>
                  <strong>{period.title}</strong>
                  <span>{period.moodKicker.split(" · ")[1]}</span>
                </button>
              );
            })}
          </div>

          <div className="portal-shichen-banner" aria-live="polite">
            <div>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.71rem",
                  color: "#9A5B25",
                  fontWeight: 700,
                }}
              >
                {activeShichen.moodKicker} ({activeShichen.hours})
              </span>
              <p>{activeShichen.poeticGuidance}</p>
            </div>
          </div>

          <div className="portal-shichen-cards">
            {shichenCards.map((card) => {
              const tasted = isTasted(card.id);
              const wished = isWishlisted(card.id);
              return (
                <article
                  key={`${activeShichen.id}-${card.id}`}
                  className="portal-drink-card"
                  data-testid={`shichen-card-${card.id}`}
                >
                  <div className="portal-drink-card-head">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <span
                        className="zw-liquor-ring"
                        style={{ background: card.liquorColorHex }}
                      />
                      <span className={`portal-hall-tag ${card.hall}`}>{card.hallLabel}</span>
                    </div>
                    <small style={{ fontFamily: "var(--font-mono)", fontSize: "0.71rem", color: "#736D64" }}>
                      {card.subtitle.split(" · ")[0]}
                    </small>
                  </div>

                  <h3>{card.title}</h3>
                  <span className="portal-drink-origin">📍 {card.originLabel}</span>
                  <p className="portal-drink-reason">{card.pairingReason}</p>

                  <div className="portal-drink-foot">
                    <button
                      type="button"
                      className="portal-jump-link"
                      onClick={() => onNavigate(card.target)}
                    >
                      {card.ctaText}
                    </button>

                    <div className="portal-fp-btns">
                      <button
                        type="button"
                        className={`portal-fp-mini${tasted ? " on" : ""}`}
                        onClick={() => toggleTasted(card.footprint)}
                      >
                        {tasted ? "✓ 喝过" : "+ 喝过"}
                      </button>
                      <button
                        type="button"
                        className={`portal-fp-mini${wished ? " wish" : ""}`}
                        onClick={() => toggleWishlist(card.footprint)}
                      >
                        {wished ? "★ 想喝" : "♡ 想喝"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4. 中华茶馆 · 镇馆名茶速览长廊 */}
        <section id="portal-tea-showcase" aria-label="中华茶馆镇馆名茶速览长廊">
          <div className="portal-sec-header">
            <div>
              <span className="portal-sec-kicker">
                MINGDIAN FLAGSHIP MONOGRAPHS · 首期全量展馆精选名茶直通车
              </span>
              <h2>中华茶馆 · 镇馆名茶速览长廊</h2>
            </div>
            <button
              type="button"
              className="portal-action-btn"
              onClick={() => onNavigate({ hall: "tea", sub: "monographs" })}
            >
              查阅全部名茶本纪 ({teaBundle.monographs.length}) →
            </button>
          </div>

          <div className="portal-tea-gallery">
            {showcaseTeas.map((item) => {
              const catMeta = TEA_CATEGORY_SHORT_META[item.category];
              const fp = teaMonographToFootprint(item);
              const tasted = isTasted(item.id);
              const wished = isWishlisted(item.id);

              return (
                <article
                  key={item.id}
                  className="portal-tea-showcase-card"
                  data-testid={`portal-showcase-tea-${item.id}`}
                  onClick={() =>
                    onNavigate({ hall: "tea", sub: "monographs", cat: item.category, tea: item.id })
                  }
                >
                  <div className="portal-tea-card-top">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        className="zw-liquor-ring"
                        style={{ background: item.liquorColorHex }}
                      />
                      <span className="portal-hall-tag tea">
                        {catMeta?.shortLabel ?? item.category}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#68736D" }}>
                      {item.provinceLabel} · {item.brewing.tempCelsius}℃
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <span style={{ fontSize: "0.77rem", color: "#68736D" }}>
                    {item.originCore}
                  </span>

                  <p style={{ fontSize: "0.81rem", color: "#3A433E", lineHeight: 1.56 }}>
                    {item.tagline}
                  </p>

                  <div className="portal-tea-aromas">
                    {item.aromaNotes.slice(0, 3).map((note) => (
                      <span key={note} className="portal-aroma-pill">
                        {note}
                      </span>
                    ))}
                  </div>

                  <div className="portal-drink-foot">
                    <span className="portal-jump-link">进入名茶本纪 →</span>
                    <div className="portal-fp-btns">
                      <button
                        type="button"
                        className={`portal-fp-mini${tasted ? " on" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTasted(fp);
                        }}
                      >
                        {tasted ? "✓ 喝过" : "+ 喝过"}
                      </button>
                      <button
                        type="button"
                        className={`portal-fp-mini${wished ? " wish" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(fp);
                        }}
                      >
                        {wished ? "★ 想喝" : "♡ 想喝"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
