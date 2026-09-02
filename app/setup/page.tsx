import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/app/components/site-shell";
import { SetupGate } from "@/app/setup/setup-gate";

export const metadata: Metadata = {
  title: "Level Reclaim · 交易门禁",
  description: "在 SPX 0DTE 下单前，依次检查结构、触发与风险。条件不完整，答案就是 NO TRADE。",
};

export default function SetupPage() {
  return (
    <div className="site-frame">
      <SiteHeader locale="zh" />
      <main>
        <section className="border-b border-white/10">
          <div className="page-shell grid gap-12 py-16 lg:grid-cols-[.78fr_1.22fr] lg:py-24">
            <div>
              <h1 className="text-5xl font-semibold leading-[.95] tracking-[-0.055em] text-white sm:text-7xl">
                Level
                <br />
                <span className="text-orange-400">Reclaim.</span>
              </h1>
            </div>
            <div className="max-w-2xl lg:pt-4">
              <p className="text-xl leading-9 text-white/60 sm:text-2xl">
                价格扫过一个已知关键位后，重新回到交易方向一侧，并在第一次回踩中守住。
              </p>
              <div className="mt-8 grid gap-4 text-sm text-white/46 sm:grid-cols-3">
                <div><span className="mb-2 block font-mono text-[10px] text-orange-400">CONTEXT</span>Wall / VWAP / PDH-PDL / OR</div>
                <div><span className="mb-2 block font-mono text-[10px] text-orange-400">TRIGGER</span>收复 + 收盘确认 + 回踩</div>
                <div><span className="mb-2 block font-mono text-[10px] text-orange-400">INVALIDATION</span>重新接受于失效侧</div>
              </div>
              <Link href="/playbook/sweep-reclaim" className="mt-10 inline-flex items-center gap-2 text-sm text-orange-300 transition-colors hover:text-orange-200">
                  Setup 01 <ArrowRight className="size-4" />
                </Link>
            </div>
          </div>
        </section>
        <SetupGate />
      </main>
      <SiteFooter locale="zh" />
    </div>
  );
}
