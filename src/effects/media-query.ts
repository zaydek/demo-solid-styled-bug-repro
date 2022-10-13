import { createRoot, createSignal, onCleanup, onMount } from "solid-js"

export function createMediaQuery(mediaQuery: `(min-width: ${number}px)`) {
	const mq = window.matchMedia(mediaQuery)
	const [matches, setMatches] = createSignal(mq.matches)

	createRoot(dispose => {
		onMount(() => {
			function handleBreakpoint(e: MediaQueryListEvent) {
				setMatches(e.matches)
			}
			mq.addEventListener("change", handleBreakpoint, false)
			onCleanup(() => mq.removeEventListener("change", handleBreakpoint, false))
		})
		onCleanup(dispose)
	})

	return matches
}

export const useMediaQuery = createMediaQuery
