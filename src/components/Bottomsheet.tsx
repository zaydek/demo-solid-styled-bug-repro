import "./Bottomsheet.scss"

import { batch, createEffect, createSignal, on, onCleanup, onMount, ParentProps } from "solid-js"
import { createRef } from "../solid-utils"
import { styleGlobalCursor, toKebabCase, unstyleGlobalCursor } from "../utils"

export const [bottomsheetState, setBottomsheetState] = createSignal<"CLOSED" | "CLOSING" | "OPENING" | "OPEN">("CLOSED")

export function Bottomsheet(props: ParentProps) {
	const [bottomsheetRef, setBottomsheetRef] = createRef()
	const [bottomsheetTabRef, setBottomsheetTabRef] = createRef()

	const [origin, setOrigin] = createSignal<{ x: number, y: number }>()
	const [offset, setOffset] = createSignal<{ x: number, y: number }>()

	let pointerDown = false
	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!bottomsheetTabRef()!.contains(e.target as HTMLElement)) { return }
			// COMPAT/Safari: Click-dragging toggles "cursor: text;"
			e.preventDefault()
			styleGlobalCursor("grab", () => pointerDown = true)
			batch(() => {
				if (bottomsheetState() === "OPENING") {
					setBottomsheetState("OPEN")
				} else if (bottomsheetState() === "CLOSING") {
					setBottomsheetState("CLOSED")
				}
				setOrigin({ x: e.clientX, y: e.clientY })
				setOffset({ x: 0, y: 0 })
			})
		}
		document.addEventListener("pointerdown", handlePointerDown)
		onCleanup(() => document.removeEventListener("pointerdown", handlePointerDown))

		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown) { return }
			// COMPAT/Safari: Click-dragging toggles "cursor: text;"
			e.preventDefault()
			setOffset({ x: e.clientX - origin()!.x, y: e.clientY - origin()!.y })
		}
		document.addEventListener("pointermove", handlePointerMove)
		onCleanup(() => document.removeEventListener("pointermove", handlePointerMove))

		// Release condition
		function handlePointerUp(e: PointerEvent) {
			if (!offset()) { return }
			batch(() => {
				if (bottomsheetState() === "OPEN") {
					if (offset()!.y >= 100) {
						setBottomsheetState("CLOSING")
					} else {
						setBottomsheetState("OPENING")
					}
				} else if (bottomsheetState() === "CLOSED") {
					if (offset()!.y <= -200) {
						setBottomsheetState("OPENING")
					} else {
						setBottomsheetState("CLOSING")
					}
				}
				setOrigin() // No-op
				setOffset() // No-op
			})
			unstyleGlobalCursor(() => pointerDown = false)
		}
		document.addEventListener("pointerup", handlePointerUp)
		onCleanup(() => document.removeEventListener("pointerup", handlePointerUp))

		// Release condition
		document.addEventListener("pointerleave", handlePointerUp)
		onCleanup(() => document.removeEventListener("pointerleave", handlePointerUp))
	})

	createEffect(on(offset, () => {
		if (offset()) {
			bottomsheetRef()!.style.setProperty("--__bottomsheet-delta", `${offset()!.y}px`)
		} else {
			bottomsheetRef()!.style.setProperty("--__bottomsheet-delta", "0px")
		}
	}, { defer: true }))

	return <>
		<div
			class="bottomsheet-backdrop"
			onClick={e => {
				if (bottomsheetState() === "OPEN") {
					setBottomsheetState("CLOSING")
				}
			}}
			// @ts-expect-error
			inert={(bottomsheetState() === "CLOSING" || bottomsheetState() === "CLOSED") || undefined}
		></div>
		<div
			ref={setBottomsheetRef}
			class={`bottomsheet is-${toKebabCase(bottomsheetState())}`}
			onTransitionEnd={e => {
				if (bottomsheetState() === "OPENING") {
					setBottomsheetState("OPEN")
				} else if (bottomsheetState() === "CLOSING") {
					setBottomsheetState("CLOSED")
				}
			}}
		>
			<div ref={setBottomsheetTabRef} class="bottomsheet-tab">
				<div class="bottomsheet-tab-icon"></div>
			</div>
			<hr />
			{/* @ts-expect-error */}
			<div class="bottomsheet-content-scroller" inert={(bottomsheetState() === "CLOSING" || bottomsheetState() === "CLOSED") || undefined}>
				{props.children}
			</div>
		</div>
	</>
}
