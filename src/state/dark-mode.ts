import { createEffect, createRoot, createSignal, DEV } from "solid-js"

const KEY = "`"

export const darkMode = createRoot(() => {
	const [theme, setTheme] = createSignal<"light" | "dark">(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

	function toggle() {
		setTheme(curr => curr === "light" ? "dark" : "light")
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
		if (theme() === "dark") {
			// Enable dark mode
			root.classList.add("is-dark")
		} else {
			// Enable light mode (default)
			root.classList.remove("is-dark")
			if (root.classList.length === 0) {
				root.removeAttribute("class")
			}
		}
	})

	return {
		// State
		theme,

		// Actions
		setTheme,
		toggle, // Derived
	}
})
