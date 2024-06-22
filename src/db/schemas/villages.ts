import { relations } from "drizzle-orm";
import {
	doublePrecision,
	index,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { cells } from "./cells";

/**
 * @name villages
 * @description Table for villages (Umudugudu/Imidugudu)
 */
export const villages = pgTable(
	"villages",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: varchar("description", { length: 256 }).notNull(),
		sector_id: varchar("sector_id", { length: 16 })
			.notNull()
			.references(() => cells.id, { onDelete: "cascade" }),
		latitude: doublePrecision("latitude").notNull(),
		longitude: doublePrecision("longitude").notNull(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ name }) => {
		return { name_index: index("villages_name_index").on(name.asc()) };
	},
);

/**
 * @name village_schema
 * @description Schema for villages. Used for various validation and serialization tasks.
 * @example const village_schema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new village.
 */
export const village_schema = createInsertSchema(villages);

export const villages_relations = relations(villages, ({ one, many }) => ({
	cell: one(cells, {
		fields: [villages.sector_id],
		references: [cells.id],
	}),
	// TODO: Is it possible to reference provinces, districts, sectors from villages?
}));
