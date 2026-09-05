import type { Buyer } from "@/types";

export const SUPPLIER_MATCHES: Buyer[] = [
  { id: "b1", name: "Maa Handicrafts", location: "Rajasthan", matchPercent: 94, category: "Bags & Textiles", verified: true },
  { id: "b2", name: "Sita Crafts", location: "Uttar Pradesh", matchPercent: 91, category: "Woodcraft & Bags", verified: true },
  { id: "b3", name: "Rural Artisans Co.", location: "Chhattisgarh", matchPercent: 87, category: "Handicrafts", verified: false },
];

export const FEATURED_ARTISANS: Buyer[] = [
  { id: "sita", name: "Sita Handicrafts", location: "Madhya Pradesh", matchPercent: 98, category: "Textiles", verified: true },
  { id: "maa-handicrafts", name: "Maa Handicrafts", location: "Rajasthan", matchPercent: 94, category: "Jewellery", verified: true },
  { id: "rural-artisans-co", name: "Rural Artisans Co.", location: "Chhattisgarh", matchPercent: 87, category: "Handicrafts", verified: false },
  { id: "sita-crafts", name: "Sita Crafts", location: "Uttar Pradesh", matchPercent: 91, category: "Woodcraft", verified: true },
];
