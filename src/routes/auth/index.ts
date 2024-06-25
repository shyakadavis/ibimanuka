import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { Scrypt } from "lucia";
import { create_drizzle_client } from "~/db";
import { create_lucia_instance } from "~/db/lucia";
import { users } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import {
	log_in_with_email_and_password,
	log_out,
	sign_up_with_email_and_password,
} from "./routes";

export const auth_routes = new OpenAPIHono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

auth_routes.openapi(sign_up_with_email_and_password, async (ctx) => {
	const { email, name, given_name, surname, password } = ctx.req.valid("json");

	// TODO: (Tech-debt)
	// This is a pure JS implementation of Scrypt, ergo, it is anywhere from 2~3 times slower than implementations based on native code.
	// If we ever go for paid CF Workers plan, or if we ever find ourselves on a Node.js environment, we can use other alternatives like Argon2id.
	// Argon2id is a good choice, but hashing exceeds CPU time limit in Cloudflare Workers.
	// const hashed_password = await new Argon2id().hash(password);
	const scrypt = new Scrypt();
	const hashed_password = await scrypt.hash(password);

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_user = await db.query.users.findFirst({
		where: eq(users.email, email.toLowerCase()),
		columns: { id: true },
	});

	if (existing_user) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					// TODO: Re-think this message. Do we really want to expose this information?
					message: "User with this email already exists",
				},
			},
			400,
		);
	}

	const res = await db.insert(users).values({
		id: generate_new_id("user"),
		email: email.toLowerCase(),
		name,
		given_name,
		surname,
		hashed_password,
	});

	if (res.rowCount !== 1) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Failed to create account. Please try again later.",
				},
			},
			500,
		);
	}

	// TODO: Send verification email

	return ctx.json(
		{
			success: true,
			message:
				"Account created successfully. Please check your email to verify your account.",
		},
		201,
	);
});

auth_routes.openapi(log_in_with_email_and_password, async (ctx) => {
	const { lucia, db } = create_lucia_instance(ctx.env.DATABASE_URL);

	const { email, password } = ctx.req.valid("json");

	const existing_user = await db.query.users.findFirst({
		where: eq(users.email, email.toLowerCase()),
		columns: {
			id: true,
			email: true,
			hashed_password: true,
			name: true,
			role: true,
		},
	});

	if (!existing_user) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					message: "Invalid credentials",
				},
			},
			400,
		);
	}

	// TODO: Don't allow login if user is not verified

	if (!existing_user.hashed_password) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					// TODO: Re-think this message.
					// It's not really invalid credentials, more like, 'No password set for this account. Please reset your password.'
					// But then again, it's a security risk to expose this information.
					message: "Invalid credentials",
				},
			},
			400,
		);
	}

	const scrypt = new Scrypt();
	const valid_password = await scrypt.verify(
		existing_user.hashed_password,
		password,
	);

	if (!valid_password) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					message: "Invalid credentials",
				},
			},
			400,
		);
	}

	const session = await lucia.createSession(existing_user.id, {});
	const session_cookie = lucia.createSessionCookie(session.id);
	ctx.header("Set-Cookie", session_cookie.serialize(), { append: true });
	// TODO:
	// As I'm still getting used to Hono, I'm not sure if this is necessary.
	// What is `context` in Hono? Does setting it here at the end of my route reflect across other routes?
	// If not, then we should remove the user-and-session-setting part from here and leave it be in the middleware.
	// But then again, what if the route is not protected by the middleware, and I still need to access the user and session?
	// Will revisit this later.
	ctx.set("User", {
		id: existing_user.id,
		name: existing_user.name,
		role: existing_user.role,
	});
	ctx.set("Session", session);

	return ctx.json(
		{
			success: true,
			message: "Logged in successfully",
			// TODO:
			// Is it a good idea to return the session cookie?
			// Also, how can I return the cookie in the OpenAPI schema? As in returning the cookie below the headers response.
			cookie: session_cookie,
		},
		200,
	);
});

auth_routes.openapi(log_out, async (ctx) => {
	const { lucia } = create_lucia_instance(ctx.env.DATABASE_URL);

	const session = ctx.get("Session");

	if (session) {
		await lucia.invalidateSession(session.id);
		ctx.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
		ctx.set("Session", null);
		ctx.set("User", null);
	}

	return ctx.json(
		{
			success: true,
			message: "Logged out successfully",
		},
		200,
	);
});
