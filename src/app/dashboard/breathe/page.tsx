"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Wind, CheckCircle2 } from "lucide-react";
import { BREATHING_MODES, BREATHING_MICROCOPY } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BreathingPhase = "idle" | "inhale" | "hold1" | "exhale" | "hold2" | "done";

export default function BreathePage() {
  const [selectedMode, setSelectedMode] = useState(BREATHING_MODES[0]);
  const [phase, setPhase] = useState<BreathingPhase>("idle");
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const stopBreathing = useCallback(() => {
    setPhase("idle");
    setCyclesCompleted(0);
    setTimeLeft(0);
  }, []);

  useEffect(() => {
    if (phase === "idle" || phase === "done") return;

    let timer: NodeJS.Timeout;

    if (phase === "inhale") {
      setTimeLeft(selectedMode.inhale);
      timer = setTimeout(() => {
        setPhase(selectedMode.hold > 0 ? "hold1" : "exhale");
      }, selectedMode.inhale * 1000);
    } else if (phase === "hold1") {
      setTimeLeft(selectedMode.hold);
      timer = setTimeout(() => {
        setPhase("exhale");
      }, selectedMode.hold * 1000);
    } else if (phase === "exhale") {
      setTimeLeft(selectedMode.exhale);
      timer = setTimeout(() => {
        setPhase(selectedMode.rest > 0 ? "hold2" : "inhale");
      }, selectedMode.exhale * 1000);
    } else if (phase === "hold2") {
      setTimeLeft(selectedMode.rest);
      timer = setTimeout(() => {
        const nextCycle = cyclesCompleted + 1;
        setCyclesCompleted(nextCycle);
        if (nextCycle >= selectedMode.totalCycles) {
          setPhase("done");
        } else {
          setPhase("inhale");
        }
      }, selectedMode.rest * 1000);
    }

    return () => clearTimeout(timer);
  }, [phase, selectedMode, cyclesCompleted]);

  // Update visual timer countdown
  useEffect(() => {
    if (timeLeft > 0 && phase !== "idle" && phase !== "done") {
      const interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, phase]);

  const startBreathing = () => {
    setCyclesCompleted(0);
    setPhase("inhale");
  };

  // Determine circle size based on phase
  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
      case "hold1":
        return 1.5;
      case "exhale":
      case "hold2":
      case "idle":
      case "done":
        return 1;
      default:
        return 1;
    }
  };

  const getPhaseDuration = () => {
    switch (phase) {
      case "inhale": return selectedMode.inhale;
      case "hold1": return selectedMode.hold;
      case "exhale": return selectedMode.exhale;
      case "hold2": return selectedMode.rest;
      default: return 1;
    }
  };

  const getPhaseText = () => {
    if (phase === "idle") return "Ready when you are";
    if (phase === "done") return "Session complete";
    
    // Map hold1 to hold, hold2 to rest for microcopy
    const key = phase === "hold1" ? "hold" : phase === "hold2" ? "rest" : phase;
    return BREATHING_MICROCOPY[key];
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
          <Wind className="text-teal" size={28} />
          Breathing Room
        </h1>
        <p className="text-text-muted text-base">Find your center. Follow the circle.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Col: Mode Selector */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Select Practice
          </h2>
          {BREATHING_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                stopBreathing();
                setSelectedMode(mode);
              }}
              disabled={phase !== "idle" && phase !== "done"}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed",
                selectedMode.id === mode.id
                  ? "bg-teal-glow border-teal/20"
                  : "bg-card-soft border-glass-border hover:bg-card-soft/80"
              )}
            >
              <h3 className={cn(
                "font-semibold text-sm mb-1",
                selectedMode.id === mode.id ? "text-teal" : "text-text-primary"
              )}>
                {mode.name}
              </h3>
              <p className="text-xs text-text-muted">{mode.description}</p>
            </button>
          ))}
        </div>

        {/* Right Col: Breathing Animation */}
        <div className="lg:col-span-2 glass-card p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background blur elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal/5 rounded-full blur-3xl" />

          {phase === "done" ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center z-10"
            >
              <CheckCircle2 size={48} className="text-teal mx-auto mb-4" />
              <h2 className="text-2xl font-display font-semibold text-text-primary mb-2">
                Well done.
              </h2>
              <p className="text-text-muted mb-8">
                You've completed {selectedMode.totalCycles} cycles of {selectedMode.name}.
              </p>
              <button
                onClick={stopBreathing}
                className="px-6 py-2.5 rounded-xl bg-teal text-bg-deep font-medium hover:bg-teal-strong transition-colors"
              >
                Return to menu
              </button>
            </motion.div>
          ) : (
            <>
              {/* Premium Multi-layered Breathing Circle */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-12 z-10">
                
                {/* Ring 1 - Deep Blur */}
                <motion.div
                  animate={{ scale: getCircleScale() * 1.15, opacity: phase !== "idle" ? 0.3 : 0 }}
                  transition={{ duration: getPhaseDuration(), ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0 rounded-full bg-teal-strong blur-[32px] sm:blur-[40px] pointer-events-none"
                />

                {/* Ring 2 - Mid Glass */}
                <motion.div
                  animate={{ scale: getCircleScale() * 1.05, opacity: phase !== "idle" ? 0.8 : 0.4 }}
                  transition={{ duration: getPhaseDuration(), ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-teal/40 bg-teal/10 blur-[4px]"
                />

                {/* Ring 3 - Solid Core */}
                <motion.div
                  animate={{
                    scale: getCircleScale(),
                    backgroundColor: phase === "inhale" || phase === "hold1" 
                      ? "rgba(143, 214, 200, 0.12)" 
                      : "var(--color-card-soft)",
                    borderColor: phase !== "idle" ? "var(--color-teal)" : "var(--color-glass-border)",
                  }}
                  transition={{ duration: getPhaseDuration(), ease: "easeInOut" }}
                  className="absolute inset-2 rounded-full border border-teal/50 shadow-[0_0_60px_rgba(143,214,200,0.15)] glass"
                />
                
                {/* Timer text inside circle */}
                {!["idle", "done"].includes(phase) && (
                  <motion.span
                    key={timeLeft}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-display font-light text-teal absolute"
                  >
                    {timeLeft}
                  </motion.span>
                )}
              </div>

              {/* Instructions & Controls */}
              <div className="text-center z-10 w-full max-w-sm">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={phase}
                    initial={{ opacity: 0, filter: "blur(4px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(4px)", scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={cn(
                      "text-xl sm:text-2xl mb-8 h-14 font-display",
                      phase === "idle" ? "text-text-muted" : "text-text-primary font-medium"
                    )}
                  >
                    {getPhaseText()}
                  </motion.p>
                </AnimatePresence>

                <div className="flex items-center justify-center gap-4">
                  {phase === "idle" ? (
                    <button
                      onClick={startBreathing}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-teal text-bg-deep font-semibold hover:bg-teal-strong hover:scale-[1.02] transition-all"
                    >
                      <Play size={18} className="fill-bg-deep" />
                      Begin Session
                    </button>
                  ) : (
                    <button
                      onClick={stopBreathing}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-glass-border text-text-secondary hover:text-text-primary hover:bg-card-soft transition-all"
                    >
                      <Square size={16} />
                      Stop
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {phase !== "idle" && (
                  <div className="mt-8">
                    <div className="flex justify-between text-xs text-text-muted mb-2">
                      <span>Cycle {cyclesCompleted + 1}</span>
                      <span>{selectedMode.totalCycles}</span>
                    </div>
                    <div className="h-1.5 w-full bg-card-soft rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: `${(cyclesCompleted / selectedMode.totalCycles) * 100}%` 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
