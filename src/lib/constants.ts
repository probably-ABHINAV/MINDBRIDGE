// ============================================
// MindBridge — Constants & Data
// ============================================

import {
  Home,
  Wind,
  MessageCircle,
  BarChart3,
  BookOpen,
  RefreshCw,
  ShieldAlert,
  Package,
  PenLine,
  Settings,
  Zap,
  HelpCircle,
  Globe,
  type LucideIcon,
} from "lucide-react";

// ─── Navigation Items ───
export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  mobileVisible?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/dashboard", mobileVisible: true },
  { id: "companion", label: "AI Companion", icon: MessageCircle, href: "/dashboard/companion" },
  { id: "mood", label: "Mood Check-In", icon: BarChart3, href: "/dashboard/mood" },
  { id: "insights", label: "Insights & Ripples", icon: Globe, href: "/dashboard/insights" },
  { id: "breathe", label: "Breathing Room", icon: Wind, href: "/dashboard/breathe", mobileVisible: true },
  { id: "journal", label: "Journal", icon: PenLine, href: "/dashboard/journal" },
  { id: "reframe", label: "Thought Reframe", icon: RefreshCw, href: "/dashboard/reframe" },
  { id: "calmkit", label: "Calm Kit", icon: Package, href: "/dashboard/calm-kit" },
  { id: "emergency", label: "Emergency", icon: ShieldAlert, href: "/dashboard/emergency", mobileVisible: true },
  { id: "library", label: "Learning Library", icon: BookOpen, href: "/dashboard/library" },
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/dashboard", mobileVisible: true },
  { id: "breathe", label: "Breathe", icon: Wind, href: "/dashboard/breathe", mobileVisible: true },
  { id: "companion", label: "Talk", icon: MessageCircle, href: "/dashboard/companion", mobileVisible: true },
  { id: "mood", label: "Mood", icon: BarChart3, href: "/dashboard/mood", mobileVisible: true },
  { id: "emergency", label: "SOS", icon: ShieldAlert, href: "/dashboard/emergency", mobileVisible: true },
];

// ─── Home Action Cards ───
export interface ActionCard {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  accent: "teal" | "amber" | "gold";
  pulse?: boolean;
}

export const ACTION_CARDS: ActionCard[] = [
  {
    id: "calm",
    icon: Wind,
    label: "I need to calm down",
    description: "Guided breathing exercises",
    href: "/dashboard/breathe",
    accent: "teal",
  },
  {
    id: "emergency",
    icon: Zap,
    label: "I need help right now",
    description: "Emergency grounding support",
    href: "/dashboard/emergency",
    accent: "amber",
    pulse: true,
  },
  {
    id: "talk",
    icon: MessageCircle,
    label: "I want to talk",
    description: "AI emotional companion",
    href: "/dashboard/companion",
    accent: "teal",
  },
  {
    id: "checkin",
    icon: HelpCircle,
    label: "I don't know what I feel",
    description: "Guided emotional check-in",
    href: "/dashboard/mood",
    accent: "teal",
  },
  {
    id: "reframe",
    icon: RefreshCw,
    label: "I want to release overthinking",
    description: "CBT thought reframing",
    href: "/dashboard/reframe",
    accent: "teal",
  },
  {
    id: "learn",
    icon: BookOpen,
    label: "I want to learn & heal",
    description: "Mental wellness library",
    href: "/dashboard/library",
    accent: "gold",
  },
];

// ─── Mood Options ───
export interface MoodOption {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: "😔", label: "Low", value: "low", color: "#7F8C92" },
  { emoji: "😰", label: "Anxious", value: "anxious", color: "#F59E0B" },
  { emoji: "😡", label: "Frustrated", value: "frustrated", color: "#FB7185" },
  { emoji: "😶", label: "Numb", value: "numb", color: "#7F8C92" },
  { emoji: "🙂", label: "Okay", value: "okay", color: "#8FD6C8" },
  { emoji: "🌤️", label: "Hopeful", value: "hopeful", color: "#D8B15F" },
];

// ─── Breathing Modes ───
export interface BreathingMode {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  totalCycles: number;
}

export const BREATHING_MODES: BreathingMode[] = [
  {
    id: "calm-reset",
    name: "Calm Reset",
    description: "2-minute gentle reset",
    inhale: 4, hold: 2, exhale: 6, rest: 2,
    totalCycles: 8,
  },
  {
    id: "panic-support",
    name: "Panic Support",
    description: "Box breathing for acute stress",
    inhale: 4, hold: 4, exhale: 4, rest: 4,
    totalCycles: 8,
  },
  {
    id: "sleep",
    name: "Sleep Breathing",
    description: "4-7-8 technique for deep rest",
    inhale: 4, hold: 7, exhale: 8, rest: 0,
    totalCycles: 6,
  },
  {
    id: "exam-prep",
    name: "Exam Prep",
    description: "Quick focus before tests",
    inhale: 4, hold: 0, exhale: 4, rest: 2,
    totalCycles: 10,
  },
  {
    id: "breakdown-reset",
    name: "Breakdown Reset",
    description: "When everything feels too much",
    inhale: 3, hold: 1, exhale: 5, rest: 2,
    totalCycles: 8,
  },
];

// ─── Breathing Microcopy ───
export const BREATHING_MICROCOPY: Record<string, string> = {
  inhale: "Inhale slowly… let your lungs fill completely.",
  hold: "Hold gently… you are here, you are safe.",
  exhale: "Exhale fully… release what you're carrying.",
  rest: "Rest… nothing is required of you right now.",
};

// ─── Affirmations ───
export const AFFIRMATIONS: string[] = [
  "You are allowed to take this one breath at a time.",
  "This moment is temporary. You are not.",
  "You don't have to solve everything today.",
  "It's okay to not be okay right now.",
  "You are doing better than you think.",
  "Your feelings are valid, even the messy ones.",
  "Rest is not laziness. It's recovery.",
  "You've survived every hard day so far.",
  "Healing doesn't have to look productive.",
  "You are enough, even on your worst days.",
  "Progress isn't always visible. It's still real.",
  "You are allowed to ask for help.",
  "One small step is still forward.",
  "Your story isn't over. This is just a chapter.",
  "Breathe. You are exactly where you need to be.",
  "Softness is not weakness. It's wisdom.",
  "You don't need permission to take care of yourself.",
  "The fact that you're here shows incredible strength.",
  "Difficult emotions mean you're human, not broken.",
  "Tomorrow is a blank page. Tonight, just rest.",
];

// ─── Emergency Grounding Tasks ───
export const GROUNDING_TASKS: string[] = [
  "Put both feet flat on the floor. Feel the ground beneath you.",
  "Take three slow breaths. In through the nose, out through the mouth.",
  "Name five things you can see right now.",
  "Touch something near you. Describe its texture in your mind.",
  "Sip water slowly if you have it nearby.",
  "Hold something cold if available — a glass, phone, doorknob.",
  "You are doing well. Send a message to someone you trust.",
  "If you feel unsafe, please reach out to emergency support now.",
];

// ─── Crisis Resources ───
export const CRISIS_RESOURCES = {
  disclaimer:
    "MindBridge offers emotional support tools, not professional therapy, diagnosis, medical care, or emergency services.",
  helplines: [
    { name: "iCall India", number: "9152987821" },
    { name: "Vandrevala Foundation", number: "1860-2662-345" },
    { name: "Emergency Services (India)", number: "112" },
  ],
  trustedMessageTemplate:
    "I'm not feeling okay right now. Can you stay with me for a few minutes?",
};

// ─── Quick Chat Chips ───
export const QUICK_CHIPS: string[] = [
  "I feel anxious",
  "I'm overthinking",
  "I feel lonely",
  "I'm panicking",
  "I can't sleep",
  "I feel worthless",
  "I'm stressed about exams",
  "I need someone to listen",
];

// ─── Student Quick Chips ───
export const STUDENT_CHIPS: string[] = [
  "I'm stressed about exams",
  "I wasted my day",
  "I can't focus",
  "I'm scared of failing",
  "I have placement anxiety",
  "I need a study plan",
];

// ─── Companion Personas ───
export interface CompanionPersona {
  id: string;
  name: string;
  description: string;
  emoji: string;
  systemPromptAddon: string;
}

export const COMPANION_PERSONAS: CompanionPersona[] = [
  {
    id: "companion",
    name: "Gentle Friend",
    description: "Warm and understanding",
    emoji: "🌿",
    systemPromptAddon: "Speak like a warm, trusted friend who deeply cares.",
  },
  {
    id: "elder-brother",
    name: "Elder Brother",
    description: "Protective and grounded",
    emoji: "🛡️",
    systemPromptAddon:
      "Speak like a supportive elder brother — protective, practical, and reassuring.",
  },
  {
    id: "elder-sister",
    name: "Elder Sister",
    description: "Nurturing and intuitive",
    emoji: "💜",
    systemPromptAddon:
      "Speak like a caring elder sister — empathetic, intuitive, and emotionally present.",
  },
  {
    id: "calm-coach",
    name: "Calm Coach",
    description: "Structured and goal-oriented",
    emoji: "🎯",
    systemPromptAddon:
      "Speak like a calm life coach — structured, action-oriented, but deeply empathetic.",
  },
  {
    id: "study-mentor",
    name: "Study Stress Mentor",
    description: "Academic pressure support",
    emoji: "📚",
    systemPromptAddon:
      "Specialize in academic stress. Help with study plans, exam anxiety, and procrastination with patience and understanding.",
  },
  {
    id: "spiritual",
    name: "Spiritual Calm Guide",
    description: "Mindful and philosophical",
    emoji: "🕊️",
    systemPromptAddon:
      "Speak with gentle spiritual wisdom — references to mindfulness, presence, acceptance, and inner peace. Non-religious but deeply philosophical.",
  },
];

// ─── Check-In Flow Questions ───
export const CHECKIN_FEELINGS = [
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😡", label: "Angry", value: "angry" },
  { emoji: "😶", label: "Numb", value: "numb" },
  { emoji: "🫂", label: "Lonely", value: "lonely" },
  { emoji: "🌊", label: "Overwhelmed", value: "overwhelmed" },
  { emoji: "😨", label: "Scared", value: "scared" },
  { emoji: "🤷", label: "I don't know", value: "unknown" },
];

export const CHECKIN_TRIGGERS = [
  "Studies",
  "Career",
  "Family",
  "Relationship",
  "Money",
  "Health",
  "Social Media",
  "Sleep",
  "Loneliness",
  "No clear reason",
];

export const CHECKIN_NEEDS = [
  { label: "Calm down", value: "calm", href: "/dashboard/breathe" },
  { label: "Talk to someone", value: "talk", href: "/dashboard/companion" },
  { label: "Understand my feeling", value: "understand", href: "/dashboard/mood" },
  { label: "Stop overthinking", value: "reframe", href: "/dashboard/reframe" },
  { label: "Sleep", value: "sleep", href: "/dashboard/breathe" },
  { label: "Emergency help", value: "emergency", href: "/dashboard/emergency" },
];

// ─── Yoga Practices ───
export interface YogaPractice {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  durationMin: number;
  level: string;
  focus: string;
  steps: string[];
}

export const YOGA_PRACTICES: YogaPractice[] = [
  {
    id: "anulom-vilom",
    name: "Anulom Vilom",
    subtitle: "Alternate nostril breathing",
    duration: "5 min",
    durationMin: 5,
    level: "Beginner",
    focus: "Balance & calm",
    steps: [
      "Sit comfortably with your back straight.",
      "Close your right nostril with your thumb.",
      "Inhale deeply through your left nostril for 4 seconds.",
      "Close your left nostril with your ring finger.",
      "Release your right nostril and exhale for 4 seconds.",
      "Inhale through your right nostril for 4 seconds.",
      "Close your right nostril and exhale through your left.",
      "Repeat this cycle for 5 minutes. Let your breath flow naturally.",
    ],
  },
  {
    id: "bhramari",
    name: "Bhramari Pranayama",
    subtitle: "Humming bee breath",
    duration: "7 min",
    durationMin: 7,
    level: "Beginner",
    focus: "Anxiety & mental noise",
    steps: [
      "Sit comfortably and close your eyes.",
      "Place your index fingers gently on your ear cartilage.",
      "Take a deep breath in through your nose.",
      "As you exhale, press the ear cartilage and make a humming sound.",
      "Keep the humming steady and feel the vibrations.",
      "Release and breathe normally for a moment.",
      "Repeat 5-7 times. Let the sound calm your mind.",
      "Sit quietly for a minute. Notice the silence within.",
    ],
  },
  {
    id: "box-breathing",
    name: "Box Breathing",
    subtitle: "Equal-count square breathing",
    duration: "4 min",
    durationMin: 4,
    level: "Beginner",
    focus: "Panic & stress",
    steps: [
      "Sit upright and relax your shoulders.",
      "Inhale slowly through your nose for 4 seconds.",
      "Hold your breath gently for 4 seconds.",
      "Exhale slowly through your mouth for 4 seconds.",
      "Hold empty for 4 seconds.",
      "Repeat this box pattern 6-8 times.",
      "If you feel dizzy, return to normal breathing.",
      "You're doing great. This simple pattern calms your nervous system.",
    ],
  },
  {
    id: "body-scan",
    name: "Body Scan Relaxation",
    subtitle: "Progressive muscle awareness",
    duration: "12 min",
    durationMin: 12,
    level: "All levels",
    focus: "Sleep & tension",
    steps: [
      "Lie down or sit comfortably. Close your eyes.",
      "Start with your toes. Notice any tension. Breathe into it.",
      "Move to your ankles, calves, knees. Relax each area.",
      "Move to your thighs, hips, and lower back.",
      "Notice your stomach. Let it soften with each exhale.",
      "Relax your chest, shoulders, arms, and hands.",
      "Release tension in your neck, jaw, and forehead.",
      "Stay here for 2 minutes. Let your whole body feel heavy and safe.",
    ],
  },
  {
    id: "neck-shoulder",
    name: "Neck & Shoulder Release",
    subtitle: "Desk-friendly tension relief",
    duration: "8 min",
    durationMin: 8,
    level: "Beginner",
    focus: "Physical stress",
    steps: [
      "Sit tall. Drop your shoulders away from your ears.",
      "Slowly tilt your head to the right. Hold for 15 seconds.",
      "Return to center. Tilt to the left. Hold for 15 seconds.",
      "Roll your shoulders backward 5 times slowly.",
      "Roll your shoulders forward 5 times slowly.",
      "Interlace your fingers behind your head. Gently press forward.",
      "Hold for 10 seconds. Release slowly.",
      "Shake out your arms and hands. You just released stored tension.",
    ],
  },
  {
    id: "sleep-routine",
    name: "Sleep Relaxation Routine",
    subtitle: "Wind down for restful sleep",
    duration: "15 min",
    durationMin: 15,
    level: "All levels",
    focus: "Overthinking at night",
    steps: [
      "Dim the lights and put your phone face-down after this.",
      "Lie on your back. Place one hand on your chest, one on your belly.",
      "Breathe in for 4 counts. Hold for 7. Exhale for 8.",
      "Repeat the 4-7-8 pattern 4 times.",
      "Starting from your feet, tense each muscle group for 5 seconds, then release.",
      "Work your way up: legs, stomach, chest, arms, face.",
      "Imagine a warm golden light filling your body from toes to head.",
      "Let your thoughts float past like clouds. You don't need to catch them.",
    ],
  },
  {
    id: "exam-stress",
    name: "Exam Stress Routine",
    subtitle: "Quick calm before tests",
    duration: "6 min",
    durationMin: 6,
    level: "Beginner",
    focus: "Focus before tests",
    steps: [
      "Sit upright. Unclench your jaw and drop your shoulders.",
      "Place both feet flat on the ground. Feel grounded.",
      "Take 5 deep breaths: in for 4, out for 4.",
      "Say quietly to yourself: 'I have prepared. I will do my best.'",
      "Shake out your hands for 10 seconds to release nervous energy.",
      "Close your eyes. Visualize yourself calmly reading each question.",
      "Take one final deep breath. Open your eyes.",
      "You are ready. Trust yourself. One question at a time.",
    ],
  },
  {
    id: "morning-reset",
    name: "Morning Reset",
    subtitle: "Start with clarity and energy",
    duration: "5 min",
    durationMin: 5,
    level: "Beginner",
    focus: "Clarity + energy",
    steps: [
      "Sit on the edge of your bed. Feet on the floor.",
      "Stretch your arms overhead. Take 3 deep breaths.",
      "Roll your neck gently: 3 circles each direction.",
      "Stand up. Do 5 gentle forward folds.",
      "Shake your whole body for 15 seconds. Let go of sleep energy.",
      "Take 5 quick energizing breaths: sharp inhale, strong exhale.",
      "Set one intention: 'Today, I will...'",
      "You're awake. You showed up. That's already enough.",
    ],
  },
];

// ─── Library Articles ───
export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  readTimeMin: number;
}

export const ARTICLES: Article[] = [
  {
    id: "anxiety-physical",
    title: "Why Anxiety Feels Physical",
    description: "Understanding the body-mind connection behind anxious feelings.",
    category: "Anxiety",
    readTime: "4 min",
    readTimeMin: 4,
  },
  {
    id: "panic-attack",
    title: "What to Do During a Panic Attack",
    description: "Step-by-step guidance when panic overwhelms you.",
    category: "Panic",
    readTime: "3 min",
    readTimeMin: 3,
  },
  {
    id: "overthinking-night",
    title: "How to Stop Overthinking at Night",
    description: "Techniques to quiet a racing mind before sleep.",
    category: "Overthinking",
    readTime: "5 min",
    readTimeMin: 5,
  },
  {
    id: "cbt-basics",
    title: "CBT Basics in Simple Words",
    description: "Cognitive behavioral therapy explained without jargon.",
    category: "CBT",
    readTime: "6 min",
    readTimeMin: 6,
  },
  {
    id: "breathing-science",
    title: "Why Breathing Helps Your Nervous System",
    description: "The science behind why slow breathing calms you down.",
    category: "Breathing",
    readTime: "4 min",
    readTimeMin: 4,
  },
  {
    id: "exam-stress",
    title: "How to Handle Exam Stress",
    description: "Practical strategies for before, during, and after exams.",
    category: "Exam Stress",
    readTime: "5 min",
    readTimeMin: 5,
  },
  {
    id: "burnout",
    title: "Understanding Burnout Before It Breaks You",
    description: "Recognizing the signs and slowing down before it's too late.",
    category: "Burnout",
    readTime: "7 min",
    readTimeMin: 7,
  },
  {
    id: "loneliness",
    title: "When Loneliness Feels Like a Room With No Door",
    description: "Navigating the weight of feeling disconnected.",
    category: "Loneliness",
    readTime: "5 min",
    readTimeMin: 5,
  },
  {
    id: "self-worth",
    title: "Rebuilding Self-Worth After Failure",
    description: "How to start seeing yourself clearly again after setbacks.",
    category: "Self-Worth",
    readTime: "6 min",
    readTimeMin: 6,
  },
  {
    id: "sleep-anxiety",
    title: "The Science of Sleep and Anxiety",
    description: "Why your brain won't let you sleep and what to do about it.",
    category: "Sleep",
    readTime: "5 min",
    readTimeMin: 5,
  },
  {
    id: "talk-when-low",
    title: "How to Talk to Someone When You Feel Low",
    description: "Finding the words when you need connection most.",
    category: "Relationships",
    readTime: "4 min",
    readTimeMin: 4,
  },
  {
    id: "seek-help",
    title: "When to Seek Professional Help: A Gentle Guide",
    description: "Understanding when self-help tools aren't enough.",
    category: "When to Seek Help",
    readTime: "3 min",
    readTimeMin: 3,
  },
];

export const ARTICLE_CATEGORIES = [
  "All",
  "Anxiety",
  "Panic",
  "Overthinking",
  "Burnout",
  "Sleep",
  "Loneliness",
  "Self-Worth",
  "Exam Stress",
  "Relationships",
  "CBT",
  "Breathing",
  "Journaling",
  "When to Seek Help",
];

// ─── Journal Prompts ───
export const JOURNAL_PROMPTS = [
  "What feels heavy today?",
  "What do I need right now?",
  "What am I avoiding?",
  "What helped me today?",
  "What would I say to a friend feeling this?",
];

// ─── Ambient Sound Options ───
export const AMBIENT_SOUNDS = [
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "forest", label: "Forest", emoji: "🌲" },
  { id: "bowl", label: "Singing Bowl", emoji: "🔔" },
  { id: "white-noise", label: "White Noise", emoji: "〰️" },
  { id: "silence", label: "Silence", emoji: "🤫" },
];
