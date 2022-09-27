import { createSignal } from "solid-js"

export const [active, setActive] = createSignal<boolean>()

//// setInterval(() => {
//// 	setActive(curr => curr === undefined ? true : undefined)
//// }, 1_000)
