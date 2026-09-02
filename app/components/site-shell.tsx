import Link from "next/link";

import { Button } from "@/components/ui/button";

type ShellTone = "dark" | "paper";
type SiteLocale = "en" | "zh";

const COMPASS_URL =
  "https://spx-price-action-compass-773950940183.europe-west2.run.app/";

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
        compass: "SPX 罗盘",
        github: "GitHub 仓库",
      }
    : {
        disclaimer: "Education only. Not advice.",
        compass: "SPX Compass",
        github: "GitHub repository",
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
            href={COMPASS_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={labels.compass}
            title={labels.compass}
          >
            <img
              src="/spx-compass-logo.png"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 rounded-full object-cover"
            />
          </a>
          <a
            className={mark}
            href="https://github.com/kain26/spx-setups"
            target="_blank"
            rel="noreferrer"
            aria-label={labels.github}
            title={labels.github}
          >
            <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
