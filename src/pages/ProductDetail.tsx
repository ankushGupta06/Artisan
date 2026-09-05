import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, MessageSquareText, Pencil, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { ProductIllustration } from "@/components/common/ProductIllustration";
import { RatingStars } from "@/components/common/RatingStars";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ProductForm, type ProductFormValues } from "@/components/products/ProductForm";
import { useApp } from "@/context/AppContext";
import type { ProductCategory } from "@/types";

function toFormValues(p: NonNullable<ReturnType<typeof useProduct>>): ProductFormValues {
  return {
    name: p.name,
    category: p.category,
    material: p.material,
    craft: p.craft,
    color: p.color ?? "",
    productionTimeDays: p.productionTimeDays ?? "",
    price: p.price,
    quantity: p.quantity,
    descriptionEn: p.descriptionEn,
    descriptionHi: p.descriptionHi,
    keywords: p.keywords.join(", "),
  };
}

function useProduct() {
  const { id } = useParams();
  const { products } = useApp();
  return products.find((p) => p.id === id) ?? null;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const product = useProduct();
  const { updateProduct, deleteProduct, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<ProductFormValues | null>(null);

  const initialForm = useMemo(() => (product ? toFormValues(product) : null), [product]);

  if (!product) {
    return (
      <AppShell>
        <Header title="Product not found" showBack backTo="/products" />
        <div className="px-4 text-sm text-(--color-ink-faint)">This product may have been removed.</div>
      </AppShell>
    );
  }

  const values = form ?? initialForm!;

  function startEdit() {
    setForm(initialForm);
    setEditing(true);
  }

  function saveEdit() {
    if (!values.name.trim() || !values.category || values.price === "" || values.quantity === "") {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    updateProduct(product!.id, {
      name: values.name,
      category: values.category as ProductCategory,
      material: values.material,
      craft: values.craft,
      color: values.color,
      productionTimeDays: Number(values.productionTimeDays) || undefined,
      price: Number(values.price),
      quantity: Number(values.quantity),
      descriptionEn: values.descriptionEn,
      descriptionHi: values.descriptionHi,
      keywords: values.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    });
    setEditing(false);
    showToast("Product updated.");
  }

  return (
    <AppShell>
      <Header
        title={editing ? "Edit Product" : "Product Details"}
        showBack
        backTo="/products"
        rightSlot={
          !editing ? (
            <button
              onClick={startEdit}
              aria-label="Edit"
              className="tap-target flex items-center justify-center rounded-full bg-(--color-surface) text-(--color-ink) shadow-craft"
            >
              <Pencil className="size-4.5" />
            </button>
          ) : undefined
        }
      />

      <div className="space-y-5 px-4 pb-6">
        {editing ? (
          <>
            <ProductForm values={values} onChange={(patch) => setForm({ ...values, ...patch })} />
            <div className="flex gap-3">
              <Button variant="outline" full onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button full icon={<Save className="size-4" />} onClick={saveEdit}>
                Save Changes
              </Button>
            </div>
          </>
        ) : (
          <>
            <ProductIllustration illustration={product.illustration} size="hero" className="card-craft w-full shadow-craft-lg" />

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-(--color-ink)">{product.name}</h2>
                {product.status === "draft" && <Badge tone="neutral">Draft</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display text-2xl font-bold text-(--color-terracotta-700)">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <RatingStars rating={product.rating} count={product.reviewsCount} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="card-craft-alt bg-(--color-surface) p-3 text-center shadow-craft">
                <Eye className="mx-auto size-4 text-(--color-ink-faint)" />
                <p className="mt-1 text-sm font-bold text-(--color-ink)">{product.views}</p>
                <p className="text-[11px] text-(--color-ink-faint)">Views</p>
              </div>
              <div className="card-craft-alt bg-(--color-surface) p-3 text-center shadow-craft">
                <MessageSquareText className="mx-auto size-4 text-(--color-ink-faint)" />
                <p className="mt-1 text-sm font-bold text-(--color-ink)">{product.enquiriesCount}</p>
                <p className="text-[11px] text-(--color-ink-faint)">Enquiries</p>
              </div>
              <div className="card-craft-alt bg-(--color-surface) p-3 text-center shadow-craft">
                <p className="mt-1 text-sm font-bold text-(--color-ink)">{product.quantity}</p>
                <p className="text-[11px] text-(--color-ink-faint)">In Stock</p>
              </div>
            </div>

            <div className="card-craft space-y-3 bg-(--color-surface) p-4 shadow-craft">
              {[
                ["Category", product.category],
                ["Material", product.material],
                ["Craft", product.craft],
                ["Color", product.color || "—"],
                ["Location", product.location],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-(--color-ink-faint)">{label}</span>
                  <span className="font-semibold text-(--color-ink)">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="eyebrow">English Description</p>
              <p className="text-sm leading-relaxed text-(--color-ink-soft)">{product.descriptionEn}</p>
            </div>
            <div className="space-y-2">
              <p className="eyebrow">Hindi Description</p>
              <p className="text-sm leading-relaxed text-(--color-ink-soft)">{product.descriptionHi}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.keywords.map((k) => (
                <Badge key={k} tone="terracotta">
                  {k}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" full icon={<Trash2 className="size-4" />} onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
              <Button full icon={<Pencil className="size-4" />} onClick={startEdit}>
                Edit Product
              </Button>
            </div>
          </>
        )}
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete product?"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" full onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              full
              onClick={() => {
                deleteProduct(product.id);
                showToast("Product deleted.", "info");
                navigate("/products");
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-(--color-ink-soft)">This will remove it from your catalog and the marketplace.</p>
      </Modal>
    </AppShell>
  );
}
