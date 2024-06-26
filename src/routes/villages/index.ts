import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import { cells, village_schema, villages } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import { parse_fields_to_columns } from "~/utils/requests";
import {
	create_village,
	delete_village,
	get_all_villages,
	get_single_village,
	update_village,
} from "./routes";

export const villages_routes = new OpenAPIHono<Env>();

villages_routes.openapi(get_all_villages, async (ctx) => {
	const { limit, offset, fields } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.villages.findMany({
		limit,
		offset,
		columns: fields
			? parse_fields_to_columns(village_schema, fields)
			: undefined,
	});

	return ctx.json(
		{
			success: true,
			message: `Returned ${data.length} villages`,
			data,
		},
		200,
	);
});

villages_routes.openapi(get_single_village, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const { fields } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.villages.findFirst({
		where: eq(villages.id, id),
		columns: fields
			? parse_fields_to_columns(village_schema, fields)
			: undefined,
	});

	if (!data) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Village with id '${id}' not found`,
				},
			},
			404,
		);
	}

	return ctx.json(
		{
			success: true,
			message: `Returned village with id '${id}'`,
			data,
		},
		200,
	);
});

villages_routes.openapi(create_village, async (ctx) => {
	const { name, description, latitude, longitude, cell_id } =
		ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const valid_cell = await db.query.cells.findFirst({
		where: eq(cells.id, cell_id),
		columns: { id: true },
	});

	if (!valid_cell) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					message: `Cell with id '${cell_id}' not found`,
				},
			},
			400,
		);
	}

	const existing_village = await db.query.villages.findFirst({
		where: eq(villages.name, name),
		columns: { name: true },
	});

	if (existing_village) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					message: `Village '${name}' already exists`,
				},
			},
			400,
		);
	}

	const data = await db.insert(villages).values({
		id: generate_new_id("village"),
		name,
		description,
		latitude,
		longitude,
		cell_id,
	});

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Village not created",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Village created successfully",
		},
		201,
	);
});

villages_routes.openapi(update_village, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_village = await db.query.villages.findFirst({
		where: eq(villages.id, id),
		columns: { id: true, name: true },
	});

	if (!existing_village) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Village '${id}' not found`,
				},
			},
			404,
		);
	}

	const valid_cell = await db.query.cells.findFirst({
		where: eq(cells.id, payload.cell_id),
		columns: { id: true },
	});

	if (!valid_cell) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					message: `Cell with id '${payload.cell_id}' not found`,
				},
			},
			400,
		);
	}

	const data = await db
		.update(villages)
		.set(payload)
		.where(eq(villages.id, id));

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Village not updated",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Village updated successfully",
		},
		200,
	);
});

villages_routes.openapi(delete_village, async (ctx) => {
	const { id } = ctx.req.valid("param");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_village = await db.query.villages.findFirst({
		where: eq(villages.id, id),
		columns: { id: true },
	});

	if (!existing_village) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Village '${id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db.delete(villages).where(eq(villages.id, id));
	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Village not deleted",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Village deleted successfully",
		},
		200,
	);
});
