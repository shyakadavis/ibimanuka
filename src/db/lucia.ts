import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { DEV } from "esm-env";
import { Lucia } from "lucia";
import { create_drizzle_client } from ".";
import * as schema from "./schema";

declare module "lucia" {
	interface Register {
		Lucia: ReturnType<typeof create_lucia_instance>["lucia"];
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

/**
 * The attributes of a user that we want exposed over the network/context.
 * We need to be mindful of what we expose, as we don't want to expose sensitive information, ergo we expose few attributes.
 */
type DatabaseUserAttributes = Pick<
	typeof schema.users.$inferSelect,
	"id" | "name" | "role"
>;

/**
 * Create a new instance of Lucia with the given database URL. For convinience, this function also returns the database client.
 */
export function create_lucia_instance(db_url: string) {
	const db = create_drizzle_client(db_url);
	const adapter = new DrizzlePostgreSQLAdapter(
		db,
		schema.sessions,
		schema.users,
	);
	const lucia = new Lucia(adapter, {
		sessionCookie: { attributes: { secure: !DEV, sameSite: "lax" } },
		getUserAttributes({ id, name, role }) {
			return { id, name, role };
		},
	});

	return { lucia, db };
}
