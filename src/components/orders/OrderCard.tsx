import { ChevronRight } from "lucide-react";
import type { Order } from "@/types";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-(--color-gold-100) text-(--color-gold-600)",
  processing: "bg-(--color-info-100) text-(--color-info)",
  shipped: "bg-(--color-terracotta-100) text-(--color-terracotta-700)",
  completed: "bg-(--color-green-100) text-(--color-green-700)",
};

export function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const itemsLabel = order.items.map((i) => i.name).join(", ");

  return (
    <button
      onClick={onClick}
      className="card-craft flex w-full items-center gap-3 bg-(--color-surface) p-4 text-left shadow-craft transition-transform active:scale-[0.99]"
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-(--color-ink)">#{order.id}</p>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </div>
        <p className="line-clamp-1 text-sm text-(--color-ink-soft)">{order.buyer}</p>
        <p className="line-clamp-1 text-xs text-(--color-ink-faint)">{itemsLabel}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="font-display text-base font-bold text-(--color-terracotta-700)">
            ₹{order.total.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-(--color-ink-faint)">
            {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </p>
        </div>
      </div>
      <ChevronRight className="size-4.5 shrink-0 text-(--color-ink-faint)" />
    </button>
  );
}
