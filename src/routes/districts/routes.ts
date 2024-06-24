import { createRoute } from "@hono/zod-openapi";
import { district_schema, sector_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_district_param_schema,
	get_districts_request_schema,
	update_district_param_schema,
} from "./schemas";

export const get_all_districts = createRoute({
	method: "get",
	path: "/",
	tags: ["Districts"],
	summary: "Get all districts",
	description:
		"Returns a list of all districts. You can filter by `province`, and paginate using `limit` and `offset`.",
	request: { query: get_districts_request_schema.omit({ id: true }) },
	responses: {
		200: {
			description: "Returns a list of all districts",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						district_schema
							.extend({
								sectors: sector_schema.array().optional(),
							})
							.array(),
					),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_district = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Districts"],
	summary: "Get a single district",
	description: "Returns a single district by its `id`.",
	request: {
		// from the request, we only need the id as a parameter
		params: get_districts_request_schema.pick({ id: true }),
		// we don't need the id, limit, and offset in the query because we are getting a single district
		query: get_districts_request_schema.omit({
			id: true,
			limit: true,
			offset: true,
		}),
	},
	responses: {
		200: {
			description: "Returns a single district",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						district_schema
							.extend({
								sectors: sector_schema.array().optional(),
							})
							.openapi("District"),
					),
				},
			},
		},
		...error_responses,
	},
});

export const create_district = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated, is_admin],
	tags: ["Districts"],
	summary: "Create a new district",
	description:
		"Creates a new district. Requires a unique `name` and a `description`.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: district_schema.omit({
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

export const update_district = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Districts"],
	summary: "Update a district",
	description:
		"Updates a district by its `id`. Requires a unique `name` and a `description`.",
	request: {
		params: update_district_param_schema,
		body: {
			content: {
				"application/json": {
					schema: district_schema.omit({
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

export const delete_district = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Districts"],
	summary: "Delete a district",
	description: "Deletes a district by its `id`.",
	request: { params: delete_district_param_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "District deleted.",
		},
		...error_responses,
	},
});
