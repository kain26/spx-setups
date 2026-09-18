import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/app/components/site-shell";
import { CandlestickDiagram } from "@/app/playbook/components/candlestick-diagram";
import { magicTurnSetup } from "@/app/playbook/magic-turn-setup";

export const metadata: Metadata = {
  title: "Setup 06 · 神奇 13–21 转",
  description: "未经回测的 1 分钟单指标观察：震荡式下跌看 13，极端单边下跌看 21。",
};

export default function MagicTurnPage() {
  const setup = magicTurnSetup;

  return (
    <div className="site-frame mono-playbook mono-experimental-page" lang="zh-CN">
      <SiteHeader tone="paper" locale="zh" />
      <main>
        <section className="mono-lesson-cover">
          <div className="page-shell">
            <Link href="/?lang=zh#setups" className="mono-back-link">
              <ArrowLeft /> ALL SETUPS
            </Link>
            <div className="mono-experimental-hero">
              <div className="mono-experimental-mark" aria-hidden="true">13<br />21</div>
              <div className="mono-lesson-title">
                <span>SETUP 06 · SINGLE INDICATOR · 1 MIN → 5 MIN</span>
                <h1>{setup.name}</h1>
                <p>{setup.nameCn}</p>
              </div>
              <div className="mono-experimental-status">
                <span>STATUS</span>
                <strong>未经回测</strong>
                <p>单一指标 · 不保证有效</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mono-section mono-execution-section">
          <div className="page-shell">
            <aside className="mono-experimental-warning" role="note">
              <AlertTriangle aria-hidden="true" />
              <div>
                <strong>先把边界说清楚</strong>
                <p>{setup.disclaimer}</p>
              </div>
            </aside>
            <p className="mono-experimental-summary">{setup.summary}</p>
            <div className="mono-turn-grid">
              {setup.observations.map((item) => (
                <article key={item.count}>
                  <span>{item.count}</span>
                  <div>
                    <small>{item.regime}</small>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <section className="mono-timeframe-escalation" aria-labelledby="five-minute-extreme">
              <header>
                <span>EXTREME · 5 MIN</span>
                <h2 id="five-minute-extreme">{setup.higherTimeframe.title}</h2>
                <p>{setup.higherTimeframe.summary}</p>
              </header>
              <div>
                {setup.higherTimeframe.observations.map((item) => (
                  <article key={item.count}>
                    <strong>{item.count}</strong>
                    <small>{item.equivalent}</small>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="mono-section mono-section-quiet">
          <div className="page-shell">
            <header className="mono-section-heading mono-section-heading-split">
              <span>1 MIN → 5 MIN</span>
              <h2>行情越极端，观察级别越高。</h2>
            </header>
            <div className="mono-charts">
              {setup.charts.map((chart) => <CandlestickDiagram key={chart.title} chart={chart} />)}
            </div>
          </div>
        </section>

        <section className="mono-section">
          <div className="page-shell mono-experimental-notes">
            <article>
              <h2>怎么观察</h2>
              <ol>
                {setup.confirmation.map((rule, index) => (
                  <li key={rule}><span>{String(index + 1).padStart(2, "0")}</span><p>{rule}</p></li>
                ))}
              </ol>
            </article>
            <article>
              <h2>它不代表什么</h2>
              <ul>
                {setup.limits.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <nav className="page-shell mono-lesson-pagination" aria-label="Setup 导航">
          <Link href="/playbook/compression-expansion" className="mono-lesson-nav">
            <ArrowLeft />
            <span><small>PREVIOUS</small>05 / Compression Expansion</span>
          </Link>
          <Link href="/?lang=zh#setups" className="mono-lesson-nav mono-lesson-nav-next">
            <span><small>ALL SETUPS</small>返回六个 Setup</span>
          </Link>
        </nav>
      </main>
      <SiteFooter tone="paper" locale="zh" />
    </div>
  );
}
