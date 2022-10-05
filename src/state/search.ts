import { createEffect, createMemo, createRoot, createSignal } from "solid-js"
import { canonicalize } from "../utils"
import { settings } from "./settings"

////////////////////////////////////////

export type IndexedResult = {
	kebab: string
	camel: string
	title: string
} & { index?: number }

export const search = createRoot(() => {
	const [value, setValue] = createSignal("")
	const canonicalValue = createMemo(() => canonicalize(value()))

	const _payload = () => settings.manifest()?.manifest.payload
	const _payloadValues = () => {
		if (!_payload()) { return }
		return Object.values(_payload()!)
	}

	const results = (): undefined | IndexedResult[] => {
		if (!settings.manifest()) { return } // This function depends on manifest being loaded

		const value = canonicalValue()
		if (!value) {
			return _payload()
		}
		const matches = []
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
		if (matches.length) {
			matches.sort((a, b) => a.index! - b.index!)
			return matches
		} else {
			return // Return a nullish value because of ?? operators
		}
	}

	createEffect(() => {
		if (!canonicalValue()) {
			document.title = "Heroicons"
			return
		} else if (!results()) {
			document.title = "0 results"
			return
		}
		const { length } = results()!
		document.title = `‘${canonicalValue()}’ ${length} Icon${length === 1 ? "" : "s"}`
	})

	return {
		// State
		value,
		canonicalValue, // Derived
		results,        // Derived

		// Actions
		setValue,
	}
})
