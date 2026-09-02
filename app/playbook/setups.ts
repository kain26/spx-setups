export type ChartTone = "orange" | "green" | "red" | "blue" | "muted";

export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export type ChartLevel = {
  value: number;
  label: string;
  tone: ChartTone;
  dashed?: boolean;
};

export type ChartGuide = {
  values: number[];
  label: string;
  tone: ChartTone;
};

export type ChartAnnotation = {
  index: number;
  value: number;
  label: string;
  tone: ChartTone;
  dx?: number;
  dy?: number;
};

export type ChartSpec = {
  title: string;
  timeframe: "5 MIN" | "1 MIN";
  purpose: string;
  candles: Candle[];
  levels: ChartLevel[];
  guides?: ChartGuide[];
  annotations: ChartAnnotation[];
  timeLabels: [string, string, string];
};

export type QuickSetup = {
  case: string;
  fiveMinute: string;
  oneMinute: string;
  entry: string;
  stop: string;
  target: string;
  skip: string;
};

export type PlaybookSetup = {
  number: string;
  slug: string;
  family: string;
  name: string;
  nameCn: string;
  quick: QuickSetup;
  summary: string;
  marketState: string;
  regime: string;
  timeWindow: string;
  logic: string;
  context: string[];
  fiveMinuteRules: string[];
  oneMinuteRules: string[];
  entry: string;
  invalidation: string;
  stop: string;
  targets: string[];
  optionStructure: string[];
  avoid: string[];
  mirror: string;
  charts: [ChartSpec, ChartSpec];
};

const candles = (rows: Array<[number, number, number, number]>): Candle[] =>
  rows.map(([open, high, low, close]) => ({ open, high, low, close }));

export const setups: PlaybookSetup[] = [
  {
    number: "01",
    slug: "sweep-reclaim",
    family: "FAILED BREAK · REVERSAL",
    name: "Sweep & Reclaim",
    nameCn: "扫流动性后收复",
    quick: {
      case: "关键位假突破，5m 收回。",
      fiveMinute: "刺穿 Wall / VWAP 后实体收回内侧；下一根不再失守。",
      oneMinute: "扫高 / 低 → reclaim close → 首次回踩守住。",
      entry: "突破回踩 K 的高点 / 低点。",
      stop: "Sweep 极值外。",
      target: "先看 1R，再看 VWAP / 下一道 Wall。",
      skip: "只有 1m 反弹，5m 仍在失效侧。",
    },
    summary: "价格短暂刺穿关键位，无法在外侧形成接受，随后收回并守住。交易的是失败突破，不是盲目抄底。",
    marketState: "关键位附近出现假突破，原方向衰竭",
    regime: "正 Gamma / 中性；负 Gamma 下必须更快确认",
    timeWindow: "09:45–14:30 ET；避开数据公布前",
    logic: "突破只证明价格去过那里；收复并守住，才证明市场拒绝了那里的价格。",
    context: [
      "关键位必须在盘前标记：Put Wall / Call Wall、VWAP、PDH / PDL、PMH / PML 或 Opening Range。",
      "价格从单一方向推进到关键位，最好伴随加速或明显长影线；区间中部的随机刺穿不算。",
      "GEX、VWAP 与 5m 趋势至少不能互相冲突；三个方向相反时直接跳过。",
    ],
    fiveMinuteRules: [
      "一根 5m K 线刺穿关键位，但收盘重新回到关键位内侧。",
      "收复 K 的实体不能只是十字星；收盘应位于整根 K 线的上半部（看多）或下半部（看空）。",
      "下一根 5m 不得再次收在失效侧；它可以回踩，但必须表现出价格接受。",
    ],
    oneMinuteRules: [
      "1m 先扫掉最近低点 / 高点，再出现一根明确的 reclaim close。",
      "收复后突破最后一个 1m lower high（看多）或 higher low（看空）。",
      "等待第一次回踩守住关键位或 reclaim K 的 50% 区域；没有回踩就不追。",
    ],
    entry: "第一次 1m 回踩守住后，突破回踩 K 的高点（看多）/ 低点（看空）进场。",
    invalidation: "1m 再次收回关键位失效侧，或突破 sweep 极值。",
    stop: "结构止损放在 sweep 极值之外；金额止损必须小于今日剩余风险预算，两者取更近且入场前固定。",
    targets: [
      "T1：最近的 5m 微型摆动高 / 低，或达到 1R 后先减风险。",
      "T2：VWAP、区间中轴或下一道 Options Wall。",
      "若 3–5 根 1m K 线没有延续，按时间失效退出，不等 Theta 处理仓位。",
    ],
    optionStructure: [
      "波动正在扩张、价差紧：小仓单腿 Call / Put，快速兑现 Gamma。",
      "IV 偏高或目标距离有限：5–10 点借方价差，牺牲部分上限换取更稳定成本。",
    ],
    avoid: [
      "关键位已被连续测试三次以上，流动性可能已被消耗。",
      "收复发生在重大数据公布前几分钟。",
      "只有 1m 反弹，但 5m 仍持续收在失效侧。",
      "为了等反弹而放宽止损、加仓或睡觉持仓。",
    ],
    mirror: "图中展示看多版本；看空版本完全镜像：扫过阻力 → 收回阻力下方 → 1m lower high → 跌破触发。",
    charts: [
      {
        title: "5m 先判断：突破失败了吗？",
        timeframe: "5 MIN",
        purpose: "关键位外侧没有形成接受，5m 收盘重新回到内侧。",
        candles: candles([
          [108, 109, 106.4, 107],
          [107, 108, 104.9, 105.5],
          [105.5, 106.2, 103.6, 104.2],
          [104.2, 105.1, 102.2, 103],
          [103, 104, 100.8, 102],
          [102, 102.8, 99.5, 100.5],
          [100.5, 101.5, 96.8, 101.1],
          [101.1, 103.9, 100.8, 103.3],
          [103.3, 103.7, 101.4, 102],
          [102, 105.2, 101.8, 104.8],
          [104.8, 106.6, 104.2, 106],
          [106, 107.6, 105.4, 107],
        ]),
        levels: [
          { value: 100, label: "PUT WALL / KEY LEVEL", tone: "orange", dashed: true },
          { value: 106, label: "VWAP / T1", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 6, value: 96.8, label: "SWEEP", tone: "red", dx: -22, dy: 28 },
          { index: 7, value: 103.9, label: "5m 收回", tone: "green", dx: -18, dy: -26 },
          { index: 8, value: 101.4, label: "守住", tone: "orange", dx: 0, dy: 28 },
        ],
        timeLabels: ["09:35", "10:00", "10:30"],
      },
      {
        title: "1m 再执行：收复 → 回踩 → 触发",
        timeframe: "1 MIN",
        purpose: "不在收复 K 里追；等第一次回踩守住，再突破微型高点。",
        candles: candles([
          [102.5, 102.9, 101.4, 101.8],
          [101.8, 102.1, 100.6, 101],
          [101, 101.4, 99.2, 99.7],
          [99.7, 100.8, 97.6, 100.5],
          [100.5, 102.4, 100.3, 102.1],
          [102.1, 102.3, 100.9, 101.3],
          [101.3, 103.4, 101.1, 103.1],
          [103.1, 103.6, 102.2, 102.6],
          [102.6, 104.5, 102.4, 104.1],
          [104.1, 105.2, 103.7, 104.8],
          [104.8, 106, 104.4, 105.7],
          [105.7, 106.7, 105.2, 106.2],
        ]),
        levels: [
          { value: 100, label: "KEY LEVEL", tone: "orange", dashed: true },
          { value: 102.5, label: "ENTRY ABOVE", tone: "green", dashed: true },
          { value: 98.9, label: "STRUCTURE STOP", tone: "red", dashed: true },
          { value: 106, label: "T2 / NEXT LEVEL", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 3, value: 97.6, label: "扫低点", tone: "red", dx: -10, dy: 28 },
          { index: 4, value: 102.4, label: "收复", tone: "green", dx: -10, dy: -28 },
          { index: 5, value: 100.9, label: "第一次回踩", tone: "orange", dx: 10, dy: 30 },
          { index: 6, value: 103.4, label: "ENTRY", tone: "green", dx: 8, dy: -30 },
        ],
        timeLabels: ["10:01", "10:06", "10:12"],
      },
    ],
  },
  {
    number: "02",
    slug: "break-and-hold",
    family: "ACCEPTED BREAK · CONTINUATION",
    name: "Break & Hold",
    nameCn: "突破并接受",
    quick: {
      case: "关键位被吸收后真实突破。",
      fiveMinute: "实体收过关键位；下一根回踩仍在外侧。",
      oneMinute: "外侧形成 HL / LH，再破微型结构。",
      entry: "突破 retest K 的高点 / 低点。",
      stop: "Retest 极值外；回旧区间即错。",
      target: "先看 1R / 区间等幅，再看下一道 Wall。",
      skip: "突破直撞下一道墙，或只有 1m 刺穿。",
    },
    summary: "关键位被真实突破后，价格没有跌回原区间，而是在外侧完成接受。交易的是新价格被市场认可。",
    marketState: "趋势启动或区间边界被吸收",
    regime: "负 Gamma / 波动扩张最理想",
    timeWindow: "09:45–14:30 ET；开盘第一根不追",
    logic: "真正的突破不是一根长 K，而是突破后回不去。Retest 的任务是证明原阻力已经转为支撑。",
    context: [
      "同一关键位被多次测试，回撤幅度越来越小，说明挂单正在被吸收。",
      "5m VWAP 与短期结构同向；看多时价格应位于 VWAP 上方，看空时相反。",
      "突破方向前方要有空间；下一道 Wall 距离太近时没有赔率。",
    ],
    fiveMinuteRules: [
      "5m 实体明确收过关键位，不能只有影线越过。",
      "突破 K 的区间或成交节奏明显扩大，收盘靠近高点（看多）或低点（看空）。",
      "下一根 5m 回踩关键位但不收回原区间，形成 hold。",
    ],
    oneMinuteRules: [
      "1m 突破后允许回踩，但回踩 K 的实体应缩小，不能连续大实体反向。",
      "关键位外侧形成 higher low（看多）/ lower high（看空）。",
      "突破回踩结构的微型高点 / 低点才触发；第一根突破 K 不直接追。",
    ],
    entry: "关键位外侧形成 1m higher low / lower high 后，突破微型结构进场。",
    invalidation: "1m 连续收回原区间，或 5m hold K 最终收在关键位内侧。",
    stop: "放在 retest 极值外侧；如果这个距离使最大亏损超过预算，就缩小合约风险或放弃。",
    targets: [
      "T1：突破前压缩区间的等幅投射，或 1R。",
      "T2：下一道 Call Wall / Put Wall、PDH / PDL。",
      "若突破后立刻失速并回到原区间，按 failed break 处理，不把延续单改成祈祷单。",
    ],
    optionStructure: [
      "负 Gamma + 价格加速：小仓单腿，优先流动性好的近 ATM / 轻度 OTM。",
      "IV 已被拉高：借方价差控制 Vega 与买入成本。",
    ],
    avoid: [
      "突破 K 直接撞上下一道墙，空间不足。",
      "突破只发生在 1m，5m 尚未收盘确认。",
      "VWAP 仍然水平且价格反复穿越，属于震荡噪声。",
      "用市价追第一根巨大突破 K。",
    ],
    mirror: "图中展示看多突破；看空版本为 Put Wall / PDL 跌破后反抽不过，1m lower high 跌破触发。",
    charts: [
      {
        title: "5m 先判断：关键位外侧形成接受",
        timeframe: "5 MIN",
        purpose: "多次测试后实体突破，下一根回踩不再回到旧区间。",
        candles: candles([
          [100, 101.6, 99.5, 101],
          [101, 102.8, 100.4, 102.2],
          [102.2, 104, 101.5, 103.5],
          [103.5, 105.4, 102.8, 104.5],
          [104.5, 106, 103.6, 104],
          [104, 105.8, 103.8, 105.2],
          [105.2, 106.1, 104.4, 105.6],
          [105.6, 108.9, 105.2, 108.2],
          [108.2, 108.6, 106.2, 106.8],
          [106.8, 110.1, 106.5, 109.5],
          [109.5, 112, 109, 111.4],
          [111.4, 113, 110.8, 112.5],
        ]),
        levels: [
          { value: 106, label: "CALL WALL / IB HIGH", tone: "orange", dashed: true },
          { value: 112, label: "NEXT WALL / T2", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 6, value: 106.1, label: "反复测试", tone: "muted", dx: -35, dy: -26 },
          { index: 7, value: 108.9, label: "5m 突破", tone: "green", dx: -18, dy: -28 },
          { index: 8, value: 106.2, label: "HOLD", tone: "orange", dx: 4, dy: 28 },
        ],
        timeLabels: ["10:00", "10:30", "11:00"],
      },
      {
        title: "1m 再执行：外侧回踩形成 higher low",
        timeframe: "1 MIN",
        purpose: "突破后不追，等回踩缩量并在关键位外侧重新转强。",
        candles: candles([
          [103.6, 104.2, 103.1, 103.9],
          [103.9, 104.8, 103.4, 104.5],
          [104.5, 105.4, 104, 105.1],
          [105.1, 106.1, 104.7, 105.7],
          [105.7, 108, 105.4, 107.7],
          [107.7, 108.3, 106.5, 106.9],
          [106.9, 107.2, 105.9, 106.3],
          [106.3, 107.6, 106.1, 107.3],
          [107.3, 109, 107.1, 108.7],
          [108.7, 110, 108.2, 109.6],
          [109.6, 111.1, 109.2, 110.7],
          [110.7, 112, 110.3, 111.6],
        ]),
        levels: [
          { value: 106, label: "BROKEN LEVEL", tone: "orange", dashed: true },
          { value: 107.7, label: "ENTRY ABOVE", tone: "green", dashed: true },
          { value: 105.6, label: "STOP / BACK INSIDE", tone: "red", dashed: true },
          { value: 112, label: "NEXT WALL", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 4, value: 108, label: "IMPULSE", tone: "green", dx: -12, dy: -28 },
          { index: 6, value: 105.9, label: "RETEST", tone: "orange", dx: -8, dy: 28 },
          { index: 7, value: 107.6, label: "ENTRY", tone: "green", dx: 8, dy: -28 },
        ],
        timeLabels: ["10:26", "10:32", "10:38"],
      },
    ],
  },
  {
    number: "03",
    slug: "vwap-pullback",
    family: "TREND · PULLBACK",
    name: "VWAP Pullback",
    nameCn: "趋势中的 VWAP 回踩",
    quick: {
      case: "趋势成立后的第 1 / 2 次 VWAP 回踩。",
      fiveMinute: "HH / HL + 上升 VWAP；回踩未形成反向接受。",
      oneMinute: "不再创新低 → micro BOS；看空镜像。",
      entry: "突破 BOS 确认 K。",
      stop: "1m pullback 极值外。",
      target: "前高 / 低，再看下一道 Wall。",
      skip: "VWAP 水平，或已是第 3 次以上回踩。",
    },
    summary: "5m 趋势已经建立，价格第一次或第二次有序回踩上升 / 下降 VWAP；1m 重新顺势后参与下一段。",
    marketState: "趋势日中的正常回撤，不是追高",
    regime: "负 Gamma 或中性偏趋势",
    timeWindow: "10:00–14:00 ET；优先第一、第二次回踩",
    logic: "VWAP 不是碰到就买。先有趋势，再有有序回踩，最后要看到 1m 重新恢复原趋势。",
    context: [
      "5m 已形成 HH/HL（看多）或 LL/LH（看空），VWAP 有明确斜率。",
      "价格大部分时间停留在 VWAP 同一侧，而不是来回穿越。",
      "回踩过程实体缩小、速度放慢；急跌穿越 VWAP 不是健康 pullback。",
    ],
    fiveMinuteRules: [
      "趋势腿先离开 VWAP，证明市场愿意在一侧交易。",
      "第一次或第二次回踩触及 VWAP / EMA48 附近，但 5m 未形成反向接受。",
      "回踩低点最好与前一结构高点、Wall 或 PDH/PDL 重合。",
    ],
    oneMinuteRules: [
      "回踩阶段出现连续更小实体，反向动能衰减。",
      "1m 先停止创新低（看多），随后突破最后一个 lower high；看空镜像。",
      "突破后的小回踩不再破低，才是可执行触发。",
    ],
    entry: "1m 市场结构重新顺势（micro BOS）后，突破确认 K 高 / 低进场。",
    invalidation: "1m 重新跌破 pullback 极值，或 5m 收到 VWAP 另一侧并形成接受。",
    stop: "放在 1m pullback 极值外侧；不要把止损放到遥远的 5m 趋势起点。",
    targets: [
      "T1：日内前高 / 前低，或 1R。",
      "T2：下一道 Wall、Expected Move 边界或 5m 等幅目标。",
      "若到前高 / 前低后没有放量突破，先兑现，不预设一定创新高 / 新低。",
    ],
    optionStructure: [
      "趋势速度重新加快：小仓单腿参与 Gamma。",
      "距离目标较短或 IV 偏高：窄借方价差。",
    ],
    avoid: [
      "VWAP 水平且价格一天内多次穿越。",
      "第三次、第四次回踩同一位置，趋势边际正在衰减。",
      "回踩直接以大实体穿过 VWAP，没有 1m 结构修复。",
      "距离对向 Wall 过近。",
    ],
    mirror: "图中展示上升 VWAP 的 Call Setup；下降 VWAP 下的 Put Setup 完全镜像。",
    charts: [
      {
        title: "5m 先判断：趋势存在，回踩是有序的",
        timeframe: "5 MIN",
        purpose: "价格持续位于上升 VWAP 上方，第一次回踩没有形成反向接受。",
        candles: candles([
          [100, 102, 99.5, 101.7],
          [101.7, 104, 101.2, 103.5],
          [103.5, 106, 103, 105.4],
          [105.4, 107.5, 104.9, 106.8],
          [106.8, 109, 106.2, 108.4],
          [108.4, 109.1, 106.8, 107.3],
          [107.3, 107.8, 105.7, 106.2],
          [106.2, 107.2, 105.4, 106.8],
          [106.8, 109.2, 106.5, 108.8],
          [108.8, 111, 108.2, 110.5],
          [110.5, 112.8, 110, 112.1],
          [112.1, 114, 111.6, 113.5],
        ]),
        levels: [
          { value: 112.8, label: "PRIOR HIGH / T1", tone: "blue", dashed: true },
        ],
        guides: [
          { values: [99.7, 100.5, 101.6, 102.8, 104, 104.8, 105.4, 105.9, 106.6, 107.5, 108.5, 109.6], label: "RISING VWAP", tone: "orange" },
        ],
        annotations: [
          { index: 4, value: 109, label: "趋势腿", tone: "green", dx: -12, dy: -26 },
          { index: 6, value: 105.7, label: "第一次回踩", tone: "orange", dx: -14, dy: 30 },
          { index: 8, value: 109.2, label: "恢复趋势", tone: "green", dx: 4, dy: -28 },
        ],
        timeLabels: ["10:00", "10:30", "11:00"],
      },
      {
        title: "1m 再执行：动能衰减 → micro BOS",
        timeframe: "1 MIN",
        purpose: "回踩不再创新低，突破最后一个 lower high 后才入场。",
        candles: candles([
          [108.5, 108.9, 107.6, 108],
          [108, 108.2, 107, 107.3],
          [107.3, 107.6, 106.4, 106.8],
          [106.8, 107.1, 105.9, 106.2],
          [106.2, 106.8, 105.7, 106.5],
          [106.5, 107.2, 106.1, 106.9],
          [106.9, 108, 106.7, 107.7],
          [107.7, 108.2, 107.1, 107.5],
          [107.5, 109, 107.3, 108.7],
          [108.7, 110, 108.4, 109.7],
          [109.7, 111.2, 109.3, 110.8],
          [110.8, 112, 110.3, 111.6],
        ]),
        levels: [
          { value: 107.8, label: "MICRO BOS / ENTRY", tone: "green", dashed: true },
          { value: 105.5, label: "PULLBACK STOP", tone: "red", dashed: true },
          { value: 112, label: "PRIOR HIGH", tone: "blue", dashed: true },
        ],
        guides: [
          { values: [105.5, 105.7, 105.9, 106.1, 106.3, 106.5, 106.7, 106.9, 107.1, 107.3, 107.5, 107.7], label: "VWAP", tone: "orange" },
        ],
        annotations: [
          { index: 3, value: 105.9, label: "回踩减速", tone: "orange", dx: -16, dy: 28 },
          { index: 4, value: 105.7, label: "不再破低", tone: "muted", dx: 8, dy: 34 },
          { index: 6, value: 108, label: "BOS", tone: "green", dx: 4, dy: -28 },
        ],
        timeLabels: ["10:26", "10:32", "10:38"],
      },
    ],
  },
  {
    number: "04",
    slug: "wall-rejection",
    family: "RANGE EDGE · MEAN REVERSION",
    name: "Wall Rejection",
    nameCn: "期权墙拒绝",
    quick: {
      case: "正 Gamma 区间边界拒绝。",
      fiveMinute: "Wall 外刺穿后收回墙内；下一根不再创新高 / 低。",
      oneMinute: "二次失败 + LH / HL，再破微型摆动。",
      entry: "破 1m swing low / high。",
      stop: "Rejection 极值外；5m 墙外接受即错。",
      target: "VWAP / 区间中轴。",
      skip: "负 Gamma 大实体连续穿墙。",
    },
    summary: "价格测试 Call Wall / Put Wall 后无法在墙外接受，5m 留下拒绝，1m 形成失败拍卖并回到区间。",
    marketState: "正 Gamma 震荡日的区间边界",
    regime: "正 Gamma / VWAP 平缓",
    timeWindow: "10:00–14:30 ET；优先第一、第二次测试",
    logic: "墙不会因为名字叫 Wall 就自动挡住价格。只有墙外失败、墙内重新接受，才有均值回归价值。",
    context: [
      "价格处在明确区间边界，而不是趋势中途；VWAP 平缓且价格多次回归。",
      "Call Wall / Put Wall 与 PDH/PDL、IB High/Low 或前高前低重合时更好。",
      "当日没有强烈单边催化；VIX 与成交节奏没有持续扩张。",
    ],
    fiveMinuteRules: [
      "价格触及或短暂越过 Wall，但 5m 收盘回到墙内。",
      "拒绝 K 出现长影线或吞没，下一根 K 无法重新突破极值。",
      "反弹不破前高 / 回落不破前低，说明更多是 short-covering / long liquidation，而非新趋势。",
    ],
    oneMinuteRules: [
      "墙外出现两次尝试失败，或一次 sweep 后立刻强势收回。",
      "看空时形成 lower high 并跌破最近 1m swing low；看多镜像。",
      "入场后必须快速离开 Wall；若价格继续贴墙横盘，退出。",
    ],
    entry: "1m 失败拍卖完成后，跌破 / 突破微型摆动点进场，不在第一次触墙时猜。",
    invalidation: "1m 重新突破 rejection 极值，或 5m 在 Wall 外侧收盘接受。",
    stop: "放在 rejection / sweep 极值之外；墙外形成接受时立即承认 Setup 已失效。",
    targets: [
      "T1：区间中轴或 VWAP。",
      "T2：区间另一侧，但只有在价格持续远离 Wall 时才保留。",
      "正 Gamma 日优先快速兑现，不把均值回归单幻想成趋势大行情。",
    ],
    optionStructure: [
      "目标距离足够、回归速度快：小仓单腿 Put / Call。",
      "预期只是回到 VWAP：借方价差更匹配有限目标。",
      "正 Gamma + 低波动 + 边界稳定：可用 5 点宽定义风险信用价差；本 Playbook 要求收取权利金至少 2.50，并在 50% 利润处退出。",
    ],
    avoid: [
      "负 Gamma 且 Wall 正被大实体连续突破。",
      "重大新闻后成交与波动持续扩张。",
      "第三次以上反复撞墙，墙可能正在被吸收。",
      "因为看见 Wall 就提前卖方重仓或裸卖。",
    ],
    mirror: "图中展示 Call Wall 的看空拒绝；Put Wall 看多拒绝完全镜像。",
    charts: [
      {
        title: "5m 先判断：墙外失败，墙内接受",
        timeframe: "5 MIN",
        purpose: "冲过 Call Wall 的价格没有被市场接受，下一根无法再创新高。",
        candles: candles([
          [102, 103.2, 101.5, 102.8],
          [102.8, 104.5, 102.3, 104],
          [104, 106.2, 103.6, 105.7],
          [105.7, 108, 105.2, 107.5],
          [107.5, 109.5, 107, 109],
          [109, 112.2, 108.1, 108.6],
          [108.6, 110.1, 107.2, 107.8],
          [107.8, 109.2, 106.4, 108.7],
          [108.7, 109.3, 105.8, 106.2],
          [106.2, 106.8, 103.8, 104.5],
          [104.5, 105.2, 102.9, 103.4],
          [103.4, 104.2, 101.8, 102.5],
        ]),
        levels: [
          { value: 110, label: "CALL WALL / RANGE HIGH", tone: "orange", dashed: true },
          { value: 104, label: "VWAP / RANGE MID", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 5, value: 112.2, label: "墙外失败", tone: "red", dx: -18, dy: -28 },
          { index: 6, value: 110.1, label: "不再创新高", tone: "muted", dx: 0, dy: -28 },
          { index: 8, value: 105.8, label: "离开 Wall", tone: "green", dx: 0, dy: 30 },
        ],
        timeLabels: ["11:00", "11:30", "12:00"],
      },
      {
        title: "1m 再执行：lower high → 跌破触发",
        timeframe: "1 MIN",
        purpose: "第一次触墙不做；等失败拍卖与微型结构转空。",
        candles: candles([
          [108.2, 109.2, 107.9, 108.8],
          [108.8, 110.4, 108.5, 109.8],
          [109.8, 111.5, 109.2, 109.4],
          [109.4, 110.2, 108.5, 109.8],
          [109.8, 110.7, 109, 109.2],
          [109.2, 109.5, 108, 108.3],
          [108.3, 108.8, 106.9, 107.2],
          [107.2, 107.8, 106.3, 106.8],
          [106.8, 107.1, 105.2, 105.6],
          [105.6, 106.1, 104.2, 104.8],
          [104.8, 105.2, 103.5, 104],
          [104, 104.4, 102.8, 103.3],
        ]),
        levels: [
          { value: 110, label: "CALL WALL", tone: "orange", dashed: true },
          { value: 108, label: "ENTRY BELOW", tone: "green", dashed: true },
          { value: 110.8, label: "REJECTION STOP", tone: "red", dashed: true },
          { value: 104, label: "VWAP / T1", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 2, value: 111.5, label: "SWEEP", tone: "red", dx: -12, dy: -28 },
          { index: 4, value: 110.7, label: "LOWER HIGH", tone: "orange", dx: -12, dy: -28 },
          { index: 5, value: 108, label: "ENTRY", tone: "green", dx: 10, dy: 30 },
        ],
        timeLabels: ["11:16", "11:22", "11:28"],
      },
    ],
  },
  {
    number: "05",
    slug: "compression-expansion",
    family: "COMPRESSION · EXPANSION",
    name: "Compression Expansion",
    nameCn: "压缩后的波动扩张",
    quick: {
      case: "5m 压缩后离开平衡。",
      fiveMinute: "至少 3 根区间收窄，实体收出 OR 边界。",
      oneMinute: "Impulse 后 2–4 根 flag，不回原区间。",
      entry: "突破第一面 flag。",
      stop: "Flag 极值外。",
      target: "先看 1R / 压缩等幅，再看下一道 Wall。",
      skip: "没有 flag 就追第一根扩张 K。",
    },
    summary: "5m 波动与实体持续收窄，价格围绕 Opening Range / VWAP 蓄力；突破后等 1m 旗形，再参与真正的扩张腿。",
    marketState: "低波动压缩即将转为方向扩张",
    regime: "Gamma Flip 附近 / 负 Gamma 转换",
    timeWindow: "09:50–14:00 ET；事件后等待方向确认",
    logic: "压缩提供潜在能量，突破提供方向，1m 旗形提供可定义的风险。三者缺一不做。",
    context: [
      "至少三根 5m K 的高低区间收窄，实体变小，价格围绕 VWAP / OR 边界聚集。",
      "突破方向前方有空间，且突破伴随区间与速度扩张。",
      "如果有数据事件，等公布后的方向形成；不在结果未知时把双边成本当成免费彩票。",
    ],
    fiveMinuteRules: [
      "压缩区间边界清楚，可画出 OR High / Low 或微型 balance。",
      "5m 实体收出区间，且收盘靠近突破方向一端。",
      "突破 K 之后不立即用同等大实体反向吞没。",
    ],
    oneMinuteRules: [
      "第一段 impulse 后出现 2–4 根小 K 的旗形 / 浅回踩。",
      "回踩不能回到 5m 压缩区间内部。",
      "突破 1m flag high / low 进场；没有旗形就放过第一段。",
    ],
    entry: "5m 确认突破后，1m 第一个紧凑旗形突破进场。",
    invalidation: "1m 回到压缩区间内部并形成接受，或跌破 / 突破旗形反向极值。",
    stop: "放在 1m flag 极值外；不要使用整个 5m 压缩区间作为止损距离。",
    targets: [
      "T1：压缩区间高度的 1 倍投射，或 1R。",
      "T2：下一道 Wall / PDH / PDL。",
      "若突破后 IV 已快速扩张但价格停滞，优先退出，避免正确方向仍被溢价回落吞噬。",
    ],
    optionStructure: [
      "方向与速度确认后：小仓单腿最能兑现扩张 Gamma。",
      "突破发生后 IV 已明显抬升：借方价差限制买贵的影响。",
    ],
    avoid: [
      "压缩区间本身太宽，没有清楚边界。",
      "只看到一根 1m spike，5m 尚未离开区间。",
      "突破方向马上遇到大 Wall。",
      "错过第一面旗形后连续追第二、第三根扩张 K。",
    ],
    mirror: "图中展示向上扩张；向下版本以 OR Low 跌破、1m bear flag 跌破为触发。",
    charts: [
      {
        title: "5m 先判断：波动压缩后真正离开区间",
        timeframe: "5 MIN",
        purpose: "实体与区间持续收窄；大实体收出 OR High 后才确认方向。",
        candles: candles([
          [100.5, 102.8, 99.5, 102],
          [102, 103, 100.2, 101],
          [101, 102.6, 100.4, 102],
          [102, 102.8, 100.9, 101.4],
          [101.4, 102.4, 101, 101.9],
          [101.9, 102.5, 101.2, 101.6],
          [101.6, 102.7, 101.3, 102.2],
          [102.2, 106.5, 102, 106],
          [106, 107, 104.8, 105.4],
          [105.4, 108.2, 105.1, 107.8],
          [107.8, 110, 107.2, 109.5],
          [109.5, 111, 108.9, 110.6],
        ]),
        levels: [
          { value: 103, label: "OR HIGH / RANGE EDGE", tone: "orange", dashed: true },
          { value: 100, label: "OR LOW", tone: "muted", dashed: true },
          { value: 110, label: "NEXT WALL / T2", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 5, value: 101.2, label: "RANGE 收窄", tone: "muted", dx: -26, dy: 30 },
          { index: 7, value: 106.5, label: "5m EXPANSION", tone: "green", dx: -24, dy: -28 },
          { index: 8, value: 104.8, label: "不回区间", tone: "orange", dx: 6, dy: 28 },
        ],
        timeLabels: ["09:35", "10:00", "10:30"],
      },
      {
        title: "1m 再执行：Impulse 后第一面旗形",
        timeframe: "1 MIN",
        purpose: "不追第一段扩张；等 2–4 根小 K 构成 flag，再突破入场。",
        candles: candles([
          [101.5, 102.2, 101.2, 101.9],
          [101.9, 103.4, 101.7, 103.1],
          [103.1, 105.5, 102.9, 105.1],
          [105.1, 107.3, 104.8, 106.9],
          [106.9, 107.2, 106, 106.3],
          [106.3, 106.8, 105.6, 106.1],
          [106.1, 106.6, 105.8, 106.3],
          [106.3, 108, 106.1, 107.7],
          [107.7, 109.1, 107.3, 108.8],
          [108.8, 110, 108.4, 109.6],
          [109.6, 111, 109.1, 110.7],
          [110.7, 112, 110.2, 111.6],
        ]),
        levels: [
          { value: 103, label: "5m RANGE EDGE", tone: "orange", dashed: true },
          { value: 107, label: "FLAG BREAK / ENTRY", tone: "green", dashed: true },
          { value: 105.4, label: "FLAG STOP", tone: "red", dashed: true },
          { value: 110, label: "NEXT WALL", tone: "blue", dashed: true },
        ],
        annotations: [
          { index: 3, value: 107.3, label: "IMPULSE", tone: "green", dx: -14, dy: -28 },
          { index: 5, value: 105.6, label: "2–4 根小 K", tone: "orange", dx: -18, dy: 30 },
          { index: 7, value: 108, label: "ENTRY", tone: "green", dx: 8, dy: -28 },
        ],
        timeLabels: ["10:01", "10:07", "10:13"],
      },
    ],
  },
];

export function getSetup(slug: string) {
  return setups.find((setup) => setup.slug === slug);
}
