import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import { mountain_schema, mountains, villages } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import { parse_fields_to_columns } from "~/utils/requests";
import {
	create_mountain,
	delete_mountain,
	get_all_mountains,
	get_single_mountain,
	update_mountain,
} from "./routes";

export const mountains_routes = new OpenAPIHono<Env>();

mountains_routes.openapi(get_all_mountains, async (ctx) => {
	const { limit, offset, fields, location } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.mountains
		.findMany({
			limit,
			offset,
			columns: fields
				? parse_fields_to_columns(mountain_schema, fields)
				: undefined,
			// TODO:
			// This looks hideous, we should consider flattening this schema
			with: location
				? {
						location: {
							columns: { id: true, name: true },
							with: {
								cell: {
									columns: { id: true, name: true },
									with: {
										sector: {
											columns: { id: true, name: true },
											with: {
												district: {
													columns: { id: true, name: true },
													with: {
														province: {
															columns: { id: true, name: true },
														},
													},
												},
											},
										},
									},
								},
							},
						},
					}
				: undefined,
		})
		.prepare("get_all_mountains")
		.execute();

	return ctx.json(
		{
			success: true,
			message: `Returned ${data.length} mountains`,
			data,
		},
		200,
	);
});

mountains_routes.openapi(get_single_mountain, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const { fields, location } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.mountains.findFirst({
		where: eq(mountains.id, id),
		columns: fields
			? parse_fields_to_columns(mountain_schema, fields)
			: undefined,
		// TODO
		// This looks hideous, we should consider flattening this schema
		with: location
			? {
					location: {
						columns: { id: true, name: true },
						with: {
							cell: {
								columns: { id: true, name: true },
								with: {
									sector: {
										columns: { id: true, name: true },
										with: {
											district: {
												columns: { id: true, name: true },
												with: {
													province: {
														columns: { id: true, name: true },
													},
												},
											},
										},
									},
								},
							},
						},
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
					message: `Mountain with id '${id}' not found`,
				},
			},
			404,
		);
	}

	return ctx.json(
		{
			success: true,
			message: `Returned mountain with id '${id}'`,
			data,
		},
		200,
	);
});

mountains_routes.openapi(create_mountain, async (ctx) => {
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const valid_village = await db.query.villages
		.findFirst({
			where: eq(villages.id, payload.village_id),
			columns: { id: true },
		})
		.prepare("create_mountain")
		.execute();

	if (!valid_village) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Province '${payload.village_id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.insert(mountains)
		.values({
			id: generate_new_id("mountain"),
			...payload,
		})
		.prepare("create_mountain")
		.execute();

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Mountain not created",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Mountain created successfully",
		},
		201,
	);
});

mountains_routes.openapi(update_mountain, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_mountain = await db.query.mountains
		.findFirst({
			where: eq(mountains.id, id),
			columns: {
				id: true,
				name: true,
			},
		})
		.prepare("get_existing_mountain")
		.execute();

	if (!existing_mountain) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Mountain '${id}' not found`,
				},
			},
			404,
		);
	}

	const valid_village = await db.query.villages
		.findFirst({
			where: eq(villages.id, payload.village_id),
			columns: { id: true },
		})
		.prepare("get_valid_village")
		.execute();

	if (!valid_village) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Province '${payload.village_id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.update(mountains)
		.set(payload)
		.where(eq(mountains.id, id))
		.prepare("update_mountain")
		.execute();

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Mountain not updated",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Mountain updated successfully",
		},
		200,
	);
});

mountains_routes.openapi(delete_mountain, async (ctx) => {
	const { id } = ctx.req.valid("param");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_mountain = await db.query.mountains
		.findFirst({ where: eq(mountains.id, id), columns: { id: true } })
		.prepare("get_existing_mountain")
		.execute();

	if (!existing_mountain) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Mountain '${id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.delete(mountains)
		.where(eq(mountains.id, id))
		.prepare("delete_mountain")
		.execute();

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Mountain not deleted",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Mountain deleted successfully",
		},
		200,
	);
});
