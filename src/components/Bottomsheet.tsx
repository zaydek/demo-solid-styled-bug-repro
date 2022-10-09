import "./Bottomsheet.scss"

import { batch, createEffect, createSignal, on, onCleanup, onMount, ParentProps } from "solid-js"
import { createRef } from "../solid-utils"

export function Bottomsheet(props: ParentProps) {
	const [bottomsheetRef, setBottomsheetRef] = createRef()
	const [bottomsheetTabRef, setBottomsheetTabRef] = createRef()

	const [state, setState] = createSignal<"CLOSED" | "CLOSING" | "OPENING" | "OPEN">("CLOSED")
	const [pointerDown, setPointerDown] = createSignal(false)

	const [origin, setOrigin] = createSignal<{ x: number, y: number }>()
	const [offset, setOffset] = createSignal<{ x: number, y: number }>()

	// Sets the document cursor
	function setCursor(cursor: string) {
		document.body.style.cursor = cursor
	}

	// Removes the document cursor
	function removeCursor() {
		document.body.style.cursor = ""
		if (!document.body.style.length) {
			document.body.removeAttribute("style")
		}
	}

	// Add global event listeners
	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (bottomsheetTabRef()!.contains(e.target as HTMLElement)) {
				// COMPAT/Safari: Click-dragging toggles "cursor: text;"
				e.preventDefault()
				setCursor("grab")
				batch(() => {
					if (state() === "OPENING") {
						setState("OPEN")
					} else if (state() === "CLOSING") {
						setState("CLOSED")
					}
					setPointerDown(true)
					setOrigin({ x: e.clientX, y: e.clientY })
					setOffset({ x: 0, y: 0 })
				})
			}
		}
		document.addEventListener("pointerdown", handlePointerDown)
		onCleanup(() => document.removeEventListener("pointerdown", handlePointerDown))

		function handlePointerMove(e: PointerEvent) {
			if (pointerDown()) {
				// COMPAT/Safari: Click-dragging toggles "cursor: text;"
				e.preventDefault()
				setCursor("grab")
				setOffset({ x: e.clientX - origin()!.x, y: e.clientY - origin()!.y })
			}
		}
		document.addEventListener("pointermove", handlePointerMove)
		onCleanup(() => document.removeEventListener("pointermove", handlePointerMove))

		// Release condition
		function handlePointerUp(e: PointerEvent) {
			if (!offset()) { return }
			batch(() => {
				if (state() === "OPEN") {
					if (offset()!.y >= 100) {
						setState("CLOSING")
					} else {
						setState("OPENING")
					}
				} else if (state() === "CLOSED") {
					if (offset()!.y <= -200) {
						setState("OPENING")
					} else {
						setState("CLOSING")
					}
				}
				setPointerDown(false)
				setOrigin() // No-op
				setOffset() // No-op
			})
			removeCursor()
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
				if (state() === "OPEN") {
					setState("CLOSING")
				}
			}}
			// @ts-expect-error
			inert={(state() === "CLOSING" || state() === "CLOSED") || undefined}
		></div>
		<div
			ref={setBottomsheetRef}
			class={`bottomsheet is-${state().toLowerCase()} `}
			onTransitionEnd={e => {
				if (state() === "OPENING") {
					setState("OPEN")
				} else if (state() === "CLOSING") {
					setState("CLOSED")
				}
			}}
		>
			<div ref={setBottomsheetTabRef} class="bottomsheet-tab">
				<div class="bottomsheet-tab-icon"></div>
			</div>
			<hr />
			{/* @ts-expect-error */}
			<div class="bottomsheet-content" inert={(state() === "CLOSING" || state() === "CLOSED") || undefined}>
				{props.children}
			</div>
		</div>
	</>
}
