import { Sparkles } from "lucide-react";
import type { PricingRecommendation } from "@/types";

export function PriceCard({ pricing }: { pricing: PricingRecommendation }) {
  const rows = [
    { label: "Material Cost", value: pricing.materialCost },
    { label: "Labor", value: pricing.laborCost },
    { label: "Other Costs", value: pricing.otherCosts },
  ];

  return (
    <div className="card-craft overflow-hidden bg-(--color-green-700) text-(--color-cream) shadow-craft-lg">
      <div className="flex items-center gap-2 border-b border-(--color-cream)/15 px-5 py-4">
        <Sparkles className="size-4.5 text-(--color-gold-100)" />
        <p className="text-sm font-semibold">AI Pricing Assistant</p>
      </div>

      <div className="space-y-2 px-5 pt-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm text-(--color-cream)/85">
            <span>{row.label}</span>
            <span className="font-semibold text-(--color-cream)">₹{row.value.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>

      <div className="mx-5 my-4 h-px bg-(--color-cream)/15" />

      <div className="px-5 text-sm text-(--color-cream)/85">
        Market Range
        <span className="float-right font-semibold text-(--color-cream)">
          ₹{pricing.marketMin.toLocaleString("en-IN")} – ₹{pricing.marketMax.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="mt-4 rounded-t-[20px] bg-(--color-cream)/10 px-5 py-5 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-(--color-gold-100)">Recommended Price</p>
        <p className="font-display text-4xl font-bold text-(--color-cream)">
          ₹{pricing.recommended.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-(--color-cream)/70">
          Range ₹{pricing.recommendedMin.toLocaleString("en-IN")} – ₹{pricing.recommendedMax.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
