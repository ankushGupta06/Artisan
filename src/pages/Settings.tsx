import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import type { AppSettings } from "@/types";

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-(--color-surface) px-4 py-3.5 shadow-craft">
      <div className="pr-3">
        <p className="text-sm font-semibold text-(--color-ink)">{label}</p>
        <p className="text-xs text-(--color-ink-faint)">{description}</p>
      </div>
      <button
        onClick={onChange}
        aria-pressed={checked}
        aria-label={label}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-(--color-green-700)" : "bg-(--color-line)"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-(--color-surface) shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, showToast, resetDemo } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  function toggle(key: keyof AppSettings) {
    updateSettings({ [key]: !settings[key] });
    showToast("Settings updated.");
  }

  return (
    <AppShell>
      <Header title="Settings" showBack />
      <div className="space-y-5 px-4 pb-6">
        <div className="space-y-2">
          <p className="eyebrow">Language</p>
          <LanguageSelector />
        </div>

        <div className="space-y-2">
          <p className="eyebrow">Preferences</p>
          <div className="space-y-2">
            <SettingToggle
              label="Notifications"
              description="Get updates about orders and enquiries"
              checked={settings.notifications}
              onChange={() => toggle("notifications")}
            />
            <SettingToggle
              label="Dark Mode"
              description="Switch to a low-light color theme"
              checked={settings.darkMode}
              onChange={() => toggle("darkMode")}
            />
            <SettingToggle
              label="Data Saver"
              description="Reduce data usage on slow connections"
              checked={settings.dataSaver}
              onChange={() => toggle("dataSaver")}
            />
            <SettingToggle
              label="Offline Mode"
              description="Keep working when your connection drops"
              checked={settings.offlineMode}
              onChange={() => toggle("offlineMode")}
            />
            <SettingToggle
              label="Sound"
              description="Play sounds for key actions"
              checked={settings.sound}
              onChange={() => toggle("sound")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="eyebrow">Support</p>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl bg-(--color-surface) px-4 py-3.5 text-left shadow-craft"
          >
            <HelpCircle className="size-4.5 text-(--color-green-700)" />
            <span className="text-sm font-semibold text-(--color-ink)">Help</span>
          </button>
        </div>

        <div className="space-y-2 pt-4">
          <p className="eyebrow">Demo Controls</p>
          <button
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-(--color-danger)/40 bg-(--color-danger-100)/40 px-4 py-3.5 text-left"
          >
            <RotateCcw className="size-4.5 text-(--color-danger)" />
            <span className="text-sm font-semibold text-(--color-danger)">Reset Demo Data</span>
          </button>
        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset demo data?"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" full onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              full
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
                navigate("/home");
              }}
            >
              Reset
            </Button>
          </div>
        }
      >
        <p className="text-sm text-(--color-ink-soft)">
          This clears all demo changes (products, orders, favorites, notifications) and restores the original sample
          data. Useful right before a presentation.
        </p>
      </Modal>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help">
        <p className="text-sm text-(--color-ink-soft)">
          For support during the demo, contact your ArtisanAI facilitator or email help@artisanai.demo.
        </p>
        <Button full className="mt-4" onClick={() => setHelpOpen(false)}>
          Got it
        </Button>
      </Modal>
    </AppShell>
  );
}
