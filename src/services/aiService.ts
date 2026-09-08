// Real AI microservice client (the ONE non-mocked service in the prototype).
//
//   audio / text  ->  FastAPI (ai-service/)  ->  transcript + draft product fields
//
// Everything else in the app still flows through `mockAI.ts`. Keep this module
// the only place that knows the service URL or its response shape.

const BASE_URL = (import.meta.env.VITE_AI_SERVICE_URL ?? "http://localhost:8000").replace(/\/+$/, "");

/** Product fields the AI is allowed to fill. Mirrors `ExtractedProduct` in
 *  ai-service/schemas/product.py. Every field is nullable except `keywords`. */
export interface VoiceExtractedProduct {
  name: string | null;
  category: string | null;
  price: number | null;
  material: string | null;
  craft: string | null;
  color: string | null;
  productionTimeDays: number | null;
  descriptionEn: string | null;
  descriptionHi: string | null;
  keywords: string[];
}

export interface VoiceExtractionResult {
  success: boolean;
  transcript: string;
  product: VoiceExtractedProduct;
}

function extensionFor(blob: Blob): string {
  const t = blob.type.toLowerCase();
  if (t.includes("ogg")) return "ogg";
  if (t.includes("mp4") || t.includes("m4a") || t.includes("aac")) return "mp4";
  if (t.includes("mpeg") || t.includes("mp3")) return "mp3";
  if (t.includes("wav")) return "wav";
  return "webm";
}

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: unknown };
    if (typeof body.detail === "string" && body.detail) return body.detail;
  } catch {
    // non-JSON error body — fall through
  }
  return `AI service responded ${res.status}`;
}

/** POST a recorded audio blob; get back the transcript + extracted fields. */
export async function extractProductFromAudio(
  audio: Blob,
  signal?: AbortSignal,
): Promise<VoiceExtractionResult> {
  const form = new FormData();
  form.append("audio", audio, `voice-note.${extensionFor(audio)}`);

  const res = await fetch(`${BASE_URL}/api/voice/extract-product`, {
    method: "POST",
    body: form,
    signal,
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as VoiceExtractionResult;
}

/** Typed-description fallback: skip transcription, extract straight from text. */
export async function extractProductFromText(
  transcript: string,
  signal?: AbortSignal,
): Promise<VoiceExtractionResult> {
  const res = await fetch(`${BASE_URL}/api/text/extract-product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
    signal,
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as VoiceExtractionResult;
}

/** Quick reachability probe so the UI can decide whether to use the real
 *  service or fall straight back to the mock flow. */
export async function aiServiceHealthy(timeoutMs = 1500): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${BASE_URL}/health`, { signal: ctrl.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}
