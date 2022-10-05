import { createEffect, createRoot, createSignal, DEV } from "solid-js"

const KEY = "\\"

export const debugCSS = createRoot(() => {
	const [enabled, setEnabled] = createSignal(false)

	function toggle() {
		setEnabled(curr => !curr)
	}

	if (DEV) {
		document.addEventListener("keydown", e => {
			if (e.key === KEY) {
				toggle()
			}
		}, false)
	}

	createEffect(() => {
		const root = document.documentElement
		if (enabled()) {
			root.classList.add("is-debug-css")
		} else {
			root.classList.remove("is-debug-css")
			if (root.classList.length === 0) {
				root.removeAttribute("class")
			}
		}
	})

	return {
		// State
		enabled,

		// Actions
		setEnabled,
		toggle, // Derived
	}
})
