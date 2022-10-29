export const BASE_26 = "abcdefghijklmnopqrstuvwxyz"
export const BASE_36 =
	"abcdefghijklmnopqrstuvwxyz" +
	"0123456789"
export const BASE_52 =
	"abcdefghijklmnopqrstuvwxyz" +
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const BASE_62 =
	"abcdefghijklmnopqrstuvwxyz" +
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
	"0123456789"

// Simple deterministic random number generator
//
// https://stackoverflow.com/a/19303725
export function createRandom() {
	let seed = 1
	return () => {
    const x = Math.sin(seed++) * 10e3
    return x - Math.floor(x)
	}
}

// Generates a random hash from a base and random number generator
export function hash(random: () => number, { base, length }: { base: string, length: number }) {
	let hash = ""
	for (let index = 0; index < length; index++) {
		hash += base[Math.floor(random() * base.length)]
	}
	return hash
}
