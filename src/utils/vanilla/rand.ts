// Simple deterministic random number generator
//
// https://stackoverflow.com/a/19303725
export function randGenerator() {
	let seed = 1
	return () => {
    const x = Math.sin(seed++) * 10e3
    return x - Math.floor(x)
	}
}

// Generates a random hash from a base and random number generator
export function randHash(rand: () => number, { base, length }: { base: string, length: number }) {
	let hash = ""
	for (let index = 0; index < length; index++) {
		hash += base[Math.floor(rand() * base.length)]
	}
	return hash
}
