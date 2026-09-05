import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, Plus, Sparkles, Store, PackageSearch, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

const ARTISAN_ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/add-product", label: "Add", icon: Plus, isFab: true },
  { to: "/orders", label: "Orders", icon: PackageSearch },
  { to: "/assistant", label: "AI", icon: Sparkles },
] as const;

const BUYER_ITEMS = [
  { to: "/buyer", label: "Home", icon: Home },
  { to: "/buyer/marketplace", label: "Market", icon: Store },
  { to: "/orders", label: "Enquiries", icon: LayoutGrid },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { mode } = useApp();
  const items = mode === "artisan" ? ARTISAN_ITEMS : BUYER_ITEMS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 md:hidden"
      aria-label="Primary"
    >
      <div className="safe-bottom flex w-full max-w-[480px] items-end justify-between gap-1 rounded-[26px] border border-(--color-line)/60 bg-(--color-surface)/95 px-2 py-2 shadow-craft-lg backdrop-blur-sm">
        {items.map((item) => {
          const Icon = item.icon;
          const isFab = "isFab" in item && item.isFab;
          if (isFab) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="relative -mt-7 flex flex-col items-center gap-1"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-(--color-terracotta-600) text-(--color-cream) shadow-craft-lg ring-4 ring-(--color-cream)">
                  <Icon className="size-6" />
                </span>
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `tap-target flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold transition-colors ${
                  isActive ? "text-(--color-green-700)" : "text-(--color-ink-faint)"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex size-8 items-center justify-center rounded-full ${isActive ? "bg-(--color-green-100)" : ""}`}
                  >
                    <Icon className="size-4.5" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
