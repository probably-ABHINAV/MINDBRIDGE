"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Download, Upload, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const aiPersona = useAppStore((s) => s.aiPersona);
  const setAiPersona = useAppStore((s) => s.setAiPersona);
  const studentMode = useAppStore((s) => s.studentMode);
  const toggleStudentMode = useAppStore((s) => s.toggleStudentMode);

  // ─── Data Management ───
  // Note: Import/Export logic was removed because data is now securely stored in Postgres in the cloud.

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Settings
        </h1>
        <p className="text-text-muted text-base">
          Manage your preferences and your private data.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={20} className="text-teal" />
          <h2 className="text-base font-semibold text-text-primary">
            Preferences
          </h2>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between py-3 border-b border-glass-border">
          <div>
            <span className="text-sm font-medium text-text-secondary block">Language</span>
            <span className="text-xs text-text-muted">Primary language for AI responses</span>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-card-soft border border-glass-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-teal-muted"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>

        {/* AI Persona */}
        <div className="flex items-center justify-between py-3 border-b border-glass-border">
          <div>
            <span className="text-sm font-medium text-text-secondary block">AI Persona</span>
            <span className="text-xs text-text-muted">How the AI talks to you</span>
          </div>
          <select 
            value={aiPersona}
            onChange={(e) => setAiPersona(e.target.value)}
            className="bg-card-soft border border-glass-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-teal-muted"
          >
            <option value="companion">Gentle Companion</option>
            <option value="therapist">Direct & Grounding</option>
            <option value="friend">Warm Friend</option>
          </select>
        </div>

        {/* Student Mode */}
        <div className="flex items-center justify-between py-3 border-b border-glass-border">
          <div>
            <span className="text-sm font-medium text-text-secondary block">Student Mode</span>
            <span className="text-xs text-text-muted">Adapts examples for academic life</span>
          </div>
          <button
            onClick={toggleStudentMode}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
              studentMode ? "bg-teal" : "bg-glass-border"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                studentMode ? "translate-x-2" : "-translate-x-2"
              )}
            />
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert size={20} className="text-gold" />
          <h2 className="text-base font-semibold text-text-primary">
            Data & Privacy
          </h2>
        </div>
        
        <p className="text-sm text-text-muted leading-relaxed mb-6">
          MindBridge uses an <strong>anonymous cloud sync</strong> architecture. Your data is safely stored in our secure database using a unique device identifier.
        </p>

        <div className="p-4 rounded-xl bg-card-soft border border-glass-border">
          <h3 className="text-sm font-medium text-text-primary mb-1">Data is Safe</h3>
          <p className="text-xs text-text-muted">You do not need to manually export backups anymore. Your journal entries, mood history, and calm kit are automatically saved to the cloud.</p>
        </div>

        <div className="mt-4 pt-4 border-t border-glass-border flex items-start gap-2">
          <CheckCircle2 size={16} className="text-teal shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            Note: If you clear your local storage data, you will generate a new anonymous ID and lose access to your previous data.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
