import type { User } from "@/types";

export const CURRENT_USER: User = {
  id: "sita",
  name: "Sita Sharma",
  businessName: "Sita Handicrafts",
  location: "Madhya Pradesh",
  role: "Textile Artisan",
  productsCount: 12,
  totalSales: 124500,
  phone: "+91 98XXX XXX12",
  avatarInitial: "S",
};

export const BUYER_USER: User = {
  id: "buyer-1",
  name: "Arjun Mehta",
  businessName: "Delhi Craft Boutique",
  location: "New Delhi",
  role: "B2B Buyer",
  productsCount: 0,
  totalSales: 0,
  phone: "+91 99XXX XXX45",
  avatarInitial: "A",
};
