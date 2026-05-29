"use client";

import useSWR from "swr";
import { getJournalEntriesAction, getMoodHistoryAction, getCalmKitAction, getTodayIntentionAction } from "@/app/actions/db";
import { getLatestWeeklyInsightAction } from "@/app/actions/analytics";
import { useUserId } from "./use-user-id";
import { getTodayKey } from "@/lib/utils";

// Fetchers wrap the server actions and inject the userId
const journalFetcher = (userId: string) => getJournalEntriesAction(userId);
const moodFetcher = (userId: string) => getMoodHistoryAction(userId);
const calmKitFetcher = (userId: string) => getCalmKitAction(userId);
const intentionFetcher = (userId: string, date: string) => getTodayIntentionAction(userId, date);
const insightFetcher = (userId: string) => getLatestWeeklyInsightAction(userId);

export function useJournalEntries() {
  const userId = useUserId();
  const { data, mutate } = useSWR(userId ? ["journal", userId] : null, () => journalFetcher(userId!));
  return { data: data || [], mutate };
}

export function useMoodHistory() {
  const userId = useUserId();
  const { data, mutate } = useSWR(userId ? ["mood", userId] : null, () => moodFetcher(userId!));
  return { data: data || [], mutate };
}

export function useCalmKit() {
  const userId = useUserId();
  const { data, mutate } = useSWR(userId ? ["calmkit", userId] : null, () => calmKitFetcher(userId!));
  return { data: data || [], mutate };
}

export function useTodayIntention() {
  const userId = useUserId();
  const dateKey = getTodayKey();
  const { data, mutate } = useSWR(userId ? ["intention", userId, dateKey] : null, () => intentionFetcher(userId!, dateKey));
  return { data: data || null, mutate };
}

export function useLatestWeeklyInsight() {
  const userId = useUserId();
  const { data, mutate } = useSWR(userId ? ["weeklyInsight", userId] : null, () => insightFetcher(userId!));
  return { data: data || null, mutate };
}
