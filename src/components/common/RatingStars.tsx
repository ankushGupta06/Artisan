import { Star } from "lucide-react";

export function RatingStars({ rating, count, size = "sm" }: { rating: number; count?: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? "size-4" : "size-3.5";
  return (
    <span className="inline-flex items-center gap-1 text-(--color-ink-soft)">
      <Star className={`${dim} fill-(--color-gold-500) text-(--color-gold-500)`} />
      <span className="text-sm font-semibold text-(--color-ink)">{rating.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-xs text-(--color-ink-faint)">({count})</span>}
    </span>
  );
}
