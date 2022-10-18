import { Rule } from "unocss"
import { defineConfig } from "unocss/vite"

function desugar(raw: undefined | string, { sign }: { sign?: string } = {}) {
	if (raw === undefined) { return }

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

const rules: Rule[] = [
	[/^\[(-)?((?:$)?[a-z]+(?:-[a-z]+)*):(.+)\]$/, ([_, sign, key, value]) => {
		return { [key]: desugar(value, { sign }) }
	}],
]

export default defineConfig({
	presets: [], // Zero out
	rules,
})
