import { Accessor, createContext, createEffect, createMemo, createSignal, ParentProps, Setter, useContext } from "solid-js"
import { canonicalize } from "../utils/vanilla"
import { params } from "./params"
import { settings } from "./settings"

////////////////////////////////////////

export type IndexedResult = {
	kebab: string
	camel: string
	title: string
} & { index?: number }

type State = {
	searchValue:          Accessor<string>
	canonicalSearchValue: Accessor<string>
	searchResults:        Accessor<undefined | IndexedResult[]>
}

type Actions = {
	setSearchValue: Setter<string>
}

////////////////////////////////////////

const SearchContext = createContext<{
	state:   State
	actions: Actions
}>()

export function useSearch() {
	const context = useContext(SearchContext)
	if (!context) {
		throw new Error("No context provided for `useSearch`. " +
			"Wrap `<SearchProvider>`.")
	}
	return context
}

export function SearchProvider(props: ParentProps) {
	const [searchValue, setSearchValue] = createSignal(params.get.string("search") ?? "")
	const canonicalSearchValue = createMemo(() => canonicalize(searchValue()))

	const _payload = () => settings.manifest()?.manifest.payload
	const _payloadValues = () => {
		if (!_payload()) { return }
		return Object.values(_payload()!)
	}

	const searchResults = () => {
		if (!settings.manifest()) { return }
		const value = canonicalSearchValue()
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

	// TODO
	//// createEffect(() => {
	//// 	if (!canonicalSearchValue()) {
	//// 		document.title = "Heroicons"
	//// 		return
	//// 	} else if (!searchResults()) {
	//// 		document.title = "0 results"
	//// 		return
	//// 	}
	//// 	const { length } = searchResults()!
	//// 	document.title = `‘${canonicalSearchValue()}’ ${length} Icon${length === 1 ? "" : "s"}`
	//// })

	return <>
		<SearchContext.Provider
			value={{
				state: {
					searchValue,
					canonicalSearchValue,
					searchResults,
				},
				actions: {
					setSearchValue,
				},
			}}
		>
			{props.children}
		</SearchContext.Provider>
	</>
}
