import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteFooter, SiteHeader, CompassInvite } from "@/app/components/site-shell";
import { decisionRows, hardRules, homeCopy, setupCopyEn, type HomeLocale } from "@/app/playbook/home-copy";
import { setups } from "@/app/playbook/setups";

export const metadata: Metadata = {
  title: { absolute: "SPX Setups" },
  description: "Five curated SPX 0DTE setups: read the 5-minute market case, then execute the 1-minute trigger.",
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
              <div className="mono-cover-title">
                <h1>
                  {copy.heroFirst} <em>5m</em>.
                  <br />
                  {copy.heroSecond} <em>1m</em>.
                </h1>
              </div>
              <div className="mono-cover-count" aria-label={copy.countAria}>
                <strong>05</strong>
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

        <section className="mono-section">
          <div className="page-shell mono-rules-layout">
            <header className="mono-section-heading">
              <h2>{copy.rulesTitle}</h2>
            </header>
            <div className="mono-rules-list">
              {hardRules[locale].map(([label, rule], index) => (
                <div key={label} className="mono-rule-row">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{label}</strong>
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mono-section">
          <div className="page-shell">
            <CompassInvite locale={locale} />
          </div>
        </section>
      </main>
      <SiteFooter tone="paper" locale={locale} />
    </div>
  );
}
