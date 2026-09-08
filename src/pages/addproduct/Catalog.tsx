import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mic, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { AIProcessing } from "@/components/ai/AIProcessing";
import { VoiceRecorder } from "@/components/ai/VoiceRecorder";
import {
  CATEGORIES,
  ProductForm,
  type ProductFormValues,
} from "@/components/products/ProductForm";
import { useApp } from "@/context/AppContext";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { generateCatalog, transcribeVoice } from "@/services/mockAI";
import {
  extractProductFromAudio,
  extractProductFromText,
  type VoiceExtractedProduct,
} from "@/services/aiService";
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

function normalizeCategory(value: string | null): ProductCategory | "" {
  return CATEGORIES.includes(value as ProductCategory) ? (value as ProductCategory) : "";
}

export default function Catalog() {
  const navigate = useNavigate();
  const { draft, updateDraft, showToast } = useApp();
  const recorder = useAudioRecorder();

  const [stage, setStage] = useState<Stage>(draft.name ? "result" : "describe");
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("Hindi");
  const [mockListening, setMockListening] = useState(false);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [transcript, setTranscript] = useState(draft.transcriptHi ?? draft.transcriptEn ?? "");
  const [extraction, setExtraction] = useState<VoiceExtractedProduct | null>(null);
  const [usedRealAI, setUsedRealAI] = useState(false);
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

  // Sample-product demos and browsers without MediaRecorder use the mock path;
  // a real hand-taken photo + a capable browser get the live AI microservice.
  const useRealVoice = recorder.isSupported && !draft.sampleKey;

  async function runMockTranscription() {
    setMockListening(true);
    const result = await transcribeVoice(draft.sampleKey);
    setTranscript(language === "English" ? result.textEn : result.textHi);
    updateDraft({ transcriptHi: result.textHi, transcriptEn: result.textEn, voiceLanguage: "hi" });
    setExtraction(null);
    setUsedRealAI(false);
    setMockListening(false);
  }

  async function handleMic() {
    if (voiceBusy) return;

    if (!useRealVoice) {
      await runMockTranscription();
      return;
    }

    if (recorder.isRecording) {
      setVoiceBusy(true);
      const blob = await recorder.stop();
      try {
        if (!blob || blob.size === 0) throw new Error("No audio was captured — try again.");
        const result = await extractProductFromAudio(blob);
        setTranscript(result.transcript);
        setExtraction(result.product);
        setUsedRealAI(true);
        updateDraft({ transcriptEn: result.transcript, voiceLanguage: "hi" });
        showToast("Voice transcribed by AI.", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Voice service unavailable — using a sample.",
          "error",
        );
        await runMockTranscription();
      } finally {
        setVoiceBusy(false);
      }
      return;
    }

    setExtraction(null);
    setUsedRealAI(false);
    const started = await recorder.start();
    if (!started && recorder.error) showToast(recorder.error, "error");
  }

  function applyExtraction(product: VoiceExtractedProduct) {
    const category = normalizeCategory(product.category);
    setForm((prev) => ({
      ...prev,
      name: product.name ?? prev.name,
      category: category || prev.category,
      material: product.material ?? prev.material,
      craft: product.craft ?? prev.craft,
      color: product.color ?? prev.color,
      productionTimeDays: product.productionTimeDays ?? prev.productionTimeDays,
      descriptionEn: product.descriptionEn ?? prev.descriptionEn,
      descriptionHi: product.descriptionHi ?? prev.descriptionHi,
      keywords: product.keywords.length ? product.keywords.join(", ") : prev.keywords,
    }));
    updateDraft({
      name: product.name ?? undefined,
      category: (category || undefined) as ProductCategory | undefined,
      material: product.material ?? undefined,
      craft: product.craft ?? undefined,
      color: product.color ?? undefined,
      productionTimeDays: product.productionTimeDays ?? undefined,
      descriptionEn: product.descriptionEn ?? undefined,
      descriptionHi: product.descriptionHi ?? undefined,
      keywords: product.keywords,
    });
  }

  function applyMockCatalog(result: Awaited<ReturnType<typeof generateCatalog>>) {
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
  }

  async function generate() {
    setStage("processing");

    let product = extraction;
    // Typed (not spoken) description + live service available -> extract from text.
    if (!product && useRealVoice && transcript.trim()) {
      try {
        product = (await extractProductFromText(transcript.trim())).product;
        setUsedRealAI(true);
      } catch {
        product = null;
      }
    }

    if (product) {
      applyExtraction(product);
    } else {
      applyMockCatalog(await generateCatalog(draft.sampleKey));
      setUsedRealAI(false);
    }

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

  const seconds = Math.floor(recorder.durationMs / 1000);

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

            <div className="card-craft flex flex-col items-center gap-3 bg-(--color-surface) py-8 shadow-craft">
              <VoiceRecorder
                listening={mockListening || recorder.isRecording}
                onClick={handleMic}
                disabled={voiceBusy}
              />
              {recorder.isRecording && (
                <p className="text-xs font-medium text-(--color-ink-faint)">
                  {`0:${seconds.toString().padStart(2, "0")}`} · tap again to finish
                </p>
              )}
              {voiceBusy && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-(--color-ink-faint)">
                  <Loader2 className="size-3.5 animate-spin" /> Transcribing your voice...
                </p>
              )}
              {!voiceBusy && !recorder.isRecording && (
                <p className="text-center text-[11px] text-(--color-ink-faint)">
                  {useRealVoice
                    ? "Records your voice and sends it to the AI service."
                    : "Sample product — using a demo transcription."}
                </p>
              )}
              {recorder.error && (
                <p className="text-center text-[11px] font-medium text-(--color-danger)">{recorder.error}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="eyebrow">
                <Mic className="size-3" /> Transcription
              </p>
              <textarea
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  setExtraction(null);
                }}
                placeholder="Your spoken description will appear here — or type it directly."
                className="min-h-28 w-full resize-none rounded-2xl border border-(--color-line) bg-(--color-surface) p-4 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:border-(--color-green-700) focus:outline-none"
              />
              {usedRealAI && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-(--color-green-700)">
                  <Sparkles className="size-3" /> Transcribed by the AI service
                </p>
              )}
            </div>

            <Button full disabled={!transcript.trim() || voiceBusy || recorder.isRecording} onClick={generate}>
              Generate Catalog
            </Button>
          </>
        )}

        {stage === "processing" && (
          <AIProcessing title="Building your catalog listing..." steps={PROCESSING_STEPS} totalMs={1500} />
        )}

        {stage === "result" && (
          <>
            {usedRealAI && (
              <div className="flex items-center gap-2 rounded-2xl border border-(--color-green-700)/25 bg-(--color-green-700)/8 px-3.5 py-2.5 text-xs font-medium text-(--color-green-700)">
                <Sparkles className="size-3.5 shrink-0" />
                Generated from your voice by the AI service. Review and edit anything below.
              </div>
            )}
            <ProductForm
              values={form}
              onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
              showPriceQuantity={false}
            />
            <Button full onClick={continueToPricing}>
              Continue to Pricing
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
