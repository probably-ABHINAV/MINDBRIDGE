import { create } from "zustand";

interface AppState {
  // Navigation
  currentSection: string;
  sidebarOpen: boolean;

  // Mood
  selectedMood: string | null;
  moodIntensity: number;

  // Sleep Mode
  sleepMode: boolean;

  // Language
  language: "english" | "hindi" | "hinglish";

  // AI Persona
  aiPersona: string;

  // Student Mode
  studentMode: boolean;

  // Actions
  setCurrentSection: (section: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedMood: (mood: string | null) => void;
  setMoodIntensity: (intensity: number) => void;
  toggleSleepMode: () => void;
  setLanguage: (lang: "english" | "hindi" | "hinglish") => void;
  setAiPersona: (persona: string) => void;
  toggleStudentMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSection: "home",
  sidebarOpen: false,
  selectedMood: null,
  moodIntensity: 5,
  sleepMode: false,
  language: "english",
  aiPersona: "companion",
  studentMode: false,

  setCurrentSection: (section) => set({ currentSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedMood: (mood) => set({ selectedMood: mood }),
  setMoodIntensity: (intensity) => set({ moodIntensity: intensity }),
  toggleSleepMode: () => set((state) => ({ sleepMode: !state.sleepMode })),
  setLanguage: (lang) => set({ language: lang }),
  setAiPersona: (persona) => set({ aiPersona: persona }),
  toggleStudentMode: () =>
    set((state) => ({ studentMode: !state.studentMode })),
}));
