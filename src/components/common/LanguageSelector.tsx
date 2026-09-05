import { Languages } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Language } from "@/types";

const OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useApp();

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full border border-(--color-line) bg-(--color-surface) p-1">
        {OPTIONS.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              language === opt.code
                ? "bg-(--color-green-700) text-(--color-cream)"
                : "text-(--color-ink-soft)"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="card-craft flex items-center gap-3 bg-(--color-surface) p-3 shadow-craft">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--color-green-50) text-(--color-green-700)">
        <Languages className="size-4.5" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-(--color-ink)">Language</p>
      </div>
      <div className="flex gap-1 rounded-full bg-(--color-cream-deep) p-1">
        {OPTIONS.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              language === opt.code ? "bg-(--color-green-700) text-(--color-cream)" : "text-(--color-ink-soft)"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
