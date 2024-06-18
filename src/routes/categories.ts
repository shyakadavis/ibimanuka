import { createRoute, z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { drizzle_client } from "~/db";
import { categories, insert_category_schema } from "~/db/schema";
import { generate_new_id } from "~/utils/generate-id";

export const categories_route = new OpenAPIHono<{ Bindings: Bindings }>();

// Route Validation Schemas
const CategoriesParamsSchema = z.object({
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
  request: { query: CategoriesParamsSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: insert_category_schema.array().openapi("Categories"),
        },
      },
      description: "Returns a list of all categories",
    },
  },
});

const create_category = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: insert_category_schema
            .omit({ id: true, created_at: true, updated_at: true })
            .openapi("Categories"),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({}),
        },
      },
      description: "Created product.",
    },
  },
});

// Route Handlers
categories_route.openapi(get_all_categories, async (c) => {
  const { limit, offset } = c.req.valid("query");
  const db = drizzle_client(c.env.DATABASE_URL);
  const data = await db.query.categories.findMany({ limit, offset });
  return c.json(data, 200);
});

categories_route.openapi(create_category, async (c) => {
  const { name, description } = c.req.valid("json");
  const id = generate_new_id("category");
  const db = drizzle_client(c.env.DATABASE_URL);
  const data = await db.insert(categories).values({
    id,
    name,
    description,
  });
  return c.json(data, 201);
});
