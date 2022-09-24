import { variantImportant, variantVariables } from "@unocss/preset-mini/variants"
import { Rule } from "unocss"
import { defineConfig } from "unocss/vite"
import { cssSpec } from "./unocss.css.spec"

//// ////////////////////////////////////////////////////////////////////////////////
//// // Extractors
////
//// // https://github.com/unocss/unocss/blob/464cdd19cfef2c7a7f195a1a187191c6f4bb5f48/packages/core/src/utils/helpers.ts#L12
//// function isValidSelector(selector: string) {
//// 	return /[!-~]+/.test(selector)
//// }
////
//// // https://github.com/unocss/unocss/blob/fa0bf070d0bdc0c2591d05b6437482feccd62d03/packages/core/src/extractors/split.ts#L4
//// function splitCode(code: string) {
//// 	return code.split(/\\?[\s"`;{}]+/g).filter(isValidSelector) // Remove '
//// }
////
//// const extractors: Extractor[] = [{
//// 	name: "custom-extractor",
//// 	order: -1,
//// 	extract({ code }) {
//// 		return new Set(splitCode(code))
//// 	},
//// }]

////////////////////////////////////////////////////////////////////////////////
// Rules

function desugar(str: string, { sign }: { sign?: string } = {}) {
	let desugared = ""
	if (sign) {
		if (str.startsWith("(") && str.endsWith(")")) {
			desugared = `calc(-1*(${str.slice(1, -1)}))`
		} else {
			desugared = `calc(-1*(${str}))`
		}
	} else {
		if (str.startsWith("(") && str.endsWith(")")) {
			desugared = `calc(${str.slice(1, -1)})`
		} else {
			desugared = `${str}`
		}
	}
	// Desugar var(...)
	desugared = desugared.replaceAll(/\$([a-zA-Z][a-zA-Z-0-9]*)/g, "var(--$1)")
	// Convert underscores to WS
	desugared = desugared.replaceAll("_", " ")
	return desugared
}

function untyped(raw: unknown, { sign }: { sign?: string } = {}) {
	if (raw === "0") { return 0 }
	if (!raw) { return }
	const value = "" + raw
	return desugar(value, { sign })
}

function typed(raw: unknown, { sign }: { sign?: string } = {}) {
	if (raw === "0") { return 0 }
	if (!raw) { return }
	const value = "" + raw
	const px = /^\d+(?:\.\d+)?$/.test(value)
	return desugar(value + (px ? "px" : ""), { sign })
}

function interpolate(shorthand: string, properties: string[], unit = typed): Rule {
	return [
		new RegExp(`^(-?)${shorthand}-(.+)$`),
		([_, sign, value]) => {
			return properties.reduce((acc, property) => ({
				...acc,
				[property]: unit(value, { sign: sign as undefined | "-" }),
			}), {})
		},
	]
}

const rules: Rule[] = [
	[/^((?:--|-)?[a-z]+(?:-[a-z]+)*):(.+)$/, ([_, key, value]) => {
		if (
			key.startsWith("--") || (
				key.startsWith("-webkit-") ||
				key.startsWith("-moz-")    ||
				key.startsWith("-ms-")     ||
				key.startsWith("-o-")
			)
		) {
			return { [key]: untyped(value) }
		} else if (key in cssSpec) {
			return { [key]: untyped(value) }
		}
		return {}
	}],

	// TODO: Intellisense doesn’t see group
	["group", { /* No-op */ }],
	["contents", { "display": "contents" }],

	/*
	 * Positioning and isolation
	 */
	["absolute", { "position": "absolute", "z-index": "10" }],
	["fixed",    { "position": "fixed",    "z-index": "10" }],
	["relative", { "position": "relative", "z-index": "10" }],
	["sticky",   { "position": "sticky",   "z-index": "10" }],

	interpolate("z", ["z-index"], untyped),

	[/^(-?)inset(?:-(.+))?$/,    ([_, sign, value]) => ({ "inset":  typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-x(?:-(.+))?$/,  ([_, sign, value]) => ({ "right":  typed(value, { sign }) ?? 0, "left":   typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-y(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    typed(value, { sign }) ?? 0, "bottom": typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-t(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    typed(value, { sign }) ?? 0, "right":  typed(value, { sign }) ?? 0, "left":   typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-r(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    typed(value, { sign }) ?? 0, "right":  typed(value, { sign }) ?? 0, "bottom": typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-b(?:-(.+))?$/,  ([_, sign, value]) => ({ "right":  typed(value, { sign }) ?? 0, "bottom": typed(value, { sign }) ?? 0, "left":   typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-l(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    typed(value, { sign }) ?? 0, "bottom": typed(value, { sign }) ?? 0, "left":   typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-tr(?:-(.+))?$/, ([_, sign, value]) => ({ "top":    typed(value, { sign }) ?? 0, "right":  typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-br(?:-(.+))?$/, ([_, sign, value]) => ({ "right":  typed(value, { sign }) ?? 0, "bottom": typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-bl(?:-(.+))?$/, ([_, sign, value]) => ({ "bottom": typed(value, { sign }) ?? 0, "left":   typed(value, { sign }) ?? 0 })],
	[/^(-?)inset-tl(?:-(.+))?$/, ([_, sign, value]) => ({ "top":    typed(value, { sign }) ?? 0, "left":   typed(value, { sign }) ?? 0 })],

	[/^(-?)t-(.+)$/, ([_, sign, value]) => ({ "top":    typed(value, { sign }) ?? 0 })],
	[/^(-?)r-(.+)$/, ([_, sign, value]) => ({ "right":  typed(value, { sign }) ?? 0 })],
	[/^(-?)b-(.+)$/, ([_, sign, value]) => ({ "bottom": typed(value, { sign }) ?? 0 })],
	[/^(-?)l-(.+)$/, ([_, sign, value]) => ({ "left":   typed(value, { sign }) ?? 0 })],

	/*
	 * Spacing
	 */
	interpolate("m",  ["margin"]),
	interpolate("mx", ["margin-left", "margin-right"]),
	interpolate("my", ["margin-top", "margin-bottom"]),
	interpolate("mt", ["margin-top"]),
	interpolate("mr", ["margin-right"]),
	interpolate("mb", ["margin-bottom"]),
	interpolate("ml", ["margin-left"]),

	interpolate("p",  ["padding"]),
	interpolate("px", ["padding-left", "padding-right"]),
	interpolate("py", ["padding-top", "padding-bottom"]),
	interpolate("pt", ["padding-top"]),
	interpolate("pr", ["padding-right"]),
	interpolate("pb", ["padding-bottom"]),
	interpolate("pl", ["padding-left"]),

	/*
	 * Sizing
	 */
	[/^h-(.+)$/,      ([_, value]) => ({ "height":       typed(value)   })],
	[/^min-h-(.+)$/,  ([_, value]) => ({ "min-height":   typed(value)   })],
	[/^max-h-(.+)$/,  ([_, value]) => ({ "max-height":   typed(value)   })],
	[/^w-(.+)$/,      ([_, value]) => ({ "width":        typed(value)   })],
	[/^min-w-(.+)$/,  ([_, value]) => ({ "min-width":    typed(value)   })],
	[/^max-w-(.+)$/,  ([_, value]) => ({ "max-width":    typed(value)   })],

	[/^aspect-(.+)$/, ([_, value]) => ({
		"aspect-ratio": untyped(value),
	})],

	/*
	 * Border-radius
	 */
	interpolate("rounded",    ["border-radius"]),
	interpolate("rounded-t",  ["border-top-left-radius", "border-top-right-radius"]),
	interpolate("rounded-r",  ["border-top-right-radius", "border-bottom-right-radius"]),
	interpolate("rounded-b",  ["border-bottom-left-radius", "border-bottom-right-radius"]),
	interpolate("rounded-l",  ["border-top-left-radius", "border-bottom-left-radius"]),
	interpolate("rounded-tr", ["border-top-right-radius"]),
	interpolate("rounded-br", ["border-bottom-right-radius"]),
	interpolate("rounded-bl", ["border-bottom-left-radius"]),
	interpolate("rounded-tl", ["border-top-left-radius"]),

	/*
	 * Flexbox
	 */
	[/^flex-grow(?:-(.+))?$/, ([_, value]) => ({ "flex-grow": untyped(value) ?? 1 })],

	["flex-row", { "display": "flex", "flex-direction": "row" }],
	["flex-col", { "display": "flex", "flex-direction": "column" }],

	[/^flex-justify-(.+)$/, ([_, value]) => ({ "justify-content": value })],
	[/^flex-align-(.+)$/,   ([_, value]) => ({ "align-items": value })],

	// Shorthand for justify-content:center align-items:center
	["flex-center", { "justify-content": "center", "align-items": "center" }],

	[/^flex-shrink(?:-(.+))?$/, ([_, value]) => ({ "flex-shrink": untyped(value) ?? 1      })],
	[/^flex-basis-(.+)$/,       ([_, value]) => ({ "flex-basis":  typed(value)   ?? "auto" })],
	[/^flex-wrap(?:-(.+))?$/,   ([_, value]) => ({ "flex-wrap":   untyped(value) ?? 1      })],

	/*
	 * CSS Grid
	 */
	["grid", { "display": "grid" }],

	[/^grid-cols-(\d+)$/, ([_, x]) => ({ "display": "grid", "grid-template-columns": x === "1" ? "1fr" : `repeat(${x}, 1fr)` })],
	[/^grid-rows-(\d+)$/, ([_, y]) => ({ "display": "grid", "grid-template-rows":    y === "1" ? "1fr" : `repeat(${y}, 1fr)` })],

	// Shorthand for place-items:center
	["grid-center", { "place-items": "center" }],

	/*
	 * Gap
	 */
	interpolate("gap",     ["gap"]),
	interpolate("col-gap", ["column-gap"]),
	interpolate("row-gap", ["row-gap"]),
]

////////////////////////////////////////////////////////////////////////////////

export default defineConfig({
	presets: [], // No-op UnoCSS

	//// extractors, // Needed for [data-state-checked=true]
	rules,
	variants: [
		variantImportant, // !key=typed(value) syntax
		variantVariables, // [selector]:key=typed(value) syntax
	],
})
