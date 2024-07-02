import {
	doublePrecision,
	index,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { villages } from "./villages";

export const mountains = pgTable(
	"mountains",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: varchar("description", { length: 256 }),
		elevation: varchar("elevation", { length: 16 }).notNull(),
		latitude: doublePrecision("latitude").notNull(),
		longitude: doublePrecision("longitude").notNull(),
		native_name: varchar("native_name", { length: 16 }),
		aliases: varchar("hints", { length: 16 }).array(),
		location: varchar("location", { length: 16 })
			.notNull()
			.references(() => villages.id, { onDelete: "no action" }),
		parent_range: varchar("parent_range", { length: 16 }),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ name }) => {
		return { name_index: index("mountains_name_index").on(name.asc()) };
	},
);

export const mountain_schema = createInsertSchema(mountains);
