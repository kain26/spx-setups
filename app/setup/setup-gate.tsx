"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, RotateCcw, ShieldCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type Direction = "bull" | "bear" | "";
type Level = "wall" | "vwap" | "session" | "";
type Position = "accepted" | "testing" | "middle" | "";

const choices = {
  direction: [
    ["bull", "向上收复 · Bullish reclaim"],
    ["bear", "向下跌回 · Bearish reclaim"],
  ] as const,
  level: [
    ["wall", "Options Wall / Gamma Level"],
    ["vwap", "VWAP / Anchored VWAP"],
    ["session", "PDH · PDL · OR High/Low"],
  ] as const,
  position: [
    ["accepted", "已回到交易方向一侧并站稳"],
    ["testing", "正在测试，还没有收盘确认"],
    ["middle", "位于区间中部，没有明确位置"],
  ] as const,
};

function ChoiceSet<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly (readonly [T, string])[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(([optionValue, label]) => (
        <Button
          key={optionValue}
          type="button"
          variant="outline"
          className="choice-button"
          data-selected={value === optionValue}
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
        >
          {value === optionValue && <Check className="size-4 shrink-0 text-orange-400" />}
          {label}
        </Button>
      ))}
    </div>
  );
}

export function SetupGate() {
  const [direction, setDirection] = useState<Direction>("");
  const [level, setLevel] = useState<Level>("");
  const [position, setPosition] = useState<Position>("");
  const [closeConfirmed, setCloseConfirmed] = useState(false);
  const [retestHeld, setRetestHeld] = useState(false);
  const [pacePresent, setPacePresent] = useState(false);
  const [invalidation, setInvalidation] = useState(false);
  const [exitReady, setExitReady] = useState(false);
  const [beforeThree, setBeforeThree] = useState(false);
  const [noAdd, setNoAdd] = useState(false);
  const [remainingRisk, setRemainingRisk] = useState("");
  const [maxLoss, setMaxLoss] = useState("");

  const riskRemaining = Number(remainingRisk);
  const tradeRisk = Number(maxLoss);
  const riskValid = riskRemaining > 0 && tradeRisk > 0 && tradeRisk <= riskRemaining;

  const checklist = [
    Boolean(direction),
    Boolean(level),
    position === "accepted",
    closeConfirmed,
    retestHeld,
    pacePresent,
    invalidation,
    exitReady,
    beforeThree,
    noAdd,
    riskValid,
  ];
  const completed = checklist.filter(Boolean).length;
  const ready = completed === checklist.length;

  const reasons = useMemo(() => {
    const items: string[] = [];
    if (!direction) items.push("方向尚未定义");
    if (!level) items.push("没有已知关键位");
    if (position !== "accepted") items.push(position === "middle" ? "价格仍在区间中部" : "尚未在关键位另一侧确认接受");
    if (!closeConfirmed) items.push("缺少 5 分钟收盘确认");
    if (!retestHeld) items.push("第一次回踩尚未守住");
    if (!pacePresent) items.push("动能 / 成交节奏没有确认");
    if (!invalidation) items.push("失效条件未写清");
    if (!exitReady) items.push("退出订单或硬性退出规则未准备");
    if (!beforeThree) items.push("不满足 15:00 ET 前开仓规则");
    if (!noAdd) items.push("尚未承诺不对亏损仓加码");
    if (!riskValid) items.push("本单最大亏损未填写，或超过今日剩余风险预算");
    return items;
  }, [direction, level, position, closeConfirmed, retestHeld, pacePresent, invalidation, exitReady, beforeThree, noAdd, riskValid]);

  function reset() {
    setDirection("");
    setLevel("");
    setPosition("");
    setCloseConfirmed(false);
    setRetestHeld(false);
    setPacePresent(false);
    setInvalidation(false);
    setExitReady(false);
    setBeforeThree(false);
    setNoAdd(false);
    setRemainingRisk("");
    setMaxLoss("");
  }

  return (
    <section className="page-shell py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.14fr_.86fr] lg:items-start">
        <div>
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">下单前，逐项回答。</h2>
            <Button type="button" variant="ghost" onClick={reset} className="rounded-none text-xs text-white/36 hover:bg-white/5 hover:text-white">
              <RotateCcw /> 重置
            </Button>
          </div>

          <div className="gate-section">
            <h3 className="mb-6 font-medium text-white">交易方向</h3>
            <ChoiceSet value={direction} onChange={setDirection} options={choices.direction} />
          </div>

          <div className="gate-section">
            <h3 className="mb-6 font-medium text-white">关键位来源</h3>
            <ChoiceSet value={level} onChange={setLevel} options={choices.level} />
          </div>

          <div className="gate-section">
            <h3 className="mb-6 font-medium text-white">价格现在在哪里</h3>
            <ChoiceSet value={position} onChange={setPosition} options={choices.position} />
          </div>

          <div className="gate-section">
            <h3 className="mb-6 font-medium text-white">触发是否完整</h3>
            <div>
              {[
                ["5 分钟 K 线已收在交易方向一侧", closeConfirmed, setCloseConfirmed],
                ["第一次回踩 / 反抽没有重新跌破 / 突破", retestHeld, setRetestHeld],
                ["价格速度或成交节奏仍支持该方向", pacePresent, setPacePresent],
              ].map(([label, checked, setter]) => (
                <label key={String(label)} className="check-row cursor-pointer text-sm text-white/62">
                  <Checkbox checked={Boolean(checked)} onCheckedChange={(value) => (setter as (value: boolean) => void)(value === true)} className="mt-0.5 rounded-none data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-black" />
                  <span>{String(label)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="gate-section">
            <h3 className="mb-6 font-medium text-white">风险是否在入场前锁定</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-white/42">
                今日剩余风险预算（USD）
                <Input value={remainingRisk} onChange={(event) => setRemainingRisk(event.target.value)} type="number" min="0" inputMode="decimal" placeholder="例如 500" className="mt-2 h-12 rounded-none border-white/12 bg-white/[.025] text-white placeholder:text-white/20 focus-visible:border-orange-500 focus-visible:ring-orange-500/20" />
              </label>
              <label className="text-xs text-white/42">
                本单最大亏损（USD）
                <Input value={maxLoss} onChange={(event) => setMaxLoss(event.target.value)} type="number" min="0" inputMode="decimal" placeholder="例如 150" className="mt-2 h-12 rounded-none border-white/12 bg-white/[.025] text-white placeholder:text-white/20 focus-visible:border-orange-500 focus-visible:ring-orange-500/20" />
              </label>
            </div>
            {riskRemaining > 0 && tradeRisk > 0 && (
              <div className={`mt-4 border px-4 py-3 font-mono text-xs ${riskValid ? "border-emerald-400/20 bg-emerald-400/[.06] text-emerald-300" : "border-red-400/20 bg-red-400/[.06] text-red-300"}`}>
                {riskValid ? `如果止损，今日还剩 $${(riskRemaining - tradeRisk).toFixed(0)} 风险预算。` : "本单风险已经超过今日剩余预算。"}
              </div>
            )}
            <div className="mt-6">
              {[
                ["我能用一句话说清哪里证明自己错了", invalidation, setInvalidation],
                ["止损单或不可协商的退出规则已经准备", exitReady, setExitReady],
                ["现在早于 15:00 ET，不在尾盘新开仓", beforeThree, setBeforeThree],
                ["如果亏损，我不会通过加仓等待反弹", noAdd, setNoAdd],
              ].map(([label, checked, setter]) => (
                <label key={String(label)} className="check-row cursor-pointer text-sm text-white/62">
                  <Checkbox checked={Boolean(checked)} onCheckedChange={(value) => (setter as (value: boolean) => void)(value === true)} className="mt-0.5 rounded-none data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-black" />
                  <span>{String(label)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="top-24 lg:sticky">
          <div className={`border ${ready ? "border-emerald-400/30 bg-emerald-400/[.035]" : "border-white/12 bg-white/[.025]"}`} aria-live="polite">
            <div className="border-b border-white/10 p-5">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[.16em] text-white/32">
                <span>STATUS</span>
                <span>{completed} / {checklist.length}</span>
              </div>
              <Progress value={(completed / checklist.length) * 100} className="mt-4 h-1 rounded-none bg-white/8 [&_[data-slot=progress-indicator]]:bg-orange-500" />
            </div>
            <div className="p-6 sm:p-8">
              {ready ? (
                <>
                  <ShieldCheck className="size-8 text-emerald-300" />
                  <div className="mt-6 font-mono text-xs tracking-[.18em] text-emerald-300">SETUP READY</div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">条件完整，可以进入执行。</h3>
                  <p className="mt-4 leading-7 text-white/48">
                    {direction === "bull" ? "向上收复" : "向下跌回"} · {level === "wall" ? "Options Wall" : level === "vwap" ? "VWAP" : "Session Level"}。失效就退出。
                  </p>
                </>
              ) : (
                <>
                  <AlertTriangle className="size-8 text-orange-400" />
                  <div className="mt-6 font-mono text-xs tracking-[.18em] text-orange-400">NO TRADE</div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">条件还不完整。</h3>
                  <ul className="mt-5 space-y-3">
                    {reasons.slice(0, 5).map((reason) => (
                      <li key={reason} className="flex gap-3 text-sm text-white/58">
                        <X className="mt-0.5 size-4 shrink-0 text-white/24" /> {reason}
                      </li>
                    ))}
                  </ul>
                  {reasons.length > 5 && <p className="mt-4 font-mono text-[10px] text-white/24">+ {reasons.length - 5} MORE</p>}
                </>
              )}
            </div>
          </div>
          <Link href="/playbook" className="mt-4 flex items-center justify-between border border-white/10 px-5 py-4 text-sm text-white/50 transition-colors hover:border-orange-400/35 hover:text-orange-300">
            五个 Setup <ArrowRight className="size-4" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
