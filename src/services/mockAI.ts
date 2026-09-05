// Mock AI engine. Every "AI" capability in the prototype flows through this
// file so the UI never talks to mock data directly (AI Guide §32/§58).
// Swapping this module for real API calls later should not require touching
// any component.

import { SAMPLE_PRODUCTS, getAssistantResponse, type SampleProductKey } from "@/data/aiResponses";
import { SUPPLIER_MATCHES } from "@/data/buyers";
import type { Buyer, PricingRecommendation, ProductCategory } from "@/types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface EnhanceImageResult {
  background: boolean;
  lighting: boolean;
  shadow: boolean;
}

export async function enhanceImage(): Promise<EnhanceImageResult> {
  await wait(1200);
  return { background: true, lighting: true, shadow: true };
}

export interface TranscribeResult {
  textHi: string;
  textEn: string;
}

export async function transcribeVoice(sampleKey: SampleProductKey = "saree"): Promise<TranscribeResult> {
  await wait(1400);
  const sample = SAMPLE_PRODUCTS[sampleKey];
  return { textHi: sample.transcriptHi, textEn: sample.transcriptEn };
}

export interface CatalogResult {
  name: string;
  category: ProductCategory;
  material: string;
  craft: string;
  color: string;
  productionTimeDays: number;
  descriptionEn: string;
  descriptionHi: string;
  keywords: string[];
}

export async function generateCatalog(sampleKey: SampleProductKey = "saree"): Promise<CatalogResult> {
  await wait(1500);
  const s = SAMPLE_PRODUCTS[sampleKey];
  return {
    name: s.name,
    category: s.category,
    material: s.material,
    craft: s.craft,
    color: s.color,
    productionTimeDays: s.productionTimeDays,
    descriptionEn: s.descriptionEn,
    descriptionHi: s.descriptionHi,
    keywords: s.keywords,
  };
}

export async function generatePrice(sampleKey: SampleProductKey = "saree"): Promise<PricingRecommendation> {
  await wait(1000);
  return { ...SAMPLE_PRODUCTS[sampleKey].pricing };
}

export function priceIndicator(
  value: number,
  pricing: PricingRecommendation,
): "Too Low" | "Competitive" | "Premium" | "Too High" {
  if (value < pricing.marketMin * 0.9) return "Too Low";
  if (value > pricing.marketMax * 1.15) return "Too High";
  if (value > pricing.recommendedMax) return "Premium";
  return "Competitive";
}

export async function generateBusinessInsight(query: string): Promise<string> {
  await wait(800);
  return getAssistantResponse(query);
}

export async function matchSuppliers(_query: string): Promise<Buyer[]> {
  await wait(1300);
  return SUPPLIER_MATCHES;
}
