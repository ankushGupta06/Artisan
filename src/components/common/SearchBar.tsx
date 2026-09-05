import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-(--color-line) bg-(--color-surface) px-4 py-3 shadow-craft focus-within:border-(--color-green-700)/50">
      <Search className="size-4.5 shrink-0 text-(--color-ink-faint)" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="tap-target -mr-2 flex items-center justify-center text-(--color-ink-faint)"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
