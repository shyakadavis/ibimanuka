import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
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
