import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { drizzle_client } from "~/db";
import {
  categories,
  insert_category_schema,
  update_category_schema,
} from "~/db/schema";
import { generate_new_id } from "~/utils/generate-id";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  try {
    const db = drizzle_client(c.env.DATABASE_URL);
    const data = await db.query.categories.findMany();
    return c.json({
      success: true,
      data,
    });
  } catch (error) {
    return c.json({
      success: false,
      message: error,
    });
  }
});

app.post("/", zValidator("form", insert_category_schema), async (c) => {
  try {
    const validated_data = c.req.valid("form");
    validated_data.id = generate_new_id("category");
    const db = drizzle_client(c.env.DATABASE_URL);
    const existing_category = await db.query.categories.findFirst({
      where: eq(categories.name, validated_data.name),
      columns: {
        id: true,
        name: true,
      },
    });
    if (existing_category) {
      return c.json({
        success: false,
        message: `Category '${existing_category.name}' already exists`,
      });
    }
    // TODO: Fix this
    // @ts-expect-error I'm not dealing with this right now
    const data = await db.insert(categories).values(validated_data);
    if (data.rowCount === 0) {
      return c.json({
        success: false,
        message: "Category not created",
      });
    }
    return c.json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return c.json({
      success: false,
      message: error,
    });
  }
});

app.patch(
  "/:id",
  zValidator("param", z.object({ id: z.string().min(16).max(16) })),
  zValidator("form", update_category_schema),
  async (c) => {
    try {
      const validated_id = c.req.valid("param").id;
      const validated_data = c.req.valid("form");
      const db = drizzle_client(c.env.DATABASE_URL);
      const data = await db
        .update(categories)
        .set(validated_data)
        .where(eq(categories.id, validated_id));
      if (data.rowCount === 0) {
        return c.json({
          success: false,
          message: "Category not found",
        });
      }
      return c.json({
        success: true,
        message: "Category updated successfully",
      });
    } catch (error) {
      return c.json({
        success: false,
        message: error,
      });
    }
  },
);

export default app;
