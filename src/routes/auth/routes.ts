import { createRoute, z } from "@hono/zod-openapi";
import { User } from "~/db/schema";
import {
	error_responses,
	success_without_data_schema,
} from "~/utils/responses";

export const sign_up = createRoute({
	method: "post",
	path: "/sign-up",
	tags: ["Auth"],
	summary: "Sign up with email and password",
	description:
		"Sign up with email and password. User will receive a verification email.",
	request: {
		body: {
			content: {
				"application/json": {
					schema: User.pick({
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
