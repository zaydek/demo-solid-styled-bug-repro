import { createMemo, JSX, onCleanup } from "solid-js"
import { decomment } from "../utils"

export function cx(...args: any[]): undefined | string {
	const str = args
		.flat()
		.filter(Boolean)
		.join(" ")
		.trim()
		.replaceAll(/\s+/g, " ")
	if (!str) {return undefined }
	return str
}

// TODO: Is there a better way to type the for-loop?
export function sx(ref: JSX.CSSProperties): JSX.CSSProperties {
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

const _cssCache = new Map<string, true>()

export function css([rawStr]: TemplateStringsArray): null {
	const cssStr = createMemo(() => decomment(rawStr))
	if (_cssCache.has(cssStr())) { return null }

	_cssCache.set(cssStr(), true) // Cache code
	const style = document.createElement("style")
	style.setAttribute("type", "text/css")
	style.setAttribute("data-css", "")
	style.textContent = cssStr()
	document.head.appendChild(style)
	onCleanup(() => {
		_cssCache.delete(cssStr()) // Cache code
		document.head.removeChild(style)
	})
	return null
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
