import type { IllustrationKey } from "@/types";

// ArtisanAI intentionally never depends on stock photography or remote image
// URLs (see AI Guide §33/§54). Instead every product renders through this one
// illustration system: a tinted organic "blob" backdrop plus a simple
// geometric mark that reads as its craft category. Keeping the visual
// language to one consistent family (same stroke widths, same blob shape,
// category-only color shift) is what makes the catalog feel designed rather
// than stitched together from random photos.

interface Palette {
  from: string;
  to: string;
  ink: string;
  label: string;
}

const PALETTES: Record<IllustrationKey, Palette> = {
  saree: { from: "#f6d9c4", to: "#e7a877", ink: "#8a3f1c", label: "Textile" },
  pottery: { from: "#f3c9a8", to: "#d97d43", ink: "#7a3417", label: "Pottery" },
  bag: { from: "#dbe7d4", to: "#9dbd8e", ink: "#2c4a24", label: "Bag" },
  basket: { from: "#f2e2b6", to: "#d3ac57", ink: "#71531a", label: "Basket" },
  brass: { from: "#f4e3b0", to: "#c99a3e", ink: "#6b4d15", label: "Handicraft" },
  jewellery: { from: "#f7dfe6", to: "#d99aab", ink: "#7a2f42", label: "Jewellery" },
  woodcraft: { from: "#e6d3b8", to: "#a9764a", ink: "#5a3a1e", label: "Woodcraft" },
  "home-decor": { from: "#dde9e2", to: "#7fa593", ink: "#2b4a3d", label: "Home Decor" },
};

function Mark({ kind, stroke }: { kind: IllustrationKey; stroke: string }) {
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 3.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "saree":
      return (
        <g {...common}>
          <path d="M32 18c-10 4-16 12-16 24 0 8 6 14 16 14s16-6 16-14c0-12-6-20-16-24z" />
          <path d="M22 32c5 3 15 3 20 0M20 40c6 3 18 3 24 0" opacity={0.6} />
        </g>
      );
    case "pottery":
      return (
        <g {...common}>
          <path d="M26 20h12l2 6-3 4c4 3 6 8 6 13 0 8-6 13-11 13s-11-5-11-13c0-5 2-10 6-13l-3-4 2-6z" />
          <path d="M23 33h18" opacity={0.6} />
        </g>
      );
    case "bag":
      return (
        <g {...common}>
          <path d="M20 30l3-9a9 9 0 0 1 18 0l3 9" />
          <rect x="17" y="30" width="30" height="24" rx="4" />
          <path d="M17 38h30" opacity={0.6} />
        </g>
      );
    case "basket":
      return (
        <g {...common}>
          <path d="M18 30h28l-4 22a4 4 0 0 1-4 3H26a4 4 0 0 1-4-3l-4-22z" />
          <path d="M22 30c2-8 6-12 10-12s8 4 10 12" />
          <path d="M20 37h24M19 45h26" opacity={0.55} />
        </g>
      );
    case "brass":
      return (
        <g {...common}>
          <path d="M32 16l8 12-8 12-8-12z" />
          <path d="M24 28l8 20 8-20" />
          <circle cx="32" cy="16" r="3" fill={stroke} stroke="none" />
        </g>
      );
    case "jewellery":
      return (
        <g {...common}>
          <path d="M18 22c6 8 8 12 14 12s8-4 14-12" />
          <circle cx="32" cy="40" r="6" />
          <circle cx="20" cy="24" r="2.4" fill={stroke} stroke="none" />
          <circle cx="44" cy="24" r="2.4" fill={stroke} stroke="none" />
        </g>
      );
    case "woodcraft":
      return (
        <g {...common}>
          <ellipse cx="32" cy="36" rx="16" ry="10" />
          <ellipse cx="32" cy="36" rx="9" ry="5.5" opacity={0.6} />
          <path d="M22 27c3-5 7-8 10-8s7 3 10 8" />
        </g>
      );
    case "home-decor":
      return (
        <g {...common}>
          <path d="M24 30l8-14 8 14z" />
          <path d="M20 30h24l-3 18H23z" />
          <path d="M28 48v4h8v-4" opacity={0.6} />
        </g>
      );
  }
}

export function ProductIllustration({
  illustration,
  className = "",
  size = "md",
  showLabel = false,
}: {
  illustration: IllustrationKey;
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showLabel?: boolean;
}) {
  const p = PALETTES[illustration];
  const gradId = `grad-${illustration}`;
  const dim =
    size === "hero" ? "aspect-[4/3]" : size === "lg" ? "aspect-square" : size === "sm" ? "aspect-square" : "aspect-square";

  return (
    <div
      className={`relative overflow-hidden ${dim} ${className}`}
      style={{ background: `linear-gradient(155deg, ${p.from}, ${p.to})` }}
      role="img"
      aria-label={`${p.label} product illustration`}
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={gradId} cx="30%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#${gradId})`} />
        {/* running-stitch ring accent — ties every product image back to the
            textile motif used throughout the design system */}
        <circle
          cx="32"
          cy="32"
          r="23"
          fill="none"
          stroke={p.ink}
          strokeOpacity="0.28"
          strokeWidth="1.4"
          strokeDasharray="3 4"
        />
        <Mark kind={illustration} stroke={p.ink} />
      </svg>
      {showLabel && (
        <span
          className="absolute bottom-2 left-2 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm"
        >
          {p.label}
        </span>
      )}
    </div>
  );
}
