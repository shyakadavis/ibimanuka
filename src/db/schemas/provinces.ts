import { relations } from "drizzle-orm";
import {
	doublePrecision,
	index,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { districts } from "./districts";

/**
 * @name provinces
 * @description Table for provinces (Intara)
 */
export const provinces = pgTable(
	"provinces",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: varchar("description", { length: 256 }),
		latitude: doublePrecision("latitude"),
		longitude: doublePrecision("longitude"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ name }) => {
		return { name_index: index("provinces_name_index").on(name.asc()) };
	},
);

/**
 * @name province_schema
 * @description Schema for provinces. Used for various validation and serialization tasks.
 * @example const province_schema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new province.
 */
export const province_schema = createInsertSchema(provinces);

export const provinces_relations = relations(provinces, ({ many }) => ({
	districts: many(districts),
}));
