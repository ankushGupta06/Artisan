import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Store } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/common/SearchBar";
import { CategoryChip } from "@/components/common/CategoryChip";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { FilterSheet } from "@/components/common/FilterSheet";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/types";

type SortKey = "recommended" | "price-asc" | "price-desc" | "newest";

const CATEGORIES = ["All", "Textiles", "Pottery", "Jewellery", "Woodcraft", "Baskets", "Home Decor", "Bags", "Handicrafts"];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "price-asc", label: "Price Low to High" },
  { key: "price-desc", label: "Price High to Low" },
  { key: "newest", label: "Newest" },
];

export default function Marketplace({ buyerMode = false }: { buyerMode?: boolean }) {
  const navigate = useNavigate();
  const { products, favorites, toggleFavorite, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [location, setLocation] = useState("All");

  const published = useMemo(() => products.filter((p) => p.status === "published"), [products]);
  const locations = useMemo(() => ["All", ...new Set(published.map((p) => p.location))], [published]);

  const filtered = useMemo(() => {
    let list = published;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (location !== "All") list = list.filter((p) => p.location === location);
    list = list.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.craft.toLowerCase().includes(q) ||
          p.artisan.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "newest") sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return sorted;
  }, [published, category, location, maxPrice, minRating, query, sort]);

  function resetFilters() {
    setMaxPrice(2500);
    setMinRating(0);
    setLocation("All");
  }

  function openProduct(p: Product) {
    navigate(buyerMode ? `/buyer/product/${p.id}` : `/marketplace/${p.id}`);
  }

  return (
    <AppShell>
      <Header title="Discover handmade products" subtitle="From artisans across India" />
      <div className="space-y-4 px-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search products, artisans, materials..." />

        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <CategoryChip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            aria-label="Filters"
            className="tap-target flex shrink-0 items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        <p className="text-xs font-medium text-(--color-ink-faint)">{filtered.length} products found</p>

        <ProductGrid
          products={filtered}
          favorites={favorites}
          onToggleFavorite={(id) => {
            toggleFavorite(id);
            showToast(favorites.includes(id) ? "Removed from favorites." : "Added to favorites.");
          }}
          onSelect={openProduct}
          emptyState={
            <EmptyState icon={Store} title="No products found" description="Try adjusting your search or filters." />
          }
        />
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} onReset={resetFilters} onApply={() => setFilterOpen(false)}>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-(--color-ink)">Max Price: ₹{maxPrice.toLocaleString("en-IN")}</p>
          <input
            type="range"
            min={200}
            max={2500}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-(--color-green-700)"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-(--color-ink)">Minimum Rating</p>
          <div className="flex gap-2">
            {[0, 4, 4.5, 4.8].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  minRating === r ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)" : "border-(--color-line) text-(--color-ink-soft)"
                }`}
              >
                {r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-(--color-ink)">Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-2xl border border-(--color-line) bg-(--color-surface) px-4 py-3 text-sm text-(--color-ink)"
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-(--color-ink)">Sort By</p>
          <div className="flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  sort === s.key ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)" : "border-(--color-line) text-(--color-ink-soft)"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSheet>
    </AppShell>
  );
}
