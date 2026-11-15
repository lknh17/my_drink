import type {
  CoffeeOriginRegionSpec,
  CoffeeProcessMeta,
  CoffeeSpeciesMeta,
  CoffeeVarietalMeta,
} from "../types";

export const coffeeSpecies: CoffeeSpeciesMeta[] = [
  { id: "arabica", name: "阿拉比卡", latinName: "Coffea arabica", chromosomes: "四倍体，2n=44", elevationBand: "约 900–2400m", caffeinePct: "约 0.8%–1.5%", sugarAndLipidNote: "蔗糖与脂质较高，芳香前体丰富", flavorCharacter: "花果、柑橘与细致酸甜，风土辨识度最高", globalSharePct: 60 },
  { id: "canephora-robusta", name: "卡内弗拉（罗布斯塔）", latinName: "Coffea canephora", chromosomes: "二倍体，2n=22", elevationBand: "约 0–1000m", caffeinePct: "约 1.7%–3.5%", sugarAndLipidNote: "糖脂较低，绿原酸与可溶固形物高", flavorCharacter: "厚重、木质、可可与强苦感，油脂充沛", globalSharePct: 39 },
  { id: "liberica", name: "利比里卡", latinName: "Coffea liberica", chromosomes: "二倍体，2n=22", elevationBand: "约 0–1200m", caffeinePct: "约 1.2%–1.7%", sugarAndLipidNote: "巨型果实、厚果皮，芳香谱独特", flavorCharacter: "菠萝蜜、木香、烟熏与成熟热带果", globalSharePct: 1 },
];

export const coffeeVarietals: CoffeeVarietalMeta[] = [
  { id: "typica", name: "铁皮卡", englishName: "Typica", lineageGroup: "typica-bourbon", geneticOrigin: "也门古老阿拉比卡经印度、爪哇传播的基础谱系", elevationRequirement: "1200–2100m，偏好冷凉高地", beanSizeAndShape: "修长舟形，中央沟较直", yieldVsQuality: "产量低、易感叶锈病，杯质优雅", signatureNotes: ["红糖", "柑橘", "红茶"], storySummary: "现代多数栽培种的祖型之一；蓝山、科纳与云南老种皆保留其清雅骨架。", representativeBeanIds: ["coffee-yunnan-baoshan-typica", "coffee-jamaica-blue-mountain", "coffee-hawaii-kona"] },
  { id: "bourbon", name: "红／黄／粉红波旁", englishName: "Red, Yellow & Pink Bourbon", lineageGroup: "typica-bourbon", geneticOrigin: "也门种群经留尼汪岛选择；粉红波旁常被认为具有埃塞血缘", elevationRequirement: "1300–2100m", beanSizeAndShape: "圆润饱满，颜色突变型多样", yieldVsQuality: "产量中低，高甜且酸质圆润", signatureNotes: ["蔗糖", "红果", "花香"], storySummary: "红、黄果色突变塑造不同糖酸表达；粉红型以番石榴与玫瑰般香气著称。", representativeBeanIds: ["coffee-colombia-pink-bourbon-anaerobic", "coffee-brazil-rainha-yellow-bourbon"] },
  { id: "heirloom", name: "埃塞原生古优种 74110／74158", englishName: "Ethiopian Landrace 74110 / 74158", lineageGroup: "ethiopian-landrace", geneticOrigin: "埃塞俄比亚野生与地方种群；1970年代吉马研究中心选育编号", elevationRequirement: "1750–2400m", beanSizeAndShape: "小至中粒，形态高度多样", yieldVsQuality: "适应高地、部分抗病，香气复杂", signatureNotes: ["茉莉", "柠檬", "蓝莓"], storySummary: "并非单一“原生种”，而是庞大遗传库；74110、74158兼顾杯质与抗CBD能力。", representativeBeanIds: ["coffee-ethiopia-gedeb-natural", "coffee-yirgacheffe-konga-washed"] },
  { id: "gesha", name: "瑰夏", englishName: "Gesha / Geisha", lineageGroup: "ethiopian-landrace", geneticOrigin: "埃塞俄比亚戈里森林，经肯尼亚、哥斯达黎加抵达巴拿马", elevationRequirement: "1500–2200m，冷凉与遮荫环境最佳", beanSizeAndShape: "细长大粒，枝叶修长", yieldVsQuality: "产量低且娇弱，顶级批次香气冠绝", signatureNotes: ["茉莉", "佛手柑", "白桃"], storySummary: "2004年巴拿马竞标令其成名；绿色叶尖谱系尤其以茶感和花香的透明度见长。", representativeBeanIds: ["coffee-panama-gesha-washed", "coffee-panama-esmeralda-natural", "coffee-yunnan-baoshan-gesha"] },
  { id: "sl28-sl34", name: "肯尼亚 SL28 与 SL34", englishName: "SL28 & SL34", lineageGroup: "typica-bourbon", geneticOrigin: "1930年代 Scott Laboratories 为肯尼亚高地筛选", elevationRequirement: "1500–2200m", beanSizeAndShape: "大粒、密度高，SL28枝叶具抗旱性", yieldVsQuality: "产量中等，易感病但酸质卓越", signatureNotes: ["黑加仑", "西柚", "番茄"], storySummary: "配合肯式双发酵水洗，形成磷酸般鲜明、果汁感丰沛的东非经典结构。", representativeBeanIds: ["coffee-kenya-nyeri-sl28"] },
  { id: "pacamara", name: "帕卡马拉", englishName: "Pacamara", lineageGroup: "hybrid-introgressed", geneticOrigin: "萨尔瓦多 Pacas 与巨豆 Maragogipe 人工杂交", elevationRequirement: "1400–2000m", beanSizeAndShape: "极大象豆，筛网常达19目以上", yieldVsQuality: "产量不稳，成熟不齐，精品潜力极高", signatureNotes: ["橙花", "热带果", "奶油"], storySummary: "巨型豆需细致烘焙导热；高地批次兼具帕卡斯甜感与象豆奔放花果香。", representativeBeanIds: ["coffee-guatemala-el-injerto-pacamara"] },
  { id: "caturra-catuai", name: "卡杜拉／卡杜艾", englishName: "Caturra / Catuai", lineageGroup: "typica-bourbon", geneticOrigin: "卡杜拉为波旁矮化突变；卡杜艾为其与 Mundo Novo 杂交", elevationRequirement: "1000–1900m", beanSizeAndShape: "中粒，树型紧凑便于密植", yieldVsQuality: "高产、管理友好，成熟高地批次甜净", signatureNotes: ["橙子", "焦糖", "核果"], storySummary: "拉美现代庄园的骨干品种，以紧凑株型提高密植效率，也为精细处理提供稳定原料。", representativeBeanIds: ["coffee-costa-rica-musician-honey", "coffee-elida-torre-typica"] },
  { id: "laurina", name: "尖身波旁", englishName: "Laurina / Bourbon Pointu", lineageGroup: "typica-bourbon", geneticOrigin: "留尼汪岛波旁自然矮化低因突变", elevationRequirement: "900–1600m", beanSizeAndShape: "两端尖、豆体细小", yieldVsQuality: "极低产且娇弱，天然咖啡因约普通阿拉比卡一半", signatureNotes: ["橙花", "甘蔗", "细茶"], storySummary: "不是后制脱因豆；其低咖啡因与细腻甜香来自遗传突变，稀少而昂贵。", representativeBeanIds: [] },
  { id: "catimor", name: "卡蒂姆", englishName: "Catimor", lineageGroup: "hybrid-introgressed", geneticOrigin: "卡杜拉与帝汶杂交种，带卡内弗拉抗锈病基因", elevationRequirement: "800–1700m，精细栽培宜更高海拔", beanSizeAndShape: "中粒、株型紧凑", yieldVsQuality: "高产抗病；成熟采收与后制可显著提升杯质", signatureNotes: ["坚果", "黑糖", "李子"], storySummary: "云南产业主力；“品种决定低质”是误解，高海拔全熟采收已能呈现干净果甜。", representativeBeanIds: ["coffee-yunnan-menglian-honey", "coffee-yunnan-lancang-double-anaerobic"] },
  { id: "sarchimor", name: "萨奇姆", englishName: "Sarchimor", lineageGroup: "hybrid-introgressed", geneticOrigin: "Villa Sarchi 与帝汶杂交种结合", elevationRequirement: "1000–1800m", beanSizeAndShape: "中至大粒，树势强健", yieldVsQuality: "抗锈病、高产，精选系具良好酸甜", signatureNotes: ["柑橘", "巧克力", "香料"], storySummary: "兼顾韧性与精品潜力的新秀，在云南临沧等新产区成为气候适应型替代选择。", representativeBeanIds: ["coffee-yunnan-lincang-sarchimor"] },
];

export const coffeeProcesses: CoffeeProcessMeta[] = [
  ["washed", "水洗", "Washed", ["羊皮纸"], 96, 15, 72, "7–14天", "脱皮后发酵洗净果胶，突出酸质与产地透明度。"],
  ["natural", "非洲高架床日晒", "Natural", ["果皮", "果肉", "果胶", "羊皮纸"], 70, 78, 92, "18–30天", "整果薄铺翻晒，糖分与酯香缓慢渗入种子。"],
  ["honey", "黄／红／黑蜜处理", "Honey", ["部分果胶", "羊皮纸"], 82, 52, 94, "12–25天", "依果胶保留量和翻晒频率形成由明亮至浓甜的谱系。"],
  ["anaerobic", "密封厌氧发酵", "Anaerobic", ["可为整果或带胶豆"], 76, 88, 91, "2–8天", "密闭控温控压，乳酸菌与酵母重塑酸质和酯香。"],
  ["carbonic-maceration", "二氧化碳整果浸渍", "Carbonic Maceration", ["完整果皮", "果肉", "果胶"], 80, 91, 90, "3–10天", "充入二氧化碳触发整果细胞内发酵，香气奔放而酒感清晰。"],
  ["thermal-shock", "双重厌氧热冲击", "Double Anaerobic Thermal Shock", ["脱皮带胶豆"], 84, 95, 95, "4–9天", "两阶段厌氧后以冷热水快速改变细胞通透性并锁定挥发香。"],
  ["wet-hulled", "印尼传统湿刨法", "Giling Basah", ["湿豆提前去羊皮纸"], 58, 66, 68, "5–10天", "约30%含水率即刨壳再晒，形成低酸、草本与厚重体感。"],
  ["swiss-water-decaf", "瑞士水无化学低因", "Swiss Water Decaf", ["先完成常规处理"], 88, 18, 78, "约10小时脱因", "以生豆风味饱和水和碳滤选择性移除咖啡因，不用有机溶剂。"],
].map(([id, name, englishName, retainedFruitLayers, clarityScore, fermentationFunkScore, sweetnessScore, typicalDays, note]) => ({
  id: id as CoffeeProcessMeta["id"], name: `${name}处理法`, englishName: englishName as string,
  mucilageHandling: note as string, fermentationMechanism: note as string,
  cupClarityVsFunk: `洁净度 ${clarityScore} / 发酵张力 ${fermentationFunkScore}`,
  flavorSignature: note as string, accentHex: "#8A5A3B", retainedFruitLayers: retainedFruitLayers as string[],
  clarityScore: clarityScore as number, fermentationFunkScore: fermentationFunkScore as number,
  sweetnessScore: sweetnessScore as number, typicalDays: typicalDays as string,
}));

type OriginSeed = [string, CoffeeOriginRegionSpec["zone"], string, string, [number, number], string, string, string[], string, string, string];
const worldOrigins: OriginSeed[] = [
  ["origin-ethiopia-yirgacheffe", "east-africa", "埃塞俄比亚·耶加雪菲", "埃塞俄比亚盖德奥", [38.205, 6.162], "1770–2300m", "10月–次年2月", ["Heirloom 74110/74158"], "茉莉、佛手柑、柠檬茶", "火山红壤、昼夜温差与林下小农地块", "水洗站发酵与高架床日晒"],
  ["origin-ethiopia-sidamo-guji", "east-africa", "埃塞西达摩与古吉罕贝拉", "埃塞俄比亚奥罗米亚", [38.35, 5.77], "1800–2350m", "10月–次年2月", ["Heirloom", "74110"], "蓝莓、桃、紫花与热带果", "裂谷高原红壤与密集遮荫林", "整果非洲床慢晒"],
  ["origin-kenya-nyeri", "east-africa", "肯尼亚涅里·肯尼亚山", "肯尼亚中部高原", [36.951, -0.421], "1600–2100m", "10月–12月", ["SL28", "SL34"], "黑加仑、红西柚、番茄与黑糖", "富磷火山红土、赤道高海拔", "肯式双发酵水洗"],
  ["origin-rwanda-huye", "east-africa", "卢旺达千丘波旁", "卢旺达南部省", [29.74, -2.6], "1600–2200m", "3月–7月", ["Red Bourbon"], "红李、橙花、焦糖与红茶", "起伏丘陵与火山湖湿润气候", "合作社水洗与高架床干燥"],
  ["origin-panama-boquete", "central-south-america", "巴拿马波奎特与沃肯火山", "巴拿马奇里基省", [-82.432, 8.779], "1500–2100m", "12月–3月", ["Gesha", "Catuai"], "茉莉、佛手柑、白桃与蜂蜜", "巴鲁火山土与两洋云雾", "精密水洗、日晒与厌氧"],
  ["origin-colombia-huila", "central-south-america", "哥伦比亚慧兰与考卡", "哥伦比亚西南安第斯", [-75.984, 1.992], "1500–2200m", "全年分段采收", ["Pink Bourbon", "Caturra"], "红果、焦糖、热带果与花香", "三山脉火山灰土与多变坡向", "小农水洗及实验发酵"],
  ["origin-costa-rica-tarrazu", "central-south-america", "哥斯达黎加塔拉珠", "哥斯达黎加圣何塞省", [-84.12, 9.65], "1200–1900m", "11月–3月", ["Caturra", "Catuai"], "柑橘、核果、蜂蜜与可可", "火山土、干湿季分明", "微型处理厂蜜处理"],
  ["origin-guatemala-antigua", "central-south-america", "危地马拉安提瓜火山谷", "危地马拉萨卡特佩克斯", [-90.734, 14.559], "1400–1900m", "12月–3月", ["Bourbon", "Pacamara"], "橙皮、黑巧、香料与烟熏", "三火山环抱、浮石土保湿", "完全水洗与晒场干燥"],
  ["origin-brazil-minas-cerrado", "central-south-america", "巴西喜拉多与南米纳斯", "巴西米纳斯吉拉斯", [-46.99, -18.95], "900–1400m", "5月–9月", ["Yellow Bourbon", "Catuai"], "榛果、巧克力、黄糖与莓果", "旱季稳定、缓坡机械化庄园", "果肉日晒与整果日晒"],
  ["origin-yemen-haraz-matari", "island-terroir", "也门哈拉兹／马塔里古老梯田", "也门西部高地", [43.9, 15.12], "1400–2400m", "10月–1月", ["Ancient Yemen Landraces"], "干果、可可、红酒与香料", "干旱石砌梯田、极低降雨", "庭院整果日晒"],
  ["origin-sumatra-lintong", "island-terroir", "印尼苏门答腊多巴湖林东", "印度尼西亚北苏门答腊", [98.865, 2.275], "1200–1650m", "9月–次年4月", ["Ateng", "S795"], "雪松、草本、黑巧与香料", "火山口湖高湿雨林", "传统湿刨法"],
  ["origin-jamaica-kona-island", "island-terroir", "牙买加蓝山与夏威夷科纳", "牙买加／美国夏威夷", [-76.578, 18.042], "600–1700m", "8月–次年2月", ["Typica"], "榛果、牛奶巧克力、蔗糖", "海洋信风与火山坡云雾", "洁净水洗与日晒干燥"],
];

export const coffeeOrigins: CoffeeOriginRegionSpec[] = worldOrigins.map(([id, zone, name, countryOrProvince, coord, elevationRange, harvestMonths, dominantVarietals, flavorProfile, soilAndMicroclimate, processingTradition]) => ({
  id, zone, name, countryOrProvince, coord, elevationRange, harvestMonths, dominantVarietals, flavorProfile,
  latitudeBand: `${Math.abs(coord[1]).toFixed(2)}°${coord[1] >= 0 ? "N" : "S"} · 世界咖啡带`, isChinaTerroir: false,
  soilAndMicroclimate, processingTradition, wiki: name.split("·")[0], query: `${name} specialty coffee origin`,
  photoUrl: `/photos/${id}.jpg`,
})).concat([
  ["origin-yunnan-baoshan", "云南保山潞江坝·高黎贡山东麓", "云南省保山市", "yn", [98.89, 24.92], "1200–1680m", ["Typica", "Gesha"], "乌梅、红糖、滇红茶", "怒江干热河谷与高黎贡山冷风形成大昼夜温差"],
  ["origin-yunnan-menglian", "云南普洱孟连·南垒河高海拔庄园带", "云南省普洱市", "yn", [99.58, 22.33], "1300–1820m", ["Catimor", "Bourbon"], "红李、酒香、焦糖", "亚热带山地雨林与庄园遮荫系统"],
  ["origin-yunnan-simao-lancang", "云南普洱思茅与澜沧林下生态区", "云南省普洱市", "yn", [100.97, 22.78], "1100–1700m", ["Catimor", "Sarchimor"], "热带果、黑糖、普洱茶", "澜沧江水系林下复合种植"],
  ["origin-yunnan-lincang", "云南临沧镇康与沧源云雾带", "云南省临沧市", "yn", [99.21, 23.88], "1300–1900m", ["Sarchimor", "Catimor"], "柑橘、可可、香料", "佤山云雾与红壤坡地"],
  ["origin-yunnan-dehong", "云南德宏芒市与瑞丽热带雨林带", "云南省德宏州", "yn", [98.58, 24.44], "900–1500m", ["Catimor", "Bourbon"], "坚果、黄糖、熟果", "低纬季风雨林、湿热河谷"],
  ["origin-yunnan-zhukula", "云南大理宾川·朱苦拉1892百年古咖啡林", "云南省大理州", "yn", [100.89, 26.15], "1400–1750m", ["Typica"], "核桃、红糖、橘皮与老树茶韵", "金沙江干热河谷中的百年荫蔽古林"],
  ["origin-hainan-xinglong", "海南万宁兴隆·华侨中粒种罗布斯塔祖庭", "海南省万宁市", "hi", [110.20, 18.75], "20–600m", ["Canephora"], "烤谷物、可可、焦糖与厚油脂", "热带海洋季风与火山砖红壤"],
  ["origin-taiwan-alishan", "台湾嘉义阿里山·北回归线高海拔精品庄园", "台湾嘉义县", "tw", [120.75, 23.47], "1000–1600m", ["Gesha", "Typica"], "白花、乌龙、柑橘与蜂蜜", "高山云雾、陡坡与显著昼夜温差"],
].map(([id, name, countryOrProvince, province, coord, elevationRange, dominantVarietals, flavorProfile, soilAndMicroclimate]) => ({
  id: id as string, zone: "yunnan-asia" as const, name: name as string, countryOrProvince: countryOrProvince as string,
  province: province as CoffeeOriginRegionSpec["province"], coord: coord as [number, number], elevationRange: elevationRange as string,
  dominantVarietals: dominantVarietals as string[], flavorProfile: flavorProfile as string, soilAndMicroclimate: soilAndMicroclimate as string,
  latitudeBand: "中国精品咖啡微域", harvestMonths: "11月–次年3月", processingTradition: "水洗、日晒、蜜处理与庄园实验发酵",
  isChinaTerroir: true, defaultZoom: 11, wiki: name as string, query: `${name} 咖啡庄园`,
  photoUrl: `/photos/${id}.jpg`,
})));
