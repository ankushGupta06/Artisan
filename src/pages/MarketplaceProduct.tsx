import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Send,
  Share2,
  ShoppingBag,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { ProductIllustration } from "@/components/common/ProductIllustration";
import { RatingStars } from "@/components/common/RatingStars";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ProductCard } from "@/components/products/ProductCard";
import { useApp } from "@/context/AppContext";

export default function MarketplaceProduct({ buyerMode = false }: { buyerMode?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, favorites, toggleFavorite, addEnquiry, showToast } = useApp();
  const [chatOpen, setChatOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [enquiryQty, setEnquiryQty] = useState(10);

  const product = products.find((p) => p.id === id);
  const related = useMemo(
    () => (product ? products.filter((p) => p.id !== product.id && p.category === product.category && p.status === "published").slice(0, 4) : []),
    [products, product],
  );

  if (!product) {
    return (
      <AppShell>
        <Header title="Product not found" showBack />
        <div className="px-4 text-sm text-(--color-ink-faint)">This product may have been removed.</div>
      </AppShell>
    );
  }

  const isFav = favorites.includes(product.id);

  async function handleShare() {
    const shareData = { title: product!.name, text: `Check out ${product!.name} on ArtisanAI`, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        /* clipboard unavailable */
      }
      showToast("Link copied.");
    }
  }

  function submitEnquiry() {
    addEnquiry({
      id: `e-${Date.now()}`,
      productId: product!.id,
      productName: product!.name,
      buyerName: "Delhi Craft Boutique",
      quantity: enquiryQty,
      targetPrice: product!.price,
      deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      location: "New Delhi",
      message: `Interested in ${enquiryQty} units of ${product!.name}.`,
      status: "sent",
      createdAt: new Date().toISOString(),
    });
    setEnquiryOpen(false);
    showToast(`Your enquiry has been sent to ${product!.artisan}.`);
  }

  return (
    <AppShell>
      <Header title="Product" showBack backTo={buyerMode ? "/buyer/marketplace" : "/marketplace"} />
      <div className="space-y-5 px-4 pb-6">
        <ProductIllustration illustration={product.illustration} size="hero" className="card-craft w-full shadow-craft-lg" showLabel />

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-xl font-bold text-(--color-ink)">{product.name}</h1>
            <button
              onClick={() => {
                toggleFavorite(product.id);
                showToast(isFav ? "Removed from favorites." : "Added to favorites.");
              }}
              aria-label="Save product"
              className="tap-target flex shrink-0 items-center justify-center rounded-full bg-(--color-surface) shadow-craft"
            >
              <Heart className={`size-4.5 ${isFav ? "fill-(--color-terracotta-500) text-(--color-terracotta-500)" : "text-(--color-ink-faint)"}`} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-display text-2xl font-bold text-(--color-terracotta-700)">₹{product.price.toLocaleString("en-IN")}</p>
            <RatingStars rating={product.rating} count={product.reviewsCount} />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-(--color-ink-faint)">
            <MapPin className="size-3.5" />
            <span>
              {product.artisan} · {product.location}
            </span>
          </div>
        </div>

        <div className="card-craft grid grid-cols-2 gap-x-4 gap-y-3 bg-(--color-surface) p-4 text-sm shadow-craft">
          <div><p className="text-(--color-ink-faint)">Material</p><p className="font-semibold text-(--color-ink)">{product.material}</p></div>
          <div><p className="text-(--color-ink-faint)">Craft</p><p className="font-semibold text-(--color-ink)">{product.craft}</p></div>
          <div className="flex items-center gap-1.5">
            <Package className="size-3.5 text-(--color-ink-faint)" />
            <p className="font-semibold text-(--color-ink)">{product.quantity} in stock</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="eyebrow">Description</p>
          <p className="text-sm leading-relaxed text-(--color-ink-soft)">{product.descriptionEn}</p>
          <p className="text-sm leading-relaxed text-(--color-ink-soft)">{product.descriptionHi}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.keywords.map((k) => (
            <Badge key={k} tone="terracotta">
              {k}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" full icon={<Send className="size-4" />} onClick={() => setEnquiryOpen(true)}>
            Add to Enquiry
          </Button>
          <Button variant="outline" full icon={<MessageCircle className="size-4" />} onClick={() => setChatOpen(true)}>
            Contact Artisan
          </Button>
          <Button variant="ghost" full icon={<Share2 className="size-4" />} onClick={handleShare}>
            Share
          </Button>
          <Button full icon={<ShoppingBag className="size-4" />} onClick={() => setBuyOpen(true)}>
            Buy Now
          </Button>
        </div>

        {related.length > 0 && (
          <div className="space-y-3">
            <p className="eyebrow">Related Products</p>
            <div className="grid grid-cols-2 gap-3">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  favorite={favorites.includes(p.id)}
                  onToggleFavorite={() => toggleFavorite(p.id)}
                  onClick={() => navigate(buyerMode ? `/buyer/product/${p.id}` : `/marketplace/${p.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={chatOpen} onClose={() => setChatOpen(false)} title={`Chat with ${product.artisan}`}>
        <div className="space-y-3">
          <div className="max-h-52 space-y-2 overflow-y-auto rounded-2xl bg-(--color-cream-deep) p-3">
            <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-(--color-surface) px-3 py-2 text-sm text-(--color-ink) shadow-craft">
              Namaste! Thank you for your interest in {product.name}. How can I help?
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full rounded-full border border-(--color-line) px-4 py-2.5 text-sm focus:border-(--color-green-700) focus:outline-none"
            />
            <Button
              size="sm"
              icon={<Send className="size-3.5" />}
              onClick={() => {
                setChatMessage("");
                setChatOpen(false);
                showToast(`Message sent to ${product.artisan}.`);
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} title="Add to Enquiry">
        <div className="space-y-4">
          <p className="text-sm text-(--color-ink-soft)">How many units are you interested in?</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setEnquiryQty((q) => Math.max(1, q - 5))}
              className="tap-target flex size-10 items-center justify-center rounded-full bg-(--color-cream-deep) font-bold"
            >
              −
            </button>
            <span className="font-display text-2xl font-bold text-(--color-ink)">{enquiryQty}</span>
            <button
              onClick={() => setEnquiryQty((q) => q + 5)}
              className="tap-target flex size-10 items-center justify-center rounded-full bg-(--color-cream-deep) font-bold"
            >
              +
            </button>
          </div>
          <Button full onClick={submitEnquiry}>
            Send Enquiry
          </Button>
        </div>
      </Modal>

      <Modal
        open={buyOpen}
        onClose={() => {
          setBuyOpen(false);
          setOrderPlaced(false);
        }}
        title={orderPlaced ? "Order Confirmed" : "Confirm Order"}
      >
        {orderPlaced ? (
          <div className="space-y-4 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-(--color-green-100) text-2xl">✓</span>
            <p className="text-sm text-(--color-ink-soft)">
              Your order for {product.name} has been placed. The artisan will confirm shortly.
            </p>
            <Button
              full
              onClick={() => {
                setBuyOpen(false);
                setOrderPlaced(false);
                navigate("/orders");
              }}
            >
              View Orders
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-(--color-ink-faint)">Product</span>
              <span className="font-semibold text-(--color-ink)">{product.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-(--color-ink-faint)">Price</span>
              <span className="font-semibold text-(--color-ink)">₹{product.price.toLocaleString("en-IN")}</span>
            </div>
            <p className="rounded-xl bg-(--color-cream-deep) p-3 text-xs text-(--color-ink-faint)">
              This is a prototype — no real payment will be processed.
            </p>
            <Button full icon={<ShoppingBag className="size-4" />} onClick={() => setOrderPlaced(true)}>
              Place Order
            </Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
