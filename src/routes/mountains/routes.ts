import { createRoute, z } from "@hono/zod-openapi";
import { mountain_schema } from "~/db/schemas";
import { is_admin } from "~/middleware/is-admin";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";
import {
	delete_mountain_param_schema,
	get_mountains_request_schema,
	update_mountain_param_schema,
} from "./schemas";

export const get_all_mountains = createRoute({
	method: "get",
	path: "/",
	tags: ["Mountains"],
	summary: "Get all mountains",
	description:
		"Returns a list of all mountains. You can paginate using `limit` and `offset`.",
	request: { query: get_mountains_request_schema.omit({ id: true }) },
	responses: {
		200: {
			description: "Returns a list of all mountains",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						mountain_schema
							// TODO
							// This looks like a lot of nesting, we should consider flattening this schema
							.extend({
								location: z
									.object({
										id: z.string(),
										name: z.string(),
										cell: z.object({
											id: z.string(),
											name: z.string(),
											sector: z.object({
												id: z.string(),
												name: z.string(),
												district: z.object({
													id: z.string(),
													name: z.string(),
													province: z.object({
														id: z.string(),
														name: z.string(),
													}),
												}),
											}),
										}),
									})
									.optional(),
							})
							.array(),
					),
				},
			},
		},
		...error_responses,
	},
});

export const get_single_mountain = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Mountains"],
	summary: "Get a single mountain",
	description: "Returns a single mountain by its `id`.",
	request: {
		// from the request, we only need the id as a parameter
		params: get_mountains_request_schema.pick({ id: true }),
		// we don't need the id, limit, and offset in the query because we are getting a single mountain
		query: get_mountains_request_schema.omit({
			id: true,
			limit: true,
			offset: true,
		}),
	},
	responses: {
		200: {
			description: "Returns a single mountain",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						mountain_schema
							.openapi("Mountain")
							// TODO
							// This looks like a lot of nesting, we should consider flattening this schema
							.extend({
								location: z
									.object({
										id: z.string(),
										name: z.string(),
										cell: z.object({
											id: z.string(),
											name: z.string(),
											sector: z.object({
												id: z.string(),
												name: z.string(),
												district: z.object({
													id: z.string(),
													name: z.string(),
													province: z.object({
														id: z.string(),
														name: z.string(),
													}),
												}),
											}),
										}),
									})
									.optional(),
							}),
					),
				},
			},
		},
		...error_responses,
	},
});

export const create_mountain = createRoute({
	method: "post",
	path: "/",
	middleware: [is_authenticated, is_admin],
	tags: ["Mountains"],
	summary: "Create a new mountain",
	description: "Creates a new mountain.",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: mountain_schema.omit({
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
			description: "Mountain created.",
		},
		...error_responses,
	},
});

export const update_mountain = createRoute({
	method: "put",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Mountains"],
	summary: "Update a mountain",
	description: "Updates a mountain by its `id`.",
	request: {
		params: update_mountain_param_schema,
		body: {
			content: {
				"application/json": {
					schema: mountain_schema.omit({
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
			description: "Mountain updated.",
		},
		...error_responses,
	},
});

export const delete_mountain = createRoute({
	method: "delete",
	path: "/{id}",
	middleware: [is_authenticated, is_admin],
	tags: ["Mountains"],
	summary: "Delete a mountain",
	description: "Deletes a mountain by its `id`.",
	request: { params: delete_mountain_param_schema },
	responses: {
		200: {
			content: { "application/json": { schema: success_without_data_schema } },
			description: "Mountain deleted.",
		},
		...error_responses,
	},
});
