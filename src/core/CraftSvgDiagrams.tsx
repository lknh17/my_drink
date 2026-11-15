import type { CSSProperties } from "react";

export type CraftDiagramKind =
  | "tea-fixation-killgreen"
  | "tea-withering-sun"
  | "tea-smothering-yellow"
  | "tea-shaking-oolong"
  | "tea-fermentation-black"
  | "tea-pile-dark"
  | "tea-scenting-jasmine"
  | "baijiu-qu-gradient"
  | "baijiu-four-pits"
  | "baijiu-zengtong-still"
  | "beer-hot-cold-brewing"
  | "huangjiu-double-ferment"
  | "grape-maceration-champagne"
  | "spirits-pot-vs-cask"
  | "cocktail-ice-thermodynamics"
  | "coffee-cherry-five-layers";

export interface CraftSvgDiagramProps {
  kind: CraftDiagramKind;
  accentHex?: string;
  title?: string;
  className?: string;
}

interface DiagramSpec {
  kicker: string;
  title: string;
  left: string;
  right: string;
  labels: [string, string, string, string];
  metrics: [string, string, string];
  mode: "leaf" | "vessel" | "flow" | "layers";
}

const SPECS: Record<CraftDiagramKind, DiagramSpec> = {
  "tea-fixation-killgreen": { kicker: "ENZYME DEACTIVATION", title: "杀青 · 干热与蒸汽钝酶", left: "锅炒 180–220℃", right: "蒸汽 100℃", labels: ["PPO 酶失活", "叶绿素锁定", "水汽逸散", "茶氨酸保留"], metrics: ["核心叶温 ≥80℃", "2–8 min", "含水率 60→35%"], mode: "leaf" },
  "tea-withering-sun": { kicker: "CELLULAR WATER MIGRATION", title: "日光萎凋 · 细胞缓慢走水", left: "日照 / 微风", right: "室内复式萎凋", labels: ["气孔蒸腾", "细胞膜通透", "蛋白水解", "氨基酸上升"], metrics: ["25–30℃", "36–72 h", "含水率 75→15%"], mode: "leaf" },
  "tea-smothering-yellow": { kicker: "MOIST-HEAT CHEMISTRY", title: "闷黄 · 湿热包覆转化", left: "牛皮纸包覆", right: "湿热微循环", labels: ["儿茶素裂解", "叶绿素降解", "苦涩下降", "甜醇上升"], metrics: ["45–65℃", "6–48 h", "RH >85%"], mode: "vessel" },
  "tea-shaking-oolong": { kicker: "EDGE OXIDATION", title: "摇青 · 绿叶红镶边与炭焙", left: "叶缘碰伤走水", right: "炭火复焙定香", labels: ["叶缘氧化", "萜烯释放", "叶脉走水", "焦糖化焙火"], metrics: ["摇 3–7 轮", "焙 90–120℃", "氧化 20–70%"], mode: "leaf" },
  "tea-fermentation-black": { kicker: "POLYPHENOL OXIDATION", title: "红茶发酵 · 揉捻破壁成金圈", left: "重揉破坏细胞", right: "有氧氧化", labels: ["TF 茶黄素", "TR 茶红素", "多酚氧化酶", "金圈与甜香"], metrics: ["25–30℃", "2–5 h", "RH 90–95%"], mode: "flow" },
  "tea-pile-dark": { kicker: "MICROBIAL FERMENTATION", title: "渥堆 · 湿热菌群与金花", left: "渥堆翻堆", right: "茯砖发花", labels: ["曲霉 / 酵母", "胞外酶水解", "冠突散囊菌", "褐变与陈香"], metrics: ["45–60℃", "7–45 d", "含水率 25–35%"], mode: "layers" },
  "tea-scenting-jasmine": { kicker: "AROMA ADSORPTION", title: "窨花 · 子夜吐香与复窨", left: "鲜花释香", right: "茶坯吸附", labels: ["芳樟醇挥发", "温湿梯度", "多孔叶面吸附", "多窨一提"], metrics: ["22–28℃", "6–12 h / 窨", "4–9 窨"], mode: "flow" },
  "baijiu-qu-gradient": { kicker: "DAQU THERMAL ECOLOGY", title: "大曲砖 · 三温型菌落梯度", left: "曲皮 · 好氧霉菌", right: "曲心 · 嗜热芽孢杆菌", labels: ["45℃ 清茬曲", "58℃ 包包曲", "65℃ 高温曲", "糖化力 / 酱香前体"], metrics: ["含水 36–40%", "培养 30–40 d", "贮曲 3–6 mo"], mode: "layers" },
  "baijiu-four-pits": { kicker: "FERMENTATION GEOLOGY", title: "四大容器 · 地质微生物剖面", left: "泥窖 / 条石窖", right: "地缸 / 大酒海", labels: ["己酸菌老窖泥", "紫红泥条石", "陶缸隔土控菌", "荆条猪血酒海"], metrics: ["18–35℃", "28–180 d", "厌氧固态发酵"], mode: "vessel" },
  "baijiu-zengtong-still": { kicker: "SOLID-STATE STEAM DISTILLATION", title: "甑桶 · 混蒸混烧与看花摘酒", left: "竹木甑箅蒸汽", right: "冷凝分段摘酒", labels: ["蒸汽穿醅", "醇酯共沸", "酒头 / 酒心 / 酒尾", "酒花判度"], metrics: ["底锅 100℃", "流酒 20–35℃", "酒心 55–70%vol"], mode: "flow" },
  "beer-hot-cold-brewing": { kicker: "HOT SIDE → COLD SIDE", title: "啤酒 · 糖化苦化与低温锁香", left: "过滤槽 / 铜煮沸釜", right: "锥罐 / Dry-Hop", labels: ["淀粉酶糖化", "α-酸异构化", "酵母代谢 CO₂", "旋沉冷投锁香"], metrics: ["糖化 62–72℃", "煮沸 60–90 min", "发酵 8–22℃"], mode: "flow" },
  "huangjiu-double-ferment": { kicker: "PARALLEL SACCHARIFICATION", title: "黄酒 · 双边复式发酵与冬酿", left: "麦曲霉菌糖化", right: "酒药酵母酒化", labels: ["淀粉→葡萄糖", "糖→乙醇", "低温开耙", "荷叶泥封坛"], metrics: ["10–18℃", "60–90 d", "煎酒 85–90℃"], mode: "vessel" },
  "grape-maceration-champagne": { kicker: "SKIN / PRESS / BOTTLE", title: "葡萄酒 · 三条萃取与起泡路径", left: "红酒带皮浸渍", right: "白酒轻压 / 瓶内二发", labels: ["花青素萃取", "单宁聚合", "轻压低氧", "转瓶除渣"], metrics: ["浸渍 5–30 d", "压榨 <1.2 bar", "瓶陈 ≥15 mo"], mode: "flow" },
  "spirits-pot-vs-cask": { kicker: "COPPER STILL & OAK", title: "烈酒 · 取酒心与橡木呼吸", left: "紫铜天鹅颈壶馏", right: "焦化橡木桶陈", labels: ["掐头去甲醇", "取中段酒心", "木质素香草醛", "氧化 / 天使分享"], metrics: ["馏出 65–75%vol", "焦化 #1–#4", "陈年 2–30 y"], mode: "vessel" },
  "cocktail-ice-thermodynamics": { kicker: "ICE THERMODYNAMICS", title: "调酒 · 层流搅拌与撞击摇合", left: "Stirred 层流", right: "Shaken 充气乳化", labels: ["低剪切降温", "融水 15–25%", "冰块撞击成核", "气泡 / 蛋白乳化"], metrics: ["目标 -5–0℃", "搅 20–40 s", "摇 8–15 s"], mode: "flow" },
  "coffee-cherry-five-layers": { kicker: "COFFEE CHERRY ANATOMY", title: "咖啡樱桃 · 五层结构与处理法", left: "水洗 / 蜜处理", right: "日晒 / 厌氧", labels: ["外果皮与果肉", "高糖果胶层", "羊皮纸 / 银皮", "双瓣生豆"], metrics: ["果胶保留 0–100%", "发酵 12–120 h", "干燥至 10–12%"], mode: "layers" },
};

function Apparatus({ mode, accent }: { mode: DiagramSpec["mode"]; accent: string }) {
  if (mode === "leaf") return <g><path d="M103 205C79 132 119 72 245 70c-8 120-63 160-142 135Z" fill={accent} opacity=".15" stroke={accent} strokeWidth="4" /><path d="M106 201c48-44 86-77 137-128M133 176l-12-54M164 145l42 18M194 113l-1-35" fill="none" stroke={accent} strokeWidth="3" /><circle cx="145" cy="127" r="8" fill="#f5c563" /><circle cx="191" cy="105" r="7" fill="#c65a43" /></g>;
  if (mode === "vessel") return <g><path d="M94 74h170l-15 132c-2 20-24 35-70 35s-68-15-70-35Z" fill={accent} opacity=".12" stroke={accent} strokeWidth="4" /><path d="M113 125h132M109 164h139M124 205h110" stroke={accent} strokeWidth="2" strokeDasharray="6 5" /><path d="M179 58v142" stroke="#c65a43" strokeWidth="4" /><path d="m170 69 9-14 9 14" fill="#c65a43" /></g>;
  if (mode === "layers") return <g>{[0, 1, 2, 3, 4].map((n) => <path key={n} d={`M85 ${78 + n * 31} Q180 ${55 + n * 34} 275 ${78 + n * 31}v25Q180 ${80 + n * 34} 85 ${103 + n * 31}Z`} fill={n % 2 ? "#f0c978" : accent} opacity={.18 + n * .09} stroke={accent} strokeWidth="2" />)}<path d="M180 55v185" stroke="#c65a43" strokeWidth="3" strokeDasharray="5 5" /></g>;
  return <g><path d="M68 166h74l21-71h42l19 71h76" fill="none" stroke={accent} strokeWidth="8" strokeLinejoin="round" /><circle cx="104" cy="166" r="35" fill={accent} opacity=".14" stroke={accent} strokeWidth="3" /><circle cx="264" cy="166" r="35" fill="#c65a43" opacity=".14" stroke="#c65a43" strokeWidth="3" /><path d="M142 166h82" stroke="#c65a43" strokeWidth="4" markerEnd="url(#craft-arrow)" /><path d="M171 87c9-18 9-29 0-44M193 87c9-18 9-29 0-44" fill="none" stroke="#8ca8a2" strokeWidth="3" /></g>;
}

export function CraftSvgDiagram({
  kind,
  accentHex = "#35685F",
  title,
  className = "",
}: CraftSvgDiagramProps) {
  const spec = SPECS[kind];
  return (
    <figure className={`zw-craft-diagram ${className}`.trim()} style={{ "--craft-accent": accentHex } as CSSProperties}>
      <svg viewBox="0 0 720 420" role="img" aria-labelledby={`${kind}-title ${kind}-desc`}>
        <title id={`${kind}-title`}>{title ?? spec.title}</title>
        <desc id={`${kind}-desc`}>{spec.labels.join("；")}</desc>
        <defs>
          <pattern id={`${kind}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" fill="none" stroke="#26342f" strokeOpacity=".08" /></pattern>
          <marker id="craft-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill="#c65a43" /></marker>
        </defs>
        <rect width="720" height="420" rx="18" fill="#fbfaf4" />
        <rect width="720" height="420" rx="18" fill={`url(#${kind}-grid)`} />
        <text x="28" y="34" className="craft-svg-kicker">{spec.kicker}</text>
        <text x="28" y="65" className="craft-svg-title">{title ?? spec.title}</text>
        <g transform="translate(8 78)"><Apparatus mode={spec.mode} accent={accentHex} /></g>
        <line x1="374" y1="85" x2="374" y2="315" stroke="#c9c2b4" />
        <text x="28" y="342" className="craft-svg-side">{spec.left}</text>
        <text x="210" y="342" className="craft-svg-side">{spec.right}</text>
        {spec.labels.map((label, index) => <g key={label} transform={`translate(397 ${101 + index * 51})`}><circle r="12" fill={index % 2 ? "#c65a43" : accentHex} /><text x="0" y="4" textAnchor="middle" className="craft-svg-no">{index + 1}</text><text x="22" y="5" className="craft-svg-label">{label}</text></g>)}
        {spec.metrics.map((metric, index) => <g key={metric} transform={`translate(${28 + index * 222} 385)`}><rect width="204" height="24" rx="12" fill={accentHex} opacity=".1" /><text x="102" y="16" textAnchor="middle" className="craft-svg-metric">{metric}</text></g>)}
      </svg>
    </figure>
  );
}
