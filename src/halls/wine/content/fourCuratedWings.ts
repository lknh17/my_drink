import type {
  CocktailRecipeSpecimen,
  GrapeWineSpecimen,
  HuangjiuSpecimen,
  WorldSpiritSpecimen,
} from "../types";

type MediaFields = "wiki" | "query" | "photoUrl";
const withMedia = <T extends { id: string; title: string }>(
  entry: T,
  topic: string,
): T & Required<Pick<HuangjiuSpecimen, MediaFields>> => ({
  ...entry,
  wiki: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(entry.title)}`,
  query: `${entry.title} ${topic} 实物`,
  photoUrl: `/photos/${entry.id}.jpg`,
});

export const huangjiuSpecimens: HuangjiuSpecimen[] = [
  withMedia({
    id: "guyuelongshan-yuanhong", title: "绍兴古越龙山元红干型黄酒", sugarType: "dry-yuanhong" as const, sugarLabel: "干型元红 · 总糖 ≤15g/L", totalSugarGPerL: 12, originLabel: "中国 · 浙江绍兴鉴湖", province: "zj" as const,
    riceAndWater: "精白糯米、鉴湖水；淋饭酒母入缸", quAndStarter: "麦曲与绍兴酒药双边发酵", agingYears: "陶坛陈藏 3 年", abv: "15% vol", liquorColorHex: "#B86B25",
    aminoAcidUmamiNote: "糖低而氨基酸鲜味清晰，带谷物、坚果与轻微氧化香。", warmingAndServing: "12–16℃净饮；冬日可隔水温至 38℃，避免煮沸。", foodPairings: ["醉蟹", "盐水鸭", "笋干烧肉"],
    tagline: "元红是绍兴黄酒的干型基准，清瘦里藏着米曲鲜味。",
    essay: "元红因旧时坛壁涂朱而得名，是绍兴黄酒四大谱系中最干的一支。精白糯米经浸米、蒸饭，以麦曲和酒药完成糖化发酵并行的“双边发酵”，鉴湖水令口感柔净。较低残糖让谷物、麦曲、坚果和氨基酸鲜味清晰，陶坛微氧陈藏再添淡淡焦糖与氧化香。它不靠甜度讨巧，反而最适合观察绍兴酒的骨架；微温配醉蟹、笋干或咸鲜菜肴，鲜味会被彼此放大。",
  }, "黄酒"),
  withMedia({
    id: "kuaijishan-20-jiafan", title: "会稽山廿年陈花雕加饭酒", sugarType: "semi-dry-jiafan" as const, sugarLabel: "半干加饭 · 总糖 15–40g/L", totalSugarGPerL: 28, originLabel: "中国 · 浙江绍兴", province: "zj" as const,
    riceAndWater: "加量精白糯米与鉴湖水", quAndStarter: "传统麦曲、酒药与淋饭酒母", agingYears: "陶坛陈藏 20 年", abv: "15.5% vol", liquorColorHex: "#8F4A20",
    aminoAcidUmamiNote: "氨基酸鲜甜浓郁，陈年后显核桃、枣干与酱香。", warmingAndServing: "14–18℃小杯慢饮；温饮不超过 40℃。", foodPairings: ["大闸蟹", "东坡肉", "霉干菜扣肉"],
    tagline: "加饭加出丰厚酒体，二十年坛陈磨成温润花雕。",
    essay: "加饭酒在发酵时提高糯米投料，相对减少水量，因此麦汁更浓、酒体更厚，是花雕陈年的理想底酒。二十年陶坛微氧交换让鲜亮米甜转为枣干、核桃、焦糖和轻微酱陈，酒精边缘也被岁月磨圆；半干残糖与丰富氨基酸共同构成咸鲜、甘润的长尾。花雕原是坛身彩绘的礼俗称谓，后来成为陈年加饭酒的常见名片。佐大闸蟹可暖其寒凉，配东坡肉又能承接酱脂。",
  }, "黄酒"),
  withMedia({
    id: "tapai-shanniang", title: "绍兴塔牌本酒善酿半甜黄酒", sugarType: "semi-sweet-shanniang" as const, sugarLabel: "半甜善酿 · 总糖 40–100g/L", totalSugarGPerL: 68, originLabel: "中国 · 浙江绍兴", province: "zj" as const,
    riceAndWater: "糯米与部分陈年元红酒代水", quAndStarter: "麦曲、酒药；以酒抑制后段发酵", agingYears: "陶坛陈藏 5 年", abv: "14% vol", liquorColorHex: "#A95721",
    aminoAcidUmamiNote: "甜润中保留曲香鲜味，呈桂圆、蜂蜜与熟谷物。", warmingAndServing: "10–14℃净饮或微温，甜度高不宜过热。", foodPairings: ["糟鸡", "桂花鸭", "蓝纹奶酪"],
    tagline: "以陈酒代水再酿，善酿把甜润与绍兴陈香叠在一起。",
    essay: "善酿的关键是“以酒代水”：在糯米发酵体系中加入已成的元红酒，提高初始酒精度，酵母较早受抑，于是保留更多糖分。结果不是简单糖水感，而是蜂蜜、桂圆、熟米与麦曲鲜味并行，陈酒又提前带入氧化坚果气息。塔牌遵循传统冬酿节律，低温缓发有助于香气细密。半甜酒适合略凉饮，能保持甜酸边界；与糟鸡、桂花鸭或咸鲜奶酪搭配，甜度会转化为包裹感而非负担。",
  }, "黄酒"),
  withMedia({
    id: "shaoxing-xiangxue-3", title: "绍兴香雪三年陈甜型黄酒", sugarType: "sweet-xiangxue" as const, sugarLabel: "甜型香雪 · 总糖 >100g/L", totalSugarGPerL: 180, originLabel: "中国 · 浙江绍兴", province: "zj" as const,
    riceAndWater: "糯米、鉴湖水与成品糟烧", quAndStarter: "麦曲糖化，以糟烧酒抑制发酵", agingYears: "陶坛陈藏 3 年", abv: "20% vol", liquorColorHex: "#9B4B1D",
    aminoAcidUmamiNote: "糖分丰沛，伴桂圆、蜜枣、焦糖与米曲鲜香。", warmingAndServing: "8–12℃小杯甜酒式侍饮，不建议加热。", foodPairings: ["桂花糕", "酱鸭", "鹅肝"],
    tagline: "白糯米如雪，糟烧截住甜香，故名香雪。",
    essay: "香雪以白糯米“色白如雪”得名，酿造时加入绍兴糟烧酒，提高酒精并停止酵母继续耗糖，因此留下显著甜度和更高酒精。酒液琥珀浓稠，桂圆、蜜枣、蜂蜜、焦糖与米曲香交织，三年坛陈让甜味由直白转为圆润。它可视作东方米酒中的甜酒或加强酒，宜略冰、小杯慢饮，而非热饮放大酒精。搭桂花糕可做同向呼应，配酱鸭或鹅肝则借甜润包裹盐脂。",
  }, "黄酒"),
  withMedia({
    id: "jimo-miaofu-laojiu", title: "山东即墨妙府焦香大黄米老酒", sugarType: "semi-sweet-shanniang" as const, sugarLabel: "北方半甜黍米老酒", totalSugarGPerL: 65, originLabel: "中国 · 山东即墨", province: "sd" as const,
    riceAndWater: "黍米（大黄米）与崂山水系", quAndStarter: "传统麦曲，黍米煪糜焦化后发酵", agingYears: "陶坛陈藏 6 年", abv: "12% vol", liquorColorHex: "#713619",
    aminoAcidUmamiNote: "黍米焦香浓，带红枣、烤谷、酱甜与厚实鲜味。", warmingAndServing: "冬季温至 38–42℃，可加姜丝但不煮沸。", foodPairings: ["酱牛肉", "鲅鱼水饺", "烤羊肉"],
    tagline: "北方黍米与煪糜焦化，酿出不同于绍兴的深褐厚香。",
    essay: "即墨老酒不以江南糯米为主，而用北方黍米，最具辨识度的工序是“煪糜”：蒸煮时让部分米粒发生焦化和美拉德反应，为深褐酒液奠定烤谷、红枣、焦糖与轻微烟香。麦曲发酵后保留温厚甜感，酸与氨基酸鲜味支撑，不至于只剩黏甜。妙府延续这一地方路径，温饮时焦香尤其舒展。它适合酱牛肉、鲅鱼水饺等北方浓味食物，是观察黄酒如何随谷物与气候分化的鲜明样本。",
  }, "黄酒"),
  withMedia({
    id: "longyan-chenggang", title: "福建龙岩沉缸红曲甜黄酒", sugarType: "sweet-xiangxue" as const, sugarLabel: "红曲甜型沉缸酒", totalSugarGPerL: 160, originLabel: "中国 · 福建龙岩", province: "fj" as const,
    riceAndWater: "糯米与闽西山泉", quAndStarter: "古田红曲与白曲复合糖化发酵", agingYears: "酒脚沉降后陈藏 3 年", abv: "14% vol", liquorColorHex: "#8D3428",
    aminoAcidUmamiNote: "红曲带枣红色与果香，甜酸间有糯米鲜润。", warmingAndServing: "10–14℃净饮；客家宴席亦可微温。", foodPairings: ["姜母鸭", "客家酿豆腐", "红烧肉"],
    tagline: "红曲染出枣红酒色，沉缸留下闽西甜润米香。",
    essay: "龙岩沉缸酒以红曲参与糖化发酵，酒液天然呈枣红至红褐色，风格与绍兴麦曲黄酒明显不同。糯米提供丰沛糖源，红曲带来果香、曲香和柔和酸度；发酵后酒醪静置，酒脚沉入缸底，清酒在上层继续熟成，“沉缸”由此得名。甜度高却有酸鲜支撑，常见红枣、蜜饯、熟米与轻微药草气息。它嵌入客家与闽西宴饮传统，配姜母鸭、酿豆腐尤其能承接酱香和辛暖。",
  }, "黄酒"),
  withMedia({
    id: "dassai-23-junmai-daiginjo", title: "日本山口獭祭二割三分纯米大吟酿清酒", sugarType: "sake-makgeolli" as const, sugarLabel: "纯米大吟酿 · 精米步合 23%", totalSugarGPerL: 18, originLabel: "日本 · 山口县", 
    riceAndWater: "山田锦酒米，外层磨去 77%", quAndStarter: "黄麹菌制麹与清酒酵母并行复发酵", agingYears: "低温熟成后尽早饮用", abv: "16% vol", liquorColorHex: "#F2E6BC",
    aminoAcidUmamiNote: "低氨基酸、洁净轻盈，呈白桃、梨、蜜瓜与米芯甜香。", warmingAndServing: "8–12℃，白葡萄酒杯或薄口清酒杯。", foodPairings: ["刺身", "清蒸鱼", "豆腐料理"],
    tagline: "把山田锦磨至二割三分，只留下米芯最澄澈的果香。",
    essay: "“二割三分”指精米步合 23%，山田锦酒米外层含蛋白与脂质部分被大量磨除，只取淀粉纯净的米芯。黄麹菌先把淀粉转为糖，酵母同步将糖变为酒精，形成清酒特有的并行复发酵；低温长发酵保留白桃、梨、蜜瓜和清花香，口感纤细，杂味极少。它并非以陈年氧化取胜，宜新鲜、略冰饮用。与中国黄酒并置，可直观看见精米、麹菌、发酵温度如何把同为米酒导向截然不同的透明度。",
  }, "清酒"),
  withMedia({
    id: "korean-saeng-makgeolli", title: "韩国传统生米马格利浊酒", sugarType: "sake-makgeolli" as const, sugarLabel: "生马格利 · 低度浊米酒", totalSugarGPerL: 35, originLabel: "韩国 · 京畿道",
    riceAndWater: "蒸米与水，保留米粒微细悬浮物", quAndStarter: "传统 Nuruk 麦麴复合微生物发酵", agingYears: "短期鲜饮，不作长期陈藏", abv: "6% vol", liquorColorHex: "#E8E0C8",
    aminoAcidUmamiNote: "乳酸清爽，兼具米浆甜、酵母香与轻微酸奶鲜味。", warmingAndServing: "6–8℃摇匀后碗饮；开瓶须缓慢泄压。", foodPairings: ["海鲜葱饼", "泡菜煎饼", "烤五花肉"],
    tagline: "米浆、乳酸与活酵母，让低度浊酒保持乡土生命力。",
    essay: "马格利以蒸米、水和传统 Nuruk 麦麴发酵，麴中霉菌、酵母与乳酸菌共同工作，形成米浆般乳白浑浊、甜酸交错和轻微气泡。未经巴氏杀菌的“生米”版本仍有活酵母，冷藏中会持续变化，因此开瓶应缓慢泄压并轻轻摇匀沉淀。六度左右酒精使它适合大碗分享，乳酸和碳酸能切开煎饼、五花肉的油脂。与精致清酒相比，它更接近农耕社会的鲜活家酿，粗粝却有微生物层次。",
  }, "韩国米酒"),
];

export const grapeSpecimens: GrapeWineSpecimen[] = [
  withMedia({
    id: "gevrey-chambertin-vieilles-vignes", title: "法国勃艮第夜丘热夫雷-香贝丹老藤黑皮诺", styleType: "red" as const, originAppellation: "Gevrey-Chambertin AOC · Côte de Nuits", country: "法国",
    grapeVarietals: "100% 黑皮诺", climateAndSoil: "大陆性凉爽气候；石灰岩与黏土坡地", vinificationAndOak: "部分整串发酵，法国橡木桶 12–18 月，控制新桶比例", abv: "13.5% vol", liquorColorHex: "#7A1F2E",
    structureBars: { tannin: 62, acidity: 78, body: 66, sweetness: 8, oak: 48 }, aromaNotes: ["酸樱桃", "覆盆子", "紫罗兰", "林地", "香料"],
    sommelierService: { glass: "勃艮第大肚杯", tempCelsius: "15–17℃", decant: "年轻年份醒酒 30–60 分钟", pairings: ["烤鸭", "菌菇", "小牛肉"] },
    tagline: "夜丘石灰岩让黑皮诺兼具红果透明感与猎物般深度。",
    essay: "热夫雷-香贝丹位于勃艮第夜丘北段，以较坚实、深邃的黑皮诺著称。老藤根系深入石灰岩与黏土，低产果实带来酸樱桃、覆盆子、紫罗兰和香料，瓶陈后逐渐出现林地、皮革与猎物气息。部分整串发酵可添梗香和结构，法国桶只应托起而非遮盖风土。它的单宁比南部村庄更有骨架，酸度仍保持细长。用大肚杯、略低于室温侍饮，烤鸭与菌菇能回应其土壤感。",
  }, "葡萄酒"),
  withMedia({
    id: "pauillac-left-bank-blend", title: "法国波尔多左岸波雅克列级庄赤霞珠混酿", styleType: "red" as const, originAppellation: "Pauillac AOC · Médoc", country: "法国",
    grapeVarietals: "赤霞珠主导，配梅洛、品丽珠与小维多", climateAndSoil: "温和海洋性气候；深厚砾石排水土", vinificationAndOak: "分地块发酵调配，法国橡木桶 18–24 月", abv: "13.5% vol", liquorColorHex: "#5A1725",
    structureBars: { tannin: 88, acidity: 72, body: 88, sweetness: 6, oak: 78 }, aromaNotes: ["黑醋栗", "雪松", "铅笔芯", "烟草", "石墨"],
    sommelierService: { glass: "波尔多高身杯", tempCelsius: "16–18℃", decant: "年轻年份 1–2 小时", pairings: ["煎牛排", "烤羊排", "硬质奶酪"] },
    tagline: "砾石、赤霞珠与橡木桶，构成左岸最具陈年力的骨架。",
    essay: "波雅克深厚砾石排水迅速并储存日间热量，适合晚熟赤霞珠。列级庄混酿通常以其为骨架，梅洛补圆润，品丽珠添香，小维多增加颜色与辛香。年轻时黑醋栗、雪松、铅笔芯和石墨鲜明，单宁紧致；法国桶带来烘烤、香草与结构，十余年瓶陈后会转向烟草、皮革和雪茄盒。它不是单一品种炫技，而是地块、品种、桶与年份的调和艺术，配带焦壳牛排最能软化单宁。",
  }, "葡萄酒"),
  withMedia({
    id: "mosel-slate-riesling-feinherb", title: "德国摩泽尔板岩斜坡雷司令半甜白", styleType: "white" as const, originAppellation: "Mosel Qualitätswein · Steillage", country: "德国",
    grapeVarietals: "100% 雷司令", climateAndSoil: "凉爽河谷；陡峭蓝灰板岩反射并蓄热", vinificationAndOak: "低温不锈钢发酵，保留适量残糖平衡高酸", abv: "9% vol", liquorColorHex: "#E7D66A",
    structureBars: { tannin: 2, acidity: 95, body: 38, sweetness: 58, oak: 2 }, aromaNotes: ["青柠", "白桃", "青苹果", "板岩", "蜂蜜"],
    sommelierService: { glass: "雷司令白葡萄酒杯", tempCelsius: "8–10℃", decant: "无需醒酒", pairings: ["川菜", "泰式咖喱", "清蒸鱼"] },
    tagline: "陡坡板岩蓄住阳光，高酸与残糖在轻盈酒体里精确相抵。",
    essay: "摩泽尔葡萄园沿河谷陡坡展开，蓝灰板岩吸收白日热量并帮助雷司令在凉爽气候成熟。酒液酒精偏低，却有穿透力极强的青柠、青苹果与白桃香；适量残糖并非单纯求甜，而是平衡尖锐天然酸度，使入口轻盈、收尾悠长。瓶陈可发展蜂蜜、烤苹果与经典矿物油气息。半甜风格尤其擅长应对川菜辣椒和泰式香料：甜度缓和灼热，酸度清口，低酒精也不会放大辣感。",
  }, "葡萄酒"),
  withMedia({
    id: "reims-vintage-champagne", title: "法国香槟兰斯白垩土年份香槟", styleType: "sparkling" as const, originAppellation: "Champagne AOC · Montagne de Reims", country: "法国",
    grapeVarietals: "黑皮诺、霞多丽，部分莫尼耶", climateAndSoil: "凉爽大陆海洋过渡气候；深层白垩土", vinificationAndOak: "传统瓶内二次发酵，酒泥陈年不少于 36 月", abv: "12% vol", liquorColorHex: "#E4C75B",
    structureBars: { tannin: 8, acidity: 92, body: 58, sweetness: 22, oak: 25 }, aromaNotes: ["柠檬", "青苹果", "布里欧修", "粉笔", "烤榛子"],
    sommelierService: { glass: "郁金香香槟杯", tempCelsius: "8–10℃", decant: "无需醒酒，宽杯缓慢升温", pairings: ["生蚝", "炸鸡", "鱼子酱"] },
    tagline: "白垩土的酸与瓶中酒泥的面包香，共同托起细密气泡。",
    essay: "兰斯山以白垩土著称，孔隙既能排水又能储水，赋予葡萄高酸和粉笔般触感。年份香槟只在特定收成年份酿造，基酒装瓶后二次发酵，长时间与酒泥接触，逐步生成布里欧修、饼干和烤坚果香；柠檬、青苹果与矿物酸度仍保持张力。细密气泡不只是视觉装饰，也会抬升香气并放大质地。郁金香杯比狭长笛杯更利于展开层次，配生蚝或炸鸡都能以酸度和气泡清口。",
  }, "葡萄酒"),
  withMedia({
    id: "tokaji-aszu-5-puttonyos", title: "匈牙利托卡伊 5 Puttonyos 贵腐甜白", styleType: "sweet-fortified" as const, originAppellation: "Tokaj PDO · Aszú 5 Puttonyos", country: "匈牙利",
    grapeVarietals: "福尔明主导，配哈斯莱威路等", climateAndSoil: "火山土与秋季河雾促成贵腐菌", vinificationAndOak: "贵腐果粒浸渍基酒，发酵后桶陈与瓶陈", abv: "11.5% vol", liquorColorHex: "#C98A24",
    structureBars: { tannin: 2, acidity: 90, body: 72, sweetness: 96, oak: 38 }, aromaNotes: ["杏脯", "橙皮酱", "蜂蜜", "藏红花", "茶叶"],
    sommelierService: { glass: "小型甜酒杯", tempCelsius: "10–12℃", decant: "老年份可提前 20 分钟开瓶", pairings: ["鹅肝", "蓝纹奶酪", "杏仁甜点"] },
    tagline: "贵腐浓缩蜂蜜般甜度，福尔明高酸让余味仍然发亮。",
    essay: "托卡伊秋季河雾与午后干风促使贵腐菌穿透果皮，水分蒸发后糖、酸与香气同步浓缩。Aszú 果粒逐颗采收，再浸入基酒发酵；五筐等级带来丰沛甜度，却因福尔明品种高酸而不显笨重。杏脯、橙皮酱、蜂蜜、藏红花和茶叶香层层展开，火山土赋予坚实矿物尾韵。它拥有漫长陈年潜力，老酒会转向咖啡、核桃与药草。小杯略凉饮，配鹅肝或蓝纹奶酪最能呈现甜咸张力。",
  }, "葡萄酒"),
  withMedia({
    id: "ningxia-legacy-kanaan-cab-marselan", title: "中国宁夏贺兰山东麓留世 / 迦南美地赤霞珠马瑟兰", styleType: "red" as const, originAppellation: "贺兰山东麓葡萄酒产区", country: "中国", isChineseTerroir: true, province: "nx" as const,
    grapeVarietals: "赤霞珠与马瑟兰", climateAndSoil: "大陆性干旱气候；贺兰山冲积扇砾石土，昼夜温差大", vinificationAndOak: "小地块发酵，法国橡木桶熟成 14–18 月", abv: "14.5% vol", liquorColorHex: "#64192A",
    structureBars: { tannin: 82, acidity: 65, body: 86, sweetness: 8, oak: 68 }, aromaNotes: ["黑醋栗", "紫罗兰", "黑莓", "甘草", "雪松"],
    sommelierService: { glass: "波尔多杯", tempCelsius: "16–18℃", decant: "醒酒 45–90 分钟", pairings: ["盐池滩羊", "烤牛肉", "酱香炖肉"] },
    tagline: "贺兰山挡住风沙，砾石与日照塑造中国西北的浓缩红果。",
    essay: "贺兰山东麓由山体阻挡风沙，黄河灌溉与冲积扇砾石土共同构成干燥、强日照、大温差环境。赤霞珠在此形成黑醋栗、雪松与紧实单宁，马瑟兰则补入紫罗兰、黑莓色泽和圆润质地；留世、迦南美地等精品酒庄通过限产、小地块发酵与法国桶熟成，避免成熟度沦为单纯厚重。年轻酒需醒酒舒展，配盐池滩羊尤其契合。它是中国葡萄酒从“产量产区”迈向风土表达的重要坐标。",
  }, "中国葡萄酒"),
  withMedia({
    id: "yunnan-aoyun-cabernet", title: "中国云南迪庆香格里拉海拔2600m敖云赤霞珠", styleType: "red" as const, originAppellation: "云南迪庆香格里拉高山葡萄园", country: "中国", isChineseTerroir: true, province: "yn" as const,
    grapeVarietals: "赤霞珠主导，配品丽珠等波尔多品种", climateAndSoil: "海拔约 2200–2600m；高紫外线、昼夜温差与复杂山地土壤", vinificationAndOak: "多村落地块分别发酵，法国桶精细调配熟成", abv: "14.5% vol", liquorColorHex: "#59182A",
    structureBars: { tannin: 86, acidity: 74, body: 90, sweetness: 6, oak: 72 }, aromaNotes: ["黑加仑", "紫花", "雪松", "矿物", "藏香料"],
    sommelierService: { glass: "大号波尔多杯", tempCelsius: "16–18℃", decant: "醒酒 1–2 小时", pairings: ["牦牛肉", "松茸", "烤羊排"] },
    tagline: "在云层之上，赤霞珠以高原紫外线与昼夜温差写出峻峭结构。",
    essay: "敖云葡萄园散布于云南迪庆澜沧江峡谷村落，部分地块海拔接近 2600 米。强紫外线促使果皮增厚，冷凉夜晚保存酸度，复杂坡向和土壤又要求分村、分地块采收发酵。赤霞珠呈黑加仑、紫花、雪松与高山香料，成熟单宁强劲却有鲜活酸线；法国桶与细致调配用于缝合差异，而非覆盖山地气息。它与牦牛肉、松茸相配，展示中国葡萄酒在极端高海拔建立独特风土的可能。",
  }, "中国葡萄酒"),
  withMedia({
    id: "penglai-qiushan-valley-chardonnay", title: "中国山东蓬莱丘山谷海岸霞多丽干白", styleType: "white" as const, originAppellation: "山东蓬莱丘山谷葡萄酒产区", country: "中国", isChineseTerroir: true, province: "sd" as const,
    grapeVarietals: "100% 霞多丽", climateAndSoil: "渤海影响的海洋性气候；花岗岩风化土与缓坡", vinificationAndOak: "低温发酵，部分法国桶与酒泥搅拌熟成", abv: "13% vol", liquorColorHex: "#E3D172",
    structureBars: { tannin: 3, acidity: 76, body: 62, sweetness: 6, oak: 48 }, aromaNotes: ["青苹果", "柠檬", "白桃", "海风盐感", "榛子"],
    sommelierService: { glass: "霞多丽白葡萄酒杯", tempCelsius: "10–12℃", decant: "桶陈款可提前 15 分钟开瓶", pairings: ["清蒸鲈鱼", "扇贝", "烤鸡"] },
    tagline: "蓬莱海风为霞多丽保留酸度，也送来一线清咸矿物感。",
    essay: "蓬莱丘山谷受渤海调节，夏季不似内陆产区酷热，海风降低病害压力的同时延缓成熟。霞多丽在花岗岩风化土上呈青苹果、柠檬、白桃与轻微盐感；部分橡木桶发酵和酒泥搅拌增加榛子、奶油与中段厚度，却需保留海岸酸度。相比宁夏红酒的浓缩力量，这里展示中国东部冷凉海洋风土的另一面。略凉侍饮，配清蒸鱼、扇贝或烤鸡，酸线与盐鲜能够自然衔接。",
  }, "中国葡萄酒"),
];

export const spiritSpecimens: WorldSpiritSpecimen[] = [
  withMedia({
    id: "ardbeg-10", title: "阿贝 Ardbeg 10yo 艾雷重泥煤单一麦芽", category: "single-malt-whisky" as const, originRegion: "苏格兰 · 艾雷岛南岸", baseMaterial: "发芽大麦", stillType: "铜制壶式蒸馏器", caskAndAging: "波本桶熟成至少 10 年", abv: "46% vol", peatPpm: 55, liquorColorHex: "#C98A35",
    nosesAndPalate: ["篝火烟", "海盐", "柠檬", "香草", "焦油"], radar: { peatOrSmoke: 96, caskRichness: 62, floralFruity: 45, spiceWarmth: 68, finishLength: 88 }, servingNote: "郁金香威士忌杯净饮，滴入少量常温水打开柑橘与香草。",
    tagline: "艾雷海风、泥煤烟与柠檬锐度构成重烟熏的透明骨架。",
    essay: "阿贝十年以高泥煤值麦芽和艾雷岛南岸海洋气息著称，却不只是烟。波本桶带来香草、椰子和柠檬，酒厂蒸馏器颈部净化结构保留相对轻盈的新酒，让焦油、篝火和海盐之间仍有清晰果香。非冷凝过滤与自然色泽保存油脂质地，入口烟熏迅速扩张，尾段转为胡椒、咖啡与咸矿物。滴入少量水可降低酒精束缚，使柠檬和香草浮出，是理解“重泥煤也能精确而明亮”的基准。",
  }, "威士忌"),
  withMedia({
    id: "lagavulin-16", title: "乐加维林 Lagavulin 16yo 雪莉泥煤", category: "single-malt-whisky" as const, originRegion: "苏格兰 · 艾雷岛南岸", baseMaterial: "泥煤烘干发芽大麦", stillType: "铜制壶式蒸馏器，缓慢蒸馏", caskAndAging: "波本桶为主，雪莉桶参与熟成 16 年", abv: "43% vol", peatPpm: 35, liquorColorHex: "#A96324",
    nosesAndPalate: ["泥煤烟", "海藻", "葡萄干", "碘酒", "橡木"], radar: { peatOrSmoke: 88, caskRichness: 82, floralFruity: 52, spiceWarmth: 72, finishLength: 96 }, servingNote: "郁金香杯净饮或加数滴水，静置十分钟后观察烟与果干融合。",
    tagline: "缓慢蒸馏与十六年桶陈，把艾雷烟熏磨成深长海岸余韵。",
    essay: "乐加维林十六年以缓慢蒸馏和长期熟成为核心，烟熏不像阿贝般锐利，而呈厚重、油润的海藻、碘酒和篝火余烬。波本桶提供香草，雪莉桶成分带来葡萄干、无花果和坚果，使泥煤被深色果甜包裹；十六年橡木又添茶叶与辛香。入口宽厚，咸鲜中段后是极长烟尾。静置或加几滴水，烟幕会裂开，露出果干和麦芽甜，是“泥煤 × 雪莉”经典平衡的代表。",
  }, "威士忌"),
  withMedia({
    id: "macallan-18-sherry-oak", title: "麦卡伦 Macallan 18yo 雪莉橡木桶", category: "single-malt-whisky" as const, originRegion: "苏格兰 · 斯佩塞", baseMaterial: "发芽大麦", stillType: "小型铜制壶式蒸馏器", caskAndAging: "赫雷斯雪莉润桶欧洲橡木熟成 18 年", abv: "43% vol", liquorColorHex: "#8E4B20",
    nosesAndPalate: ["葡萄干", "橙皮", "肉桂", "黑巧克力", "橡木"], radar: { peatOrSmoke: 8, caskRichness: 96, floralFruity: 78, spiceWarmth: 76, finishLength: 92 }, servingNote: "郁金香杯净饮，掌温缓慢唤醒果干与香料；无需加冰。",
    tagline: "雪莉润桶欧洲橡木，把斯佩塞麦芽酿成深色果干与香料长卷。",
    essay: "麦卡伦雪莉桶十八年强调橡木供应链：欧洲橡木桶先以西班牙雪莉酒润养，再运往苏格兰长期熟成。小型蒸馏器取得较丰厚酒体，桶则赋予葡萄干、橙皮、肉桂、丁香、黑巧克力和抛光木香。它几乎没有泥煤，结构重心在果干甜、单宁和辛香的层叠。十八年时间让酒精边缘圆融，也可能带来明显木质，因此小口慢饮最合适。它是理解“桶不只是容器，而是威士忌第二原料”的典型。",
  }, "威士忌"),
  withMedia({
    id: "yamazaki-12", title: "日本山崎 Yamazaki 12yo 水楢桶单一麦芽", category: "single-malt-whisky" as const, originRegion: "日本 · 京都山崎", baseMaterial: "发芽大麦", stillType: "多种形制铜制壶式蒸馏器", caskAndAging: "美国桶、雪莉桶与日本水楢桶调和，熟成 12 年", abv: "43% vol", liquorColorHex: "#B9782D",
    nosesAndPalate: ["白桃", "柚子", "檀香", "椰香", "生姜"], radar: { peatOrSmoke: 12, caskRichness: 76, floralFruity: 88, spiceWarmth: 62, finishLength: 82 }, servingNote: "净饮观察水楢香；亦可高球，但少量水更利于辨认白桃与檀香。",
    tagline: "多样原酒与水楢木香，拼出细腻白桃、柚子和东方檀香。",
    essay: "山崎蒸馏所利用不同形制蒸馏器、发酵槽和桶型制造多样原酒，再在厂内完成精细调和。十二年版本常见白桃、柚子、蜂蜜和生姜，水楢桶参与带来檀香、沉香与椰香般东方木质气息，但并非全部酒液都由水楢独占熟成。日本湿润气候加快桶中交换，也要求控制木味。酒体细腻、果香清晰，净饮或少量加水最能看见层次。它体现日威核心不在照搬苏格兰，而在多原酒自给与调和美学。",
  }, "威士忌"),
  withMedia({
    id: "grande-champagne-xo-cognac", title: "人头马 / 轩尼诗大香槟区 XO 干邑白兰地", category: "cognac-brandy" as const, originRegion: "法国 · 干邑大香槟区", baseMaterial: "白玉霓葡萄酒", stillType: "夏朗德铜制壶式二次蒸馏器", caskAndAging: "法国利穆赞或特隆赛橡木桶长期熟成，XO 调和", abv: "40% vol", liquorColorHex: "#9A5522",
    nosesAndPalate: ["杏脯", "无花果", "紫罗兰", "肉桂", "雪茄盒"], radar: { peatOrSmoke: 2, caskRichness: 92, floralFruity: 86, spiceWarmth: 74, finishLength: 94 }, servingNote: "郁金香干邑杯 18–22℃净饮，避免过度掌温放大酒精。",
    tagline: "白垩土葡萄经夏朗德双蒸与漫长桶陈，凝成花果陈香。",
    essay: "大香槟区并非起泡酒香槟，而是干邑核心 cru，以深层白垩土和细致、长寿的生命之水著称。高酸低酒精的白玉霓基酒经夏朗德壶式二次蒸馏，截取酒心后入法国橡木桶，岁月带来杏脯、无花果、紫罗兰、肉桂和雪茄盒气息。XO 是多年份、多桶调和，品牌追求的是稳定风格而非单桶个性。郁金香杯比巨大加热杯更能聚香，室温小口饮用，可感受果味、木质和氧化陈香的连续变化。",
  }, "干邑"),
  withMedia({
    id: "foursquare-aged-rum", title: "巴巴多斯馥森 Foursquare 橡木桶陈朗姆酒", category: "rum" as const, originRegion: "巴巴多斯 · 圣菲利普", baseMaterial: "甘蔗糖蜜", stillType: "壶式与双柱式蒸馏器原酒调和", caskAndAging: "波本桶及葡萄酒桶热带熟成", abv: "46% vol", liquorColorHex: "#A65D24",
    nosesAndPalate: ["烤菠萝", "香草", "椰子", "肉豆蔻", "橡木"], radar: { peatOrSmoke: 5, caskRichness: 84, floralFruity: 76, spiceWarmth: 70, finishLength: 84 }, servingNote: "郁金香杯净饮或加一大块冰，观察热带熟成的果香与橡木。",
    tagline: "壶式厚度与柱式纯净，在巴巴多斯热带桶陈中合流。",
    essay: "馥森延续巴巴多斯朗姆传统，把壶式蒸馏的浓郁酯香与双柱式蒸馏的洁净轻盈调和，再于热带气候下以波本桶或葡萄酒桶熟成。高温加速酒液与木材交换，也提高“天使分享”，因此香草、椰子、烤菠萝、肉豆蔻和橡木来得集中。酒厂以少添加、清晰年份与桶信息受到纯饮者重视。净饮可辨甘蔗与桶的边界，加大冰则更圆润；它展示陈年朗姆并非甜味利口酒，而能拥有严谨结构。",
  }, "朗姆酒"),
  withMedia({
    id: "tanqueray-no-ten", title: "添加利十号 Tanqueray No.TEN 柑橘伦敦干金酒", category: "gin" as const, originRegion: "英国 · 苏格兰卡梅隆桥", baseMaterial: "中性谷物酒精与杜松子、鲜柑橘", stillType: "小型铜制壶式蒸馏器 Tiny Ten", caskAndAging: "不经桶陈，蒸馏后调至装瓶度数", abv: "47.3% vol", liquorColorHex: "#E9E4CF",
    nosesAndPalate: ["杜松", "葡萄柚", "青柠", "洋甘菊", "香菜籽"], radar: { peatOrSmoke: 0, caskRichness: 5, floralFruity: 92, spiceWarmth: 58, finishLength: 72 }, servingNote: "适合干马天尼或高球；纯饮时冰镇并以葡萄柚皮增香。",
    tagline: "整颗鲜柑橘与杜松同蒸，为马天尼提供明亮锐利的骨架。",
    essay: "添加利十号区别于普通伦敦干金酒之处，在于使用整颗鲜葡萄柚、青柠与橙类，与杜松、香菜籽、洋甘菊等植物共同蒸馏。小型 Tiny Ten 蒸馏器强化明亮柑橘油香，高装瓶度又能在加冰或调酒稀释后维持结构。入口先是杜松松针，随后柚皮、白花和辛香展开，尾段干净。它尤其适合干马天尼：少量干味美思不会遮住主体，葡萄柚皮装饰还能把酒中原有柑橘线索重新点亮。",
  }, "金酒"),
  withMedia({
    id: "highland-anejo-tequila", title: "墨西哥哈利斯科高地 100% 蓝色韦伯龙舌兰 Añejo", category: "agave-tequila-mezcal" as const, originRegion: "墨西哥 · 哈利斯科高地", baseMaterial: "100% 蓝色韦伯龙舌兰", stillType: "铜制壶式二次蒸馏器", caskAndAging: "美国橡木桶熟成 1–3 年", abv: "40% vol", liquorColorHex: "#B9782D",
    nosesAndPalate: ["熟龙舌兰", "烤菠萝", "香草", "黑胡椒", "焦糖"], radar: { peatOrSmoke: 8, caskRichness: 76, floralFruity: 72, spiceWarmth: 78, finishLength: 82 }, servingNote: "小口净饮，不必配盐与柠檬；宽口杯可观察熟龙舌兰和桶香。",
    tagline: "高地红土养甜龙舌兰，橡木桶把烤果与胡椒磨成琥珀。",
    essay: "哈利斯科高地红色火山土和较凉气候使蓝色韦伯龙舌兰生长缓慢、糖分与果香突出。成熟植株去叶取心，经蒸烤把菊粉转成可发酵糖，再压榨、发酵、壶式蒸馏；Añejo 在橡木桶中熟成一至三年，增添香草、焦糖和烘烤辛香。优质版本仍应保留熟龙舌兰、烤菠萝与黑胡椒，而非只剩木味。它适合净饮，不需要盐和柠檬掩饰，是理解龙舌兰酒农业周期与桶陈关系的入口。",
  }, "龙舌兰酒"),
  withMedia({
    id: "oaxaca-mezcal", title: "瓦哈卡土坑烘烤烟熏梅兹卡尔 Mezcal", category: "agave-tequila-mezcal" as const, originRegion: "墨西哥 · 瓦哈卡", baseMaterial: "Espadín 或野生龙舌兰", stillType: "小型铜壶或陶罐蒸馏器", caskAndAging: "多为 Joven 无桶陈，突出原料与烘烤", abv: "45% vol", liquorColorHex: "#D8C99C",
    nosesAndPalate: ["柴火烟", "烤龙舌兰", "青椒", "矿物", "柑橘"], radar: { peatOrSmoke: 88, caskRichness: 12, floralFruity: 62, spiceWarmth: 82, finishLength: 86 }, servingNote: "宽口陶杯或小杯净饮，配橙片与虫盐但不一饮而尽。",
    tagline: "土坑、火山石与木柴，把龙舌兰心烤成瓦哈卡烟雾。",
    essay: "梅兹卡尔是龙舌兰蒸馏酒大类，瓦哈卡传统常把成熟龙舌兰心置于铺有炽热石块的土坑，以木柴和纤维覆盖慢烤数日，再碾压、开放发酵并小批蒸馏。烟熏因此来自原料烘烤，而非泥煤或橡木桶；青椒、烤果、柑橘、泥土和矿物会随品种与村落变化。无桶陈 Joven 最能展示这些差异。用宽口小杯慢啜，让酒精与烟气散开，才能看见手工生产背后的植物成熟周期和地方生态。",
  }, "梅兹卡尔"),
  withMedia({
    id: "belvedere-rye-vodka", title: "波兰雪树黑麦伏特加", category: "vodka" as const, originRegion: "波兰 · 马佐夫舍", baseMaterial: "波兰黑麦与纯净水", stillType: "连续柱式蒸馏与精馏系统", caskAndAging: "不经桶陈，过滤后调和装瓶", abv: "40% vol", liquorColorHex: "#F2F3EE",
    nosesAndPalate: ["黑麦面包", "白胡椒", "杏仁", "奶油", "矿物"], radar: { peatOrSmoke: 0, caskRichness: 4, floralFruity: 22, spiceWarmth: 64, finishLength: 62 }, servingNote: "冷藏至 6–8℃小杯净饮，勿冻至完全失去谷物香；亦适合伏特加马天尼。",
    tagline: "高纯净不等于无味，黑麦留下胡椒、面包与奶油质地。",
    essay: "雪树以波兰黑麦为核心，连续蒸馏和精馏去除杂质，却保留一线黑麦面包、白胡椒、杏仁和奶油感。伏特加常被误解为绝对中性，真正优质版本仍会通过谷物、发酵和水质形成细微质地差异；过滤与调水的目标是纯净，而非抹掉全部性格。过度冷冻会封闭香气，建议冷藏后小杯净饮，入口可感柔滑，中段浮出辛香，尾段干净。它也适合作伏特加马天尼，让味美思与装饰物拥有清晰背景。",
  }, "伏特加"),
];

export const cocktailSpecimens: CocktailRecipeSpecimen[] = [
  withMedia({
    id: "classic-negroni", title: "古典尼格罗尼", englishTitle: "Negroni", eraOrOrigin: "1919 年前后 · 意大利佛罗伦萨", method: "stirred" as const, glassware: "古典杯", iceSpec: "手凿透明大冰块", garnish: "橙皮", abvEstimate: "约 24% vol", liquorColorHex: "#B8333A",
    ingredients: [{ name: "伦敦干金酒", amountMl: 30, role: "base" as const, colorHex: "#E8E5D8" }, { name: "金巴利", amountMl: 30, role: "acid-bitter" as const, colorHex: "#C52832" }, { name: "甜味美思", amountMl: 30, role: "modifier" as const, colorHex: "#8B2C2E" }],
    balanceAxis: { spiritStrength: 78, sweetRichness: 64, sourBitterTension: 88, dilutionChill: 58 }, flavorTags: ["杜松", "苦橙", "药草", "焦糖"], preparationSteps: ["三种材料加入调酒杯与冰块", "搅拌至充分冰镇并适度稀释", "滤入装有大冰块的古典杯", "挤压橙皮油后装饰"],
    tagline: "一比一比一，让杜松、苦橙与香草甜味形成完美三角。",
    essay: "尼格罗尼以金酒、金巴利和甜味美思等份组成，配方简单却对原料与稀释极敏感。金酒提供杜松骨架，金巴利带苦橙、草药和鲜红颜色，甜味美思以糖分、香料和葡萄酒体缝合二者。搅拌不是只为降温，而是加入恰当水量，让苦甜边界展开；大冰块则减缓后续稀释。橙皮油在杯口补上明亮顶香。它既是餐前开胃酒，也是研究“烈、甜、苦”三角平衡的标准模型。",
  }, "鸡尾酒"),
  withMedia({
    id: "old-fashioned", title: "古典威士忌", englishTitle: "Old Fashioned", eraOrOrigin: "19 世纪 · 美国", method: "stirred" as const, glassware: "古典杯", iceSpec: "手凿透明大冰块", garnish: "橙皮，可选酒渍樱桃", abvEstimate: "约 32% vol", liquorColorHex: "#B36A27",
    ingredients: [{ name: "波本或黑麦威士忌", amountMl: 60, role: "base" as const, colorHex: "#B66A2C" }, { name: "浓糖浆", amountMl: 7, role: "modifier" as const, colorHex: "#D8B46A" }, { name: "安格仕芳香苦精", amountMl: 2, role: "acid-bitter" as const, colorHex: "#6E2D20" }],
    balanceAxis: { spiritStrength: 94, sweetRichness: 48, sourBitterTension: 42, dilutionChill: 54 }, flavorTags: ["橡木", "香草", "橙油", "芳香苦精"], preparationSteps: ["糖浆与苦精加入调酒杯", "加入威士忌和冰块缓慢搅拌", "滤入装有大冰块的古典杯", "挤橙皮油并擦拭杯口"],
    tagline: "烈酒、糖、苦精与水，保留了鸡尾酒最初的定义。",
    essay: "Old Fashioned 几乎复现十九世纪“鸡尾酒”的原始公式：烈酒、糖、苦精和水。波本带香草焦糖，黑麦则更辛辣干爽；糖不是把酒变甜，而是圆润酒精与橡木单宁，芳香苦精提供肉桂、丁香和草药连接。搅拌产生的稀释量决定成败，太少则尖锐，太多则松散。透明大冰块维持低温并缓慢变化，橙皮油只需轻挤，不应让果肉喧宾夺主。它是检验调酒师基本功最直接的一杯。",
  }, "鸡尾酒"),
  withMedia({
    id: "dry-martini", title: "干马天尼", englishTitle: "Dry Martini", eraOrOrigin: "19 世纪末至 20 世纪初 · 美国", method: "stirred" as const, glassware: "冰镇马天尼杯或 Nick & Nora 杯", iceSpec: "调酒冰，成酒无冰", garnish: "柠檬皮或橄榄", abvEstimate: "约 30% vol", liquorColorHex: "#E9E5D2",
    ingredients: [{ name: "伦敦干金酒", amountMl: 60, role: "base" as const, colorHex: "#F0EEE5" }, { name: "干味美思", amountMl: 10, role: "modifier" as const, colorHex: "#E6D7A8" }, { name: "橙味苦精", amountMl: 1, role: "acid-bitter" as const, colorHex: "#C47B35" }],
    balanceAxis: { spiritStrength: 96, sweetRichness: 12, sourBitterTension: 46, dilutionChill: 76 }, flavorTags: ["杜松", "柠檬皮", "干草本", "白花"], preparationSteps: ["预先冰镇酒杯", "材料与足量冰块搅拌至丝滑冰冷", "双重过滤入无冰杯", "以柠檬皮油或橄榄完成"],
    tagline: "透明、冰冷、极干；每一毫升稀释都无处隐藏。",
    essay: "干马天尼把金酒与干味美思压缩成近乎透明的结构，因此温度、比例和稀释毫无藏身之处。金酒的杜松与柑橘是骨架，味美思提供葡萄酒酸度、花草和微弱甜感；少量橙味苦精可缝合香气。充分搅拌让质地如丝绸，成酒滤入预冷无冰杯，避免继续稀释。柠檬皮版本更明亮，橄榄版本更咸鲜。所谓“越干越好”并非无限减少味美思，而是找到仍有层次又保持锋利的比例。",
  }, "鸡尾酒"),
  withMedia({
    id: "whiskey-sour", title: "蛋白威士忌酸", englishTitle: "Whiskey Sour", eraOrOrigin: "19 世纪 · 美国", method: "shaken" as const, glassware: "古典杯或酸酒杯", iceSpec: "先干摇后湿摇；可无冰或大冰", garnish: "柠檬皮与苦精花纹", abvEstimate: "约 18% vol", liquorColorHex: "#D59A3A",
    ingredients: [{ name: "波本威士忌", amountMl: 50, role: "base" as const, colorHex: "#B56A2A" }, { name: "鲜柠檬汁", amountMl: 25, role: "acid-bitter" as const, colorHex: "#E6D65B" }, { name: "糖浆", amountMl: 20, role: "modifier" as const, colorHex: "#E1C77B" }, { name: "蛋清", amountMl: 20, role: "modifier" as const, colorHex: "#F7F2E7" }],
    balanceAxis: { spiritStrength: 68, sweetRichness: 58, sourBitterTension: 76, dilutionChill: 72 }, flavorTags: ["柠檬", "香草", "橡木", "绵密蛋白"], preparationSteps: ["全部材料先无冰干摇乳化蛋白", "加冰强力湿摇降温稀释", "双重过滤入杯", "滴苦精并划出花纹"],
    tagline: "柠檬酸、糖与波本，被蛋白泡沫包成柔软而清晰的弧线。",
    essay: "威士忌酸遵循“烈、酸、甜”经典结构，蛋清则把锐角磨成绵密曲线。波本的香草焦糖承接糖浆，鲜柠檬提供明亮酸度，蛋清经干摇展开蛋白网络，再经加冰湿摇降温稀释，形成细腻泡冠与丝滑口感。蛋清本身不应留下腥味，原料新鲜、充分摇合和柠檬精油都很关键。表面苦精花纹既装饰也补香。入口先柔，随后酸度穿透，尾段才回到橡木与酒精，是摇和技法的标准教材。",
  }, "鸡尾酒"),
  withMedia({
    id: "mojito", title: "古巴莫吉托", englishTitle: "Mojito", eraOrOrigin: "20 世纪 · 古巴哈瓦那", method: "built" as const, glassware: "柯林杯", iceSpec: "碎冰或长条冰", garnish: "薄荷顶与青柠角", abvEstimate: "约 12% vol", liquorColorHex: "#DDE2A7",
    ingredients: [{ name: "古巴风格白朗姆", amountMl: 50, role: "base" as const, colorHex: "#ECEBE3" }, { name: "鲜青柠汁", amountMl: 25, role: "acid-bitter" as const, colorHex: "#C6D65B" }, { name: "糖浆", amountMl: 15, role: "modifier" as const, colorHex: "#E4CC82" }, { name: "苏打水", amountMl: 60, role: "modifier" as const, colorHex: "#EAF2EE" }, { name: "新鲜薄荷", amountMl: 5, role: "tea-eastern" as const, colorHex: "#5F8F47" }],
    balanceAxis: { spiritStrength: 46, sweetRichness: 42, sourBitterTension: 62, dilutionChill: 94 }, flavorTags: ["薄荷", "青柠", "甘蔗", "气泡"], preparationSteps: ["薄荷轻拍后与糖浆、青柠汁入杯", "加入朗姆与碎冰搅匀", "补苏打水并再次提拉", "堆满碎冰，以薄荷顶装饰"],
    tagline: "薄荷、青柠、甘蔗与气泡，组成哈瓦那最清凉的长饮。",
    essay: "莫吉托把白朗姆的甘蔗清香与青柠、薄荷、糖和苏打水组合成高杯长饮。薄荷应轻拍释放精油，不宜猛烈捣碎，否则叶绿素和苦味会污染酒体；青柠酸与糖需先达到平衡，再由苏打水和融冰拉长。碎冰提供快速降温，薄荷顶靠近鼻端持续送香。它酒精不高，却因气泡、酸度与草本极具解渴感。优质版本不应像甜汽水，而要在每一口都尝到朗姆、柑橘和清凉香气的交替。",
  }, "鸡尾酒"),
  withMedia({
    id: "margarita", title: "龙舌兰玛格丽特", englishTitle: "Margarita", eraOrOrigin: "20 世纪中叶 · 墨西哥 / 美国边境", method: "shaken" as const, glassware: "碟形玛格丽特杯或古典杯", iceSpec: "摇和冰；可直上或加大冰", garnish: "半圈盐边与青柠片", abvEstimate: "约 22% vol", liquorColorHex: "#D7D66A",
    ingredients: [{ name: "100% 龙舌兰 Blanco", amountMl: 50, role: "base" as const, colorHex: "#F0EEE5" }, { name: "橙味利口酒", amountMl: 20, role: "modifier" as const, colorHex: "#D89B42" }, { name: "鲜青柠汁", amountMl: 25, role: "acid-bitter" as const, colorHex: "#C9D657" }],
    balanceAxis: { spiritStrength: 76, sweetRichness: 42, sourBitterTension: 82, dilutionChill: 78 }, flavorTags: ["熟龙舌兰", "青柠", "橙皮", "海盐"], preparationSteps: ["杯口以青柠润湿并制作半圈盐边", "全部液体加冰强力摇和", "双重过滤入预冷杯或大冰杯", "以青柠片装饰"],
    tagline: "龙舌兰、橙与青柠的三角，被一线盐边点亮。",
    essay: "玛格丽特属于 Sidecar 家族的龙舌兰变体：基酒、橙味利口酒与柑橘酸构成紧凑三角。100% 蓝色龙舌兰 Blanco 提供熟植物、白胡椒与矿物感，橙酒连接果香和甜度，鲜青柠拉出酸线。盐边不是越多越好，做半圈可让饮者比较有盐与无盐两种路径；盐能压低苦感、放大甜酸。充分摇和带来冰冷与细小气泡，成酒应锐利而不刺口。它检验的正是酸甜校准与优质基酒。",
  }, "鸡尾酒"),
  withMedia({
    id: "xinghua-osmanthus-fenjiu-sour", title: "中式特调·杏花金桂清香汾酒酸", englishTitle: "Xinghua Osmanthus Fenjiu Sour", eraOrOrigin: "当代中国融合调酒", isEasternFusion: true, method: "shaken" as const, glassware: "酸酒杯", iceSpec: "干摇后湿摇，成酒无冰", garnish: "盐渍桂花与柠檬皮", abvEstimate: "约 19% vol", liquorColorHex: "#E2B84D",
    ingredients: [{ name: "清香型汾酒", amountMl: 45, role: "base" as const, colorHex: "#F2F0E8" }, { name: "金桂蜂蜜糖浆", amountMl: 20, role: "tea-eastern" as const, colorHex: "#D6A33D" }, { name: "鲜柠檬汁", amountMl: 25, role: "acid-bitter" as const, colorHex: "#E3D354" }, { name: "蛋清", amountMl: 20, role: "modifier" as const, colorHex: "#F7F3E8" }],
    balanceAxis: { spiritStrength: 74, sweetRichness: 58, sourBitterTension: 72, dilutionChill: 74 }, flavorTags: ["豌豆曲", "青苹果", "金桂", "柠檬"], preparationSteps: ["材料无冰干摇乳化", "加入冰块强力湿摇", "双重过滤入预冷酸酒杯", "以盐渍桂花和柠檬油完成"],
    tagline: "清香汾酒的净爽粮香，与杏花村意象和金桂酸甜相接。",
    essay: "这杯中式酸酒以清香型汾酒替代威士忌。汾酒的乙酸乙酯、青苹果与豌豆曲粮香比浓酱型白酒更轻净，能与柠檬酸度正面衔接；金桂蜂蜜糖浆补入秋花、蜜甜和“杏花村”文化联想，蛋清则缓冲高度酒精。先干摇再湿摇形成细泡，盐渍桂花只作点睛，避免香精化。配方关键是控制白酒用量与糖酸比，让饮者先识别基酒，再感受桂花，而不是用甜味遮住东方蒸馏酒个性。",
  }, "中式特调"),
  withMedia({
    id: "wuyi-dahongpao-gin-negroni", title: "茶酒特调·武夷大红袍冷萃金酒尼格罗尼", englishTitle: "Wuyi Dahongpao Gin Negroni", eraOrOrigin: "当代中国茶酒融合调酒", isEasternFusion: true, method: "stirred" as const, glassware: "古典杯", iceSpec: "透明大冰块", garnish: "火烤橙皮与干茶枝", abvEstimate: "约 24% vol", liquorColorHex: "#9E3E32",
    ingredients: [{ name: "大红袍冷萃金酒", amountMl: 30, role: "tea-eastern" as const, colorHex: "#C18B54" }, { name: "金巴利", amountMl: 30, role: "acid-bitter" as const, colorHex: "#C52832" }, { name: "甜味美思", amountMl: 30, role: "modifier" as const, colorHex: "#7D2C30" }],
    balanceAxis: { spiritStrength: 78, sweetRichness: 62, sourBitterTension: 90, dilutionChill: 60 }, flavorTags: ["岩茶焙火", "杜松", "苦橙", "药草"], preparationSteps: ["以大红袍低温浸泡金酒并精细过滤", "三种酒液加冰搅拌至冰冷", "滤入装有大冰块的古典杯", "挤火烤橙皮油并轻触杯口"],
    tagline: "岩茶焙火与金巴利苦橙，在尼格罗尼等份结构中彼此照亮。",
    essay: "这款融合尼格罗尼先以武夷大红袍低温浸泡金酒，让岩茶的焙火、兰花、桂皮和岩韵进入杜松骨架。冷萃需控制时间，过度会释放强涩；过滤后的茶金酒再与金巴利、甜味美思等份搅拌，苦橙衔接茶的焙火果香，味美思提供草药甜润。透明大冰减缓稀释，火烤橙皮放大烘焙调性。成功版本仍应清楚保持尼格罗尼结构，同时让茶成为风味逻辑，而非漂浮装饰。",
  }, "茶酒特调"),
];
