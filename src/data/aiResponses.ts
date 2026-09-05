import type { IllustrationKey, PricingRecommendation, ProductCategory } from "@/types";

// Deterministic "AI" outputs. The prototype must never fail or feel random
// during a live demo (AI Guide §52), so every sample product resolves to a
// fixed, pre-written catalog + price rather than anything generated on the
// fly.

export type SampleProductKey = "saree" | "pottery" | "bag" | "basket";

export interface SampleProduct {
  key: SampleProductKey;
  illustration: IllustrationKey;
  name: string;
  category: ProductCategory;
  material: string;
  craft: string;
  color: string;
  productionTimeDays: number;
  descriptionEn: string;
  descriptionHi: string;
  keywords: string[];
  transcriptHi: string;
  transcriptEn: string;
  pricing: PricingRecommendation;
}

export const SAMPLE_PRODUCTS: Record<SampleProductKey, SampleProduct> = {
  saree: {
    key: "saree",
    illustration: "saree",
    name: "Handcrafted Chanderi Silk Saree",
    category: "Textiles",
    material: "Chanderi Silk",
    craft: "Hand Zari Work",
    color: "Red & Gold",
    productionTimeDays: 7,
    descriptionEn:
      "A beautifully handcrafted Chanderi silk saree featuring intricate hand zari work along the border and pallu. Woven by skilled artisans using techniques passed down for generations, this saree brings timeless elegance to any occasion.",
    descriptionHi:
      "हाथ से तैयार की गई खूबसूरत चंदेरी सिल्क साड़ी, जिसमें किनारे और पल्लू पर बारीक हाथ की जरी का काम किया गया है। पीढ़ियों से चली आ रही कला के साथ कुशल कारीगरों द्वारा बुनी गई।",
    keywords: ["Chanderi", "Silk Saree", "Handcrafted", "Zari", "Indian Textile"],
    transcriptHi:
      "यह चंदेरी सिल्क की साड़ी है। इसमें हाथ से जरी का काम किया गया है और इसे बनाने में लगभग सात दिन लगे हैं।",
    transcriptEn:
      "This is a Chanderi silk saree. It has hand zari work done on it and took about seven days to make.",
    pricing: {
      materialCost: 850,
      laborCost: 700,
      otherCosts: 200,
      marketMin: 1800,
      marketMax: 2300,
      recommended: 2099,
      recommendedMin: 1900,
      recommendedMax: 2300,
    },
  },
  pottery: {
    key: "pottery",
    illustration: "pottery",
    name: "Hand-painted Terracotta Decorative Vase",
    category: "Pottery",
    material: "Terracotta Clay",
    craft: "Hand Painting",
    color: "Earthen Brown",
    productionTimeDays: 4,
    descriptionEn:
      "A hand-painted terracotta decorative vase, shaped on a traditional potter's wheel and finished with folk motifs in natural pigments — a warm, earthy centerpiece for any home.",
    descriptionHi:
      "पारंपरिक चाक पर बनाई गई और प्राकृतिक रंगों से सजाई गई हाथ से पेंट की गई टेराकोटा की सजावटी फूलदान।",
    keywords: ["Terracotta", "Vase", "Hand-painted", "Pottery", "Home Decor"],
    transcriptHi:
      "यह टेराकोटा से बनी फूलदान है। इसे हाथ से पेंट किया गया है और बनाने में लगभग चार दिन लगे हैं।",
    transcriptEn:
      "This is a vase made of terracotta. It's hand-painted and took about four days to make.",
    pricing: {
      materialCost: 280,
      laborCost: 350,
      otherCosts: 120,
      marketMin: 750,
      marketMax: 950,
      recommended: 850,
      recommendedMin: 780,
      recommendedMax: 950,
    },
  },
  bag: {
    key: "bag",
    illustration: "bag",
    name: "Handwoven Cotton Market Bag",
    category: "Bags",
    material: "Pure Cotton",
    craft: "Handloom Weaving",
    color: "Natural Beige",
    productionTimeDays: 2,
    descriptionEn:
      "A sturdy handwoven cotton market bag, perfect for everyday use. Woven on a handloom using durable, breathable cotton yarn with reinforced handles.",
    descriptionHi:
      "रोज़मर्रा के इस्तेमाल के लिए हैंडलूम पर बुना गया मज़बूत सूती बैग, टिकाऊ और आरामदायक सूती धागे से तैयार।",
    keywords: ["Cotton Bag", "Handwoven", "Handloom", "Eco-friendly", "Tote"],
    transcriptHi:
      "यह सूती कपड़े से बना हाथ से बुना हुआ बैग है। इसे बनाने में लगभग दो दिन लगे हैं।",
    transcriptEn: "This is a handwoven cotton bag. It took about two days to make.",
    pricing: {
      materialCost: 90,
      laborCost: 140,
      otherCosts: 40,
      marketMin: 250,
      marketMax: 350,
      recommended: 299,
      recommendedMin: 260,
      recommendedMax: 340,
    },
  },
  basket: {
    key: "basket",
    illustration: "basket",
    name: "Bamboo Storage Basket",
    category: "Baskets",
    material: "Natural Bamboo",
    craft: "Hand Weaving",
    color: "Natural",
    productionTimeDays: 3,
    descriptionEn:
      "A hand-woven bamboo storage basket, sturdy and lightweight — ideal for organizing homes with an earthy, natural finish.",
    descriptionHi:
      "हाथ से बुनी गई बांस की टोकरी, मज़बूत और हल्की — घर को व्यवस्थित रखने के लिए एक प्राकृतिक विकल्प।",
    keywords: ["Bamboo", "Basket", "Storage", "Handwoven", "Eco-friendly"],
    transcriptHi:
      "यह बांस से बनी टोकरी है। इसे हाथ से बुना गया है और बनाने में लगभग तीन दिन लगे हैं।",
    transcriptEn: "This is a basket made of bamboo. It's handwoven and took about three days to make.",
    pricing: {
      materialCost: 220,
      laborCost: 300,
      otherCosts: 80,
      marketMin: 550,
      marketMax: 750,
      recommended: 650,
      recommendedMin: 580,
      recommendedMax: 730,
    },
  },
};

export interface QuickPrompt {
  id: string;
  question: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  { id: "qp1", question: "Which product is performing best?" },
  { id: "qp2", question: "How should I price my products?" },
  { id: "qp3", question: "What should I sell more?" },
  { id: "qp4", question: "Which products need better photos?" },
  { id: "qp5", question: "How are my sales doing?" },
  { id: "qp6", question: "How can I get more buyers?" },
];

const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["performing best", "best product", "best-performing", "best performing"],
    response:
      "Your Handwoven Cotton Bags are currently your best-performing product. They received 38% more views than your other products this month, with 21 active enquiries.",
  },
  {
    keywords: ["price", "pricing", "cost"],
    response:
      "Your Chanderi saree is competitively priced at ₹2,099. Similar products nearby are selling between ₹1,800 and ₹2,300, so you're well positioned. Your pottery collection, though, may be underpriced by about 8%.",
  },
  {
    keywords: ["sell more", "what should i sell", "focus on"],
    response:
      "Cotton bags and Chanderi sarees are your strongest categories right now. Consider adding 2-3 more variants — buyers who view these often browse similar items in the same category.",
  },
  {
    keywords: ["photo", "image", "picture"],
    response:
      "Your Bamboo Storage Basket and Wooden Elephant listings could use the AI Image Studio — enhanced photos get 31% more enquiries on average across your catalog.",
  },
  {
    keywords: ["sales", "revenue", "how am i doing", "how are my"],
    response:
      "Your sales are trending upward — revenue is up 14% this month to ₹34,500 across 16 orders. Bags and textiles are driving most of the growth.",
  },
  {
    keywords: ["buyer", "buyers", "customer", "customers"],
    response:
      "You can reach more buyers by publishing 2-3 new products a month, responding quickly to B2B enquiries, and keeping your photos updated with the AI Image Studio — active sellers appear higher in Marketplace search.",
  },
  {
    keywords: ["order", "orders"],
    response:
      "You have 16 orders this month — 1 pending, 1 processing, 1 shipped, and the rest completed. Order #ORD1024 from Delhi Craft Boutique is currently processing.",
  },
  {
    keywords: ["market", "marketplace", "trend"],
    response:
      "Handwoven textiles and cotton bags are trending across the Marketplace this month, with buyers searching for eco-friendly and handmade tags most often.",
  },
];

export function getAssistantResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.response;
    }
  }
  return "Based on your current business data, I recommend focusing on your top-performing products and improving photos on products with high views but low enquiries.";
}
