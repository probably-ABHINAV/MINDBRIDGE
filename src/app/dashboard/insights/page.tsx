"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Globe, BarChart3, Users, Sparkles } from "lucide-react";
import { useMoodHistory } from "@/hooks/use-database";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Helper to format date to YYYY-MM-DD
const formatDateKey = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function InsightsPage() {
  const { data: moodLogs } = useMoodHistory();

  // ─── Weather Map Logic ───
  const { moodGrid, maxIntensity } = useMemo(() => {
    // Generate last 28 days (4 weeks)
    const days = [];
    const maxI = 10;
    
    // Create map of existing logs
    const logMap = new Map<string, any>();
    if (moodLogs) {
      moodLogs.forEach(log => {
        const d = new Date(log.createdAt);
        const key = formatDateKey(d);
        // If multiple per day, keep highest intensity or average
        if (!logMap.has(key) || logMap.get(key).intensity < log.intensity) {
          logMap.set(key, log);
        }
      });
    }

    // Populate grid
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const entry = logMap.get(key);
      days.push({
        date: d,
        key,
        entry,
        intensity: entry ? entry.intensity : 0,
        mood: entry ? entry.mood : null
      });
    }

    return { moodGrid: days, maxIntensity: maxI };
  }, [moodLogs]);


  // ─── Global Ripples Logic ───
  const [globalMoodCount, setGlobalMoodCount] = useState<number>(142); // Seed with some fake data so it doesn't look empty initially
  const [recentRipples, setRecentRipples] = useState<{ id: string; mood: string }[]>([]);

  useEffect(() => {
    // Listen to real-time INSERT events on mood_history globally
    const channel = supabase
      .channel("global_ripples")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mood_history" },
        (payload) => {
          setGlobalMoodCount((prev) => prev + 1);
          setRecentRipples((prev) => {
            const updated = [{ id: payload.new.id, mood: payload.new.mood }, ...prev];
            return updated.slice(0, 5); // Keep last 5
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
          <Globe className="text-teal" size={28} />
          Insights & Ripples
        </h1>
        <p className="text-text-muted">Understand your patterns. Feel the pulse of the community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ── Emotional Weather Map ── */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-teal" size={20} />
            <h2 className="text-lg font-semibold text-text-primary">Emotional Weather Map</h2>
          </div>
          
          <p className="text-sm text-text-muted mb-4">Your emotional intensity over the last 28 days.</p>
          
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {moodGrid.map((day, idx) => {
              // Calculate opacity based on intensity (1 to 10)
              const intensityRatio = day.intensity > 0 ? (day.intensity / maxIntensity) : 0.05;
              const hasLog = day.intensity > 0;
              
              return (
                <div 
                  key={day.key} 
                  className="relative group aspect-square rounded-md overflow-hidden"
                >
                  <div 
                    className={cn(
                      "w-full h-full transition-all duration-300",
                      hasLog ? "bg-teal shadow-[0_0_12px_rgba(143,214,200,0.2)]" : "bg-card-soft border border-glass-border"
                    )}
                    style={{ opacity: hasLog ? Math.max(0.2, intensityRatio) : 1 }}
                  />
                  {/* Tooltip */}
                  {hasLog && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-bg-deep/80 backdrop-blur-sm z-10 text-xs font-bold text-teal">
                      {day.intensity}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-4 text-[0.65rem] text-text-muted font-medium uppercase tracking-wider">
            <span>28 days ago</span>
            <span>Today</span>
          </div>
        </motion.div>


        {/* ── Global Ripples ── */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-2">
              <Users className="text-teal" size={20} />
              <h2 className="text-lg font-semibold text-text-primary">Global Ripples</h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              Live
            </div>
          </div>

          <div className="text-center relative z-10 mb-8">
            <motion.div 
              key={globalMoodCount}
              initial={{ scale: 1.1, color: "var(--color-teal)" }}
              animate={{ scale: 1, color: "var(--color-text-primary)" }}
              className="text-6xl font-display font-light mb-2"
            >
              {globalMoodCount}
            </motion.div>
            <p className="text-text-muted text-sm">
              People checked in globally today.
              <br />You are not alone.
            </p>
          </div>

          <div className="space-y-3 relative z-10">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Recent Live Ripples</h3>
            {recentRipples.length === 0 ? (
              <p className="text-xs text-text-muted/60 italic text-center py-4">Waiting for someone to check in...</p>
            ) : (
              recentRipples.map((ripple, i) => (
                <motion.div 
                  key={ripple.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 bg-card-soft/50 border border-glass-border px-4 py-2.5 rounded-xl text-sm"
                >
                  <Sparkles size={14} className="text-teal shrink-0" />
                  <span className="text-text-secondary">Someone is feeling <strong className="text-text-primary font-medium">{ripple.mood}</strong></span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
