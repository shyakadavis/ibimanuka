import { OpenAPIHono } from "@hono/zod-openapi";
import { drizzle_client } from "~/db";
import { users } from "~/db/schema";
import { generate_new_id } from "~/utils/generate-id";
import { sign_up } from "./routes";

export const auth_routes = new OpenAPIHono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

auth_routes.openapi(sign_up, async (ctx) => {
	const { email, name, given_name, surname, password } = ctx.req.valid("json");
	// TODO: Hash password. Argon2id is a good choice, but hashing exceeds CPU time limit in Cloudflare Workers.
	// const hashed_password = await new Argon2id().hash(password);
	const user_id = generate_new_id("user");

	const db = drizzle_client(ctx.env.DATABASE_URL);
	const res = await db.insert(users).values({
		id: user_id,
		email,
		name,
		given_name,
		surname,
		hashed_password: password,
	});

	console.log(res);

	return ctx.json(
		{
			success: true,
			message:
				"Account created successfully. Please check your email to verify your account.",
		},
		201,
	);
});
