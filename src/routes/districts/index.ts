import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import { districts, provinces } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import {
	create_district,
	delete_district,
	get_all_districts,
	get_single_district,
	update_district,
} from "./routes";

export const districts_routes = new OpenAPIHono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

districts_routes.openapi(get_all_districts, async (ctx) => {
	const { province, limit, offset } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	if (province) {
		// TODO: Keep looking into this - it's working-ish and looks promising
		// const data = await db.query.provinces.findFirst({
		//   where: eq(provinces.id, province),
		//   with: {
		//     districts: {
		//       columns: {
		//         name: true,
		//       },
		//       with: {
		//         sectors: {
		//           columns: {
		//             name: true,
		//             district_id: true,
		//           },
		//         },
		//       },
		//     },
		//   },
		// });
		const data = await db.query.districts.findMany({
			where: eq(districts.province_id, province),
			limit,
			offset,
		});
		return ctx.json(
			{
				success: true,
				message: `Returned ${data.length} districts`,
				data,
			},
			200,
		);
	}

	const data = await db.query.districts.findMany({ limit, offset });

	return ctx.json(
		{
			success: true,
			message: `Returned ${data.length} districts`,
			data,
		},
		200,
	);
});

districts_routes.openapi(get_single_district, async (ctx) => {
	const { id } = ctx.req.valid("param");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.districts.findFirst({
		where: eq(districts.id, id),
	});

	if (!data) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `District with id '${id}' not found`,
				},
			},
			404,
		);
	}
	return ctx.json(
		{
			success: true,
			message: `Returned district with id '${id}'`,
			data,
		},
		200,
	);
});

districts_routes.openapi(create_district, async (ctx) => {
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const valid_province = await db.query.provinces.findFirst({
		where: eq(provinces.id, payload.province_id),
		columns: { id: true },
	});

	if (!valid_province) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Province '${payload.province_id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.insert(districts)
		.values({ id: generate_new_id("district"), ...payload });

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "District not created",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "District created successfully",
		},
		201,
	);
});

districts_routes.openapi(update_district, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const payload = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_district = await db.query.districts.findFirst({
		where: eq(districts.id, id),
		columns: { id: true, name: true },
	});

	if (!existing_district) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `District '${id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db
		.update(districts)
		.set(payload)
		.where(eq(districts.id, id));

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "District not updated",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "District updated successfully",
		},
		200,
	);
});

districts_routes.openapi(delete_district, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const db = create_drizzle_client(ctx.env.DATABASE_URL);
	const existing_district = await db.query.districts.findFirst({
		where: eq(districts.id, id),
		columns: { id: true },
	});

	if (!existing_district) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `District '${id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db.delete(districts).where(eq(districts.id, id));

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "District not deleted",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "District deleted successfully",
		},
		200,
	);
});
