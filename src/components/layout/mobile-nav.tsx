"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div
        className="glass border-t border-glass-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_NAV_ITEMS.map((item) => {
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
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 relative",
                  isActive
                    ? "text-teal"
                    : "text-text-muted active:scale-95"
                )}
              >
                {/* Active glow */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-teal rounded-full"
                    style={{
                      boxShadow: "0 0 12px rgba(143, 214, 200, 0.5)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <Icon
                  size={20}
                  className={cn(
                    "transition-all duration-300",
                    isActive && "drop-shadow-[0_0_8px_rgba(143,214,200,0.4)]"
                  )}
                />
                <span className="text-[0.625rem] font-medium">
                  {item.label}
                </span>

                {/* Emergency pulse indicator */}
                {item.id === "emergency" && !isActive && (
                  <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
