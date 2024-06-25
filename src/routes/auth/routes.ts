import { createRoute, z } from "@hono/zod-openapi";
import { user_schema } from "~/db/schemas";
import { check_if_already_logged_in } from "~/middleware/is-already-logged-in";
import { is_authenticated } from "~/middleware/is-authenticated";
import {
	error_responses,
	success_without_data_schema,
} from "~/utils/responses";

export const sign_up_with_email_and_password = createRoute({
	method: "post",
	path: "/sign-up",
	middleware: [check_if_already_logged_in],
	tags: ["Auth"],
	summary: "Sign up with email and password",
	description:
		"Sign up with email and password. User will receive a verification email.",
	request: {
		body: {
			content: {
				"application/json": {
					schema: user_schema
						.pick({
							email: true,
							name: true,
							surname: true,
							given_name: true,
						})
						// We are extending with `password` because we will hash it later on to fill the `hashed_password` field in the database
						.extend({ password: z.string().min(8) }),
				},
			},
		},
	},
	responses: {
		201: {
			description: "User signed up",
			content: { "application/json": { schema: success_without_data_schema } },
		},
		...error_responses,
	},
});

export const log_in_with_email_and_password = createRoute({
	method: "post",
	path: "/log-in",
	middleware: [check_if_already_logged_in],
	tags: ["Auth"],
	summary: "Log in with email and password",
	description: "Log in with email and password.",
	request: {
		body: {
			content: {
				"application/json": {
					schema: user_schema
						.pick({
							email: true,
						})
						.extend({ password: z.string().min(8) }),
				},
			},
		},
	},
	responses: {
		200: {
			description: "User logged in",
			content: { "application/json": { schema: success_without_data_schema } },
		},
		...error_responses,
	},
});

export const log_out = createRoute({
	method: "post",
	path: "/log-out",
	middleware: [is_authenticated],
	tags: ["Auth"],
	summary: "Log out",
	description: "Log out the user.",
	responses: {
		200: {
			description: "User logged out",
			content: { "application/json": { schema: success_without_data_schema } },
		},
		...error_responses,
	},
});
