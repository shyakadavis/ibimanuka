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
 * @name role_enum
 * @description Enum for role as used on tables such as users
 */
export const role_enum = pgEnum("role", ["USER", "ADMIN"]);

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
 * @name user_schema
 * @description Type for users. We are refining the `email` field to be of a valid email type.
 */
export const user_schema = createInsertSchema(users, {
  email: z.string().email(),
});
