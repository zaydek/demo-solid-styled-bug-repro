import { createRoot, createSignal, onMount } from "solid-js"

const [_mounted, setMounted] = createSignal(false)

createRoot(() => {
	onMount(() => {
		setTimeout(() => {
			setMounted(true)
		}, 0)
	})
})

export const mounted = _mounted
