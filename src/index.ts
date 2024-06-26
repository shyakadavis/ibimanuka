import { cloudflareRateLimiter } from "@hono-rate-limiter/cloudflare";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { prettyJSON } from "hono/pretty-json";
import { api_routes } from "./routes";
import { open_api_tags } from "./utils/open-api-tags";
import { new_http_error } from "./utils/responses";

const app = new OpenAPIHono<Env>();

app.use("/*", cors());
app.use(csrf());
app.use(prettyJSON());
app.use((ctx, next) =>
	cloudflareRateLimiter<Env>({
		rateLimitBinding: ctx.env.RATE_LIMITER,
		keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "", // Method to generate custom identifiers for clients.,
	})(ctx, next),
);
app.get("/", apiReference({ theme: "deepSpace", spec: { url: "/docs" } }));
app.doc("/docs", {
	openapi: "3.0.0",
	info: {
		version: "0.1.0",
		title: "🌊 IBIMANUKA API 🌊",
		description: "An archival API for RWANDA 🇷🇼(WIP)",
	},
	tags: open_api_tags,
});
app.route("/api/v1", api_routes).onError((err, ctx) => {
	return new_http_error({
		ctx,
		status: 500,
		message: err.message,
	});
});
app.notFound((ctx) => {
	return new_http_error({
		ctx,
		status: 404,
		message:
			"The route/endpoint you are looking for does not exist. It may have been removed or moved to a different location.",
	});
});

export default app;
