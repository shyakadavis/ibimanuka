import { z } from "@hono/zod-openapi";

export const get_sectors_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the sector to retrieve",
			},
			example: "sec_DEjnvJqDnPuP",
		}),

	limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "The number of sectors to return",
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
				description: "The number of sectors to skip",
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

	cells: z
		.string()
		.transform(Boolean)
		.optional()
		.openapi({
			param: {
				name: "cells",
				in: "query",
				description: "Whether to include cells in the response",
			},
			example: "true",
		}),

	cell_limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "cell_limit",
				in: "query",
				description: "The number of cells to return",
			},
			example: "10",
		}),

	cell_fields: z
		.string()
		.optional()
		.openapi({
			param: {
				name: "cell_fields",
				in: "query",
				description: "The fields to return for cells",
			},
			example: "name,longitude,latitude",
		}),
});

export const update_sector_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the sector to update",
			},
			example: "sec_DEjnvJqDnPuP",
		}),
});

export const delete_sector_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the sector to delete",
			},
			example: "sec_DEjnvJqDnPuP",
		}),
});
