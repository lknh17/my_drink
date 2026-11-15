import type {
  GrapeOakAndGlassItem,
  GrapeVarietalMeta,
  GrapeVarietalId,
  GrapeWineRegionSpec,
  GrapeWineSpecimen,
  GrapeWineStyleType,
} from "../types";
import { grapeSpecimens as originalGrapeSpecimens } from "./fourCuratedWings";

const media = <T extends { id: string }>(item: T): T & { photoUrl: string; query: string; wiki: string } => ({
  ...item,
  photoUrl: `/photos/${item.id}.jpg`,
  query: `${"title" in item ? String(item.title) : "name" in item ? String(item.name) : item.id} 葡萄酒 实物`,
  wiki: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent("title" in item ? String(item.title) : "name" in item ? String(item.name) : item.id)}`,
});

export const grapeVarietals: GrapeVarietalMeta[] = [
  ["cabernet-sauvignon","赤霞珠","Cabernet Sauvignon","red","法国波尔多",92,70,90,"#641A2D",["黑醋栗","雪松","石墨"],"温暖、排水良好的砾石地","20–40 年","宁夏与云南均能形成成熟果味和坚实酸骨架","厚皮、高单宁、晚熟，是左岸与中国精品红酒的结构轴。",["pauillac-left-bank-blend","napa-opus-cabernet","yunnan-aoyun-cabernet"]],
  ["pinot-noir","黑皮诺","Pinot Noir","red","法国勃艮第",28,88,55,"#A63D4B",["酸樱桃","覆盆子","林地"],"凉爽、石灰岩坡地","8–25 年","银川精细化栽培正探索冷凉表达","薄皮却敏感，以高酸、透明红果和地块差异见长。",["gevrey-chambertin-vieilles-vignes","oregon-willamette-pinot","yinchuan-bonaparte-pinot"]],
  ["merlot","梅洛","Merlot","red","法国波美侯",58,58,78,"#782238",["黑李子","巧克力","紫罗兰"],"温和黏土与砾质土","10–25 年",undefined,"中等单宁与丰润果肉感，使右岸混酿柔滑深沉。",["pomerol-petrus-merlot"]],
  ["syrah","西拉 / 设拉子","Syrah / Shiraz","red","法国北罗纳",78,66,88,"#4E1930",["黑莓","黑胡椒","烟熏"],"温暖干燥、花岗岩或铁质土","12–30 年",undefined,"同一品种在罗纳呈胡椒与花香，在巴罗萨呈浓郁熟果。",["chateauneuf-du-pape","barossa-old-vine-shiraz"]],
  ["nebbiolo","内比奥罗","Nebbiolo","red","意大利皮埃蒙特",86,92,76,"#9C493F",["玫瑰","酸樱桃","焦油"],"长季节、雾岭石灰泥灰土","20–50 年",undefined,"色浅而单宁酸度极高，瓶陈后出现玫瑰、松露与焦油。",["barolo-nebbiolo"]],
  ["sangiovese","桑娇维塞","Sangiovese","red","意大利托斯卡纳",68,84,72,"#8C2D34",["红樱桃","番茄叶","干草药"],"温暖丘陵与石灰黏土","10–30 年",undefined,"高酸和咸鲜草本感让它成为托斯卡纳餐桌的骨架。",["brunello-montalcino"]],
  ["marselan","马瑟兰","Marselan","red","法国南部 / 中国",72,62,84,"#5B1834",["紫罗兰","黑莓","甘草"],"干燥强日照与显著昼夜温差","8–20 年","小粒厚皮、颜色深且单宁细，已成为中国风土名片","赤霞珠与歌海娜后代，在中国兼具浓色、芳香与柔顺。",["ningxia-legacy-kanaan-cab-marselan","xige-vine-marselan","xinjiang-tiansai-marselan"]],
  ["chardonnay","霞多丽","Chardonnay","white","法国勃艮第 / 夏布利",12,72,72,"#D8C76A",["青苹果","柠檬","榛子"],"凉爽至温暖，石灰岩适应力强","5–25 年","山东海岸风土能保留酸度与盐感","可塑性极强，从夏布利矿物到桶陈奶油均能表达。",["chablis-grand-cru","penglai-qiushan-valley-chardonnay"]],
  ["riesling","雷司令","Riesling","white","德国摩泽尔",8,98,48,"#DCE578",["青柠","白桃","板岩"],"凉爽河谷与陡坡","10–40 年",undefined,"高酸、强芳香、低酒精，干型至贵腐甜型皆可长寿。",["mosel-slate-riesling-feinherb"]],
  ["sauvignon-blanc","长相思","Sauvignon Blanc","white","法国卢瓦尔 / 新西兰",10,90,45,"#C9DB75",["醋栗","百香果","燧石"],"凉爽通风、成熟期适中","3–10 年",undefined,"硫醇类香气鲜明，既可青草矿物，也可热带奔放。",["sancerre-sauvignon","marlborough-sauvignon"]],
  ["gewurztraminer","琼瑶浆","Gewürztraminer","white","法国阿尔萨斯",9,54,68,"#E0B875",["荔枝","玫瑰","甜香料"],"凉爽干燥、漫长成熟季","4–12 年",undefined,"天然酸度偏低，却有极强荔枝、玫瑰和香料张力。",["reims-vintage-champagne"]],
  ["chenin-blanc","白诗南","Chenin Blanc","white","法国卢瓦尔",11,94,63,"#E5D88B",["榅桲","蜂蜡","洋甘菊"],"凉爽河谷，适合贵腐","8–30 年",undefined,"高酸与多风格能力兼备，可酿干白、起泡和长寿甜酒。",["tokaji-aszu-5-puttonyos"]],
].map(([id,name,englishName,colorType,originClassic,x,y,bodyScore,colorHex,signatureAromas,climatePreference,agingPotential,chinaAdaptationNote,summary,representativeWineIds]) => ({
  id:id as GrapeVarietalId,name:String(name),englishName:String(englishName),colorType:colorType as "red"|"white",originClassic:String(originClassic),
  skinThicknessAndTannin:Number(x),naturalAcidityAndAroma:Number(y),bodyScore:Number(bodyScore),colorHex:String(colorHex),
  signatureAromas:signatureAromas as string[],climatePreference:String(climatePreference),agingPotential:String(agingPotential),
  chinaAdaptationNote:chinaAdaptationNote ? String(chinaAdaptationNote) : undefined,summary:String(summary),representativeWineIds:representativeWineIds as string[],
}));

const region = (id:string,name:string,country:string,worldGroup:GrapeWineRegionSpec["worldGroup"],coord:[number,number],classificationSystem:string,climateAndSoil:string,signatureVarietals:string[],representativeWineIds:string[],terroirSummary:string,province?:GrapeWineRegionSpec["province"]):GrapeWineRegionSpec => media({
  id,name,country,worldGroup,province,coord,latitudeLabel:`${Math.abs(coord[1]).toFixed(1)}°${coord[1] >= 0 ? "N" : "S"}`,
  classificationSystem,climateAndSoil,signatureVarietals,representativeWineIds,terroirSummary,
});

export const grapeRegions: GrapeWineRegionSpec[] = [
  region("burgundy-cote-de-nuits","法国勃艮第夜丘","法国","old-world",[4.95,47.17],"AOC/AOP · 地块制 Grand Cru / Premier Cru","凉爽大陆性；侏罗纪石灰岩与泥灰土",["黑皮诺"],["gevrey-chambertin-vieilles-vignes"],"分米级坡位差异被写进酒标。"),
  region("burgundy-chablis","法国勃艮第夏布利","法国","old-world",[3.8,47.82],"Chablis AOC · Grand Cru / Premier Cru","冷凉大陆性；启莫里阶石灰岩与牡蛎化石",["霞多丽"],["chablis-grand-cru"],"高酸、燧石和咸感定义冷凉霞多丽。"),
  region("bordeaux-left-bank","波尔多左岸","法国","old-world",[-0.7,45.2],"1855 列级庄 · 酒庄分级","海洋性；深厚砾石排水土",["赤霞珠","梅洛"],["pauillac-left-bank-blend"],"砾石蓄热让晚熟赤霞珠完成成熟。"),
  region("bordeaux-right-bank","波尔多右岸","法国","old-world",[-0.2,44.95],"Saint-Émilion 分级 / Pomerol 无官方列级","海洋性；蓝黏土、铁质砂砾",["梅洛","品丽珠"],["pomerol-petrus-merlot"],"黏土保水塑造梅洛的丰润与深度。"),
  region("champagne-reims","法国香槟区","法国","old-world",[4.03,49.26],"Champagne AOC · 村庄历史分级","冷凉边缘气候；深层白垩土",["霞多丽","黑皮诺"],["reims-vintage-champagne"],"白垩保水与高酸支撑瓶中二次发酵。"),
  region("rhone-valley","法国罗纳河谷","法国","old-world",[4.84,44.08],"AOC/AOP · Cru 村庄体系","地中海强风；卵石、花岗岩与黏土",["西拉","歌海娜"],["chateauneuf-du-pape"],"北部西拉与南部歌海娜混酿构成两种罗纳。"),
  region("piedmont-barolo","意大利皮埃蒙特巴罗洛","意大利","old-world",[7.94,44.61],"DOCG · MGA 地理附加单位","雾岭大陆性；石灰泥灰土",["内比奥罗"],["barolo-nebbiolo"],"长季节把高单宁与玫瑰香同时推向极致。"),
  region("tuscany","意大利托斯卡纳","意大利","old-world",[11.3,43.0],"DOCG · Brunello / Chianti Classico","温暖丘陵；加莱斯特罗片岩与黏土",["桑娇维塞"],["brunello-montalcino"],"海拔与昼夜温差保存樱桃酸线。"),
  region("rioja","西班牙里奥哈","西班牙","old-world",[-2.45,42.46],"DOCa · Crianza / Reserva / Gran Reserva","大陆与大西洋交汇；黏土石灰土",["丹魄"],["rioja-gran-reserva"],"桶陈年限传统与丹魄红果共同定义风格。"),
  region("mosel","德国摩泽尔","德国","old-world",[7.1,49.9],"Prädikatswein 成熟度分级","冷凉河谷；蓝灰板岩陡坡",["雷司令"],["mosel-slate-riesling-feinherb"],"河面反光与板岩蓄热帮助极北葡萄成熟。"),
  region("tokaj","匈牙利托卡伊","匈牙利","old-world",[21.4,48.1],"Tokaj PDO · Aszú Puttonyos","火山土；博德罗格河秋雾与午后干风",["福尔明"],["tokaji-aszu-5-puttonyos"],"贵腐浓缩与福尔明高酸形成甜酒张力。"),
  region("napa-valley","美国纳帕谷","美国","new-world",[-122.3,38.5],"AVA 地理原产地","地中海型；火山土与冲积扇",["赤霞珠"],["napa-opus-cabernet"],"成熟黑果、抛光单宁与酒庄调配艺术。"),
  region("barossa-valley","澳洲巴罗萨谷","澳大利亚","new-world",[139.0,-34.55],"GI 地理标志","炎热干燥；红黏土与老藤旱作",["设拉子"],["barossa-old-vine-shiraz"],"百年老藤以浓缩黑果抵御热旱。"),
  region("marlborough","新西兰马尔堡","新西兰","new-world",[173.9,-41.5],"GI 地理标志","凉爽海洋性；砾石冲积土、强日照",["长相思"],["marlborough-sauvignon"],"冷夜保存酸度，强光推动百香果硫醇香。"),
  region("maipo-valley","智利迈坡谷","智利","new-world",[-70.65,-33.6],"DO 地理标志","安第斯山麓；冲积砾石、干燥日照",["赤霞珠","佳美娜"],["maipo-almaviva-blend"],"山风与雪水灌溉形成成熟而清晰的黑果。"),
  region("ningxia-helan","宁夏贺兰山东麓","中国","china-terroir",[106.0,38.5],"国家地理标志 · 酒庄分级探索","冲积扇砾石、强日照、大温差，冬季埋土",["赤霞珠","马瑟兰"],["ningxia-legacy-kanaan-cab-marselan","helan-qingxue-jiabeilan","xige-vine-marselan"],"贺兰山屏障与黄河灌溉塑造西北浓缩感。","nx"),
  region("yunnan-diqing","云南迪庆香格里拉","中国","china-terroir",[99.7,28.0],"高山村落地块体系","2200–2800m 峡谷、高紫外线、免埋土",["赤霞珠"],["yunnan-aoyun-cabernet"],"极限海拔赋予厚皮、鲜酸与藏地香料感。","yn"),
  region("shandong-penglai","山东烟台蓬莱丘山谷","中国","china-terroir",[120.8,37.8],"蓬莱海岸地理标志","海洋性温和气候；花岗岩风化土",["霞多丽","赤霞珠"],["penglai-qiushan-valley-chardonnay","penglai-longdai-red"],"海风延迟成熟并赋予盐鲜酸度。","sd"),
  region("xinjiang-tianshan","新疆天山北麓 / 焉耆盆地","中国","china-terroir",[86.2,42.1],"新疆产区地理标志","戈壁砾石、极强日照与昼夜温差，冬季埋土",["马瑟兰","赤霞珠"],["xinjiang-tiansai-marselan"],"干燥空气与天山雪水带来纯净浓缩果味。","xj"),
];

export const grapeOakAndGlass: GrapeOakAndGlassItem[] = [
  ["allier-troncais-oak","oak-barrel","法国阿利埃 / 特隆赛细纹理新橡木桶","Allier & Tronçais French Oak","细纹理 · 225L","缓慢微氧，椭圆单宁细密","雪松、烤面包、香草与细致辛香",["波尔多混酿","勃艮第黑皮诺"]],
  ["american-white-oak","oak-barrel","美国白橡木桶","American White Oak","宽纹理 · 高内酯","孔隙较开放，橡木内酯释放更快","椰子、莳萝、甜香草",["里奥哈","新世界设拉子"]],
  ["slavonian-botti","oak-barrel","斯洛文尼亚大橡木桶 Botti","Slavonian Oak Botti","10–100hL · 中性大桶","表面积体积比低，微氧而少木香","保留酸樱桃、玫瑰与土壤感",["巴罗洛","布鲁奈罗"]],
  ["toast-lab","oak-barrel","轻 / 中重度烘烤度对照","Light to Medium+ Toast","Light / Medium / Heavy","热裂解木质素与半纤维素，改变挥发物比例","轻烤偏木香，中烤香草焦糖，重烤咖啡烟熏",["橡木桶实验酒","浓郁红酒"]],
  ["bordeaux-tulip","stemware-decanter","波尔多郁金香高杯","Bordeaux Tulip","高杯身 · 收口","垂直流路把酒送向舌中后部并聚集黑果香","突出单宁、雪松和黑醋栗",["赤霞珠","梅洛混酿"]],
  ["burgundy-bowl","stemware-decanter","勃艮第大肚收口杯","Burgundy Balloon","大肚 · 窄口","宽液面增加挥发，收口聚拢细腻红果","展开黑皮诺与内比奥罗的层次",["黑皮诺","内比奥罗"]],
  ["riesling-glass","stemware-decanter","雷司令白葡萄酒杯","Riesling Glass","窄杯身 · 小杯口","控制升温和挥发速度，维持高酸与花果香","突出青柠、白桃与矿物",["雷司令","长相思"]],
  ["champagne-tulip","stemware-decanter","郁金香香槟杯","Champagne Tulip","细长碗 · 中段扩张","杯底成核点维持气泡，宽中段容纳酒泥香","兼顾气泡与布里欧修香",["年份香槟","传统法起泡"]],
  ["port-dessert-glass","stemware-decanter","波特甜酒杯","Port & Dessert Glass","小容量 · 明显收口","限制高酒精入口量并聚拢果干香","平衡甜度、酒精与氧化香",["波特","苏玳","托卡伊"]],
  ["swan-neck-decanter","stemware-decanter","天鹅颈宽底醒酒器","Swan-neck Decanter","宽底 · 双流口","最大化液面接触，曲颈控制倒酒并分离沉淀","软化年轻单宁、释放封闭香气",["年轻波尔多","巴罗洛"]],
].map(([id,kind,name,englishName,specBadge,physicalMechanism,flavorOrAromaImpact,bestForStyles]) => media({id:String(id),kind:kind as GrapeOakAndGlassItem["kind"],name:String(name),englishName:String(englishName),specBadge:String(specBadge),physicalMechanism:String(physicalMechanism),flavorOrAromaImpact:String(flavorOrAromaImpact),bestForStyles:bestForStyles as string[]}));

type NewWine = {
  id:string; title:string; style:GrapeWineStyleType; origin:string; country:string; grape:string;
  varietal:GrapeVarietalId; region:string; group:GrapeWineSpecimen["worldGroup"]; color:string;
  badge:string; window:string; rim:string; aromas:string[]; china?:boolean; province?:GrapeWineSpecimen["province"];
};
const newWine = (w:NewWine):GrapeWineSpecimen => media({
  id:w.id,title:w.title,styleType:w.style,originAppellation:w.origin,country:w.country,isChineseTerroir:w.china,province:w.province,
  grapeVarietals:w.grape,climateAndSoil:`${w.origin} 的代表性坡向、土壤与成熟季共同塑造风格。`,
  vinificationAndOak:w.style === "white" ? "低温发酵，按风格选择酒泥熟成或中性容器。" : "分地块发酵，温和萃取并依酒体选择橡木桶熟成。",
  abv:w.style === "sweet-fortified" ? "12–20% vol" : w.style === "sparkling" ? "12% vol" : "13–15% vol",
  liquorColorHex:w.color,structureBars:{
    tannin:w.style === "red" ? 76 : 4, acidity:w.style === "sweet-fortified" ? 78 : 74,
    body:w.style === "sparkling" ? 56 : 78, sweetness:w.style === "sweet-fortified" ? 88 : 7, oak:w.style === "sparkling" ? 18 : 58,
  },aromaNotes:w.aromas,
  sommelierService:{glass:w.style === "red" ? "波尔多或勃艮第杯" : w.style === "sparkling" ? "郁金香香槟杯" : "白葡萄酒 / 甜酒杯",tempCelsius:w.style === "red" ? "16–18℃" : "8–12℃",decant:w.style === "red" ? "视年份醒酒 30–90 分钟" : "老年份提前开瓶观察",pairings:w.style === "red" ? ["炙烤牛羊","菌菇","熟成奶酪"] : ["海鲜","禽肉","软质奶酪"]},
  tagline:`${w.badge} 的标杆酒款，以 ${w.aromas.slice(0,2).join("、")} 连接品种与风土。`,
  essay:`这款酒是理解 ${w.origin} 的馆藏坐标。${w.grape} 在当地气候与土壤中形成 ${w.aromas.join("、")} 的连续香气，酿造选择服务于风土而非覆盖风土。观察边缘色、结构条与适饮窗口，可以把酒标上的分级、年份和产区转化为杯中的酸度、单宁、质地与余味。`,
  varietalId:w.varietal,regionId:w.region,worldGroup:w.group,classificationBadge:w.badge,drinkingWindow:w.window,rimColorNote:w.rim,
  chineseFoodPairings:w.style === "red" ? ["北京烤鸭","红烧牛腩","菌菇煲"] : w.style === "sweet-fortified" ? ["广式烧鹅","蓝纹奶酪","桂花糕"] : ["清蒸鱼","白切鸡","蟹粉豆腐"],
});

const enrichExisting: Record<string, Partial<GrapeWineSpecimen>> = {
  "gevrey-chambertin-vieilles-vignes":{varietalId:"pinot-noir",regionId:"burgundy-cote-de-nuits",worldGroup:"old-world",classificationBadge:"Gevrey-Chambertin AOC",drinkingWindow:"2025–2040",rimColorNote:"石榴红薄边",chineseFoodPairings:["北京烤鸭","松茸炖鸡"]},
  "pauillac-left-bank-blend":{varietalId:"cabernet-sauvignon",regionId:"bordeaux-left-bank",worldGroup:"old-world",classificationBadge:"1855 列级庄范式",drinkingWindow:"2028–2050",rimColorNote:"深宝石红",chineseFoodPairings:["黑椒牛柳","烤羊排"]},
  "mosel-slate-riesling-feinherb":{varietalId:"riesling",regionId:"mosel",worldGroup:"old-world",classificationBadge:"Prädikatswein",drinkingWindow:"2024–2038",rimColorNote:"柠檬绿金",chineseFoodPairings:["水煮鱼","泰式咖喱蟹"]},
  "reims-vintage-champagne":{varietalId:"chardonnay",regionId:"champagne-reims",worldGroup:"old-world",classificationBadge:"Champagne AOC · Vintage",drinkingWindow:"2025–2042",rimColorNote:"浅金细泡",chineseFoodPairings:["盐酥鸡","生煎包"]},
  "tokaji-aszu-5-puttonyos":{varietalId:"chenin-blanc",regionId:"tokaj",worldGroup:"old-world",classificationBadge:"Tokaj PDO · 5 Puttonyos",drinkingWindow:"2025–2060",rimColorNote:"金黄琥珀",chineseFoodPairings:["广式烧鹅","杏仁豆腐"]},
  "ningxia-legacy-kanaan-cab-marselan":{varietalId:"marselan",regionId:"ningxia-helan",worldGroup:"china-terroir",classificationBadge:"贺兰山东麓精品酒庄",drinkingWindow:"2025–2038",rimColorNote:"紫红边缘",chineseFoodPairings:["盐池滩羊","酱牛肉"]},
  "yunnan-aoyun-cabernet":{varietalId:"cabernet-sauvignon",regionId:"yunnan-diqing",worldGroup:"china-terroir",classificationBadge:"香格里拉高山村落地块",drinkingWindow:"2028–2048",rimColorNote:"深紫宝石红",chineseFoodPairings:["牦牛肉","松茸"]},
  "penglai-qiushan-valley-chardonnay":{title:"山东九顶庄园小芒森 / 霞多丽",grapeVarietals:"霞多丽与小芒森",varietalId:"chardonnay",regionId:"shandong-penglai",worldGroup:"china-terroir",classificationBadge:"蓬莱海岸精品干白",drinkingWindow:"2024–2032",rimColorNote:"浅柠檬金",chineseFoodPairings:["清蒸鲈鱼","葱烧海参"]},
};

const additions: NewWine[] = [
  {id:"chablis-grand-cru",title:"夏布利特级园霞多丽",style:"white",origin:"Chablis Grand Cru AOC",country:"法国",grape:"100% 霞多丽",varietal:"chardonnay",region:"burgundy-chablis",group:"old-world",color:"#DCCB72",badge:"Chablis Grand Cru",window:"2027–2042",rim:"柠檬金绿边",aromas:["柠檬","牡蛎壳","燧石"]},
  {id:"pomerol-petrus-merlot",title:"波美侯蓝黏土梅洛名庄",style:"red",origin:"Pomerol AOC",country:"法国",grape:"梅洛主导",varietal:"merlot",region:"bordeaux-right-bank",group:"old-world",color:"#671D30",badge:"Pomerol 名庄范式",window:"2028–2050",rim:"深宝石红",aromas:["黑李子","紫罗兰","松露"]},
  {id:"chateauneuf-du-pape",title:"教皇新堡歌海娜西拉混酿",style:"red",origin:"Châteauneuf-du-Pape AOC",country:"法国",grape:"歌海娜、西拉、慕合怀特",varietal:"syrah",region:"rhone-valley",group:"old-world",color:"#792134",badge:"南罗纳 Cru AOC",window:"2026–2040",rim:"石榴红",aromas:["黑莓","普罗旺斯香草","胡椒"]},
  {id:"barolo-nebbiolo",title:"巴罗洛内比奥罗名庄",style:"red",origin:"Barolo DOCG",country:"意大利",grape:"100% 内比奥罗",varietal:"nebbiolo",region:"piedmont-barolo",group:"old-world",color:"#9A3E38",badge:"Barolo DOCG",window:"2030–2055",rim:"浅石榴砖红",aromas:["玫瑰","焦油","酸樱桃"]},
  {id:"brunello-montalcino",title:"布鲁奈罗·蒙塔奇诺桑娇维塞",style:"red",origin:"Brunello di Montalcino DOCG",country:"意大利",grape:"100% Sangiovese Grosso",varietal:"sangiovese",region:"tuscany",group:"old-world",color:"#852830",badge:"Brunello DOCG",window:"2028–2048",rim:"宝石转石榴红",aromas:["酸樱桃","皮革","干草药"]},
  {id:"amarone-valpolicella",title:"阿玛罗尼风干葡萄红酒",style:"red",origin:"Amarone della Valpolicella DOCG",country:"意大利",grape:"科维纳混酿",varietal:"sangiovese",region:"tuscany",group:"old-world",color:"#5C1A29",badge:"Amarone DOCG",window:"2026–2045",rim:"浓郁石榴红",aromas:["葡萄干","黑樱桃","可可"]},
  {id:"rioja-gran-reserva",title:"里奥哈特级珍藏丹魄",style:"red",origin:"Rioja DOCa",country:"西班牙",grape:"丹魄主导",varietal:"sangiovese",region:"rioja",group:"old-world",color:"#81302F",badge:"Gran Reserva",window:"2025–2040",rim:"石榴砖红",aromas:["红樱桃","椰子","烟草"]},
  {id:"sancerre-sauvignon",title:"桑塞尔燧石长相思",style:"white",origin:"Sancerre AOC",country:"法国",grape:"100% 长相思",varietal:"sauvignon-blanc",region:"rhone-valley",group:"old-world",color:"#E0D77B",badge:"Sancerre AOC",window:"2024–2032",rim:"浅柠檬绿",aromas:["醋栗","柑橘","燧石"]},
  {id:"sauternes-yquem-style",title:"苏玳一级庄贵腐甜白",style:"sweet-fortified",origin:"Sauternes AOC",country:"法国",grape:"赛美容、长相思",varietal:"sauvignon-blanc",region:"bordeaux-left-bank",group:"old-world",color:"#C98A28",badge:"Premier Cru Supérieur 范式",window:"2028–2070",rim:"金黄琥珀",aromas:["杏脯","蜂蜜","藏红花"]},
  {id:"vintage-port",title:"杜罗河年份波特加强酒",style:"sweet-fortified",origin:"Douro DOC / Vintage Port",country:"葡萄牙",grape:"多品种田间混酿",varietal:"syrah",region:"rioja",group:"old-world",color:"#5B142A",badge:"Vintage Port",window:"2030–2070",rim:"紫红转石榴红",aromas:["黑莓果酱","紫罗兰","可可"]},
  {id:"napa-opus-cabernet",title:"纳帕谷作品一号式赤霞珠混酿",style:"red",origin:"Napa Valley AVA",country:"美国",grape:"赤霞珠主导波尔多混酿",varietal:"cabernet-sauvignon",region:"napa-valley",group:"new-world",color:"#551528",badge:"Napa Valley AVA",window:"2028–2048",rim:"浓紫宝石红",aromas:["黑醋栗","雪松","黑巧克力"]},
  {id:"oregon-willamette-pinot",title:"俄勒冈威拉米特谷黑皮诺",style:"red",origin:"Willamette Valley AVA",country:"美国",grape:"100% 黑皮诺",varietal:"pinot-noir",region:"napa-valley",group:"new-world",color:"#973848",badge:"Willamette Valley AVA",window:"2025–2038",rim:"透明宝石红",aromas:["蔓越莓","玫瑰","林地"]},
  {id:"barossa-old-vine-shiraz",title:"巴罗萨百年老藤设拉子",style:"red",origin:"Barossa Valley GI",country:"澳大利亚",grape:"100% Shiraz",varietal:"syrah",region:"barossa-valley",group:"new-world",color:"#48152A",badge:"Old Vine Charter",window:"2027–2045",rim:"不透明紫红",aromas:["黑莓","黑胡椒","甘草"]},
  {id:"marlborough-sauvignon",title:"马尔堡长相思标杆干白",style:"white",origin:"Marlborough GI",country:"新西兰",grape:"100% 长相思",varietal:"sauvignon-blanc",region:"marlborough",group:"new-world",color:"#DCE17B",badge:"Marlborough GI",window:"2024–2030",rim:"浅柠檬绿",aromas:["百香果","醋栗","青草"]},
  {id:"maipo-almaviva-blend",title:"迈坡谷活灵魂式佳美娜混酿",style:"red",origin:"Maipo Valley DO",country:"智利",grape:"赤霞珠、佳美娜混酿",varietal:"cabernet-sauvignon",region:"maipo-valley",group:"new-world",color:"#58182A",badge:"Maipo Valley DO",window:"2027–2045",rim:"深宝石红",aromas:["黑醋栗","薄荷","雪松"]},
  {id:"mendoza-high-altitude-malbec",title:"门多萨高海拔马尔贝克",style:"red",origin:"Uco Valley GI",country:"阿根廷",grape:"100% 马尔贝克",varietal:"cabernet-sauvignon",region:"maipo-valley",group:"new-world",color:"#4D1830",badge:"Uco Valley GI",window:"2025–2038",rim:"浓紫红",aromas:["黑李子","紫罗兰","可可"]},
  {id:"stellenbosch-pinotage",title:"斯泰伦博斯皮诺塔吉",style:"red",origin:"Stellenbosch WO",country:"南非",grape:"100% Pinotage",varietal:"pinot-noir",region:"barossa-valley",group:"new-world",color:"#702032",badge:"Stellenbosch WO",window:"2025–2038",rim:"宝石红",aromas:["黑樱桃","烟熏","香料"]},
  {id:"niagara-vidal-icewine",title:"尼亚加拉威代尔冰酒",style:"sweet-fortified",origin:"Niagara Peninsula VQA",country:"加拿大",grape:"100% Vidal",varietal:"riesling",region:"napa-valley",group:"new-world",color:"#C98B29",badge:"VQA Icewine",window:"2025–2040",rim:"浓金黄色",aromas:["菠萝","杏脯","蜂蜜"]},
  {id:"jerez-oloroso-sherry",title:"赫雷斯欧罗索氧化型雪莉",style:"sweet-fortified",origin:"Jerez-Xérès-Sherry DO",country:"西班牙",grape:"100% Palomino",varietal:"chardonnay",region:"rioja",group:"new-world",color:"#A96327",badge:"Oloroso · Solera",window:"现在–2045",rim:"深琥珀桃花心木",aromas:["核桃","橙皮","皮革"]},
  {id:"yinchuan-bonaparte-pinot",title:"银川博纳佰馥生物动力黑皮诺",style:"red",origin:"宁夏银川冷凉地块",country:"中国",grape:"100% 黑皮诺",varietal:"pinot-noir",region:"ningxia-helan",group:"china-terroir",color:"#96394A",badge:"生物动力精品地块",window:"2025–2035",rim:"透明宝石红",aromas:["酸樱桃","玫瑰","香料"],china:true,province:"nx"},
  {id:"helan-qingxue-jiabeilan",title:"贺兰晴雪加贝兰赤霞珠",style:"red",origin:"贺兰山东麓",country:"中国",grape:"赤霞珠主导",varietal:"cabernet-sauvignon",region:"ningxia-helan",group:"china-terroir",color:"#5A1728",badge:"中国精品酒庄里程碑",window:"2026–2040",rim:"深宝石红",aromas:["黑醋栗","雪松","烟草"],china:true,province:"nx"},
  {id:"xige-vine-marselan",title:"西鸽酒庄藤上藤马瑟兰",style:"red",origin:"贺兰山东麓",country:"中国",grape:"100% 马瑟兰",varietal:"marselan",region:"ningxia-helan",group:"china-terroir",color:"#55152C",badge:"老藤马瑟兰",window:"2026–2040",rim:"浓紫红",aromas:["紫罗兰","黑莓","甘草"],china:true,province:"nx"},
  {id:"penglai-longdai-red",title:"山东蓬莱珑岱丘山谷红酒",style:"red",origin:"蓬莱丘山谷",country:"中国",grape:"赤霞珠、马瑟兰混酿",varietal:"cabernet-sauvignon",region:"shandong-penglai",group:"china-terroir",color:"#631D2B",badge:"拉菲罗斯柴尔德中国酒庄",window:"2027–2042",rim:"宝石红",aromas:["黑樱桃","紫罗兰","海风矿物"],china:true,province:"sd"},
  {id:"xinjiang-tiansai-marselan",title:"新疆天塞珍藏马瑟兰",style:"red",origin:"焉耆盆地",country:"中国",grape:"100% 马瑟兰",varietal:"marselan",region:"xinjiang-tianshan",group:"china-terroir",color:"#52152D",badge:"天山雪水精品地块",window:"2026–2040",rim:"深紫红",aromas:["黑莓","紫花","香料"],china:true,province:"xj"},
];

export const fullGrapeSpecimens: GrapeWineSpecimen[] = [
  ...originalGrapeSpecimens.map((wine) => ({ ...wine, ...enrichExisting[wine.id] })),
  ...additions.map(newWine),
];
