import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Boxes,
  Eye,
  IndianRupee,
  PackageSearch,
  PlusCircle,
  Sparkles,
  Tag,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { OrderCard } from "@/components/orders/OrderCard";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/context/AppContext";
import { CURRENT_ARTISAN_ID } from "@/data/products";

export default function Home() {
  const navigate = useNavigate();
  const { user, products, orders, notifications, unreadCount, markNotificationRead } = useApp();
  const [priceModalOpen, setPriceModalOpen] = useState(false);

  const myProducts = useMemo(() => products.filter((p) => p.artisanId === CURRENT_ARTISAN_ID), [products]);
  const revenue = useMemo(
    () => orders.filter((o) => o.status !== "pending").reduce((sum, o) => sum + o.total, 0),
    [orders],
  );
  const totalViews = useMemo(() => myProducts.reduce((sum, p) => sum + p.views, 0), [myProducts]);
  const recentOrders = useMemo(() => [...orders].slice(0, 3), [orders]);
  const recentNotifications = useMemo(() => notifications.slice(0, 3), [notifications]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  function openNotification(id: string, link?: string) {
    markNotificationRead(id);
    if (link) navigate(link);
  }

  return (
    <AppShell>
      <div className="space-y-6 px-4 pt-5 safe-top">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-(--color-ink)">
              {greeting}, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-(--color-ink-faint)">Here's how your business is doing today.</p>
          </div>
          <button
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            className="tap-target relative flex shrink-0 items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
          >
            <Bell className="size-4.5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-2.5 items-center justify-center rounded-full bg-(--color-terracotta-500)" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Boxes} label="Products" value={String(myProducts.length)} tone="green" onClick={() => navigate("/products")} />
          <StatCard icon={IndianRupee} label="Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} tone="terracotta" onClick={() => navigate("/orders")} />
          <StatCard icon={PackageSearch} label="Orders" value={String(orders.length)} tone="gold" onClick={() => navigate("/orders")} />
          <StatCard icon={Eye} label="Views" value={totalViews.toLocaleString("en-IN")} tone="green" onClick={() => navigate("/products")} />
        </div>

        <AIInsightCard
          message="Your cotton products are getting 2.3× more views this month."
          actions={
            <>
              <Button size="sm" variant="accent" onClick={() => navigate("/assistant")}>
                View Insights
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-(--color-cream)/40 text-(--color-cream) hover:bg-(--color-cream)/10"
                onClick={() => navigate("/assistant")}
              >
                Ask AI
              </Button>
            </>
          }
        />

        <section className="space-y-3">
          <p className="eyebrow">Quick Actions</p>
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "Add Product", icon: PlusCircle, onClick: () => navigate("/add-product") },
              { label: "My Products", icon: Boxes, onClick: () => navigate("/products") },
              { label: "Check Price", icon: Tag, onClick: () => setPriceModalOpen(true) },
              { label: "Orders", icon: PackageSearch, onClick: () => navigate("/orders") },
            ].map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center gap-2 rounded-2xl bg-(--color-surface) px-1.5 py-3.5 text-center shadow-craft transition-transform active:scale-95"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-(--color-green-50) text-(--color-green-700)">
                  <action.icon className="size-4.5" />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-(--color-ink-soft)">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Recent Orders</p>
            <button onClick={() => navigate("/orders")} className="text-xs font-semibold text-(--color-terracotta-600)">
              See all
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState icon={PackageSearch} title="No orders yet" description="Your orders will appear here." />
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} onClick={() => navigate(`/orders/${order.id}`)} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Notifications</p>
            <button onClick={() => navigate("/notifications")} className="text-xs font-semibold text-(--color-terracotta-600)">
              See all
            </button>
          </div>
          <div className="space-y-1.5">
            {recentNotifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onClick={() => openNotification(n.id, n.link)} />
            ))}
          </div>
        </section>
      </div>

      <Modal open={priceModalOpen} onClose={() => setPriceModalOpen(false)} title="Check Price">
        <div className="space-y-4 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-(--color-terracotta-100) text-(--color-terracotta-600)">
            <Sparkles className="size-6" />
          </span>
          <p className="text-sm text-(--color-ink-soft)">
            The AI Pricing Assistant analyzes material cost, labor, and similar products to suggest a competitive price.
            It runs automatically while you add a new product.
          </p>
          <Button
            full
            onClick={() => {
              setPriceModalOpen(false);
              navigate("/add-product");
            }}
          >
            Start with a Product
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
