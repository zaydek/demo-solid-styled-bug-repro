import { createEffect, createRoot, createSignal } from "solid-js"

export type Theme = "light" | "dark"

export const darkMode = createRoot(() => {
	const [theme, setTheme] = createSignal<Theme>(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

	function toggle() {
		setTheme(curr => curr === "light" ? "dark" : "light")
	}

	createEffect(() => {
		const root = document.documentElement
		if (theme() === "dark") {
			root.classList.add("dark-mode") // Enable dark mode
		} else {
			root.classList.remove("dark-mode") // Enable light mode (default)
			if (root.classList.length === 0) {
				root.removeAttribute("class")
			}
		}
	})

	return {
		// STATE
		theme,

		// ACTIONS
		setTheme,
		toggle,
	}
})
