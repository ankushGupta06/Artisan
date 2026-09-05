import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Pencil, Plus, Rocket, Save } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { ProductIllustration } from "@/components/common/ProductIllustration";
import { useApp } from "@/context/AppContext";
import type { Product, ProductCategory } from "@/types";

export default function Preview() {
  const navigate = useNavigate();
  const { draft, user, addProduct, updateDraft, showToast } = useApp();
  const [quantity, setQuantity] = useState(5);
  const [published, setPublished] = useState<Product | null>(null);

  const illustration = draft.illustration ?? draft.originalIllustration ?? "home-decor";
  const price = draft.selectedPrice ?? draft.pricing?.recommended ?? 0;
  const isComplete = Boolean(draft.name && draft.category && price > 0);

  function buildProduct(status: "draft" | "published"): Product {
    return {
      id: `p-${Date.now()}`,
      name: draft.name || "Untitled product",
      category: (draft.category as ProductCategory) || "Handicrafts",
      price,
      material: draft.material || "—",
      craft: draft.craft || "—",
      color: draft.color,
      productionTimeDays: draft.productionTimeDays,
      artisanId: user.id,
      artisan: user.businessName,
      location: user.location,
      rating: 4.8,
      reviewsCount: 0,
      quantity,
      illustration,
      descriptionEn: draft.descriptionEn || "",
      descriptionHi: draft.descriptionHi || "",
      keywords: draft.keywords ?? [],
      status,
      views: 0,
      enquiriesCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  function saveDraft() {
    const product = buildProduct("draft");
    addProduct(product);
    showToast("Saved as draft.");
    navigate("/products");
  }

  function publish() {
    if (!isComplete) {
      showToast("Please complete the product details before publishing.", "error");
      return;
    }
    const product = buildProduct("published");
    addProduct(product);
    updateDraft({});
    setPublished(product);
  }

  if (published) {
    return (
      <AppShell>
        <div className="flex min-h-[85dvh] flex-col items-center justify-center gap-6 px-6 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-(--color-green-100) text-4xl">🎉</span>
          <div>
            <h1 className="font-display text-2xl font-bold text-(--color-ink)">Product Published!</h1>
            <p className="mt-2 text-sm text-(--color-ink-faint)">Your product is now visible to buyers.</p>
          </div>
          <div className="w-full max-w-xs space-y-3">
            <Button full onClick={() => navigate(`/products/${published.id}`)}>
              View Product
            </Button>
            <Button variant="accent" full onClick={() => navigate("/marketplace")}>
              View Marketplace
            </Button>
            <Button
              variant="outline"
              full
              onClick={() => {
                setPublished(null);
                navigate("/add-product");
              }}
            >
              Add Another Product
            </Button>
            <Button variant="ghost" full onClick={() => navigate("/home")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header
        title="Preview"
        subtitle="Exactly what buyers will see"
        showBack
        backTo="/add-product/pricing"
        rightSlot={
          <button
            onClick={() => navigate("/add-product/catalog")}
            aria-label="Edit"
            className="tap-target flex items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
          >
            <Pencil className="size-4.5" />
          </button>
        }
      />
      <div className="space-y-5 px-4 pb-6">
        <ProductIllustration illustration={illustration} size="hero" className="card-craft w-full shadow-craft-lg" />

        <div className="space-y-1.5">
          <h2 className="font-display text-xl font-bold text-(--color-ink)">{draft.name || "Untitled product"}</h2>
          <p className="font-display text-2xl font-bold text-(--color-terracotta-700)">₹{price.toLocaleString("en-IN")}</p>
        </div>

        <div className="card-craft grid grid-cols-2 gap-x-4 gap-y-3 bg-(--color-surface) p-4 text-sm shadow-craft">
          <div><p className="text-(--color-ink-faint)">Category</p><p className="font-semibold text-(--color-ink)">{draft.category || "—"}</p></div>
          <div><p className="text-(--color-ink-faint)">Material</p><p className="font-semibold text-(--color-ink)">{draft.material || "—"}</p></div>
          <div><p className="text-(--color-ink-faint)">Craft</p><p className="font-semibold text-(--color-ink)">{draft.craft || "—"}</p></div>
          <div><p className="text-(--color-ink-faint)">Artisan</p><p className="font-semibold text-(--color-ink)">{user.businessName}</p></div>
          <div><p className="text-(--color-ink-faint)">Location</p><p className="font-semibold text-(--color-ink)">{user.location}</p></div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-(--color-surface) px-4 py-3 shadow-craft">
          <span className="text-sm font-semibold text-(--color-ink)">Available Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="tap-target flex size-8 items-center justify-center rounded-full bg-(--color-cream-deep) text-(--color-ink)"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-(--color-ink)">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="tap-target flex size-8 items-center justify-center rounded-full bg-(--color-cream-deep) text-(--color-ink)"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="eyebrow">English Description</p>
          <p className="text-sm leading-relaxed text-(--color-ink-soft)">{draft.descriptionEn || "—"}</p>
        </div>
        <div className="space-y-2">
          <p className="eyebrow">Hindi Description</p>
          <p className="text-sm leading-relaxed text-(--color-ink-soft)">{draft.descriptionHi || "—"}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(draft.keywords ?? []).map((k) => (
            <Badge key={k} tone="terracotta">
              {k}
            </Badge>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" full icon={<Pencil className="size-4" />} onClick={() => navigate("/add-product/catalog")}>
              Edit
            </Button>
            <Button variant="ghost" full icon={<Save className="size-4" />} onClick={saveDraft}>
              Save Draft
            </Button>
          </div>
          <Button full variant="accent" icon={<Rocket className="size-4.5" />} onClick={publish}>
            Publish Product
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
