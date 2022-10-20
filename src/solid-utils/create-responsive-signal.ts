import { createRoot, createSignal, onCleanup, onMount } from "solid-js"

type MediaQuery =
	| `(min-width: ${number}px)`
	| `(max-width: ${number}px)`

export function createResponsiveSignal(mediaQuery: MediaQuery) {
	const media = window.matchMedia(mediaQuery)
	const [matches, setMatches] = createSignal(media.matches)

	createRoot(dispose => {
		onMount(() => {
			function handleBreakpoint(e: MediaQueryListEvent) {
				setMatches(e.matches)
			}
			media.addEventListener("change", handleBreakpoint, false)
			onCleanup(() => media.removeEventListener("change", handleBreakpoint, false))
		})
		onCleanup(dispose)
	})

	return matches
}
