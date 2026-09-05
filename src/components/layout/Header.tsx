import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "@/context/AppContext";

export function Header({
  title,
  subtitle,
  showBack,
  backTo,
  rightSlot,
  transparent,
}: {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  rightSlot?: ReactNode;
  transparent?: boolean;
}) {
  const navigate = useNavigate();
  const { unreadCount } = useApp();

  return (
    <header
      className={`safe-top sticky top-0 z-30 flex items-center gap-3 px-4 pb-3 pt-4 ${
        transparent ? "" : "bg-(--color-cream)/90 backdrop-blur-sm"
      }`}
    >
      {showBack && (
        <button
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          aria-label="Go back"
          className="tap-target flex shrink-0 items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
        >
          <ArrowLeft className="size-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {title && <h1 className="truncate font-display text-xl font-semibold text-(--color-ink)">{title}</h1>}
        {subtitle && <p className="truncate text-sm text-(--color-ink-faint)">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {rightSlot}
        <button
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
          className="tap-target relative flex items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
        >
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2.5 items-center justify-center rounded-full bg-(--color-terracotta-500)" />
          )}
        </button>
      </div>
    </header>
  );
}
