import { createRoute } from "@hono/zod-openapi";
import { district_schema, province_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_province_request_schema,
	get_provinces_request_schema,
	update_province_request_schema,
} from "./schemas";

export const get_all_provinces = createRoute({
	method: "get",
	path: "/",
	tags: ["Provinces"],
	summary: "Get all provinces",
	description:
		"Returns a list of all provinces.\n\nYou can also include the `districts` query parameter to include all districts in each province.",
	request: { query: get_provinces_request_schema.omit({ id: true }) },
	responses: {
		200: {
			description: "Returns a list of all provinces",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						province_schema
							.extend({
								districts: district_schema.array().optional(),
							})
							.array(),
					),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_province = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Provinces"],
	summary: "Get a single province",
	description: "Returns a single province by its `id`.",
	request: {
		params: get_provinces_request_schema.pick({ id: true }),
		query: get_provinces_request_schema.omit({
			id: true,
			limit: true,
			offset: true,
		}),
	},
	responses: {
		200: {
			description: "Returns a single province",
			content: {
				"application/json": {
					schema: success_with_data_schema(province_schema.openapi("Province")),
				},
			},
		},
		...error_responses,
	},
});

export const create_province = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated, is_admin],
	tags: ["Provinces"],
	summary: "Create a new province",
	description:
		"Creates a new province. Requires a unique `name` and a `description`.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: province_schema.omit({
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
			description: "Province created.",
		},
		...error_responses,
	},
});

export const update_province = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Provinces"],
	summary: "Update a province",
	description:
		"Updates a province by its `id`. Requires a unique `name` and a `description`.",
	request: {
		params: update_province_request_schema,
		body: {
			content: {
				"application/json": {
					schema: province_schema.omit({
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
			description: "Province updated.",
		},
		...error_responses,
	},
});

export const delete_province = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Provinces"],
	summary: "Delete a province",
	description: "Deletes a province by its `id`.",
	request: { params: delete_province_request_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Province deleted.",
		},
		...error_responses,
	},
});
