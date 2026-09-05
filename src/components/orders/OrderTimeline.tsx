import { Check } from "lucide-react";
import type { OrderStatus } from "@/types";

const STEPS: { key: OrderStatus | "received"; label: string }[] = [
  { key: "received", label: "Order received" },
  { key: "pending", label: "Payment confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "completed", label: "Delivered" },
];

const ORDER_RANK: Record<string, number> = {
  received: 0,
  pending: 1,
  processing: 2,
  shipped: 3,
  completed: 4,
};

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentRank = ORDER_RANK[status];

  return (
    <ol className="space-y-0">
      {STEPS.map((step, i) => {
        const rank = ORDER_RANK[step.key];
        const done = rank <= currentRank;
        const isLast = i === STEPS.length - 1;
        return (
          <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[11px] top-6 h-full w-0.5 ${done ? "bg-(--color-green-700)" : "bg-(--color-line)"}`}
              />
            )}
            <span
              className={`z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                done
                  ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)"
                  : "border-(--color-line) bg-(--color-surface)"
              }`}
            >
              {done && <Check className="size-3.5" />}
            </span>
            <span className={`text-sm ${done ? "font-semibold text-(--color-ink)" : "text-(--color-ink-faint)"}`}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
