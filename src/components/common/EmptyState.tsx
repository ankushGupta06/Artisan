import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[24px] border border-dashed border-(--color-line) bg-(--color-surface)/60 px-6 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-(--color-terracotta-100) text-(--color-terracotta-600)">
        <Icon className="size-7" />
      </div>
      <div className="space-y-1.5">
        <p className="font-display text-lg font-semibold text-(--color-ink)">{title}</p>
        <p className="mx-auto max-w-xs text-sm text-(--color-ink-faint)">{description}</p>
      </div>
      {action}
    </div>
  );
}
