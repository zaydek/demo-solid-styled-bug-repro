import { createMemo, createRoot, createSignal } from "solid-js"
import { canonicalize, searchParams } from "../utils/vanilla"
import { settings } from "./settings"

export type SearchResult = {
	kebab: string
	camel: string
	title: string
} & { index?: number }

export const search = createRoot(() => {
	const [value, setValue] = createSignal(searchParams.string("search") ?? "")
	const canonicalValue = createMemo(() => canonicalize(value()))

	const payload = () => settings.manifest()?.manifest.payload

	// TODO: Memoize?
	const payloadValues = () => {
		if (!payload()) { return }
		return Object.values(payload()!)
	}

	const results = () => {
		if (!payload()) { return } // Defer to fallback
		const value = canonicalValue()
		if (!value) {
			return payload()
		}
		const _results: SearchResult[] = []
		for (const info of payloadValues()!) {
			const key = info.kebab
			const index = key.indexOf(value)
			if (index !== -1) {
				_results.push({
					...info,
					index,
				})
			}
		}
		if (!_results.length) { return } // Defer to fallback
		_results.sort((a, b) => a.index! - b.index!)
		return _results
	}

	return {
		// STATE
		value,
		canonicalValue,
		results,

		// ACTIONS
		setValue,
	}
})
