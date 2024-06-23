import type { z } from "zod";

/**
 * Converts a `fields` query string into a column selection object for Drizzle ORM.
 * @param schema - Zod schema defining the structure
 * @param fields - Comma-separated string of field names
 * @returns Object with selected fields as true
 */
// biome-ignore lint: any type is used here because the schema is dynamic and cannot be inferred
export function parse_fields_to_columns<T extends z.ZodObject<any, any>>(
	schema: T,
	fields: string,
): Partial<Record<keyof z.infer<T>, boolean>> {
	// first grab the keys of the relevant db/zod schema
	const schema_keys = Object.keys(schema.shape) as Array<keyof z.infer<T>>;
	// drizzle determines which columns to return on a key-<boolean> basis. e.g {name: true, longitude: true}
	const columns: Partial<Record<keyof z.infer<T>, boolean>> = {};

	const fields_array = fields.split(",");

	for (const field of fields_array) {
		if (schema_keys.includes(field as keyof z.infer<T>)) {
			columns[field as keyof z.infer<T>] = true;
		}
	}

	return columns;
}
