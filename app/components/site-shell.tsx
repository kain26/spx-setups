import Link from "next/link";

import { Button } from "@/components/ui/button";

type ShellTone = "dark" | "paper";
type SiteLocale = "en" | "zh";

export function Brand({ tone = "dark" }: { tone?: ShellTone }) {
  const paper = tone === "paper";

  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="SPX Setups home">
      <span className={`grid size-8 place-items-center border ${paper ? "border-[#30343a]/20 bg-[#30343a]/[.03]" : "border-white/16 bg-white/[.04]"}`}>
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path d="M3 17.5 8.4 11l3.7 3.4L21 5.8" fill="none" stroke="#c65f38" strokeWidth="2.2" strokeLinecap="square" />
          <path d="M16.5 5.8H21v4.5" fill="none" stroke="#c65f38" strokeWidth="2.2" />
        </svg>
      </span>
      <span>
        <span className={`block text-sm font-semibold tracking-[.12em] ${paper ? "text-[#30343a]" : "text-white"}`}>SPX SETUPS</span>
        <span className={`block font-mono text-[8px] tracking-[.14em] ${paper ? "text-[#30343a]/45" : "text-white/30"}`}>5M → 1M</span>
      </span>
    </Link>
  );
}

export function SiteHeader({ tone = "dark", locale = "en", languageHref }: { tone?: ShellTone; locale?: SiteLocale; languageHref?: string }) {
  const paper = tone === "paper";
  const labels = locale === "zh"
    ? { setups: "5 Setups", gate: "交易门禁", nav: "主导航", language: "EN" }
    : { setups: "5 Setups", gate: "Trade Gate", nav: "Primary navigation", language: "中文" };

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${paper ? "border-[#30343a]/18 bg-[#e9e9e5]/92" : "border-white/10 bg-[#09090a]/88"}`}>
      <div className="page-shell flex h-[72px] items-center justify-between">
        <Brand tone={tone} />
        <nav className="hidden items-center gap-8 md:flex" aria-label={labels.nav}>
          <Link className={paper ? "nav-link nav-link-paper" : "nav-link"} href={locale === "zh" ? "/?lang=zh#setups" : "/#setups"}>{labels.setups}</Link>
          <Link className={paper ? "nav-link nav-link-paper" : "nav-link"} href="/setup">{labels.gate}</Link>
        </nav>
        <Button
          asChild
          className={`h-9 rounded-none px-4 font-mono text-sm tracking-[.08em] ${paper ? "bg-[#30343a] text-[#e9e9e5] hover:bg-[#c65f38]" : "bg-white text-black hover:bg-orange-400"}`}
        >
          <Link href={languageHref ?? "/#setups"}>{languageHref ? labels.language : "SETUPS / 05"}</Link>
        </Button>
      </div>
    </header>
  );
}

export function SiteFooter({ tone = "dark", locale = "en" }: { tone?: ShellTone; locale?: SiteLocale }) {
  const paper = tone === "paper";
  const labels = locale === "zh"
    ? {
        disclaimer: "教育与研究用途，不构成投资建议。SPX 0DTE 具有极高风险，任何交易都应预先定义最大亏损。",
        x: "在 X 关注 @mm_options",
        community: "MYSPX",
      }
    : {
        disclaimer: "For education and research only. Not investment advice. SPX 0DTE carries extreme risk; define maximum loss before every trade.",
        x: "Follow @mm_options on X",
        community: "MYSPX",
      };

  const mark = `inline-flex min-h-11 min-w-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${paper ? "border-[#30343a]/24 text-[#30343a] hover:border-[#c65f38] hover:text-[#c65f38]" : "border-white/16 text-white/72 hover:border-orange-400 hover:text-orange-400"}`;

  return (
    <footer className={`border-t ${paper ? "border-[#30343a]/18" : "border-white/10"}`}>
      <div className="page-shell grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Brand tone={tone} />
          <p className={`mt-5 max-w-xl text-xs leading-6 ${paper ? "text-[#30343a]/58" : "text-white/28"}`}>
            {labels.disclaimer}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <a
            className={mark}
            href="https://myspx.trade"
            target="_blank"
            rel="noreferrer"
            aria-label={labels.community}
            title="myspx.trade"
          >
            <img
              src="/myspx-logo.png"
              alt=""
              width={32}
              height={28}
              className="h-7 w-auto"
              style={{ imageRendering: "pixelated" }}
            />
          </a>
          <a
            className={mark}
            href="https://x.com/mm_options"
            target="_blank"
            rel="noreferrer"
            aria-label={labels.x}
            title="@mm_options"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
