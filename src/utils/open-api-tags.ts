type Tag = {
	name:
		| "Mountains"
		| "Provinces"
		| "Districts"
		| "Sectors"
		| "Cells"
		| "Villages"
		| "Riddles"
		| "Categories"
		| "Auth";
	description: string;
};

export const open_api_tags: Tag[] = [
	{
		name: "Mountains",
		description:
			"Mountains (`Ibirunga`) are the highest points in Rwanda. The country is known as the land of a thousand hills, and the mountains are a key part of the landscape. The highest mountain in Rwanda is Mount Karisimbi, which is part of the Virunga Mountains.",
	},
	{
		name: "Riddles",
		description:
			"Riddles (`Ibisakuzo`) are word games, questions and answers that are fun for young and old alike, and involve skill. As the history of Rwandan literature shows, riddles also had expert composers, who were always digging day and night, to further improve and enrich the game.",
	},
	{
		name: "Provinces",
		description:
			"Provinces (`Intara`) are the largest administrative units in Rwanda. The country is divided into 5 provinces, which are further divided into districts.",
	},
	{
		name: "Districts",
		description:
			"Districts (`Uturere`) are the second largest administrative units in Rwanda. The country is divided into 30 districts, which are further divided into sectors.",
	},
	{
		name: "Sectors",
		description:
			"Sectors (`Imirenge`) are the third largest administrative units in Rwanda. The country is divided into 416 sectors, which are further divided into cells.",
	},
	{
		name: "Cells",
		description:
			"Cells (`Utugari`) are the fourth largest administrative units in Rwanda. The country is divided into 2,148 cells, which are further divided into villages.\n\n⚠️The size of the payload for the `GET /cells` endpoint is quite large, so it is recommended to use alternative endpoints to get the details of a specific cell.\nFor example, you could pass via the `GET /sectors/{id}` endpoint to get the details of a specific sector, which will include the cells within that sector. Alternatively, you could use the `GET /cells/{id}` endpoint to get the details of a specific cell.",
	},
	{
		name: "Villages",
		description:
			"Villages (`Imidugudu`) are the smallest administrative units in Rwanda. The country is divided into 14,837 villages, which are further divided into households.\n\n⚠️The size of the payload for the `GET /villages` endpoint is quite large, so it is recommended to use alternative endpoints to get the details of a specific village.\nFor example, you could pass via the `GET /cells/{id}` endpoint to get the details of a specific cell, which will include the villages within that cell. Alternatively, you could use the `GET /villages/{id}` endpoint to get the details of a specific village.",
	},
	{
		name: "Categories",
		description:
			"These are general categories, spreading across different topics and subjects on the platform.",
	},
	{
		name: "Auth",
		description:
			"These are the currently available authentication endpoints. The API uses Cookies for authentication.\n\n⚠️There is an existing issue with the authentication aspect of API, where the relevant endpoints might not work as expected. This is a known issue and is being worked on.",
	},
];
