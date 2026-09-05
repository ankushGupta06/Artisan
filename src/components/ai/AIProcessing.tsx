import { Sparkles } from "lucide-react";
import { LoadingSteps } from "@/components/common/LoadingSteps";

export function AIProcessing({
  title = "AI is working on it...",
  steps,
  totalMs,
}: {
  title?: string;
  steps: string[];
  totalMs?: number;
}) {
  return (
    <div className="card-craft flex flex-col items-center gap-6 bg-(--color-surface) px-6 py-10 text-center shadow-craft-lg animate-fade-up">
      <span className="relative flex size-16 items-center justify-center rounded-full bg-(--color-green-700)">
        <Sparkles className="size-7 text-(--color-cream)" />
        <span className="absolute inset-0 animate-ping rounded-full bg-(--color-green-700)/40" />
      </span>
      <div>
        <p className="font-display text-lg font-semibold text-(--color-ink)">{title}</p>
        <p className="mt-1 text-sm text-(--color-ink-faint)">This usually takes just a few seconds.</p>
      </div>
      <div className="w-full max-w-xs text-left">
        <LoadingSteps steps={steps} totalMs={totalMs} />
      </div>
    </div>
  );
}
