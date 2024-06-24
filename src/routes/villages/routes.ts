import { createRoute } from "@hono/zod-openapi";
import { village_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_village_request_schema,
	get_villages_request_schema,
	update_village_request_schema,
} from "./schemas";

export const get_all_villages = createRoute({
	method: "get",
	path: "/",
	tags: ["Villages"],
	summary: "Get all villages",
	description:
		"Returns a list of all villages. Can be paginated using `limit` and `offset`.",
	request: { query: get_villages_request_schema.omit({ id: true }) },
	responses: {
		200: {
			description: "Returns a list of all villages",
			content: {
				"application/json": {
					schema: success_with_data_schema(village_schema.array()),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_village = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Villages"],
	summary: "Get a single village",
	description: "Returns a single village by its `id`.",
	request: {
		params: get_villages_request_schema.pick({ id: true }),
		query: get_villages_request_schema.omit({
			id: true,
			limit: true,
			offset: true,
		}),
	},
	responses: {
		200: {
			description: "Returns a single village",
			content: {
				"application/json": {
					schema: success_with_data_schema(village_schema.openapi("Village")),
				},
			},
		},
		...error_responses,
	},
});

export const create_village = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated, is_admin],
	tags: ["Villages"],
	summary: "Create a new village",
	description:
		"Creates a new village. Requires a unique `name` and a `description`.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: village_schema.omit({
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
			description: "Village created.",
		},
		...error_responses,
	},
});

export const update_village = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Villages"],
	summary: "Update a village",
	description:
		"Updates a village by its `id`. Requires a unique `name` and a `description`.",
	request: {
		params: update_village_request_schema,
		body: {
			content: {
				"application/json": {
					schema: village_schema.omit({
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
			description: "Village updated.",
		},
		...error_responses,
	},
});

export const delete_village = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Villages"],
	summary: "Delete a village",
	description: "Deletes a village by its `id`.",
	request: { params: delete_village_request_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Village deleted.",
		},
		...error_responses,
	},
});
