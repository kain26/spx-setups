import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/app/components/site-shell";
import { CandlestickDiagram } from "@/app/playbook/components/candlestick-diagram";
import { getSetup, setups } from "@/app/playbook/setups";

export function generateStaticParams() {
  return setups.map((setup) => ({ slug: setup.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const setup = getSetup(slug);
  if (!setup) return {};

  return {
    title: `Setup ${setup.number} · ${setup.name}`,
    description: `${setup.nameCn}：${setup.quick.case}`,
  };
}

export default async function SetupLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const setup = getSetup(slug);
  if (!setup) notFound();

  const index = setups.findIndex((item) => item.slug === setup.slug);
  const previous = index > 0 ? setups[index - 1] : null;
  const next = index < setups.length - 1 ? setups[index + 1] : null;
  const executionSteps = [
    ["01", "5 MIN", setup.quick.fiveMinute],
    ["02", "1 MIN", setup.quick.oneMinute],
    ["03", "ENTRY", setup.quick.entry],
    ["04", "STOP", setup.quick.stop],
    ["05", "TARGET", setup.quick.target],
  ];

  return (
    <div className="site-frame mono-playbook">
      <SiteHeader tone="paper" locale="zh" />
      <main>
        <section className="mono-lesson-cover">
          <div className="page-shell">
            <Link href="/#setups" className="mono-back-link">
              <ArrowLeft /> ALL SETUPS
            </Link>
            <div className="mono-lesson-grid">
              <div className="mono-lesson-number" aria-hidden="true">{setup.number}</div>
              <div className="mono-lesson-title">
                <span>SETUP {setup.number} / {setup.family}</span>
                <h1>{setup.name}</h1>
                <p>{setup.nameCn}</p>
              </div>
              <dl className="mono-lesson-filters">
                <div>
                  <dt>REGIME</dt>
                  <dd>{setup.regime}</dd>
                </div>
                <div>
                  <dt>TIME</dt>
                  <dd>{setup.timeWindow}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mono-section mono-execution-section">
          <div className="page-shell">
            <div className="mono-execution-sheet">
              <div className="mono-market-case">
                <span>CASE</span>
                <strong>{setup.quick.case}</strong>
              </div>
              <ol className="mono-execution-steps">
                {executionSteps.map(([number, label, value]) => (
                  <li key={label}>
                    <span>{number}</span>
                    <strong>{label}</strong>
                    <p>{value}</p>
                  </li>
                ))}
              </ol>
              <aside className="mono-skip-note">
                <span>SKIP</span>
                <p>{setup.quick.skip}</p>
              </aside>
            </div>
          </div>
        </section>

        <section className="mono-section mono-section-quiet">
          <div className="page-shell">
            <div className="mono-charts">
              <CandlestickDiagram chart={setup.charts[0]} />
              <CandlestickDiagram chart={setup.charts[1]} />
            </div>
            <p className="mono-mirror-note">{setup.mirror}</p>
          </div>
        </section>

        <section className="mono-section">
          <div className="page-shell">
            <details className="mono-notes">
              <summary>
                <span>完整说明</span>
                <ChevronDown />
              </summary>
              <div className="mono-notes-body">
                <p className="mono-notes-logic">{setup.logic}</p>
                <div className="mono-notes-grid">
                  {[
                    ["CONTEXT", setup.context],
                    ["5 MIN", setup.fiveMinuteRules],
                    ["1 MIN", setup.oneMinuteRules],
                    ["OPTION", setup.optionStructure],
                  ].map(([title, rules]) => (
                    <article key={String(title)}>
                      <h3>{String(title)}</h3>
                      <ul>
                        {(rules as string[]).map((rule) => <li key={rule}>{rule}</li>)}
                      </ul>
                    </article>
                  ))}
                </div>
                <div className="mono-notes-grid mono-notes-grid-secondary">
                  <article>
                    <h3>INVALIDATION</h3>
                    <p>{setup.invalidation}</p>
                    <p>{setup.stop}</p>
                  </article>
                  <article>
                    <h3>TARGETS</h3>
                    <ul>{setup.targets.map((rule) => <li key={rule}>{rule}</li>)}</ul>
                  </article>
                  <article>
                    <h3>SKIP</h3>
                    <ul>{setup.avoid.map((rule) => <li key={rule}>{rule}</li>)}</ul>
                  </article>
                </div>
              </div>
            </details>
          </div>
        </section>

        {setup.slug === "compression-expansion" ? (
          <div className="page-shell">
            <a
              href="https://myspx.trade"
              target="_blank"
              rel="noreferrer"
              className="mono-community-note"
            >
              <img
                src="/myspx-logo.png"
                alt=""
                width={18}
                height={16}
                className="h-4 w-auto"
                style={{ imageRendering: "pixelated" }}
              />
              <span>欢迎加入 MYSPX 会员社区</span>
            </a>
          </div>
        ) : null}

        <nav className="page-shell mono-lesson-pagination" aria-label="Setup lessons">
          {previous ? (
            <Link href={`/playbook/${previous.slug}`} className="mono-lesson-nav">
              <ArrowLeft />
              <span><small>PREVIOUS</small>{previous.number} / {previous.name}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/playbook/${next.slug}`} className="mono-lesson-nav mono-lesson-nav-next">
              <span><small>NEXT</small>{next.number} / {next.name}</span>
              <ArrowRight />
            </Link>
          ) : (
            <Link href="/#setups" className="mono-lesson-nav mono-lesson-nav-next">
              <span><small>FINISH</small>返回全部 Setup</span>
              <ArrowRight />
            </Link>
          )}
        </nav>
      </main>
      <SiteFooter tone="paper" locale="zh" />
    </div>
  );
}
