import { createEffect, createRoot, createSignal } from "solid-js"

export const debugCSS = createRoot(() => {
	const [enabled, setEnabled] = createSignal(false)

	function toggle() {
		setEnabled(curr => !curr)
	}

	createEffect(() => {
		const root = document.documentElement
		if (enabled()) {
			root.classList.add("debug-css")
		} else {
			root.classList.remove("debug-css")
			if (root.classList.length === 0) {
				root.removeAttribute("class")
			}
		}
	})

	return {
		// STATE
		enabled,

		// ACTIONS
		setEnabled,
		toggle,
	}
})
