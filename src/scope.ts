import { BASE_36, createRandom, hash } from "./utils/vanilla"

const random = createRandom()
export function scope(name: string, { prefix }: { prefix?: string } = {}) {
	prefix ??= ""
	return `${prefix}${name}_-_${hash(random, { base: BASE_36, length: 6 })}`
}
