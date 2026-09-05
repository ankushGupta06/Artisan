import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ImagePlus, RefreshCw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { ProductIllustration } from "@/components/common/ProductIllustration";
import { useApp } from "@/context/AppContext";
import { SAMPLE_PRODUCTS, type SampleProductKey } from "@/data/aiResponses";
import type { IllustrationKey } from "@/types";

const SAMPLES: { key: SampleProductKey; label: string }[] = [
  { key: "saree", label: "Chanderi Saree" },
  { key: "pottery", label: "Terracotta Pot" },
  { key: "bag", label: "Cotton Bag" },
  { key: "basket", label: "Bamboo Basket" },
];

export default function Photo() {
  const navigate = useNavigate();
  const { updateDraft, showToast } = useApp();
  const [captured, setCaptured] = useState<IllustrationKey | null>(null);
  const [sampleKey, setSampleKey] = useState<SampleProductKey | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function chooseSample(key: SampleProductKey) {
    setSampleKey(key);
    setCaptured(SAMPLE_PRODUCTS[key].illustration);
  }

  function simulateCapture() {
    setSampleKey(null);
    setCaptured("home-decor");
    showToast("Photo captured.", "success");
  }

  function handleFile() {
    setSampleKey(null);
    setCaptured("home-decor");
    showToast("Photo uploaded.", "success");
  }

  function retake() {
    setCaptured(null);
    setSampleKey(null);
  }

  function handleContinue() {
    if (!captured) return;
    updateDraft({
      illustration: captured,
      originalIllustration: captured,
      sampleKey: sampleKey ?? undefined,
    });
    navigate("/add-product/studio");
  }

  return (
    <AppShell>
      <Header title="Add a Photo" showBack backTo="/add-product" />
      <div className="space-y-5 px-4 pb-6">
        <div className="card-craft relative aspect-[4/3] w-full overflow-hidden bg-(--color-ink) shadow-craft-lg">
          {captured ? (
            <ProductIllustration illustration={captured} size="hero" className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-(--color-cream)/70">
              <Camera className="size-10" />
              <p className="text-sm">Camera preview</p>
            </div>
          )}
        </div>

        {!captured ? (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="accent" full icon={<Camera className="size-4.5" />} onClick={simulateCapture}>
              Capture
            </Button>
            <Button
              variant="outline"
              full
              icon={<ImagePlus className="size-4.5" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile();
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" full icon={<RefreshCw className="size-4" />} onClick={retake}>
              Retake
            </Button>
            <Button full onClick={handleContinue}>
              Continue
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <p className="eyebrow">
            <Sparkles className="size-3" /> Or use a sample photo
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {SAMPLES.map((s) => (
              <button
                key={s.key}
                onClick={() => chooseSample(s.key)}
                className={`card-craft overflow-hidden shadow-craft transition-transform active:scale-95 ${
                  sampleKey === s.key ? "ring-2 ring-(--color-green-700)" : ""
                }`}
              >
                <ProductIllustration illustration={SAMPLE_PRODUCTS[s.key].illustration} size="sm" className="w-full" />
              </button>
            ))}
          </div>
          <p className="text-center text-[11px] text-(--color-ink-faint)">Sample photos always work — great for demos.</p>
        </div>
      </div>
    </AppShell>
  );
}
