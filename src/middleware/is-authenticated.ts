import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { create_lucia_instance } from "~/db/lucia";

export const is_authenticated: MiddlewareHandler = async (c, next) => {
	console.log("is_authenticated middleware");
	const lucia = create_lucia_instance(c.env.DATABASE_URL);
	const session_id = getCookie(c, lucia.sessionCookieName) ?? null;
	if (!session_id) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}
	const { session, user } = await lucia.validateSession(session_id);
	if (session && session.fresh) {
		// use `header()` instead of `setCookie()` to avoid TS errors
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
			append: true,
		});
	}
	if (!session) {
		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
	}
	c.set("user", user);
	c.set("session", session);
	await next();
};
