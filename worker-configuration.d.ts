type Bindings = {
	DATABASE_URL: string;
};

type Variables = {
	User: import("lucia").User | null;
	Session: import("lucia").Session | null;
};
