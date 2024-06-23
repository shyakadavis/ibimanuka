import { relations } from "drizzle-orm";
import {
	doublePrecision,
	index,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sectors } from "./sectors";
import { villages } from "./villages";

/**
 * @name cells
 * @description Table for cells (Akagari/Utugari)
 */
export const cells = pgTable(
	"cells",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: varchar("description", { length: 256 }).notNull(),
		sector_id: varchar("sector_id", { length: 16 })
			.notNull()
			.references(() => sectors.id, { onDelete: "cascade" }),
		latitude: doublePrecision("latitude"),
		longitude: doublePrecision("longitude"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ name }) => {
		return { name_index: index("cells_name_index").on(name.asc()) };
	},
);

/**
 * @name cell_schema
 * @description Schema for cells. Used for various validation and serialization tasks.
 * @example const cell_schema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new cell.
 */
export const cell_schema = createInsertSchema(cells);

export const cells_relations = relations(cells, ({ one, many }) => ({
	sector: one(sectors, {
		fields: [cells.sector_id],
		references: [sectors.id],
	}),
	// TODO: Is it possible to reference provinces, districts from cells?
	villages: many(villages),
}));
