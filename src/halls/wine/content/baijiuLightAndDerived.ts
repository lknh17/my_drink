import type { BaijiuAromaId, BaijiuMonograph } from "../types";

type Entry = {
  id: string;
  title: string;
  aroma: BaijiuAromaId;
  subSchool: string;
  terroirZoneId: string;
  province: BaijiuMonograph["province"];
  provinceLabel: string;
  originCore: string;
  waterAndMicroecology: string;
  grainFormula: string;
  quCraft: string;
  pitAndCycle: string;
  abvOptions: string;
  agingAndBlend: string;
  keyCompounds: string[];
  scores: [number, number];
  noseNotes: string[];
  palateNote: string;
  tagline: string;
  essayCore: string;
  coord: [number, number];
  nationalHonorTag?: string;
};

const aromaDefaults: Record<
  BaijiuAromaId,
  Pick<BaijiuMonograph, "liquorHueHex" | "liquorBeadNote" | "emptyCupNote">
> = {
  jiangxiang: { liquorHueHex: "#F6E7B2", liquorBeadNote: "微黄透明，酒珠细密持久", emptyCupNote: "空杯焦陈香经夜不散" },
  nongxiang: { liquorHueHex: "#F8EDC8", liquorBeadNote: "清亮微黄，酒花匀细", emptyCupNote: "空杯窖香与粮甜绵延" },
  qingxiang: { liquorHueHex: "#FCFAEE", liquorBeadNote: "无色清亮，酒花细匀利落", emptyCupNote: "空杯留有清雅曲香与粮香" },
  mixiang: { liquorHueHex: "#FFF8E8", liquorBeadNote: "晶亮微润，酒花轻柔", emptyCupNote: "空杯米香与乳酸清甜" },
  fengxiang: { liquorHueHex: "#FAEFCF", liquorBeadNote: "清亮微黄，酒花挺拔细密", emptyCupNote: "空杯蜜香、海陈香交叠" },
  jianxiang: { liquorHueHex: "#F5E5B7", liquorBeadNote: "微黄晶亮，酒花层次分明", emptyCupNote: "空杯酱陈与窖香递次显现" },
  dongxiang: { liquorHueHex: "#F3E4B4", liquorBeadNote: "微黄透亮，酒花细密耐看", emptyCupNote: "空杯草本、酸香与陈香悠长" },
  zhimaxiang: { liquorHueHex: "#F4E1AF", liquorBeadNote: "微黄透明，酒花紧密", emptyCupNote: "空杯焙炒芝麻与焦香持久" },
  texiang: { liquorHueHex: "#F8E9C2", liquorBeadNote: "清亮微黄，酒珠均匀", emptyCupNote: "空杯米粮、窖香与焦甜相融" },
  fuyuxiang: { liquorHueHex: "#F3E0AD", liquorBeadNote: "微黄晶莹，酒花丰满持久", emptyCupNote: "空杯浓、清、酱三香回旋" },
  laobaigan: { liquorHueHex: "#FBF7E9", liquorBeadNote: "无色清亮，酒花大而消散利索", emptyCupNote: "空杯粮香干净，醇香不杂" },
  chiweixiang: { liquorHueHex: "#F8E8C8", liquorBeadNote: "清亮微黄，酒花柔细", emptyCupNote: "空杯豉香、油脂香与米香相和" },
};

const regionalPairings: Record<string, string[]> = {
  "bj-fenjiu-qinghua30": ["晋菜过油肉", "平遥牛肉", "清蒸江鲜"], "bj-fenjiu-bofen": ["刀削面", "山西熏肉", "老醋花生"], "bj-zhuyeqing-chenniang": ["太原羊杂", "苦荞凉菜", "桂花山药"],
  "bj-baofeng-guose": ["汝州卤肉", "河南烩菜", "清蒸鲤鱼"], "bj-hongxing-gaozhao": ["北京爆肚", "京酱肉丝", "卤煮火烧"], "bj-niulanshan-jingdian": ["炙子烤肉", "酱肘子", "门钉肉饼"],
  "bj-tianyode-qingke": ["手抓藏羊", "牦牛肉干", "青稞饼"], "bj-jiangxiaobai-jinpai": ["重庆小面", "江津尖椒鸡", "豆花鱼"], "bj-huanghelou-chenxiang": ["武昌鱼", "排骨藕汤", "沔阳三蒸"],
  "bj-xifeng-hongxifeng": ["秦川腊汁肉", "葫芦鸡", "羊肉泡馍"], "bj-xifeng-lvping": ["腊牛羊肉", "臊子面", "锅盔夹肉"], "bj-taibai-jiuhai": ["秦岭腊肉", "岐山擀面皮", "烤羊排"],
  "bj-baiyunbian-20": ["荆州鱼糕", "潜江油焖虾", "沔阳三蒸"], "bj-kouzijiao-20": ["符离集烧鸡", "淮北酱牛肉", "臭鳜鱼"], "bj-langyatai-70": ["青岛脂渣", "酱骨海参", "炭烤鲅鱼"],
  "bj-yangshao-caitaofang": ["洛阳水席", "黄河鲤鱼", "灵宝羊肉汤"], "bj-dukang-jiuzu12": ["洛阳燕菜", "偃师银条", "牛肉汤"], "bj-dongjiu-baicaoxiang": ["黔北羊肉", "折耳根拌菜", "卤猪蹄"],
  "bj-dongjiu-guomi": ["遵义羊肉粉", "乌江豆腐鱼", "盐菜扣肉"], "bj-jingzhi-zhixiang": ["潍坊朝天锅", "葱烧海参", "九转大肠"], "bj-meilanchun-zhixiang": ["泰州早茶", "盐水鸭", "蟹黄汤包"],
  "bj-site-dongfangyun": ["藜蒿炒腊肉", "赣味粉蒸肉", "瓦罐汤"], "bj-linchuan-gongjiu": ["临川牛杂", "南丰鱼丝", "米粉蒸肉"], "bj-lidu-gaoliang-1955": ["南昌拌粉", "鄱阳湖鱼头", "莲花血鸭"],
  "bj-jiugui-neican": ["湘西腊肉", "血粑鸭", "酸汤鱼"], "bj-jiugui-zitan": ["吉首酸肉", "枞菌炖鸡", "腊味合蒸"], "bj-jiugui-huangtan": ["湘西酸鱼", "土匪鸭", "腊肉炒蕨粑"],
  "bj-hengshui-1915": ["北方酱骨", "驴肉火烧", "铜锅涮羊肉"], "bj-guilin-sanhua": ["桂林卤菜粉", "荔浦芋扣肉", "漓江啤酒鱼"], "bj-shiwan-yubingshao": ["顺德鱼生", "粤式烧鹅", "豉汁蒸排骨"],
  "bj-jinhui-18": ["陇南洋芋搅团", "秦岭腊排", "天水杂烩"], "bj-kinmen-gaoliang-58": ["金门高粱炝蟹", "红糟肉", "海蛎煎"],
};

const makeMonograph = (entry: Entry): BaijiuMonograph => {
  const defaults = aromaDefaults[entry.aroma];
  return {
    ...entry,
    aromaIntensityScore: entry.scores[0],
    cellarBodyScore: entry.scores[1],
    ...defaults,
    sensoryRadar: {
      esterAroma: entry.scores[0],
      grainSweetness: Math.max(62, Math.min(96, 76 + (entry.id.length % 17))),
      bodyRichness: entry.scores[1],
      smoothness: Math.max(68, Math.min(97, 83 + ((entry.id.length * 3) % 14))),
      emptyCupPersistence: Math.max(64, Math.min(98, Math.round((entry.scores[0] + entry.scores[1]) / 2) + (entry.id.length % 5))),
    },
    servingRitual: {
      vessel: entry.abvOptions.includes("67%") || entry.abvOptions.includes("70%") ? "8 mL 薄壁高度酒杯" : entry.aroma === "mixiang" || entry.aroma === "chiweixiang" ? "12 mL 高白瓷小盅" : "15 mL 郁金香型品鉴杯",
      tempCelsius: entry.aroma === "mixiang" || entry.aroma === "chiweixiang" ? "16–20℃" : "18–22℃",
      decantMinutes: entry.scores[1] >= 88 ? "醒杯 10–15 分钟" : "醒杯 3–8 分钟",
      foodPairings: regionalPairings[entry.id] ?? ["地方卤味", "清蒸河鲜", "时令冷盘"],
    },
    essay: `${entry.essayCore}其工艺从粮、曲、窖到蒸馏各有清晰脉络，酒体并非只以香气强弱取胜，而重在入口、展开与收束的连贯。品鉴宜先观酒花，再闻杯口与杯底，分小口含咽；佐味不过重，方能辨出粮香、发酵香和陈藏香的层次。这既是一方水土的味觉档案，也是在传统法度中持续校准的当代表达。`,
    wiki: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(entry.title)}`,
    query: `${entry.title} 酒厂 酿造工艺`,
    photoUrl: `/photos/${entry.id}.jpg`,
  };
};

export const baijiuLightAndDerived: BaijiuMonograph[] = [
  makeMonograph({
    id: "bj-fenjiu-qinghua30", title: "山西汾酒 · 青花 30 复兴版", aroma: "qingxiang", subSchool: "大曲清香·汾阳派", terroirZoneId: "zone-fenyang-xinghuacun", province: "sx", provinceLabel: "山西",
    originCore: "汾阳杏花村吕梁山东麓", waterAndMicroecology: "深层岩溶泉水清冽，黄土高原干爽气候利于地缸隔土发酵",
    nationalHonorTag: "老四大名酒 · 老八大名酒 · 十七大名酒 · 五届国家名酒", grainFormula: "晋中高粱·大麦·豌豆", quCraft: "大麦豌豆低温大曲，清茬曲、红心曲、后火曲配伍", pitAndCycle: "陶地缸清蒸二次清，地缸隔土约28日", abvOptions: "53% vol", agingAndBlend: "陶缸分级陈贮，以高年份调味酒盘勾",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯", "β-苯乙醇"], scores: [80, 74], noseNotes: ["青苹果", "豌豆曲香", "陈粮香"], palateNote: "入口清甜挺拔，中段有陈曲厚度，收口净爽", tagline: "清字当头，净字收尾",
    essayCore: "杏花村清香的价值，在于把“清蒸二次清”做成极有秩序的味觉。青花三十复兴版以老四大名酒血统为骨架，陈香克制，不以浓艳遮盖高粱本味；入口清甜，继而显出豌豆曲的坚果气息，尾段干净而有回甘。", coord: [111.78, 37.27],
  }),
  makeMonograph({
    id: "bj-fenjiu-bofen", title: "山西汾酒 · 黄盖玻汾 53°", aroma: "qingxiang", subSchool: "大曲清香·国民口粮", terroirZoneId: "zone-fenyang-xinghuacun", province: "sx", provinceLabel: "山西",
    originCore: "汾阳杏花村", waterAndMicroecology: "吕梁山泉与干燥温差共同塑造爽净发酵环境", nationalHonorTag: "老四大名酒 · 老八大名酒 · 十七大名酒 · 五届国家名酒", grainFormula: "高粱·大麦·豌豆", quCraft: "大麦豌豆低温大曲", pitAndCycle: "地缸发酵，清蒸二次清", abvOptions: "53% vol", agingAndBlend: "分级陶缸贮存后勾调",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯"], scores: [72, 60], noseNotes: ["青苹果", "面粉曲香", "高粱甜"], palateNote: "酒体直爽，入口甜净，尾段略有辛香", tagline: "一瓶玻汾，见清香本色",
    essayCore: "黄盖玻汾没有繁复包装，却把汾酒的基础技法呈现得格外直接。开杯是清新的乙酸乙酯果香，随后有高粱蒸煮香和大麦豌豆曲香；五十三度带来明快骨力，但落口不拖泥带水。它适合用作理解大曲清香坐标的第一杯。", coord: [111.78, 37.27],
  }),
  makeMonograph({
    id: "bj-zhuyeqing-chenniang", title: "山西汾酒 · 竹叶青陈酿", aroma: "qingxiang", subSchool: "名酒露酒·汾酒同源", terroirZoneId: "zone-fenyang-xinghuacun", province: "sx", provinceLabel: "山西",
    originCore: "汾阳杏花村", waterAndMicroecology: "以杏花村汾酒基酒承载草本浸提风味", nationalHonorTag: "老八大名酒 · 十七大名酒 · 清香基酒草本露酒宗师", grainFormula: "汾酒清香基酒·竹叶等十二味草本", quCraft: "大麦豌豆低温大曲基酒，草本分段浸提", pitAndCycle: "地缸清香基酒酿成后配制陈酿", abvOptions: "38%–45% vol", agingAndBlend: "基酒陈贮后与十二味草本浸液精调",
    keyCompounds: ["乙酸乙酯", "黄酮类", "萜烯类"], scores: [76, 64], noseNotes: ["竹叶清香", "陈皮", "清雅酒香"], palateNote: "入口微甜，草本清苦舒展，酒味托底而不抢", tagline: "十二味草本，一脉杏花酒骨",
    essayCore: "竹叶青是名酒露酒的经典样本，不应被误读为普通配制甜酒。它以汾酒为酒骨，将竹叶、陈皮、栀子等十二味草本分段浸提，清香基酒的净爽托住植物清苦与回甜。陈酿版的草木边缘更柔，杯底仍能辨认杏花村曲香。", coord: [111.78, 37.27],
  }),
  makeMonograph({
    id: "bj-baofeng-guose", title: "宝丰 · 国色清香", aroma: "qingxiang", subSchool: "中原大曲清香", terroirZoneId: "zone-zhongyuan-songhe", province: "ha", provinceLabel: "河南",
    originCore: "平顶山宝丰县", waterAndMicroecology: "汝河流域地下水与中原温湿气候孕育柔和曲香", nationalHonorTag: "十七大名酒", grainFormula: "高粱·小麦·大麦·豌豆", quCraft: "大麦豌豆中低温大曲", pitAndCycle: "清蒸清烧，地缸发酵", abvOptions: "50%–54% vol", agingAndBlend: "陶坛老熟，分级酒体盘勾",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯"], scores: [75, 67], noseNotes: ["梨香", "麦曲", "熟粮"], palateNote: "清香纯正，入口柔甜，中段比北派清香更圆", tagline: "中原清香，柔而有骨",
    essayCore: "宝丰是十七大名酒中重要的中原清香坐标。国色清香延续清蒸清烧与地缸发酵，香气不像汾派那样冷峻，而多一层熟粮甜和温润感；入口柔、净，乙酸乙酯果香与麦曲气息相互支撑，尾段略带中原酒常见的厚实。", coord: [113.05, 33.87],
  }),
  makeMonograph({
    id: "bj-hongxing-gaozhao", title: "红星 · 高照宗师 1949", aroma: "qingxiang", subSchool: "北京麸曲清香·二锅头", terroirZoneId: "zone-hengshui-beifang", province: "bj", provinceLabel: "北京",
    originCore: "北京二锅头传统产区", waterAndMicroecology: "燕山水系地下水与北方干爽环境形成利落酒体", grainFormula: "高粱·大麦·豌豆", quCraft: "麸曲与传统大曲协同培菌", pitAndCycle: "续糟发酵，掐头去尾专取第二锅酒", abvOptions: "53% vol", agingAndBlend: "陶坛陈贮，以老酒调味",
    keyCompounds: ["乙酸乙酯", "异戊醇"], scores: [77, 72], noseNotes: ["高粱", "苹果", "曲香"], palateNote: "入口有劲，甜感迅速展开，收束利索", tagline: "掐头去尾，只留京味酒心",
    essayCore: "红星高照宗师1949以“二锅头”摘酒法为核心：掐去前段刺激酒头，舍去后段寡淡酒尾，专取甑桶中段。它保留北京清香的高粱甜和直给劲道，又借陈贮削去新酒火气；闻香有苹果、曲粮与轻微陈香，入口强而不乱。", coord: [116.4, 39.9],
  }),
  makeMonograph({
    id: "bj-niulanshan-jingdian", title: "牛栏山 · 经典黄龙二锅头", aroma: "qingxiang", subSchool: "北京大曲清香·二锅头", terroirZoneId: "zone-hengshui-beifang", province: "bj", provinceLabel: "北京",
    originCore: "北京顺义牛栏山", waterAndMicroecology: "潮白河冲积层地下水清冽，北方气候利于缓慢老熟", grainFormula: "高粱·小麦·大麦·豌豆", quCraft: "传统大曲培菌糖化", pitAndCycle: "固态发酵，缓火蒸馏，掐头去尾", abvOptions: "52% vol", agingAndBlend: "陶坛陈藏，分级盘勾",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯"], scores: [74, 70], noseNotes: ["红果", "麦曲", "熟高粱"], palateNote: "入口醇甜，酒力清晰，中后段净爽", tagline: "潮白河畔的京派醇清",
    essayCore: "经典黄龙代表牛栏山较完整的大曲二锅头表达。潮白河水系赋予酒体清净底色，固态发酵与中段摘酒留下红果、麦曲和熟高粱气息；入口有北京酒的爽利力度，中段却不失醇甜。适度醒杯后，新酒的辛感收敛，粮香更清晰。", coord: [116.65, 40.13],
  }),
  makeMonograph({
    id: "bj-tianyode-qingke", title: "天佑德 · 出口型高原青稞", aroma: "qingxiang", subSchool: "高原青稞清香", terroirZoneId: "zone-lingnan-xiyu", province: "qh", provinceLabel: "青海",
    originCore: "青海互助河湟谷地", waterAndMicroecology: "祁连雪水、低温低氧与高原日照塑造清冽发酵轮廓", grainFormula: "青藏裸青稞·豌豆", quCraft: "青稞豌豆中低温大曲", pitAndCycle: "清蒸清烧，陶地缸低温发酵", abvOptions: "46% vol", agingAndBlend: "陶坛缓慢老熟后调配",
    keyCompounds: ["乙酸乙酯", "β-苯乙醇"], scores: [68, 61], noseNotes: ["青稞麦香", "雪梨", "青草"], palateNote: "入口清冽微甜，麦谷感突出，尾段干爽", tagline: "一杯青稞，饮见高原风",
    essayCore: "天佑德把清香法移植到青藏高原，却不掩盖裸青稞的谷物个性。祁连雪水与河湟谷地低温环境让发酵节奏更缓，杯中有青稞麦香、雪梨和轻微青草气；出口型酒体收束清爽，甜度克制，适合辨识高粱之外的清香粮谷谱系。", coord: [101.96, 36.84],
  }),
  makeMonograph({
    id: "bj-jiangxiaobai-jinpai", title: "江小白 · 金标纯粮高粱", aroma: "qingxiang", subSchool: "川渝小曲清香", terroirZoneId: "zone-luzhou-laojiao", province: "cq", provinceLabel: "重庆",
    originCore: "重庆江津长江河谷", waterAndMicroecology: "长江河谷温润，根霉与酵母协作形成小曲清甜", grainFormula: "单一高粱", quCraft: "根霉小曲糖化发酵", pitAndCycle: "箱式培菌，固态小曲发酵，清蒸清烧", abvOptions: "40%–52% vol", agingAndBlend: "陶坛短期老熟，净爽型勾调",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯"], scores: [64, 55], noseNotes: ["新鲜高粱", "梨", "米曲"], palateNote: "轻快清甜，刺激度低，尾味干净", tagline: "长江小曲，一口纯粮清甜",
    essayCore: "江津小曲是川渝清香的重要支流。金标纯粮江小白以单一高粱和根霉小曲为轴，培菌糖化快，香气不像大曲清香那样强调陈曲，而偏向新鲜粮香、梨果与轻柔乳香；入口轻快，甜感先行，尾段净短，展示小曲酒的日常尺度。", coord: [106.26, 29.28],
  }),
  makeMonograph({
    id: "bj-huanghelou-chenxiang", title: "黄鹤楼 · 陈香 1979", aroma: "qingxiang", subSchool: "南派大曲清香", terroirZoneId: "zone-lianghu-ganjiang", province: "hb", provinceLabel: "湖北",
    originCore: "武汉及随州大洪山水系", waterAndMicroecology: "江汉湿润气候使清香发酵更显圆润与陈曲感", nationalHonorTag: "十七大名酒", grainFormula: "高粱·大麦·豌豆", quCraft: "多种温区大曲配伍", pitAndCycle: "地缸发酵，清蒸二次清", abvOptions: "53% vol", agingAndBlend: "陶坛陈贮，老酒增香调味",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯", "乙酸"], scores: [79, 73], noseNotes: ["陈曲", "青梅", "熟粮"], palateNote: "清香中带陈厚，入口绵甜，尾净而长", tagline: "清香南渡，陈而不重",
    essayCore: "黄鹤楼以“南派大清香”区别于北方清香：法度仍是地缸与清蒸二次清，但江汉湿润环境和多温区曲药令酒体更圆、更陈。杯口有青梅与熟粮，静置后陈曲香上升；入口绵甜，中段有适度酸感撑起结构，收口仍守住清净。", coord: [114.3, 30.59],
  }),
  makeMonograph({
    id: "bj-xifeng-hongxifeng", title: "西凤酒 · 红西凤", aroma: "fengxiang", subSchool: "凤香·酒海陈藏", terroirZoneId: "zone-fengxiang-weibei", province: "sn", provinceLabel: "陕西",
    originCore: "凤翔柳林镇渭北台塬", waterAndMicroecology: "渭北黄土与温差环境，柳林井水矿物度适中", nationalHonorTag: "老四大名酒 · 老八大名酒 · 十七大名酒 · 四届国家名酒", grainFormula: "高粱·大麦·豌豆", quCraft: "大麦豌豆中高温大曲", pitAndCycle: "新泥窖短周期发酵，立窖破窖顶窖插窖轮转", abvOptions: "52% vol", agingAndBlend: "荆条猪血桑皮纸酒海陈藏，五星级老酒盘勾",
    keyCompounds: ["乙酸乙酯", "己酸乙酯", "异戊醇"], scores: [87, 85], noseNotes: ["蜜香", "杏仁", "酒海陈香"], palateNote: "醇甜挺拔，酸甜均衡，尾段有凤香特有的收敛感", tagline: "不偏清浓，一海藏凤",
    essayCore: "红西凤的关键不只在窖，更在“酒海”。短周期新泥窖避免浓香过重，荆条编胎、桑皮纸与猪血灰裱糊的大酒海让酒体缓慢呼吸，生成蜜香、坚果与独特陈藏气息。入口挺拔，清香的爽、浓香的甜与适度收敛感并存。", coord: [107.39, 34.52],
  }),
  makeMonograph({
    id: "bj-xifeng-lvping", title: "西凤酒 · 高脖绿瓶 55°", aroma: "fengxiang", subSchool: "凤香·传统高度", terroirZoneId: "zone-fengxiang-weibei", province: "sn", provinceLabel: "陕西",
    originCore: "凤翔柳林镇", waterAndMicroecology: "渭北台塬干燥温差与井泉水共同塑造硬朗酒骨", nationalHonorTag: "老四大名酒 · 老八大名酒 · 十七大名酒 · 四届国家名酒", grainFormula: "高粱·大麦·豌豆", quCraft: "中高温大曲", pitAndCycle: "新泥窖发酵，多窖轮转续楂", abvOptions: "55% vol", agingAndBlend: "传统酒海陈贮后勾调",
    keyCompounds: ["乙酸乙酯", "己酸乙酯"], scores: [82, 77], noseNotes: ["青杏", "蜜香", "麦曲"], palateNote: "起口凌厉，继而回甜，尾段干净微涩", tagline: "绿瓶高脖，老派凤香",
    essayCore: "高脖绿瓶是理解传统西凤骨力的直观样本。五十五度把青杏、麦曲、蜜香和微微坚果气放大，入口先有凌厉酒力，随后甜感回升，尾段带一点恰到好处的涩收。它不追求过分柔化，酒海陈藏留下的气息也更朴素直接。", coord: [107.39, 34.52],
  }),
  makeMonograph({
    id: "bj-taibai-jiuhai", title: "太白酒 · 陈年酒海珍藏", aroma: "fengxiang", subSchool: "秦岭凤香·酒海陈藏", terroirZoneId: "zone-fengxiang-weibei", province: "sn", provinceLabel: "陕西",
    originCore: "眉县太白山北麓", waterAndMicroecology: "秦岭雪水清冽，山前冲积土与温差利于稳态发酵", grainFormula: "高粱·大麦·豌豆", quCraft: "中温与偏高温大曲配伍", pitAndCycle: "泥窖续楂，短周期分层发酵", abvOptions: "50%–52% vol", agingAndBlend: "传统大酒海多年陈藏",
    keyCompounds: ["乙酸乙酯", "己酸乙酯", "乳酸乙酯"], scores: [80, 78], noseNotes: ["山果", "蜜蜡", "酒海"], palateNote: "醇甜柔和，凤香清晰，尾段温暖悠长", tagline: "太白雪水，秦地酒海",
    essayCore: "太白酒承接关中凤香传统，又因秦岭北麓水土显得柔和。陈年酒海珍藏以荆条酒海的微氧陈化为看点，山果、蜜蜡和熟粮香层层出现；入口没有高脖绿瓶那般锐利，却保留凤香应有的挺劲，尾段温暖，陈藏气息安静绵长。", coord: [107.76, 34.27],
  }),
  makeMonograph({
    id: "bj-baiyunbian-20", title: "白云边 · 二十年陈酿", aroma: "jianxiang", subSchool: "酱浓一步兼香", terroirZoneId: "zone-lianghu-ganjiang", province: "hb", provinceLabel: "湖北",
    originCore: "荆州松滋长江支流地带", waterAndMicroecology: "江汉湿地温润微生物与丘陵泉水形成酱浓衔接", nationalHonorTag: "国家优质酒（53优）· 兼香型代表", grainFormula: "高粱·小麦", quCraft: "高温大曲与中温曲协同", pitAndCycle: "高温堆积后入泥窖，一步法兼取酱浓", abvOptions: "42%–53% vol", agingAndBlend: "陶坛陈贮，多轮次基酒分型盘勾",
    keyCompounds: ["己酸乙酯", "乙酸乙酯", "四甲基吡嗪"], scores: [89, 90], noseNotes: ["焦粮", "窖香", "陈曲"], palateNote: "前段酱陈，中段窖甜充盈，尾段回甘", tagline: "一步入窖，酱浓同杯",
    essayCore: "白云边的辨识度来自“酱浓一步法”：高温制曲与堆积先建立焦粮、陈曲气息，再入泥窖生成丰沛窖香，不靠两种成品酒简单拼合。二十年陈酿前段偏酱，中段浓甜抬升，尾段又以微酸回甘收束，转折清楚却不割裂。", coord: [111.77, 30.18],
  }),
  makeMonograph({
    id: "bj-kouzijiao-20", title: "口子窖 · 二十年型", aroma: "jianxiang", subSchool: "多曲三步兼香", terroirZoneId: "zone-bozhou-huaihe", province: "ah", provinceLabel: "安徽",
    originCore: "淮北濉溪古镇", waterAndMicroecology: "濉河地下水与淮北温湿季候支撑多菌群发酵", nationalHonorTag: "国家优质酒（53优）· 多曲兼香代表", grainFormula: "高粱·小麦·大麦·豌豆", quCraft: "高温曲、中温曲与强化曲多曲并用", pitAndCycle: "分段投料、分型发酵、分层蒸馏三步兼香", abvOptions: "41%–52% vol", agingAndBlend: "陶坛分型陈储后按层次勾调",
    keyCompounds: ["己酸乙酯", "乙酸乙酯", "乳酸乙酯"], scores: [86, 87], noseNotes: ["窖香", "烘粮", "果脯"], palateNote: "入口柔甜，中段浓酱交织，尾净带陈香", tagline: "多曲三步，兼而有序",
    essayCore: "口子窖不是把浓酱两端强行并置，而以多曲、多粮和分步操作让香气在发酵中自然交汇。二十年型开杯先见窖香与果脯甜，温度上升后烘粮和陈曲出现；入口柔顺，中段厚度渐增，尾段没有浓香的黏滞，也少酱香的焦苦。", coord: [116.8, 33.91],
  }),
  makeMonograph({
    id: "bj-langyatai-70", title: "琅琊台 · 70°原酒", aroma: "jianxiang", subSchool: "海派浓酱兼香·高度原酒", terroirZoneId: "zone-zhongyuan-songhe", province: "sd", provinceLabel: "山东",
    originCore: "青岛西海岸琅琊台", waterAndMicroecology: "黄海季风、沿海水土与较高酸度发酵构成强劲酒体", grainFormula: "高粱·小麦", quCraft: "中高温大曲与功能曲", pitAndCycle: "泥窖高酸发酵，分层蒸馏取高度酒心", abvOptions: "70% vol", agingAndBlend: "陶坛储存高度原酒，限量灌装",
    keyCompounds: ["己酸乙酯", "乙酸乙酯", "有机酸"], scores: [93, 94], noseNotes: ["熟果", "海风矿物感", "焦粮"], palateNote: "高度酒力强劲，酸酯饱满，咽后回甜而不空", tagline: "七十度海风，浓酱一线",
    essayCore: "琅琊台七十度原酒以高酸高酯和极高酒度著称，是观察山东高度粮食酒结构的放大镜。闻香有熟果、焦粮与轻微矿物感，入口热力迅速铺开，却不是单纯辛辣；充足酸度托住酯香，咽下后仍有甜味与陈曲回声，宜极小口慢品。", coord: [120.02, 35.62],
  }),
  makeMonograph({
    id: "bj-dongjiu-baicaoxiang", title: "董酒 · 佰草香", aroma: "dongxiang", subSchool: "百草双曲·双醅串蒸", terroirZoneId: "zone-xiangxi-zunyi-karst", province: "gz", provinceLabel: "贵州",
    originCore: "遵义董公寺喀斯特谷地", waterAndMicroecology: "喀斯特泉水与黔北湿润菌群共同形成高酸复合香", nationalHonorTag: "老八大名酒 · 十七大名酒", grainFormula: "高粱·小麦·大米及多味本草", quCraft: "小曲小窖制酒醅，大曲大窖制香醅，百草入曲", pitAndCycle: "大小曲双醅发酵，以香醅串蒸酒醅", abvOptions: "54% vol", agingAndBlend: "陶坛长期陈储，香醅酒与酒醅酒分级勾调",
    keyCompounds: ["丁酸乙酯", "乳酸乙酯", "萜烯类"], scores: [94, 95], noseNotes: ["草本", "酸香", "陈窖"], palateNote: "入口浓郁，药草清苦与酸鲜交织，回味深长", tagline: "百草入曲，双醅成董",
    essayCore: "佰草香把董香型最难复制的逻辑完整展开：小曲小窖酿酒醅，大曲大窖育香醅，再以双醅串蒸汇合。草本并非浮在酒面的药味，而与高酸、粮香和窖陈融为一体；入口浓郁，继而出现清苦、酸鲜与回甘，空杯变化尤其丰富。", coord: [106.9, 27.72],
  }),
  makeMonograph({
    id: "bj-dongjiu-guomi", title: "董酒 · 经典红董国密", aroma: "dongxiang", subSchool: "国密董香·双醅串蒸", terroirZoneId: "zone-xiangxi-zunyi-karst", province: "gz", provinceLabel: "贵州",
    originCore: "遵义汇川董公寺", waterAndMicroecology: "黔北湿润山谷与岩溶泉滋养复杂曲窖微生态", grainFormula: "高粱·小麦·大米及传统本草", quCraft: "大小曲并用，传统本草制曲", pitAndCycle: "小窖酒醅、大窖香醅分别发酵后串蒸", abvOptions: "54% vol", agingAndBlend: "陶坛陈化，分级董香基酒盘勾",
    keyCompounds: ["丁酸乙酯", "乙酸乙酯", "有机酸"], scores: [90, 91], noseNotes: ["本草", "熟粮", "窖陈"], palateNote: "醇厚酸润，草本感克制，尾段有甘凉感", tagline: "红董一杯，国密一脉",
    essayCore: "经典红董国密比佰草香更适合作为董香入门：同样依循大小曲、大小窖与双醅串蒸，草本表达却更收敛。开杯先是熟粮和酸香，稍候才显出药草、陈窖与淡淡凉意；入口厚而不甜腻，尾段酸润回甘，空杯有独特的陈香。", coord: [106.9, 27.72],
  }),
  makeMonograph({
    id: "bj-jingzhi-zhixiang", title: "一品景芝 · 芝香真20年", aroma: "zhimaxiang", subSchool: "鲁派芝麻香·开山流派", terroirZoneId: "zone-zhongyuan-songhe", province: "sd", provinceLabel: "山东",
    originCore: "潍坊安丘景芝镇", waterAndMicroecology: "潍河水系与北方高氮配料环境利于含氮杂环物生成", nationalHonorTag: "国家优质酒（53优）· 芝麻香型开创代表", grainFormula: "高粱·小麦·麸皮", quCraft: "中高温大曲配麸曲，多菌种高温培菌", pitAndCycle: "砖泥复合窖，高温堆积、高温发酵", abvOptions: "53% vol", agingAndBlend: "陶坛长期陈贮，以老芝香调味酒勾调",
    keyCompounds: ["四甲基吡嗪", "呋喃类", "乙酸乙酯"], scores: [92, 90], noseNotes: ["焙炒芝麻", "坚果", "焦粮"], palateNote: "入口焦香鲜明，中段醇厚，尾段干爽微苦", tagline: "芝麻未入酒，焦香自曲来",
    essayCore: "景芝是芝麻香型的开山坐标，酒中并不加入芝麻，其焙炒气来自高氮配料、高温堆积与发酵生成的吡嗪类物质。真二十年把焦香磨得细致：先闻烤芝麻和坚果，继而是焦粮、曲香；入口厚实鲜明，尾段微苦而干爽。", coord: [119.22, 36.43],
  }),
  makeMonograph({
    id: "bj-meilanchun-zhixiang", title: "梅兰春 · 芝麻香珍藏", aroma: "zhimaxiang", subSchool: "江淮高温芝麻香", terroirZoneId: "zone-suqian-jianghuai", province: "js", provinceLabel: "江苏",
    originCore: "泰州里下河水网地带", waterAndMicroecology: "江淮水网湿润气候令高温焦香兼具柔和水感", grainFormula: "高粱·小麦·麸皮", quCraft: "高温大曲与麸曲复合", pitAndCycle: "高温堆积，泥底砖窖发酵，分层蒸馏", abvOptions: "42%–52% vol", agingAndBlend: "陶坛陈储，芝香调味酒定型",
    keyCompounds: ["四甲基吡嗪", "吡嗪类", "己酸乙酯"], scores: [86, 82], noseNotes: ["烤芝麻", "麦壳", "焦糖"], palateNote: "焦香柔润，入口微甜，江淮绵感明显", tagline: "泰州高温曲，水乡芝麻香",
    essayCore: "梅兰春把北方芝麻香的高温焦香带到江淮水乡。高温曲、麸曲和堆积发酵带出烤芝麻、麦壳与焦糖气息，湿润环境又令入口更柔；它不像景芝那样峻烈，焦香与绵甜相互包裹，尾段仍保持干净，是芝香南北差异的好对照。", coord: [119.92, 32.46],
  }),
  makeMonograph({
    id: "bj-site-dongfangyun", title: "四特酒 · 东方韵弘韵", aroma: "texiang", subSchool: "赣派特香·红褚条石窖", terroirZoneId: "zone-lianghu-ganjiang", province: "jx", provinceLabel: "江西",
    originCore: "樟树赣江中游", waterAndMicroecology: "赣江水、红褚条石与湿热气候形成独特复合窖香", nationalHonorTag: "国家优质酒（53优）· 特香型代表", grainFormula: "整粒大米", quCraft: "大麦麸皮制大曲，面粉粘结", pitAndCycle: "红褚条石窖发酵，整粒大米续楂混蒸", abvOptions: "45%–52% vol", agingAndBlend: "陶坛陈贮，多等级特香酒盘勾",
    keyCompounds: ["丙酸乙酯", "己酸乙酯", "四甲基吡嗪"], scores: [88, 85], noseNotes: ["米粮", "蜜甜", "窖石"], palateNote: "入口圆润，米甜、窖香与焦香连续展开", tagline: "整粒大米，三香不靠",
    essayCore: "四特以整粒大米、红褚条石窖和独特大曲构成不可替换的特香路径。东方韵弘韵开杯有米粮甜、蜂蜜和轻微焦香，随后显出条石窖带来的复合气息；入口圆润，清、浓、酱的感受似乎都在，却又不能归入任何一类。", coord: [115.55, 28.06],
  }),
  makeMonograph({
    id: "bj-linchuan-gongjiu", title: "临川贡酒 · 特香陈酿", aroma: "texiang", subSchool: "赣抚特香", terroirZoneId: "zone-lianghu-ganjiang", province: "jx", provinceLabel: "江西",
    originCore: "抚州临川抚河流域", waterAndMicroecology: "抚河软水与赣东湿润环境赋予米粮酒柔甜质感", grainFormula: "大米·高粱", quCraft: "大曲与功能曲复合培菌", pitAndCycle: "条石窖与泥底发酵，续糟混蒸", abvOptions: "45%–52% vol", agingAndBlend: "陶坛陈贮后分级勾调",
    keyCompounds: ["丙酸乙酯", "乙酸乙酯", "己酸乙酯"], scores: [80, 77], noseNotes: ["米糕", "花蜜", "窖香"], palateNote: "柔甜顺口，中段复合香起，尾段洁净", tagline: "抚河米香，赣东特韵",
    essayCore: "临川贡酒是赣抚特香的地方名酿，以抚河水和米粮甜感见长。杯中先有米糕、花蜜般的柔香，温度升高后窖香与轻微焦甜浮现；入口顺滑，中段复合香不追求夸张，尾段洁净。它展示了特香型在樟树核心之外的地域变体。", coord: [116.36, 27.98],
  }),
  makeMonograph({
    id: "bj-jiugui-neican", title: "酒鬼酒 · 52°内参", aroma: "fuyuxiang", subSchool: "武陵馥郁香·大小曲兼用", terroirZoneId: "zone-xiangxi-zunyi-karst", province: "hn", provinceLabel: "湖南",
    originCore: "湘西吉首武陵山腹地", waterAndMicroecology: "武陵山泉、洞藏环境与湿润山地菌群造就多段香气", nationalHonorTag: "国家优质酒（53优）· 湘泉／酒鬼馥郁香传承", grainFormula: "高粱·糯米·大米·小麦·玉米", quCraft: "小曲培菌糖化，大曲续糟增香", pitAndCycle: "小曲糖化后入泥窖续糟发酵，分层蒸馏", abvOptions: "52% vol", agingAndBlend: "陶坛与洞藏老熟，高年份调味酒盘勾",
    keyCompounds: ["己酸乙酯", "乙酸乙酯", "四甲基吡嗪"], scores: [94, 94], noseNotes: ["花果", "窖甜", "焦陈"], palateNote: "前浓、中清、后酱，转折连贯，余味深长", tagline: "一口三香，武陵层峦",
    essayCore: "内参把馥郁香“前浓、中清、后酱”的时间结构表现得最完整。小曲先糖化，大曲续糟增香，湘西泥窖与洞藏共同叠出花果、窖甜和焦陈；入口甜润丰厚，中段忽然清爽，咽后酱陈回返。三香不是并排标签，而是随饮咽次序展开。", coord: [109.74, 28.31],
  }),
  makeMonograph({
    id: "bj-jiugui-zitan", title: "酒鬼酒 · 紫坛二十年", aroma: "fuyuxiang", subSchool: "武陵馥郁香·洞藏陈酿", terroirZoneId: "zone-xiangxi-zunyi-karst", province: "hn", provinceLabel: "湖南",
    originCore: "湘西吉首", waterAndMicroecology: "武陵山喀斯特泉水与恒温洞藏缓慢柔化酒体", nationalHonorTag: "国家优质酒（53优）· 湘泉／酒鬼馥郁香传承", grainFormula: "高粱·糯米·大米·小麦·玉米", quCraft: "根霉小曲与大曲先后协作", pitAndCycle: "小曲糖化、大曲续糟泥窖发酵", abvOptions: "52% vol", agingAndBlend: "陶坛洞藏，二十年型酒体设计",
    keyCompounds: ["己酸乙酯", "乙酸乙酯", "乳酸乙酯"], scores: [90, 89], noseNotes: ["熟果", "蜜香", "陈曲"], palateNote: "入口绵甜，中段清爽，后段略现焦陈", tagline: "紫坛洞藏，三香渐次",
    essayCore: "紫坛二十延续酒鬼酒大小曲并用与泥窖续糟的核心，却比内参更亲和。熟果和蜜香先到，入口绵甜；中段清香感削去黏腻，后段再浮出轻柔焦陈。洞藏使各段边界更圆，既保留馥郁香的三段式辨识度，也适合席间慢饮。", coord: [109.74, 28.31],
  }),
  makeMonograph({
    id: "bj-hengshui-1915", title: "衡水老白干 · 1915 金奖纪念 67°", aroma: "laobaigan", subSchool: "地缸老五甑·高度老白干", terroirZoneId: "zone-hengshui-beifang", province: "he", provinceLabel: "河北",
    originCore: "衡水滏阳河冲积平原", waterAndMicroecology: "北方深层地下水与干爽气候利于地缸纯净发酵", nationalHonorTag: "国家优质酒（53优）· 老白干香型代表", grainFormula: "高粱·纯小麦曲", quCraft: "纯小麦中温大曲", pitAndCycle: "陶地缸老五甑，续糟混蒸，分层摘酒", abvOptions: "67% vol", agingAndBlend: "陶坛长储，高度酒体分级盘勾",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯", "高级醇"], scores: [79, 88], noseNotes: ["高粱", "麦曲", "青果"], palateNote: "烈而不冲，干爽醇厚，咽后回甘迅速", tagline: "六十七度，烈净并立",
    essayCore: "衡水老白干一九一五纪念酒以六十七度展示“烈而不冲”的技术难度。纯小麦曲、地缸老五甑和分层摘酒使酒体少泥味、粮香清楚，小分子醇酯构成干爽骨架；入口热力强，却迅速转为醇甜，咽后不黏，适合极小杯体会。", coord: [115.67, 37.74],
  }),
  makeMonograph({
    id: "bj-guilin-sanhua", title: "桂林三花 · 象山岩洞老酒", aroma: "mixiang", subSchool: "小曲米香·岩洞陈酿", terroirZoneId: "zone-lingnan-xiyu", province: "gx", provinceLabel: "广西",
    originCore: "桂林漓江喀斯特岩溶区", waterAndMicroecology: "漓江软水与恒温岩洞形成细柔米香和稳定老熟环境", nationalHonorTag: "国家优质酒（53优）· 米香型代表", grainFormula: "优质大米", quCraft: "根霉小曲培菌糖化", pitAndCycle: "半固态小曲发酵，釜式蒸馏", abvOptions: "38%–52% vol", agingAndBlend: "陶坛入象山岩洞恒温陈藏",
    keyCompounds: ["β-苯乙醇", "乳酸乙酯", "乙酸乙酯"], scores: [68, 66], noseNotes: ["蒸米", "桂花", "乳酸"], palateNote: "蜜甜柔滑，米香纯净，尾段略带花香", tagline: "漓江三花，岩洞一坛",
    essayCore: "桂林三花酒以大米、根霉小曲和漓江水构成米香型的标准答案。“三花”指酒花层叠的传统观察，象山岩洞则以恒温高湿帮助陶坛缓慢老熟。杯中蒸米、桂花和轻柔乳酸香相伴，入口蜜甜柔滑，酒体不厚重，却有干净悠长的米粮余韵。", coord: [110.29, 25.27],
  }),
  makeMonograph({
    id: "bj-shiwan-yubingshao", title: "石湾玉冰烧 · 清雅洞藏", aroma: "chiweixiang", subSchool: "岭南豉香·肥肉酝浸", terroirZoneId: "zone-lingnan-xiyu", province: "gd", provinceLabel: "广东",
    originCore: "佛山石湾珠江三角洲", waterAndMicroecology: "岭南湿热水网适合小曲发酵，洞藏环境柔化油脂香", grainFormula: "大米·小曲·陈年肥猪肉", quCraft: "酒饼小曲糖化发酵", pitAndCycle: "大米液态发酵蒸馏，酒液经陈肥肉酝浸", abvOptions: "29.5%–33% vol", agingAndBlend: "肥肉酝浸吸附杂味，再经陶缸洞藏",
    keyCompounds: ["β-苯乙醇", "脂肪酸乙酯", "乳酸乙酯"], scores: [70, 65], noseNotes: ["米香", "豉香", "油脂甜香"], palateNote: "入口柔滑微甜，豉脂香清雅，收口洁净", tagline: "肥肉酝浸，玉洁冰清",
    essayCore: "石湾玉冰烧最独特的步骤，是蒸馏米酒以陈年肥猪肉酝浸。脂肪吸附杂味，并在时间中生成细柔脂香，故酒液反而“玉洁冰清”，不见油腻。清雅洞藏版有蒸米、豉香与淡淡乳脂甜，入口低度柔滑，冰镇过度反会压住层次。", coord: [113.11, 23.0],
  }),
  makeMonograph({
    id: "bj-yangshao-caitaofang", title: "仰韶 · 彩陶坊天时", aroma: "jianxiang", subSchool: "陶融香·九粮四陶", terroirZoneId: "zone-zhongyuan-songhe", province: "ha", provinceLabel: "河南",
    originCore: "河南渑池仰韶文化核心区", waterAndMicroecology: "黄河支流矿物水、豫西黄土与陶屋陶泥微生态共同塑造圆润复合香", grainFormula: "高粱·小麦·大米·糯米·玉米等九粮", quCraft: "多温曲协同糖化生香", pitAndCycle: "陶屋制曲、陶泥发酵、陶甑蒸馏、陶坛陈藏的四陶工艺", abvOptions: "53% vol", agingAndBlend: "多香型基酒陶坛分储，以陈年调味酒盘勾",
    keyCompounds: ["己酸乙酯", "乙酸乙酯", "四甲基吡嗪"], scores: [88, 91], noseNotes: ["熟果", "陶陈", "焦粮"], palateNote: "入口绵甜，浓酱清三香递进，陶陈收束圆润", tagline: "九粮入陶，一杯融汇中原",
    essayCore: "彩陶坊天时以“九粮四陶”建立陶融香的地域辨识度。多粮提供宽阔甜香，陶泥发酵和陶坛陈藏令浓、酱、清感受自然交叠；闻香先见熟果与粮甜，温度上升后焦粮和陶陈出现，入口圆厚却保持收口清晰。", coord: [111.76, 34.77],
  }),
  makeMonograph({
    id: "bj-dukang-jiuzu12", title: "洛阳杜康 · 酒祖杜康 12窖区", aroma: "nongxiang", subSchool: "玄武古泉·桑泥古窖浓香", terroirZoneId: "zone-zhongyuan-songhe", province: "ha", provinceLabel: "河南",
    originCore: "河南洛阳伊川杜康村", waterAndMicroecology: "玄武古泉水与富含腐殖质的桑泥老窖形成甜熟窖香", grainFormula: "高粱·小麦·大米·糯米·玉米", quCraft: "纯小麦中高温大曲", pitAndCycle: "桑泥古窖续糟发酵，分层起糟、缓火蒸馏", abvOptions: "52% vol", agingAndBlend: "十二窖区优级基酒分坛陈贮后组合",
    keyCompounds: ["己酸乙酯", "乳酸乙酯", "丁酸乙酯"], scores: [86, 88], noseNotes: ["桑椹", "熟梨", "甜窖"], palateNote: "绵甜醇厚，果香与窖香相融，尾段甘净", tagline: "玄武泉润粮，桑泥窖生香",
    essayCore: "酒祖杜康十二窖区以伊川玄武古泉与桑泥窖池为核心。桑枝腐殖土参与窖泥培育，使浓香在熟梨、甜窖之外带轻柔桑果气息；多粮入口绵甜，中段厚度逐渐抬升，尾段仍保留中原酒的爽利骨架。", coord: [112.43, 34.42],
  }),
  makeMonograph({
    id: "bj-jinhui-18", title: "金徽 · 十八年正能量", aroma: "nongxiang", subSchool: "秦岭南麓低温甜润浓香", terroirZoneId: "zone-fengxiang-weibei", province: "gs", provinceLabel: "甘肃",
    originCore: "甘肃陇南徽县秦岭南麓", waterAndMicroecology: "嘉陵江上游山泉、秦岭林地菌群与冷凉气候令发酵缓慢而洁净", grainFormula: "高粱·小麦·大米·糯米·玉米", quCraft: "小麦中温大曲，低温入窖缓发酵", pitAndCycle: "泥窖续糟，低温长周期发酵，分层量质摘酒", abvOptions: "50% vol", agingAndBlend: "优级甜润浓香基酒陶坛陈贮，以老酒柔化骨架",
    keyCompounds: ["己酸乙酯", "乳酸乙酯", "苯乙醇"], scores: [81, 84], noseNotes: ["山梨", "甜粮", "幽雅窖香"], palateNote: "入口柔甜，窖香内敛，尾段清凉而净", tagline: "秦岭南麓，低温慢酿一脉甜润",
    essayCore: "金徽填补甘肃名酒版图中的浓香坐标。秦岭南麓冷凉山地使入窖与发酵节奏低缓，杯中不以猛烈喷香取胜，而有山梨、甜粮和细柔窖香；入口柔甜，中段有骨，尾段带山泉般清凉净感。", coord: [106.08, 33.77],
  }),
  makeMonograph({
    id: "bj-kinmen-gaoliang-58", title: "金门高粱酒 · 白金龙 58°", aroma: "qingxiang", subSchool: "海岛旱地固态清香", terroirZoneId: "zone-lingnan-xiyu", province: "tw", provinceLabel: "台湾",
    originCore: "台湾金门岛", waterAndMicroecology: "海岛风土、花岗岩地下水与旱地环境形成纯净硬朗的高粱酒骨", grainFormula: "纯糯高粱·小麦大曲", quCraft: "小麦制曲，固态培菌糖化", pitAndCycle: "高粱蒸煮、固态发酵、两次蒸馏量质摘酒", abvOptions: "58% vol", agingAndBlend: "陶坛分级陈放，以不同批次高粱酒勾调稳定",
    keyCompounds: ["乙酸乙酯", "乳酸乙酯", "β-苯乙醇"], scores: [78, 72], noseNotes: ["糯高粱", "白梨", "海盐矿物"], palateNote: "入口劲爽，粮甜清楚，尾段干净带微咸矿物感", tagline: "海风旱地，糯高粱写成清冽酒骨",
    essayCore: "白金龙五十八度是金门固态高粱酒的经典尺度。纯糯高粱给出扎实粮甜，小麦曲与两次蒸馏保留白梨、花香和清冽骨架；高酒度入口有力，却应迅速转甜并干净收束，适合极小口配海味观察其去腥解腻能力。", coord: [118.32, 24.44],
  }),
  makeMonograph({
    id: "bj-lidu-gaoliang-1955", title: "李渡 · 高粱 1955", aroma: "texiang", subSchool: "元代古窖·一口四香", terroirZoneId: "zone-lianghu-ganjiang", province: "jx", provinceLabel: "江西",
    originCore: "江西进贤李渡镇", waterAndMicroecology: "抚河支流水系与元代古窖持续使用形成多层窖泥菌群", grainFormula: "高粱·小麦·大米", quCraft: "多温大曲与功能曲协同", pitAndCycle: "元代古窖续糟发酵，分层蒸馏保留浓清酱米复合香", abvOptions: "52% vol", agingAndBlend: "古窖基酒陶坛陈贮，以多段酒体组合一口四香",
    keyCompounds: ["丙酸乙酯", "己酸乙酯", "β-苯乙醇"], scores: [91, 92], noseNotes: ["米甜", "老窖", "焦陈"], palateNote: "起口浓甜，中段清雅，咽后酱陈与米香回返", tagline: "元代窖池，一口四香次第开",
    essayCore: "李渡高粱一九五五以持续使用的元代窖池群为风土核心。“一口四香”不是把四类成品酒相加，而是古窖微生态、多粮和分层取酒在口中的时间展开：浓甜先至，清雅居中，焦陈与米香在咽后回返。", coord: [116.27, 28.37],
  }),
  makeMonograph({
    id: "bj-jiugui-huangtan", title: "酒鬼酒 · 经典麻袋黄坛", aroma: "fuyuxiang", subSchool: "武陵馥郁香·国民经典", terroirZoneId: "zone-xiangxi-zunyi-karst", province: "hn", provinceLabel: "湖南",
    originCore: "湘西吉首武陵山腹地", waterAndMicroecology: "喀斯特山泉与湿润山地菌群支撑大小曲复合发酵", nationalHonorTag: "国家优质酒（53优）· 湘泉／酒鬼馥郁香传承", grainFormula: "高粱·糯米·大米·小麦·玉米", quCraft: "小曲培菌糖化、大曲续糟增香", pitAndCycle: "泥窖续糟发酵，分层蒸馏、洞藏老熟", abvOptions: "52% vol", agingAndBlend: "陶坛洞藏，以浓清酱不同风格基酒盘勾",
    keyCompounds: ["己酸乙酯", "乙酸乙酯", "四甲基吡嗪"], scores: [87, 86], noseNotes: ["山花", "窖甜", "淡焦陈"], palateNote: "绵甜起口，清爽过渡，尾段酱陈回甘", tagline: "黄永玉麻袋陶瓶，装下湘西三香",
    essayCore: "经典麻袋黄坛由黄永玉参与塑造的麻袋陶瓶成为一代国民记忆，酒体则保留馥郁香的核心次序。山花与窖甜先到，中段清爽削去黏感，尾段淡焦陈回返；比高端内参更质朴，也更适合作为理解湘西大小曲工艺的入口。", coord: [109.74, 28.31],
  }),
];
