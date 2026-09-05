export function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`tap-target shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)"
          : "border-(--color-line) bg-(--color-surface) text-(--color-ink-soft) hover:border-(--color-green-700)/40"
      }`}
    >
      {label}
    </button>
  );
}
