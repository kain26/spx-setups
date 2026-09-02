# SPX Setups

Five curated SPX 0DTE setups. Read the 5-minute market case, wait for the 1-minute trigger, and define risk before entry.

中文说明见下方：[中文](#中文)

## Preview

Live site: [https://spx-setups.mmoptions.workers.dev/playbook/wall-rejection?lang=zh](https://spx-setups.mmoptions.workers.dev/playbook/wall-rejection?lang=zh)

## English

SPX Setups is a concise field guide built from practical trading notes. It is a small, opinionated collection—not an encyclopedia and not a signal service.

### Included setups

| # | Setup | Market case |
|---|---|---|
| 01 | Sweep & Reclaim | A level breaks briefly, then price reclaims it before acceptance forms outside. |
| 02 | Break & Hold | Price accepts beyond a level and holds the first retest. |
| 03 | VWAP Pullback | An established trend makes its first or second orderly VWAP pullback. |
| 04 | Wall Rejection | A range edge or option wall rejects price back into balance. |
| 05 | Compression Expansion | 5m ranges compress before a break and a 1m continuation pattern. |

### Reading sequence

1. **5m — Context:** identify the market case and key level.
2. **1m — Trigger:** wait for reclaim, hold, rejection, or continuation.
3. **Entry — Act:** enter only after the trigger is complete.
4. **Stop — Invalidate:** define the structural failure point before entry.
5. **Target — Manage:** take the next known liquidity or structure level.

The site defaults to English. Use the language switch in the header to view the Chinese homepage.

### Run locally

```bash
npm run install:ci
npm run dev
```

Production build:

```bash
npm run build
```

### Deploy to Cloudflare Workers

The repository includes a root `wrangler.jsonc` for vinext's generated Worker output:

```bash
npm run deploy
```

For Cloudflare Workers Builds, set **Deploy command** to `npm run deploy`.
The build is included in that command, so the separate **Build command** may be left blank.

Do not run the OpenNext migration. This project uses vinext and produces
`dist/server`, not Next.js's `.next` directory.

### Links

- Community: [myspx.trade](https://myspx.trade)
- X: [@mm_options](https://x.com/mm_options)

### Disclaimer

For education and research only. Nothing in this repository is investment advice. SPX 0DTE options carry extreme risk.

---

## 中文

预览地址：[https://spx-setups.mmoptions.workers.dev/playbook/wall-rejection?lang=zh](https://spx-setups.mmoptions.workers.dev/playbook/wall-rejection?lang=zh)

SPX Setups 是一份精炼的 SPX 0DTE 实战笔记。它只整理五个常用场景，不追求覆盖所有形态，也不提供交易喊单。

### 包含的 Setup

| # | Setup | 市场场景 |
|---|---|---|
| 01 | Sweep & Reclaim | 短暂突破关键位后重新收回，墙外没有形成价格接受。 |
| 02 | Break & Hold | 价格在关键位外侧形成接受，第一次回踩守住。 |
| 03 | VWAP Pullback | 趋势建立后，第一次或第二次有序回踩 VWAP。 |
| 04 | Wall Rejection | 区间边界或期权墙拒绝价格，随后回到平衡区。 |
| 05 | Compression Expansion | 5 分钟波动持续压缩，突破后出现 1 分钟延续结构。 |

### 阅读顺序

1. **5m — 环境：**判断市场 Case 与关键位置。
2. **1m — 触发：**等待收复、守住、拒绝或延续真正发生。
3. **Entry — 执行：**触发完成后才入场。
4. **Stop — 失效：**入场前确定结构失效点。
5. **Target — 管理：**目标放在下一个已知流动性或结构位置。

网站默认显示英文，点击页头的语言按钮可以切换中文首页。

### 本地运行

```bash
npm run install:ci
npm run dev
```

生产构建：

```bash
npm run build
```

### 部署到 Cloudflare Workers

仓库根目录已经包含适配 vinext 构建产物的 `wrangler.jsonc`，部署命令使用：

```bash
npm run deploy
```

使用 Cloudflare Workers Builds 时，将 **Deploy command** 设置为
`npm run deploy`。构建步骤已经包含在该命令中，单独的 **Build command** 可以留空。

不要运行 OpenNext migration。本项目使用 vinext，输出目录是
`dist/server`，不会生成标准 Next.js 的 `.next` 目录。

### 链接

- 社区主站：[myspx.trade](https://myspx.trade)
- X：[@mm_options](https://x.com/mm_options)

### 风险声明

本项目仅用于教育与研究，不构成投资建议。SPX 0DTE 期权具有极高风险。
