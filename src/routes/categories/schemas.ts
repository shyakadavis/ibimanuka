import { z } from "@hono/zod-openapi";

export const get_categories_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the category to retrieve",
			},
			example: "cat_DEjnvJqDnPuP",
		}),

	limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "The number of categories to return",
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
				description: "The number of categories to skip",
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
			example: "name,description",
		}),
});

export const update_category_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the category to update",
			},
			example: "cat_DEjnvJqDnPuP",
		}),
});

export const delete_category_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the category to delete",
			},
			example: "cat_DEjnvJqDnPuP",
		}),
});
