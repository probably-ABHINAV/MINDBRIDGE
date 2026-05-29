"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";

export function AmbientBackground() {
  const sleepMode = useAppStore((s) => s.sleepMode);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(143,214,200,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(216,177,95,0.03) 0%, transparent 60%), var(--color-bg-deep)",
        }}
      />

      {/* Floating orb 1 — Teal */}
      <motion.div
        className="ambient-orb absolute rounded-full"
        style={{
          width: 800,
          height: 800,
          top: "-10%",
          left: "0%",
          background:
            "radial-gradient(circle, rgba(143,214,200,0.04) 0%, transparent 60%)",
          opacity: sleepMode ? 0.3 : 0.7,
        }}
        animate={{
          x: [0, 30, -10, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating orb 2 — Gold */}
      <motion.div
        className="ambient-orb absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          bottom: "0%",
          right: "-5%",
          background:
            "radial-gradient(circle, rgba(216,177,95,0.03) 0%, transparent 60%)",
          opacity: sleepMode ? 0.2 : 0.6,
        }}
        animate={{
          x: [0, -20, 15, 0],
          y: [0, 15, -20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
