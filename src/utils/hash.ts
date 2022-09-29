export const BASE_26 = "abcdefghijklmnopqrstuvwxyz"
export const BASE_52 = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const BASE_62 = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789"

export function randomHash({ base, length }: { base?: string, length?: number } = {}) {
	base   ??= BASE_26
	length ??= 4

	let hash = ""
	for (let index = 0; index < length; index++) {
		hash += base[Math.floor(Math.random() * base.length)]
	}
	return hash
}

export function seededHash({ seed, base, length }: { seed?: number, base?: string, length?: number }) {
	seed   ??= 0
	base   ??= BASE_26
	length ??= 1

	let hash = ""
	while (seed > 0) {
		hash = base[seed % base.length] + hash
		seed = Math.floor(seed / base.length)
	}
	return hash.padStart(length, base[0])
}

if (import.meta.vitest) {
	const { expect, it: test } = import.meta.vitest
	test("seededHash", () => {
		let seed1 = 0
		function createId1() {
			return seededHash({ seed: seed1++, base: BASE_26 })
		}

		let seed2 = 0
		function createId2() {
			return seededHash({ seed: seed2++, base: BASE_26, length: 2 })
		}

		expect(createId1()).toBe("a")
		expect(createId1()).toBe("b")
		expect(createId1()).toBe("c")
		expect(createId1()).toBe("d")
		expect(createId1()).toBe("e")
		expect(createId1()).toBe("f")
		expect(createId1()).toBe("g")
		expect(createId1()).toBe("h")
		expect(createId1()).toBe("i")
		expect(createId1()).toBe("j")
		expect(createId1()).toBe("k")
		expect(createId1()).toBe("l")
		expect(createId1()).toBe("m")
		expect(createId1()).toBe("n")
		expect(createId1()).toBe("o")
		expect(createId1()).toBe("p")
		expect(createId1()).toBe("q")
		expect(createId1()).toBe("r")
		expect(createId1()).toBe("s")
		expect(createId1()).toBe("t")
		expect(createId1()).toBe("u")
		expect(createId1()).toBe("v")
		expect(createId1()).toBe("w")
		expect(createId1()).toBe("x")
		expect(createId1()).toBe("y")
		expect(createId1()).toBe("z")
		expect(createId1()).toBe("ba")
		expect(createId1()).toBe("bb")
		expect(createId1()).toBe("bc")
		expect(createId1()).toBe("bd")
		expect(createId1()).toBe("be")
		expect(createId1()).toBe("bf")
		expect(createId1()).toBe("bg")
		expect(createId1()).toBe("bh")
		expect(createId1()).toBe("bi")
		expect(createId1()).toBe("bj")
		expect(createId1()).toBe("bk")
		expect(createId1()).toBe("bl")
		expect(createId1()).toBe("bm")
		expect(createId1()).toBe("bn")
		expect(createId1()).toBe("bo")
		expect(createId1()).toBe("bp")
		expect(createId1()).toBe("bq")
		expect(createId1()).toBe("br")
		expect(createId1()).toBe("bs")
		expect(createId1()).toBe("bt")
		expect(createId1()).toBe("bu")
		expect(createId1()).toBe("bv")
		expect(createId1()).toBe("bw")
		expect(createId1()).toBe("bx")
		expect(createId1()).toBe("by")
		expect(createId1()).toBe("bz")

		expect(createId2()).toBe("aa")
		expect(createId2()).toBe("ab")
		expect(createId2()).toBe("ac")
		expect(createId2()).toBe("ad")
		expect(createId2()).toBe("ae")
		expect(createId2()).toBe("af")
		expect(createId2()).toBe("ag")
		expect(createId2()).toBe("ah")
		expect(createId2()).toBe("ai")
		expect(createId2()).toBe("aj")
		expect(createId2()).toBe("ak")
		expect(createId2()).toBe("al")
		expect(createId2()).toBe("am")
		expect(createId2()).toBe("an")
		expect(createId2()).toBe("ao")
		expect(createId2()).toBe("ap")
		expect(createId2()).toBe("aq")
		expect(createId2()).toBe("ar")
		expect(createId2()).toBe("as")
		expect(createId2()).toBe("at")
		expect(createId2()).toBe("au")
		expect(createId2()).toBe("av")
		expect(createId2()).toBe("aw")
		expect(createId2()).toBe("ax")
		expect(createId2()).toBe("ay")
		expect(createId2()).toBe("az")
		expect(createId2()).toBe("ba")
		expect(createId2()).toBe("bb")
		expect(createId2()).toBe("bc")
		expect(createId2()).toBe("bd")
		expect(createId2()).toBe("be")
		expect(createId2()).toBe("bf")
		expect(createId2()).toBe("bg")
		expect(createId2()).toBe("bh")
		expect(createId2()).toBe("bi")
		expect(createId2()).toBe("bj")
		expect(createId2()).toBe("bk")
		expect(createId2()).toBe("bl")
		expect(createId2()).toBe("bm")
		expect(createId2()).toBe("bn")
		expect(createId2()).toBe("bo")
		expect(createId2()).toBe("bp")
		expect(createId2()).toBe("bq")
		expect(createId2()).toBe("br")
		expect(createId2()).toBe("bs")
		expect(createId2()).toBe("bt")
		expect(createId2()).toBe("bu")
		expect(createId2()).toBe("bv")
		expect(createId2()).toBe("bw")
		expect(createId2()).toBe("bx")
		expect(createId2()).toBe("by")
		expect(createId2()).toBe("bz")
	})
}
