import { OpenAPIHono } from "@hono/zod-openapi";
import { categories_routes } from "./categories";
import { riddles_routes } from "./riddles";

export const api_routes = new OpenAPIHono<{ Bindings: Bindings }>();

api_routes.route("/riddles", riddles_routes);
api_routes.route("/categories", categories_routes);
