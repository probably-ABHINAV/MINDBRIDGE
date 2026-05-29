"use server";

import { db } from "@/lib/db/drizzle";
import { moodHistory } from "@/lib/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";

export async function generateCustomMeditation(userId: string) {
  if (!userId) return { success: false, error: "No user found." };

  try {
    // 1. Fetch today's mood logs to personalize the meditation
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaysMoods = await db.select()
      .from(moodHistory)
      .where(and(
        eq(moodHistory.userId, userId),
        gte(moodHistory.createdAt, startOfDay)
      ))
      .orderBy(desc(moodHistory.createdAt));

    let context = "The user hasn't logged any specific moods today, so provide a general grounding and centering meditation.";
    if (todaysMoods.length > 0) {
      const topMood = todaysMoods[0].mood;
      const notes = todaysMoods[0].notes || "No specific triggers mentioned.";
      context = `The user is currently feeling ${topMood}. They mentioned: "${notes}". Tailor the meditation to gently soothe and address this state of mind.`;
    }

    // 2. Generate Meditation Script
    const prompt = `Write a 1 to 2 minute guided meditation script. 
    Context: ${context}
    
    CRITICAL INSTRUCTIONS:
    1. Output strictly the spoken text.
    2. Do NOT include any director's notes like [Pause for 5 seconds] or (breathe in).
    3. Use punctuation (commas, periods) naturally so a text-to-speech engine will pause correctly.
    4. Keep it very soothing, empathetic, and present-focused.
    5. No markdown formatting. Just plain text paragraphs.`;

    const systemInstruction = "You are a calming, professional meditation guide.";
    
    const script = await generateText(prompt, { systemInstruction });

    return { success: true, data: script };
  } catch (error) {
    console.error("Meditation Gen Error:", error);
    return { success: false, error: "Failed to generate meditation." };
  }
}
