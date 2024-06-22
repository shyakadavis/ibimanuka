import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

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
 * @name category_schema
 * @description Schema for categories. Used for various validation and serialization tasks.
 * @example const category_schema.omit({id: true, created_at: true,updated_at: true}) can be used to create a ~/db/schemas for creating a new category.
 */
export const category_schema = createInsertSchema(categories);
