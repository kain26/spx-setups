"use client";

import { useEffect, useState } from "react";

type PageViewResponse = { count: number };

let pageViewRequest: Promise<number> | null = null;

function recordPageView() {
  if (pageViewRequest) return pageViewRequest;

  pageViewRequest = fetch("/api/page-views", {
    method: "POST",
    headers: { Accept: "application/json" },
    cache: "no-store",
    keepalive: true,
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Page-view request failed with ${response.status}`);
    const data = (await response.json()) as PageViewResponse;
    if (!Number.isSafeInteger(data.count) || data.count < 0) throw new Error("Page-view response was invalid");
    return data.count;
  });

  return pageViewRequest;
}

export function PageViewCount({ locale = "en" }: { locale?: "en" | "zh" }) {
  const [count, setCount] = useState<number | null>(null);
  const isChinese = locale === "zh";

  useEffect(() => {
    let active = true;
    recordPageView()
      .then((next) => {
        if (active) setCount(next);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const formatted = count === null
    ? "—"
    : new Intl.NumberFormat(isChinese ? "zh-CN" : "en-US").format(count);

  return (
    <span className="page-view-count" aria-live="polite">
      <span>{isChinese ? "已翻阅" : "Read"}</span>
      <strong>{formatted}</strong>
      <small>{isChinese ? "次" : "times"}</small>
    </span>
  );
}
