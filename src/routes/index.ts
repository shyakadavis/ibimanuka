import { OpenAPIHono } from "@hono/zod-openapi";
import { auth_routes } from "./auth";
import { categories_routes } from "./categories";
import { districts_routes } from "./districts";
import { provinces_routes } from "./provinces";
import { riddles_routes } from "./riddles";

export const api_routes = new OpenAPIHono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

api_routes.route("/auth", auth_routes);
api_routes.route("/categories", categories_routes);
api_routes.route("/districts", districts_routes);
api_routes.route("/provinces", provinces_routes);
api_routes.route("/riddles", riddles_routes);
