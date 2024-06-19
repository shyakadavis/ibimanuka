import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { DEV } from "esm-env";
import { Lucia } from "lucia";
import { drizzle_client } from ".";
import * as schema from "./schema";

declare module "lucia" {
	interface Register {
		Lucia: typeof create_lucia_instance;
		DatabaseUserAttributes: typeof schema.users.$inferSelect;
	}
}

export function create_lucia_instance(db_url: string) {
	const db = drizzle_client(db_url);
	const adapter = new DrizzlePostgreSQLAdapter(
		db,
		schema.sessions,
		schema.users,
	);
	const auth = new Lucia(adapter, {
		sessionCookie: { attributes: { secure: !DEV, sameSite: "lax" } },
		getUserAttributes({ hashed_password, ...database_user_attributes }) {
			return database_user_attributes;
		},
	});
	return auth;
}
