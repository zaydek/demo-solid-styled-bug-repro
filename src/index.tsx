import "the-new-css-reset"
import "virtual:uno.css"
import "./1-base.css"
import "./2-vars.css"
import "./3-components.css"

import { createSignal, ParentProps, Setter } from "solid-js"
import { For, render, Show } from "solid-js/web"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { createMediaQuery } from "./effects"
import { only, range } from "./utils"

////////////////////////////////////////

function Sheet(props: ParentProps<{
	sidesheet:    SidesheetState
	setSidesheet: Setter<SidesheetState>
}>) {
	const responsive = createMediaQuery("(max-width: 500px)")

	return <>
		<Show when={responsive()}>
			<Bottomsheet initialState="closed">
				{props.children}
			</Bottomsheet>
		</Show>
		<Show when={!responsive()}>
			<Sidesheet state={props.sidesheet} setState={props.setSidesheet}>
				{props.children}
			</Sidesheet>
		</Show>
	</>
}

////////////////////////////////////////

function App() {
	const [sidesheet, setSidesheet] = createSignal<SidesheetState>("closed")

	return <>
		{/* @ts-expect-error */}
		<main class="main-content" inert={only(sidesheet() === "expanded")}>
			<For each={range(1000)}>{() => <>
				Hello, world!
			</>}</For>
		</main>
		<Sheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
			<aside class="aside-content">
				<For each={range(1000)}>{() => <>
					Hello, world!
				</>}</For>
			</aside>
		</Sheet>
	</>
}

////////////////////////////////////////

render(() => <>
	<App />
</>, document.getElementById("root")!)
