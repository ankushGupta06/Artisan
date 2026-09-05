import { Heart, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProductIllustration } from "@/components/common/ProductIllustration";
import { RatingStars } from "@/components/common/RatingStars";
import type { Product } from "@/types";

export function ProductCard({
  product,
  layout = "grid",
  favorite,
  onToggleFavorite,
  onClick,
  onEdit,
  onDelete,
  showOwnerActions,
}: {
  product: Product;
  layout?: "grid" | "list";
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showOwnerActions?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (layout === "list") {
    return (
      <div className="card-craft flex gap-3 bg-(--color-surface) p-3 shadow-craft">
        <button onClick={onClick} className="shrink-0">
          <ProductIllustration illustration={product.illustration} size="sm" className="size-24 rounded-2xl" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <button onClick={onClick} className="text-left">
            <p className="line-clamp-1 text-sm font-semibold text-(--color-ink)">{product.name}</p>
            <p className="mt-0.5 text-xs text-(--color-ink-faint)">{product.category}</p>
          </button>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-lg font-bold text-(--color-terracotta-700)">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <RatingStars rating={product.rating} />
            </div>
            <div className="flex items-center gap-1">
              {showOwnerActions ? (
                <>
                  <button
                    onClick={onEdit}
                    aria-label="Edit product"
                    className="tap-target flex items-center justify-center rounded-full text-(--color-ink-faint) hover:bg-(--color-cream-deep)"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={onDelete}
                    aria-label="Delete product"
                    className="tap-target flex items-center justify-center rounded-full text-(--color-danger) hover:bg-(--color-danger-100)"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onToggleFavorite}
                  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={favorite}
                  className="tap-target flex items-center justify-center rounded-full hover:bg-(--color-cream-deep)"
                >
                  <Heart
                    className={`size-4.5 transition-colors ${favorite ? "fill-(--color-terracotta-500) text-(--color-terracotta-500)" : "text-(--color-ink-faint)"}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-craft group relative flex flex-col overflow-hidden bg-(--color-surface) shadow-craft transition-transform">
      <button onClick={onClick} className="relative block w-full text-left">
        <ProductIllustration illustration={product.illustration} size="lg" className="w-full" />
        {product.status === "draft" && (
          <span className="absolute left-2 top-2 rounded-full bg-(--color-ink)/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Draft
          </span>
        )}
      </button>

      {showOwnerActions ? (
        <div className="absolute right-2 top-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Product actions"
            className="tap-target flex items-center justify-center rounded-full bg-(--color-surface)/90 text-(--color-ink) shadow-craft"
          >
            <MoreVertical className="size-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-10 w-32 overflow-hidden rounded-xl bg-(--color-surface) py-1 shadow-craft-lg">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-(--color-ink) hover:bg-(--color-cream-deep)"
              >
                <Pencil className="size-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-(--color-danger) hover:bg-(--color-danger-100)"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={onToggleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          className="tap-target absolute right-2 top-2 flex items-center justify-center rounded-full bg-(--color-surface)/90 shadow-craft"
        >
          <Heart
            className={`size-4.5 transition-colors ${favorite ? "fill-(--color-terracotta-500) text-(--color-terracotta-500)" : "text-(--color-ink-faint)"}`}
          />
        </button>
      )}

      <button onClick={onClick} className="flex flex-1 flex-col gap-1.5 p-3 text-left">
        <p className="line-clamp-1 text-sm font-semibold text-(--color-ink)">{product.name}</p>
        <div className="flex items-center gap-1 text-xs text-(--color-ink-faint)">
          <MapPin className="size-3" />
          <span className="line-clamp-1">{product.artisan}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <p className="font-display text-base font-bold text-(--color-terracotta-700)">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <RatingStars rating={product.rating} />
        </div>
      </button>
    </div>
  );
}
