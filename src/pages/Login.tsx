import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/common/Button";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useApp } from "@/context/AppContext";

type Step = "phone" | "otp";

export default function Login() {
  const navigate = useNavigate();
  const { login, showToast } = useApp();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function handleContinue() {
    if (phone.trim().length < 4) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStep("otp");
      showToast("OTP sent (demo mode — use any code).", "info");
    }, 900);
  }

  function handleVerify() {
    if (otp.trim().length < 4 || otp.trim().length > 6) {
      setError("Enter the 4-6 digit code shown on your phone.");
      return;
    }
    setError("");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      login();
      navigate("/home");
    }, 900);
  }

  return (
    <div className="flex min-h-dvh flex-col justify-between bg-(--color-green-700) px-6 py-10 text-(--color-cream)">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-(--color-cream)/12">
            <Sparkles className="size-8 text-(--color-gold-100)" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">ArtisanAI</h1>
            <p className="mt-2 text-sm text-(--color-cream)/75">From your craft to the digital market.</p>
          </div>
        </div>

        <div className="card-craft space-y-5 bg-(--color-surface) p-6 shadow-craft-lg">
          {step === "phone" ? (
            <>
              <div>
                <h2 className="font-display text-lg font-semibold text-(--color-ink)">Welcome back</h2>
                <p className="mt-1 text-sm text-(--color-ink-faint)">Enter your phone number to continue.</p>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">
                  Phone number
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-(--color-line) bg-(--color-cream)/40 px-4 py-3 focus-within:border-(--color-green-700)">
                  <Phone className="size-4.5 text-(--color-ink-faint)" />
                  <input
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full bg-transparent text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:outline-none"
                  />
                </div>
              </label>
              {error && <p className="text-xs font-medium text-(--color-danger)">{error}</p>}
              <Button full loading={busy} onClick={handleContinue} iconRight={<ArrowRight className="size-4" />}>
                Continue
              </Button>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-display text-lg font-semibold text-(--color-ink)">Verify your number</h2>
                <p className="mt-1 text-sm text-(--color-ink-faint)">
                  Enter any 4-6 digit code — this is a demo, no real SMS is sent.
                </p>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-(--color-ink-faint)">
                  Verification code
                </span>
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full rounded-2xl border border-(--color-line) bg-(--color-cream)/40 px-4 py-3 text-center text-lg tracking-[0.5em] text-(--color-ink) focus:border-(--color-green-700) focus:outline-none"
                />
              </label>
              {error && <p className="text-xs font-medium text-(--color-danger)">{error}</p>}
              <Button full loading={busy} onClick={handleVerify}>
                Verify &amp; Continue
              </Button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-center text-xs font-semibold text-(--color-ink-faint)"
              >
                Change phone number
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <LanguageSelector compact />
          <span className="rounded-full bg-(--color-cream)/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-(--color-cream)/80">
            Demo Mode
          </span>
        </div>
      </div>
    </div>
  );
}
