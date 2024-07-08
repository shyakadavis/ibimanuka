import { z } from "@hono/zod-openapi";

export const get_mountains_request_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the mountain to retrieve",
			},
			example: "mtn_DEjnvJqDnPuP",
		}),

	fields: z
		.string()
		.optional()
		.openapi({
			param: {
				name: "fields",
				in: "query",
				description:
					"The fields to return. Each field is separated by a comma. If not provided, all fields are returned.\ne.g `name,elevation`",
			},
			example: "name,elevation",
		}),

	limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "The number of mountains to return",
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
				description: "The number of mountains to skip",
			},
			example: "0",
		}),

	location: z
		.string()
		.refine((val) => val === "true" || val === "false")
		.optional()
		.openapi({
			param: {
				name: "location",
				in: "query",
				description:
					"A boolean indicating whether to return the location of the mountain",
			},
			example: "true",
		}),
});

export const update_mountain_param_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the mountain to update",
			},
			example: "mtn_DEjnvJqDnPuP",
		}),
});

export const delete_mountain_param_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the mountain to delete",
			},
			example: "mtn_DEjnvJqDnPuP",
		}),
});
