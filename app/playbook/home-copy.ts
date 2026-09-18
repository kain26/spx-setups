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
  "break-and-hold": {
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
    heroMeta: "EXPERIMENTAL SETUPS · V1.1",
    method: "Read 5m. Execute 1m.",
    heroFirst: "Amateurs hunt entries.",
    heroSecondLead: "Professionals wait for ",
    heroEm: "location",
    heroSecondTail: ".",
    countAria: "Six experimental setups",
    countLabel: "SETUPS",
    flow: "Risk → Location → Confirmation",
    indexTitle: "Six setups.",
    caseTitle: "Different conditions, different observations.",
    caseTableAria: "Market cases and matching setups",
    caseHeaders: ["NO.", "5m CASE", "KEY EVIDENCE", "SETUP"],
  },
  zh: {
    heroMeta: "实验性 SETUPS · V1.1",
    method: "先看 5m。再做 1m。",
    heroFirst: "新手猜涨跌，",
    heroSecondLead: "老手等",
    heroEm: "位置",
    heroSecondTail: "。",
    countAria: "六个实验性 Setup",
    countLabel: "SETUPS",
    flow: "风险 → 位置 → 确认",
    indexTitle: "六个 Setup。",
    caseTitle: "不同环境，不同观察。",
    caseTableAria: "Case 与 Setup 对照",
    caseHeaders: ["NO.", "5m CASE", "关键证据", "对应 SETUP"],
  },
} as const;

export const decisionRows: Record<HomeLocale, string[][]> = {
  en: [
    ["01", "Failed break", "Fails outside, then reclaims", "Sweep & Reclaim"],
    ["02", "True break", "Accepts outside; retest holds", "Break & Hold"],
    ["03", "Trend pullback", "First / second VWAP retest", "VWAP Pullback"],
    ["04", "Range edge", "Wall test fails; returns to range", "Wall Rejection"],
    ["05", "Compression", "5m balance; 1m flag", "Compression Expansion"],
    ["06", "Sustained decline", "1m 13 / 21; extreme 5m 9 / 13", "Magic 13–21 Turn"],
  ],
  zh: [
    ["01", "假突破", "墙外失败，重新收回", "Sweep & Reclaim"],
    ["02", "真突破", "墙外接受，回踩守住", "Break & Hold"],
    ["03", "趋势回撤", "首次 / 二次回踩 VWAP", "VWAP Pullback"],
    ["04", "区间边界", "Wall 测试失败，回到区间", "Wall Rejection"],
    ["05", "波动压缩", "5m 出平衡，1m 旗形", "Compression Expansion"],
    ["06", "持续下跌", "1m 13 / 21；极端时 5m 9 / 13", "Magic 13–21 Turn"],
  ],
};
