import type { Session, User } from "lucia";

type Bindings = {
	DATABASE_URL: string;
};

type Variables = {
	user: User | null;
	session: Session | null;
};
