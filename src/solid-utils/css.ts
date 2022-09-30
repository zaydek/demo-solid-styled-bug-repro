import { JSX, onCleanup } from "solid-js"

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

const _cssCache: Record<string, true> = {}

export function css([_css]: TemplateStringsArray) {
	if (_css in _cssCache) {
		return null
	} else {
		_cssCache[_css] = true
		const style = document.createElement("style")
		style.setAttribute("type", "text/css")
		style.setAttribute("data-css", "")
		style.textContent = _css
		document.head.appendChild(style)
		onCleanup(() => {
			document.head.removeChild(style)
		})
	}
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
