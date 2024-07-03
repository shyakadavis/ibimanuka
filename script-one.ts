// populate administrative units inside local dB

import fs from "node:fs/promises";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "~/db/schemas";
import { generate_new_id } from "~/utils/generate-id";

type Unit = {
	village_name: string;
	cell_name: string;
	sector_name: string;
	district_name: string;
	province_name: string;
};

const client = new Client({
	host: "127.0.0.1",
	port: 5432,
	user: "postgres",
	password: "postgres",
	database: "administrative-units",
});

await client.connect();

const db = drizzle(client, { schema });

async function main() {
	console.time("script_duration");
	const json_data: Unit[] = JSON.parse(await fs.readFile("data.json", "utf-8"));
	const provinces_map = new Map<string, string>();
	const districts_map = new Map<string, { id: string; province_id: string }>();
	const sectors_map = new Map<string, { id: string; district_id: string }>();
	const cells_map = new Map<string, { id: string; sector_id: string }>();
	const villages_map = new Map<string, { id: string; cell_id: string }>();

	for (const record of json_data) {
		// handle provinces
		if (!provinces_map.has(record.province_name)) {
			const [province] = await db
				.insert(schema.provinces)
				.values({
					id: generate_new_id("province"),
					name: record.province_name,
				})
				.onConflictDoUpdate({
					target: schema.provinces.name,
					set: { name: record.province_name },
				})
				.returning();
			provinces_map.set(record.province_name, province.id);
		}

		// handle districts
		const district_key = `${record.district_name}-${record.province_name}`;
		if (!districts_map.has(district_key)) {
			const [district] = await db
				.insert(schema.districts)
				.values({
					id: generate_new_id("district"),
					name: record.district_name,
					province_id: provinces_map.get(record.province_name) ?? "",
				})
				.onConflictDoUpdate({
					target: schema.districts.name,
					set: { name: record.district_name },
				})
				.returning();
			districts_map.set(district_key, {
				id: district.id,
				province_id: provinces_map.get(record.province_name) ?? "",
			});
		}

		// handle sectors
		const sector_key = `${record.sector_name}-${record.district_name}-${record.province_name}`;
		if (!sectors_map.has(sector_key)) {
			const [sector] = await db
				.insert(schema.sectors)
				.values({
					id: generate_new_id("sector"),
					name: record.sector_name,
					district_id: districts_map.get(district_key)?.id ?? "",
				})
				.returning();
			sectors_map.set(sector_key, {
				id: sector.id,
				district_id: districts_map.get(district_key)?.id ?? "",
			});
		}

		// handle cells
		const cell_key = `${record.cell_name}-${record.sector_name}-${record.district_name}-${record.province_name}`;
		if (!cells_map.has(cell_key)) {
			const [cell] = await db
				.insert(schema.cells)
				.values({
					id: generate_new_id("cell"),
					name: record.cell_name,
					sector_id: sectors_map.get(sector_key)?.id ?? "",
				})
				.returning();
			cells_map.set(cell_key, {
				id: cell.id,
				sector_id: sectors_map.get(sector_key)?.id ?? "",
			});
		}

		// handle villages
		const village_key = `${record.village_name}-${record.cell_name}-${record.sector_name}-${record.district_name}-${record.province_name}`;
		if (!villages_map.has(village_key)) {
			const [village] = await db
				.insert(schema.villages)
				.values({
					id: generate_new_id("village"),
					name: record.village_name,
					cell_id: cells_map.get(cell_key)?.id ?? "",
				})
				.returning();
			villages_map.set(village_key, {
				id: village.id,
				cell_id: cells_map.get(cell_key)?.id ?? "",
			});
			console.log(`Record: 📌 ${village_key} 📌 inserted successfully ✅`);
		}
	}

	console.log("Data import completed successfully 🎉🎉🎉");
	console.timeEnd("script_duration");
}

main()
	.catch((error) => {
		console.error(error);
	})
	.finally(() => client.end());
