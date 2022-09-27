export function round(n: number, { fixed }: { fixed: number } = { fixed: 4 }) {
	return +n.toFixed(fixed)
}

export function bound(n: number, { min, max }: { min: number, max: number }) {
	return Math.min(Math.max(n, min), max)
}

if (import.meta.vitest) {
	const { expect, it: test } = import.meta.vitest
	test("round", () => {
		expect(round(-1)).toBe(-1)
		expect(round(-0.5)).toBe(-0.5)
		expect(round(-0.25)).toBe(-0.25)
		expect(round(-0.125)).toBe(-0.125)
		expect(round(-0.0625)).toBe(-0.0625)
		expect(round(-0.03125)).toBe(-0.0313)

		expect(round(1)).toBe(1)
		expect(round(0.5)).toBe(0.5)
		expect(round(0.25)).toBe(0.25)
		expect(round(0.125)).toBe(0.125)
		expect(round(0.0625)).toBe(0.0625)
		expect(round(0.03125)).toBe(0.0313)
	})
	test("bound", () => {
		expect(bound(+0, { min: -1, max: 1 })).toEqual(+0)
		expect(bound(-1, { min: -1, max: 1 })).toEqual(-1)
		expect(bound(-1, { min: -2, max: 1 })).toEqual(-1)
		expect(bound(+1, { min: -2, max: 1 })).toEqual(+1)
		expect(bound(+2, { min: -2, max: 1 })).toEqual(+1)
	})
}
