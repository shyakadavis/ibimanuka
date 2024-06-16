import { Hono } from "hono";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { categories, riddles } from "~/routes";

const app = new Hono<{ Bindings: Bindings }>().basePath("/api/v1");

app.get(
	"*",
	cache({ cacheName: "ibimanuka-api", cacheControl: "max-age=7200" }),
);
app.use("/api/*", cors());
app.get("/", (c) => c.text("🌊 IBIMANUKA API - V1"));
app.use(prettyJSON());
app.notFound((c) =>
	c.json({
		message:
			"The route/endpoint you are looking for does not exist. It may have been removed or moved to a different location.",
		type: "Not Found",
		types: ["Not Found", "Error"],
		status: 404,
	}),
);

// Routes
app.route("/riddles", riddles);
app.route("/categories", categories);

export default app;
