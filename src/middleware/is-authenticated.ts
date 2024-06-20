import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { create_lucia_instance } from "~/db/lucia";
import { new_http_error } from "~/utils/responses";

export const is_authenticated: MiddlewareHandler = async (ctx, next) => {
	const lucia = create_lucia_instance(ctx.env.DATABASE_URL);
	const session_id = getCookie(ctx, lucia.sessionCookieName) ?? null;

	if (!session_id) {
		ctx.set("user", null);
		ctx.set("session", null);

		return new_http_error({
			ctx,
			status: 401,
			message: "Unauthorized: authentication required.",
		});
	}

	const { session, user } = await lucia.validateSession(session_id);

	if (!session) {
		ctx.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
	}

	if (session?.fresh) {
		// use `header()` instead of `setCookie()` to avoid TS errors
		ctx.header(
			"Set-Cookie",
			lucia.createSessionCookie(session.id).serialize(),
			{ append: true },
		);
	}

	ctx.set("user", user);
	ctx.set("session", session);

	return next();
};
