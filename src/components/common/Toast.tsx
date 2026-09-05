import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

const TONE_STYLES = {
  success: { icon: CheckCircle2, bg: "bg-(--color-green-700)", text: "text-(--color-cream)" },
  error: { icon: XCircle, bg: "bg-(--color-danger)", text: "text-white" },
  info: { icon: Info, bg: "bg-(--color-ink)", text: "text-(--color-cream)" },
} as const;

export function ToastStack() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex flex-col items-center gap-2 px-4 safe-top">
      {toasts.map((toastItem) => {
        const style = TONE_STYLES[toastItem.tone];
        const Icon = style.icon;
        return (
          <button
            key={toastItem.id}
            onClick={() => dismissToast(toastItem.id)}
            className={`pointer-events-auto flex max-w-md items-center gap-2.5 rounded-full px-4 py-3 text-sm font-medium shadow-craft-lg animate-fade-up ${style.bg} ${style.text}`}
          >
            <Icon className="size-4.5 shrink-0" />
            <span className="text-left">{toastItem.message}</span>
          </button>
        );
      })}
    </div>
  );
}
