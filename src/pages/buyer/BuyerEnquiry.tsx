import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";

const inputClass =
  "w-full rounded-2xl border border-(--color-line) bg-(--color-surface) px-4 py-3 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:border-(--color-green-700) focus:outline-none";

export default function BuyerEnquiry() {
  const navigate = useNavigate();
  const { products, addEnquiry } = useApp();
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("I need a bulk order for my store.");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{ productName: string; artisan: string } | null>(null);

  function submit() {
    const nextErrors: Record<string, string> = {};
    if (!product.trim()) nextErrors.product = "Please enter a product.";
    if (!quantity || Number(quantity) <= 0) nextErrors.quantity = "Enter a quantity greater than 0.";
    if (!targetPrice || Number(targetPrice) <= 0) nextErrors.targetPrice = "Enter a valid target price.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const matched = products.find((p) => p.name.toLowerCase().includes(product.toLowerCase()));
    const artisanName = matched?.artisan ?? "Sita Handicrafts";

    addEnquiry({
      id: `e-${Date.now()}`,
      productId: matched?.id ?? "custom",
      productName: product,
      buyerName: "Delhi Craft Boutique",
      quantity: Number(quantity),
      targetPrice: Number(targetPrice),
      deliveryDate: deliveryDate || new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
      location: location || "New Delhi",
      message,
      status: "sent",
      createdAt: new Date().toISOString(),
    });
    setSubmitted({ productName: product, artisan: artisanName });
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="flex min-h-[80dvh] flex-col items-center justify-center gap-5 px-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-(--color-green-100) text-3xl">✓</span>
          <div>
            <h1 className="font-display text-xl font-bold text-(--color-ink)">Enquiry Sent</h1>
            <p className="mt-2 text-sm text-(--color-ink-faint)">
              Your enquiry has been sent to {submitted.artisan}.
            </p>
          </div>
          <div className="w-full max-w-xs space-y-3">
            <Button full onClick={() => navigate("/buyer/marketplace")}>
              Browse More Products
            </Button>
            <Button variant="outline" full onClick={() => navigate("/buyer")}>
              Back to Home
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header title="B2B Enquiry" subtitle="Request a bulk quote from artisans" showBack backTo="/buyer" />
      <div className="space-y-4 px-4 pb-6">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Product *</span>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. Handwoven Cotton Bag"
            className={inputClass}
          />
          {errors.product && <span className="block text-xs font-medium text-(--color-danger)">{errors.product}</span>}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Quantity *</span>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="500"
              className={inputClass}
            />
            {errors.quantity && <span className="block text-xs font-medium text-(--color-danger)">{errors.quantity}</span>}
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Target Price (₹) *</span>
            <input
              type="number"
              min={1}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="250"
              className={inputClass}
            />
            {errors.targetPrice && <span className="block text-xs font-medium text-(--color-danger)">{errors.targetPrice}</span>}
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Delivery Date</span>
            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className={inputClass} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="New Delhi"
              className={inputClass}
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} min-h-24 resize-none`}
          />
        </label>

        <Button full icon={<Send className="size-4" />} onClick={submit}>
          Submit Enquiry
        </Button>
      </div>
    </AppShell>
  );
}
