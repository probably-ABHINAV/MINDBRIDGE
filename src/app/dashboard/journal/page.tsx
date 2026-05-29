"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Sparkles, Plus, Clock, RefreshCw, X } from "lucide-react";
import { reflectOnJournal } from "@/app/actions/ai";
import { addJournalEntryAction } from "@/app/actions/db";
import { useJournalEntries } from "@/hooks/use-database";
import { useUserId } from "@/hooks/use-user-id";
import { getTodayKey, cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { JOURNAL_PROMPTS } from "@/lib/constants";

export default function JournalPage() {
  const studentMode = useAppStore((s) => s.studentMode);
  const userId = useUserId();
  const { data: entries, mutate } = useJournalEntries();
  
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    
    // Get AI reflection
    const aiResponse = await reflectOnJournal(content, studentMode);
    
    let reflection = null;
    let emotions = null;
    
    if (aiResponse.success && aiResponse.data) {
      reflection = aiResponse.data.reflection;
      emotions = aiResponse.data.extractedEmotions;
    }

    // Save to Postgres
    if (userId) {
      await addJournalEntryAction(
        userId,
        content.trim(),
        emotions?.length ? emotions[0] : null,
        reflection
      );
      mutate();
    }

    setIsSaving(false);
    setIsWriting(false);
    setContent("");
    setSelectedPrompt(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1.5 flex items-center gap-3">
            <PenLine className="text-teal" size={28} />
            Journal
          </h1>
          <p className="text-text-muted text-base">Write without editing. We'll hold it safely.</p>
        </div>
        
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-bg-deep font-semibold hover:bg-teal-strong hover:shadow-[0_0_20px_rgba(143,214,200,0.3)] transition-all shrink-0"
          >
            <Plus size={18} />
            New Entry
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {/* Editor Mode */}
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="glass-card p-6 sm:p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <Clock size={16} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  setIsWriting(false);
                  setContent("");
                }}
                className="p-2 rounded-lg hover:bg-card-soft text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Prompt Selector */}
            {!content && (
              <div className="mb-6 overflow-x-auto pb-2 -mx-2 px-2 flex gap-2 hide-scrollbar">
                {JOURNAL_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      setContent(`${prompt}\n\n`);
                    }}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-xl text-sm transition-colors",
                      selectedPrompt === prompt
                        ? "bg-teal/20 text-teal border border-teal/30"
                        : "bg-card-soft text-text-secondary border border-glass-border hover:bg-card-soft/80"
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full min-h-[300px] bg-transparent text-text-primary placeholder:text-text-muted/40 focus:outline-none resize-none leading-relaxed text-base"
            />

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-glass-border">
              <div className="text-xs text-text-muted flex items-center gap-2">
                <Sparkles size={14} className="text-teal" />
                MindBridge will provide a gentle reflection
              </div>
              <button
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal text-bg-deep font-semibold hover:bg-teal-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? (
                  <><RefreshCw size={16} className="animate-spin" /> Saving...</>
                ) : (
                  "Save Entry"
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Entries List */}
        {!isWriting && entries?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-card-soft flex items-center justify-center mb-4">
              <PenLine size={24} className="text-text-muted" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No entries yet</h3>
            <p className="text-text-muted max-w-sm mb-6">
              Your journal is completely private and stored only on this device. Start writing whenever you're ready.
            </p>
            <button
              onClick={() => setIsWriting(true)}
              className="px-6 py-2.5 rounded-xl bg-card-soft border border-glass-border text-text-secondary hover:text-text-primary hover:border-teal/30 transition-all"
            >
              Write your first entry
            </button>
          </motion.div>
        )}

        {/* Entries Feed */}
        <div className="grid gap-6">
          {entries?.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-text-muted tracking-wider uppercase">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
                {entry.emotion && (
                  <span className="px-3 py-1 rounded-full bg-card-soft border border-glass-border text-xs text-text-secondary capitalize">
                    {entry.emotion}
                  </span>
                )}
              </div>
              
              <div className="text-text-primary whitespace-pre-wrap leading-relaxed text-sm sm:text-base mb-6">
                {entry.content}
              </div>

              {entry.aiReflection && (
                <div className="mt-6 pt-6 border-t border-glass-border">
                  <div className="bg-teal/5 border border-teal/10 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal/30" />
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-teal" />
                      <h4 className="text-sm font-semibold text-text-primary">Reflection</h4>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-1">
                      {entry.aiReflection}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
