import { useMemo, useState } from "react";
import { useDrinkFootprints } from "../../../core/drinkFootprints";
import {
  TEA_CATEGORY_SHORT_META,
  type SeasonalTeaGuide,
  type TeaCategoryId,
  type TeaCompendiumBundle,
  type TeaHistoryEra,
  type TeaMonograph,
} from "../types";
import { LiquorCupBadge, SongRunningHead } from "./LiquorCupBadge";

export interface TeaChroniclesViewProps {
  bundle: TeaCompendiumBundle;
  onOpenTea: (teaId: string, category?: TeaCategoryId) => void;
  onJumpToSpectrum?: (cat: TeaCategoryId) => void;
  onJumpToWare?: () => void;
}

type SeasonId = SeasonalTeaGuide["seasonId"];

const SEASON_ORDER: SeasonId[] = ["spring", "summer", "autumn", "winter"];

const SEASON_VISUAL_META: Record<
  SeasonId,
  { seal: string; label: string; climateTag: string; accentHex: string }
> = {
  spring: {
    seal: "春",
    label: "孟春至暮春 · 生发之令",
    climateTag: "东风解冻 · 万芽竞发",
    accentHex: "#588B57",
  },
  summer: {
    seal: "夏",
    label: "孟夏至季夏 · 清暑之令",
    climateTag: "暑湿交蒸 · 清心涤烦",
    accentHex: "#35685F",
  },
  autumn: {
    seal: "秋",
    label: "孟秋至暮秋 · 润燥之令",
    climateTag: "金风玉露 · 甘润敛肺",
    accentHex: "#9A5B25",
  },
  winter: {
    seal: "冬",
    label: "孟冬至季冬 · 温藏之令",
    climateTag: "围炉煮雪 · 暖胃敛阳",
    accentHex: "#A6402C",
  },
};

const FALLBACK_ERAS: TeaHistoryEra[] = [
  {
    id: "han-wei-gengyin",
    dynasty: "先秦两汉魏晋",
    years: "前202 – 589",
    methodTitle: "生叶煮羹 · 药食同源茗粥法",
    keyFigureOrClassic: "王褒《僮约》「武阳买茶」· 华佗《食论》",
    teaForm: "野生鲜叶采摘直煮或晒干作饼，配葱姜橘皮同煮",
    utensils: ["青铜鼎釜", "陶鍑", "漆耳杯", "原始青瓷碗"],
    aestheticCore: "以茶代酒 · 清神醒睡 · 养廉去腻",
    summary:
      "中华饮茶自巴蜀滥觞，顺长江东传江南。彼时制茶未分杀青与发酵，采生叶加葱、姜、茱萸同煮为茗粥羹饮，完成了从上古药用植物向文人日常清饮的第一次跨越。",
  },
  {
    id: "tang-jiancha",
    dynasty: "唐代",
    years: "618 – 907",
    methodTitle: "蒸青饼茶 · 炙碾罗煎法",
    keyFigureOrClassic: "茶圣陆羽《茶经》三卷十节 · 卢仝《七碗茶歌》",
    teaForm: "蒸青穿孔团饼茶（阳羡紫笋、顾渚贡饼）",
    utensils: ["风炉", "交床茶夹", "铜铁茶碾", "罗合", "鍑", "越窑秘色青瓷碗", "邢窑白瓷碗"],
    aestheticCore: "精行俭德 · 辨水三沸 · 青瓷冰玉映绯汤",
    summary:
      "陆羽著《茶经》确立采造烤炙碾罗煎饮二十四器礼法，革除葱姜杂料，专重火候三沸：一沸鱼目微有声加盐调味，二沸缘边如涌泉连珠投末，三沸腾波鼓浪育华酌分，茶道自此独立成宗。",
  },
  {
    id: "song-diancha",
    dynasty: "宋代",
    years: "960 – 1279",
    methodTitle: "龙团研膏 · 击拂点茶与斗茶",
    keyFigureOrClassic: "蔡襄《茶录》· 宋徽宗赵佶《大观茶论》",
    teaForm: "北苑龙凤团饼（蒸青研膏蜡面极细茶末）与双井草茶",
    utensils: ["建安兔毫/油滴建盏", "金银长流汤瓶", "竹茶筅", "精细茶磨", "漆雕盏托"],
    aestheticCore: "白乳浮盏 · 咬盏留痕 · 极简宋韵清雅",
    summary:
      "宋代点茶臻于东方茶艺巅峰：将团饼炙干碾成绝细茶罗末置入黑釉建盏，汤瓶注沸水调膏，以竹茶筅手腕运力七汤击拂，幻化如雪沫乳花紧咬盏壁，更衍生出以汤画幻山水禽鸟之「分茶（茶百戏）」。",
  },
  {
    id: "ming-yuecha",
    dynasty: "明代",
    years: "1368 – 1644",
    methodTitle: "废团兴散 · 撮泡瀹饮法大变革",
    keyFigureOrClassic: "明太祖朱元璋诏罢龙团 · 许次纾《茶疏》· 张源《茶录》",
    teaForm: "全芽叶散茶（炒青绿茶为主，松萝、虎丘、龙井崛起）",
    utensils: ["宜兴时大彬紫砂壶", "景德镇甜白/青花小盏", "瓦铫汤壶"],
    aestheticCore: "自然天真 · 返璞归真 · 书斋山林清供",
    summary:
      "洪武二十四年朱元璋诏罢劳民之造龙团，敕改贡芽叶散茶，一举奠定今日全球沸水直接冲泡整叶茶（瀹饮）之范式。炒青技术成熟催生紫砂茶壶与白瓷茶盏兴起，茶叶本味与兰豆真香彻底解放。",
  },
  {
    id: "qing-gongfucha",
    dynasty: "清代",
    years: "1644 – 1911",
    methodTitle: "六大茶类定型 · 闽粤乌龙工夫茶",
    keyFigureOrClassic: "袁枚《随园食单·茶酒单》· 俞蛟《潮嘉风月记》",
    teaForm: "乌龙半发酵、全发酵工夫红茶、白茶、黑茶与窨花茶百花齐放",
    utensils: ["孟臣朱泥小品水平壶", "景德镇三才盖碗", "若深白瓷三小杯", "橄榄核炭炉与玉书煨"],
    aestheticCore: "壶小香聚 · 关公巡城 · 韩信点兵之精微秩序",
    summary:
      "清代制茶化学经验大成：武夷岩茶与安溪铁观音确立做青半发酵，正山小种与祁门红茶风靡欧美，普洱入宫廷，潮汕与闽南更演化出高投茶量、小壶滚水快冲之「工夫茶」仪轨。",
  },
  {
    id: "modern-terroir-science",
    dynasty: "近当代",
    years: "1912 – 今",
    methodTitle: "陈椽六大茶类科学体系与微域风土审评",
    keyFigureOrClassic: "吴觉农《茶经述评》· 陈椽教授「六大茶类分类学」· 人类非遗名录",
    teaForm: "六大茶类 + 再加工花茶标准体系、单株古树与名山坑涧风土精细化",
    utensils: ["国标审评白瓷杯碗组", "薄胎品鉴盖碗", "手工纯银煮水壶", "控温鹅颈壶与冷萃器"],
    aestheticCore: "科学量化多酚酶学 · 守正非遗与当代生活茶席",
    summary:
      "1979年陈椽教授以茶多酚酶促氧化与制茶工序建立影响世界的「六大茶类分类法」；2022年「中国传统制茶技艺及其相关习俗」列入联合国人类非物质文化遗产，科学感官审评与东方茶席美学交相辉映。",
  },
];

const FALLBACK_SEASONS: Record<SeasonId, SeasonalTeaGuide> = {
  spring: {
    seasonId: "spring",
    seasonTitle: "春山试新 · 升发清阳",
    solarTerms: "立春 · 雨水 · 惊蛰 · 春分 · 清明 · 谷雨",
    bodyNeeds: "疏肝理气、解春困宿滞、清头目生津",
    recommendedCategories: ["green", "scented", "yellow"],
    recommendedTeaIds: ["west-lake-longjing"],
    brewingTip:
      "春茶芽叶娇嫩，宜取山泉软水晾至 80℃–88℃，以敞口水晶杯或薄胎白瓷盖碗中投悬壶低斟，切忌合盖久闷。",
    poeticNote: "晴窗细乳戏分茶，且将新火试新茶，诗酒趁年华。",
  },
  summer: {
    seasonId: "summer",
    seasonTitle: "夏木阴阴 · 清暑涤烦",
    solarTerms: "立夏 · 小满 · 芒种 · 夏至 · 小暑 · 大暑",
    bodyNeeds: "清热解暑、补充电解质与氨基酸、消暑湿困脾",
    recommendedCategories: ["white", "green", "yellow"],
    recommendedTeaIds: ["fuding-baihaoyinzhen", "west-lake-longjing"],
    brewingTip:
      "盛夏宜饮日光萎凋白茶或高山清香绿茶；薄胎盖碗 88℃ 快出汤，亦可用室温矿泉水冷萃 6 小时得清甜甘露。",
    poeticNote: "竹下忘言对紫茶，全胜羽客醉流霞。清风北窗卧，一碗涤炎埃。",
  },
  autumn: {
    seasonId: "autumn",
    seasonTitle: "秋岚玉露 · 甘润平燥",
    solarTerms: "立秋 · 处暑 · 白露 · 秋分 · 寒露 · 霜降",
    bodyNeeds: "润肺生津、御秋燥伤津、平调寒热阴阳",
    recommendedCategories: ["oolong", "white"],
    recommendedTeaIds: ["wuyi-rougui", "fenghuang-milaixiang"],
    brewingTip:
      "金秋最宜半发酵青茶（乌龙），不寒不热恰居中和；以 98℃–100℃ 沸水入朱泥小壶或白瓷盖碗激扬花果岩骨幽香。",
    poeticNote: "寒夜客来茶当酒，竹炉汤沸火初红。空山新雨后，岩骨带秋香。",
  },
  winter: {
    seasonId: "winter",
    seasonTitle: "冬炉煮雪 · 温胃藏阳",
    solarTerms: "立冬 · 小雪 · 大雪 · 冬至 · 小寒 · 大寒",
    bodyNeeds: "温中暖胃、助消膏粱厚味、敛阳御寒护脾肾",
    recommendedCategories: ["black", "dark"],
    recommendedTeaIds: ["menghai-laobanzhang"],
    brewingTip:
      "隆冬宜择全发酵红茶、陈年普洱熟茶、六堡茶或老白茶；以紫砂壶 100℃ 滚水冲泡，或置银壶/陶壶围炉慢煮。",
    poeticNote: "绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无。",
  },
};

function parseSolarTerms(raw: string): string[] {
  return raw
    .split(/[·、，,|/]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function TeaChroniclesView({
  bundle,
  onOpenTea,
  onJumpToSpectrum,
  onJumpToWare,
}: TeaChroniclesViewProps) {
  const { isTasted } = useDrinkFootprints();

  // Use authored eras when comprehensive; merge cleanly over canonical 6-dynasty timeline if stub
  const eras = useMemo<TeaHistoryEra[]>(() => {
    if (bundle.eras.length >= 4) {
      return bundle.eras;
    }
    const byId = new Map(bundle.eras.map((e) => [e.id, e]));
    const byDynasty = new Map(bundle.eras.map((e) => [e.dynasty, e]));
    return FALLBACK_ERAS.map(
      (fb) => byId.get(fb.id) ?? byDynasty.get(fb.dynasty) ?? fb,
    );
  }, [bundle.eras]);

  // Always expose all 4 seasons, prioritizing bundle.seasons verbatim
  const seasons = useMemo<SeasonalTeaGuide[]>(() => {
    return SEASON_ORDER.map((sid) => {
      const found = bundle.seasons.find((s) => s.seasonId === sid);
      return found ?? FALLBACK_SEASONS[sid];
    });
  }, [bundle.seasons]);

  const [selectedEraId, setSelectedEraId] = useState<string>(() => eras[0]?.id ?? "");
  const [selectedSeasonId, setSelectedSeasonId] = useState<SeasonId>("spring");

  const activeEra = useMemo<TeaHistoryEra>(() => {
    return eras.find((e) => e.id === selectedEraId) ?? eras[0];
  }, [eras, selectedEraId]);

  const activeEraIndex = useMemo(
    () => Math.max(0, eras.findIndex((e) => e.id === activeEra?.id)),
    [eras, activeEra],
  );

  const activeSeason = useMemo<SeasonalTeaGuide>(() => {
    return seasons.find((s) => s.seasonId === selectedSeasonId) ?? seasons[0];
  }, [seasons, selectedSeasonId]);

  const activeSeasonVisual = SEASON_VISUAL_META[activeSeason.seasonId];
  const solarTermTokens = useMemo(
    () => parseSolarTerms(activeSeason.solarTerms),
    [activeSeason.solarTerms],
  );

  // Resolve clickable TeaMonograph cards for activeSeason.recommendedTeaIds
  const resolvedSeasonalTeas = useMemo<TeaMonograph[]>(() => {
    const map = new Map<string, TeaMonograph>();
    for (const m of bundle.monographs) {
      map.set(m.id, m);
    }

    const list: TeaMonograph[] = [];
    const seen = new Set<string>();

    for (const tid of activeSeason.recommendedTeaIds) {
      const item = map.get(tid);
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        list.push(item);
      }
    }

    // Graceful fallback when running against minimal 1-tea stub data
    if (list.length === 0) {
      for (const m of bundle.monographs) {
        if (activeSeason.recommendedCategories.includes(m.category) && !seen.has(m.id)) {
          seen.add(m.id);
          list.push(m);
        }
      }
    }
    if (list.length === 0 && bundle.monographs.length > 0) {
      list.push(...bundle.monographs.slice(0, 3));
    }

    return list;
  }, [bundle.monographs, activeSeason]);

  return (
    <div className="tea-chronicles-view" data-testid="tea-chronicles-view">
      {/* 1. Millennium Tea Evolution Timeline */}
      <section className="tea-folio-panel" aria-label="中华千年茶史流变长卷">
        <SongRunningHead
          volumeTag="茗典 · 卷五 · 茶脉"
          title="中华千年饮茶法与制茶形制流变史纲"
          subtitle="从汉魏茗粥羹饮、唐人蒸青煎茶、宋人龙团击拂点茶，至明代废团瀹散、清代工夫茶定型与当代科学审评"
          rightSlot={
            <span>
              历史纪元共 {eras.length} 幕 · 当前审视：{activeEra?.dynasty}
            </span>
          }
        />

        {/* Interactive Dynasty Selector Ribbon */}
        <div className="tea-era-ribbon" role="tablist" aria-label="历代茶史纪元切换">
          {eras.map((era, idx) => {
            const isActive = era.id === activeEra?.id;
            return (
              <button
                key={era.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`tea-era-step-btn${isActive ? " active" : ""}`}
                data-testid={`era-step-btn-${era.id}`}
                onClick={() => setSelectedEraId(era.id)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--tea-celadon)" }}>
                    0{idx + 1} · {era.years}
                  </span>
                  {isActive && (
                    <span style={{ fontSize: "0.7rem", color: "var(--tea-cinnabar)", fontWeight: 700 }}>
                      ● 当值
                    </span>
                  )}
                </div>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "0.98rem", color: "var(--tea-ink)" }}>
                  {era.dynasty}
                </strong>
                <small style={{ fontSize: "0.76rem", color: "var(--tea-ink-secondary)", lineHeight: 1.35 }}>
                  {era.methodTitle}
                </small>
              </button>
            );
          })}
        </div>

        {/* Selected Dynasty Spotlight Comparison Card */}
        {activeEra && (
          <div
            className="tea-era-spotlight"
            style={{ marginTop: "1rem" }}
            data-testid={`era-spotlight-${activeEra.id}`}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.9rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <span className="tea-cinnabar-seal">
                  {activeEra.dynasty.slice(0, 1)}
                </span>
                <div>
                  <span className="zw-search-badge" style={{ fontFamily: "var(--font-mono)", borderColor: "var(--tea-celadon)", color: "var(--tea-celadon)" }}>
                    {activeEra.dynasty}（{activeEra.years}）
                  </span>
                  <h3 style={{ fontSize: "1.28rem", marginTop: "0.22rem" }}>
                    {activeEra.methodTitle}
                  </h3>
                </div>
              </div>

              <div className="zw-chip-row">
                <button
                  type="button"
                  className="zw-pill-btn"
                  disabled={activeEraIndex <= 0}
                  style={{ opacity: activeEraIndex <= 0 ? 0.45 : 1, padding: "0.32rem 0.7rem", fontSize: "0.8rem" }}
                  onClick={() => {
                    if (activeEraIndex > 0) setSelectedEraId(eras[activeEraIndex - 1].id);
                  }}
                >
                  ← 上一纪元
                </button>
                <button
                  type="button"
                  className="zw-pill-btn"
                  disabled={activeEraIndex >= eras.length - 1}
                  style={{ opacity: activeEraIndex >= eras.length - 1 ? 0.45 : 1, padding: "0.32rem 0.7rem", fontSize: "0.8rem" }}
                  onClick={() => {
                    if (activeEraIndex < eras.length - 1) {
                      setSelectedEraId(eras[activeEraIndex + 1].id);
                    }
                  }}
                >
                  下一纪元 →
                </button>
              </div>
            </div>

            <div className="tea-era-metrics-grid">
              <div className="tea-dossier-box">
                <h5>代表茶圣与传世茶书</h5>
                <p style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--tea-ink)" }}>
                  {activeEra.keyFigureOrClassic}
                </p>
              </div>
              <div className="tea-dossier-box">
                <h5>茶叶制法与主流形制</h5>
                <p>{activeEra.teaForm}</p>
              </div>
              <div className="tea-dossier-box">
                <h5>时代茶道精神与审美</h5>
                <p style={{ color: "var(--tea-celadon-deep)", fontWeight: 600 }}>
                  {activeEra.aestheticCore}
                </p>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.38rem", flexWrap: "wrap" }}>
                <small style={{ fontSize: "0.75rem", color: "var(--tea-ink-muted)" }}>
                  当世标准司茶器皿组合：
                </small>
                {onJumpToWare && (
                  <button
                    type="button"
                    className="zw-chip"
                    style={{ fontSize: "0.73rem", padding: "0.16rem 0.52rem" }}
                    onClick={onJumpToWare}
                  >
                    🏺 前往器道卷对照今古茶器 →
                  </button>
                )}
              </div>
              <div className="zw-chip-row">
                {activeEra.utensils.map((utensil) => (
                  <span
                    key={utensil}
                    className="zw-search-badge"
                    style={{
                      background: "var(--tea-ivory)",
                      borderColor: "var(--tea-rule-outer)",
                      padding: "0.2rem 0.58rem",
                      fontSize: "0.78rem",
                    }}
                  >
                    🏺 {utensil}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--tea-ink)", lineHeight: 1.78, borderTop: "1px dashed var(--tea-rule-outer)", paddingTop: "0.75rem" }}>
              {activeEra.summary}
            </p>
          </div>
        )}

        {/* Full Chronological Timeline Cards */}
        <div style={{ marginTop: "1.25rem" }}>
          <h4 style={{ fontSize: "0.96rem", color: "var(--tea-ink-secondary)", marginBottom: "0.75rem" }}>
            历代饮茶演变通览谱（点击任一朝代卡片聚焦详考）
          </h4>
          <div className="tea-era-timeline-list">
            {eras.map((era) => {
              const isActive = era.id === activeEra?.id;
              return (
                <article
                  key={era.id}
                  className={`tea-era-timeline-card${isActive ? " active" : ""}`}
                  style={{ cursor: "pointer" }}
                  data-testid={`era-timeline-card-${era.id}`}
                  onClick={() => setSelectedEraId(era.id)}
                >
                  <span className="tea-era-timeline-dot" aria-hidden="true" />

                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
                      <h4 style={{ fontSize: "1.08rem" }}>{era.dynasty}</h4>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--tea-ink-muted)" }}>
                        {era.years}
                      </span>
                      <span className="zw-search-badge" style={{ borderColor: "var(--tea-celadon)", color: "var(--tea-celadon)" }}>
                        {era.methodTitle}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-serif)", color: "var(--tea-amber)" }}>
                      审美：{era.aestheticCore}
                    </span>
                  </div>

                  <div style={{ marginTop: "0.45rem", fontSize: "0.82rem", color: "var(--tea-ink-secondary)", display: "flex", flexWrap: "wrap", gap: "0.9rem" }}>
                    <span>
                      <strong>典籍/人物：</strong>
                      {era.keyFigureOrClassic}
                    </span>
                    <span>
                      <strong>茶叶形制：</strong>
                      {era.teaForm}
                    </span>
                  </div>

                  <p style={{ marginTop: "0.48rem", fontSize: "0.85rem", color: "var(--tea-ink-secondary)", lineHeight: 1.65 }}>
                    {era.summary}
                  </p>

                  <div className="zw-chip-row" style={{ marginTop: "0.55rem" }}>
                    {era.utensils.map((u) => (
                      <span key={u} className="zw-search-badge" style={{ background: "var(--tea-ivory)" }}>
                        {u}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Four Seasons & 24 Solar Terms Tea Almanac */}
      <section className="tea-folio-panel parchment" aria-label="四时二十四节气顺时饮茶历">
        <SongRunningHead
          volumeTag="四时二十四节气茶历"
          title="春生 · 夏长 · 秋收 · 冬藏 — 二十四节气顺时饮茶方略"
          subtitle="顺应四时寒暑更迭与人体阳气升降，择定当令茶类与司茶水温，调和身心节律"
          rightSlot={
            <span style={{ color: activeSeasonVisual.accentHex, fontWeight: 600 }}>
              当令卷目：{activeSeason.seasonTitle}
            </span>
          }
        />

        {/* 4-Season Interactive Tabs */}
        <div className="tea-seasons-tabs" role="tablist" aria-label="春夏秋冬四时茶历切换">
          {seasons.map((season) => {
            const isActive = season.seasonId === activeSeason.seasonId;
            const vis = SEASON_VISUAL_META[season.seasonId];
            return (
              <button
                key={season.seasonId}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`tea-season-tab${isActive ? " active" : ""}`}
                style={isActive ? { borderColor: vis.accentHex } : undefined}
                data-testid={`season-tab-${season.seasonId}`}
                onClick={() => setSelectedSeasonId(season.seasonId)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span
                    className="tea-cinnabar-seal sm"
                    style={{ background: vis.accentHex, boxShadow: `0 0 0 1px ${vis.accentHex}` }}
                  >
                    {vis.seal}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: vis.accentHex, fontWeight: 600 }}>
                    {vis.climateTag}
                  </span>
                </div>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.02rem", color: "var(--tea-ink)", marginTop: "0.2rem" }}>
                  {season.seasonTitle}
                </strong>
                <small style={{ fontSize: "0.74rem", color: "var(--tea-ink-muted)", lineHeight: 1.4 }}>
                  {season.solarTerms}
                </small>
              </button>
            );
          })}
        </div>

        {/* Active Season Detail Stage */}
        <div
          style={{ marginTop: "1.15rem", display: "flex", flexDirection: "column", gap: "1.05rem" }}
          data-testid={`season-detail-${activeSeason.seasonId}`}
        >
          {/* Classical Poetic Scroll */}
          <blockquote
            className="tea-poetic-scroll"
            style={{ margin: 0, borderLeftColor: activeSeasonVisual.accentHex }}
            data-testid="season-poetic-scroll"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <span>「{activeSeason.poeticNote}」</span>
              <small style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--tea-ink-muted)" }}>
                {activeSeasonVisual.label}
              </small>
            </div>
          </blockquote>

          {/* 6 Solar Terms Strip for the Active Season */}
          <div>
            <small style={{ display: "block", fontSize: "0.75rem", color: "var(--tea-ink-muted)", marginBottom: "0.42rem" }}>
              本季统摄二十四节气之六节令：
            </small>
            <div className="tea-solar-terms-strip">
              {solarTermTokens.map((term, i) => (
                <div
                  key={term}
                  className="tea-solar-term-pill"
                  style={{ borderLeft: `3px solid ${activeSeasonVisual.accentHex}` }}
                >
                  <span>{term}</span>
                  <small style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--tea-ink-faint)" }}>
                    0{i + 1}候
                  </small>
                </div>
              ))}
            </div>
          </div>

          {/* Body Needs & Seasonal Brewing Guidance */}
          <div className="tea-taste-craft-split">
            <div className="tea-dossier-box" style={{ background: "var(--tea-ivory)" }}>
              <h5 style={{ color: activeSeasonVisual.accentHex }}>
                🌿 四时脏腑调摄与身心茶养需求
              </h5>
              <p style={{ fontSize: "0.88rem", color: "var(--tea-ink)", marginBottom: "0.55rem" }}>
                {activeSeason.bodyNeeds}
              </p>
              <div className="zw-chip-row">
                <small style={{ fontSize: "0.74rem", color: "var(--tea-ink-muted)" }}>当令宜饮茶类：</small>
                {activeSeason.recommendedCategories.map((cid) => {
                  const cm = TEA_CATEGORY_SHORT_META[cid];
                  return (
                    <button
                      key={cid}
                      type="button"
                      className="zw-chip"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.32rem", fontSize: "0.76rem", padding: "0.2rem 0.56rem" }}
                      onClick={() => onJumpToSpectrum?.(cid)}
                    >
                      <LiquorCupBadge liquorColorHex={cm.liquorHex} size="xs" />
                      <span>{cm.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="tea-dossier-box" style={{ background: "var(--tea-ivory)" }}>
              <h5 style={{ color: activeSeasonVisual.accentHex }}>
                🫖 当季司茶水温与行茶要诀
              </h5>
              <p style={{ fontSize: "0.88rem", color: "var(--tea-ink)", lineHeight: 1.68 }}>
                {activeSeason.brewingTip}
              </p>
            </div>
          </div>

          {/* Resolved Clickable TeaMonograph Cards */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
              <h4 style={{ fontSize: "1.02rem" }}>
                🍵 「{activeSeason.seasonTitle}」馆藏甄选茶席（点击直入本纪三态精读）
              </h4>
              <span style={{ fontSize: "0.75rem", color: "var(--tea-ink-muted)" }}>
                共甄选 {resolvedSeasonalTeas.length} 席代表名茶
              </span>
            </div>

            <div className="tea-comparator-matrix">
              {resolvedSeasonalTeas.map((tea) => {
                const tasted = isTasted(tea.id);
                const catMeta = TEA_CATEGORY_SHORT_META[tea.category];
                return (
                  <article
                    key={tea.id}
                    className="tea-cat-matrix-card"
                    style={{ cursor: "pointer" }}
                    data-testid={`season-recommended-tea-${tea.id}`}
                    onClick={() => onOpenTea(tea.id, tea.category)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.65rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.68rem" }}>
                          <LiquorCupBadge
                            liquorColorHex={tea.liquorColorHex}
                            size="md"
                            interactive
                            label={`${tea.title} · ${tea.liquorColorLabel}`}
                          />
                          <div>
                            <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", color: "var(--tea-ink)" }}>
                              {tea.title}
                              {tasted ? " ✓" : ""}
                            </strong>
                            <small style={{ display: "block", fontSize: "0.76rem", color: "var(--tea-ink-muted)" }}>
                              {tea.provinceLabel} · {catMeta.shortLabel} · {tea.subStyle}
                            </small>
                          </div>
                        </div>

                        <span className="zw-search-badge" style={{ fontFamily: "var(--font-mono)" }}>
                          {tea.brewing.tempCelsius}℃
                        </span>
                      </div>

                      <p style={{ fontSize: "0.82rem", color: "var(--tea-ink-secondary)", lineHeight: 1.55 }}>
                        {tea.tagline}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px dashed var(--tea-rule-inner)", fontSize: "0.77rem" }}>
                      <span style={{ color: "var(--tea-amber)" }}>
                        汤色：{tea.liquorColorLabel}
                      </span>
                      <span style={{ color: "var(--tea-celadon)", fontWeight: 600 }}>
                        披阅本纪 →
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
