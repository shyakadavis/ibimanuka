import { z } from "@hono/zod-openapi";

export const get_districts_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the district to retrieve",
			},
			example: "dct_DEjnvJqDnPuP",
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

	limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "The number of districts to return",
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
				description: "The number of districts to skip",
			},
			example: "0",
		}),

	sectors: z
		.string()
		.transform(Boolean)
		.optional()
		.openapi({
			param: {
				name: "sectors",
				in: "query",
				description: "Whether to include sectors in the response",
			},
			example: "true",
		}),

	sector_fields: z
		.string()
		.optional()
		.openapi({
			param: {
				name: "sector_fields",
				in: "query",
				description: "The fields to return for sectors",
			},
			example: "name,longitude,latitude",
		}),

	sector_limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "sector_limit",
				in: "query",
				description: "The number of sectors to return",
			},
			example: "10",
		}),
});

export const update_district_param_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the district to update",
			},
			example: "dct_DEjnvJqDnPuP",
		}),
});

export const delete_district_param_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the district to delete",
			},
			example: "dct_DEjnvJqDnPuP",
		}),
});
