import { Mic } from "lucide-react";

export function VoiceRecorder({
  listening,
  onClick,
  disabled,
}: {
  listening: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-pressed={listening}
        aria-label={listening ? "Stop recording" : "Start recording"}
        className="relative flex size-28 items-center justify-center rounded-full bg-(--color-terracotta-600) text-(--color-cream) shadow-craft-lg transition-transform active:scale-95 disabled:opacity-50"
      >
        {listening && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-(--color-terracotta-500)/50" />
            <span className="absolute -inset-3 animate-pulse rounded-full border-2 border-(--color-terracotta-500)/40" />
          </>
        )}
        <Mic className="size-11" />
      </button>
      <p className="text-sm font-semibold text-(--color-ink)">
        {listening ? "Listening..." : "Tap to speak"}
      </p>
    </div>
  );
}
