import { useNavigate } from "react-router-dom";
import { Camera, Images, Mic, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { ProductIllustration } from "@/components/common/ProductIllustration";
import { useApp } from "@/context/AppContext";
import type { SampleProductKey } from "@/data/aiResponses";
import { SAMPLE_PRODUCTS } from "@/data/aiResponses";

const SAMPLES: { key: SampleProductKey; label: string }[] = [
  { key: "saree", label: "Chanderi Saree" },
  { key: "pottery", label: "Terracotta Pottery" },
  { key: "bag", label: "Cotton Bag" },
  { key: "basket", label: "Bamboo Basket" },
];

function ActionTile({
  icon: Icon,
  title,
  subtitle,
  onClick,
  accent,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`card-craft flex w-full items-center gap-4 p-4 text-left shadow-craft transition-transform active:scale-[0.98] ${
        accent ? "bg-(--color-terracotta-600) text-(--color-cream)" : "bg-(--color-surface)"
      }`}
    >
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
          accent ? "bg-(--color-cream)/15" : "bg-(--color-green-50) text-(--color-green-700)"
        }`}
      >
        <Icon className="size-5.5" />
      </span>
      <div className="min-w-0">
        <p className={`font-semibold ${accent ? "text-(--color-cream)" : "text-(--color-ink)"}`}>{title}</p>
        <p className={`text-xs ${accent ? "text-(--color-cream)/75" : "text-(--color-ink-faint)"}`}>{subtitle}</p>
      </div>
    </button>
  );
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { resetDraft, updateDraft } = useApp();

  function startFresh(target: "photo" | "catalog") {
    resetDraft();
    navigate(`/add-product/${target}`);
  }

  function pickSample(key: SampleProductKey) {
    const sample = SAMPLE_PRODUCTS[key];
    resetDraft();
    updateDraft({ sampleKey: key, illustration: sample.illustration, originalIllustration: sample.illustration });
    navigate("/add-product/studio");
  }

  return (
    <AppShell>
      <Header title="Add your product" subtitle="Let AI do the hard work." showBack backTo="/home" />
      <div className="space-y-6 px-4 pb-6">
        <div className="space-y-3">
          <ActionTile icon={Camera} title="Take a Photo" subtitle="Use your camera right now" onClick={() => startFresh("photo")} accent />
          <ActionTile icon={Images} title="Choose from Gallery" subtitle="Pick an existing photo" onClick={() => startFresh("photo")} />
          <ActionTile icon={Mic} title="Describe by Voice" subtitle="Skip the photo, just talk" onClick={() => startFresh("catalog")} />
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Use a Sample Product</p>
          <p className="-mt-1 text-xs text-(--color-ink-faint)">
            For a reliable demo, try the flow with a ready-made sample.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {SAMPLES.map((s) => (
              <button
                key={s.key}
                onClick={() => pickSample(s.key)}
                className="card-craft overflow-hidden bg-(--color-surface) text-left shadow-craft transition-transform active:scale-[0.97]"
              >
                <ProductIllustration illustration={SAMPLE_PRODUCTS[s.key].illustration} size="md" className="w-full" />
                <div className="flex items-center gap-1.5 p-2.5">
                  <Sparkles className="size-3.5 text-(--color-terracotta-600)" />
                  <span className="text-xs font-semibold text-(--color-ink)">{s.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
