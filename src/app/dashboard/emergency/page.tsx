"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { CRISIS_RESOURCES } from "@/lib/constants";

export default function EmergencyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-glow flex items-center justify-center mb-6">
        <ShieldAlert size={28} className="text-amber" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary mb-3">
        Let&apos;s slow this moment down.
      </h1>
      <p className="text-text-muted text-base max-w-md mb-6">
        You are not in trouble. Full grounding flow coming in Phase 5. For now, here&apos;s immediate help:
      </p>

      {/* Crisis Resources */}
      <div className="glass-card p-6 max-w-sm w-full text-left mb-6">
        <p className="text-sm font-medium text-amber mb-4">
          You matter. Please reach out.
        </p>
        <div className="space-y-3">
          {CRISIS_RESOURCES.helplines.map((line, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{line.name}</span>
              <a
                href={`tel:${line.number}`}
                className="text-sm font-medium text-amber hover:text-amber/80 transition-colors"
              >
                {line.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/dashboard"
        className="text-sm text-teal hover:text-teal-strong transition-colors"
      >
        ← Back to home
      </Link>

      <p className="text-[0.6875rem] text-text-muted/50 mt-8 max-w-md">
        {CRISIS_RESOURCES.disclaimer}
      </p>
    </motion.div>
  );
}
