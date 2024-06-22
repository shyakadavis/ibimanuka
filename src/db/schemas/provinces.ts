import {
	doublePrecision,
	index,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

/**
 * @name provinces
 * @description Table for provinces (Intara)
 */
export const provinces = pgTable(
	"provinces",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: varchar("description", { length: 256 }).notNull(),
		latitude: doublePrecision("latitude").notNull(),
		longitude: doublePrecision("longitude").notNull(),
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
