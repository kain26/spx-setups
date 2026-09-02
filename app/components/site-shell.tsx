import Link from "next/link";

import { Button } from "@/components/ui/button";

type ShellTone = "dark" | "paper";
type SiteLocale = "en" | "zh";

function BrandMark({ paper }: { paper: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        fill="none"
        stroke={paper ? "#30343a" : "rgba(255,255,255,.22)"}
        strokeOpacity={paper ? 0.28 : 1}
        strokeWidth="1"
      />
      <rect x="15" y="5" width="2" height="22" fill="#c65f38" />
      <rect x="11" y="10" width="10" height="11" fill="#c65f38" />
    </svg>
  );
}

export function Brand({ tone = "dark" }: { tone?: ShellTone }) {
  const paper = tone === "paper";

  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="SPX Setups home">
      <BrandMark paper={paper} />
      <span className={`text-sm font-semibold tracking-[.12em] ${paper ? "text-[#30343a]" : "text-white"}`}>
        SPX SETUPS
      </span>
    </Link>
  );
}

export function SiteHeader({ tone = "dark", locale = "en", languageHref }: { tone?: ShellTone; locale?: SiteLocale; languageHref?: string }) {
  const paper = tone === "paper";
  const labels = locale === "zh"
    ? { setups: "5 Setups", nav: "主导航", language: "EN" }
    : { setups: "5 Setups", nav: "Primary navigation", language: "中文" };

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${paper ? "border-[#30343a]/18 bg-[#e9e9e5]/92" : "border-white/10 bg-[#09090a]/88"}`}>
      <div className="page-shell flex h-[72px] items-center justify-between">
        <Brand tone={tone} />
        <nav className="hidden items-center gap-8 md:flex" aria-label={labels.nav}>
          <Link className={paper ? "nav-link nav-link-paper" : "nav-link"} href={locale === "zh" ? "/?lang=zh#setups" : "/#setups"}>{labels.setups}</Link>
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
        disclaimer: "仅供学习，非投资建议。",
        x: "在 X 关注 @mm_options",
        community: "MYSPX",
      }
    : {
        disclaimer: "Education only. Not advice.",
        x: "Follow @mm_options on X",
        community: "MYSPX",
      };

  const mark = `inline-flex size-7 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "border-[#30343a]/16 text-[#30343a]/50 hover:border-[#c65f38] hover:text-[#c65f38]" : "border-white/12 text-white/50 hover:border-orange-400 hover:text-orange-400"}`;

  return (
    <footer className={`border-t ${paper ? "border-[#30343a]/12" : "border-white/8"}`}>
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <p className={`min-w-0 truncate text-[11px] leading-none ${paper ? "text-[#30343a]/40" : "text-white/28"}`}>
          {labels.disclaimer}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
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
              width={16}
              height={14}
              className="h-3.5 w-auto"
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
            <svg viewBox="0 0 24 24" className="size-3" aria-hidden="true">
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
