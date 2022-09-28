export function tab(str: string, count: number, { omitStart }: { omitStart: boolean } = { omitStart: false }) {
	return str.split("\n").map((line, lineIndex) => {
		if (omitStart && lineIndex === 0) {
			return line
		} else {
			if (line.length > 0) {
				return "\t".repeat(count) + line
			} else {
				return line
			}
		}
	}).join("\n")
}

export function detab(str: string) {
	const lines = str.split("\n")
	const tabCounts = lines.map(line => {
		let index = 0
		for (; index < line.length; index++) {
			if (line[index] !== "\t") {
				break
			}
		}
		if (index === 0 || index === line.length) {
			return 0
		} else {
			return index
		}
	})
	const minTabCount = Math.min(...tabCounts.filter(tabindex => tabindex > 0))
	if (minTabCount === Infinity) { return str }
	return lines.map(line => line.slice(minTabCount)).join("\n")
}

export function decomment(str: string) {
	return str
		.replace(/\n?\t*\/\/.*/g, "")                // E.g. // ...
		.replace(/\n?\t*\/\*(?:\n?.*?)*?\*\//gm, "") // E.g. /* ... */
}

if (import.meta.vitest) {
	const { expect, it: test } = import.meta.vitest
	test("detab", () => {
		expect(detab(`Hello, world!`)).toBe("Hello, world!")
		expect(detab(`
Hello, world!
`)).toBe(`
Hello, world!
`)
		expect(detab(`
	Hello, world!
`)).toBe(`
Hello, world!
`)
		expect(detab(`
		Hello, world!
`)).toBe(`
Hello, world!
`)
		expect(detab(`
			Hello, world!
`)).toBe(`
Hello, world!
`)
		expect(detab(`
			Hello, world!
			Hello, world!
`)).toBe(`
Hello, world!
Hello, world!
`)
		expect(detab(`
			Hello, world!
			Hello, world!

			Hello, world!
			Hello, world!
`)).toBe(`
Hello, world!
Hello, world!

Hello, world!
Hello, world!
`)
		expect(detab(`

			Hello, world!
			Hello, world!

			Hello, world!
			Hello, world!

`)).toBe(`

Hello, world!
Hello, world!

Hello, world!
Hello, world!

`)
	})

	test("tab", () => {
		expect(tab("Hello, world!", 0)).toBe("Hello, world!")
		expect(tab("Hello, world!", 1)).toBe("\tHello, world!")
		expect(tab("Hello, world!", 2)).toBe("\t\tHello, world!")
		expect(tab("Hello, world!", 3)).toBe("\t\t\tHello, world!")
		expect(tab(`
Hello, world!
`, 0)).toBe("\nHello, world!\n")
		expect(tab(`
Hello, world!
`, 1)).toBe("\n\tHello, world!\n")
		expect(tab(`
	Hello, world!
`, 1)).toBe("\n\t\tHello, world!\n")
		expect(tab(`
		Hello, world!
`, 1)).toBe("\n\t\t\tHello, world!\n")
		expect(tab(`
			Hello, world!
`, 1)).toBe("\n\t\t\t\tHello, world!\n")
		expect(tab(`
			Hello, world!
			Hello, world!
`, 1)).toBe("\n\t\t\t\tHello, world!\n\t\t\t\tHello, world!\n")
		expect(tab(`
			Hello, world!
			Hello, world!

			Hello, world!
			Hello, world!
`, 1)).toBe("\n\t\t\t\tHello, world!\n\t\t\t\tHello, world!\n\n\t\t\t\tHello, world!\n\t\t\t\tHello, world!\n")
		expect(tab(`

			Hello, world!
			Hello, world!

			Hello, world!
			Hello, world!

`, 1)).toBe("\n\n\t\t\t\tHello, world!\n\t\t\t\tHello, world!\n\n\t\t\t\tHello, world!\n\t\t\t\tHello, world!\n\n")
	})

	test("decomment", () => {
		expect(decomment(`console.log("Hello, world!)`)).toBe(`console.log("Hello, world!)`)
		expect(decomment(`console.log("Hello, world!) // FIXME`)).toBe(`console.log("Hello, world!) `)
		expect(decomment(`console.log("Hello, world!) /* FIXME */`)).toBe(`console.log("Hello, world!) `)
		expect(decomment(`/* FIXME */ console.log("Hello, world!)`)).toBe(` console.log("Hello, world!)`)
	})
}
