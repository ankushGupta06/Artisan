import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "green",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "green" | "terracotta" | "gold";
  onClick?: () => void;
}) {
  const toneClasses = {
    green: "bg-(--color-green-50) text-(--color-green-700)",
    terracotta: "bg-(--color-terracotta-50) text-(--color-terracotta-600)",
    gold: "bg-(--color-gold-100) text-(--color-gold-600)",
  }[tone];

  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={`card-craft flex flex-col gap-2.5 bg-(--color-surface) p-4 text-left shadow-craft transition-transform ${onClick ? "active:scale-[0.98]" : ""}`}
    >
      <span className={`flex size-9 items-center justify-center rounded-full ${toneClasses}`}>
        <Icon className="size-4.5" />
      </span>
      <div>
        <p className="font-display text-xl font-semibold leading-tight text-(--color-ink)">{value}</p>
        <p className="text-xs font-medium text-(--color-ink-faint)">{label}</p>
      </div>
    </Comp>
  );
}
