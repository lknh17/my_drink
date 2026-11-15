import type { BeerMonograph } from "../types";

type ChineseBeerCore = Omit<
  BeerMonograph,
  "isChineseRepresentative" | "wiki" | "query" | "photoUrl"
>;

const chineseBeer = (entry: ChineseBeerCore): BeerMonograph => ({
  ...entry,
  isChineseRepresentative: true,
  wiki: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(entry.title)}`,
  query: `${entry.title} 中国啤酒 酒瓶 酒杯`,
  photoUrl: `/photos/${entry.id}.jpg`,
});

export const chineseBeerMonographs: BeerMonograph[] = [
  chineseBeer({
    id: "tsingtao-1903", tapNumber: "TAP #21", title: "青岛啤酒一厂原浆 / 1903 传世奥古特", brewery: "青岛啤酒一厂", countryOrRegion: "中国 · 山东青岛", province: "sd",
    fermentationFamily: "lager", styleCategory: "crisp-lager", bjcpStyleLabel: "中国经典德式源流淡色拉格", originalGravityPlato: "12.0 °P (OG 1.048)", abv: "4.7% vol", abvNum: 4.7, ibu: 22, srm: 4, srmColorHex: "#EDC643",
    foamHeadNote: "雪白泡冠细密，鲜啤版本泡沫尤其蓬松持久。", maltBill: "优质大麦麦芽与适量大米", hopsUsed: "欧洲传统香花与国产酒花平衡", yeastAndProcess: "拉格酵母低温发酵；原浆不过滤、不巴氏杀菌，强调冷链鲜饮",
    aromaTags: ["鲜麦芽", "淡花香", "蜂蜜谷物"], flavorRadar: { hopBitterness: 30, hopAroma: 28, maltSweetness: 48, roastBody: 4, crispnessOrSour: 82 }, glassware: "pilsner-flute", servingTempCelsius: "4–6℃", foodPairings: ["辣炒蛤蜊", "烤鱿鱼", "鲁菜海鲜"],
    tagline: "百年一厂的德式根脉，在青岛海风里变成鲜活金色。",
    essay: "青岛啤酒始于 1903 年，一厂承载德式设备、低温拉格工艺与城市啤酒文化的核心记忆。1903 与奥古特强调优质麦芽、细腻花香和较完整酒体；厂内原浆则省去过滤与巴氏杀菌，让酵母、鲜麦香和柔软口感更直接，但必须依赖严格冷链。入口清爽而不寡淡，淡淡蜂蜜谷物后接干净苦味。配青岛蛤蜊、烤鱿鱼最能体会它不是孤立商品，而是海港夜市与百年工业共同酿成的城市味觉。",
  }),
  chineseBeer({
    id: "harbin-1900", tapNumber: "TAP #22", title: "哈尔滨1900百年纯生", brewery: "哈尔滨啤酒", countryOrRegion: "中国 · 黑龙江哈尔滨", province: "hl",
    fermentationFamily: "lager", styleCategory: "crisp-lager", bjcpStyleLabel: "中国北方淡色拉格", originalGravityPlato: "10.0 °P (OG 1.040)", abv: "4.3% vol", abvNum: 4.3, ibu: 16, srm: 3, srmColorHex: "#F0D15A",
    foamHeadNote: "洁白泡沫轻盈，淡金酒体清澈透亮。", maltBill: "东北大麦麦芽与大米辅料", hopsUsed: "清淡苦香型酒花", yeastAndProcess: "拉格酵母低温发酵，纯生膜过滤保留清鲜感",
    aromaTags: ["淡麦香", "白面包", "清草本"], flavorRadar: { hopBitterness: 20, hopAroma: 18, maltSweetness: 34, roastBody: 2, crispnessOrSour: 88 }, glassware: "pilsner-flute", servingTempCelsius: "3–5℃", foodPairings: ["锅包肉", "红肠", "铁锅炖"],
    tagline: "从 1900 年中东铁路年代走来的中国最早啤酒厂源流。",
    essay: "哈尔滨啤酒的源流可追至 1900 年，常被视作中国最早的啤酒厂传统之一，与中东铁路、俄侨文化和北方工业城市成长紧密相连。百年纯生走轻快淡色拉格路线，以低温发酵和膜过滤避免热杀菌带来的熟味，呈现清淡麦香、柔和谷物甜与利落收口。它并非以复杂度取胜，而是用高饮用性适配红肠、锅包肉和热气腾腾的铁锅炖。冰城冬夏反差，也让这杯清爽拉格成为鲜明城市符号。",
  }),
  chineseBeer({
    id: "wusu-red", tapNumber: "TAP #23", title: "新疆夺命大乌苏红标", brewery: "乌苏啤酒", countryOrRegion: "中国 · 新疆乌苏", province: "xj",
    fermentationFamily: "lager", styleCategory: "crisp-lager", bjcpStyleLabel: "中国高酒精度淡色拉格", originalGravityPlato: "12.0 °P (OG 1.048)", abv: "4.0% vol 以上", abvNum: 4.2, ibu: 18, srm: 5, srmColorHex: "#E5B43B",
    foamHeadNote: "白泡丰厚，金色酒体碳酸感直接。", maltBill: "大麦麦芽与谷物辅料", hopsUsed: "苦香型酒花提供清晰收口", yeastAndProcess: "拉格低温发酵，突出饱满麦汁感与强劲畅饮印象",
    aromaTags: ["谷物", "淡蜂蜜", "青草"], flavorRadar: { hopBitterness: 25, hopAroma: 18, maltSweetness: 50, roastBody: 3, crispnessOrSour: 76 }, glassware: "shaker-pint", servingTempCelsius: "3–5℃", foodPairings: ["新疆烤羊肉", "大盘鸡", "椒麻鸡"],
    tagline: "红标大瓶与新疆烧烤，把直给麦香变成全国流行暗号。",
    essay: "红标大乌苏因大瓶装、入口顺畅而后劲鲜明，被饮者戏称“夺命大乌苏”，从新疆餐桌迅速成为全国性流行符号。它本质上是强调畅饮的淡色拉格：谷物麦香直接，甜感比极轻型工业啤酒更饱满，苦味简洁，冰镇后碳酸利落。真正完整的场景在炭火羊肉、大盘鸡与夜市长桌之间，油脂、孜然和辣味会放大其解腻能力。其价值既在配方，也在包装、地域豪爽想象与社交饮用共同塑造的文化生命。",
  }),
  chineseBeer({
    id: "pearl-river-draft", tapNumber: "TAP #24", title: "广州珠江纯生", brewery: "珠江啤酒", countryOrRegion: "中国 · 广东广州", province: "gd",
    fermentationFamily: "lager", styleCategory: "chinese-terroir-craft", bjcpStyleLabel: "中国纯生淡色拉格", originalGravityPlato: "10.0 °P (OG 1.040)", abv: "4.0% vol", abvNum: 4, ibu: 15, srm: 3, srmColorHex: "#F1D66C",
    foamHeadNote: "白泡轻柔，浅金酒液清澈，气泡细快。", maltBill: "淡色麦芽与大米", hopsUsed: "低量香花保持清爽", yeastAndProcess: "低温拉格发酵，以无菌膜过滤替代巴氏杀菌",
    aromaTags: ["清麦香", "米香", "淡花草"], flavorRadar: { hopBitterness: 18, hopAroma: 18, maltSweetness: 30, roastBody: 1, crispnessOrSour: 92 }, glassware: "pilsner-flute", servingTempCelsius: "3–5℃", foodPairings: ["白切鸡", "烧鹅", "清蒸海鲜"],
    tagline: "中国第一瓶纯生啤酒，把“鲜”写进岭南日常。",
    essay: "珠江啤酒在中国率先推动纯生技术产业化，以无菌过滤和洁净灌装替代传统巴氏热杀菌，目标是减少熟味、保留低温拉格的清鲜麦香。酒体浅金轻盈，米与淡色麦芽给出柔和甜感，酒花苦味克制，冰镇后收口极快，适合广州湿热气候。它与白切鸡、烧鹅、清蒸海鲜并不争味，而负责清口和续杯。作为“中国第一瓶纯生”的工业节点，它也记录了本土啤酒从规模制造走向鲜度管理的一次关键升级。",
  }),
  chineseBeer({
    id: "master-ga-baby-fat", tapNumber: "TAP #25", title: "南京高大师·婴儿肥茉莉花茶增味 IPA", brewery: "高大师啤酒", countryOrRegion: "中国 · 江苏南京", province: "js",
    fermentationFamily: "ale", styleCategory: "chinese-terroir-craft", bjcpStyleLabel: "中国茶增味 IPA", originalGravityPlato: "15.5 °P (OG 1.063)", abv: "6.5% vol", abvNum: 6.5, ibu: 55, srm: 7, srmColorHex: "#D9941C",
    foamHeadNote: "米白泡冠紧密，橙金酒液略带自然浑浊。", maltBill: "淡色麦芽与少量焦糖麦芽", hopsUsed: "美式柑橘型酒花多段投放", yeastAndProcess: "艾尔发酵并以茉莉花茶冷端增香，控制茶涩与酒花苦度",
    aromaTags: ["茉莉花茶", "柑橘", "松脂", "蜂蜜"], flavorRadar: { hopBitterness: 65, hopAroma: 82, maltSweetness: 48, roastBody: 8, crispnessOrSour: 55 }, glassware: "tulip", servingTempCelsius: "7–9℃", foodPairings: ["盐水鸭", "烤鸭", "香辣小龙虾"],
    tagline: "中国瓶装精酿先锋，让茉莉茶香与 IPA 酒花首次正面相逢。",
    essay: "高大师被广泛视为中国现代瓶装精酿的重要开拓者，“婴儿肥”系列以鲜明本土表达建立辨识度。茉莉花茶版本把窨制花香接入 IPA：前段是清雅茉莉和茶叶嫩香，中段转为美式酒花的柑橘、松脂，末端茶多酚涩感与苦度彼此咬合。麦芽只提供橙金色骨架，避免甜味压住花香。它与中国茶馆传统形成有趣互文，也提醒酿造者，增味不等于堆料，关键在萃取温度、投放时机和涩苦边界。",
  }),
  chineseBeer({
    id: "jing-a-flying-fist", tapNumber: "TAP #26", title: "北京京A·飞拳西海岸 IPA", brewery: "京A精酿啤酒", countryOrRegion: "中国 · 北京", province: "bj",
    fermentationFamily: "ale", styleCategory: "hoppy-ipa", bjcpStyleLabel: "BJCP 21A · American IPA", originalGravityPlato: "16.5 °P (OG 1.067)", abv: "6.5% vol", abvNum: 6.5, ibu: 65, srm: 7, srmColorHex: "#D98B1D",
    foamHeadNote: "洁白泡冠紧实，清亮金橙酒体挂杯持久。", maltBill: "淡色麦芽与少量慕尼黑麦芽", hopsUsed: "Citra、Simcoe 等美式酒花旋沉与干投", yeastAndProcess: "洁净美式艾尔酵母，高硫酸盐水质强化干苦收口",
    aromaTags: ["葡萄柚", "松针", "百香果", "柑橘皮"], flavorRadar: { hopBitterness: 78, hopAroma: 86, maltSweetness: 38, roastBody: 5, crispnessOrSour: 66 }, glassware: "shaker-pint", servingTempCelsius: "6–8℃", foodPairings: ["北京烤鸭", "孜然羊肉", "辣子鸡"],
    tagline: "一记清亮、松脂而干爽的酒花直拳。",
    essay: "飞拳以经典西海岸 IPA 为坐标，强调清亮酒体、鲜明松脂柑橘与直接苦度。美式酒花在旋沉和干投阶段释放葡萄柚、百香果、松针及柑橘皮，洁净酵母减少果酯干扰，偏硫酸盐的水质则让尾段更锐利干爽。淡色麦芽提供刚好承托酒精的骨架，不把它拖向焦糖甜重。作为北京精酿酒吧文化成长中的代表酒款，它把国际风格标准转译成适合烤鸭、孜然羊肉与重味夜宵的本地畅饮语言。",
  }),
  chineseBeer({
    id: "jing-a-workers-pale-ale", tapNumber: "TAP #27", title: "北京京A·工人淡色艾尔", brewery: "京A精酿啤酒", countryOrRegion: "中国 · 北京", province: "bj",
    fermentationFamily: "ale", styleCategory: "malty-bock-amber", bjcpStyleLabel: "BJCP 18B · American Pale Ale", originalGravityPlato: "12.5 °P (OG 1.050)", abv: "5.0% vol", abvNum: 5, ibu: 35, srm: 9, srmColorHex: "#C8781E",
    foamHeadNote: "米白泡冠稳定，琥珀金酒液清亮。", maltBill: "淡色、慕尼黑与焦糖麦芽", hopsUsed: "美式柑橘型酒花适量干投", yeastAndProcess: "美式艾尔酵母中温发酵，兼顾麦芽与酒花平衡",
    aromaTags: ["橙皮", "饼干", "淡松脂", "焦糖"], flavorRadar: { hopBitterness: 45, hopAroma: 58, maltSweetness: 50, roastBody: 18, crispnessOrSour: 62 }, glassware: "shaker-pint", servingTempCelsius: "7–9℃", foodPairings: ["京酱肉丝", "炸酱面", "烤串"],
    tagline: "给城市劳动者的一杯：够香、够稳，也足够耐饮。",
    essay: "工人淡色艾尔以北京城市劳动叙事命名，定位比强劲 IPA 更轻松耐饮。淡色与少量焦糖麦芽带来饼干、面包皮和柔和琥珀色，美式酒花补上橙皮、松脂与花香；苦度清楚却不压过麦芽，五度左右酒精适合长桌续杯。它展示本土精酿不必只靠高浓度和稀奇辅料，也能通过稳定、平衡与场景感建立性格。配炸酱面、京酱肉丝或街边烤串，酒花切油，麦芽又能接住酱香。",
  }),
  chineseBeer({
    id: "niupitang-imperial-gose", tapNumber: "TAP #28", title: "北京牛啤堂·帝都海盐古斯", brewery: "牛啤堂", countryOrRegion: "中国 · 北京", province: "bj",
    fermentationFamily: "wild-sour", styleCategory: "wild-sour-fruit", bjcpStyleLabel: "BJCP 23G · Gose", originalGravityPlato: "12.0 °P (OG 1.048)", abv: "4.5% vol", abvNum: 4.5, ibu: 8, srm: 4, srmColorHex: "#E9C955",
    foamHeadNote: "白泡细快，浅金酒液微浑，碳酸活跃。", maltBill: "小麦与大麦麦芽", hopsUsed: "极低量酒花保护乳酸表达", yeastAndProcess: "乳酸发酵，加入海盐与芫荽籽，控制酸咸平衡",
    aromaTags: ["柠檬", "海盐", "芫荽", "面团"], flavorRadar: { hopBitterness: 4, hopAroma: 10, maltSweetness: 22, roastBody: 2, crispnessOrSour: 94 }, glassware: "stange", servingTempCelsius: "5–7℃", foodPairings: ["生蚝", "涮羊肉", "凉拌海蜇"],
    tagline: "国际金奖见证，中国酸啤以海盐和乳酸建立自己的清爽坐标。",
    essay: "帝都海盐古斯以德国 Gose 为骨架，将乳酸、小麦、海盐和芫荽组织成清晰的酸咸结构，并凭国际赛事奖项成为中国酸啤代表之一。入口先是柠檬般明亮酸度，随后矿物盐感扩张鲜味，芫荽带来花草与柑橘辛香；低苦度和活泼碳酸让收口极快。它既适合生蚝，也能切开北京涮羊肉的脂香。更重要的是，它证明早期本土精酿已从模仿 IPA，走向对历史风格的准确理解与自主表达。",
  }),
  chineseBeer({
    id: "shiba-jump-east-lake", tapNumber: "TAP #29", title: "武汉拾捌精酿·跳东湖 IPA", brewery: "拾捌精酿", countryOrRegion: "中国 · 湖北武汉", province: "hb",
    fermentationFamily: "ale", styleCategory: "hoppy-ipa", bjcpStyleLabel: "中国城市主题美式 IPA", originalGravityPlato: "16.0 °P (OG 1.065)", abv: "6.3% vol", abvNum: 6.3, ibu: 60, srm: 7, srmColorHex: "#D68A1B",
    foamHeadNote: "米白泡冠蓬松，金橙酒体略带酒花浑浊。", maltBill: "淡色麦芽与少量小麦麦芽", hopsUsed: "美式热带果香与松脂型酒花多次干投", yeastAndProcess: "艾尔酵母发酵，冷端强化酒花鲜香并严控氧化",
    aromaTags: ["柑橘", "芒果", "松脂", "青草"], flavorRadar: { hopBitterness: 70, hopAroma: 88, maltSweetness: 42, roastBody: 5, crispnessOrSour: 60 }, glassware: "tulip", servingTempCelsius: "6–8℃", foodPairings: ["周黑鸭", "油焖大虾", "烧烤"],
    tagline: "以东湖为名，把武汉的江湖热度装进酒花浪头。",
    essay: "“跳东湖”借武汉民间水岸记忆命名，让一款 IPA 与城市青年文化紧密相连。酒体以淡色麦芽保持轻快，热带果香与松脂型美式酒花在旋沉、干投阶段叠加，释放芒果、柑橘、青草和树脂；清晰苦度足以对抗周黑鸭、油焖大虾的辣甜油脂，尾段仍保持干净。它的代表性不只在配方，更在将地方地标、社群活动和鲜啤消费连成一体，使精酿成为可以被城市共同记住的味觉事件。",
  }),
  chineseBeer({
    id: "fengshou-hanyuan-pepper-wit", tapNumber: "TAP #30", title: "成都丰收道酿·汉源红花椒比利时小麦", brewery: "丰收道酿", countryOrRegion: "中国 · 四川成都", province: "sc",
    fermentationFamily: "ale", styleCategory: "chinese-terroir-craft", bjcpStyleLabel: "中国香料增味 Witbier", originalGravityPlato: "12.0 °P (OG 1.048)", abv: "5.0% vol", abvNum: 5, ibu: 14, srm: 4, srmColorHex: "#EBCB5B",
    foamHeadNote: "雪白泡冠蓬松，浅金酒液带小麦云雾。", maltBill: "未发芽小麦、皮尔森麦芽与燕麦", hopsUsed: "低苦度欧洲香花", yeastAndProcess: "比利时白啤酵母发酵，加入汉源红花椒与柑橘香料",
    aromaTags: ["红花椒", "柑橘", "芫荽", "小麦"], flavorRadar: { hopBitterness: 12, hopAroma: 24, maltSweetness: 40, roastBody: 2, crispnessOrSour: 78 }, glassware: "tulip", servingTempCelsius: "5–7℃", foodPairings: ["椒麻鸡", "冷吃兔", "清油火锅"],
    tagline: "汉源花椒不是只带麻，它把柑橘木质香送进比利时白啤。",
    essay: "这款酒以比利时白啤为柔软底盘，让四川汉源红花椒取代单纯猎奇式辣味。优质红花椒首先释放柑橘、花香与轻微木质气息，入口后才有短暂清麻；小麦、燕麦塑造云雾酒体，酵母与传统芫荽、橙皮调性自然衔接。低苦度避免与麻感冲突，活泼碳酸则及时清口。配椒麻鸡、冷吃兔或清油火锅时，香料彼此呼应却不叠加灼热，呈现川味原料进入现代发酵饮品的精细方法。",
  }),
  chineseBeer({
    id: "dajiu-osmanthus-wheat", tapNumber: "TAP #31", title: "保定大九酿造 / 拾捌精酿·金桂花小麦艾尔", brewery: "大九酿造 × 拾捌精酿", countryOrRegion: "中国 · 河北保定", province: "hb",
    fermentationFamily: "ale", styleCategory: "chinese-terroir-craft", bjcpStyleLabel: "中国花香增味小麦艾尔", originalGravityPlato: "12.5 °P (OG 1.050)", abv: "5.2% vol", abvNum: 5.2, ibu: 15, srm: 5, srmColorHex: "#E6B943",
    foamHeadNote: "奶白泡冠细密，小麦蛋白令泡沫持久。", maltBill: "小麦麦芽与淡色大麦麦芽", hopsUsed: "低量花香型酒花", yeastAndProcess: "小麦艾尔酵母发酵，冷端浸渍金桂以保留清甜花香",
    aromaTags: ["金桂", "蜂蜜", "熟梨", "白面包"], flavorRadar: { hopBitterness: 10, hopAroma: 25, maltSweetness: 52, roastBody: 3, crispnessOrSour: 70 }, glassware: "weizen-vase", servingTempCelsius: "6–8℃", foodPairings: ["驴肉火烧", "桂花藕", "烤禽"],
    tagline: "秋日金桂落入小麦泡冠，花香清甜而不香精化。",
    essay: "金桂花香细腻却易在煮沸中挥发，这款小麦艾尔通过后段或冷端浸渍保存其蜂蜜、熟杏与清甜花气。小麦麦芽提供柔滑质地和稳定泡冠，酵母生成熟梨、香蕉般果酯，与桂花自然搭桥；酒花苦度刻意收低，避免切断花香。关键品鉴点是“像鲜花而非香精”：香气应轻盈上扬，入口仍以谷物和发酵为主。它把中国秋令嗅觉记忆装进现代啤酒，也适合搭配桂花藕与烤禽。",
  }),
  chineseBeer({
    id: "chumen-chenpi-puer-stout", tapNumber: "TAP #32", title: "楚门津门 / 废墟精酿·新会陈皮云南熟普帝国世涛", brewery: "楚门津门 × 废墟精酿", countryOrRegion: "中国 · 天津", province: "tj",
    fermentationFamily: "ale", styleCategory: "chinese-terroir-craft", bjcpStyleLabel: "中国茶与陈皮增味帝国世涛", originalGravityPlato: "25.0 °P (OG 1.106)", abv: "11.0% vol", abvNum: 11, ibu: 65, srm: 45, srmColorHex: "#180F0B",
    foamHeadNote: "深褐泡冠油润，高酒精下留下浓密酒泪。", maltBill: "淡色、巧克力、黑麦芽与燕麦", hopsUsed: "高阿尔法苦花平衡残糖", yeastAndProcess: "高浓度艾尔发酵，加入新会陈皮与云南熟普分段浸渍熟成",
    aromaTags: ["陈皮", "熟普", "黑巧克力", "咖啡"], flavorRadar: { hopBitterness: 58, hopAroma: 18, maltSweetness: 82, roastBody: 96, crispnessOrSour: 16 }, glassware: "snifter", servingTempCelsius: "12–14℃", foodPairings: ["陈皮牛肉", "黑巧克力", "烟熏肉"],
    tagline: "陈皮的柑橘药香、熟普的陈韵，沉入帝国世涛黑色深处。",
    essay: "这款跨界帝国世涛把新会陈皮与云南熟普置于重烘焙、高酒精框架中。陈皮贡献挥发油、柑橘苦香与陈年药香，熟普带来湿润木质、枣甜和醇厚陈韵，巧克力与黑麦芽则构成咖啡、可可底座；燕麦软化口感，高苦度负责抵消残糖。温度升高后，茶、柑橘和烘焙层次才逐步分离。它不只是“加茶的黑啤”，而是借发酵、浸渍和熟成重组中国陈味体系，成为茶酒跨界的典型样本。",
  }),
];
