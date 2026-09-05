import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, PlusCircle, SlidersHorizontal, Boxes } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/common/SearchBar";
import { CategoryChip } from "@/components/common/CategoryChip";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { CURRENT_ARTISAN_ID } from "@/data/products";

type SortKey = "recommended" | "price-asc" | "price-desc" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
];

export default function Products() {
  const navigate = useNavigate();
  const { products, deleteProduct, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const myProducts = useMemo(
    () => products.filter((p) => p.artisanId === CURRENT_ARTISAN_ID),
    [products],
  );
  const categories = useMemo(() => ["All", ...new Set(myProducts.map((p) => p.category))], [myProducts]);

  const filtered = useMemo(() => {
    let list = myProducts;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.craft.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "newest") sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return sorted;
  }, [myProducts, category, query, sort]);

  return (
    <AppShell>
      <Header
        title="My Products"
        subtitle={`${myProducts.length} products`}
        rightSlot={
          <button
            onClick={() => setLayout(layout === "grid" ? "list" : "grid")}
            aria-label="Toggle layout"
            className="tap-target flex items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
          >
            {layout === "grid" ? <List className="size-4.5" /> : <LayoutGrid className="size-4.5" />}
          </button>
        }
      />
      <div className="space-y-4 px-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search your products" />

        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <CategoryChip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
          <button
            onClick={() => setSortOpen(true)}
            aria-label="Sort products"
            className="tap-target flex shrink-0 items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        <ProductGrid
          products={filtered}
          layout={layout}
          showOwnerActions
          onSelect={(p) => navigate(`/products/${p.id}`)}
          onEdit={(p) => navigate(`/products/${p.id}`)}
          onDelete={(p) => setPendingDelete(p.id)}
          emptyState={
            myProducts.length === 0 ? (
              <EmptyState
                icon={Boxes}
                title="You haven't added any products yet."
                description="Start by adding your first handcrafted product — AI will help with photos, descriptions, and pricing."
                action={
                  <Button icon={<PlusCircle className="size-4.5" />} onClick={() => navigate("/add-product")}>
                    Add Product
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={Boxes}
                title="No products found"
                description="Try a different search term or category."
              />
            )
          }
        />
      </div>

      <Modal open={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        <div className="space-y-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setSort(s.key);
                setSortOpen(false);
              }}
              className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                sort === s.key ? "bg-(--color-green-100) text-(--color-green-700)" : "text-(--color-ink-soft)"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete product?"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" full onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              full
              onClick={() => {
                if (pendingDelete) {
                  deleteProduct(pendingDelete);
                  showToast("Product deleted.", "info");
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-(--color-ink-soft)">
          This will remove the product from your catalog and the marketplace. This can't be undone during this demo
          session.
        </p>
      </Modal>
    </AppShell>
  );
}
