import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/context/AppContext";
import type { OrderStatus } from "@/types";

type Tab = "all" | OrderStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "completed", label: "Completed" },
];

export default function Orders() {
  const navigate = useNavigate();
  const { orders } = useApp();
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo(
    () => (tab === "all" ? orders : orders.filter((o) => o.status === tab)),
    [orders, tab],
  );

  return (
    <AppShell>
      <Header title="Orders" subtitle={`${orders.length} total orders`} />
      <div className="space-y-4 px-4 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)"
                  : "border-(--color-line) bg-(--color-surface) text-(--color-ink-soft)"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No orders here" description="Your orders will appear here." />
        ) : (
          <div className="space-y-2.5">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onClick={() => navigate(`/orders/${order.id}`)} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
