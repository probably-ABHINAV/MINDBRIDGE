"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Target,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import {
  ACTION_CARDS,
  MOOD_OPTIONS,
  AFFIRMATIONS,
  CRISIS_RESOURCES,
} from "@/lib/constants";
import { getGreeting, getTodayKey, cn } from "@/lib/utils";
import { useTodayIntention, useMoodHistory, useLatestWeeklyInsight } from "@/hooks/use-database";
import { addIntentionAction, addMoodHistoryAction } from "@/app/actions/db";
import { generateWeeklyInsightAction } from "@/app/actions/analytics";
import { useUserId } from "@/hooks/use-user-id";

// ─── Animation Variants ───
const containerVariants: import("framer-motion").Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Streak Tracker Hook ───
function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const today = getTodayKey();
      const data = JSON.parse(localStorage.getItem("mb-streak") || "{}");
      const lastVisit = data.lastVisit || "";
      const currentStreak = data.streak || 0;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split("T")[0];

      let newStreak = 1;
      if (lastVisit === today) {
        newStreak = currentStreak;
      } else if (lastVisit === yesterdayKey) {
        newStreak = currentStreak + 1;
      }

      localStorage.setItem(
        "mb-streak",
        JSON.stringify({ lastVisit: today, streak: newStreak })
      );
      setStreak(newStreak);
    } catch {
      setStreak(1);
    }
  }, []);

  return streak;
}

// ─── Daily Intention Logic moved to Component ───

// ─── Main Dashboard Page ───
export default function DashboardHome() {
  const selectedMood = useAppStore((s) => s.selectedMood);
  const setSelectedMood = useAppStore((s) => s.setSelectedMood);
  const streak = useStreak();
  const userId = useUserId();
  
  // Database Hooks
  const { data: intentionData, mutate: mutateIntention } = useTodayIntention();
  // Weekly Insight
  const { data: insightData, mutate: mutateInsight } = useLatestWeeklyInsight();
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const handleGenerateInsight = async () => {
    if (!userId) return;
    setIsGeneratingInsight(true);
    const res = await generateWeeklyInsightAction(userId, studentMode);
    if (res.success) {
      mutateInsight();
    } else {
      alert(res.error || "Failed to generate insight.");
    }
    setIsGeneratingInsight(false);
  };

  const intentionSet = !!intentionData;
  const intention = intentionData?.text || "";
  
  const saveIntention = async (text: string) => {
    if (userId) {
      await addIntentionAction(userId, getTodayKey(), text);
      mutateIntention();
    }
  };

  const handleMoodSelect = async (moodValue: string) => {
    // If clicking the already selected mood, just deselect it in UI, but keep the history
    if (selectedMood === moodValue) {
      setSelectedMood(null);
      return;
    }
    
    setSelectedMood(moodValue);
    if (userId) {
      await addMoodHistoryAction(userId, moodValue, 5, "");
    }
  };

  const [intentionInput, setIntentionInput] = useState("");
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  // Rotate affirmations
  useEffect(() => {
    const timer = setInterval(() => {
      setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* ── Header Row ── */}
      <motion.div
        variants={itemVariants}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1.5">
            How are you feeling right now?
          </h1>
          <p className="text-text-muted text-base">{greeting}. You don&apos;t have to explain everything. Choose what you need.</p>
        </div>

        {/* Streak Widget */}
        {streak > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-card-soft border border-glass-border shrink-0">
            <Flame size={16} className="text-amber" />
            <span className="text-sm font-medium text-text-secondary">
              Day {streak} of showing up
            </span>
          </div>
        )}
      </motion.div>

      {/* ── Daily Intention ── */}
      <motion.div variants={itemVariants}>
        {!intentionSet ? (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-gold" />
              <span className="text-sm font-medium text-text-secondary">
                Set one gentle intention for today
              </span>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={intentionInput}
                onChange={(e) => setIntentionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && intentionInput.trim()) {
                    saveIntention(intentionInput.trim());
                  }
                }}
                placeholder="Today, I will be gentle with myself..."
                className="flex-1 bg-card-soft border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-teal-muted transition-colors"
              />
              <button
                onClick={() => {
                  if (intentionInput.trim()) {
                    saveIntention(intentionInput.trim());
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-teal/10 text-teal text-sm font-medium hover:bg-teal/20 transition-colors"
              >
                Set
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-5 flex items-center gap-3">
            <Target size={16} className="text-gold shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="text-text-muted">Today&apos;s intention: </span>
              <span className="font-medium text-text-primary italic">
                &ldquo;{intention}&rdquo;
              </span>
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Weekly Insight (NLP Option 3) ── */}
      <motion.div variants={itemVariants}>
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal" />
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-teal" />
              <h3 className="text-sm font-semibold text-text-primary">Weekly AI Insight</h3>
            </div>
            {!insightData && (
              <button
                onClick={handleGenerateInsight}
                disabled={isGeneratingInsight}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-teal/10 text-teal rounded-lg font-medium hover:bg-teal/20 transition-colors disabled:opacity-50"
              >
                {isGeneratingInsight ? <RefreshCw size={12} className="animate-spin" /> : "Generate"}
              </button>
            )}
          </div>
          
          {insightData ? (
            <div>
              <p className="text-sm text-text-secondary leading-relaxed italic mb-3">
                "{insightData.insightText}"
              </p>
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>Based on your last 7 days of logs</span>
                <button
                  onClick={handleGenerateInsight}
                  disabled={isGeneratingInsight}
                  className="flex items-center gap-1 text-teal hover:text-teal-strong transition-colors"
                >
                  <RefreshCw size={12} className={cn(isGeneratingInsight && "animate-spin")} /> Update
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted leading-relaxed">
              No insight generated this week yet. Click the button to analyze your recent mood and journal entries.
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Mood Selector ── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 sm:gap-5 justify-center py-2">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-400",
                selectedMood === mood.value
                  ? "bg-teal-glow scale-110 shadow-[0_0_24px_rgba(143,214,200,0.2)]"
                  : "hover:bg-card-soft/40 hover:scale-105"
              )}
            >
              <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
              <span
                className={cn(
                  "text-xs font-medium",
                  selectedMood === mood.value
                    ? "text-teal"
                    : "text-text-muted"
                )}
              >
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Action Cards Grid ── */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {ACTION_CARDS.map((card) => {
          const Icon = card.icon;
          const accentMap = {
            teal: {
              iconBg: "bg-teal-glow",
              iconColor: "text-teal",
              hoverClass: "",
            },
            amber: {
              iconBg: "bg-amber-glow",
              iconColor: "text-amber",
              hoverClass: "glass-card-amber",
            },
            gold: {
              iconBg: "bg-gold-glow",
              iconColor: "text-gold",
              hoverClass: "",
            },
          };
          const accent = accentMap[card.accent];

          return (
            <motion.div key={card.id} variants={itemVariants}>
              <Link
                href={card.href}
                className={cn(
                  "glass-card p-5 flex items-start gap-4 group cursor-pointer",
                  accent.hoverClass,
                  card.pulse && "animate-pulse-glow"
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                    accent.iconBg
                  )}
                >
                  <Icon size={20} className={accent.iconColor} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-0.5 group-hover:text-teal transition-colors">
                    {card.label}
                  </h3>
                  <p className="text-sm text-text-muted">{card.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Mood Timeline Preview ── */}
      <motion.div variants={itemVariants}>
        <MoodTimelinePreview />
      </motion.div>

      {/* ── Affirmation Strip ── */}
      <motion.div variants={itemVariants} className="text-center py-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={affirmationIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-text-muted text-sm italic"
          >
            &ldquo;{AFFIRMATIONS[affirmationIndex]}&rdquo;
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* ── Disclaimer ── */}
      <motion.div variants={itemVariants} className="text-center pt-2 pb-4">
        <p className="text-[0.6875rem] text-text-muted/50 leading-relaxed max-w-xl mx-auto">
          {CRISIS_RESOURCES.disclaimer} In a crisis, please contact iCall:
          9152987821 · Vandrevala Foundation: 1860-2662-345
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Mood Timeline Preview ───
function MoodTimelinePreview() {
  const moodData = useMoodHistory(7);

  if (!moodData || moodData.length === 0) return null;

  const moodColorMap: Record<string, string> = {
    low: "#7F8C92",
    anxious: "#F59E0B",
    frustrated: "#FB7185",
    numb: "#7F8C92",
    okay: "#8FD6C8",
    hopeful: "#D8B15F",
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-teal" />
        <span className="text-sm font-medium text-text-secondary">
          Your week
        </span>
      </div>
      <div className="flex items-end gap-3 justify-center">
        {moodData.map((entry, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className="w-3 h-3 rounded-full transition-colors"
              style={{
                backgroundColor: moodColorMap[entry.mood] || "#7F8C92",
                boxShadow: `0 0 8px ${moodColorMap[entry.mood] || "#7F8C92"}40`,
              }}
            />
            <span className="text-[0.625rem] text-text-muted">
              {new Date(entry.date).toLocaleDateString("en", {
                weekday: "short",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
