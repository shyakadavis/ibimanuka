import { relations } from "drizzle-orm";
import {
	doublePrecision,
	index,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { villages } from "./villages";

export const mountains = pgTable(
	"mountains",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		// TODO
		// Think about using a field that accommodates more AST or the output of a WYSIWYG editor
		description: text("description").notNull(),
		elevation: doublePrecision("elevation").notNull(),
		latitude: doublePrecision("latitude").notNull(),
		longitude: doublePrecision("longitude").notNull(),
		native_name: varchar("native_name", { length: 16 }),
		aliases: varchar("hints", { length: 16 }).array(),
		village_id: varchar("location", { length: 16 })
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

export const mountain_schema = createInsertSchema(mountains, {
	aliases: z.array(z.string().max(16)),
});

export const mountain_relations = relations(mountains, ({ one }) => ({
	location: one(villages, {
		fields: [mountains.village_id],
		references: [villages.id],
	}),
}));
