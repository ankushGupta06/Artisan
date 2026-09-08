import { useCallback, useEffect, useRef, useState } from "react";

// Minimal MediaRecorder wrapper for the voice-description screen.
//   start()  -> begins capturing mic audio
//   stop()   -> resolves with the recorded Blob (or null if nothing captured)
//   cancel() -> tears everything down, discards audio
//
// The hook never throws: failures surface via `error` and a falsey return.

type RecorderState = "idle" | "recording" | "stopping";

export interface AudioRecorder {
  state: RecorderState;
  isRecording: boolean;
  isSupported: boolean;
  error: string | null;
  durationMs: number;
  start: () => Promise<boolean>;
  stop: () => Promise<Blob | null>;
  cancel: () => void;
}

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/mp4",
];

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return MIME_CANDIDATES.find((t) => {
    try {
      return MediaRecorder.isTypeSupported(t);
    } catch {
      return false;
    }
  });
}

export function useAudioRecorder(): AudioRecorder {
  const isSupported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined";

  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const teardown = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError("Voice recording isn't supported in this browser.");
      return false;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorderRef.current = recorder;
      recorder.start();

      startedAtRef.current = Date.now();
      setDurationMs(0);
      timerRef.current = setInterval(
        () => setDurationMs(Date.now() - startedAtRef.current),
        200,
      );
      setState("recording");
      return true;
    } catch (err) {
      teardown();
      setState("idle");
      const denied = err instanceof DOMException && err.name === "NotAllowedError";
      setError(denied ? "Microphone permission was denied." : "Couldn't start recording.");
      return false;
    }
  }, [isSupported, teardown]);

  const stop = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        teardown();
        setState("idle");
        resolve(null);
        return;
      }
      setState("stopping");
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const blob = chunksRef.current.length
          ? new Blob(chunksRef.current, { type })
          : null;
        teardown();
        setState("idle");
        resolve(blob);
      };
      try {
        recorder.stop();
      } catch {
        teardown();
        setState("idle");
        resolve(null);
      }
    });
  }, [teardown]);

  const cancel = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
    teardown();
    setState("idle");
    setDurationMs(0);
  }, [teardown]);

  // Safety net: never leave the mic hot if the screen unmounts mid-recording.
  useEffect(() => cancel, [cancel]);

  return {
    state,
    isRecording: state === "recording",
    isSupported,
    error,
    durationMs,
    start,
    stop,
    cancel,
  };
}
