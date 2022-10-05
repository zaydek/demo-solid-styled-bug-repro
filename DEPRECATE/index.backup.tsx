import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { createEffect, createRoot, createSignal, onMount } from "solid-js"
import { render } from "solid-js/web"
import { App } from "./App"

const [mounted, setMounted] = createSignal<boolean>()

createRoot(() => {
	onMount(() => {
		setTimeout(() => {
			setMounted(true)
		}, 0)
	})
	createEffect(() => {
		if (!mounted()) { return }
		document.body.setAttribute("data-state-mounted", "")
	})
})

render(() =>
	<App />,
	document.getElementById("root")!,
)
