import type { ChinaTeaZoneMeta, TeaMountainSpec } from "../types";

/**
 * 中国四大茶区宏观地理区划（严格对齐 CHINA_TEA_ZONE_SHORT_META 省域映射）
 */
export const chinaTeaZones: ChinaTeaZoneMeta[] = [
  {
    id: "jiangnan",
    name: "江南茶区",
    kicker: "JIANGNAN TEA ZONE · 长江中下游丘陵水网与名山云雾带",
    provinces: ["zj", "ah", "js", "jx", "hn", "hb", "sh"],
    climateAndSoil:
      "地处长江以南、南岭以北亚热带季风气候区，年均温 15℃–18℃，年降水量 1200–1800mm，春雨绵密、云雾漫谷；土壤以白砂岩、千枚岩、花岗岩及冰碛岩风化而成的微酸性红壤、黄壤与砂质壤土（pH 4.5–5.8）为主。",
    dominantCategories: ["green", "black", "dark", "yellow"],
    colorHex: "#35685F",
    summary:
      "中华名优绿茶、工夫红茶、经典黄茶与湘鄂黑茶的核心腹地。从西湖群峰、太湖洞庭、徽州黄山祁门到湘中雪峰山与洞庭君山，文人茶事、禅院法乳与外销茶路在此交织千年，孕育出西湖龙井、碧螺春、黄山毛峰、太平猴魁、祁门红茶、君山银针、恩施玉露与安化黑茶等传世经典。",
  },
  {
    id: "huanan",
    name: "华南茶区",
    kicker: "HUANAN TEA ZONE · 东南山海丹霞火山岩与南亚热带常绿茶林",
    provinces: ["fj", "gd", "gx", "hi", "tw", "hk", "mo"],
    climateAndSoil:
      "位于南岭以南至闽粤桂琼台山海地带，属南亚热带至边缘热带海洋性季风气候，年均温 19℃–22℃，雨量充沛（1500–2400mm），生长期长达 10 个月以上；兼具武夷山白垩纪丹霞砾壤、凤凰山古火山花岗岩风化土、太姥山流纹岩砾壤与台湾中央山脉板岩腐殖土。",
    dominantCategories: ["oolong", "white", "black", "scented", "dark"],
    colorHex: "#9A5B25",
    summary:
      "中国茶树种质资源最奇崛、制茶工艺创造力最旺盛的百宝箱。乌龙茶（武夷岩茶、安溪铁观音、凤凰单丛、台湾冻顶与高山茶）、白茶（福鼎、政和）、红茶鼻祖（桐木关正山小种）、再加工花茶（福州茉莉花茶）以及侨销黑茶（广西梧州六堡茶）皆发源并鼎盛于此。",
  },
  {
    id: "xinan",
    name: "西南茶区",
    kicker: "XINAN TEA ZONE · 世界茶树演化起源中心与横断高原古茶山",
    provinces: ["yn", "sc", "gz", "cq", "xz"],
    climateAndSoil:
      "地跨云贵高原、横断山脉南延河谷与四川盆地周缘高山，立体气候显著（海拔落差 500m–2600m，『一山分四季，十里不同天』），干湿两季分明、日照紫外线强且漫射光充沛；广布古老花岗岩、片麻岩与紫砂页岩发育的深厚红壤、赤红壤及黄壤，有机质极为丰沛。",
    dominantCategories: ["dark", "black", "green", "yellow", "white"],
    colorHex: "#A6402C",
    summary:
      "全球山茶科茶属植物（Camellia sinensis）的基因摇篮与人工植茶最早祖庭。澜沧江中下游勐海、易武、临沧、景迈连绵保存着树龄数百年乃至上千年的乔木大叶种古茶林，铸就普洱茶与凤庆滇红的磅礴茶气；巴蜀蒙顶山、峨眉山与黔中云雾则传承着蒙顶甘露、蒙顶黄芽、康砖藏茶与都匀毛尖的千年贡茶香火。",
  },
  {
    id: "jiangbei",
    name: "江北茶区",
    kicker: "JIANGBEI TEA ZONE · 秦淮北界高纬昼夜温差与越冬厚叶风土",
    provinces: ["ha", "sd", "sn", "gs"],
    climateAndSoil:
      "横亘长江以北至秦岭—淮河—山东半岛南缘（北纬 31°–37°），属北亚热带向暖温带过渡气候，年均温 13℃–16℃，冬季寒冷漫长、茶树休眠期达 4–5 个月，春季回暖缓慢、昼夜温差逾 12℃；土壤多为大别山与泰沂山系棕壤、黄棕壤，微酸至中性。",
    dominantCategories: ["green", "yellow"],
    colorHex: "#588B57",
    summary:
      "中国茶树自然分布的北疆极限。漫长严冬迫使茶树根系深扎蓄积丰沛淀粉、可溶性糖与氨基酸，造就『叶片肥厚、内质浓酽耐泡、熟板栗香高扬』的北茶特质。大别山北麓信阳毛尖、皖西六安瓜片与霍山黄芽，以及黄海之滨日照绿茶，共同撑起江北茗茶的劲健脊梁。",
  },
];

/**
 * 20 座中华核心名茶山场与微域风土志
 */
export const teaMountains: TeaMountainSpec[] = [
  {
    id: "mtn-xihu",
    name: "西湖群山五核心产区（狮·龙·云·虎·梅）",
    zone: "jiangnan",
    province: "zj",
    provinceLabel: "浙江省",
    coord: [120.119, 30.219],
    defaultZoom: 12,
    elevation: "120m – 380m",
    landformAndSoil:
      "泥盆系西湖组石英白砂岩风化而成的微酸性『白砂土』，土层深厚疏松、砾石掺杂、透水透气极佳，pH 4.5–5.2，富含微量硅磷元素；梅家坞与云栖兼有石灰岩红黄壤。",
    microClimate:
      "北倚天竺灵隐诸峰屏障西北寒流，南敞钱塘江喇叭口迎纳暖湿江风，西抱西子湖浩渺水面调节温湿，春季晨昏岚雾缭绕山坞，散射蓝紫光极丰。",
    coreVillagesOrPeaks: ["狮峰山（胡公庙）", "龙井村", "云栖竹径", "虎跑翠越峰", "梅家坞", "九曲红梅大坞山"],
    representativeTeaIds: [
      "west-lake-longjing",
      "jiuqu-hongmei",
      "jingshan-cha",
      "anji-baicha",
      "dafo-longjing",
      "pingyang-huangtang",
    ],
    terroirNote:
      "西湖龙井一级保护区素分『狮、龙、云、虎、梅』五字号：狮峰山绝顶白砂土所产老茶蓬群体种呈温润糙米黄绿色，兰豆清香幽微入骨；梅家坞茶园窝于深坞肥壤，条索翠绿扁秀、滋味鲜爽甘甜；南麓大坞山更藏有一脉乌润细钩的九曲红梅，与周边余杭径山、湖州安吉、新昌天姥及浙南平阳共构之江千年茗脉。",
    famousSpots: [
      { name: "狮峰山胡公庙十八棵御茶园", locationHint: "杭州市西湖区龙井村狮峰麓", note: "乾隆敕封御茶母本故地" },
      { name: "中国茶叶博物馆（双峰馆区 & 龙井馆区）", locationHint: "杭州市西湖区龙井路88号 / 翁家山268号", note: "国家级茶文化专题殿堂" },
    ],
    wiki: "西湖龙井",
    query: "Longjing tea plantations Hangzhou West Lake",
    photoUrl: "/photos/mtn-xihu.jpg",
  },
  {
    id: "mtn-dongting",
    name: "苏州太湖洞庭东西山",
    zone: "jiangnan",
    province: "js",
    provinceLabel: "江苏省",
    coord: [120.415, 31.082],
    defaultZoom: 11,
    elevation: "50m – 336m",
    landformAndSoil:
      "莫厘峰与缥缈峰由泥盆系石英砂岩与石灰岩间互构成，山坡坡积酸性黄棕壤及乌砂土，腐殖质层厚润。",
    microClimate:
      "三万六千顷太湖烟波环抱成天然恒温水体，水汽昼夜蒸腾，霜期短、回春早，且世代践行『茶果复合间作』生态微域。",
    coreVillagesOrPeaks: ["东山莫厘峰", "碧螺峰", "西山缥缈峰", "秉场村", "水月坞", "苏州虎丘"],
    representativeTeaIds: ["dongting-biluochun", "suzhou-huqiu-molihuacha"],
    terroirNote:
      "太湖洞庭山独创『茶树与枇杷、杨梅、白果、青梅、柑橘根脉交错、枝叶相接』的千年农林共生系统：果木为茶丛遮挡烈日并涵养湿润微风，茶芽在抽蕊之际吸附漫山春花芬芳，遂成碧螺春独一无二的天然花果毫香；姑苏城外虎丘云岩亦延续吴地精细花茶窨制遗韵。",
    famousSpots: [
      { name: "东山碧螺景区古茶果园", locationHint: "苏州市吴中区东山镇碧螺村", note: "千年茶果间作活态农业遗产核心区" },
      { name: "西山缥缈峰水月禅寺茶坞", locationHint: "苏州市吴中区金庭镇西山岛", note: "唐宋水月茶祖庭" },
    ],
    wiki: "洞庭山",
    query: "Dongting Mountain Taihu Biluochun tea garden",
    photoUrl: "/photos/mtn-dongting.jpg",
  },
  {
    id: "mtn-huangshan",
    name: "徽州黄山与休宁松萝山系",
    zone: "jiangnan",
    province: "ah",
    provinceLabel: "安徽省",
    coord: [118.165, 30.088],
    defaultZoom: 11,
    elevation: "400m – 950m",
    landformAndSoil:
      "燕山期粗粒花岗岩剧烈风化形成的砂砾质乌砂土与高山香灰土，富含钾、锌、硒及腐殖酸，透气沥水绝佳。",
    microClimate:
      "七十二峰峡谷纵横，全年云雾日逾 200 天，日照时数短而漫射光比重大，山涧冷泉潺潺，茶芽持嫩性极强。",
    coreVillagesOrPeaks: ["富溪乡", "桃花峰", "汤口镇", "猴坑·猴岗·颜家", "休宁松萝山", "歙县大方与珠兰坞"],
    representativeTeaIds: [
      "huangshan-maofeng",
      "taiping-houkui",
      "xiuning-songluo",
      "shengxian-zhulan-huacha",
    ],
    terroirNote:
      "古徽州『八山一水一分田』，却是明清中国制茶技术的策源高地：休宁松萝山开创明代铁锅炒青法之先河；黄山桃花峰与富溪高谷孕育披满白毫、自带空谷幽兰气的黄山毛峰；北麓太平湖畔猴坑三村更以柿大茶良种捏制出魁伟挺拔、两刀一枪的尖茶之王太平猴魁。",
    famousSpots: [
      { name: "黄山桃花峰谢裕大生态茶博园", locationHint: "黄山市徽州区富溪乡", note: "黄山毛峰初创源头产区" },
      { name: "猴坑高山核心茶园", locationHint: "黄山市黄山区新明乡猴坑村", note: "太平猴魁正宗母产区" },
    ],
    wiki: "黄山",
    query: "Huangshan mountain mist tea terraces Anhui",
    photoUrl: "/photos/mtn-huangshan.jpg",
  },
  {
    id: "mtn-qimen",
    name: "祁门牯牛降与闾江流域",
    zone: "jiangnan",
    province: "ah",
    provinceLabel: "安徽省",
    coord: [117.718, 29.856],
    defaultZoom: 11,
    elevation: "300m – 800m",
    landformAndSoil:
      "前震旦系千枚岩、板岩与紫红色页岩风化而成的砾质紫红黄壤，铁铝氧化物与磷钾含量极丰，腐殖层深达尺余。",
    microClimate:
      "北枕牯牛降原始森林（森林覆盖率逾 88%），阊江与闾江水系穿谷而过，早晚温差显著、晴雨相间，促成槠叶种香叶醇高水平合成。",
    coreVillagesOrPeaks: ["历口镇", "闪里镇", "平里镇", "牯牛降南麓", "江西庐山五老峰", "修水漫江乡"],
    representativeTeaIds: ["qimen-gongfu", "lushan-yunwu", "ningzhou-gongfu"],
    terroirNote:
      "皖南祁门与赣北庐山、修水隔山相望，同属江南红绿兼修的黄金走廊。祁门槠叶种生长于千枚岩栎林荫蔽之下，叶片芳樟醇与香叶醇含量高达普通茶种数倍，成就世界三大高香红茶之首的『祁门香』；南邻修水宁州红茶与匡庐云雾茶亦凭峻岭寒泉名震海内外。",
    famousSpots: [
      { name: "祁门平里中国祁红科技博览园", locationHint: "黄山市祁门县平里镇", note: "1915巴拿马金奖百年老厂遗址" },
      { name: "历口古茶市与牯牛降生态茶谷", locationHint: "黄山市祁门县历口镇", note: "祁红核心优产乡" },
    ],
    wiki: "祁门红茶",
    query: "Qimen Anhui tea mountains mist",
    photoUrl: "/photos/mtn-qimen.jpg",
  },
  {
    id: "mtn-wuyi-zhengyan",
    name: "武夷山丹霞正岩（三坑两涧）",
    zone: "huanan",
    province: "fj",
    provinceLabel: "福建省",
    coord: [117.968, 27.665],
    defaultZoom: 12,
    elevation: "250m – 650m",
    landformAndSoil:
      "白垩纪晚期紫红色砂砾岩经流水切割崩塌形成的丹霞峡谷『烂石』与『砾质壤土』（正岩紫红风化土），富含钾、锰、铁、镁及微量矿物质，孔隙度高达 50%。",
    microClimate:
      "三十六峰、九十九岩夹峙出幽深峡谷（坑、涧、窠、洞），日照极短而岩壁漫反射柔和，谷底山泉终年浸润，冬暖夏凉、昼夜云雾锁涧，恰合陆羽『上者生烂石』之论。",
    coreVillagesOrPeaks: ["慧苑坑", "牛栏坑", "大坑口", "流香涧", "悟源涧", "九龙窠", "马头岩"],
    representativeTeaIds: [
      "wuyi-dahongpao",
      "wuyi-rougui",
      "wuyi-laocong-shuixian",
      "wuyi-tieluohan",
      "wuyi-baijiguan",
    ],
    terroirNote:
      "武夷正岩面积不足七十平方公里，却是乌龙茶『岩骨花香』的至高圣殿：九龙窠绝壁悬生六株母树大红袍；牛栏坑幽谷终日少日照，所产『牛肉』霸道辛锐而汤感绵柔；马头岩开阔向阳，『马肉』桂皮火香高亢；慧苑坑鬼洞与古井旁则隐匿着百年青苔老丛水仙与铁罗汉名丛。",
    famousSpots: [
      { name: "九龙窠母树大红袍摩崖石刻", locationHint: "南平市武夷山风景名胜区天心岩景区", note: "360余年绝壁古茶树保护点" },
      { name: "天心永乐禅寺与慧苑禅寺古茶道", locationHint: "武夷山景区核心正岩腹地", note: "三坑两涧禅茶祖庭" },
    ],
    wiki: "武夷山",
    query: "Wuyi Mountains Danxia cliff tea garden",
    photoUrl: "/photos/mtn-wuyi-zhengyan.jpg",
  },
  {
    id: "mtn-wuyi-tongmu",
    name: "武夷山桐木关国家级自然保护区",
    zone: "huanan",
    province: "fj",
    provinceLabel: "福建省",
    coord: [117.682, 27.746],
    defaultZoom: 11,
    elevation: "1100m – 1850m",
    landformAndSoil:
      "武夷山脉主峰黄岗山（海拔 2158m）南麓深切断裂峡谷，花岗岩与流纹斑岩发育的高山草甸腐殖黑砂壤，有机质含量高达 6%–10%。",
    microClimate:
      "闽赣分水岭古关隘，年均温仅 12℃–14℃，年降水量逾 2200mm，森林覆盖率 96.3%，冬季瑞雪封山、春季迟至立夏前发芽，苔藓毛竹与野生菜茶混生。",
    coreVillagesOrPeaks: ["桐木村", "江墩", "庙湾", "麻粟（高海拔绝顶）", "挂墩", "三港"],
    representativeTeaIds: ["tongmu-zhengshan-xiaozhong", "tongmu-jinjunmei"],
    terroirNote:
      "世界红茶的诞生原点。明末清初桐木先民以当地马尾松烘制发酵茶青，首创青楼熏焙正山小种，开启欧美下午茶时代；2005 年桐木制茶世家更采海拔千五百米高山奇种单芽创制金骏眉，令清澈甜润的花果蜜香再度革新现代高端红茶审美。",
    famousSpots: [
      { name: "桐木关古关隘与青楼熏制坊遗址", locationHint: "武夷山市星村镇桐木村闽赣交界处", note: "四百年正山小种发祥地" },
      { name: "挂墩与麻粟高山生态奇种茶园", locationHint: "武夷山国家级自然保护区核心缓冲带", note: "金骏眉核心高海拔茶芽源地" },
    ],
    wiki: "正山小种",
    query: "Tongmuguan Wuyi high mountain forest mist",
    photoUrl: "/photos/mtn-wuyi-tongmu.jpg",
  },
  {
    id: "mtn-anxi",
    name: "安溪内安溪高山（感德·祥华·西坪）",
    zone: "huanan",
    province: "fj",
    provinceLabel: "福建省",
    coord: [117.905, 25.228],
    defaultZoom: 11,
    elevation: "600m – 1150m",
    landformAndSoil:
      "戴云山脉东南坡酸性凝灰熔岩与花岗岩红黄壤，感德槐植与剑斗多紫红风化粘壤，富含铁锰矿质，持水性强。",
    microClimate:
      "『内安溪』群峰叠嶂，高山盆谷昼暖夜寒，春茶谷雨前后与秋茶寒露前后天高云淡、北风微凉，极利做青走水与兰花香气凝结。",
    coreVillagesOrPeaks: ["感德镇（槐植/龙通）", "祥华乡（祥地）", "西坪镇（尧阳/松岩）", "剑斗镇", "龙涓乡", "漳平南洋镇"],
    representativeTeaIds: [
      "anxi-qingxiang-tieguanyin",
      "anxi-nongxiang-tieguanyin",
      "zhangping-shuixian",
    ],
    terroirNote:
      "西坪尧阳松林头与尧山是清雍正年间红心歪尾桃铁观音母树两大发源圣地，至今坚守古法半发酵桑炭浓香技艺；西北内安溪感德、祥华海拔逾八百米，云雾酸性红壤赋予清香型正味铁观音清越入骨的『观音韵』与兰花酸香；毗邻闽西漳平高山更孕育出天下唯一紧压方形乌龙茶——漳平水仙茶饼。",
    famousSpots: [
      { name: "西坪松林头与尧阳铁观音发源地保护区", locationHint: "泉州市安溪县西坪镇", note: "清雍正年间魏说/王士让母树遗址" },
      { name: "感德中国茶都高山生态铁观音梯田", locationHint: "泉州市安溪县感德镇槐植村", note: "全球农业文化遗产安溪铁观音核心区" },
    ],
    wiki: "安溪县",
    query: "Anxi Tieguanyin tea terraces Fujian",
    photoUrl: "/photos/mtn-anxi.jpg",
  },
  {
    id: "mtn-fuding",
    name: "福鼎太姥山与政和高山产区",
    zone: "huanan",
    province: "fj",
    provinceLabel: "福建省",
    coord: [120.175, 27.116],
    defaultZoom: 11,
    elevation: "500m – 1050m",
    landformAndSoil:
      "太姥山白垩纪晶洞钾长花岗岩与流纹质凝灰岩风化砾壤（烂石白砂土），政和铁山—镇前一带则为火山岩发育的深厚肥沃红黄壤。",
    microClimate:
      "福鼎东临东海晴川湾，山海交汇令海风与太姥云雾昼夜对流，春阳明朗微风干爽，天生契合日光萎凋；政和深处闽北群山腹地，海拔逾千米，昼夜温差剧烈，利室内长时阴干。",
    coreVillagesOrPeaks: ["太姥山绿雪芽古洞", "磻溪镇", "白琳镇", "点头镇", "管阳镇", "政和铁山与镇前", "福安坦洋村"],
    representativeTeaIds: [
      "fuding-baihaoyinzhen",
      "fuding-baimudan",
      "fuding-laoshoumei",
      "zhenghe-baihaoyinzhen",
      "fuding-xingongyi-baicha",
      "tanyang-gongfu",
      "zhenghe-gongfu",
    ],
    terroirNote:
      "闽东北山海走廊双星闪耀：福鼎大白茶与大毫茶得太姥山花岗岩海雾滋养，经日光直晒，毫香清鲜爽朗；政和大白茶扎根闽北千米深山红壤，采室内复式通廊阴干，汤感醇厚稠滑如米浆。同脉福安白云山麓坦洋村与政和更并称『闽红三剑客』双璧。",
    famousSpots: [
      { name: "太姥山鸿雪洞绿雪芽古茶树", locationHint: "宁德市福鼎市太姥山风景区", note: "福鼎大白茶母树源头" },
      { name: "磻溪生态高山有机白茶基地", locationHint: "宁德市福鼎市磻溪镇湖林村", note: "头采银针核心山场" },
    ],
    wiki: "太姥山",
    query: "Mount Taimu Fuding white tea mountains",
    photoUrl: "/photos/mtn-fuding.jpg",
  },
  {
    id: "mtn-fuzhou-gushan",
    name: "福州鼓山与闽江口茉莉茶园",
    zone: "huanan",
    province: "fj",
    provinceLabel: "福建省",
    coord: [119.392, 26.055],
    defaultZoom: 11,
    elevation: "50m – 850m",
    landformAndSoil:
      "鼓山、北峰高山茶园为花岗岩微酸性黄红壤，而闽江、乌龙江两岸帝封江等冲积沙洲则为疏松肥沃、富含矿质淤泥的河漫滩潮沙土。",
    microClimate:
      "独特的『高山云雾育春茶、江洲酷暑催夏花』河谷盆地二元微域：春季高山温凉育肥壮烘青茶坯，盛夏江洲日温逾 36℃、夜风湿润，令双瓣与单瓣福州茉莉精油爆发。",
    coreVillagesOrPeaks: ["鼓山半岩茶园", "晋安北峰宦溪", "仓山帝封江沙洲", "长乐筹东", "闽侯乌龙江畔"],
    representativeTeaIds: ["fuzhou-moli-dabaihao"],
    terroirNote:
      "全球唯一同时坐拥顶级高山茶坯产区与河谷冲积洲茉莉花田的城市生态系统（联合国粮农组织全球重要农业文化遗产）。北峰春茶之毫韵与闽江沙洲伏花之冰糖冷香在百余道窨制工序中水乳交融，成就福州茉莉花茶独步天下的鲜灵高度。",
    famousSpots: [
      { name: "仓山帝封江闽江湿地茉莉花田", locationHint: "福州市仓山区城门镇帝封江畔", note: "千年闽江河洲茉莉核心保护区" },
      { name: "鼓山涌泉寺古茶园与半岩茶亭", locationHint: "福州市晋安区鼓山风景区", note: "宋明鼓山半岩茶遗址" },
    ],
    wiki: "福州茉莉花与茶文化系统",
    query: "Fuzhou Mount Gu Minjiang jasmine tea",
    photoUrl: "/photos/mtn-fuzhou-gushan.jpg",
  },
  {
    id: "mtn-fenghuang",
    name: "潮州凤凰山乌岽核心产区",
    zone: "huanan",
    province: "gd",
    provinceLabel: "广东省",
    coord: [116.652, 23.918],
    defaultZoom: 12,
    elevation: "750m – 1391m",
    landformAndSoil:
      "中生代古火山喷发流纹岩、花岗斑岩经长期风化形成的乌砂壤与高海拔黄红砾壤，乌岽天池周边富含火山灰微量矿物元素与深厚枯枝腐殖层。",
    microClimate:
      "粤东第一高峰凤鸟髻与乌岽山濒临南海仅数十公里，海洋暖湿气流遇千米高山抬升凝成浓重『天池海雾』，昼夜温差大，古茶树树干披满苍翠苔藓地衣。",
    coreVillagesOrPeaks: ["乌岽山李仔坪", "顶厝与狮头脚", "天池古茶园", "凤西大庵村", "坪坑头（鸭屎香母树村）", "粤北英德喀斯特峰林"],
    representativeTeaIds: [
      "fenghuang-milaixiang",
      "fenghuang-yashixiang",
      "fenghuang-songzhong-zhilan",
      "yingde-yinghong-jiuhao",
    ],
    terroirNote:
      "凤凰山被誉为『中国茶树自然花香基因库』，现存树龄逾两百年的宋种系古茶树三千余株，先民实行『单株采摘、单株制茶、单株销售』故名『单丛』。乌岽千米火山岩云雾赋予茶汤清冽绵长的『山韵』与十大天然花蜜香型；粤北英德峰林红壤则以英红九号撑起岭南大叶红茶脊梁。",
    famousSpots: [
      { name: "乌岽山天池与李仔坪宋种古茶园", locationHint: "潮州市潮安区凤凰镇乌岽村（海拔1100m）", note: "六百年东方红宋种母树群落" },
      { name: "凤凰大庵古茶树森林公园", locationHint: "潮州市潮安区凤凰镇大庵村", note: "单丛多香型品系活态博物馆" },
    ],
    wiki: "凤凰单丛",
    query: "Fenghuang Mountain Chaozhou Dancong ancient tea trees",
    photoUrl: "/photos/mtn-fenghuang.jpg",
  },
  {
    id: "mtn-menghai",
    name: "西双版纳勐海古茶山（老班章·南糯·景迈）",
    zone: "xinan",
    province: "yn",
    provinceLabel: "云南省",
    coord: [100.518, 21.724],
    defaultZoom: 11,
    elevation: "1400m – 1900m",
    landformAndSoil:
      "怒山山脉南延花岗岩与片麻岩发育的深厚微酸性砖红壤及赤红壤（pH 4.5–5.5），枯枝落叶层厚达十余厘米，铁铝质与腐殖质极高。",
    microClimate:
      "北回归线以南热带山地季风气候，11 月至次年 4 月旱季晴朗少雨、浓雾锁林（雾露滋养春芽），5–10 月雨季丰沛；勐海盆地特有冷凉水系与富饶微生物群落更造就独一无二的『勐海味』熟普发酵场。",
    coreVillagesOrPeaks: ["布朗山老班章", "新班章与老曼峨", "南糯山半坡老寨", "格朗和帕沙", "巴达与贺开", "澜沧景迈山芒景大平掌"],
    representativeTeaIds: [
      "menghai-laobanzhang",
      "menghai-gongting-shupu",
      "jingmai-lanxiang",
    ],
    terroirNote:
      "澜沧江以西『江外茶山』之魂：布朗山老班章海拔千七百米原始森林环抱，古树茶多酚、咖啡碱与茶气刚猛霸道，号称『普洱茶王』；紧邻普洱澜沧交界的世界遗产景迈山万亩千年古茶林则与螃蟹脚寄生兰共生，兰香清甜入汤；勐海坝子地下水与优势菌群更在 1973 年催生现代普洱熟茶渥堆技艺。",
    famousSpots: [
      { name: "布朗山老班章古茶园村寨", locationHint: "西双版纳州勐海县布朗山乡老班章村", note: "海拔1700–1900m哈尼爱尼族生态古茶林" },
      { name: "普洱景迈山古茶林文化景观（世界遗产）", locationHint: "普洱市澜沧县惠民镇景迈村与芒景村", note: "全球首个茶主题世界文化遗产" },
    ],
    wiki: "勐海县",
    query: "Menghai Bulang ancient Pu-erh tea forest Yunnan",
    photoUrl: "/photos/mtn-menghai.jpg",
  },
  {
    id: "mtn-yiwu",
    name: "西双版纳古六大茶山·易武产区",
    zone: "xinan",
    province: "yn",
    provinceLabel: "云南省",
    coord: [101.472, 21.995],
    defaultZoom: 11,
    elevation: "1200m – 1850m",
    landformAndSoil:
      "侏罗系与白垩系紫红色泥质砂岩、页岩风化而成的紫红腐殖壤及烂石砂砾土，矿质细腻温润。",
    microClimate:
      "地处澜沧江以东（江内古六大茶山之首），毗邻老挝丰沙里热带雨林，年均温 17.5℃，年降雨量高达 1900–2100mm，雨林参天乔木遮阴度高，湿度冠绝版纳诸山。",
    coreVillagesOrPeaks: ["麻黑寨", "刮风寨（茶王树）", "薄荷塘", "落水洞", "弯弓", "倚邦与蛮砖"],
    representativeTeaIds: ["yiwu-mahei"],
    terroirNote:
      "清代贡茶瑞贡天朝与晚清民国『宋聘号』『同庆号』『福元昌』等传奇号级圆茶的故乡。如果说老班章是刚烈霸王，易武高大国有林中的绿芽大叶种便是『普洱王后』——初饮香扬水柔、山野蜜兰盈腮，经十年以上干仓陈化后茶气暗涌、汤稠如油，陈韵深不可测。",
    famousSpots: [
      { name: "易武茶文化博物馆与车顺号老宅（茶马古道起点）", locationHint: "西双版纳州勐腊县易武镇老街", note: "清代贡茶石碑与号级茶庄遗址" },
      { name: "麻黑与刮风寨国有林原始古茶地", locationHint: "勐腊县易武镇麻黑村委会", note: "树高数米之森林混生型古茶树群" },
    ],
    wiki: "易武镇",
    query: "Yiwu ancient tea mountain Xishuangbanna",
    photoUrl: "/photos/mtn-yiwu.jpg",
  },
  {
    id: "mtn-lincang",
    name: "临沧勐库与邦东古茶山（冰岛·昔归）",
    zone: "xinan",
    province: "yn",
    provinceLabel: "云南省",
    coord: [99.918, 23.816],
    defaultZoom: 11,
    elevation: "750m – 2200m",
    landformAndSoil:
      "勐库大雪山南坡冰岛为变质花岗岩黑腐殖土；澜沧江畔邦东忙麓山昔归则为极其罕见的赤红烂石风化砂砾土（茶根穿石而生）。",
    microClimate:
      "全球罕见的双极垂直微域：勐库冰岛背倚三千二百米邦马大雪山终年积雪冷风，海拔 1650m 清冽高寒；昔归忙麓山则低伏于海拔 750–950m 澜沧江干热河谷江雾回旋带，一高寒一临江，同铸临沧双绝。",
    coreVillagesOrPeaks: ["冰岛老寨", "南迫·地界·坝歪·糯伍（冰岛五寨）", "邦东昔归忙麓山", "勐库小户赛", "普洱景谷秧塔村"],
    representativeTeaIds: ["lincang-bingdao", "lincang-xigui", "yunnan-yueguangbai"],
    terroirNote:
      "临沧被誉为『天下茶仓』，坐拥国家级良种勐库大叶种基因本源。明成化年间引种繁衍的冰岛老寨古茶，以入口即化的清凉冰糖甜韵独步茶界；低海拔奇迹昔归忙麓山藤条古树则凭『忙麓烂石』凝练出刚柔并济的兰花菌香；东南邻景谷秧塔大白茶更衍化出黑白相映的月光白奇茗。",
    famousSpots: [
      { name: "双江勐库冰岛老寨古茶园", locationHint: "临沧市双江县勐库镇冰岛村", note: "明成化二十一年（1485）引种古茶群落" },
      { name: "邦东昔归忙麓山澜沧江古渡茶坡", locationHint: "临沧市临翔区邦东乡昔归村", note: "低海拔藤条采养法活标本" },
    ],
    wiki: "勐库大叶茶",
    query: "Lincang Mengku snow mountain ancient tea Yunnan",
    photoUrl: "/photos/mtn-lincang.jpg",
  },
  {
    id: "mtn-fengqing",
    name: "临沧凤庆澜沧江滇红核心区",
    zone: "xinan",
    province: "yn",
    provinceLabel: "云南省",
    coord: [99.928, 24.585],
    defaultZoom: 11,
    elevation: "1600m – 2200m",
    landformAndSoil:
      "横断山系怒山南段澜沧江深切峡谷两岸，片岩与花岗岩发育的高山微酸性黄红壤，腐殖质深厚，富含茶树多酚合成所需的铁、铜辅酶元素。",
    microClimate:
      "北纬 24° 高原立体温润带，年均温 16.5℃，旱季阳光充足促进儿茶素大量积累，雨季澜沧江水汽升腾云海翻涌，昼夜温差逾 13℃。",
    coreVillagesOrPeaks: ["凤山镇（红茶厂旧址）", "鲁史古镇", "小湾镇锦秀村", "大寺乡", "诗礼古茶走廊"],
    representativeTeaIds: ["fengqing-dianhong-dajinzhen"],
    terroirNote:
      "凤庆（古称顺宁）小湾锦秀村屹立着树龄逾 3200 年的栽培型『锦秀茶尊』。1938 年抗战烽火中，冯绍裘先生携制茶专家南下顺宁，惊叹于凤庆大叶种茶多酚含量逾 35%、芽毫浓密金黄的天赋，遂试制出满披金毫、汤凝金圈的『滇红工夫』换取抗战外汇，开创云南红茶百年辉煌。",
    famousSpots: [
      { name: "凤庆滇红第一厂历史博物馆（1939旧址）", locationHint: "临沧市凤庆县凤山镇平村", note: "国家级工业遗产、冯绍裘创制滇红纪念地" },
      { name: "小湾锦秀村3200年古茶树王", locationHint: "临沧市凤庆县小湾镇锦秀村香竹箐", note: "世界现存最粗壮栽培型古茶树之一" },
    ],
    wiki: "滇红",
    query: "Fengqing Lancang River Yunnan black tea mountains",
    photoUrl: "/photos/mtn-fengqing.jpg",
  },
  {
    id: "mtn-mengding",
    name: "雅安蒙顶山与峨眉高山产区",
    zone: "xinan",
    province: "sc",
    provinceLabel: "四川省",
    coord: [103.056, 30.082],
    defaultZoom: 11,
    elevation: "800m – 1456m",
    landformAndSoil:
      "四川盆地西缘向青藏高原急剧抬升过渡带，白垩系紫红色砂泥岩与峨眉山玄武岩风化而成的微酸性紫色腐殖土及黄壤，矿质磷钾极为丰富。",
    microClimate:
      "古称『华西雨屏』与『漏天』，青衣江水汽遇邛崃山脉阻挡终年细雨霏霏，年均雨日逾 220 天，雾锁五峰（上清、菱角、毗罗、井泉、甘露），漫射柔光滋养极嫩春芽。",
    coreVillagesOrPeaks: ["蒙顶山上清峰皇茶园", "永兴古寺", "峨眉山万年寺与黑水寺", "雅安雨城南路藏茶坊", "黔南都匀螺蛳壳山"],
    representativeTeaIds: [
      "mengding-ganlu",
      "mengding-huangya",
      "emei-zhuyeqing",
      "yaan-kangzhuan",
      "duyun-maojian",
    ],
    terroirNote:
      "『扬子江心水，蒙山顶上茶。』西汉甘露年间（前53年）吴理真于蒙顶五峰间手植七株仙茶，开世界人工文字记载植茶之先河，自唐玄宗天宝元年至清末连续 1169 年岁贡皇室。山巅出甘露、黄芽仙品，山腰峨眉禅林出竹叶青，山脚雅安雨城则筑制康砖藏茶经茶马古道直抵雪域拉萨，与同处西南雨雾带的黔南都匀毛尖交相辉映。",
    famousSpots: [
      { name: "蒙顶山皇茶园（七株仙茶石栏遗址）", locationHint: "雅安市名山区蒙顶山上清峰下", note: "西汉吴理真植茶处与宋孝宗御封遗址" },
      { name: "峨眉山万年寺高山禅茶园", locationHint: "乐山市峨眉山风景区海拔1020m处", note: "1964年陈毅元帅命名竹叶青之地" },
    ],
    wiki: "蒙顶山",
    query: "Mount Mengding Emei tea garden Sichuan mist",
    photoUrl: "/photos/mtn-mengding.jpg",
  },
  {
    id: "mtn-anhua",
    name: "安化雪峰山与资江两岸冰碛岩区",
    zone: "jiangnan",
    province: "hn",
    provinceLabel: "湖南省",
    coord: [111.218, 28.378],
    defaultZoom: 11,
    elevation: "450m – 1200m",
    landformAndSoil:
      "地球罕见的六亿年前新元古代『南华大冰期』冰碛砾泥岩（占全球冰碛岩储量 85%），风化土壤富含硒、锌、铁、钒等微量矿物，松软砾石保水透气。",
    microClimate:
      "雪峰山脉北段崇山峻岭与资江百里画廊相互切割，山高谷深、林茶混交，春夏季温湿多雨，极利大叶种内含多糖蓄积及『冠突散囊菌』天然繁衍。",
    coreVillagesOrPeaks: ["芙蓉山", "高马二溪（皇家禁碑）", "云台山大叶种母本园", "黄石峒", "江南镇茶马古市", "宁乡沩山密印寺"],
    representativeTeaIds: ["anhua-qianliang", "anhua-fuzhuan", "weishan-maojian"],
    terroirNote:
      "世界冰碛岩上的黑茶王国：云台山野生大叶种与高马二溪古茶园生长于六亿年冰川遗迹之上，叶片肥厚柔软、茶多糖含量傲视同侪。资江水运与晋陕茶商在此催生出『世界茶王』花卷千两茶与金花璀璨的茯砖茶；东邻雪峰余脉沩山更以松烟闷黄工艺传世千年禅茶沩山毛尖。",
    famousSpots: [
      { name: "高马二溪清代『奉上严禁』古茶碑", locationHint: "益阳市安化县田庄乡高马二溪村", note: "道光四年贡茶皇家茶山铁证" },
      { name: "安化中国黑茶博物馆与永锡桥茶马古道", locationHint: "益阳市安化县东坪镇黄沙坪古茶市", note: "万里茶道湘茶集散码头" },
    ],
    wiki: "安化黑茶",
    query: "Anhua Xuefeng Mountains Zijiang dark tea Hunan",
    photoUrl: "/photos/mtn-anhua.jpg",
  },
  {
    id: "mtn-junshan",
    name: "岳阳洞庭湖君山岛与两湖江峡带",
    zone: "jiangnan",
    province: "hn",
    provinceLabel: "湖南省",
    coord: [113.005, 29.365],
    defaultZoom: 13,
    elevation: "45m – 78m（君山湖心岛） / 600m – 1100m（武陵峡江）",
    landformAndSoil:
      "君山岛由七十二座砂砾岩小峰突起于八百里洞庭湖心，表覆深厚肥沃的冲积湖砂腐殖壤，轻柔细润；北接鄂西武陵富硒砂页岩与赤壁冲积红壤。",
    microClimate:
      "浩瀚洞庭湖水四面环绕，湖雾晨昏不散、空气相对湿度终年逾 82%，春日暖湿无霜冻，漫射水光令茶芽肥硕挺直、金毫满披。",
    coreVillagesOrPeaks: ["君山金酒峰", "湘妃祠古茶园", "白鹤寺茶场", "恩施芭蕉侗族乡五峰山", "宜昌五峰渔洋关", "赤壁羊楼洞"],
    representativeTeaIds: ["junshan-yinzhen", "enshi-yulu", "yichang-yihong", "hubei-qingzhuan"],
    terroirNote:
      "『遥望洞庭山水翠，白银盘里一青螺。』君山岛方圆不足一平方公里，却因湖心沙洲水汽蒸腾，独产『金镶玉』黄芽茶魁首君山银针，冲泡时芽尖朝天三起三落蔚为奇观。沿长江与两湖水脉上溯鄂西武陵富硒茶谷与鄂南羊楼洞，更串起唐法蒸青活化石恩施玉露、峡江宜红工夫与万里茶道鼻祖赤壁青砖茶。",
    famousSpots: [
      { name: "洞庭湖君山银针御茶园遗址", locationHint: "岳阳市君山区洞庭湖君山岛景区内", note: "五代十国至清代贡茶核心园" },
      { name: "赤壁羊楼洞明清石板街（万里茶道源头）", locationHint: "咸宁市赤壁市赵李桥镇羊楼洞村", note: "鸡公车碾压出深槽之千年砖茶古镇" },
    ],
    wiki: "君山岛",
    query: "Junshan Island Dongting Lake Yueyang",
    photoUrl: "/photos/mtn-junshan.jpg",
  },
  {
    id: "mtn-wuzhou",
    name: "梧州苍梧六堡黑石山产区",
    zone: "huanan",
    province: "gx",
    provinceLabel: "广西壮族自治区",
    coord: [111.242, 23.845],
    defaultZoom: 11,
    elevation: "400m – 1050m",
    landformAndSoil:
      "寒武系砂页岩与黑云母花岗岩风化而成的酸性黄红腐殖土，黑石顶一带碎石嶙峋、富含有机铁与磷元素。",
    microClimate:
      "北回归线穿过苍梧群山，西江、桂江、浔江三江汇流，年均温 21.2℃，高温多雨、山溪密布，独特江雾与岩洞恒温恒湿环境极利陈化生出『槟榔香』。",
    coreVillagesOrPeaks: ["六堡镇黑石村（黑石山）", "塘平村", "山坪瑶寨", "不倚村", "合口茶船古码头", "南宁横州茉莉桂花乡"],
    representativeTeaIds: ["wuzhou-liubao", "xinhui-xiaoqinggan", "hengzhou-guihua-oolong"],
    terroirNote:
      "『茶船古道』始发港：苍梧六堡镇群峰深锁，原生六堡群体种芽叶肥厚柔软，制成的竹篓六堡茶凭『红、浓、陈、醇』及独一无二的松烟槟榔香，在清代随两广劳工下南洋祛瘴除湿，成为马来半岛锡矿华工的救命圣茶；西江一衣带水的南宁横州与广东新会更分别献出桂花茗香与天马柑普佳作。",
    famousSpots: [
      { name: "六堡镇黑石山古茶园与合口茶船古码头", locationHint: "梧州市苍梧县六堡镇", note: "清嘉庆年间二十四名茶产区核心" },
      { name: "梧州天然防空洞陈化茶窖", locationHint: "梧州市万秀区鸳江畔山体茶仓", note: "双蒸双压木板干仓与岩洞陈化基地" },
    ],
    wiki: "六堡茶",
    query: "Wuzhou Liubao tea mountain Guangxi",
    photoUrl: "/photos/mtn-wuzhou.jpg",
  },
  {
    id: "mtn-xinyang-lu-an",
    name: "大别山北麓（信阳五云两潭一寨 & 六安蝙蝠洞）",
    zone: "jiangbei",
    province: "ha",
    provinceLabel: "河南省",
    coord: [113.924, 32.085],
    defaultZoom: 10,
    elevation: "350m – 900m",
    landformAndSoil:
      "大别山花岗片麻岩、石英片岩及奥陶系灰岩风化而成的微酸性黄棕壤与乌砂土，皖西齐山蝙蝠洞富含天然蝙蝠粪磷氮有机肥。",
    microClimate:
      "秦淮南北气候分界线（北纬 31°–32°），淮河源头与淠河水库群水雾涵养，冬季瑞雪冰封杀虫蓄养、春季昼夜温差逾 14℃，茶芽氨基酸与芳香油高度富集。",
    coreVillagesOrPeaks: ["车云山", "集云山", "云雾山", "天云山·连云山", "黑龙潭·白龙潭·何家寨", "六安金寨齐云山蝙蝠洞", "霍山大化坪", "山东日照巨峰"],
    representativeTeaIds: [
      "xinyang-maojian",
      "luan-guapian",
      "huoshan-huangya",
      "rizhao-lvcha",
    ],
    terroirNote:
      "江北茶区的巅峰脊梁：豫南信阳『五云两潭一寨』高居淮河上游群峰，孕育白毫满披、熟栗香浓的信阳毛尖；东段皖西大别山金寨齐山蝙蝠洞与裕安独山则贡献出全世界唯一无芽无梗、单片炭火拉老火的六安瓜片与明清贡品霍山黄芽；更往东北延伸至黄海之滨北纬 35° 日照巨峰，共同演绎北方高纬厚叶茗茶传奇。",
    famousSpots: [
      { name: "车云山千佛塔百年毛尖老茶场", locationHint: "信阳市浉河区董家河镇车云山村", note: "1915巴拿马万国博览会金奖源地" },
      { name: "金寨齐云山蝙蝠洞核心内山瓜片茶园", locationHint: "六安市金寨县响洪甸水库畔齐山村", note: "正宗内山瓜片绝壁微域" },
    ],
    wiki: "大别山",
    query: "Dabie Mountains Xinyang Maojian tea hills",
    photoUrl: "/photos/mtn-xinyang-lu-an.jpg",
  },
  {
    id: "mtn-taiwan-gaoshan",
    name: "台湾中央山脉与鹿谷（阿里山·梨山·冻顶·坪林）",
    zone: "huanan",
    province: "tw",
    provinceLabel: "台湾省",
    coord: [120.796, 23.512],
    defaultZoom: 10,
    elevation: "650m – 2600m",
    landformAndSoil:
      "新生代造山运动隆起的板岩、页岩与砂岩崩积砾质壤土（梨山、阿里山），鹿谷冻顶山则为弱酸性棕红粘壤土，排水与保肥兼优。",
    microClimate:
      "北回归线横贯宝岛高山，太平洋与台湾海峡双洋湿润气流每日午后准时漫山成海（『午后二时云雾锁林』），高海拔紫外线过滤充分、年均温冷凉，令苦涩儿茶素骤降而果胶质倍增。",
    coreVillagesOrPeaks: ["嘉义阿里山（石棹/樟树湖）", "台中梨山与大禹岭", "南投鹿谷冻顶山", "新竹北埔峨眉（东方美人）", "新北坪林文山与台北木栅指南山", "南投鱼池日月潭"],
    representativeTeaIds: [
      "lugu-dongding-oolong",
      "alishan-jinxuan",
      "dongfang-meiren",
      "wenshan-baozhong",
      "muzha-tieguanyin",
      "sunmoonlake-hongyu",
    ],
    terroirNote:
      "清代自福建武夷、安溪跨海引种青心乌龙与铁观音苗木，在宝岛立体高山绽放出惊艳世界的乌龙与红茶谱系：从坪林文山包种的极致轻发酵清香、阿里山金萱的云雾奶兰韵、鹿谷冻顶与木栅铁观音的精湛包揉炭焙，到新竹丘陵小绿叶蝉著涎天成的东方美人，乃至日月潭薄荷肉桂香的红玉红茶，构成一部完整的台茶风土交响曲。",
    famousSpots: [
      { name: "嘉义阿里山石棹云之道高山茶园", locationHint: "台湾嘉义县竹崎乡中和村石棹（海拔1400m）", note: "云海琉璃光与青心乌龙/金萱梯田" },
      { name: "南投鹿谷乡冻顶村苏氏开山茶园与茶业文化馆", locationHint: "台湾南投县鹿谷乡冻顶巷", note: "清咸丰五年林凤池举人携武夷软枝乌龙栽植源地" },
    ],
    wiki: "台湾茶",
    query: "Alishan high mountain oolong tea plantations Taiwan",
    photoUrl: "/photos/mtn-taiwan-gaoshan.jpg",
  },
];
