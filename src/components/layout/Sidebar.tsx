import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  PlusCircle,
  PackageSearch,
  Sparkles,
  User,
  Boxes,
  Landmark,
  Settings as SettingsIcon,
  Repeat,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const ARTISAN_ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/add-product", label: "Add Product", icon: PlusCircle },
  { to: "/marketplace", label: "Marketplace", icon: Store },
  { to: "/orders", label: "Orders", icon: PackageSearch },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/schemes", label: "Govt. Support", icon: Landmark },
  { to: "/profile", label: "Profile", icon: User },
];

const BUYER_ITEMS = [
  { to: "/buyer", label: "Home", icon: Home },
  { to: "/buyer/marketplace", label: "Marketplace", icon: Store },
  { to: "/orders", label: "Enquiries", icon: PackageSearch },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const { mode, toggleMode, tr } = useApp();
  const navigate = useNavigate();
  const items = mode === "artisan" ? ARTISAN_ITEMS : BUYER_ITEMS;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 shrink-0 flex-col border-r border-(--color-line)/70 bg-(--color-surface) px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-(--color-green-700)">
          <Sparkles className="size-4.5 text-(--color-cream)" />
        </span>
        <div>
          <p className="font-display text-lg font-bold leading-tight text-(--color-ink)">ArtisanAI</p>
          <p className="text-[11px] font-medium text-(--color-ink-faint)">Demo Mode</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-(--color-green-700) text-(--color-cream)"
                    : "text-(--color-ink-soft) hover:bg-(--color-cream-deep)"
                }`
              }
            >
              <Icon className="size-4.5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-(--color-line)/70 pt-3">
        <button
          onClick={() => {
            toggleMode();
            navigate(mode === "artisan" ? "/buyer" : "/home");
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-(--color-terracotta-700) hover:bg-(--color-terracotta-50)"
        >
          <Repeat className="size-4.5" />
          {mode === "artisan" ? tr("switchToBuyer") : tr("switchToArtisan")}
        </button>
        <NavLink
          to="/settings"
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-(--color-ink-soft) hover:bg-(--color-cream-deep)"
        >
          <SettingsIcon className="size-4.5" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
