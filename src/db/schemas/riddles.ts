import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

/**
 * @name riddles
 * @description Table for riddles (ibisakuzo)
 */
export const riddles = pgTable(
  "riddles",
  {
    id: varchar("id", { length: 16 }).primaryKey().notNull(),
    question: varchar("question", { length: 256 }).notNull(),
    answer: varchar("answer", { length: 16 }).notNull(),
    categories: varchar("categories", { length: 16 }).array().notNull(),
    hints: varchar("hints", { length: 256 }).array().notNull(),
    complexity_level: complexity_level_enum("complexity_level").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  ({ question, answer, categories }) => {
    return {
      question_index: index("riddles_question_index").on(question.asc()),
      answer_index: index("riddles_answer_index").on(answer.asc()),
      categories_index: index("riddles_categories_index").on(categories.asc()),
    };
  },
);

/**
 * @name riddle_schema
 * @description Schema for riddles. Used for various validation and serialization tasks.
 ⚠️ We are manually refining array fields because `drizzle-zod` does not parse arrays correctly. See: https://github.com/drizzle-team/drizzle-orm/issues/1609
 * @example const RidleSchema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new riddle.
 */
export const riddle_schema = createInsertSchema(riddles, {
  categories: z.array(z.string().max(16)),
  hints: z.array(z.string().max(256)),
});
