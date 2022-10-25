import { createMemo, createRoot, createSignal } from "solid-js"
import { canonicalize, searchParams } from "../utils/vanilla"
import { settings } from "./settings"

export type IndexedResult = {
	kebab: string
	camel: string
	title: string
} & { index?: number }

export const search = createRoot(() => {
	const [value, setValue] = createSignal(searchParams.string("search") ?? "")
	const canonicalValue = createMemo(() => canonicalize(value()))

	const _payload = () => settings.manifest()?.manifest.payload

	// TODO: Memoize here?
	const _payloadValues = () => {
		if (!_payload()) { return }
		return Object.values(_payload()!)
	}

	const results = () => {
		if (!settings.manifest()) { return }
		const value = canonicalValue()
		if (!value) {
			return _payload()
		}
		const matches: IndexedResult[] = []
		for (const info of _payloadValues()!) {
			const key = info.kebab
			const index = key.indexOf(value)
			if (index !== -1) {
				matches.push({
					...info,
					index,
				})
			}
		}
		if (!matches.length) { return }
		matches.sort((a, b) => a.index! - b.index!)
		return matches
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
