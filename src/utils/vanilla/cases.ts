export const isUpper = (ch: string) => ch >= "A" && ch <= "Z"
export const isLower = (ch: string) => ch >= "a" && ch <= "z"
export const isAlpha = (ch: string) => isUpper(ch) || isLower(ch)

export function toKebabCase(str: string) {
	let caseStr = ""
	for (let index = 0; index < str.length; index++) {
		if (isUpper(str[index]) && index > 0 && isLower(str[index - 1])) {
			caseStr += "-" + str[index].toLowerCase()
		} else {
			caseStr += str[index].toLowerCase()
		}
	}
	return caseStr
}

export function toCamelCase(str: string) {
	let caseStr = ""
	for (let index = 0; index < str.length; index++) {
		if (str[index] === "-") { continue }
		if (isAlpha(str[index]) && index > 0 && str[index - 1] === "-") {
			caseStr += str[index].toUpperCase()
		} else {
			caseStr += str[index].toLowerCase()
		}
	}
	return caseStr
}

export function toTitleCase(str: string) {
	const caseStr = toCamelCase(str)
	return caseStr.slice(0, 1).toUpperCase() +
		caseStr.slice(1)
}

if (import.meta.vitest) {
	const { expect, it: test } = import.meta.vitest
	test("toKebabCase", () => {
		expect(toKebabCase("helloworld")).toBe("helloworld")
		expect(toKebabCase("helloWorld")).toBe("hello-world")
		expect(toKebabCase("Helloworld")).toBe("helloworld")
		expect(toKebabCase("HelloWorld")).toBe("hello-world")
		expect(toKebabCase("HELLOWORLD")).toBe("helloworld")
	})

	test("toCamelCase", () => {
		expect(toCamelCase("helloworld")).toBe("helloworld")
		expect(toCamelCase("hello-world")).toBe("helloWorld")
		expect(toCamelCase("hello--world")).toBe("helloWorld")
		expect(toCamelCase("hello---world")).toBe("helloWorld")
		expect(toCamelCase("-hello---world")).toBe("HelloWorld")
		expect(toCamelCase("--hello---world")).toBe("HelloWorld")
		expect(toCamelCase("---hello---world")).toBe("HelloWorld")
	})

	test("toTitleCase", () => {
		expect(toTitleCase("helloworld")).toBe("Helloworld")
		expect(toTitleCase("hello-world")).toBe("HelloWorld")
		expect(toTitleCase("hello--world")).toBe("HelloWorld")
		expect(toTitleCase("hello---world")).toBe("HelloWorld")
		expect(toTitleCase("-hello---world")).toBe("HelloWorld")
		expect(toTitleCase("--hello---world")).toBe("HelloWorld")
		expect(toTitleCase("---hello---world")).toBe("HelloWorld")
	})
}
