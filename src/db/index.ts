import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function create_drizzle_client(db_url: string) {
	return drizzle(neon(db_url), { schema });
}
