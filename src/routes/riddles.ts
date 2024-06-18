import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { drizzle_client } from "~/db";
import { insert_riddle_schema } from "~/db/schema";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
	try {
		const db = drizzle_client(c.env.DATABASE_URL);
		const data = await db.query.riddles.findMany({});
		return c.json({
			success: true,
			data,
		});
	} catch (error) {
		return c.json({
			success: false,
			message: error,
		});
	}
});

app.post("/", zValidator("form", insert_riddle_schema), async (c) => {
	const validated_data = c.req.valid("form");
	// const db = drizzle_client(c.env.DATABASE_URL);
	// const data = await db.insert(riddles).values(validated_data);
	return c.json(validated_data);
});

export default app;
