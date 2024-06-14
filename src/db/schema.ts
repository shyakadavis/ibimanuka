import { sql } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * @name complexity_level_enum
 * @description Enum for complexity_level as used on tables such as riddles
 */
export const complexity_level_enum = pgEnum("complexity_level", [
  "LEVEL_1",
  "LEVEL_2",
  "LEVEL_3",
  "LEVEL_4",
  "LEVEL_5",
  "LEVEL_6",
  "LEVEL_7",
]);

// ============================================================================
// Tables
// ============================================================================

/**
 * @name riddles
 * @description Table for riddles (ibisakuzo)
 */
export const riddles = pgTable("riddles", {
  id: varchar("id", { length: 16 }).primaryKey().notNull(),
  question: varchar("question", { length: 256 }).notNull(),
  answer: varchar("answer", { length: 16 }).notNull(),
  categories: varchar("categories", { length: 16 })
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),
  hints: varchar("hints", { length: 256 })
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),
  complexity_level: complexity_level_enum("complexity_level").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * @name categories
 * @description Table for categories
 */
export const categories = pgTable("categories", {
  id: varchar("id", { length: 16 }).primaryKey().notNull(),
  name: varchar("name", { length: 16 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * TODO: Add table for riddle shuffle
 * @name Riddle Shuffle Table
 * @description
 */

// ============================================================================
// Relations
// ============================================================================
