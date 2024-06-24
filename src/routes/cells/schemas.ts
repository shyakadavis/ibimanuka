import { z } from "@hono/zod-openapi";

export const get_cells_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the cell to retrieve",
			},
			example: "cel_DEjnvJqDnPuP",
		}),

	limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "The number of cells to return",
			},
			example: "10",
		}),

	offset: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "offset",
				in: "query",
				description: "The number of cells to skip",
			},
			example: "0",
		}),

	fields: z
		.string()
		.optional()
		.openapi({
			param: {
				name: "fields",
				in: "query",
				description: "The fields to return",
			},
			example: "name,longitude,latitude",
		}),

	villages: z
		.string()
		.transform(Boolean)
		.optional()
		.openapi({
			param: {
				name: "villages",
				in: "query",
				description: "Whether to include villages in the response",
			},
			example: "true",
		}),

	village_limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "village_limit",
				in: "query",
				description: "The number of villages to return",
			},
			example: "10",
		}),

	village_fields: z
		.string()
		.optional()
		.openapi({
			param: {
				name: "village_fields",
				in: "query",
				description: "The fields to return for villages",
			},
			example: "name,longitude,latitude",
		}),
});

export const update_cell_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the cell to update",
			},
			example: "cel_DEjnvJqDnPuP",
		}),
});

export const delete_cell_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the cell to delete",
			},
			example: "cel_DEjnvJqDnPuP",
		}),
});
