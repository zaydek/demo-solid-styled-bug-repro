import { createRoot, onCleanup, onMount } from "solid-js"

export function createScreenCSSVars() {
	createRoot(dispose => {
		onMount(() => {
			function handleResize(e?: UIEvent) {
				const { innerWidth: screenX, innerHeight: screenY } = window
				document.documentElement.style.setProperty("--screen-x", `${screenX}px`)
				document.documentElement.style.setProperty("--screen-y", `${screenY}px`)
			}
			handleResize()
			window.addEventListener("resize", handleResize, false)
			onCleanup(() => {
				document.documentElement.style.setProperty("--screen-x", "")
				document.documentElement.style.setProperty("--screen-y", "")
				if (!document.documentElement.style.length) {
					document.documentElement.removeAttribute("style")
				}
				window.removeEventListener("resize", handleResize, false)
			})
		})
		onCleanup(dispose)
	})
}

export const useScreenCSSVars = createScreenCSSVars
