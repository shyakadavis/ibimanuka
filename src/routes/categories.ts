import { createRoute, z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { drizzle_client } from "~/db";
import { categories, insert_category_schema } from "~/db/schema";
import { generate_new_id } from "~/utils/generate-id";
import {
	error_responses,
	success_with_data_schema,
	success_without_data_schema,
} from "~/utils/responses";

export const categories_route = new OpenAPIHono<{ Bindings: Bindings }>();

// Route Validation Schemas
const categories_params_schema = z.object({
	limit: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "The number of categories to return",
			},
			example: "10",
		}),
	offset: z
		.string()
		.transform(Number)
		.optional()
		.openapi({
			param: {
				name: "offset",
				in: "query",
				description: "The number of categories to skip",
			},
			example: "0",
		}),
});

// Routes
const get_all_categories = createRoute({
	method: "get",
	path: "/",
	tags: ["Categories"],
	summary: "Get all categories",
	description:
		"Returns a list of all categories. Can return a subset of categories by using the `limit` and `offset` query parameters.",
	request: { query: categories_params_schema },
	responses: {
		200: {
			description: "Returns a list of all categories",
			content: {
				"application/json": {
					schema: success_with_data_schema(
						insert_category_schema.array().openapi("Categories"),
					),
				},
			},
		},
		...error_responses,
	},
});

const create_category = createRoute({
	method: "post",
	path: "/",
	tags: ["Categories"],
	summary: "Create a new category",
	description: "Create a new category with a name and description",
	request: {
		body: {
			content: {
				"application/json": {
					// TODO: Extend this schema to not allow empty strings.
					schema: insert_category_schema.omit({
						id: true,
						created_at: true,
						updated_at: true,
					}),
				},
			},
		},
	},
	responses: {
		201: {
			content: {
				"application/json": {
					schema: success_without_data_schema,
				},
			},
			description: "Category created.",
		},
		...error_responses,
	},
});

// Route Handlers
categories_route.openapi(get_all_categories, async (c) => {
	const { limit, offset } = c.req.valid("query");
	const db = drizzle_client(c.env.DATABASE_URL);
	const data = await db.query.categories.findMany({ limit, offset });
	return c.json(
		{ success: true, data, message: `Returned ${data.length} categories` },
		200,
	);
});

categories_route.openapi(create_category, async (c) => {
	const { name, description } = c.req.valid("json");
	const id = generate_new_id("category");
	const db = drizzle_client(c.env.DATABASE_URL);
	const existing_category = await db.query.categories.findFirst({
		where: eq(categories.name, name),
		columns: { name: true },
	});
	if (existing_category) {
		return c.json(
			{
				success: false,
				error: { status: 400, message: `Category '${name}' already exists` },
			},
			400,
		);
	}
	const data = await db.insert(categories).values({
		id,
		name,
		description,
	});
	if (data.rowCount === 0) {
		return c.json(
			{
				error: { status: 500, message: "Category not created" },
				success: false,
			},
			500,
		);
	}
	return c.json(
		{
			success: true,
			message: "Category created successfully",
		},
		201,
	);
});
