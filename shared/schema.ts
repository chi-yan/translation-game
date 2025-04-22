import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the schema for users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Translation game data models
export const translationQuestionSchema = z.object({
  id: z.number(),
  chinese: z.string(),
  pinyin: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
});

export type TranslationQuestion = z.infer<typeof translationQuestionSchema>;

export const gameSessionSchema = z.object({
  questions: z.array(translationQuestionSchema),
  currentQuestionIndex: z.number().default(0),
  score: z.number().default(0),
  gameState: z.enum(["playing", "results"]).default("playing"),
});

export type GameSession = z.infer<typeof gameSessionSchema>;
