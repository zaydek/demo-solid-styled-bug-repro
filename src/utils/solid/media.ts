import { createRoot, createSignal, onCleanup, onMount } from "solid-js"

export function createMediaSignal(media: string) {
	const mq = window.matchMedia(media)
	const [matches, setMatches] = createSignal(mq.matches)

	const dispose = createRoot(dispose => {
		onMount(() => {
			function handleBreakpoint(e: MediaQueryListEvent) {
				setMatches(e.matches)
			}
			mq.addEventListener("change", handleBreakpoint, false)
			onCleanup(() => mq.removeEventListener("change", handleBreakpoint, false))
		})
		return dispose
	})

	return [matches, dispose] as const
}
