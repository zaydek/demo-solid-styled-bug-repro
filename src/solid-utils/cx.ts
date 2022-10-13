import { JSX } from "solid-js"

export function cx(...args: any[]) {
	const className = args
		.flat()
		.filter(Boolean)
		.join(" ")
		.trim()
		.replaceAll(/\s+/g, " ")
	if (!className) { return }
	return className
}

// TODO: Is there a better way to type the for-loop?
export function sx(style: JSX.CSSProperties) {
	const style2: typeof style = {}
	for (const key in style) {
		// @ts-expect-error
		if (style[key] === undefined) {
			// @ts-expect-error
			style2[key] = "initial"
		} else {
			// @ts-expect-error
			style2[key] = style[key]
		}
	}
	return style2
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
