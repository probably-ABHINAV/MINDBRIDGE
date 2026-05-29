"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";

export function AmbientBackground() {
  const sleepMode = useAppStore((s) => s.sleepMode);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(143,214,200,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(216,177,95,0.05) 0%, transparent 60%), #071013",
        }}
      />

      {/* Floating orb 1 — Teal */}
      <motion.div
        className="ambient-orb absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: "5%",
          left: "10%",
          background:
            "radial-gradient(circle, rgba(143,214,200,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: sleepMode ? 0.3 : 0.7,
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating orb 2 — Gold */}
      <motion.div
        className="ambient-orb absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: "10%",
          right: "5%",
          background:
            "radial-gradient(circle, rgba(216,177,95,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: sleepMode ? 0.2 : 0.6,
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating orb 3 — Subtle teal accent */}
      <motion.div
        className="ambient-orb absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: "60%",
          left: "50%",
          background:
            "radial-gradient(circle, rgba(143,214,200,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: sleepMode ? 0.15 : 0.5,
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 30, 0],
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
