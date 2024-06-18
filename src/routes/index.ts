import { OpenAPIHono } from "@hono/zod-openapi";
import { categories_route } from "./categories";

export const api_routes = new OpenAPIHono<{ Bindings: Bindings }>();

api_routes.route("/categories", categories_route);
