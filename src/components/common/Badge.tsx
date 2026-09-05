import type { ReactNode } from "react";

type Tone = "green" | "terracotta" | "gold" | "neutral" | "danger" | "info";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-(--color-green-100) text-(--color-green-700)",
  terracotta: "bg-(--color-terracotta-100) text-(--color-terracotta-700)",
  gold: "bg-(--color-gold-100) text-(--color-gold-600)",
  neutral: "bg-(--color-cream-deep) text-(--color-ink-soft)",
  danger: "bg-(--color-danger-100) text-(--color-danger)",
  info: "bg-(--color-info-100) text-(--color-info)",
};

export function Badge({ children, tone = "neutral", icon }: { children: ReactNode; tone?: Tone; icon?: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${TONE_CLASSES[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}
