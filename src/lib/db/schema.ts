import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // UUID stored in localStorage
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  content: text("content").notNull(),
  emotion: varchar("emotion", { length: 100 }),
  aiReflection: text("ai_reflection"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const moodHistory = pgTable("mood_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  mood: varchar("mood", { length: 100 }).notNull(),
  intensity: integer("intensity").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calmKit = pgTable("calm_kit", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  type: varchar("type", { length: 100 }).notNull(), // 'contact', 'quote', 'strategy'
  name: varchar("name", { length: 255 }).notNull(),
  value: text("value").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const intentions = pgTable("intentions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  date: varchar("date", { length: 100 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weeklyInsights = pgTable("weekly_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  insightText: text("insight_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiMemory = pgTable("ai_memory", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  trigger: text("trigger").notNull(),
  copingStrategy: text("coping_strategy").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
