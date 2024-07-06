import { relations } from "drizzle-orm";
import {
	doublePrecision,
	index,
	jsonb,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { villages } from "./villages";

/**
 * @name mountains
 * @description Table for mountains (Ikirunga/Ibirunga)
 */
export const mountains = pgTable(
	"mountains",
	{
		id: varchar("id", { length: 16 }).primaryKey().notNull(),
		name: varchar("name", { length: 16 }).notNull().unique(),
		description: jsonb("description").notNull(),
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

// declare interface NodeJSON {
//     type: string;
//     marks?: Array<any>;
//     text?: string;
//     content?: NodeJSON[];
//     attrs?: Record<string, any>;
// }

const base_doc_schema = z.object({
	type: z.literal("doc"),
	marks: z.array(z.any()).optional(),
	text: z.string().optional(),
	attrs: z.record(z.any()).optional(),
});

type Doc = z.infer<typeof base_doc_schema> & {
	content?: Doc[];
};

const doc_schema: z.ZodType<Doc> = base_doc_schema.extend({
	// ⚠️ recursively expressing `content` as an array of Docs breaks  either `zod-openapi` or `scalar`. This doesn't make sense 🫤
	// content: z.lazy(() => doc_schema.array().optional()),
	// As such, we are settling for this hack. If anyone figures out a fix, please send a P.R. Thanks. 🙂
	content: z.array(z.any()).optional(),
});

/**
 * @name mountain_schema
 * @description Schema for mountains. Used for various validation and serialization tasks.
 ⚠️ We are manually refining array fields because `drizzle-zod` does not parse arrays correctly. See: https://github.com/drizzle-team/drizzle-orm/issues/1609
 * @example const mountain_schema.omit({id: true, created_at: true,updated_at: true}) can be used to create a schema for creating a new mountain.
 */
export const mountain_schema = createInsertSchema(mountains, {
	aliases: z.array(z.string().max(16)),
	description: doc_schema,
});

/**
 * @name mountain_relations
 * @description Relations for mountains. Used to fetch related data from other tables.
 */
export const mountain_relations = relations(mountains, ({ one }) => ({
	location: one(villages, {
		fields: [mountains.village_id],
		references: [villages.id],
	}),
}));
