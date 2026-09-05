import type { ReactNode } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

export function ProductGrid({
  products,
  layout = "grid",
  favorites,
  onToggleFavorite,
  onSelect,
  onEdit,
  onDelete,
  showOwnerActions,
  emptyState,
}: {
  products: Product[];
  layout?: "grid" | "list";
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  onSelect: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showOwnerActions?: boolean;
  emptyState?: ReactNode;
}) {
  if (products.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div className={layout === "grid" ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" : "flex flex-col gap-3"}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout={layout}
          favorite={favorites?.includes(product.id)}
          onToggleFavorite={() => onToggleFavorite?.(product.id)}
          onClick={() => onSelect(product)}
          onEdit={() => onEdit?.(product)}
          onDelete={() => onDelete?.(product)}
          showOwnerActions={showOwnerActions}
        />
      ))}
    </div>
  );
}
