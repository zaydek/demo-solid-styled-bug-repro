export function range(count: number) {
	return [...new Array(count).keys()]
}

if (import.meta.vitest) {
	const { expect, it: test } = import.meta.vitest
	test("range", () => {
		expect(range(0)).toEqual([])
		expect(range(1)).toEqual([0])
		expect(range(2)).toEqual([0, 1])
		expect(range(3)).toEqual([0, 1, 2])
		expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	})
}
