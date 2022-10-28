import { createMemo, createRoot, createSignal } from "solid-js"
import { canonicalize, searchParams } from "../utils/vanilla"
import { settings } from "./settings"

export type SearchResult = {
	kebab: string
	camel: string
	title: string
	parts: undefined | [string, string, string]
}

export const search = createRoot(() => {
	const [value, setValue] = createSignal(searchParams.string("search") ?? "")
	const canonicalValue = createMemo(() => canonicalize(value()))

	const payload = createMemo(() => {
		if (!settings.manifest()) { return }
		return settings.manifest()!.manifest.payload
	})

	// TODO: Memoize?
	const payloadValues = createMemo(() => {
		if (!payload()) { return }
		return Object.values(payload()!)
	})

	const results = createMemo(() => {
		if (!payload()) { return } // Defer to fallback
		const value = canonicalValue()
		if (!value) {
			return payload() as SearchResult[]
		}
		const _results: SearchResult[] = []
		for (const info of payloadValues()!) {
			const index = info.kebab.indexOf(value)
			if (index !== -1) {
				const s1 = index
				const s2 = index + canonicalValue().length
				_results.push({
					...info,
					parts: [
						info.kebab.slice(0, s1),
						info.kebab.slice(s1, s2),
						info.kebab.slice(s2),
					],
				})
			}
		}
		// Assumes all results have parts
		if (!_results.length) { return } // Defer to fallback
		_results.sort((a, b) => a.parts![0].length -
			b.parts![0].length)
		return _results
	})

	return {
		// STATE
		value,
		canonicalValue,
		results,

		// ACTIONS
		setValue,
	}
})
