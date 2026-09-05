import { useEffect, useState } from "react";
import { Check } from "lucide-react";

/**
 * Renders a sequence of AI "processing" steps that check off one by one.
 * Purely presentational timing — the real async work happens in
 * services/mockAI.ts; this component just paces the steps visually so the
 * total animation roughly matches the promise's delay.
 */
export function LoadingSteps({ steps, totalMs = 1400 }: { steps: string[]; totalMs?: number }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    if (steps.length === 0) return;
    const perStep = Math.max(totalMs / steps.length, 300);
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveIndex(i + 1), perStep * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.join("|"), totalMs]);

  return (
    <ul className="space-y-3">
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                done
                  ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)"
                  : current
                    ? "border-(--color-terracotta-500) text-(--color-terracotta-500)"
                    : "border-(--color-line) text-transparent"
              }`}
            >
              {done ? (
                <Check className="size-3.5" />
              ) : current ? (
                <span className="size-2 animate-pulse rounded-full bg-(--color-terracotta-500)" />
              ) : null}
            </span>
            <span
              className={`text-sm ${
                done ? "text-(--color-ink)" : current ? "font-semibold text-(--color-ink)" : "text-(--color-ink-faint)"
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
