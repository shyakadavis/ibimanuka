import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import { district_schema, provinces } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import { parse_fields_to_columns } from "~/utils/requests";
import {
	create_province,
	delete_province,
	get_all_provinces,
	get_single_province,
	update_province,
} from "./routes";

export const provinces_routes = new OpenAPIHono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

// TODO: Make this a helper function that can be reused in other routes
// function get_desired_columns_from_fields_query_param(fields: string) {
// 	const schema_keys = [...district_schema.keyof().options];
// 	type SchemaKey = (typeof schema_keys)[number];
// 	const columns: Partial<Record<SchemaKey, boolean>> = {};

// 	const fields_array = fields.split(",");

// 	for (const field of fields_array) {
// 		if (schema_keys.includes(field as SchemaKey)) {
// 			columns[field as SchemaKey] = true;
// 		}
// 	}

// 	return columns;
// }

provinces_routes.openapi(get_all_provinces, async (ctx) => {
	const { limit, offset, districts, fields } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.provinces.findMany({
		limit,
		offset,
		columns: fields
			? parse_fields_to_columns(district_schema, fields)
			: undefined,
		with: districts ? { districts: true } : undefined,
	});

	return ctx.json(
		{
			success: true,
			message: `Returned ${data.length} provinces`,
			data,
		},
		200,
	);
});

provinces_routes.openapi(get_single_province, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const db = create_drizzle_client(ctx.env.DATABASE_URL);
	const data = await db.query.provinces.findFirst({
		where: eq(provinces.id, id),
	});
	if (!data) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Province with id '${id}' not found`,
				},
			},
			404,
		);
	}
	return ctx.json(
		{
			success: true,
			message: `Returned province with id '${id}'`,
			data,
		},
		200,
	);
});

provinces_routes.openapi(create_province, async (ctx) => {
	const { name, description, latitude, longitude } = ctx.req.valid("json");
	const db = create_drizzle_client(ctx.env.DATABASE_URL);
	const existing_province = await db.query.provinces.findFirst({
		where: eq(provinces.name, name),
		columns: { name: true },
	});
	if (existing_province) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					message: `Province '${name}' already exists`,
				},
			},
			400,
		);
	}
	const data = await db.insert(provinces).values({
		id: generate_new_id("province"),
		name,
		description,
		latitude,
		longitude,
	});
	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Province not created",
				},
			},
			500,
		);
	}
	return ctx.json(
		{
			success: true,
			message: "Province created successfully",
		},
		201,
	);
});

provinces_routes.openapi(update_province, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const { name, description } = ctx.req.valid("json");
	const db = create_drizzle_client(ctx.env.DATABASE_URL);
	const existing_province = await db.query.provinces.findFirst({
		where: eq(provinces.id, id),
		columns: { id: true, name: true },
	});
	if (!existing_province) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Province '${id}' not found`,
				},
			},
			404,
		);
	}
	if (existing_province.name !== name) {
		const duplicate_province = await db.query.provinces.findFirst({
			where: eq(provinces.name, name),
			columns: { name: true },
		});
		if (duplicate_province) {
			return ctx.json(
				{
					success: false,
					error: {
						status: 400,
						message: `Province '${name}' already exists`,
					},
				},
				400,
			);
		}
	}
	const data = await db
		.update(provinces)
		.set({
			name,
			description,
		})
		.where(eq(provinces.id, id));
	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Province not updated",
				},
			},
			500,
		);
	}
	return ctx.json(
		{
			success: true,
			message: "Province updated successfully",
		},
		200,
	);
});

provinces_routes.openapi(delete_province, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const db = create_drizzle_client(ctx.env.DATABASE_URL);
	const existing_province = await db.query.provinces.findFirst({
		where: eq(provinces.id, id),
		columns: { id: true },
	});
	if (!existing_province) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Province '${id}' not found`,
				},
			},
			404,
		);
	}
	const data = await db.delete(provinces).where(eq(provinces.id, id));
	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Province not deleted",
				},
			},
			500,
		);
	}
	return ctx.json(
		{
			success: true,
			message: "Province deleted successfully",
		},
		200,
	);
});
