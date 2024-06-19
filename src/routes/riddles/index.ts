import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { drizzle_client } from "~/db";
import { riddles } from "~/db/schema";
import { generate_new_id } from "~/utils/generate-id";
import {
	create_riddle,
	delete_riddle,
	get_all_riddles,
	get_single_riddle,
	update_riddle,
} from "./routes";

export const riddles_routes = new OpenAPIHono<{ Bindings: Bindings }>();

riddles_routes.openapi(get_all_riddles, async (c) => {
	const { limit, offset } = c.req.valid("query");
	const db = drizzle_client(c.env.DATABASE_URL);
	const data = await db.query.riddles.findMany({ limit, offset });
	return c.json(
		{
			success: true,
			message: `Returned ${data.length} riddles`,
			data,
		},
		200,
	);
});

riddles_routes.openapi(get_single_riddle, async (c) => {
	const { id } = c.req.valid("param");
	const db = drizzle_client(c.env.DATABASE_URL);
	const data = await db.query.riddles.findFirst({
		where: eq(riddles.id, id),
	});
	if (!data) {
		return c.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Riddle with id '${id}' not found`,
				},
			},
			404,
		);
	}
	return c.json(
		{
			success: true,
			message: `Returned riddle with id '${id}'`,
			data,
		},
		200,
	);
});

riddles_routes.openapi(create_riddle, async (c) => {
	const { question, answer, categories, complexity_level, hints } =
		c.req.valid("json");
	const db = drizzle_client(c.env.DATABASE_URL);
	const existing_riddle = await db.query.riddles.findFirst({
		where: eq(riddles.question, question),
		columns: { question: true, answer: true },
	});
	if (existing_riddle) {
		return c.json(
			{
				success: false,
				error: {
					status: 400,
					message: `Riddle '${question}' already exists`,
				},
			},
			400,
		);
	}
	const data = await db.insert(riddles).values({
		id: generate_new_id("riddle"),
		question,
		answer,
		categories,
		complexity_level,
		hints,
	});
	if (data.rowCount === 0) {
		return c.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Riddle not created",
				},
			},
			500,
		);
	}
	return c.json(
		{
			success: true,
			message: "Riddle created successfully",
		},
		201,
	);
});

riddles_routes.openapi(update_riddle, async (c) => {
	const { id } = c.req.valid("param");
	const { question, answer, categories, complexity_level, hints } =
		c.req.valid("json");
	const db = drizzle_client(c.env.DATABASE_URL);
	const existing_riddle = await db.query.riddles.findFirst({
		where: eq(riddles.id, id),
		columns: { question: true },
	});
	if (!existing_riddle) {
		return c.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Riddle '${id}' not found`,
				},
			},
			404,
		);
	}
	if (existing_riddle.question !== question) {
		const duplicate_riddle = await db.query.riddles.findFirst({
			where: eq(riddles.question, question),
			columns: { question: true },
		});
		if (duplicate_riddle) {
			return c.json(
				{
					success: false,
					error: {
						status: 400,
						message: `Riddle '${question}' already exists`,
					},
				},
				400,
			);
		}
	}
	const data = await db
		.update(riddles)
		.set({
			question,
			answer,
			categories,
			complexity_level,
			hints,
		})
		.where(eq(riddles.id, id));
	if (data.rowCount === 0) {
		return c.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Riddle not updated",
				},
			},
			500,
		);
	}
	return c.json(
		{
			success: true,
			message: "Riddle updated successfully",
		},
		200,
	);
});

riddles_routes.openapi(delete_riddle, async (c) => {
	const { id } = c.req.valid("param");
	const db = drizzle_client(c.env.DATABASE_URL);
	const existing_riddle = await db.query.riddles.findFirst({
		where: eq(riddles.id, id),
		columns: { id: true },
	});
	if (!existing_riddle) {
		return c.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Riddle '${id}' not found`,
				},
			},
			404,
		);
	}
	const data = await db.delete(riddles).where(eq(riddles.id, id));
	if (data.rowCount === 0) {
		return c.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Riddle not deleted",
				},
			},
			500,
		);
	}
	return c.json(
		{
			success: true,
			message: "Riddle deleted successfully",
		},
		200,
	);
});
