import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
);

const prefixes = {
	category: "cat",
	riddle: "rdl",
	user: "usr",
} as const;

/**
 * @name generate_new_id
 * @description Generate a new id with a prefix. The generated id is a combination of the prefix and a nanoid. The nanoid is 12 characters long because the prefix is 3 characters long, plus an underscore. The total length of the id is 16 characters, which is the maximum length of the id field in the database.
 * @param prefix - The prefix to use for the id. Will be mapped to a short three-letter prefix.
 */
export function generate_new_id(prefix: keyof typeof prefixes): string {
	return [prefixes[prefix], nanoid(12)].join("_");
}
