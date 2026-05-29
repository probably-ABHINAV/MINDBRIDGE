"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const sleepMode = useAppStore((s) => s.sleepMode);
  const toggleSleepMode = useAppStore((s) => s.toggleSleepMode);

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] z-40 glass border-r border-glass-border">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse-glow" />
          <span className="font-display text-[1.375rem] font-semibold text-text-primary tracking-tight">
            MindBridge
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium transition-all duration-300 group relative",
                isActive
                  ? "text-teal bg-teal-glow"
                  : "text-text-muted hover:text-text-secondary hover:bg-card-soft/40"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors duration-300",
                  isActive ? "text-teal" : "text-text-muted group-hover:text-text-secondary"
                )}
              />
              <span>{item.label}</span>

              {/* Emergency pulse */}
              {item.id === "emergency" && (
                <div className="ml-auto w-2 h-2 rounded-full bg-amber animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 pb-5 space-y-4">
        {/* Sleep Mode Toggle */}
        <button
          onClick={toggleSleepMode}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.8125rem] font-medium w-full transition-all duration-300",
            sleepMode
              ? "bg-teal-glow text-teal"
              : "text-text-muted hover:text-text-secondary hover:bg-card-soft/40"
          )}
        >
          {sleepMode ? <Moon size={16} /> : <Sun size={16} />}
          <span>{sleepMode ? "Sleep Mode On" : "Sleep Mode"}</span>
        </button>

        {/* Disclaimer */}
        <p className="text-[0.6875rem] leading-relaxed text-text-muted/60 px-1">
          MindBridge offers emotional support tools, not professional therapy or
          emergency services.
        </p>
      </div>
    </aside>
  );
}
