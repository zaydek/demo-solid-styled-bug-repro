import { createEffect, createRoot, createSignal, onCleanup, onMount } from "solid-js"
import { hasClass } from "./css"

export function createReadySignal() {
	const root = document.documentElement
	if (hasClass(root, "ready")) { return }

	const [ready, setReady] = createSignal(false)

	createRoot(dispose => {
		onMount(() => {
			setTimeout(() => {
				setReady(true)
			}, 0)
		})
		createEffect(() => {
			if (!ready()) { return }
			document.documentElement.classList.add("ready")
		})
		onCleanup(dispose)
	})

	return void 0
}
