"use client";

import { Moon, Sun, Menu, X } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const sleepMode = useAppStore((s) => s.sleepMode);
  const toggleSleepMode = useAppStore((s) => s.toggleSleepMode);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <header className="lg:hidden sticky top-0 z-40 glass border-b border-glass-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 rounded-xl text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse-glow" />
          <span className="font-display text-lg font-semibold text-text-primary">
            MindBridge
          </span>
        </div>

        {/* Sleep mode */}
        <button
          onClick={toggleSleepMode}
          className={cn(
            "p-2 -mr-2 rounded-xl transition-all duration-300",
            sleepMode ? "text-teal" : "text-text-muted hover:text-text-secondary"
          )}
          aria-label="Toggle sleep mode"
        >
          {sleepMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
