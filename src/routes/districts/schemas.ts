import { z } from "@hono/zod-openapi";

export const get_districts_query_params_schema = z.object({
	province: z
		.string()
		.min(16)
		.max(16)
		.optional()
		.openapi({
			param: {
				name: "province",
				in: "query",
				description: "The province ID for which to return districts",
			},
			example: "prv_FjR6NJtcQvpR",
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
});

export const get_single_district_param_schema = z.object({
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
