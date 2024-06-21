import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { create_lucia_instance } from "~/db/lucia";

/**
 * TODO: Not sure how I feel about having created this.
 * This is meant to be middleware to forbid users from accessing certain routes if they are already logged in.
 * e.g /log-in, /sign-up, etc.
 * I feel like there is/should be a better way to handle such cases - will revisit this later.
 */
export const check_if_already_logged_in: MiddlewareHandler = async (
	ctx,
	next,
) => {
	const { lucia } = create_lucia_instance(ctx.env.DATABASE_URL);

	const session_id = getCookie(ctx, lucia.sessionCookieName) ?? null;

	if (!session_id) {
		return next();
	}

	const { session } = await lucia.validateSession(session_id);

	if (!session) {
		ctx.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});

		return next();
	}

	return ctx.json(
		{
			success: false,
			error: {
				status: 400,
				message: "You are already logged in.",
			},
		},
		400,
	);
};
