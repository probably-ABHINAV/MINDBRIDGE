"use server";

import { db } from "@/lib/db/drizzle";
import { users, journalEntries, moodHistory, calmKit, intentions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// Ensure a user exists in the DB before inserting records
async function ensureUserExists(userId: string) {
  const existingUser = await db.select().from(users).where(eq(users.id, userId));
  if (existingUser.length === 0) {
    await db.insert(users).values({ id: userId });
  }
}

// ─── Journal Entries ───
export async function getJournalEntriesAction(userId: string) {
  if (!userId) return [];
  return db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.createdAt));
}

export async function addJournalEntryAction(userId: string, content: string, emotion: string | null, aiReflection: string | null) {
  await ensureUserExists(userId);
  await db.insert(journalEntries).values({
    userId,
    content,
    emotion,
    aiReflection
  });
}

// ─── Mood History ───
export async function getMoodHistoryAction(userId: string) {
  if (!userId) return [];
  return db.select().from(moodHistory).where(eq(moodHistory.userId, userId)).orderBy(desc(moodHistory.createdAt));
}

export async function addMoodHistoryAction(userId: string, mood: string, intensity: number, notes: string | null) {
  await ensureUserExists(userId);
  await db.insert(moodHistory).values({
    userId,
    mood,
    intensity,
    notes
  });
}

// ─── Calm Kit ───
export async function getCalmKitAction(userId: string) {
  if (!userId) return [];
  return db.select().from(calmKit).where(eq(calmKit.userId, userId)).orderBy(calmKit.order);
}

export async function addCalmKitAction(userId: string, type: string, name: string, value: string, order: number) {
  await ensureUserExists(userId);
  await db.insert(calmKit).values({
    userId,
    type,
    name,
    value,
    order
  });
}

export async function deleteCalmKitAction(userId: string, id: number) {
  await db.delete(calmKit).where(eq(calmKit.id, id));
}

// ─── Intentions ───
export async function getTodayIntentionAction(userId: string, dateKey: string) {
  if (!userId) return null;
  const result = await db.select().from(intentions).where(and(eq(intentions.userId, userId), eq(intentions.date, dateKey))).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function addIntentionAction(userId: string, dateKey: string, text: string) {
  await ensureUserExists(userId);
  await db.insert(intentions).values({
    userId,
    date: dateKey,
    text
  });
}
