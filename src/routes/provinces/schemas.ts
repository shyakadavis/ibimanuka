import { z } from "@hono/zod-openapi";

export const get_provinces_query_params_schema = z.object({
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

	// TODO: Add the limit for the number of districts to return
});

export const get_single_province_param_schema = z.object({
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
});

export const update_province_param_schema = z.object({
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

export const delete_province_param_schema = z.object({
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
