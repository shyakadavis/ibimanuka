import { relations } from "drizzle-orm";
import {
	doublePrecision,
	index,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { provinces } from "./provinces";
import { sectors } from "./sectors";

/**
 * @name districts
 * @description Table for districts (Akarere/Uturere)
 */
export const districts = pgTable(
	"districts",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: varchar("description", { length: 256 }),
		province_id: varchar("province_id", { length: 16 })
			.notNull()
			.references(() => provinces.id, { onDelete: "cascade" }),
		latitude: doublePrecision("latitude"),
		longitude: doublePrecision("longitude"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	({ name }) => {
		return { name_index: index("districts_name_index").on(name.asc()) };
	},
);

/**
 * @name district_schema
 * @description Schema for districts. Used for various validation and serialization tasks.
 * @example const district_schema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new district.
 */
export const district_schema = createInsertSchema(districts);

export const district_relations = relations(districts, ({ one, many }) => ({
	province: one(provinces, {
		fields: [districts.province_id],
		references: [provinces.id],
	}),
	sectors: many(sectors),
}));
