import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastStack } from "@/components/common/Toast";

export function AppShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-dvh bg-(--color-cream)">
      {!hideNav && <Sidebar />}
      <ToastStack />
      <div className={hideNav ? "" : "md:pl-64"}>
        {/* The app deliberately stays a centered, phone-width column even on
            wide desktop screens (AI Guide §4) rather than stretching content
            edge-to-edge like a generic SaaS dashboard. */}
        <div className={`mx-auto min-h-dvh w-full max-w-[480px] ${hideNav ? "" : "pb-28 md:pb-10"}`}>{children}</div>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
