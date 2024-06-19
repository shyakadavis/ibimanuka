import { z } from "@hono/zod-openapi";

export const get_riddles_query_params_schema = z.object({
	limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "The number of riddles to return",
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
				description: "The number of riddles to skip",
			},
			example: "0",
		}),
});

export const get_single_riddle_param_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the riddle to retrieve",
			},
			example: "rdl_FZbZjD3JJ5VQ",
		}),
});

export const update_riddle_param_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the riddle to update",
			},
			example: "rdl_FZbZjD3JJ5VQ",
		}),
});

export const delete_riddle_param_schema = z.object({
	id: z
		.string()
		.min(16)
		.max(16)
		.openapi({
			param: {
				name: "id",
				in: "path",
				description: "The ID of the riddle to delete",
			},
			example: "rdl_FZbZjD3JJ5VQ",
		}),
});
