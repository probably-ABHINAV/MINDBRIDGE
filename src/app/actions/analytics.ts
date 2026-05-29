"use server";

import { db } from "@/lib/db/drizzle";
import { moodHistory, journalEntries, weeklyInsights } from "@/lib/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";

export async function generateWeeklyInsightAction(userId: string, studentMode: boolean) {
  if (!userId) return { success: false, error: "No user found" };

  try {
    // 1. Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 2. Fetch last 7 days of moods
    const recentMoods = await db.select()
      .from(moodHistory)
      .where(and(
        eq(moodHistory.userId, userId),
        gte(moodHistory.createdAt, sevenDaysAgo)
      ));

    // 3. Fetch last 7 days of journals
    const recentJournals = await db.select()
      .from(journalEntries)
      .where(and(
        eq(journalEntries.userId, userId),
        gte(journalEntries.createdAt, sevenDaysAgo)
      ));

    if (recentMoods.length === 0 && recentJournals.length === 0) {
      return { success: false, error: "Not enough data from the past week to generate an insight." };
    }

    // 4. Aggregate Stats (Client-Side Counting Logic as per Option 3)
    const moodCounts: Record<string, number> = {};
    const triggers = new Set<string>();
    let totalIntensity = 0;

    recentMoods.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      totalIntensity += m.intensity;
      if (m.notes) {
        m.notes.split(",").forEach(t => triggers.add(t.trim()));
      }
    });

    const averageIntensity = recentMoods.length > 0 ? (totalIntensity / recentMoods.length).toFixed(1) : "N/A";
    const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(m => m[0]);
    const extractedEmotions = recentJournals.map(j => j.emotion).filter(Boolean);

    // 5. Send Tiny Payload to LLM
    const statsPayload = `
      Past 7 Days Summary:
      - Logged Moods: ${topMoods.join(", ")}
      - Average Intensity: ${averageIntensity}/10
      - Mentioned Triggers: ${Array.from(triggers).slice(0, 5).join(", ")}
      - Journal Emotions: ${extractedEmotions.join(", ")}
    `;

    const systemInstruction = `You are a gentle, empathetic AI assistant for a mental health app. 
    Look at these basic statistics of the user's past 7 days and write exactly ONE sentence of gentle insight or encouragement. 
    Keep it extremely brief, warm, and observational (e.g. 'It looks like studies have been triggering your anxiety this week, remember to take a breath.'). 
    Do not give medical advice. ${studentMode ? "Relate it to academic stress if applicable." : ""}`;

    const aiInsightText = await generateText(statsPayload, { systemInstruction });

    // 6. Save insight to DB
    const [insertedInsight] = await db.insert(weeklyInsights).values({
      userId,
      insightText: aiInsightText,
    }).returning();

    return { success: true, data: insertedInsight };

  } catch (error) {
    console.error("Failed to generate insight:", error);
    return { success: false, error: "Failed to generate your weekly insight." };
  }
}

export async function getLatestWeeklyInsightAction(userId: string) {
  if (!userId) return null;
  const result = await db.select()
    .from(weeklyInsights)
    .where(eq(weeklyInsights.userId, userId))
    .orderBy(desc(weeklyInsights.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}
