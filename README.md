# ArtisanAI — Demo Frontend

A frontend-only, mobile-first prototype for an AI-powered digital commerce
assistant for artisans, weavers, and micro-entrepreneurs. Built to the spec in
[`AI_Guide_ArtisanAI_Demo_Frontend.md`](./AI_Guide_ArtisanAI_Demo_Frontend.md).

Everything is mocked in the browser — there is no backend, no real payment
gateway, and no real ML model. AI behavior lives in `src/services/mockAI.ts`
and is deterministic so a live demo never fails.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`) on a phone
viewport, or resize your browser to ~390px wide — the whole app is designed
mobile-first and stays centered as a phone-width column on larger screens.

`npm run build` produces a static `dist/` you can serve from any static host
(routing uses `HashRouter`, so no server rewrite rules are required).

## Demo flow

Login (any phone + any 4–6 digit code) → Home → Add Product → pick a sample
(e.g. Chanderi Saree) → AI Image Studio (before/after) → describe by voice →
AI Catalog → AI Pricing → Preview → Publish → Marketplace → switch to Buyer
Mode → search → send a B2B enquiry → switch back → check Notifications → ask
the AI Business Assistant "Which product is performing best?".

If a demo run leaves messy state, use **Settings → Reset Demo Data** to
restore the original sample data.

## Design system

- **Palette**: warm cream background, deep earthy green as primary, terracotta
  as accent, a touch of turmeric gold — see the `@theme` tokens in
  `src/styles/index.css`. Dark mode is a full token swap, toggled from
  Settings.
- **Signature shapes**: cards use a deliberately asymmetric corner radius
  (`.card-craft`) and a hand-stitched dashed divider style, rather than
  uniform rounded rectangles — a nod to handmade craft rather than a generic
  SaaS dashboard.
- **Product imagery**: every product renders through
  `components/common/ProductIllustration.tsx`, a small system of tinted,
  line-art illustrations per craft category. This avoids stock photography
  entirely and keeps the catalog visually consistent regardless of what a
  user "photographs" in the demo.
- **Navigation**: a floating pill-shaped bottom nav with a raised center
  "Add" action on mobile; a left sidebar on tablet/desktop. Content always
  stays a centered, phone-width column rather than stretching edge-to-edge.

## Project structure

```
src/
  components/   layout, common, products, ai, orders, notifications
  pages/        one file per route (see AI Guide §6/§55)
  context/      AppContext.tsx — global state + localStorage persistence
  services/     mockAI.ts — the "AI" layer, swappable for a real API later
  data/         centralized mock data + translations
  types/        shared TypeScript types
```

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Lucide icons ·
Recharts (lazy-loaded, only for the Insights tab).
