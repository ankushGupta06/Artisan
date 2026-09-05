import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";

export default function OrderDetail() {
  const { id } = useParams();
  const { orders, updateOrderStatus, showToast } = useApp();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <AppShell>
        <Header title="Order not found" showBack backTo="/orders" />
        <div className="px-4 text-sm text-(--color-ink-faint)">This order could not be found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header title={`Order #${order.id}`} showBack backTo="/orders" />
      <div className="space-y-5 px-4 pb-6">
        <div className="card-craft space-y-3 bg-(--color-surface) p-4 shadow-craft">
          <div className="flex items-center justify-between text-sm">
            <span className="text-(--color-ink-faint)">Buyer</span>
            <span className="font-semibold text-(--color-ink)">{order.buyer}</span>
          </div>
          {order.location && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-(--color-ink-faint)">Location</span>
              <span className="font-semibold text-(--color-ink)">{order.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-(--color-ink-faint)">Date</span>
            <span className="font-semibold text-(--color-ink)">
              {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="eyebrow">Products</p>
          <div className="card-craft divide-y divide-(--color-line)/60 bg-(--color-surface) shadow-craft">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-semibold text-(--color-ink)">{item.name}</p>
                  <p className="text-(--color-ink-faint)">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold text-(--color-ink)">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
            <div className="flex items-center justify-between p-4 text-sm">
              <span className="font-bold text-(--color-ink)">Total</span>
              <span className="font-display text-lg font-bold text-(--color-terracotta-700)">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="eyebrow">Order Timeline</p>
          <div className="card-craft bg-(--color-surface) p-4 shadow-craft">
            <OrderTimeline status={order.status} />
          </div>
        </div>

        <div className="space-y-3">
          {order.status !== "shipped" && order.status !== "completed" && (
            <Button
              full
              onClick={() => {
                updateOrderStatus(order.id, "shipped");
                showToast("Order marked as shipped.");
              }}
            >
              Mark as Shipped
            </Button>
          )}
          {order.status === "shipped" && (
            <Button
              full
              variant="accent"
              onClick={() => {
                updateOrderStatus(order.id, "completed");
                showToast("Order marked as delivered.");
              }}
            >
              Mark as Delivered
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
