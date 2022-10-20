import { createRoot, onCleanup, onMount } from "solid-js"
import { hasStyle } from "./css"

export function createScreenEffect() {
	const root = document.documentElement
	if (hasStyle(root, "--screen-y") || hasStyle(root, "--screen-x")) { return }

	createRoot(dispose => {
		onMount(() => {
			function handleResize(e?: UIEvent) {
				const { innerHeight: screenY, innerWidth: screenX } = window
				document.documentElement.style.setProperty("--screen-y", `${screenY}px`)
				document.documentElement.style.setProperty("--screen-x", `${screenX}px`)
			}
			handleResize()
			window.addEventListener("resize", handleResize, false)
			onCleanup(() => {
				document.documentElement.style.setProperty("--screen-y", "")
				document.documentElement.style.setProperty("--screen-x", "")
				if (!document.documentElement.style.length) {
					document.documentElement.removeAttribute("style")
				}
				window.removeEventListener("resize", handleResize, false)
			})
		})
		onCleanup(dispose)
	})

	return void 0
}
