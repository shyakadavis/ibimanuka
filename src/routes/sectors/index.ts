import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import { districts, sector_schema, sectors } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import { parse_fields_to_columns } from "~/utils/requests";
import {
	create_sector,
	delete_sector,
	get_all_sectors,
	get_single_sector,
	update_sector,
} from "./routes";

export const sectors_routes = new OpenAPIHono<Env>();

sectors_routes.openapi(get_all_sectors, async (ctx) => {
	const { limit, offset, fields, cells, cell_limit, cell_fields } =
		ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.sectors.findMany({
		limit,
		offset,
		columns: fields
			? parse_fields_to_columns(sector_schema, fields)
			: undefined,
		with: cells
			? {
					cells: {
						limit: cell_limit,
						columns: cell_fields
							? parse_fields_to_columns(sector_schema, cell_fields)
							: undefined,
						// TODO: Decide if we want to recursively handle queries for cells, and villages
						// with: { cells: true },
					},
				}
			: undefined,
	});

	return ctx.json(
		{
			success: true,
			message: `Returned ${data.length} sectors`,
			data,
		},
		200,
	);
});

sectors_routes.openapi(get_single_sector, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const { fields, cell_fields, cell_limit, cells } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.sectors.findFirst({
		columns: fields
			? parse_fields_to_columns(sector_schema, fields)
			: undefined,
		with: cells
			? {
					cells: {
						limit: cell_limit,
						columns: cell_fields
							? parse_fields_to_columns(sector_schema, cell_fields)
							: undefined,
						// TODO: Decide if we want to recursively handle queries for cells, and villages
						// with: { cells: true },
					},
				}
			: undefined,
		where: eq(sectors.id, id),
	});

	if (!data) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Sector with id '${id}' not found`,
				},
			},
			404,
		);
	}
	return ctx.json(
		{
			success: true,
			message: `Returned sector with id '${id}'`,
			data,
		},
		200,
	);
});

sectors_routes.openapi(create_sector, async (ctx) => {
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const valid_district = await db.query.districts.findFirst({
		where: eq(districts.id, payload.district_id),
		columns: { id: true },
	});

	if (!valid_district) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Sector '${payload.district_id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.insert(sectors)
		.values({ id: generate_new_id("sector"), ...payload });

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Sector not created",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Sector created successfully",
		},
		201,
	);
});

sectors_routes.openapi(update_sector, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_sector = await db.query.sectors.findFirst({
		where: eq(sectors.id, id),
		columns: { id: true, name: true },
	});

	if (!existing_sector) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Sector '${id}' not found`,
				},
			},
			404,
		);
	}

	const valid_district = await db.query.districts.findFirst({
		where: eq(districts.id, payload.district_id),
		columns: { id: true },
	});

	if (!valid_district) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `District '${payload.district_id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db.update(sectors).set(payload).where(eq(sectors.id, id));

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Sector not updated",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Sector updated successfully",
		},
		200,
	);
});

sectors_routes.openapi(delete_sector, async (ctx) => {
	const { id } = ctx.req.valid("param");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_sector = await db.query.sectors.findFirst({
		where: eq(sectors.id, id),
		columns: { id: true },
	});

	if (!existing_sector) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Sector '${id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db.delete(sectors).where(eq(sectors.id, id));

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Sector not deleted",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Sector deleted successfully",
		},
		200,
	);
});
