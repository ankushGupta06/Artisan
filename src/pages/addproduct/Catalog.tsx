import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { AIProcessing } from "@/components/ai/AIProcessing";
import { VoiceRecorder } from "@/components/ai/VoiceRecorder";
import { ProductForm, type ProductFormValues } from "@/components/products/ProductForm";
import { useApp } from "@/context/AppContext";
import { generateCatalog, transcribeVoice } from "@/services/mockAI";
import type { ProductCategory } from "@/types";

type Stage = "describe" | "processing" | "result";

const LANGUAGES = ["Hindi", "English", "Marathi", "Gujarati", "Tamil"] as const;

const PROCESSING_STEPS = [
  "Understanding your description...",
  "Identifying product details...",
  "Writing product description...",
  "Translating to Hindi...",
  "Preparing keywords...",
];

export default function Catalog() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const [stage, setStage] = useState<Stage>(draft.name ? "result" : "describe");
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("Hindi");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState(draft.transcriptHi ?? "");
  const [form, setForm] = useState<ProductFormValues>({
    name: draft.name ?? "",
    category: (draft.category as ProductCategory) ?? "",
    material: draft.material ?? "",
    craft: draft.craft ?? "",
    color: draft.color ?? "",
    productionTimeDays: draft.productionTimeDays ?? "",
    price: "",
    quantity: "",
    descriptionEn: draft.descriptionEn ?? "",
    descriptionHi: draft.descriptionHi ?? "",
    keywords: draft.keywords?.join(", ") ?? "",
  });

  async function startListening() {
    setListening(true);
    const result = await transcribeVoice(draft.sampleKey);
    setTranscript(language === "English" ? result.textEn : result.textHi);
    updateDraft({ transcriptHi: result.textHi, transcriptEn: result.textEn, voiceLanguage: "hi" });
    setListening(false);
  }

  async function generate() {
    setStage("processing");
    const result = await generateCatalog(draft.sampleKey);
    setForm((prev) => ({
      ...prev,
      name: result.name,
      category: result.category as ProductCategory,
      material: result.material,
      craft: result.craft,
      color: result.color,
      productionTimeDays: result.productionTimeDays,
      descriptionEn: result.descriptionEn,
      descriptionHi: result.descriptionHi,
      keywords: result.keywords.join(", "),
    }));
    updateDraft({ ...result });
    setStage("result");
  }

  function continueToPricing() {
    updateDraft({
      name: form.name,
      category: form.category as ProductCategory,
      material: form.material,
      craft: form.craft,
      color: form.color,
      productionTimeDays: Number(form.productionTimeDays) || undefined,
      descriptionEn: form.descriptionEn,
      descriptionHi: form.descriptionHi,
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    });
    navigate("/add-product/pricing");
  }

  return (
    <AppShell>
      <Header
        title={stage === "describe" ? "Tell us about your product" : "AI Catalog"}
        showBack
        backTo="/add-product/studio"
      />
      <div className="space-y-6 px-4 pb-6">
        {stage === "describe" && (
          <>
            <div className="flex justify-center gap-2 overflow-x-auto pb-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                    language === l
                      ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)"
                      : "border-(--color-line) text-(--color-ink-soft)"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="card-craft flex flex-col items-center gap-5 bg-(--color-surface) py-8 shadow-craft">
              <VoiceRecorder listening={listening} onClick={startListening} />
            </div>

            <div className="space-y-1.5">
              <p className="eyebrow">
                <Mic className="size-3" /> Transcription
              </p>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your spoken description will appear here — or type it directly."
                className="min-h-28 w-full resize-none rounded-2xl border border-(--color-line) bg-(--color-surface) p-4 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:border-(--color-green-700) focus:outline-none"
              />
            </div>

            <Button full disabled={!transcript.trim()} onClick={generate}>
              Generate Catalog
            </Button>
          </>
        )}

        {stage === "processing" && <AIProcessing title="Building your catalog listing..." steps={PROCESSING_STEPS} totalMs={1500} />}

        {stage === "result" && (
          <>
            <ProductForm values={form} onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))} showPriceQuantity={false} />
            <Button full onClick={continueToPricing}>
              Continue to Pricing
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
