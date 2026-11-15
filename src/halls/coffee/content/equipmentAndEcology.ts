import type {
  BurrGeometryType,
  CoffeeCityEcologyCard,
  CoffeeEquipmentCategoryId,
  CoffeeEquipmentItem,
  CoffeeWaveEra,
} from "../types";

type GearSeed = [
  string, string, string, CoffeeEquipmentCategoryId, string, string, string,
  string, string, string[], string, BurrGeometryType?
];
const gearSeeds: GearSeed[] = [
  ["gear-comandante-c40", "德国司令官 C40 氮气钢手摇磨豆机", "Comandante C40", "grinder-burr", "德国", "锥形氮化钢刀盘，双轴承中轴", "豆粒受轴向剪切与挤压逐级破碎", "粒径分布兼具主体与适量细粉，甜感、层次和便携性平衡", "刻度可复现但价格较高；大剂量手磨耗时", ["hario-v60", "aeropress"], "换豆先清除残粉，以固定点击数配合实际流速校准。", "conical"],
  ["gear-mahlkonig-ek43", "迈赫迪 EK43 98mm 商用平刀磨豆机", "Mahlkönig EK43", "grinder-burr", "德国", "98mm垂直平刀与高功率马达", "大直径刀盘高速切削，缩短颗粒停留时间", "单峰趋向明显、细粉少，杯测透明且萃取率上限高", "高均匀度、用途广；体积大且须精确校正刀盘平行", ["hario-v60", "kalita-wave", "espresso"], "每次调粗后先运行少量豆，排出旧刻度残粉。", "flat"],
  ["gear-fuji-royal-ghost", "小富士 Fuji Royal 鬼齿磨豆机", "Fuji Royal Ghost-tooth Grinder", "grinder-burr", "日本", "铸铁鬼齿刀盘，圆钝齿峰", "以碾压和撕裂为主而非锐利切割", "圆润醇甜、口感厚，适合日式深烘点滴法", "风格鲜明耐用；细粉较多，不追求北欧式极高清晰度", ["hario-v60", "french-press"], "深烘豆脆，宜降低转速与投豆速度避免过多粉末。", "ghost-tooth"],
  ["gear-single-dose-df64", "现代单剂量零残粉电磨 Niche／DF64", "Single-dose Niche / DF64", "grinder-burr", "英国／中国现代家用体系", "64mm平刀或锥刀、波纹豆仓与吹气皮老虎", "单次称豆研磨并以气流降低粉道滞留", "切换豆种与冲煮法时减少旧粉污染，利于变量控制", "残粉低、灵活；仍须处理静电、飞粉与刀盘校准", ["espresso", "hario-v60"], "RDT仅用极少水雾，避免刀盘锈蚀。", "flat"],
  ["gear-hario-v60", "Hario V60 60°螺旋肋骨锥形滤杯", "Hario V60 Dripper", "dripper", "日本", "玻璃／陶瓷／树脂，60°锥体与大单孔", "螺旋肋骨维持空气通道，注水直接控制渗滤", "流速快、花香与酸质清晰，对研磨和水流敏感", "可控性极高；手法误差也会被放大", ["hario-v60"], "树脂版热损失较低；冲前务必充分润洗滤纸。"],
  ["gear-kalita-wave", "Kalita Wave 三孔波浪蛋糕滤杯", "Kalita Wave", "dripper", "日本", "平底三孔与波浪滤纸", "平底分散水流，波纹隔离杯壁维持排气", "均匀、甜润、醇厚，较少出现锥杯中心过萃", "容错高；滤纸贴底或细粉迁移时可能堵塞", ["kalita-wave"], "注水不要冲到纸壁，以免旁路稀释。"],
  ["gear-origami-dripper", "Origami 折纸美浓烧陶瓷滤杯", "Origami Dripper", "dripper", "日本岐阜美浓", "陶瓷折棱结构，兼容锥形与蛋糕滤纸", "深肋骨形成多条空气通道，可借滤纸改变几何", "锥纸明亮、蛋糕纸甜圆，一杯两种流体性格", "美观灵活；陶瓷需预热且不同滤纸差异大", ["hario-v60", "kalita-wave"], "先依目标杯型选滤纸，再校准研磨，不要同时改变两个变量。"],
  ["gear-clever-dripper", "Clever Dripper 聪明杯活塞浸泡滤杯", "Clever Dripper", "dripper", "台湾设计", "塑料锥杯、底部止水阀与纸滤", "离杯时全浸泡，置杯后阀门开启重力过滤", "兼具法压的饱满和纸滤的洁净，重现性强", "入门稳定；久泡细粉仍会堵塞并增加涩感", ["french-press", "hario-v60"], "先水后粉可减少滤纸底部堵塞并加快下滤。"],
  ["gear-linea-dual-boiler", "双锅炉 PID 饱和式冲煮头半自动意式机", "Linea-style Dual Boiler Espresso Machine", "espresso-machine", "意大利米兰架构", "独立蒸汽与冲煮锅炉、PID、饱和式冲煮头", "热虹吸与饱和水路维持温度，旋转泵提供稳定9 bar", "连续出杯温稳，蒸汽强，适合精确建立浓缩参数", "稳定高效；昂贵、耗能且需软化水与反冲维护", ["espresso"], "每天清洁粉碗与冲煮头，按水质而非日历决定除垢。"],
  ["gear-spring-lever", "复古弹簧拉杆意式机", "Spring Lever Espresso Machine", "espresso-machine", "意大利", "弹簧活塞、长拉杆与厚重黄铜冲煮组", "弹簧由高压自然衰减，形成前高后低变压曲线", "厚甜、柔和，能降低尾段过萃，是压力曲线鼻祖", "无需电泵且仪式感强；温控与操作学习成本高", ["espresso"], "观察回弹速度与液重，别把固定时间当作唯一终点。"],
  ["gear-e61-hx", "E61 热交换经典冲煮头机械结构", "E61 Heat-exchanger Group", "espresso-machine", "意大利", "约4kg镀铬黄铜组头、热虹吸与机械预浸腔", "锅炉热交换管即时加热，热虹吸维持组头温度", "缓和预浸、质地经典，家用机械美学突出", "耐用可维修；闲置后易过热，须掌握降温冲洗", ["espresso"], "先根据嘶汽判断过热并做冷却冲洗，再锁手柄萃取。"],
  ["gear-bialetti-moka", "Bialetti 比乐蒂八角铝制摩卡壶", "Bialetti Moka Express", "immersion-pressure", "意大利", "食品级铝八角壶体、安全阀与金属粉碗", "底壶蒸汽压推动热水穿过粉层，压力约1–2 bar", "浓厚、焦糖与烘焙感突出，介于滴滤与意式之间", "便携耐用；火力或研磨不当容易焦苦喷溅", ["moka-pot"], "用热水入底壶、中小火加热，在浅色喷溅前离火降温。"],
  ["gear-aeropress", "爱乐压 AeroPress 针筒气压滤器", "AeroPress", "immersion-pressure", "美国", "耐热聚丙烯筒、硅胶活塞与圆形滤片", "浸泡后以手压产生低压过滤", "配方跨度大，洁净又有体感，旅行友好", "快速易洗；单次容量有限且强压会增加浑浊", ["aeropress"], "听到嘶声前停止，最后的空气会扰动粉饼并带入苦涩。"],
  ["gear-hario-siphon", "日式哈里欧虹吸壶", "Hario Siphon", "immersion-pressure", "日本", "耐热玻璃上下壶、滤布与酒精／卤素热源", "蒸汽压升水，冷凝负压回吸过滤", "香气开放、清晰而有圆润油脂，演示性强", "温控与搅拌可控；清洁滤布和明火操作繁琐", ["siphon"], "上壶只维持轻微扰动，剧烈沸腾会破坏挥发香。"],
  ["gear-french-press", "波顿法压壶金属滤网", "French Press", "immersion-pressure", "法国", "玻璃／不锈钢壶体与多层金属网", "全浸泡后机械分离粉渣，不依赖纸滤", "保留脂质与胶体，醇厚直接", "配方简单；细粉沉淀与后段持续萃取明显", ["french-press"], "压下后立即全部倒出，不把咖啡留在粉渣上。"],
  ["gear-pid-gooseneck-kettle", "鹅颈细口 PID 温控手冲壶", "PID Gooseneck Kettle", "kettle-scale-prep", "现代手冲体系", "不锈钢细嘴、温度探针与PID加热控制", "细长水路限制流量，垂直水柱调节粉床扰动", "精准控制水温、落点和流速，提高处方重现性", "操控细致；壶嘴差异与持壶姿势仍需练习", ["hario-v60", "kalita-wave"], "用秤练习固定每秒4–6g流速，比追求夸张绕圈更重要。"],
  ["gear-wdt-tamper", "WDT 细针布粉器与 58.5mm 恒力压粉锤", "WDT Tool & Calibrated Tamper", "kettle-scale-prep", "现代意式竞赛体系", "0.25–0.4mm针束与贴合粉碗的平底压粉锤", "细针拆散结团并均匀密度，压粉形成水平粉床", "减少通道效应，让无底手柄液柱更均匀", "诊断价值高；过度搅动或粗针会制造空洞", ["espresso"], "从粉床底部缓慢提针，最后轻整平再一次垂直压粉。"],
  ["gear-milk-pitcher", "拉花尖嘴奶缸与蒸汽棒打发旋涡", "Latte Art Pitcher & Steam Wand", "kettle-scale-prep", "意大利与澳洲咖啡馆", "304不锈钢尖嘴缸、双孔或四孔蒸汽头", "蒸汽卷入空气并以旋涡剪切为微米级气泡", "产生有光泽的天鹅绒微奶泡并精确控制拉花线条", "表现力高；进气、温度和旋涡任一失控都会粗泡", ["espresso"], "冷奶冷缸起步，先短促进气，再让旋涡打磨至60–65℃。"],
  ["gear-coffee-refractometer", "VST／ATAGO 咖啡折光仪", "Coffee Refractometer", "science-lab", "现代咖啡科学实验室", "温补光学传感器，读取TDS总溶解固形物", "折射率换算浓度，并结合饮料质量与粉量计算萃取率", "把浓淡与萃取分开讨论，辅助定位18%–22%金杯区间", "数据可复验；油脂、温度和未过滤微粒会干扰读数", ["all"], "样液冷却并过滤，校零后重复测三次取稳定值。"],
  ["gear-flow-rate-scale", "0.1g 高响应流速手冲电子秤", "0.1g Flow-rate Coffee Scale", "science-lab", "现代精品咖啡竞赛", "高频称重传感器、计时器与实时g/s显示", "同步记录质量和时间，将注水动作量化为流速曲线", "提升粉水比、分段水量和注水速度的一致性", "反馈直接；数字不能替代对粉床与滴滤状态的观察", ["hario-v60", "kalita-wave", "espresso"], "练习稳定流速后再看曲线，避免为了追数字频繁修正水柱。"],
];

export const coffeeEquipment: CoffeeEquipmentItem[] = gearSeeds.map(([
  id, name, englishName, category, inventorOrOrigin, coreMaterialAndSpec, fluidOrGrindMechanics,
  particleOrCupImpact, prosAndCons, bestForBrewMethods, baristaProTip, burrType,
]) => ({
  id, name, englishName, category, burrType, inventorOrOrigin, coreMaterialAndSpec,
  fluidOrGrindMechanics, particleOrCupImpact, prosAndCons, bestForBrewMethods, baristaProTip,
  description: `${name}把材料、几何与流体条件转化为可感知的杯中差异。理解其工作边界，比追逐型号更能提升稳定性；使用时应固定剂量、研磨、水质与温度逐项校准，并以清洁维护保证测量和风味不被旧粉、油脂或水垢污染。`,
  wiki: englishName, query: `${englishName} coffee equipment`, photoUrl: `/photos/${id}.jpg`,
}));

export const coffeeWaves: CoffeeWaveEra[] = [
  { id: "era-origin-mocha", waveLabel: "源流", years: "约9–16世纪", title: "埃塞牧羊人传说与也门摩卡港", roastAndBeanStyle: "陶锅焙炒、香料共煮与也门古种日晒", representativeIcons: ["卡法传说", "苏菲修道院", "摩卡港"], philosophyCore: "提神、礼仪与跨红海贸易", summary: "咖啡植物起源于埃塞高地，但成熟饮用制度在也门形成。苏菲修士借其守夜，摩卡港又把豆子送往奥斯曼世界；牧羊人卡尔迪故事宜视作文化传说，而非可证实史实。" },
  { id: "era-penny-university", waveLabel: "启蒙咖啡馆", years: "17–19世纪", title: "欧陆沙龙与「一便士大学」", roastAndBeanStyle: "现场焙炒、壶煮与早期过滤", representativeIcons: ["伦敦咖啡馆", "巴黎沙龙", "维也纳银托盘"], philosophyCore: "公共讨论、报刊、金融与艺术网络", summary: "付一便士即可进入伦敦咖啡馆听闻新闻，故有“一便士大学”之称。咖啡馆也催生报刊、保险与政治结社；维也纳、巴黎则把它发展为可长坐阅读的城市客厅。" },
  { id: "wave-first", waveLabel: "第一波", years: "约1900s–1960s", title: "商业速溶与家庭普及", roastAndBeanStyle: "商品级拼配、深烘、真空罐装与速溶", representativeIcons: ["真空铁罐", "速溶咖啡", "餐馆续杯"], philosophyCore: "便利、稳定、人人可得", summary: "工业烘焙、真空包装与冻干技术让咖啡成为家庭日用品。它扩大消费，却常以产地匿名和深烘稳定批次；评价重点是便利与一致，而非品种、庄园或精细处理。" },
  { id: "wave-second", waveLabel: "第二波", years: "约1960s–1990s", title: "意式浓缩连锁与第三空间", roastAndBeanStyle: "深烘意式拼配、奶咖与风味糖浆", representativeIcons: ["Espresso Bar", "大型连锁", "拿铁"], philosophyCore: "咖啡馆体验、意式语言与社交空间", summary: "意式浓缩、卡布奇诺和拿铁进入全球城市，连锁品牌以“家与办公室之外”的第三空间建立一致体验。产区词汇开始出现，但烘焙风格与门店品牌仍是主角。" },
  { id: "wave-third", waveLabel: "第三波", years: "约2000s–2010s", title: "庄园风土浅烘精品浪潮", roastAndBeanStyle: "单一产地、浅烘、手冲与精准浓缩", representativeIcons: ["SCA杯测", "Direct Trade", "微批次竞标"], philosophyCore: "咖啡是有产地与生产者的农产品", summary: "第三波强调庄园溯源、品种与处理法，以浅烘保存酸甜和芳香，杯测、比赛及直接贸易建立共同语言。透明不等于自动公平，价格、合同与长期关系仍需审视。" },
  { id: "wave-fourth", waveLabel: "当代第四波", years: "约2015s–至今", title: "实验发酵与低碳荫栽科学", roastAndBeanStyle: "定向菌种、厌氧发酵、精密萃取与低因精品", representativeIcons: ["发酵罐", "折光仪", "农林复合系统"], philosophyCore: "以科学提高可复验性，同时恢复生态韧性", summary: "微生物发酵、冷冻研磨和数据化萃取拓展风味边界；另一面则关注气候危机、荫栽、生物多样性与生产者收益。技术创新若脱离农业伦理，只会成为短暂猎奇。" },
];

type CitySeed = [string, string, string, boolean, string, string, string, string];
const citySeeds: CitySeed[] = [
  ["city-vienna", "维也纳", "奥地利", false, "联合国非遗传统咖啡馆文化", "Melange配银托盘清水", "大理石桌、报架、侍者与允许长坐的公共客厅", "维也纳咖啡馆以时间与空间而非只卖饮料见长；一杯咖啡换取阅读、写作和交谈的长期席位，甜点、报纸与银托盘清水构成完整礼仪。"],
  ["city-milan", "米兰", "意大利", false, "站立式 Espresso Bar", "吧台快速饮用Espresso", "高周转、熟客寒暄与按时段点单的日常节奏", "米兰吧台把浓缩嵌入通勤：点单、站饮、离开不过数分钟。价格、服务和社区关系比复杂菜单更重要，卡布奇诺通常属于早餐时段。"],
  ["city-melbourne", "墨尔本", "澳大利亚", false, "小巷精品与澳白文化", "Flat White与早午餐", "移民意式基础、独立烘焙与巷道餐饮共生", "战后意大利移民带来浓缩文化，后来独立烘焙与早午餐把奶泡质地推向精细化。澳白的归属虽与新西兰长期争论，其城市生态却真实塑造了全球奶咖审美。"],
  ["city-tokyo", "东京神保町与清澄白河", "日本", false, "法兰绒纯喫茶与现代烘焙坊并存", "深烘Nel Drip与浅烘手冲", "安静职人老铺、书店街与极简仓库烘焙空间", "神保町纯喫茶以法兰绒点滴、深烘和静默服务保存昭和节奏；清澄白河则用大空间烘焙坊拥抱第三波，两种时间观在东京并行。"],
  ["city-oslo-copenhagen", "奥斯陆／哥本哈根", "挪威／丹麦", false, "北欧极浅烘与Fika式休憩", "明亮单品手冲", "重视自然光、烘焙透明度与面包甜点", "北欧烘焙以较高豆表色值和短发展保留高地酸香，对生豆质量与水质要求极高。咖啡与日常休憩、烘焙面包及简洁设计共同组成城市生活。"],
  ["city-addis-ababa", "亚的斯亚贝巴", "埃塞俄比亚", false, "陶壶焚香咖啡礼", "Jebena三巡咖啡", "生豆现场洗选焙炒、研磨、煮制并分享", "埃塞咖啡礼往往经历烘豆、闻香、研磨和陶壶煮制，多轮斟饮维系家庭与邻里关系。它不是观光表演的静态符号，而是仍在生活中演变的社交制度。"],
  ["city-shanghai", "上海", "中国", true, "全球咖啡馆数量领先之城", "梧桐区小店与本土风味特调", "高密度社区店、商场旗舰、烘焙实验室和外卖网络", "上海以惊人的门店密度容纳从平价连锁到竞赛级吧台的多层市场。梧桐区小店把建筑、社区与季节特调结合，也让咖啡成为观察当代城市消费和创业的窗口。"],
  ["city-yunnan", "云南保山／普洱", "中国", true, "从速溶原料地到庄园咖旅共生", "产地手冲与鲜果处理体验", "种植、处理、烘焙、民宿和生态教育连成在地链条", "云南精品化不只是换品种，更依赖全熟采收、处理站卫生、批次分离与稳定采购。庄园咖旅让消费者看见农业劳动，也须避免景观化挤压农民收益。"],
  ["city-chengdu-hangzhou", "成都与杭州", "中国", true, "茶馆文化与社区独立咖啡共生", "茶咖融合与社区日常杯", "街巷烟火、院落社交、数字生活与年轻主理人文化", "成都的松弛茶馆传统和杭州的茶产区语境，为咖啡提供不同于写字楼效率的慢节奏。茶、咖并非零和竞争，而是在香气、空间与社交上互相借鉴。"],
  ["city-taipei", "台北", "中国台湾", true, "高密度自家烘焙职人街区", "单品手冲与阿里山豆", "小尺度街屋、长吧台、烘豆机与熟客社群", "台北自家烘焙店以小批量、长菜单和吧台交流见长，常同时连接日本喫茶美学与本地高山庄园。空间不大，却以稳定复购形成细密社区网络。"],
];

export const coffeeCityEcologies: CoffeeCityEcologyCard[] = citySeeds.map(([id, cityOrRegion, country, isChinaFocus, kicker, signatureDrinkOrRitual, cafeSpaceCulture, summary]) => ({
  id, cityOrRegion, country, isChinaFocus, kicker, signatureDrinkOrRitual, cafeSpaceCulture, summary,
  wiki: cityOrRegion, query: `${cityOrRegion} coffee culture`, photoUrl: `/photos/${id}.jpg`,
}));
