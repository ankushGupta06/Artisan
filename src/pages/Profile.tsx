import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeIndianRupee,
  Boxes,
  ChevronRight,
  Gift,
  GraduationCap,
  HelpCircle,
  Landmark,
  LineChart,
  LogOut,
  Megaphone,
  Pencil,
  Repeat,
  Settings as SettingsIcon,
  Share2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";

function Row({ icon: Icon, label, onClick, tone }: { icon: LucideIcon; label: string; onClick: () => void; tone?: "danger" }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl bg-(--color-surface) px-4 py-3.5 text-left shadow-craft transition-transform active:scale-[0.99] ${
        tone === "danger" ? "text-(--color-danger)" : "text-(--color-ink)"
      }`}
    >
      <span
        className={`flex size-9 items-center justify-center rounded-full ${
          tone === "danger" ? "bg-(--color-danger-100)" : "bg-(--color-green-50) text-(--color-green-700)"
        }`}
      >
        <Icon className="size-4.5" />
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {tone !== "danger" && <ChevronRight className="size-4 text-(--color-ink-faint)" />}
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, buyerProfile, mode, toggleMode, logout, showToast, tr } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);

  const profile = mode === "buyer" ? buyerProfile : user;

  return (
    <AppShell>
      <Header title="Profile" />
      <div className="space-y-5 px-4 pb-6">
        <div className="card-craft flex items-center gap-4 bg-(--color-green-700) p-5 text-(--color-cream) shadow-craft-lg">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-(--color-cream)/15 font-display text-2xl font-bold">
            {profile.avatarInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold">{profile.name}</p>
            <p className="text-sm text-(--color-cream)/80">{profile.location}</p>
            <p className="text-xs text-(--color-cream)/65">{profile.role}</p>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            aria-label="Edit profile"
            className="tap-target flex items-center justify-center rounded-full bg-(--color-cream)/15"
          >
            <Pencil className="size-4" />
          </button>
        </div>

        {mode === "artisan" && (
          <>
            <div className="card-craft bg-(--color-surface) p-4 shadow-craft">
              <p className="text-sm font-semibold text-(--color-ink)">{user.businessName}</p>
              <div className="mt-3 grid grid-cols-2 divide-x divide-(--color-line)/70">
                <div className="pr-3">
                  <p className="font-display text-xl font-bold text-(--color-ink)">{user.productsCount}</p>
                  <p className="text-xs text-(--color-ink-faint)">Products</p>
                </div>
                <div className="pl-3">
                  <p className="font-display text-xl font-bold text-(--color-ink)">₹{user.totalSales.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-(--color-ink-faint)">Total Sales</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="eyebrow">Account</p>
              <div className="space-y-2">
                <Row icon={Boxes} label="My Products" onClick={() => navigate("/products")} />
                <Row icon={Landmark} label={tr("schemes")} onClick={() => navigate("/schemes")} />
                <Row icon={SettingsIcon} label="Settings" onClick={() => navigate("/settings")} />
                <Row icon={HelpCircle} label="Help & Support" onClick={() => setHelpOpen(true)} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="eyebrow">More Tools</p>
              <div className="space-y-2">
                <Row icon={GraduationCap} label="Training & Learning" onClick={() => setComingSoon("Training & Learning")} />
                <Row icon={Wallet} label="Finance" onClick={() => setComingSoon("Finance")} />
                <Row icon={LineChart} label="Analytics" onClick={() => setComingSoon("Analytics")} />
                <Row icon={BadgeIndianRupee} label="Export Catalog" onClick={() => setComingSoon("Export Catalog")} />
                <Row icon={Share2} label="Share Store" onClick={() => setComingSoon("Share Store")} />
                <Row icon={Megaphone} label="Marketplace Trends" onClick={() => setComingSoon("Marketplace Trends")} />
                <Row icon={Gift} label="Referral" onClick={() => setComingSoon("Referral")} />
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <p className="eyebrow">Language</p>
          <LanguageSelector />
        </div>

        <div className="space-y-2">
          <p className="eyebrow">Privacy</p>
          <div className="flex items-start gap-3 rounded-2xl bg-(--color-green-50) p-4">
            <ShieldCheck className="size-5 shrink-0 text-(--color-green-700)" />
            <div>
              <p className="text-sm font-semibold text-(--color-green-700)">Your data belongs to you.</p>
              <p className="mt-1 text-xs leading-relaxed text-(--color-green-700)/80">
                You can view, export, or delete your demo data any time from Settings.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Row
            icon={Repeat}
            label={mode === "artisan" ? tr("switchToBuyer") : tr("switchToArtisan")}
            onClick={() => {
              toggleMode();
              navigate(mode === "artisan" ? "/buyer" : "/home");
            }}
          />
          <Row
            icon={LogOut}
            label={tr("logout")}
            tone="danger"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          />
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-(--color-line) px-4 py-3 text-sm focus:border-(--color-green-700) focus:outline-none"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-(--color-line) px-4 py-3 text-sm focus:border-(--color-green-700) focus:outline-none"
            />
          </label>
          <Button
            full
            onClick={() => {
              setEditOpen(false);
              showToast("Profile updated.");
            }}
          >
            Save Changes
          </Button>
        </div>
      </Modal>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help & Support">
        <div className="space-y-3 text-sm text-(--color-ink-soft)">
          <p>Need help using ArtisanAI? Here are quick answers:</p>
          <p><strong className="text-(--color-ink)">How do I add a product?</strong> Tap "Add Product" from Home and let AI guide you.</p>
          <p><strong className="text-(--color-ink)">How is my price decided?</strong> Our AI compares material cost, labor, and similar listings.</p>
          <p><strong className="text-(--color-ink)">Need more help?</strong> Contact support at help@artisanai.demo</p>
        </div>
        <Button full className="mt-4" onClick={() => setHelpOpen(false)}>
          Got it
        </Button>
      </Modal>

      <Modal open={!!comingSoon} onClose={() => setComingSoon(null)} title={comingSoon ?? ""}>
        <p className="text-sm text-(--color-ink-soft)">
          {comingSoon} is coming soon to ArtisanAI. We're building this feature to help you grow your craft business
          even further.
        </p>
        <Button full className="mt-4" onClick={() => setComingSoon(null)}>
          Got it
        </Button>
      </Modal>
    </AppShell>
  );
}
