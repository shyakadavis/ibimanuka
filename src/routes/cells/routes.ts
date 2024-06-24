import { createRoute } from "@hono/zod-openapi";
import { cell_schema, village_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_cell_request_schema,
	get_cells_request_schema,
	update_cell_request_schema,
} from "./schemas";

export const get_all_cells = createRoute({
	method: "get",
	path: "/",
	tags: ["Cells"],
	summary: "Get all cells",
	description:
		"Returns a list of all cells. You can filter by `limit`, `offset`, `fields`, and `villages`.",
	request: { query: get_cells_request_schema.omit({ id: true }) },
	responses: {
		200: {
			description: "Returns a list of all cells",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						cell_schema
							.extend({
								villages: village_schema.array().optional(),
							})
							.array(),
					),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_cell = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Cells"],
	summary: "Get a single cell",
	description: "Returns a single cell by its `id`.",
	request: {
		// from the request, we only need the id as a parameter
		params: get_cells_request_schema.pick({ id: true }),
		// we don't need the id, limit, and offset in the query because we are getting a single cell
		query: get_cells_request_schema.omit({
			id: true,
			limit: true,
			offset: true,
		}),
	},
	responses: {
		200: {
			description: "Returns a single cell",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						cell_schema
							.extend({
								villages: village_schema.array().optional(),
							})
							.openapi("Cell"),
					),
				},
			},
		},
		...error_responses,
	},
});

export const create_cell = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated, is_admin],
	tags: ["Cells"],
	summary: "Create a new cell",
	description:
		"Creates a new cell. Requires a unique `name` and a `description`.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: cell_schema.omit({
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
			description: "Cell created.",
		},
		...error_responses,
	},
});

export const update_cell = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Cells"],
	summary: "Update a cell",
	description:
		"Updates a cell by its `id`. Requires a unique `name` and a `description`.",
	request: {
		params: update_cell_request_schema,
		body: {
			content: {
				"application/json": {
					schema: cell_schema.omit({
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
			description: "Cell updated.",
		},
		...error_responses,
	},
});

export const delete_cell = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Cells"],
	summary: "Delete a cell",
	description: "Deletes a cell by its `id`.",
	request: { params: delete_cell_request_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Cell deleted.",
		},
		...error_responses,
	},
});
