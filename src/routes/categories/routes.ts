import { createRoute } from "@hono/zod-openapi";
import { category_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_category_request_schema,
	get_categories_request_schema,
	update_category_request_schema,
} from "./schemas";

export const get_all_categories = createRoute({
	method: "get",
	path: "/",
	tags: ["Categories"],
	summary: "Get all categories",
	description:
		"Returns a list of all categories. Can return a subset of categories by using the `limit` and `offset` query parameters.",
	request: { query: get_categories_request_schema.omit({ id: true }) },
	responses: {
		200: {
			description: "Returns a list of all categories",
			content: {
				"application/json": {
					schema: success_with_data_schema(category_schema.array()),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_category = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Categories"],
	summary: "Get a single category",
	description: "Returns a single category by its `id`.",
	request: {
		params: get_categories_request_schema.pick({ id: true }),
		query: get_categories_request_schema.omit({
			id: true,
			limit: true,
			offset: true,
		}),
	},
	responses: {
		200: {
			description: "Returns a single category",
			content: {
				"application/json": {
					schema: success_with_data_schema(category_schema.openapi("Category")),
				},
			},
		},
		...error_responses,
	},
});

export const create_category = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated, is_admin],
	tags: ["Categories"],
	summary: "Create a new category",
	description:
		"Creates a new category. Requires a unique `name` and a `description`.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: category_schema.omit({
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
			description: "Category created.",
		},
		...error_responses,
	},
});

export const update_category = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Categories"],
	summary: "Update a category",
	description:
		"Updates a category by its `id`. Requires a unique `name` and a `description`.",
	request: {
		params: update_category_request_schema,
		body: {
			content: {
				"application/json": {
					schema: category_schema.omit({
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
			description: "Category updated.",
		},
		...error_responses,
	},
});

export const delete_category = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Categories"],
	summary: "Delete a category",
	description: "Deletes a category by its `id`.",
	request: { params: delete_category_request_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Category deleted.",
		},
		...error_responses,
	},
});
