import { createEffect, createRoot, createSignal, onCleanup, onMount } from "solid-js"
import { hasClass } from "./css"

export function createMounted({ suppressWarning }: { suppressWarning?: boolean } = {}) {
	suppressWarning ??= false

	const root = document.documentElement
	if (!suppressWarning && hasClass(root, "mounted")) {
		console.warn("`createMounted` has been previously invoked. " +
			"Try to only invoke only `createMounted` once.")
	}

	const [mounted, setMounted] = createSignal(false)

	const dispose = createRoot(dispose => {
		onMount(() => {
			setTimeout(() => {
				setMounted(true)
			}, 0)
		})
		createEffect(() => {
			if (!mounted()) { return }
			document.documentElement.classList.add("mounted")
			onCleanup(() => {
				document.documentElement.classList.remove("mounted")
				if (!document.documentElement.classList.length) {
					document.documentElement.removeAttribute("class")
				}
			})
		})
		return dispose
	})

	return [mounted, dispose] as const
}
