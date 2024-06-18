import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
// import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { api_routes } from "./routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

// TODO: Add caching, but be mindful of what this did to you in dev mode. The cache was so aggressive that testing the API was a pain.
// app.get(
//   "*",
//   cache({ cacheName: "ibimanuka-api", cacheControl: "max-age=7200" }),
// );

// The OpenAPI documentation will be available at /
app.get("/", apiReference({ theme: "deepSpace", spec: { url: "/docs" } }));
app.doc("/docs", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "🌊 IBIMANUKA API 🌊",
		description: "Your go-to API for anything RWANDA 🇷🇼",
	},
});
// Cors
app.use("/api/*", cors());
// Pretty JSON
app.use(prettyJSON());
// API Routes
app.route("/api/v1", api_routes);
// Not Found
app.notFound((c) =>
	c.json({
		message:
			"The route/endpoint you are looking for does not exist. It may have been removed or moved to a different location.",
		type: "Not Found",
		types: ["Not Found", "Error"],
		status: 404,
	}),
);

export default app;
