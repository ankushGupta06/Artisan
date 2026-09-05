import type { Scheme } from "@/types";

export const SCHEMES: Scheme[] = [
  {
    id: "s1",
    name: "PM Vishwakarma",
    category: "Skill & Toolkit Support",
    summary:
      "A flagship scheme for traditional artisans and craftspeople offering skill training, a toolkit incentive, and access to affordable credit.",
    benefits: [
      "Free skill training with a stipend",
      "₹15,000 toolkit incentive",
      "Collateral-free loans up to ₹3 lakh",
      "Marketing and digital support",
    ],
  },
  {
    id: "s2",
    name: "PMEGP",
    category: "Micro-Enterprise Support",
    summary:
      "Prime Minister's Employment Generation Programme — a credit-linked subsidy for setting up new micro-enterprises in the non-farm sector.",
    benefits: [
      "Subsidy up to 35% of project cost",
      "Bank loan support for new units",
      "Available for manufacturing & service units",
    ],
  },
  {
    id: "s3",
    name: "Mudra Yojana",
    category: "Business Finance",
    summary:
      "Collateral-free micro-financing for small businesses and artisans looking to expand production or working capital.",
    benefits: [
      "Loans up to ₹10 lakh",
      "No collateral required",
      "Shishu, Kishor & Tarun loan tiers",
    ],
  },
  {
    id: "s4",
    name: "ODOP (One District One Product)",
    category: "Market Access",
    summary:
      "Promotes a signature product from each district through branding, marketing, and export facilitation support.",
    benefits: [
      "District-level branding support",
      "Access to export facilitation cells",
      "Priority in government procurement fairs",
    ],
  },
];
