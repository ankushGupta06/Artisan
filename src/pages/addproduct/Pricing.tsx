import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { AIProcessing } from "@/components/ai/AIProcessing";
import { PriceCard } from "@/components/ai/PriceCard";
import { PriceSlider } from "@/components/ai/PriceSlider";
import { useApp } from "@/context/AppContext";
import { generatePrice } from "@/services/mockAI";
import type { PricingRecommendation } from "@/types";

const PROCESSING_STEPS = [
  "Analyzing market prices...",
  "Comparing similar products...",
  "Calculating recommendation...",
];

export default function Pricing() {
  const navigate = useNavigate();
  const { draft, updateDraft, showToast } = useApp();
  const [pricing, setPricing] = useState<PricingRecommendation | null>(draft.pricing ?? null);
  const [selected, setSelected] = useState<number>(draft.selectedPrice ?? draft.pricing?.recommended ?? 0);

  useEffect(() => {
    if (pricing) return;
    let cancelled = false;
    generatePrice(draft.sampleKey).then((result) => {
      if (cancelled) return;
      setPricing(result);
      setSelected(result.recommended);
      updateDraft({ pricing: result, selectedPrice: result.recommended });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleContinue() {
    updateDraft({ selectedPrice: selected });
    navigate("/add-product/preview");
  }

  return (
    <AppShell>
      <Header title="AI Pricing Assistant" showBack backTo="/add-product/catalog" />
      <div className="space-y-5 px-4 pb-6">
        {!pricing ? (
          <AIProcessing title="Finding your best price..." steps={PROCESSING_STEPS} totalMs={1000} />
        ) : (
          <>
            <PriceCard pricing={pricing} />
            <PriceSlider value={selected} onChange={setSelected} pricing={pricing} />

            <p className="rounded-2xl bg-(--color-cream-deep) p-4 text-xs leading-relaxed text-(--color-ink-soft)">
              Your suggested price considers material cost, production time, similar products, and craft complexity.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                full
                icon={<Check className="size-4" />}
                onClick={() => {
                  setSelected(pricing.recommended);
                  showToast(`Accepted ₹${pricing.recommended.toLocaleString("en-IN")}.`);
                }}
              >
                Accept ₹{pricing.recommended.toLocaleString("en-IN")}
              </Button>
              <Button
                variant="outline"
                full
                icon={<SlidersHorizontal className="size-4" />}
                onClick={() => showToast("Drag the slider to set your own price.", "info")}
              >
                Adjust Price
              </Button>
            </div>

            <Button full onClick={handleContinue}>
              Continue
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
