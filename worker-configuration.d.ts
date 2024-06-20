type Bindings = {
	DATABASE_URL: string;
};

type Variables = {
	user: import("lucia").User | null;
	session: import("lucia").Session | null;
};
