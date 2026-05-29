"use server";

import { generateText, generateJson } from "@/lib/ai/gemini";
import {
  PERSONAS,
  REFRAME_PROMPT,
  MOOD_ANALYSIS_PROMPT,
  JOURNAL_REFLECTION_PROMPT,
  STUDENT_MODE_INSTRUCTION,
import { checkSafety } from "@/lib/ai/safety";
import { db } from "@/lib/db/drizzle";
import { aiMemory } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// ─── Interfaces ───

export interface ReframeResult {
  distortion: string;
  empathy: string;
  reframe: string;
  question: string;
}

export interface MoodAnalysisResult {
  primaryEmotion: string;
  insight: string;
  suggestedAction: string;
}

export interface JournalReflectionResult {
  extractedEmotions: string[];
  reflection: string;
  gentleQuestion: string;
}

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isCrisis?: boolean;
}

// ─── Helper for System Instructions ───
function getSystemInstruction(basePrompt: string, studentMode: boolean) {
  return studentMode
    ? `${basePrompt}\n\n${STUDENT_MODE_INSTRUCTION}`
    : basePrompt;
}

// ─── Core AI Actions ───

/**
 * Chat with the AI Companion
 */
export async function chatWithCompanion(
  message: string,
  persona: keyof typeof PERSONAS = "companion",
  studentMode: boolean = false,
  userId?: string
): Promise<ActionResponse<string>> {
  try {
    // 1. Safety Check
    const safety = checkSafety(message);
    if (!safety.isSafe) {
      return {
        success: true,
        data: safety.crisisResponse,
        isCrisis: true,
      };
    }

    // 2. Fetch AI Memory (Proactive Coping)
    let memoryInjection = "";
    if (userId) {
      const memories = await db.select()
        .from(aiMemory)
        .where(eq(aiMemory.userId, userId))
        .orderBy(desc(aiMemory.createdAt))
        .limit(5);

      if (memories.length > 0) {
        memoryInjection = `\n\n[PROACTIVE AI MEMORY SYSTEM]
The user has previously mentioned the following triggers and effective coping strategies. 
If their current message relates to these, gently weave in a proactive suggestion based on this history:
${memories.map(m => `- Trigger: ${m.trigger} -> Strategy: ${m.copingStrategy}`).join("\n")}`;
      }
    }

    // 3. Build System Prompt
    const systemInstruction = getSystemInstruction(
      PERSONAS[persona].system,
      studentMode
    ) + memoryInjection;

    // 4. Generate Response
    const response = await generateText(message, { systemInstruction });

    // 5. Asynchronously extract new memories in the background
    if (userId) {
      // We don't await this so it doesn't slow down the chat
      extractAndSaveMemory(message, userId, studentMode).catch(console.error);
    }
    
    return { success: true, data: response };
  } catch (error) {
    console.error("AI Action Error:", error);
    return { success: false, error: "Failed to connect to your companion. Please try again." };
  }
}

// Background Task: Extract Triggers
async function extractAndSaveMemory(message: string, userId: string, studentMode: boolean) {
  const prompt = `Analyze this message: "${message}". 
Does the user explicitly mention a specific emotional trigger (e.g. "exams", "my boss", "insomnia") AND explicitly or implicitly state a coping need or strategy? 
If yes, extract it. If no, return empty strings. Return JSON: { "trigger": string, "copingStrategy": string }`;
  
  const result = await generateJson<{ trigger: string, copingStrategy: string }>(prompt, { 
    systemInstruction: "You are a data extractor. Return JSON only."
  });

  if (result.trigger && result.copingStrategy && result.trigger.trim() !== "") {
    await db.insert(aiMemory).values({
      userId,
      trigger: result.trigger,
      copingStrategy: result.copingStrategy
    });
  }
}

/**
 * Reframe a negative thought (CBT Engine)
 */
export async function reframeThought(
  thought: string,
  studentMode: boolean = false
): Promise<ActionResponse<ReframeResult>> {
  try {
    const safety = checkSafety(thought);
    if (!safety.isSafe) {
      return { success: false, error: "Safety trigger", isCrisis: true }; // UI should redirect to emergency
    }

    const systemInstruction = getSystemInstruction(REFRAME_PROMPT, studentMode);
    
    // Wrap thought to provide clear context to the model
    const prompt = `Here is my thought: "${thought}"\nPlease help me reframe this.`;
    
    const result = await generateJson<ReframeResult>(prompt, { systemInstruction });
    return { success: true, data: result };
  } catch (error) {
    console.error("AI Action Error:", error);
    return { success: false, error: "Failed to analyze thought." };
  }
}

/**
 * Analyze mood and suggest an action
 */
export async function analyzeMood(
  moodNotes: string,
  studentMode: boolean = false
): Promise<ActionResponse<MoodAnalysisResult>> {
  try {
    const safety = checkSafety(moodNotes);
    if (!safety.isSafe) return { success: false, error: "Safety trigger", isCrisis: true };

    const systemInstruction = getSystemInstruction(MOOD_ANALYSIS_PROMPT, studentMode);
    
    const result = await generateJson<MoodAnalysisResult>(moodNotes, { systemInstruction });
    return { success: true, data: result };
  } catch (error) {
    console.error("AI Action Error:", error);
    return { success: false, error: "Failed to analyze mood." };
  }
}

/**
 * Provide a gentle reflection on a journal entry
 */
export async function reflectOnJournal(
  journalEntry: string,
  studentMode: boolean = false
): Promise<ActionResponse<JournalReflectionResult>> {
  try {
    const safety = checkSafety(journalEntry);
    if (!safety.isSafe) return { success: false, error: "Safety trigger", isCrisis: true };

    const systemInstruction = getSystemInstruction(JOURNAL_REFLECTION_PROMPT, studentMode);
    
    const result = await generateJson<JournalReflectionResult>(journalEntry, { systemInstruction });
    return { success: true, data: result };
  } catch (error) {
    console.error("AI Action Error:", error);
    return { success: false, error: "Failed to reflect on journal entry." };
  }
}
