// Central type definitions for the ArtisanAI prototype.
// Kept here (rather than inline in components) so the mock layer can later
// be swapped for real API responses without touching the UI.

export type Language = "en" | "hi";

export type IllustrationKey =
  | "saree"
  | "pottery"
  | "bag"
  | "basket"
  | "brass"
  | "jewellery"
  | "woodcraft"
  | "home-decor";

export type ProductCategory =
  | "Textiles"
  | "Pottery"
  | "Bags"
  | "Baskets"
  | "Handicrafts"
  | "Jewellery"
  | "Woodcraft"
  | "Home Decor";

export type ProductStatus = "draft" | "published";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  material: string;
  craft: string;
  color?: string;
  productionTimeDays?: number;
  artisanId: string;
  artisan: string;
  location: string;
  rating: number;
  reviewsCount: number;
  quantity: number;
  image?: string;
  avatar?: string;
  illustration: IllustrationKey;
  descriptionEn: string;
  descriptionHi: string;
  keywords: string[];
  status: ProductStatus;
  views: number;
  enquiriesCount: number;
  createdAt: string; // ISO date
}

export type ProductDraft = Partial<Product> & {
  sampleKey?: "saree" | "pottery" | "bag" | "basket";
  originalIllustration?: IllustrationKey;
  imageEnhanced?: boolean;
  enhancements?: {
    background: boolean;
    lighting: boolean;
    shadow: boolean;
  };
  transcriptEn?: string;
  transcriptHi?: string;
  voiceLanguage?: Language | "mr" | "gu" | "ta";
  pricing?: PricingRecommendation;
  selectedPrice?: number;
};

export interface PricingRecommendation {
  materialCost: number;
  laborCost: number;
  otherCosts: number;
  marketMin: number;
  marketMax: number;
  recommended: number;
  recommendedMin: number;
  recommendedMax: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "completed";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  buyer: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string; // ISO date
  location?: string;
}

export interface User {
  id: string;
  name: string;
  businessName: string;
  location: string;
  role: string;
  productsCount: number;
  totalSales: number;
  phone?: string;
  avatarInitial: string;
}

export type NotificationType =
  | "enquiry"
  | "published"
  | "pricing"
  | "order"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string; // ISO date
  read: boolean;
  link?: string;
}

export interface Enquiry {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  quantity: number;
  targetPrice: number;
  deliveryDate: string;
  location: string;
  message: string;
  status: "sent" | "responded" | "closed";
  createdAt: string;
}

export interface Scheme {
  id: string;
  name: string;
  summary: string;
  benefits: string[];
  category: string;
}

export interface Insight {
  id: string;
  title: string;
  detail: string;
  metric?: string;
  trend?: "up" | "down" | "neutral";
}

export interface Buyer {
  id: string;
  name: string;
  location: string;
  matchPercent: number;
  category: string;
  verified: boolean;
}

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  dataSaver: boolean;
  offlineMode: boolean;
  sound: boolean;
}

export type AppMode = "artisan" | "buyer";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}
