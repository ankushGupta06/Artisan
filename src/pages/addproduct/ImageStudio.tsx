import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { BeforeAfter } from "@/components/ai/BeforeAfter";
import { AIProcessing } from "@/components/ai/AIProcessing";
import { useApp } from "@/context/AppContext";
import { enhanceImage } from "@/services/mockAI";

type Phase = "editing" | "processing" | "done";

const PROCESSING_STEPS = [
  "Detecting product",
  "Removing background",
  "Improving lighting",
  "Optimizing composition",
];

const BADGES = [
  "Background removed",
  "Lighting improved",
  "Product centered",
  "E-commerce optimized",
];

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="flex w-full items-center justify-between rounded-2xl bg-(--color-surface) px-4 py-3 shadow-craft"
    >
      <span className="text-sm font-semibold text-(--color-ink)">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-(--color-green-700)" : "bg-(--color-line)"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-(--color-surface) shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}

export default function ImageStudio() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const [phase, setPhase] = useState<Phase>(draft.imageEnhanced ? "done" : "editing");
  const [background, setBackground] = useState(true);
  const [lighting, setLighting] = useState(true);
  const [shadow, setShadow] = useState(true);
  const [format, setFormat] = useState<"Square" | "Portrait" | "Landscape">("Square");

  const illustration = draft.illustration ?? draft.originalIllustration ?? "home-decor";

  async function applyChanges() {
    setPhase("processing");
    const result = await enhanceImage();
    updateDraft({ imageEnhanced: true, enhancements: result });
    setPhase("done");
  }

  function tryAgain() {
    setBackground(true);
    setLighting(true);
    setShadow(true);
    setPhase("editing");
  }

  return (
    <AppShell>
      <Header title="AI Product Studio" subtitle="Before / After" showBack backTo="/add-product/photo" />
      <div className="space-y-5 px-4 pb-6">
        {phase === "processing" ? (
          <AIProcessing title="Enhancing your product photo..." steps={PROCESSING_STEPS} totalMs={1200} />
        ) : (
          <>
            <BeforeAfter illustration={illustration} />

            {phase === "done" && (
              <div className="grid grid-cols-2 gap-2">
                {BADGES.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-1.5 rounded-full bg-(--color-green-100) px-3 py-1.5 text-xs font-semibold text-(--color-green-700)"
                  >
                    <Check className="size-3.5 shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            )}

            {phase === "editing" && (
              <div className="space-y-2.5">
                <p className="eyebrow">Adjust Enhancements</p>
                <Toggle label="Remove background" on={background} onClick={() => setBackground((v) => !v)} />
                <Toggle label="Improve lighting" on={lighting} onClick={() => setLighting((v) => !v)} />
                <Toggle label="Add soft shadow" on={shadow} onClick={() => setShadow((v) => !v)} />
                <div className="flex items-center justify-between rounded-2xl bg-(--color-surface) px-4 py-3 shadow-craft">
                  <span className="text-sm font-semibold text-(--color-ink)">Crop / Format</span>
                  <div className="flex gap-1 rounded-full bg-(--color-cream-deep) p-1">
                    {(["Square", "Portrait", "Landscape"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          format === f ? "bg-(--color-green-700) text-(--color-cream)" : "text-(--color-ink-soft)"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 pt-1">
          {phase === "editing" && (
            <Button full variant="accent" icon={<Sparkles className="size-4.5" />} onClick={applyChanges}>
              Apply Changes
            </Button>
          )}
          {phase === "done" && (
            <>
              <Button variant="outline" full icon={<RotateCcw className="size-4" />} onClick={tryAgain}>
                Try Again
              </Button>
              <Button full onClick={() => navigate("/add-product/catalog")}>
                Continue
              </Button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
