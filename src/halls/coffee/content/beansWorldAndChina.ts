import { COFFEE_PREVIEW_SPECIMENS } from "../content";
import type {
  BrewMethodId,
  CoffeeBeanMonograph,
  CoffeeProcessId,
  CoffeePreviewSpecimen,
  RoastLevelId,
} from "../types";

const originForLegacy: Record<string, string> = {
  "coffee-panama-gesha-washed": "origin-panama-boquete",
  "coffee-ethiopia-gedeb-natural": "origin-ethiopia-yirgacheffe",
  "coffee-kenya-nyeri-sl28": "origin-kenya-nyeri",
  "coffee-yunnan-baoshan-typica": "origin-yunnan-baoshan",
  "coffee-yunnan-menglian-honey": "origin-yunnan-menglian",
  "coffee-colombia-pink-bourbon-anaerobic": "origin-colombia-huila",
  "coffee-sumatra-mandheling-wethulled": "origin-sumatra-lintong",
  "coffee-soe-espresso-benchmark": "origin-brazil-minas-cerrado",
};
const varietalForLegacy: Record<string, string> = {
  "coffee-panama-gesha-washed": "gesha",
  "coffee-ethiopia-gedeb-natural": "heirloom",
  "coffee-kenya-nyeri-sl28": "sl28-sl34",
  "coffee-yunnan-baoshan-typica": "typica",
  "coffee-yunnan-menglian-honey": "catimor",
  "coffee-colombia-pink-bourbon-anaerobic": "bourbon",
  "coffee-sumatra-mandheling-wethulled": "typica",
  "coffee-soe-espresso-benchmark": "bourbon",
};

const scholarlyEssay = (specimen: CoffeePreviewSpecimen) =>
  `${specimen.title}的价值不只在醒目的香气标签，而在品种、成熟度、微气候与后制共同形成的可追溯结构。杯测时应从热、中、冷三段观察酸质由明亮转为圆润、甜感是否持续，以及余韵有无干涩或发酵瑕疵；烘焙则须依豆密度调节热量与发展率，避免以焦糖化掩盖产地。冲煮建议先用标准粉水比建立基线，再以研磨和水温微调流速。这样的记录方法能把“好喝”转化为可复验的感官证据，也尊重农场采收与处理环节的真实劳动。`;

const legacyBeans: CoffeeBeanMonograph[] = COFFEE_PREVIEW_SPECIMENS.map((specimen) => ({
  ...specimen,
  originId: originForLegacy[specimen.id],
  varietalId: varietalForLegacy[specimen.id],
  categoryRole: specimen.id === "coffee-soe-espresso-benchmark" ? "classic-blend" : "single-origin-filter",
  densityAndMoisture: "生豆密度约 690–770g/L；入仓含水率 10.2%–11.2%，水活度 0.48–0.58",
  recommendedBrewMethodIds: specimen.id === "coffee-soe-espresso-benchmark" ? ["moka-pot", "aeropress"] : ["hario-v60", "kalita-wave"],
  essay: scholarlyEssay(specimen),
}));

type BeanSeed = {
  id: string; title: string; originId: string; originLabel: string; coord: [number, number];
  varietalId: string; varietal: string; process: CoffeeProcessId; processLabel: string;
  roast: RoastLevelId; notes: string[]; category?: CoffeeBeanMonograph["categoryRole"];
  methods?: BrewMethodId[]; wiki?: string; query: string;
};

const seeds: BeanSeed[] = [
  { id: "coffee-panama-esmeralda-natural", title: "巴拿马翡翠庄园红标日晒瑰夏", originId: "origin-panama-boquete", originLabel: "巴拿马波奎特·哈拉米约", coord: [-82.42, 8.79], varietalId: "gesha", varietal: "绿顶瑰夏 Gesha", process: "natural", processLabel: "全熟果高架床慢晒", roast: "light", notes: ["茉莉", "草莓", "白桃", "佛手柑"], query: "Esmeralda Natural Geisha coffee" },
  { id: "coffee-elida-torre-typica", title: "巴拿马艾丽达庄园 Torre 高海拔铁皮卡", originId: "origin-panama-boquete", originLabel: "巴拿马沃肯·巴鲁火山", coord: [-82.61, 8.81], varietalId: "typica", varietal: "铁皮卡 Typica", process: "natural", processLabel: "云雾林整果日晒", roast: "light", notes: ["橙花", "红莓", "可可碎", "红茶"], query: "Elida Estate Torre Typica coffee" },
  { id: "coffee-yirgacheffe-konga-washed", title: "耶加雪菲孔加合作社水洗 G1", originId: "origin-ethiopia-yirgacheffe", originLabel: "埃塞俄比亚盖德奥·孔加", coord: [38.21, 6.13], varietalId: "heirloom", varietal: "74110/74158 原生种", process: "washed", processLabel: "传统水洗与高架床干燥", roast: "light", notes: ["茉莉", "柠檬", "白茶", "蜂蜜"], query: "Yirgacheffe Konga washed G1" },
  { id: "coffee-guji-hambela-huakuai-8", title: "古吉罕贝拉「花魁」8.0 日晒批次", originId: "origin-ethiopia-sidamo-guji", originLabel: "埃塞俄比亚古吉·罕贝拉", coord: [38.58, 5.76], varietalId: "heirloom", varietal: "古吉原生种", process: "natural", processLabel: "全红果非洲床精制日晒", roast: "light", notes: ["草莓", "百香果", "紫罗兰", "芒果"], query: "Guji Hambela Hua Kui coffee" },
  { id: "coffee-rwanda-huye-bourbon", title: "卢旺达 Huye Mountain 红波旁水洗", originId: "origin-rwanda-huye", originLabel: "卢旺达南部·Huye 山区", coord: [29.74, -2.6], varietalId: "bourbon", varietal: "红波旁", process: "washed", processLabel: "合作社分级水洗", roast: "light-medium", notes: ["红李", "橙花", "焦糖", "红茶"], query: "Rwanda Huye Mountain Bourbon" },
  { id: "coffee-colombia-el-paraiso-peach", title: "哥伦比亚天堂庄园双重厌氧水蜜桃", originId: "origin-colombia-huila", originLabel: "哥伦比亚考卡·El Paraíso", coord: [-76.75, 2.45], varietalId: "caturra-catuai", varietal: "卡杜拉", process: "thermal-shock", processLabel: "双重厌氧与冷热冲击", roast: "light", notes: ["水蜜桃", "乌龙", "荔枝", "酸奶"], query: "El Paraiso double anaerobic peach coffee" },
  { id: "coffee-costa-rica-musician-honey", title: "哥斯达黎加音乐家系列巴赫／莫扎特葡萄干蜜处理", originId: "origin-costa-rica-tarrazu", originLabel: "哥斯达黎加塔拉珠微型处理厂", coord: [-84.12, 9.65], varietalId: "caturra-catuai", varietal: "卡杜拉／卡杜艾", process: "honey", processLabel: "葡萄干式厌氧红蜜", roast: "light-medium", notes: ["葡萄干", "玫瑰", "蜂蜜", "可可"], query: "Costa Rica Musician Bach Mozart coffee" },
  { id: "coffee-guatemala-el-injerto-pacamara", title: "危地马拉茵赫特庄园帕卡马拉", originId: "origin-guatemala-antigua", originLabel: "危地马拉韦韦特南果·El Injerto", coord: [-91.49, 15.48], varietalId: "pacamara", varietal: "帕卡马拉", process: "washed", processLabel: "完全水洗与棚架慢干", roast: "light-medium", notes: ["橙花", "菠萝", "黑巧", "奶油"], query: "El Injerto Pacamara coffee" },
  { id: "coffee-brazil-rainha-yellow-bourbon", title: "巴西皇后庄园黄波旁日晒", originId: "origin-brazil-minas-cerrado", originLabel: "巴西南米纳斯·Fazenda Rainha", coord: [-46.61, -21.9], varietalId: "bourbon", varietal: "黄波旁", process: "natural", processLabel: "庄园露台整果日晒", roast: "medium", notes: ["榛果", "黄糖", "杏脯", "牛奶巧克力"], query: "Fazenda Rainha Yellow Bourbon" },
  { id: "coffee-yemen-mocha-matari", title: "也门摩卡马塔里古老梯田日晒", originId: "origin-yemen-haraz-matari", originLabel: "也门巴尼马塔尔石砌梯田", coord: [44.01, 15.22], varietalId: "typica", varietal: "也门古老地方种", process: "natural", processLabel: "屋顶整果传统日晒", roast: "medium", notes: ["葡萄干", "可可", "红酒", "小豆蔻"], query: "Yemen Mocha Matari coffee" },
  { id: "coffee-sumatra-aged-mandheling", title: "苏门答腊陈年曼特宁", originId: "origin-sumatra-lintong", originLabel: "印尼林东·仓储熟成批次", coord: [98.86, 2.27], varietalId: "typica", varietal: "Ateng／S795", process: "wet-hulled", processLabel: "湿刨后恒湿陈年三年", roast: "medium-dark", notes: ["雪松", "烟草", "黑可可", "香料"], query: "Aged Sumatra Mandheling coffee" },
  { id: "coffee-jamaica-blue-mountain", title: "牙买加蓝山一号水洗铁皮卡", originId: "origin-jamaica-kona-island", originLabel: "牙买加蓝山法定产区", coord: [-76.58, 18.04], varietalId: "typica", varietal: "蓝山铁皮卡", process: "washed", processLabel: "洁净水洗与木桶装运", roast: "medium", notes: ["榛果", "柑橘", "牛奶巧克力", "蔗糖"], query: "Jamaica Blue Mountain No 1 coffee" },
  { id: "coffee-hawaii-kona", title: "夏威夷科纳 Extra Fancy 铁皮卡", originId: "origin-jamaica-kona-island", originLabel: "夏威夷大岛科纳火山坡", coord: [-155.93, 19.54], varietalId: "typica", varietal: "科纳铁皮卡", process: "washed", processLabel: "手采水洗 Extra Fancy 分级", roast: "medium", notes: ["橙皮", "杏仁", "焦糖", "可可"], query: "Hawaii Kona Extra Fancy coffee" },
  { id: "coffee-yunnan-baoshan-gesha", title: "保山百花岭水洗瑰夏", originId: "origin-yunnan-baoshan", originLabel: "云南保山·高黎贡山百花岭", coord: [98.89, 24.92], varietalId: "gesha", varietal: "瑰夏", process: "washed", processLabel: "山泉水洗与遮阴慢干", roast: "light", notes: ["栀子花", "柚子", "青梅", "滇绿茶"], query: "保山 百花岭 水洗 瑰夏 咖啡" },
  { id: "coffee-yunnan-lancang-double-anaerobic", title: "普洱澜沧双重厌氧日晒", originId: "origin-yunnan-simao-lancang", originLabel: "云南普洱·澜沧林下庄园", coord: [100.97, 22.78], varietalId: "catimor", varietal: "精品卡蒂姆", process: "anaerobic", processLabel: "双阶段厌氧整果日晒", roast: "light-medium", notes: ["黑李", "酒酿", "菠萝", "黑糖"], query: "云南 澜沧 双重厌氧 日晒 咖啡" },
  { id: "coffee-yunnan-lincang-sarchimor", title: "临沧秋珀庄园萨奇姆水洗", originId: "origin-yunnan-lincang", originLabel: "云南临沧·镇康云雾庄园", coord: [99.21, 23.88], varietalId: "sarchimor", varietal: "萨奇姆", process: "washed", processLabel: "低温水洗与棚架干燥", roast: "light-medium", notes: ["蜜橘", "可可", "红糖", "肉桂"], query: "临沧 秋珀庄园 萨奇姆 咖啡" },
  { id: "coffee-yunnan-zhukula-1892", title: "大理朱苦拉 1892 百年古树铁皮卡", originId: "origin-yunnan-zhukula", originLabel: "云南大理宾川·朱苦拉古咖啡林", coord: [100.89, 26.15], varietalId: "typica", varietal: "百年铁皮卡", process: "natural", processLabel: "林下手采与传统日晒", roast: "medium", notes: ["核桃", "橘皮", "红糖", "老树茶"], query: "朱苦拉 1892 古树咖啡" },
  { id: "coffee-hainan-xinglong-robusta", title: "海南兴隆传统炭烧风味中粒种", originId: "origin-hainan-xinglong", originLabel: "海南万宁·兴隆华侨农场", coord: [110.2, 18.75], varietalId: "catimor", varietal: "卡内弗拉中粒种", process: "natural", processLabel: "整果日晒与传统深烘", roast: "dark", notes: ["烤谷物", "焦糖", "可可", "烟香"], query: "海南 兴隆 咖啡 中粒种" },
  { id: "coffee-taiwan-alishan-gesha", title: "台湾阿里山邹筑园日晒艺伎", originId: "origin-taiwan-alishan", originLabel: "台湾嘉义·阿里山邹筑园", coord: [120.75, 23.47], varietalId: "gesha", varietal: "艺伎 Gesha", process: "natural", processLabel: "高山全熟果精制日晒", roast: "light", notes: ["白花", "乌龙", "柑橘", "蜂蜜"], query: "阿里山 邹筑园 日晒 艺伎" },
  { id: "coffee-yunnan-dehong-bourbon", title: "德宏芒市雨林黄波旁蜜处理", originId: "origin-yunnan-dehong", originLabel: "云南德宏·芒市雨林坡地", coord: [98.58, 24.44], varietalId: "bourbon", varietal: "黄波旁", process: "honey", processLabel: "黄蜜遮阴棚慢干", roast: "light-medium", notes: ["黄桃", "蜂蜜", "坚果", "红茶"], query: "德宏 芒市 黄波旁 蜜处理 咖啡" },
  { id: "coffee-espresso-classic-dark-blend", title: "经典意式黑巧榛果拼配", originId: "origin-brazil-minas-cerrado", originLabel: "巴西黄波旁×危地马拉波旁", coord: [-46.99, -18.95], varietalId: "bourbon", varietal: "波旁系拼配", process: "natural", processLabel: "日晒与水洗后拼配", roast: "medium-dark", notes: ["黑巧", "榛果", "焦糖", "厚油脂"], category: "classic-blend", methods: ["moka-pot", "aeropress"], query: "classic Italian espresso blend beans" },
  { id: "coffee-espresso-milan-floral-blend", title: "北意米兰花香中烘拼配", originId: "origin-brazil-minas-cerrado", originLabel: "巴西×埃塞×中美洲", coord: [9.19, 45.46], varietalId: "bourbon", varietal: "波旁与埃塞原生种拼配", process: "washed", processLabel: "多产区烘后拼配", roast: "medium", notes: ["橙花", "杏仁", "牛奶巧克力", "柑橘"], category: "classic-blend", methods: ["aeropress", "moka-pot"], query: "Milan medium roast floral espresso blend" },
  { id: "coffee-melbourne-fruity-soe", title: "墨尔本花果奶咖 SOE 标杆", originId: "origin-colombia-huila", originLabel: "哥伦比亚慧兰单一产地浓缩", coord: [144.96, -37.81], varietalId: "bourbon", varietal: "粉红波旁", process: "washed", processLabel: "水洗单一产地浓缩", roast: "light-medium", notes: ["红莓", "焦糖", "橙花", "奶油"], category: "soe-espresso", methods: ["aeropress"], query: "Melbourne fruity SOE espresso milk coffee" },
  { id: "coffee-colombia-swiss-water-decaf", title: "哥伦比亚瑞士水处理无因精品豆", originId: "origin-colombia-huila", originLabel: "哥伦比亚慧兰·瑞士水脱因", coord: [-75.98, 1.99], varietalId: "caturra-catuai", varietal: "卡杜拉", process: "swiss-water-decaf", processLabel: "Swiss Water 无溶剂脱因", roast: "medium", notes: ["焦糖", "苹果", "杏仁", "可可"], category: "decaf", methods: ["hario-v60", "aeropress"], query: "Colombia Swiss Water decaf specialty coffee" },
];

const createBean = (seed: BeanSeed, index: number): CoffeeBeanMonograph => {
  const isEspresso = seed.category === "classic-blend" || seed.category === "soe-espresso";
  const specimen: CoffeePreviewSpecimen = {
    id: seed.id, lotCode: `LOT #FULL-${String(index + 9).padStart(2, "0")}`, title: seed.title,
    originLabel: seed.originLabel, beltZone: seed.originId.startsWith("origin-yunnan") || seed.originId.startsWith("origin-hainan") || seed.originId.startsWith("origin-taiwan") ? "yunnan-asia" : seed.originId.includes("ethiopia") || seed.originId.includes("kenya") || seed.originId.includes("rwanda") ? "east-africa" : seed.originId.includes("sumatra") || seed.originId.includes("yemen") || seed.originId.includes("jamaica") ? "island-terroir" : "central-south-america",
    coord: seed.coord, elevationMeters: "依庄园地块约 1200–2200m", varietal: seed.varietal,
    process: seed.process, processLabel: seed.processLabel, roastLevel: seed.roast,
    roastLabel: `${seed.roast} 精准曲线`, agtronScore: seed.roast === "light" ? "Agtron #75–85" : seed.roast === "medium-dark" || seed.roast === "dark" ? "Agtron #42–58" : "Agtron #60–72",
    cremaOrLiquorHex: isEspresso ? "#4A2515" : "#A95F35", flavorNotes: seed.notes,
    sensoryRadar: { acidity: seed.roast === "light" ? 90 : 72, sweetness: 90, body: isEspresso ? 94 : 78, floralFruity: seed.roast === "light" ? 93 : 72, aftertaste: 89 },
    goldenCup: {
      brewMethod: isEspresso ? "9 bar 双份意式浓缩" : "Hario V60 三段式",
      doseGrams: isEspresso ? 18 : 15, yieldMlOrGrams: isEspresso ? 36 : 240,
      ratioLabel: isEspresso ? "1:2" : "1:16", waterTempCelsius: seed.roast === "dark" ? 88 : 92,
      grindSizeLabel: isEspresso ? "意式细研磨约 250μm" : "中细研磨约 650–750μm",
      totalTimeSec: isEspresso ? 28 : 145,
      pourStages: isEspresso ? ["0–6秒低压预浸", "6–24秒稳定9 bar萃取", "约28秒达目标液重截流"] : ["0–30秒以两倍粉重闷蒸", "30–80秒绕圈注至六成水量", "80–145秒低水位收尾并观察流速"],
    },
    tagline: `${seed.notes.slice(0, 3).join("、")}构成清晰而可追溯的产地表达。`,
    previewNote: "以标准杯测确认洁净度与甜感，再按密度、处理法和烘焙新鲜度校准研磨、水温及萃取率。",
    wiki: seed.wiki ?? seed.title, query: seed.query, photoUrl: `/photos/${seed.id}.jpg`,
  };
  return {
    ...specimen, originId: seed.originId, varietalId: seed.varietalId,
    categoryRole: seed.category ?? "single-origin-filter",
    densityAndMoisture: "生豆密度约 680–790g/L；含水率 10.0%–11.5%，水活度建议低于 0.60",
    recommendedBrewMethodIds: seed.methods ?? ["hario-v60", "kalita-wave"],
    essay: scholarlyEssay(specimen),
  };
};

export const coffeeBeans: CoffeeBeanMonograph[] = [
  ...legacyBeans,
  ...seeds.map(createBean),
];
