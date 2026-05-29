"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowRight, Brain, Heart, Sparkles, HelpCircle } from "lucide-react";
import { reframeThought, type ReframeResult } from "@/app/actions/ai";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

export default function ReframePage() {
  const studentMode = useAppStore((s) => s.studentMode);
  
  const [thought, setThought] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReframeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReframe = async () => {
    if (!thought.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const response = await reframeThought(thought, studentMode);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || "Failed to reframe thought. Please try again.");
    }
    
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setThought("");
    setResult(null);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1.5 flex items-center gap-3">
          <RefreshCw className="text-teal" size={28} />
          Thought Reframing
        </h1>
        <p className="text-text-muted text-base">
          Write down a negative or overwhelming thought. Let's look at it together from a different angle.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input-phase"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="glass-card p-6 sm:p-8"
          >
            <label className="block text-sm font-medium text-text-secondary mb-4">
              What's weighing on your mind right now?
            </label>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder={studentMode 
                ? "I'm going to fail this exam and my whole career is ruined..."
                : "I messed up today, I'm never going to get this right..."}
              className="w-full h-32 bg-card-soft border border-glass-border rounded-xl p-4 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-teal-muted resize-none mb-6"
            />

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleReframe}
                disabled={!thought.trim() || isAnalyzing}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                  thought.trim() && !isAnalyzing
                    ? "bg-teal text-bg-deep hover:bg-teal-strong shadow-[0_0_20px_rgba(143,214,200,0.2)]"
                    : "bg-card-soft border border-glass-border text-text-muted cursor-not-allowed"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Reframe this thought
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result-phase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* The Original Thought */}
            <div className="p-6 rounded-2xl bg-card-soft border border-glass-border border-dashed relative">
              <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-bg-deep border border-glass-border text-xs text-text-muted">
                Your thought
              </span>
              <p className="text-text-primary italic mt-2">"{thought}"</p>
            </div>

            {/* AI Results Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Empathy */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-5 border-t-4 border-t-amber"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={18} className="text-amber" />
                  <h3 className="font-semibold text-text-primary">Validation</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {result.empathy}
                </p>
              </motion.div>

              {/* Distortion */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-5 border-t-4 border-t-gold"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} className="text-gold" />
                  <h3 className="font-semibold text-text-primary">Cognitive Trap</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  You might be falling into <strong className="text-text-primary font-medium">{result.distortion}</strong>.
                </p>
              </motion.div>

              {/* Reframe (Spans 2 columns on desktop) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 sm:col-span-2 border-t-4 border-t-teal bg-teal/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-teal" />
                  <h3 className="font-semibold text-text-primary">A Softer Perspective</h3>
                </div>
                <p className="text-base text-text-primary leading-relaxed font-medium">
                  {result.reframe}
                </p>
              </motion.div>

              {/* Question */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-5 sm:col-span-2"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="text-text-secondary mt-0.5 shrink-0" />
                  <p className="text-sm text-text-muted italic">
                    {result.question}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="pt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl border border-glass-border text-text-secondary hover:text-text-primary hover:bg-card-soft transition-colors"
              >
                Reframe another thought
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
