/**
 * This is a template script for populating the database with data.
 * However, you need to bring in your data, schema, and logic.
 */

import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { create_drizzle_client } from "~/db";
import * as schema from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";

config({ path: ".dev.vars" });

async function main() {
	console.time("script_duration");

	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const database_url = process.env.DATABASE_URL;

	const db = create_drizzle_client(database_url);
	//  ________________________________
	// < Hello; write your logic here >
	//  --------------------------------
	//         \   ^__^
	//          \  (oo)\_______
	//             (__)\       )\/\
	//                 ||----w |
	//                 ||     ||
	const random_province_id = generate_new_id("province");
	const res = await db.query.provinces
		.findFirst({
			where: eq(schema.provinces.id, random_province_id),
		})
		.prepare("get_single_province")
		.execute();
	if (!res) {
		console.table("Nah! Nothing found 🤡");
	} else {
		console.table(res);
	}
	//  ______
	// < Bye >
	//  ------
	//         \   ^__^
	//          \  (oo)\_______
	//             (__)\       )\/\
	//                 ||----w |
	//                 ||     ||
	console.log("Script completed successfully 🎉🎉🎉");
	console.timeEnd("script_duration");
}

main().catch((error) => {
	console.error(error);
});
