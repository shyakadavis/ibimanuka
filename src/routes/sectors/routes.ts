import { createRoute } from "@hono/zod-openapi";
import { cell_schema, sector_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_sector_param_schema,
	get_sectors_request_schema,
	update_sector_param_schema,
} from "./schemas";

export const get_all_sectors = createRoute({
	method: "get",
	path: "/",
	tags: ["Sectors"],
	summary: "Get all sectors",
	description:
		"Returns a list of all sectors. You can filter by `limit`, `offset`, `fields`, and `cells`.",
	request: { query: get_sectors_request_schema.omit({ id: true }) },
	responses: {
		200: {
			description: "Returns a list of all sectors",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						sector_schema
							.extend({
								cells: cell_schema.array().optional(),
							})
							.array(),
					),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_sector = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Sectors"],
	summary: "Get a single sector",
	description: "Returns a single sector by its `id`.",
	request: {
		// from the request, we only need the id as a parameter
		params: get_sectors_request_schema.pick({ id: true }),
		// we don't need the id, limit, and offset in the query because we are getting a single sector
		query: get_sectors_request_schema.omit({
			id: true,
			limit: true,
			offset: true,
		}),
	},
	responses: {
		200: {
			description: "Returns a single sector",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						sector_schema
							.extend({
								cells: cell_schema.array().optional(),
							})
							.openapi("District"),
					),
				},
			},
		},
		...error_responses,
	},
});

export const create_sector = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated, is_admin],
	tags: ["Sectors"],
	summary: "Create a new sector",
	description:
		"Creates a new sector. Requires a unique `name` and a `description`.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: sector_schema.omit({
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
			description: "District created.",
		},
		...error_responses,
	},
});

export const update_sector = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Sectors"],
	summary: "Update a sector",
	description:
		"Updates a sector by its `id`. Requires a unique `name` and a `description`.",
	request: {
		params: update_sector_param_schema,
		body: {
			content: {
				"application/json": {
					schema: sector_schema.omit({
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
			description: "District updated.",
		},
		...error_responses,
	},
});

export const delete_sector = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Sectors"],
	summary: "Delete a sector",
	description: "Deletes a sector by its `id`.",
	request: { params: delete_sector_param_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "District deleted.",
		},
		...error_responses,
	},
});
