import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/context/AppContext";

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  return (
    <AppShell>
      <Header
        title="Notifications"
        showBack
        rightSlot={
          unreadCount > 0 ? (
            <button
              onClick={markAllNotificationsRead}
              className="tap-target flex items-center gap-1.5 rounded-full bg-(--color-surface) px-3 text-xs font-semibold text-(--color-green-700) shadow-craft"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          ) : undefined
        }
      />
      <div className="space-y-1.5 px-4 pb-6">
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="You're all caught up." description="New updates will show up here." />
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.link) navigate(n.link);
              }}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
