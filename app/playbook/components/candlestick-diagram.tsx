import type { ChartSpec, ChartTone } from "@/app/playbook/setups";

const PAPER = "#e9e9e5";
const CHARCOAL = "#30343a";
const TERRACOTTA = "#c65f38";

const colors: Record<ChartTone, string> = {
  orange: TERRACOTTA,
  green: CHARCOAL,
  red: TERRACOTTA,
  blue: CHARCOAL,
  muted: CHARCOAL,
};

type ChartMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

function ChartCanvas({
  chart,
  width,
  height,
  margin,
  compact = false,
}: {
  chart: ChartSpec;
  width: number;
  height: number;
  margin: ChartMargin;
  compact?: boolean;
}) {
  const guideValues = chart.guides?.flatMap((guide) => guide.values) ?? [];
  const allValues = [
    ...chart.candles.flatMap((candle) => [candle.high, candle.low]),
    ...chart.levels.map((level) => level.value),
    ...guideValues,
  ];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const padding = Math.max((rawMax - rawMin) * 0.09, 0.8);
  const min = rawMin - padding;
  const max = rawMax + padding;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const step = plotWidth / chart.candles.length;
  const candleWidth = Math.max(compact ? 5 : 8, step * 0.46);
  const labelSize = compact ? 12 : 10;

  const x = (index: number) => margin.left + step * index + step / 2;
  const y = (value: number) =>
    margin.top + ((max - value) / (max - min)) * plotHeight;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={compact ? "mono-chart-mobile" : "mono-chart-desktop"}
      role={compact ? undefined : "img"}
      aria-hidden={compact ? true : undefined}
      aria-label={compact ? undefined : `${chart.title}：${chart.purpose}`}
    >
      <rect width={width} height={height} fill={PAPER} />

      {[0, 1, 2, 3, 4].map((row) => {
        const gridY = margin.top + (plotHeight / 4) * row;
        return (
          <line
            key={`h-${row}`}
            x1={margin.left}
            x2={width - margin.right}
            y1={gridY}
            y2={gridY}
            stroke="rgba(48,52,58,.12)"
            strokeWidth="1"
          />
        );
      })}
      {[0, Math.floor(chart.candles.length / 2), chart.candles.length].map(
        (column, index) => {
          const gridX =
            column === chart.candles.length
              ? width - margin.right
              : margin.left + step * column;
          return (
            <line
              key={`v-${index}`}
              x1={gridX}
              x2={gridX}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke="rgba(48,52,58,.08)"
              strokeWidth="1"
            />
          );
        },
      )}

      {chart.guides?.map((guide) => {
        const points = guide.values
          .map((value, index) => `${x(index)},${y(value)}`)
          .join(" ");
        const lastIndex = guide.values.length - 1;
        return (
          <g key={guide.label}>
            <polyline
              points={points}
              fill="none"
              stroke={colors[guide.tone]}
              strokeWidth="2"
              strokeOpacity=".72"
            />
            <text
              x={width - margin.right + (compact ? 7 : 10)}
              y={y(guide.values[lastIndex]) + 4}
              fill={colors[guide.tone]}
              fontSize={labelSize}
              fontFamily="monospace"
            >
              {guide.label}
            </text>
          </g>
        );
      })}

      {chart.levels.map((level) => (
        <g key={`${level.label}-${level.value}`}>
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={y(level.value)}
            y2={y(level.value)}
            stroke={colors[level.tone]}
            strokeOpacity={level.tone === "muted" ? ".28" : ".68"}
            strokeWidth="1.4"
            strokeDasharray={level.dashed ? "6 6" : undefined}
          />
          <circle
            cx={width - margin.right}
            cy={y(level.value)}
            r={compact ? 2.4 : 3}
            fill={colors[level.tone]}
          />
          <text
            x={width - margin.right + (compact ? 7 : 10)}
            y={y(level.value) + 4}
            fill={colors[level.tone]}
            fontSize={labelSize}
            fontFamily="monospace"
          >
            {level.label}
          </text>
        </g>
      ))}

      {chart.candles.map((candle, index) => {
        const bullish = candle.close >= candle.open;
        const color = bullish ? CHARCOAL : TERRACOTTA;
        const bodyTop = y(Math.max(candle.open, candle.close));
        const bodyBottom = y(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(2.2, bodyBottom - bodyTop);
        return (
          <g key={index}>
            <line
              x1={x(index)}
              x2={x(index)}
              y1={y(candle.high)}
              y2={y(candle.low)}
              stroke={color}
              strokeWidth="1.5"
            />
            <rect
              x={x(index) - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
              fillOpacity={bullish ? ".82" : ".88"}
              stroke={color}
              strokeWidth="1"
            />
          </g>
        );
      })}

      {chart.annotations.map((annotation) => {
        const pointX = x(annotation.index);
        const pointY = y(annotation.value);
        const scale = compact ? 0.58 : 1;
        const labelX = pointX + (annotation.dx ?? 0) * scale;
        const labelY = pointY + (annotation.dy ?? -24) * scale;
        const textAnchor =
          (annotation.dx ?? 0) < -8
            ? "end"
            : (annotation.dx ?? 0) > 8
              ? "start"
              : "middle";
        const lineEndY =
          labelY + ((annotation.dy ?? -24) > 0 ? -6 : 5);
        return (
          <g key={`${annotation.index}-${annotation.label}`}>
            <circle
              cx={pointX}
              cy={pointY}
              r={compact ? 2.8 : 3.5}
              fill={colors[annotation.tone]}
              stroke={PAPER}
              strokeWidth="2"
            />
            <line
              x1={pointX}
              x2={labelX}
              y1={pointY}
              y2={lineEndY}
              stroke={colors[annotation.tone]}
              strokeOpacity=".55"
              strokeWidth="1"
            />
            <text
              x={labelX}
              y={labelY}
              fill={colors[annotation.tone]}
              fontSize={labelSize}
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              textAnchor={textAnchor}
              paintOrder="stroke"
              stroke={PAPER}
              strokeWidth={compact ? 3 : 4}
            >
              {annotation.label}
            </text>
          </g>
        );
      })}

      {chart.timeLabels.map((label, index) => {
        const positions = [
          margin.left,
          margin.left + plotWidth / 2,
          width - margin.right,
        ];
        const anchors = ["start", "middle", "end"] as const;
        return (
          <text
            key={label}
            x={positions[index]}
            y={height - (compact ? 10 : 14)}
            fill="rgba(48,52,58,.5)"
            fontSize={labelSize}
            fontFamily="monospace"
            textAnchor={anchors[index]}
          >
            {label} ET
          </text>
        );
      })}
    </svg>
  );
}

export function CandlestickDiagram({ chart }: { chart: ChartSpec }) {
  return (
    <figure className="chart-frame">
      <figcaption className="mono-chart-caption">
        <div>
          <h3>{chart.title}</h3>
          <p>{chart.purpose}</p>
        </div>
        <span>{chart.timeframe}</span>
      </figcaption>
      <div className="mono-chart-canvas">
        <ChartCanvas
          chart={chart}
          width={820}
          height={360}
          margin={{ top: 22, right: 142, bottom: 40, left: 30 }}
        />
        <ChartCanvas
          chart={chart}
          width={430}
          height={300}
          margin={{ top: 20, right: 116, bottom: 34, left: 16 }}
          compact
        />
      </div>
    </figure>
  );
}
