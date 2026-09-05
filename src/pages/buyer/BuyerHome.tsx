import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { CategoryChip } from "@/components/common/CategoryChip";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/common/Button";
import { LoadingSteps } from "@/components/common/LoadingSteps";
import { useApp } from "@/context/AppContext";
import { matchSuppliers } from "@/services/mockAI";
import type { Buyer } from "@/types";
import { FEATURED_ARTISANS } from "@/data/buyers";

const CATEGORIES = ["Textiles", "Pottery", "Jewellery", "Woodcraft", "Baskets", "Home Decor"];

export default function BuyerHome() {
  const navigate = useNavigate();
  const { products, favorites, toggleFavorite } = useApp();
  const [query, setQuery] = useState("");
  const [b2bQuery, setB2bQuery] = useState("I need 500 handmade cotton bags under ₹250 each.");
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState<Buyer[] | null>(null);

  const recommended = useMemo(
    () => [...products].filter((p) => p.status === "published").sort((a, b) => b.rating - a.rating).slice(0, 4),
    [products],
  );

  async function findSuppliers() {
    setMatching(true);
    setMatches(null);
    const result = await matchSuppliers(b2bQuery);
    setMatches(result);
    setMatching(false);
  }

  return (
    <AppShell>
      <Header title="Find handmade products" subtitle="Directly from artisans across India" />
      <div className="space-y-6 px-4 pb-6">
        <div className="flex items-center gap-2 rounded-full border border-(--color-line) bg-(--color-surface) px-4 py-3 shadow-craft">
          <Search className="size-4.5 text-(--color-ink-faint)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate("/buyer/marketplace")}
            placeholder="Search handmade products"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <CategoryChip key={c} label={c} onClick={() => navigate("/buyer/marketplace")} />
          ))}
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Featured Artisans</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {FEATURED_ARTISANS.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate("/buyer/marketplace")}
                className="card-craft flex w-40 shrink-0 flex-col gap-2 bg-(--color-surface) p-3 text-left shadow-craft"
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-(--color-green-100) font-display text-sm font-bold text-(--color-green-700)">
                    {a.name.charAt(0)}
                  </span>
                  {a.verified && <BadgeCheck className="size-4 text-(--color-info)" />}
                </div>
                <p className="line-clamp-1 text-sm font-semibold text-(--color-ink)">{a.name}</p>
                <p className="text-xs text-(--color-ink-faint)">{a.category} · {a.location}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Recommended Products</p>
            <button onClick={() => navigate("/buyer/marketplace")} className="text-xs font-semibold text-(--color-terracotta-600)">
              See all
            </button>
          </div>
          <ProductGrid
            products={recommended}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelect={(p) => navigate(`/buyer/product/${p.id}`)}
          />
        </div>

        <div className="card-craft space-y-4 bg-(--color-green-700) p-5 text-(--color-cream) shadow-craft-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4.5 text-(--color-gold-100)" />
            <p className="font-display text-lg font-semibold">What are you looking for?</p>
          </div>
          <textarea
            value={b2bQuery}
            onChange={(e) => setB2bQuery(e.target.value)}
            className="min-h-20 w-full resize-none rounded-2xl bg-(--color-cream)/10 p-3 text-sm text-(--color-cream) placeholder:text-(--color-cream)/50 focus:outline-none"
          />
          <Button variant="accent" full onClick={findSuppliers} loading={matching}>
            Find Suppliers
          </Button>

          {matching && (
            <div className="rounded-2xl bg-(--color-cream)/10 p-4">
              <LoadingSteps steps={["Matching your requirement...", "Ranking best suppliers..."]} totalMs={1300} />
            </div>
          )}

          {matches && (
            <div className="space-y-2 pt-1">
              {matches.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => navigate("/buyer/enquiry")}
                  className="flex w-full items-center justify-between rounded-2xl bg-(--color-cream)/10 px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-(--color-cream)/20 text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold">{m.name}</span>
                  </div>
                  <span className="rounded-full bg-(--color-gold-100) px-2.5 py-1 text-xs font-bold text-(--color-gold-600)">
                    {m.matchPercent}% match
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
