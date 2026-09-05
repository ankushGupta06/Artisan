import { priceIndicator } from "@/services/mockAI";
import type { PricingRecommendation } from "@/types";

const INDICATOR_STYLES: Record<string, string> = {
  "Too Low": "bg-(--color-danger-100) text-(--color-danger)",
  Competitive: "bg-(--color-green-100) text-(--color-green-700)",
  Premium: "bg-(--color-gold-100) text-(--color-gold-600)",
  "Too High": "bg-(--color-danger-100) text-(--color-danger)",
};

export function PriceSlider({
  value,
  onChange,
  pricing,
  min = 1500,
  max = 2500,
}: {
  value: number;
  onChange: (v: number) => void;
  pricing: PricingRecommendation;
  min?: number;
  max?: number;
}) {
  const indicator = priceIndicator(value, pricing);
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="card-craft-alt space-y-4 bg-(--color-surface) p-5 shadow-craft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Your Price</p>
          <p className="font-display text-3xl font-bold text-(--color-ink)">₹{value.toLocaleString("en-IN")}</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${INDICATOR_STYLES[indicator]}`}>{indicator}</span>
      </div>

      <div className="relative pt-1">
        <div
          className="absolute top-2.5 h-1.5 rounded-full bg-(--color-green-700)"
          style={{ width: `${pct}%` }}
        />
        <div className="h-1.5 w-full rounded-full bg-(--color-cream-deep)" />
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Adjust selling price"
          className="absolute inset-x-0 -top-1.5 h-6 w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-(--color-terracotta-600) [&::-webkit-slider-thumb]:bg-(--color-surface)
            [&::-webkit-slider-thumb]:shadow-craft [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-(--color-terracotta-600) [&::-moz-range-thumb]:bg-(--color-surface)"
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-(--color-ink-faint)">
        <span>₹{min.toLocaleString("en-IN")}</span>
        <span>₹{max.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
