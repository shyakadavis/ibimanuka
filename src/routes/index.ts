import { OpenAPIHono } from "@hono/zod-openapi";
import { auth_routes } from "./auth";
import { categories_routes } from "./categories";
import { cells_routes } from "./cells";
import { districts_routes } from "./districts";
import { provinces_routes } from "./provinces";
import { riddles_routes } from "./riddles";
import { sectors_routes } from "./sectors";
import { villages_routes } from "./villages";

export const api_routes = new OpenAPIHono<Env>();

api_routes.route("/auth", auth_routes);
api_routes.route("/categories", categories_routes);
api_routes.route("/cells", cells_routes);
api_routes.route("/districts", districts_routes);
api_routes.route("/provinces", provinces_routes);
api_routes.route("/riddles", riddles_routes);
api_routes.route("/sectors", sectors_routes);
api_routes.route("/villages", villages_routes);
