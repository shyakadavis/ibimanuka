import { createRoute } from "@hono/zod-openapi";
import { RiddleSchema } from "~/db/schema";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_riddle_param_schema,
	get_riddles_query_params_schema,
	get_single_riddle_param_schema,
	update_riddle_param_schema,
} from "./schemas";

export const get_all_riddles = createRoute({
	method: "get",
	path: "/",
	tags: ["Riddles"],
	summary: "Get all riddles",
	description:
		"Returns a list of all riddles. Can return a subset of riddles by using the `limit` and `offset` query parameters.",
	request: { query: get_riddles_query_params_schema },
	responses: {
		200: {
			description: "Returns a list of all riddles",
			content: {
				"application/json": {
					schema: success_with_data_schema(RiddleSchema.array()),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_riddle = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Riddles"],
	summary: "Get a single riddle",
	description: "Returns a single riddle by its `id`.",
	request: { params: get_single_riddle_param_schema },
	responses: {
		200: {
			description: "Returns a single riddle",
			content: {
				"application/json": {
					schema: success_with_data_schema(RiddleSchema.openapi("Riddle")),
				},
			},
		},
		...error_responses,
	},
});

export const create_riddle = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated],
	tags: ["Riddles"],
	summary: "Create a new riddle",
	description:
		"Creates a new riddle. Requires a unique `name` and a `description`.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: RiddleSchema.omit({
						id: true,
						created_at: true,
						updated_at: true,
					}),
				},
			},
		},
	},
	responses: {
		201: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Riddle created.",
		},
		...error_responses,
	},
});

export const update_riddle = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated],
	tags: ["Riddles"],
	summary: "Update a riddle",
	description:
		"Updates a riddle by its `id`. Requires a unique `name` and a `description`.",
	request: {
		params: update_riddle_param_schema,
		body: {
			content: {
				"application/json": {
					schema: RiddleSchema.omit({
						id: true,
						created_at: true,
						updated_at: true,
					}),
				},
			},
		},
	},
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Riddle updated.",
		},
		...error_responses,
	},
});

export const delete_riddle = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated],
	tags: ["Riddles"],
	summary: "Delete a riddle",
	description: "Deletes a riddle by its `id`.",
	request: { params: delete_riddle_param_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Riddle deleted.",
		},
		...error_responses,
	},
});
