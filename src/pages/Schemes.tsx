import { useState } from "react";
import { Landmark, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { SCHEMES } from "@/data/schemes";
import type { Scheme } from "@/types";

export default function Schemes() {
  const { showToast } = useApp();
  const [active, setActive] = useState<Scheme | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [eligible, setEligible] = useState<boolean | null>(null);

  function checkEligibility() {
    setCheckingEligibility(true);
    setEligible(null);
    setTimeout(() => {
      setCheckingEligibility(false);
      setEligible(true);
    }, 1100);
  }

  return (
    <AppShell>
      <Header title="Government Support" subtitle="Schemes for artisans & micro-entrepreneurs" showBack backTo="/profile" />
      <div className="space-y-3 px-4 pb-6">
        <div className="flex items-start gap-3 rounded-2xl bg-(--color-green-50) p-4">
          <Landmark className="size-5 shrink-0 text-(--color-green-700)" />
          <p className="text-xs leading-relaxed text-(--color-green-700)">
            These are informational summaries for the demo. Always verify details on the official scheme portal before
            applying.
          </p>
        </div>

        {SCHEMES.map((scheme) => (
          <div key={scheme.id} className="card-craft space-y-3 bg-(--color-surface) p-4 shadow-craft">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-(--color-terracotta-600)">{scheme.category}</p>
              <h3 className="font-display text-lg font-semibold text-(--color-ink)">{scheme.name}</h3>
            </div>
            <p className="text-sm text-(--color-ink-soft)">{scheme.summary}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                full
                onClick={() => {
                  setActive(scheme);
                  setEligible(null);
                }}
              >
                Learn More
              </Button>
              <Button
                size="sm"
                variant="ghost"
                full
                onClick={() => {
                  showToast("Saved to your Profile.");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name}>
        {active && (
          <div className="space-y-4">
            <p className="text-sm text-(--color-ink-soft)">{active.summary}</p>
            <div className="space-y-2">
              <p className="eyebrow">Key Benefits</p>
              <ul className="space-y-1.5">
                {active.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-(--color-ink)">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-(--color-terracotta-500)" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {checkingEligibility ? (
              <div className="flex items-center gap-2 rounded-xl bg-(--color-cream-deep) p-3 text-sm text-(--color-ink-soft)">
                <span className="size-2 animate-pulse rounded-full bg-(--color-terracotta-500)" />
                Checking eligibility...
              </div>
            ) : eligible ? (
              <div className="flex items-center gap-2 rounded-xl bg-(--color-green-100) p-3 text-sm font-semibold text-(--color-green-700)">
                <ShieldCheck className="size-4.5" />
                You may be eligible — visit the official portal to apply.
              </div>
            ) : (
              <Button full onClick={checkEligibility}>
                Check Eligibility
              </Button>
            )}
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
