import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-(--color-ink)/45 backdrop-blur-[2px] animate-[fade-up_0.2s_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 max-h-[88dvh] w-full overflow-y-auto rounded-t-[28px] bg-(--color-surface) shadow-craft-lg animate-fade-up sm:max-w-md sm:rounded-[24px]"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-(--color-line) sm:hidden" />
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          {title && <h2 className="font-display text-xl font-semibold text-(--color-ink)">{title}</h2>}
          <button
            onClick={onClose}
            aria-label="Close"
            className="tap-target -mr-2 -mt-1 ml-auto flex items-center justify-center rounded-full text-(--color-ink-faint) hover:bg-(--color-cream-deep)"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 pb-5 pt-3">{children}</div>
        {footer && <div className="border-t border-(--color-line)/70 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
