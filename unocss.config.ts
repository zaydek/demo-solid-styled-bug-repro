import { variantImportant, variantVariables } from "@unocss/preset-mini/variants"
import { Rule } from "unocss"
import { defineConfig } from "unocss/vite"

function desugar(raw: undefined | string, { sign }: { sign?: string } = {}): undefined | 0 | string {
	//// return sign + ("" + raw)

	if (raw === "0") { return 0 }
	if (!raw) { return }

	let desugared = "" // Return variable
	const str = "" + raw
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
	desugared = desugared.replaceAll(/\$([a-zA-Z][a-zA-Z-0-9]*)/g, "var(--$1)") // Desugar "$" -> var(...)
	desugared = desugared.replaceAll("_", " ")                                  // Desugar "_" -> WS
	return desugared
}

function interpolate(shorthand: string, properties: string[]): Rule {
	return [
		new RegExp(`^(-?)${shorthand}-(.+)$`),
		([_, sign, value]) => {
			return properties.reduce((acc, property) => ({
				...acc,
				[property]: desugar(value, { sign: sign as undefined | "-" }),
			}), {})
		},
	]
}

const rules: Rule[] = [
	//// [/^(-)?((?:$)?[a-z]+(?:-[a-z]+)*):(.+)$/, ([_, sign, key, value]) => {
	//// 	if (key.startsWith("$")) {
	//// 		const key2 = `--${key.slice(1)}`
	//// 		return { [key2]: desugar(value, { sign }) }
	//// 	} else if (
	//// 		key.startsWith("-webkit-") ||
	//// 		key.startsWith("-moz-")    ||
	//// 		key.startsWith("-ms-")     ||
	//// 		key.startsWith("-o-")      ||
	//// 		key in cssSpec
	//// 	) {
	//// 		return { [key]: desugar(value, { sign }) }
	//// 	}
	//// 	return {}
	//// }],

	// TODO: Intellisense doesn’t resolve group
	["group", { /* No-op */ }],
	["contents", { "display": "contents" }],

	/*
	 * Positioning
	 */
	["absolute", { "position": "absolute", "z-index": "10" }],
	["fixed",    { "position": "fixed",    "z-index": "10" }],
	["relative", { "position": "relative", "z-index": "10" }],
	["sticky",   { "position": "sticky",   "z-index": "10" }],

	interpolate("z", ["z-index"]),

	[/^(-?)inset(?:-(.+))?$/,    ([_, sign, value]) => ({ "inset":  desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-x(?:-(.+))?$/,  ([_, sign, value]) => ({ "right":  desugar(value, { sign }) ?? 0, "left":   desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-y(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    desugar(value, { sign }) ?? 0, "bottom": desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-t(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    desugar(value, { sign }) ?? 0, "right":  desugar(value, { sign }) ?? 0, "left":   desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-r(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    desugar(value, { sign }) ?? 0, "right":  desugar(value, { sign }) ?? 0, "bottom": desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-b(?:-(.+))?$/,  ([_, sign, value]) => ({ "right":  desugar(value, { sign }) ?? 0, "bottom": desugar(value, { sign }) ?? 0, "left":   desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-l(?:-(.+))?$/,  ([_, sign, value]) => ({ "top":    desugar(value, { sign }) ?? 0, "bottom": desugar(value, { sign }) ?? 0, "left":   desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-tr(?:-(.+))?$/, ([_, sign, value]) => ({ "top":    desugar(value, { sign }) ?? 0, "right":  desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-br(?:-(.+))?$/, ([_, sign, value]) => ({ "right":  desugar(value, { sign }) ?? 0, "bottom": desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-bl(?:-(.+))?$/, ([_, sign, value]) => ({ "bottom": desugar(value, { sign }) ?? 0, "left":   desugar(value, { sign }) ?? 0 })],
	[/^(-?)inset-tl(?:-(.+))?$/, ([_, sign, value]) => ({ "top":    desugar(value, { sign }) ?? 0, "left":   desugar(value, { sign }) ?? 0 })],

	[/^(-?)t-(.+)$/, ([_, sign, value]) => ({ "top":    desugar(value, { sign }) ?? 0 })],
	[/^(-?)r-(.+)$/, ([_, sign, value]) => ({ "right":  desugar(value, { sign }) ?? 0 })],
	[/^(-?)b-(.+)$/, ([_, sign, value]) => ({ "bottom": desugar(value, { sign }) ?? 0 })],
	[/^(-?)l-(.+)$/, ([_, sign, value]) => ({ "left":   desugar(value, { sign }) ?? 0 })],

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
	[/^h-(.+)$/,      ([_, value]) => ({ "height":       desugar(value) })],
	[/^min-h-(.+)$/,  ([_, value]) => ({ "min-height":   desugar(value) })],
	[/^max-h-(.+)$/,  ([_, value]) => ({ "max-height":   desugar(value) })],
	[/^w-(.+)$/,      ([_, value]) => ({ "width":        desugar(value) })],
	[/^min-w-(.+)$/,  ([_, value]) => ({ "min-width":    desugar(value) })],
	[/^max-w-(.+)$/,  ([_, value]) => ({ "max-width":    desugar(value) })],
	[/^aspect-(.+)$/, ([_, value]) => ({ "aspect-ratio": desugar(value) })],

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
	[/^flex-grow(?:-(.+))?$/, ([_, value]) => ({ "flex-grow": desugar(value) ?? 1 })],

	["flex-row", { "display": "flex", "flex-direction": "row" }],
	["flex-col", { "display": "flex", "flex-direction": "column" }],

	[/^flex-justify-(.+)$/, ([_, value]) => ({ "justify-content": value })],
	[/^flex-align-(.+)$/,   ([_, value]) => ({ "align-items":     value })],

	// Shorthand for flex-justify-center flex-align-center
	["flex-center", { "justify-content": "center", "align-items": "center" }],

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

	rules,
	variants: [
		variantImportant, // !key=typed(value) syntax
		variantVariables, // [selector]:key=typed(value) syntax
	],
})
