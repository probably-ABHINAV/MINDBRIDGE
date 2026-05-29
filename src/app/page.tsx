"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Wind,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  BookOpen,
  BarChart3,
  Heart,
  Brain,
  Sparkles,
  ArrowRight,
  Shield,
  GraduationCap,
  PenLine,
  Package,
} from "lucide-react";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { CRISIS_RESOURCES } from "@/lib/constants";

// ─── Animation variants ───
const fadeInUp: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: import("framer-motion").Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn: import("framer-motion").Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

// ─── Animated Section Wrapper ───
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Feature Card ───
function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "teal",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent?: "teal" | "gold" | "amber";
}) {
  const accentColors = {
    teal: {
      icon: "text-teal",
      glow: "group-hover:shadow-[0_0_40px_rgba(143,214,200,0.12)]",
      border: "group-hover:border-teal-glow",
    },
    gold: {
      icon: "text-gold",
      glow: "group-hover:shadow-[0_0_40px_rgba(216,177,95,0.1)]",
      border: "group-hover:border-gold-glow",
    },
    amber: {
      icon: "text-amber",
      glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]",
      border: "group-hover:border-amber-glow",
    },
  };

  const colors = accentColors[accent];

  return (
    <motion.div
      variants={fadeInUp}
      className={`group glass-card p-6 cursor-default ${colors.glow}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
          accent === "teal"
            ? "bg-teal-glow"
            : accent === "gold"
            ? "bg-gold-glow"
            : "bg-amber-glow"
        }`}
      >
        <Icon size={20} className={colors.icon} />
      </div>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ─── Landing Page ───
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />

      {/* Navigation */}
      <nav className="relative z-20 glass border-b border-glass-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse-glow" />
            <span className="font-display text-xl font-semibold text-text-primary tracking-tight">
              MindBridge
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 text-sm font-medium rounded-xl bg-teal text-bg-deep hover:bg-teal-strong transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(143,214,200,0.3)]"
          >
            Enter MindBridge
          </Link>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative z-10 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-teal-glow border border-glass-border"
            >
              <Sparkles size={14} className="text-teal" />
              <span className="text-xs font-medium text-teal">
                AI-Powered Emotional Wellness
              </span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
              Your mind deserves{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-teal to-teal-strong bg-clip-text text-transparent">
                  a softer place
                </span>
              </span>{" "}
              to land.
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              MindBridge helps you calm down, understand your emotions, reframe
              difficult thoughts, and talk to a gentle AI companion — whenever
              things feel heavy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-2xl bg-teal text-bg-deep hover:bg-teal-strong transition-all duration-400 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(143,214,200,0.35)]"
              >
                Start your calm space
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
              <a
                href="#features"
                className="px-7 py-3.5 text-base font-medium rounded-2xl text-text-secondary border border-glass-border hover:border-teal-muted hover:text-text-primary transition-all duration-300 glass"
              >
                Explore features
              </a>
            </motion.div>
          </motion.div>

          {/* Floating Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="mt-16 sm:mt-20 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {/* Card 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="glass-card p-5 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-glow flex items-center justify-center mb-3">
                  <Wind size={16} className="text-teal" />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  Breathing Room
                </p>
                <p className="text-xs text-text-muted">
                  5 guided modes for any moment
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="glass-card p-5 text-left sm:translate-y-4"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-glow flex items-center justify-center mb-3">
                  <MessageCircle size={16} className="text-teal" />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  AI Companion
                </p>
                <p className="text-xs text-text-muted">
                  Emotionally intelligent support
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="glass-card p-5 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gold-glow flex items-center justify-center mb-3">
                  <Brain size={16} className="text-gold" />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  Thought Reframing
                </p>
                <p className="text-xs text-text-muted">
                  CBT-powered gentle reframes
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PROBLEM STATEMENT ═══════════ */}
      <AnimatedSection className="relative z-10 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-6">
            You are not broken.{" "}
            <span className="text-text-muted">You just need the right support.</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            Millions of students and young professionals face anxiety, burnout,
            loneliness, and emotional overwhelm every day — often without anyone
            to talk to at 2 AM. MindBridge was built for those quiet, heavy
            moments.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { number: "1 in 3", label: "students face anxiety" },
              { number: "72%", label: "suffer in silence" },
              { number: "2 AM", label: "is when it hits hardest" },
              { number: "24/7", label: "MindBridge is here" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card p-4 text-center"
              >
                <div className="font-display text-2xl font-bold text-teal mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════ FEATURES ═══════════ */}
      <AnimatedSection className="relative z-10 py-20 sm:py-28" delay={0.1}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6" id="features">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything you need to feel{" "}
              <span className="bg-gradient-to-r from-teal to-gold bg-clip-text text-transparent">
                held
              </span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Nine thoughtfully crafted tools designed to meet you wherever you
              are, emotionally.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <FeatureCard
              icon={MessageCircle}
              title="AI Companion"
              description="Talk to an emotionally intelligent AI that listens, understands, and gently guides. In English, Hindi, or Hinglish."
              accent="teal"
            />
            <FeatureCard
              icon={Wind}
              title="Breathing Room"
              description="Five guided breathing modes — from panic recovery to sleep preparation. Animated, calming, always available."
              accent="teal"
            />
            <FeatureCard
              icon={BarChart3}
              title="Mood Check-In"
              description="A 5-step guided flow that helps you name, measure, and understand what you're feeling — with AI-powered insight."
              accent="teal"
            />
            <FeatureCard
              icon={RefreshCw}
              title="Thought Reframing"
              description="CBT-informed tool that takes your heaviest thoughts and gently reshapes them into grounded, realistic perspectives."
              accent="gold"
            />
            <FeatureCard
              icon={PenLine}
              title="Private Journal"
              description="Write freely. AI reflects back with empathy, emotion detection, and one gentle question to deepen self-awareness."
              accent="teal"
            />
            <FeatureCard
              icon={ShieldAlert}
              title="Emergency Calm"
              description="Step-by-step grounding when everything feels too much. Crisis resources always accessible. You're never alone."
              accent="amber"
            />
            <FeatureCard
              icon={Package}
              title="Personal Calm Kit"
              description="Your private vault of trusted contacts, grounding quotes, helpful strategies, and a stress-mode panic button."
              accent="teal"
            />
            <FeatureCard
              icon={BookOpen}
              title="Learning Library"
              description="Warm, simple articles on anxiety, panic, overthinking, burnout, sleep, and knowing when to seek professional help."
              accent="gold"
            />
            <FeatureCard
              icon={Heart}
              title="Yoga & Pranayama"
              description="Eight guided practices from Anulom Vilom to exam-prep routines — each with step-by-step instructions and timers."
              accent="teal"
            />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════ AI COMPANION SECTION ═══════════ */}
      <AnimatedSection className="relative z-10 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pill pill-teal mb-5">
                <Sparkles size={12} />
                Powered by Gemini AI
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-5">
                Like talking to a wise, kind older sibling
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                MindBridge&apos;s AI Companion is not a chatbot. It&apos;s an
                emotionally intelligent presence that validates your feelings,
                asks the right questions, and never judges.
              </p>
              <ul className="space-y-3 text-text-secondary">
                {[
                  "Warm, human conversations in English, Hindi & Hinglish",
                  "6 different AI personas to match your comfort",
                  "Crisis-aware — knows when to offer helplines",
                  "Voice input for when typing feels like too much",
                  "Remembers what matters to support you better",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-glow flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat Preview */}
            <motion.div
              variants={scaleIn}
              className="glass-card p-6 space-y-4"
            >
              {/* AI message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-glow flex items-center justify-center shrink-0">
                  <span className="text-teal text-xs font-bold">M</span>
                </div>
                <div className="glass-surface p-4 rounded-2xl rounded-tl-md max-w-[85%]">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    I hear you. That sounds really heavy, and you don&apos;t
                    have to carry it alone right now. Before anything else — can
                    we just take one slow breath together? 🌿
                  </p>
                  <p className="text-xs text-text-muted mt-2">MindBridge AI</p>
                </div>
              </div>
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-teal/10 border border-teal-muted p-4 rounded-2xl rounded-tr-md max-w-[85%]">
                  <p className="text-sm text-text-primary">
                    I can&apos;t stop overthinking about tomorrow&apos;s exam...
                  </p>
                  <p className="text-xs text-text-muted mt-2 text-right">You</p>
                </div>
              </div>
              {/* Quick chips */}
              <div className="flex gap-2 flex-wrap pt-2">
                {["I feel anxious", "I can't sleep", "I need to talk"].map(
                  (chip, i) => (
                    <span
                      key={i}
                      className="pill pill-teal text-xs cursor-default"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════ STUDENT SECTION ═══════════ */}
      <AnimatedSection className="relative z-10 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="pill pill-gold mb-5 mx-auto w-fit">
            <GraduationCap size={12} />
            Built for Students
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-5">
            Because your mental health shouldn&apos;t wait{" "}
            <span className="text-text-muted">until semester break</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            MindBridge understands exam stress, placement anxiety, assignment
            pressure, and the feeling that everyone else has it together.
            Student mode adapts AI responses for academic life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              "Exam stress support",
              "Study-calm flow",
              "Placement anxiety",
              "Focus & motivation",
              "Procrastination help",
              "Sleep before exams",
            ].map((tag, i) => (
              <span key={i} className="pill pill-gold">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════ SAFETY SECTION ═══════════ */}
      <AnimatedSection className="relative z-10 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-glow flex items-center justify-center mx-auto mb-6">
            <Shield size={24} className="text-amber" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-5">
            Safety is not a feature.{" "}
            <span className="text-text-muted">It&apos;s the foundation.</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            MindBridge has built-in crisis detection. When conversations signal
            distress, the AI immediately shifts to provide helpline numbers,
            grounding exercises, and gentle guidance — never judgment.
          </p>
          <div className="glass-card p-6 text-left max-w-md mx-auto">
            <p className="text-sm text-text-muted mb-4 font-medium">
              Always Available Crisis Support
            </p>
            <div className="space-y-3">
              {CRISIS_RESOURCES.helplines.map((line, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    {line.name}
                  </span>
                  <span className="text-sm font-medium text-amber">
                    {line.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════ CTA ═══════════ */}
      <AnimatedSection className="relative z-10 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-5">
            You showed up.{" "}
            <span className="bg-gradient-to-r from-teal to-teal-strong bg-clip-text text-transparent">
              That already matters.
            </span>
          </h2>
          <p className="text-text-secondary text-lg mb-10">
            Start with one breath. One thought. One gentle step forward.
          </p>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl bg-teal text-bg-deep hover:bg-teal-strong transition-all duration-400 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(143,214,200,0.35)]"
          >
            Start your calm space
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </AnimatedSection>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative z-10 border-t border-glass-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-teal" />
              <span className="font-display text-lg font-semibold text-text-primary">
                MindBridge
              </span>
            </div>
            <p className="text-xs text-text-muted text-center max-w-xl leading-relaxed">
              {CRISIS_RESOURCES.disclaimer}
              {" "}In a crisis, please contact iCall: 9152987821 · Vandrevala
              Foundation: 1860-2662-345
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
