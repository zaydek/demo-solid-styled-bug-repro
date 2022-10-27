import { createEffect, createRoot, createSignal, onCleanup } from "solid-js"
import { hasStyle } from "./css"

export function createScreen({ suppressWarning }: { suppressWarning?: boolean } = {}) {
	suppressWarning ??= false

	const root = document.documentElement
	if (!suppressWarning && hasStyle(root, "--screen-y") && hasStyle(root, "--screen-x")) {
		console.warn("`createScreen` has been previously invoked. " +
			"Try to only invoke only `createScreen` once.")
	}

	const {
		innerHeight: _screenY,
		innerWidth:  _screenX,
	} = window
	const [screenY, setScreenY] = createSignal(_screenY)
	const [screenX, setScreenX] = createSignal(_screenX)

	const dispose = createRoot(dispose => {
		function handleResize() {
			const {
				innerHeight: _screenY,
				innerWidth:  _screenX,
			} = window
			setScreenY(_screenY)
			setScreenX(_screenX)
		}
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => window.removeEventListener("resize", handleResize, false))
		createEffect(() => {
			document.documentElement.style.setProperty("--screen-y", `${screenY()}px`)
			document.documentElement.style.setProperty("--screen-x", `${screenX()}px`)
			onCleanup(() => {
				document.documentElement.style.removeProperty("--screen-y")
				document.documentElement.style.removeProperty("--screen-x")
				if (!document.documentElement.style.length) {
					document.documentElement.removeAttribute("style")
				}
			})
		})
		return dispose
	})

	return [{ screenY, screenX }, dispose] as const
}
