import { createRoute } from "@hono/zod-openapi";
import { district_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_district_param_schema,
	get_districts_query_params_schema,
	get_single_district_param_schema,
	update_district_param_schema,
} from "./schemas";

export const get_all_districts = createRoute({
	method: "get",
	path: "/",
	tags: ["Districts"],
	summary: "Get all districts",
	description:
		"Returns a list of all districts. You can filter by `province`, and paginate using `limit` and `offset`.",
	request: { query: get_districts_query_params_schema },
	responses: {
		200: {
			description: "Returns a list of all districts",
			content: {
				"application/json": {
					schema: success_with_data_schema(district_schema.array()),
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
	request: { params: get_single_district_param_schema },
	responses: {
		200: {
			description: "Returns a single district",
			content: {
				"application/json": {
					schema: success_with_data_schema(district_schema.openapi("District")),
				},
			},
		},
		...error_responses,
	},
});

export const get_all_district_districts = createRoute({
	method: "get",
	path: "/{id}/districts",
	tags: ["Districts"],
	summary: "Get all districts in a district",
	description:
		"Returns a list of all districts in a district by its `id`. Can return a subset of districts by using the `limit` and `offset` query parameters.",
	request: {
		params: get_single_district_param_schema,
		query: get_districts_query_params_schema,
	},
	responses: {
		200: {
			description: "Returns a list of all districts in a district",
			content: {
				"application/json": {
					schema: success_with_data_schema(district_schema.array()),
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
