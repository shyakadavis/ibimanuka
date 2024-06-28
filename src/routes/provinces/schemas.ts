import { z } from "@hono/zod-openapi";

export const get_provinces_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the province to retrieve",
			},
			example: "prv_DEjnvJqDnPuP",
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
				description: "The number of provinces to return",
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
				description: "The number of provinces to skip",
			},
			example: "0",
		}),

	districts: z
		.string()
		.transform(Boolean)
		.optional()
		.openapi({
			param: {
				name: "districts",
				in: "query",
				description: "Whether to include districts in the response",
			},
			example: "true",
		}),

	district_fields: z
		.string()
		.optional()
		.openapi({
			param: {
				name: "district_fields",
				in: "query",
				description: "The fields to return for districts",
			},
			example: "name,longitude,latitude",
		}),

	district_limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "district_limit",
				in: "query",
				description: "The number of districts to return",
			},
			example: "10",
		}),
});

export const update_province_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the province to update",
			},
			example: "prv_DEjnvJqDnPuP",
		}),
});

export const delete_province_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the province to delete",
			},
			example: "prv_DEjnvJqDnPuP",
		}),
});
