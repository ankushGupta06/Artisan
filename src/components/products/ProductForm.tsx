import type { ProductCategory } from "@/types";

export interface ProductFormValues {
  name: string;
  category: ProductCategory | "";
  material: string;
  craft: string;
  color: string;
  productionTimeDays: number | "";
  price: number | "";
  quantity: number | "";
  descriptionEn: string;
  descriptionHi: string;
  keywords: string; // comma separated in the UI
  image: File | null;
}

export const CATEGORIES: ProductCategory[] = [
  "Textiles",
  "Pottery",
  "Bags",
  "Baskets",
  "Handicrafts",
  "Jewellery",
  "Woodcraft",
  "Home Decor",
];

const inputClass =
  "w-full rounded-2xl border border-(--color-line) bg-(--color-surface) px-4 py-3 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:border-(--color-green-700) focus:outline-none focus:ring-2 focus:ring-(--color-green-700)/15";

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">
        {label}
        {required && <span className="text-(--color-terracotta-600)"> *</span>}
      </span>
      {children}
      {error && <span className="block text-xs font-medium text-(--color-danger)">{error}</span>}
    </label>
  );
}

export function ProductForm({
  values,
  onChange,
  errors = {},
  showPriceQuantity = true,
}: {
  values: ProductFormValues;
  onChange: (patch: Partial<ProductFormValues>) => void;
  errors?: Partial<Record<keyof ProductFormValues, string>>;
  showPriceQuantity?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Field label="Product Image">
  <div className="space-y-3">
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      className={inputClass}
      onChange={(e) => {
        const file = e.target.files?.[0] ?? null;
        onChange({ image: file });
      }}
    />

    {values.image && (
      <div className="overflow-hidden rounded-2xl border border-(--color-line)">
        <img
          src={URL.createObjectURL(values.image)}
          alt="Product preview"
          className="h-48 w-full object-cover"
        />
      </div>
    )}
  </div>
</Field>
      <Field label="Product Name" error={errors.name} required>
        <input
          className={inputClass}
          value={values.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Handcrafted Chanderi Silk Saree"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Category" error={errors.category} required>
          <select
            className={inputClass}
            value={values.category}
            onChange={(e) => onChange({ category: e.target.value as ProductCategory })}
          >
            <option value="">Select</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Material">
          <input
            className={inputClass}
            value={values.material}
            onChange={(e) => onChange({ material: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Craft">
          <input className={inputClass} value={values.craft} onChange={(e) => onChange({ craft: e.target.value })} />
        </Field>
        <Field label="Color">
          <input className={inputClass} value={values.color} onChange={(e) => onChange({ color: e.target.value })} />
        </Field>
      </div>

      {showPriceQuantity && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)" error={errors.price} required>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={values.price}
              onChange={(e) => onChange({ price: e.target.value === "" ? "" : Number(e.target.value) })}
            />
          </Field>
          <Field label="Quantity" error={errors.quantity} required>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={values.quantity}
              onChange={(e) => onChange({ quantity: e.target.value === "" ? "" : Number(e.target.value) })}
            />
          </Field>
        </div>
      )}

      <Field label="Production Time (days)">
        <input
          type="number"
          min={0}
          className={inputClass}
          value={values.productionTimeDays}
          onChange={(e) => onChange({ productionTimeDays: e.target.value === "" ? "" : Number(e.target.value) })}
        />
      </Field>

      <Field label="English Description">
        <textarea
          className={`${inputClass} min-h-24 resize-none`}
          value={values.descriptionEn}
          onChange={(e) => onChange({ descriptionEn: e.target.value })}
        />
      </Field>

      <Field label="Hindi Description">
        <textarea
          className={`${inputClass} min-h-24 resize-none`}
          value={values.descriptionHi}
          onChange={(e) => onChange({ descriptionHi: e.target.value })}
        />
      </Field>

      <Field label="Keywords (comma separated)">
        <input
          className={inputClass}
          value={values.keywords}
          onChange={(e) => onChange({ keywords: e.target.value })}
          placeholder="e.g. Chanderi, Silk Saree, Handcrafted"
        />
      </Field>
    </div>
  );
}
