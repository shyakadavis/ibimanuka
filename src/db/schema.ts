import {
	boolean,
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
 * @name role_enum
 * @description Enum for role as used on tables such as users
 */
export const role_enum = pgEnum("role", ["USER", "ADMIN"]);

// ============================================================================
// Tables
// ============================================================================

/**
 * @name users
 * @description Table for users
 */
export const users = pgTable(
	"users",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 64 }).notNull(),
		given_name: varchar("given_name", { length: 64 }),
		surname: varchar("surname", { length: 64 }),
		email: varchar("email", { length: 256 }).notNull().unique(),
		email_verified: boolean("email_verified").notNull().default(false),
		hashed_password: varchar("hashed_password"),
		role: role_enum("role").notNull().default("USER"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ email, name }) => {
		return {
			email_index: index("users_email_index").on(email.asc()),
			name_index: index("users_name_index").on(name.asc()),
		};
	},
);

/**
 * @name sessions
 * @description Table for sessions.
 * Note: We are leaving camelCase instances because of some strictness with Lucia about type mismatches.
 */
export const sessions = pgTable("sessions", {
	id: varchar("id").primaryKey(),
	userId: varchar("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

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
 * @name categories
 * @description Table for categories
 */
export const categories = pgTable(
	"categories",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: varchar("description", { length: 256 }).notNull(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ name }) => {
		return { name_index: index("categories_name_index").on(name.asc()) };
	},
);

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
 * @name User
 * @description Type for users. We are refining the `email` field to be of a valid email type.
 */
export const User = createInsertSchema(users, {
	email: z.string().email(),
});

/**
 * @name RiddleSchema
 * @description Schema for riddles. Used for various validation and serialization tasks.
 ⚠️ We are manually refining array fields because `drizzle-zod` does not parse arrays correctly. See: https://github.com/drizzle-team/drizzle-orm/issues/1609
 * @example const RidleSchema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new riddle.
 */
export const RiddleSchema = createInsertSchema(riddles, {
	categories: z.array(z.string().max(16)),
	hints: z.array(z.string().max(256)),
});

/**
 * @name CategorySchema
 * @description Schema for categories. Used for various validation and serialization tasks.
 * @example const CategorySchema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new category.
 */
export const CategorySchema = createInsertSchema(categories);
