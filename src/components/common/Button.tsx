import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  full?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-(--color-green-700) text-(--color-cream) hover:bg-(--color-green-600) active:bg-(--color-green-900) shadow-craft",
  accent:
    "bg-(--color-terracotta-600) text-(--color-cream) hover:bg-(--color-terracotta-500) active:bg-(--color-terracotta-700) shadow-craft",
  outline:
    "bg-transparent text-(--color-green-700) border-2 border-(--color-green-700)/30 hover:border-(--color-green-700) hover:bg-(--color-green-50)",
  ghost: "bg-(--color-green-700)/8 text-(--color-green-700) hover:bg-(--color-green-700)/14",
  danger: "bg-(--color-danger) text-white hover:brightness-105 shadow-craft",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-4 py-2 gap-1.5 rounded-full",
  md: "text-[0.95rem] px-5 py-3 gap-2 rounded-full",
  lg: "text-base px-6 py-3.5 gap-2.5 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon, iconRight, loading, full, className = "", children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`tap-target inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="size-[1.1em] animate-spin" /> : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
});
