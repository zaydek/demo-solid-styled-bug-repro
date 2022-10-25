import { Accessor, createContext, createEffect, createSignal, ParentProps, Setter } from "solid-js"

////////////////////////////////////////

type State = {
	debugCSS: Accessor<boolean>
}

type Actions = {
	setDebugCSS:    Setter<boolean>
	toggleDebugCSS: () => void
}

////////////////////////////////////////

const DebugCSSContext = createContext<{
	state:   State
	actions: Actions
}>()

export function DebugCSS(props: ParentProps) {
	const [debugCSS, setDebugCSS] = createSignal(false)

	function toggleDebugCSS() {
		setDebugCSS(curr => !curr)
	}

	createEffect(() => {
		const root = document.documentElement
		if (debugCSS()) {
			root.classList.add("debug-css")
		} else {
			root.classList.remove("debug-css")
			if (root.classList.length === 0) {
				root.removeAttribute("class")
			}
		}
	})

	return <>
		<DebugCSSContext.Provider
			value={{
				state: {
					debugCSS,
				},
				actions: {
					setDebugCSS,
					toggleDebugCSS,
				},
			}}
		>
			{props.children}
		</DebugCSSContext.Provider>
	</>
}
