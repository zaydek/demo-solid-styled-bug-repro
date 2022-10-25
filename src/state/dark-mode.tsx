import { Accessor, createContext, createEffect, createSignal, ParentProps, Setter, useContext } from "solid-js"

////////////////////////////////////////

type Theme = "light" | "dark"

type State = {
	theme: Accessor<Theme>
}

type Actions = {
	setTheme:    Setter<Theme>
	toggleTheme: () => void
}

////////////////////////////////////////

const DarkModeContext = createContext<{
	state:   State
	actions: Actions
}>()

export function useDarkMode() {
	const context = useContext(DarkModeContext)
	if (!context) {
		throw new Error("No context provided for `useDarkMode`. " +
			"Wrap `<DarkModeProvider>`.")
	}
	return context
}

export function DarkModeProvider(props: ParentProps) {
	const [theme, setTheme] = createSignal<Theme>(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

	function toggleTheme() {
		if (theme() === "light") {
			setTheme("dark")
		} else {
			setTheme("light")
		}
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

	return <>
		<DarkModeContext.Provider
			value={{
				state: {
					theme,
				},
				actions: {
					setTheme,
					toggleTheme,
				},
			}}
		>
			{props.children}
		</DarkModeContext.Provider>
	</>
}
