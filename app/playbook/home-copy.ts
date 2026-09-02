export type HomeLocale = "en" | "zh";

type SetupSummary = {
  subtitle: string;
  case: string;
  fiveMinute: string;
  oneMinute: string;
};

export const setupCopyEn: Record<string, SetupSummary> = {
  "sweep-reclaim": {
    subtitle: "Failed break → reclaim",
    case: "A key level is swept, then reclaimed before acceptance forms outside.",
    fiveMinute: "A 5m candle closes back inside the level.",
    oneMinute: "The first retest holds; trigger above or below the micro pivot.",
  },
  "break-hold": {
    subtitle: "Break → accept → hold",
    case: "Price accepts beyond the level instead of snapping back.",
    fiveMinute: "A 5m close holds outside with follow-through.",
    oneMinute: "The first pullback holds above or below the broken level.",
  },
  "vwap-pullback": {
    subtitle: "Trend → orderly pullback",
    case: "A trend is established before the first or second orderly VWAP pullback.",
    fiveMinute: "VWAP slopes with price holding mostly on one side.",
    oneMinute: "A micro reversal rejoins the trend from VWAP.",
  },
  "wall-rejection": {
    subtitle: "Test → reject → rotate",
    case: "A range edge or option wall rejects price back into balance.",
    fiveMinute: "The wall is tested, but the candle closes back inside.",
    oneMinute: "A failed auction forms and price leaves the wall quickly.",
  },
  "compression-expansion": {
    subtitle: "Compress → break → expand",
    case: "5m ranges compress around VWAP or the opening range before expansion.",
    fiveMinute: "Three or more candles contract into a clear balance.",
    oneMinute: "Wait for the break, then enter the first flag or retest.",
  },
};

export const homeCopy = {
  en: {
    heroMeta: "CURATED SETUPS · V1.0",
    heroEyebrow: "READ THE CASE / EXECUTE THE TRIGGER",
    heroFirst: "Read",
    heroSecond: "Execute",
    countAria: "Five curated setups",
    countLabel: "CASES / SETUPS",
    flow: "Context → Trigger → Risk",
    indexLabel: "01 / SETUP INDEX",
    indexTitle: "Read the market state first. Then choose the execution model.",
    caseLabel: "02 / CASE MAP",
    caseTitle: "At the same key level, the reaction decides the setup.",
    caseTableAria: "Market cases and matching setups",
    caseHeaders: ["NO.", "5m CASE", "KEY EVIDENCE", "SETUP"],
    rulesLabel: "03 / HARD RULES",
    rulesTitle: "Six rules shared by every setup.",
  },
  zh: {
    heroMeta: "精炼 SETUPS · V1.0",
    heroEyebrow: "先读 CASE / 再等 TRIGGER",
    heroFirst: "先看",
    heroSecond: "再做",
    countAria: "五个精炼 Setup",
    countLabel: "CASES / SETUPS",
    flow: "位置 → 确认 → 风险",
    indexLabel: "01 / SETUP INDEX",
    indexTitle: "先认市场状态，再选执行模型。",
    caseLabel: "02 / CASE MAP",
    caseTitle: "同一个关键位，价格反应决定 Setup。",
    caseTableAria: "Case 与 Setup 对照",
    caseHeaders: ["NO.", "5m CASE", "关键证据", "对应 SETUP"],
    rulesLabel: "03 / HARD RULES",
    rulesTitle: "六条规则，所有 Setup 共用。",
  },
} as const;

export const decisionRows: Record<HomeLocale, string[][]> = {
  en: [
    ["01", "Failed break", "Fails outside, then reclaims", "Sweep & Reclaim"],
    ["02", "True break", "Accepts outside; retest holds", "Break & Hold"],
    ["03", "Trend pullback", "First / second VWAP retest", "VWAP Pullback"],
    ["04", "Range edge", "Wall test fails; returns to range", "Wall Rejection"],
    ["05", "Compression", "5m balance; 1m flag", "Compression Expansion"],
  ],
  zh: [
    ["01", "假突破", "墙外失败，重新收回", "Sweep & Reclaim"],
    ["02", "真突破", "墙外接受，回踩守住", "Break & Hold"],
    ["03", "趋势回撤", "首次 / 二次回踩 VWAP", "VWAP Pullback"],
    ["04", "区间边界", "Wall 测试失败，回到区间", "Wall Rejection"],
    ["05", "波动压缩", "5m 出平衡，1m 旗形", "Compression Expansion"],
  ],
};

export const hardRules: Record<HomeLocale, string[][]> = {
  en: [
    ["09:35 → 09:45", "Observe first; make the first case read after 09:45 ET."],
    ["ALIGN", "Execute only when GEX, VWAP, and price action align."],
    ["MAX LOSS", "Fix maximum loss before entry; never add to a loser."],
    ["TIME STOP", "Exit a long-premium trade after 3–5 one-minute candles without follow-through."],
    ["SELLER", "For a 5-point spread, collect at least 2.50; take 50% or exit after 130 minutes."],
    ["15:00 ET", "No new positions. Do not bet on the final 30 minutes of gamma."],
  ],
  zh: [
    ["09:35 → 09:45", "先观察；09:45 后做第一轮 Case 判断。"],
    ["ALIGN", "GEX + VWAP + Price Action 同向才执行。"],
    ["MAX LOSS", "入场前固定满亏；亏损仓不加码。"],
    ["TIME STOP", "买方 3–5 根 1m K 无延续，退出。"],
    ["SELLER", "5 点宽 ≥ 2.50；50% 止盈或 130 分钟退出。"],
    ["15:00 ET", "不再开新仓，不赌最后 30 分钟 Gamma。"],
  ],
};
