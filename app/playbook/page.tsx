import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/app/components/site-shell";
import { decisionRows, homeCopy, setupCopyEn, type HomeLocale } from "@/app/playbook/home-copy";
import { setups } from "@/app/playbook/setups";

export const metadata: Metadata = {
  title: { absolute: "SPX Setups" },
  description: "Six experimental SPX 0DTE setups for observation and study. None has validated historical results.",
};

type PlaybookPageProps = {
  searchParams?: Promise<{ lang?: string | string[] }>;
};

export default async function PlaybookPage({ searchParams }: PlaybookPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const locale: HomeLocale = params?.lang === "zh" ? "zh" : "en";
  const copy = homeCopy[locale];
  const isChinese = locale === "zh";

  return (
    <div className="site-frame mono-playbook" lang={isChinese ? "zh-CN" : "en"}>
      <SiteHeader
        tone="paper"
        locale={locale}
        languageHref={isChinese ? "/" : "/?lang=zh"}
        showSocials
      />
      <main>
        <section className="mono-cover">
          <div className="page-shell">
            <div className="mono-cover-meta">
              <span>SPX 0DTE</span>
              <span>{copy.heroMeta}</span>
              <span>ET SESSION</span>
            </div>
            <div className="mono-cover-grid">
              <div className="mono-cover-title thesis">
                <p>{copy.method}</p>
                <h1>
                  {copy.heroFirst}
                  <br />
                  {copy.heroSecondLead}
                  <em>{copy.heroEm}</em>
                  {copy.heroSecondTail}
                </h1>
              </div>
              <div className="mono-cover-count" aria-label={copy.countAria}>
                <strong>06</strong>
                <span>{copy.countLabel}</span>
                <p>{copy.flow}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="setups" className="mono-section scroll-mt-20">
          <div className="page-shell">
            <header className="mono-section-heading">
              <h2>{copy.indexTitle}</h2>
            </header>
            <aside className="mono-experimental-warning mono-all-setups-note" role="note">
              <AlertTriangle aria-hidden="true" />
              <div>
                <strong>{isChinese ? "所有 SETUP 均为实验性观察" : "ALL SETUPS ARE EXPERIMENTAL"}</strong>
                <p>
                  {isChinese
                    ? "以下内容均未经过完整历史回测，没有经验证的胜率或期望值，不保证有效，也不构成直接入场信号。"
                    : "None of the setups below has complete historical backtesting, a validated win rate, or proven expectancy. They may fail and are not direct entry signals."}
                </p>
              </div>
            </aside>

            <div className="mono-setup-list">
              {setups.map((setup) => {
                const localized = isChinese
                  ? {
                      subtitle: setup.nameCn,
                      case: setup.quick.case,
                      fiveMinute: setup.quick.fiveMinute,
                      oneMinute: setup.quick.oneMinute,
                    }
                  : setupCopyEn[setup.slug];

                return (
                <Link key={setup.slug} href={`/playbook/${setup.slug}${isChinese ? "?lang=zh" : ""}`} className="mono-setup-row group">
                  <div className="mono-setup-name">
                    <span>{setup.number} / {setup.family}</span>
                    <h3>{setup.name}</h3>
                    <p>{localized.subtitle}</p>
                  </div>
                  <div className="mono-setup-case">
                    <span>CASE</span>
                    <p>{localized.case}</p>
                  </div>
                  <dl className="mono-setup-timeframes">
                    <div>
                      <dt>5m</dt>
                      <dd>{localized.fiveMinute}</dd>
                    </div>
                    <div>
                      <dt>1m</dt>
                      <dd>{localized.oneMinute}</dd>
                    </div>
                  </dl>
                  <ArrowRight aria-hidden="true" />
                </Link>
                );
              })}
              <Link href="/playbook/magic-13-21-turn" className="mono-setup-row group">
                <div className="mono-setup-name">
                  <span>06 / SINGLE INDICATOR · TURN WATCH</span>
                  <h3>Magic 13–21 Turn</h3>
                  <p>{isChinese ? "神奇 13–21 转" : "13–21 reversal watch"}</p>
                </div>
                <div className="mono-setup-case">
                  <span>CASE</span>
                  <p>{isChinese ? "连续下跌后的潜在节奏转折。" : "A potential rhythm turn after a sustained decline."}</p>
                </div>
                <dl className="mono-setup-timeframes">
                  <div>
                    <dt>5m</dt>
                    <dd>{isChinese ? "极端行情观察 9 转（约 45 根 1m）或 13 转。" : "In extremes, watch 9 (about 45 one-minute bars) or 13."}</dd>
                  </div>
                  <div>
                    <dt>1m</dt>
                    <dd>{isChinese ? "震荡式下跌看 13；单边下跌看 21。" : "Watch 13 in a choppy decline and 21 in a one-way selloff."}</dd>
                  </div>
                </dl>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mono-section mono-section-quiet">
          <div className="page-shell">
            <header className="mono-section-heading">
              <h2>{copy.caseTitle}</h2>
            </header>
            <div className="mono-case-table" role="table" aria-label={copy.caseTableAria}>
              <div className="mono-case-row mono-case-head" role="row">
                {copy.caseHeaders.map((header) => <span key={header} role="columnheader">{header}</span>)}
              </div>
              {decisionRows[locale].map((row) => (
                <div key={row[0]} className="mono-case-row" role="row">
                  {row.map((cell, index) => (
                    <span key={cell} role="cell" className={index === 3 ? "mono-case-answer" : undefined}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <SiteFooter tone="paper" locale={locale} />
    </div>
  );
}
