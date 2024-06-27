import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import { cell_schema, cells, sectors } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import { parse_fields_to_columns } from "~/utils/requests";
import {
	create_cell,
	delete_cell,
	get_all_cells,
	get_single_cell,
	update_cell,
} from "./routes";

export const cells_routes = new OpenAPIHono<Env>();

cells_routes.openapi(get_all_cells, async (ctx) => {
	const { limit, offset, fields, villages, village_limit, village_fields } =
		ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.cells
		.findMany({
			limit,
			offset,
			columns: fields
				? parse_fields_to_columns(cell_schema, fields)
				: undefined,
			with: villages
				? {
						villages: {
							limit: village_limit,
							columns: village_fields
								? parse_fields_to_columns(cell_schema, village_fields)
								: undefined,
							// TODO: Decide if we want to recursively handle queries for villages, and villages
							// with: { villages: true },
						},
					}
				: undefined,
		})
		.prepare("get_all_cells")
		.execute();

	return ctx.json(
		{
			success: true,
			message: `Returned ${data.length} cells`,
			data,
		},
		200,
	);
});

cells_routes.openapi(get_single_cell, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const { fields, village_fields, village_limit, villages } =
		ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.cells.findFirst({
		where: eq(cells.id, id),
		columns: fields ? parse_fields_to_columns(cell_schema, fields) : undefined,
		with: villages
			? {
					villages: {
						limit: village_limit,
						columns: village_fields
							? parse_fields_to_columns(cell_schema, village_fields)
							: undefined,
						// TODO: Decide if we want to recursively handle queries for villages, and villages
						// with: { villages: true },
					},
				}
			: undefined,
	});

	if (!data) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Cell with id '${id}' not found`,
				},
			},
			404,
		);
	}
	return ctx.json(
		{
			success: true,
			message: `Returned cell with id '${id}'`,
			data,
		},
		200,
	);
});

cells_routes.openapi(create_cell, async (ctx) => {
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const valid_sector = await db.query.sectors
		.findFirst({
			where: eq(sectors.id, payload.sector_id),
			columns: { id: true },
		})
		.prepare("get_valid_sector")
		.execute();

	if (!valid_sector) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Sector '${payload.sector_id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.insert(cells)
		.values({
			id: generate_new_id("cell"),
			...payload,
		})
		.prepare("create_cell")
		.execute();

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Cell not created",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Cell created successfully",
		},
		201,
	);
});

cells_routes.openapi(update_cell, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_cell = await db.query.cells
		.findFirst({
			where: eq(cells.id, id),
			columns: {
				id: true,
				name: true,
			},
		})
		.prepare("get_existing_cell")
		.execute();

	if (!existing_cell) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Cell '${id}' not found`,
				},
			},
			404,
		);
	}

	const valid_sector = await db.query.sectors
		.findFirst({
			where: eq(sectors.id, payload.sector_id),
			columns: { id: true },
		})
		.prepare("get_valid_sector")
		.execute();

	if (!valid_sector) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Sector '${payload.sector_id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.update(cells)
		.set(payload)
		.where(eq(cells.id, id))
		.prepare("update_cell")
		.execute();

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Cell not updated",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Cell updated successfully",
		},
		200,
	);
});

cells_routes.openapi(delete_cell, async (ctx) => {
	const { id } = ctx.req.valid("param");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_cell = await db.query.cells
		.findFirst({
			where: eq(cells.id, id),
			columns: { id: true },
		})
		.prepare("get_existing_cell")
		.execute();

	if (!existing_cell) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Cell '${id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.delete(cells)
		.where(eq(cells.id, id))
		.prepare("delete_cell")
		.execute();

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Cell not deleted",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Cell deleted successfully",
		},
		200,
	);
});
