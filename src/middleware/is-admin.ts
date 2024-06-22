import type { MiddlewareHandler } from "hono";
import type { User } from "lucia";
import { new_http_error } from "~/utils/responses";

/**
 * Middleware to check if a user is an admin, and deny access if they are not.
 */
export const is_admin: MiddlewareHandler = async (ctx, next) => {
	const user = ctx.get("User") as User;

	console.log({ user });

	if (!user || user.role !== "ADMIN") {
		return new_http_error({
			ctx,
			status: 403,
			message: "Unauthorized",
		});
	}

	return next();
};
