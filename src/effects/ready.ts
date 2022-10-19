import { createEffect, createRoot, createSignal, onCleanup, onMount } from "solid-js"

export function createReady() {
	const [ready, setReady] = createSignal(false)

	createRoot(dispose => {
		onMount(() => {
			setTimeout(() => {
				setReady(true)
			})
		})
		createEffect(() => {
			if (!ready()) { return }
			document.documentElement.classList.add("ready")
		})
		onCleanup(dispose)
	})

	return ready
}
