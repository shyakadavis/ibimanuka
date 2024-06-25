import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import { categories, category_schema } from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";
import { parse_fields_to_columns } from "~/utils/requests";
import {
	create_category,
	delete_category,
	get_all_categories,
	get_single_category,
	update_category,
} from "./routes";

export const categories_routes = new OpenAPIHono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

categories_routes.openapi(get_all_categories, async (ctx) => {
	const { limit, offset, fields } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.categories.findMany({
		limit,
		offset,
		columns: fields
			? parse_fields_to_columns(category_schema, fields)
			: undefined,
	});

	return ctx.json(
		{
			success: true,
			message: `Returned ${data.length} categories`,
			data,
		},
		200,
	);
});

categories_routes.openapi(get_single_category, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const { fields } = ctx.req.valid("query");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const data = await db.query.categories.findFirst({
		where: eq(categories.id, id),
		columns: fields
			? parse_fields_to_columns(category_schema, fields)
			: undefined,
	});

	if (!data) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Category with id '${id}' not found`,
				},
			},
			404,
		);
	}

	return ctx.json(
		{
			success: true,
			message: `Returned category with id '${id}'`,
			data,
		},
		200,
	);
});

categories_routes.openapi(create_category, async (ctx) => {
	const { name, description } = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_category = await db.query.categories.findFirst({
		where: eq(categories.name, name),
		columns: { name: true },
	});

	if (existing_category) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 400,
					message: `Category '${name}' already exists`,
				},
			},
			400,
		);
	}

	const data = await db.insert(categories).values({
		id: generate_new_id("category"),
		name,
		description,
	});

	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Category not created",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Category created successfully",
		},
		201,
	);
});

categories_routes.openapi(update_category, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const { name, description } = ctx.req.valid("json");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_category = await db.query.categories.findFirst({
		where: eq(categories.id, id),
		columns: { id: true, name: true },
	});

	if (!existing_category) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Category '${id}' not found`,
				},
			},
			404,
		);
	}

	if (existing_category.name !== name) {
		const duplicate_category = await db.query.categories.findFirst({
			where: eq(categories.name, name),
			columns: { name: true },
		});
		if (duplicate_category) {
			return ctx.json(
				{
					success: false,
					error: {
						status: 400,
						message: `Category '${name}' already exists`,
					},
				},
				400,
			);
		}
	}

	const data = await db
		.update(categories)
		.set({
			name,
			description,
		})
		.where(eq(categories.id, id));
	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Category not updated",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Category updated successfully",
		},
		200,
	);
});

categories_routes.openapi(delete_category, async (ctx) => {
	const { id } = ctx.req.valid("param");

	const db = create_drizzle_client(ctx.env.DATABASE_URL);

	const existing_category = await db.query.categories.findFirst({
		where: eq(categories.id, id),
		columns: { id: true },
	});

	if (!existing_category) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 404,
					message: `Category '${id}' not found`,
				},
			},
			404,
		);
	}

	const data = await db.delete(categories).where(eq(categories.id, id));
	if (data.rowCount === 0) {
		return ctx.json(
			{
				success: false,
				error: {
					status: 500,
					message: "Category not deleted",
				},
			},
			500,
		);
	}

	return ctx.json(
		{
			success: true,
			message: "Category deleted successfully",
		},
		200,
	);
});
