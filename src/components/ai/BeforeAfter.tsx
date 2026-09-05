import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { ProductIllustration } from "@/components/common/ProductIllustration";
import type { IllustrationKey } from "@/types";

export function BeforeAfter({ illustration }: { illustration: IllustrationKey }) {
  const [split, setSplit] = useState(50);

  return (
    <div className="space-y-2">
      <div className="card-craft relative aspect-[4/3] w-full overflow-hidden shadow-craft-lg">
        {/* AFTER (enhanced) — full width base layer */}
        <div className="absolute inset-0">
          <ProductIllustration illustration={illustration} size="hero" className="h-full w-full" />
          <span className="absolute right-3 top-3 rounded-full bg-(--color-green-700) px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-(--color-cream)">
            AI Enhanced
          </span>
        </div>

        {/* BEFORE (original, imperfect) — clipped by the slider */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${split}%` }}>
          <div className="h-full w-full origin-top-left" style={{ width: `${10000 / split}%` }}>
            <div className="relative h-full w-full grayscale-[35%] contrast-[0.9] saturate-[0.7]">
              <div className="absolute inset-0 rotate-1 scale-105 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.08)_0px,rgba(0,0,0,0.08)_2px,transparent_2px,transparent_10px)]" />
              <ProductIllustration illustration={illustration} size="hero" className="h-full w-full opacity-90" />
            </div>
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-(--color-ink)/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Original
          </span>
        </div>

        {/* handle */}
        <div className="absolute inset-y-0 z-10 flex w-0.5 -translate-x-1/2 flex-col items-center bg-(--color-cream)" style={{ left: `${split}%` }}>
          <span className="absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-(--color-cream) text-(--color-ink) shadow-craft-lg">
            <MoveHorizontal className="size-4.5" />
          </span>
        </div>

        <input
          type="range"
          min={4}
          max={96}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label="Compare original and AI enhanced image"
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="text-center text-xs font-medium text-(--color-ink-faint)">Drag to compare original vs. AI enhanced</p>
    </div>
  );
}
