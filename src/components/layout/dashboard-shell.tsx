"use client";

import { useAppStore } from "@/stores/app-store";
import { AppSidebar } from "./app-sidebar";
import { MobileNav } from "./mobile-nav";
import { AppHeader } from "./app-header";
import { AmbientBackground } from "./ambient-background";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const sleepMode = useAppStore((s) => s.sleepMode);

  return (
    <div className={cn("min-h-screen relative", sleepMode && "sleep-mode")}>
      <AmbientBackground />
      <AppSidebar />
      <AppHeader />

      <main className="relative z-10 lg:ml-[260px] pb-24 lg:pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
