import { JSX } from "solid-js"

// For classes
export function cx(...args: any[]) {
	const str = args
		.flat()
		.filter(Boolean)
		.join(" ")
		.trim()
		.replaceAll(/\s+/g, " ")
	if (!str) {return undefined }
	return str
}

// For styles (uses "initial" as a fallback value for CSS variables)
export function sx(ref: JSX.CSSProperties) {
	const ref2: JSX.CSSProperties = {}
	for (const key in ref) {
		// @ts-expect-error
		if (ref[key] === undefined) {
			// @ts-expect-error
			ref2[key] = "initial"
		} else {
			// @ts-expect-error
			ref2[key] = ref[key]
		}
	}
	return ref2
}

if (import.meta.vitest) {
	const { expect, it: test } = import.meta.vitest
	test("cx", () => {
		expect(cx()).toEqual(undefined)
		expect(cx("foo")).toEqual("foo")
		expect(cx("foo", "bar")).toEqual("foo bar")
		expect(cx("foo", "bar", undefined)).toEqual("foo bar")
		expect(cx("foo", "bar", null)).toEqual("foo bar")
		expect(cx("foo", "bar", false)).toEqual("foo bar")
		expect(cx("foo", "bar", "baz")).toEqual("foo bar baz")
		expect(cx("foo", "bar", () => "baz")).toEqual("foo bar baz")
		expect(cx("foo", "bar", () => () => "baz")).toEqual("foo bar baz")
		expect(cx("foo", "bar", () => () => () => "baz")).toEqual("foo bar baz")
	})
}
