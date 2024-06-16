import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

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
  categories: varchar("categories", { length: 16 }).array().notNull(),
  hints: varchar("hints", { length: 256 }).array().notNull(),
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
  name: varchar("name", { length: 16 }).notNull().unique(),
  description: varchar("description", { length: 256 }).notNull(),
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

// ============================================================================
// Types
// ============================================================================

/**
 * @name insert_riddle_schema
 * @description Schema for inserting a riddle - can be used to validate API requests
 */
export const insert_riddle_schema = createInsertSchema(riddles)
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({ id: true });

/**
 * @name insert_category_schema
 * @description Schema for inserting a category - can be used to validate API requests
 */
export const insert_category_schema = createInsertSchema(categories)
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({ id: true });

/**
 * @name update_category_schema
 * @description Schema for updating a category - can be used to validate API requests
 */
export const update_category_schema = createInsertSchema(categories)
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial();
