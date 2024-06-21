import type { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import type { StatusCode } from "hono/utils/http-status";
import type { Lucia } from "lucia";
import { z } from "zod";

export const success_without_data_schema = z.object({
	success: z.boolean(),
	message: z.string(),
});

export const success_with_data_schema = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({ success: z.boolean(), message: z.string(), data: schema });

export const error_schema = z.object({
	message: z.string(),
	status: z.number(),
});

export const fail_with_error_schema = z.object({
	success: z.boolean().default(false),
	error: error_schema,
});

type Responses = Parameters<typeof createRoute>[0]["responses"];

export const error_responses = {
	400: {
		description: "Bad request: problem processing request.",
		content: {
			"application/json": {
				schema: fail_with_error_schema,
			},
		},
	},
	401: {
		description: "Unauthorized: authentication required.",
		content: {
			"application/json": {
				schema: fail_with_error_schema,
			},
		},
	},
	403: {
		description: "Forbidden: insufficient permissions.",
		content: {
			"application/json": {
				schema: fail_with_error_schema,
			},
		},
	},
	404: {
		description: "Not found: resource does not exist.",
		content: {
			"application/json": {
				schema: fail_with_error_schema,
			},
		},
	},
	500: {
		description: "Server error: something went wrong.",
		content: {
			"application/json": {
				schema: fail_with_error_schema,
			},
		},
	},
} satisfies Responses;

export const new_http_error = ({
	ctx,
	status,
	message,
}: {
	ctx: Context;
	status: StatusCode;
	message: string;
}) => {
	return ctx.json({ success: false, error: { status, message } }, status);
};
