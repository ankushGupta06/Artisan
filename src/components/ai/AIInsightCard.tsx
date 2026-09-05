import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

export function AIInsightCard({
  message,
  actions,
}: {
  message: string;
  actions?: ReactNode;
}) {
  return (
    <div className="card-craft relative overflow-hidden bg-(--color-green-700) p-5 text-(--color-cream) shadow-craft-lg">
      <div className="absolute -right-6 -top-8 size-28 rounded-full bg-(--color-cream)/8" />
      <div className="relative flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-cream)/15">
          <Sparkles className="size-5 text-(--color-gold-100)" />
        </span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-(--color-gold-100)">AI Business Assistant</p>
          <p className="mt-1.5 text-[0.95rem] leading-snug">{message}</p>
        </div>
      </div>
      {actions && <div className="relative mt-4 flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

export function InsightRow({
  title,
  detail,
  metric,
  trend = "neutral",
}: {
  title: string;
  detail: string;
  metric?: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="card-craft-alt flex items-start gap-3 bg-(--color-surface) p-4 shadow-craft">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
          trend === "down" ? "bg-(--color-danger-100) text-(--color-danger)" : "bg-(--color-green-50) text-(--color-green-700)"
        }`}
      >
        {trend === "down" ? <TrendingDown className="size-4.5" /> : <TrendingUp className="size-4.5" />}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-(--color-ink)">{title}</p>
          {metric && <span className="text-sm font-bold text-(--color-terracotta-600)">{metric}</span>}
        </div>
        <p className="mt-0.5 text-xs text-(--color-ink-faint)">{detail}</p>
      </div>
    </div>
  );
}
