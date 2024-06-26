type Env = {
	Bindings: Bindings;
	Variables: Variables;
};

type Bindings = {
	DATABASE_URL: string;
	RATE_LIMITER: import("@hono-rate-limiter/cloudflare").RateLimitBinding;
};

type Variables = {
	User: import("lucia").User | null;
	Session: import("lucia").Session | null;
};
