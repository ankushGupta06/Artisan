import type { Insight } from "@/types";

export const INSIGHTS: Insight[] = [
  {
    id: "i1",
    title: "Cotton products are trending",
    detail: "Your cotton products receive 2.3× more views than pottery this month.",
    metric: "2.3×",
    trend: "up",
  },
  {
    id: "i2",
    title: "Enhanced photos win more enquiries",
    detail: "Products with AI-enhanced images receive 31% more enquiries on average.",
    metric: "+31%",
    trend: "up",
  },
  {
    id: "i3",
    title: "Average order value is climbing",
    detail: "Your average order value increased by 14% this month compared to last month.",
    metric: "+14%",
    trend: "up",
  },
  {
    id: "i4",
    title: "Pottery may be underpriced",
    detail: "Similar terracotta pieces nearby are selling for 8% more than your listed price.",
    metric: "-8%",
    trend: "down",
  },
  {
    id: "i5",
    title: "Weekend views are peaking",
    detail: "Most buyers browse your storefront between Friday evening and Sunday afternoon.",
    metric: "62%",
    trend: "neutral",
  },
];

export const REVENUE_TREND = [
  { month: "Apr", revenue: 18200 },
  { month: "May", revenue: 21400 },
  { month: "Jun", revenue: 19800 },
  { month: "Jul", revenue: 26100 },
  { month: "Aug", revenue: 31200 },
  { month: "Sep", revenue: 34500 },
];

export const CATEGORY_PERFORMANCE = [
  { category: "Textiles", views: 612, orders: 14 },
  { category: "Bags", views: 940, orders: 21 },
  { category: "Pottery", views: 388, orders: 6 },
  { category: "Jewellery", views: 512, orders: 9 },
  { category: "Baskets", views: 201, orders: 4 },
  { category: "Woodcraft", views: 168, orders: 2 },
];
