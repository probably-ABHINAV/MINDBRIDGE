"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, CheckCircle2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { analyzeMood, type MoodAnalysisResult } from "@/app/actions/ai";
import { addMoodHistoryAction } from "@/app/actions/db";
import { CHECKIN_FEELINGS, CHECKIN_TRIGGERS } from "@/lib/constants";
import { useUserId } from "@/hooks/use-user-id";
import { getTodayKey, cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import Link from "next/link";

export default function MoodPage() {
  const studentMode = useAppStore((s) => s.studentMode);
  const userId = useUserId();

  const [step, setStep] = useState(1);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MoodAnalysisResult | null>(null);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    
    // Save to Postgres first
    if (userId) {
      await addMoodHistoryAction(
        userId,
        selectedFeeling || "unknown",
        intensity,
        `${selectedTriggers.join(", ")}${notes ? " - " + notes : ""}`
      );
    }

    // Ask AI for an insight
    const analysisNotes = `Feeling: ${selectedFeeling}, Intensity: ${intensity}/10, Triggers: ${selectedTriggers.join(", ")}, Notes: ${notes}`;
    const response = await analyzeMood(analysisNotes, studentMode);
    
    setIsAnalyzing(false);
    setStep(5); // Results step

    if (response.success && response.data) {
      setResult(response.data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1.5 flex items-center gap-3">
          <BarChart3 className="text-teal" size={28} />
          Mood Check-in
        </h1>
        <p className="text-text-muted text-base">Let's pause and see where you are right now.</p>
      </div>

      <div className="glass-card p-6 sm:p-8 min-h-[400px] flex flex-col">
        {/* Progress Bar */}
        {step < 5 && (
          <div className="w-full bg-card-soft h-1.5 rounded-full overflow-hidden mb-8">
            <motion.div 
              className="h-full bg-teal" 
              initial={{ width: `${((step - 1) / 4) * 100}%` }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Core Feeling */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-center text-text-primary mb-8">
                  What is the main feeling right now?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {CHECKIN_FEELINGS.map(feeling => (
                    <button
                      key={feeling.value}
                      onClick={() => {
                        setSelectedFeeling(feeling.value);
                        handleNext();
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all",
                        selectedFeeling === feeling.value
                          ? "bg-teal-glow shadow-[0_0_20px_rgba(143,214,200,0.2)] scale-105"
                          : "bg-card-soft border border-glass-border hover:bg-card-soft/80"
                      )}
                    >
                      <span className="text-3xl">{feeling.emoji}</span>
                      <span className={cn(
                        "text-sm font-medium",
                        selectedFeeling === feeling.value ? "text-teal" : "text-text-primary"
                      )}>{feeling.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Intensity */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <h2 className="text-xl font-semibold text-center text-text-primary mb-4">
                  How intense is this feeling?
                </h2>
                <div className="px-4">
                  <div className="flex justify-between text-4xl mb-6">
                    <span className={intensity < 4 ? "opacity-100" : "opacity-30 transition-opacity"}>🌱</span>
                    <span className={intensity >= 4 && intensity <= 7 ? "opacity-100" : "opacity-30 transition-opacity"}>🌿</span>
                    <span className={intensity > 7 ? "opacity-100" : "opacity-30 transition-opacity"}>🔥</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-card-soft rounded-lg appearance-none cursor-pointer accent-teal"
                  />
                  <div className="flex justify-between text-xs font-medium text-text-muted mt-4 uppercase tracking-wider">
                    <span>Manageable</span>
                    <span>Moderate</span>
                    <span>Overwhelming</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={handleBack} className="px-6 py-2 rounded-xl text-text-secondary hover:bg-card-soft transition-colors">Back</button>
                  <button onClick={handleNext} className="px-6 py-2 rounded-xl bg-teal text-bg-deep font-medium hover:bg-teal-strong transition-colors">Continue</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Triggers */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-center text-text-primary mb-2">
                  Do you know what triggered this?
                </h2>
                <p className="text-center text-sm text-text-muted mb-6">Select all that apply, or skip if you're not sure.</p>
                <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                  {CHECKIN_TRIGGERS.map(trigger => {
                    const isSelected = selectedTriggers.includes(trigger);
                    return (
                      <button
                        key={trigger}
                        onClick={() => toggleTrigger(trigger)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                          isSelected
                            ? "bg-teal/20 border border-teal text-teal"
                            : "bg-card-soft border border-glass-border text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {trigger}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between pt-8">
                  <button onClick={handleBack} className="px-6 py-2 rounded-xl text-text-secondary hover:bg-card-soft transition-colors">Back</button>
                  <button onClick={handleNext} className="px-6 py-2 rounded-xl bg-teal text-bg-deep font-medium hover:bg-teal-strong transition-colors">Continue</button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Notes & Submission */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-center text-text-primary mb-2">
                  Any specific thoughts?
                </h2>
                <p className="text-center text-sm text-text-muted mb-6">Brain dump anything else on your mind (optional).</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="I'm just really worried about..."
                  className="w-full h-32 bg-card-soft border border-glass-border rounded-xl p-4 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-teal-muted resize-none"
                />
                <div className="flex justify-between pt-4">
                  <button 
                    onClick={handleBack} 
                    disabled={isAnalyzing}
                    className="px-6 py-2 rounded-xl text-text-secondary hover:bg-card-soft transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-teal text-bg-deep font-medium hover:bg-teal-strong transition-colors"
                  >
                    {isAnalyzing ? <><RefreshCw size={18} className="animate-spin" /> Analyzing...</> : "Complete Check-in"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Results */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-teal" />
                </div>
                <h2 className="text-2xl font-display font-semibold text-text-primary">
                  Check-in saved
                </h2>
                <p className="text-text-muted mb-8 max-w-md mx-auto">
                  Taking a moment to acknowledge your feelings is a massive step. You're doing great.
                </p>

                {result && (
                  <div className="text-left bg-card-soft border border-glass-border rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal" />
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-teal" />
                      <h3 className="font-semibold text-text-primary">MindBridge Insight</h3>
                    </div>
                    <p className="text-sm text-text-secondary italic mb-4 leading-relaxed">
                      "{result.insight}"
                    </p>
                    <div className="bg-bg-deep rounded-xl p-3 border border-glass-border flex items-center justify-between">
                      <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Suggested Action</span>
                      <span className="text-sm text-text-primary font-medium">{result.suggestedAction}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-xl border border-glass-border text-text-secondary hover:text-text-primary hover:bg-card-soft transition-colors font-medium"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/dashboard/breathe"
                    className="px-6 py-3 rounded-xl bg-teal text-bg-deep hover:bg-teal-strong transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Take a deep breath <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
