import { Bell, MessageSquareText, PackageCheck, Sparkles, Tag } from "lucide-react";
import type { AppNotification, NotificationType } from "@/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  enquiry: MessageSquareText,
  published: Sparkles,
  pricing: Tag,
  order: PackageCheck,
  system: Bell,
};

const ICON_TONES: Record<NotificationType, string> = {
  enquiry: "bg-(--color-info-100) text-(--color-info)",
  published: "bg-(--color-green-100) text-(--color-green-700)",
  pricing: "bg-(--color-gold-100) text-(--color-gold-600)",
  order: "bg-(--color-terracotta-100) text-(--color-terracotta-700)",
  system: "bg-(--color-cream-deep) text-(--color-ink-soft)",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationItem({ notification, onClick }: { notification: AppNotification; onClick: () => void }) {
  const Icon = ICONS[notification.type];
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-colors ${
        notification.read ? "bg-(--color-surface)" : "bg-(--color-terracotta-50)"
      }`}
    >
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${ICON_TONES[notification.type]}`}>
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-(--color-ink)">{notification.title}</p>
          {!notification.read && <span className="size-2 shrink-0 rounded-full bg-(--color-terracotta-500)" />}
        </div>
        <p className="mt-0.5 text-sm text-(--color-ink-soft)">{notification.message}</p>
        <p className="mt-1 text-xs text-(--color-ink-faint)">{timeAgo(notification.date)}</p>
      </div>
    </button>
  );
}
