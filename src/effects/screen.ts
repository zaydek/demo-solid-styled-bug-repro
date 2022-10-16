import { createRoot, onCleanup, onMount } from "solid-js"

export function createScreenVars() {
	createRoot(dispose => {
		onMount(() => {
			function handleResize(e?: UIEvent) {
				const { innerHeight: screenH, innerWidth: screenW } = window
				document.documentElement.style.setProperty("--screen-h", `${screenH}px`)
				document.documentElement.style.setProperty("--screen-w", `${screenW}px`)
			}
			handleResize()
			window.addEventListener("resize", handleResize, false)
			onCleanup(() => {
				document.documentElement.style.setProperty("--screen-h", "")
				document.documentElement.style.setProperty("--screen-w", "")
				if (!document.documentElement.style.length) {
					document.documentElement.removeAttribute("style")
				}
				window.removeEventListener("resize", handleResize, false)
			})
		})
		onCleanup(dispose)
	})
}
