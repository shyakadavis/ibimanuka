import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { prettyJSON } from "hono/pretty-json";
import { api_routes } from "./routes";
import { open_api_tags } from "./utils/open-api-tags";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.use("/*", cors());
app.use(csrf());
app.use(prettyJSON());
app.get("/", apiReference({ theme: "deepSpace", spec: { url: "/docs" } }));
app.doc("/docs", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "🌊 IBIMANUKA API 🌊",
		description: "Your go-to API for anything RWANDA 🇷🇼",
	},
	tags: open_api_tags,
});
app.route("/api/v1", api_routes);
app.notFound((c) =>
	c.json({
		success: false,
		error: {
			status: 404,
			message:
				"The route/endpoint you are looking for does not exist. It may have been removed or moved to a different location.",
		},
	}),
);

export default app;
