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
import { districts } from "./districts";

/**
 * @name sectors
 * @description Table for sectors (Umurenge/Imirenge)
 */
export const sectors = pgTable(
	"sectors",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull(),
		description: varchar("description", { length: 256 }),
		district_id: varchar("district_id", { length: 16 })
			.notNull()
			.references(() => districts.id, { onDelete: "cascade" }),
		latitude: doublePrecision("latitude"),
		longitude: doublePrecision("longitude"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ name }) => {
		return { name_index: index("sectors_name_index").on(name.asc()) };
	},
);

/**
 * @name sector_schema
 * @description Schema for sectors. Used for various validation and serialization tasks.
 * @example const sector_schema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new sector.
 */
export const sector_schema = createInsertSchema(sectors);

export const sectors_relations = relations(sectors, ({ one, many }) => ({
	district: one(districts, {
		fields: [sectors.district_id],
		references: [districts.id],
	}),
	cells: many(cells),
}));
