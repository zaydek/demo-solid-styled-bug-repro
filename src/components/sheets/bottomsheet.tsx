import { batch, createEffect, createSignal, DEV, onCleanup, onMount, ParentProps } from "solid-js"
import { createRef, css, cx } from "../../solid-utils"

export type BottomsheetState = "closed" | "open"

export function Bottomsheet(props: ParentProps<{ initialState: BottomsheetState }>) {
	const [backdropRef, setBackdropRef] = createRef()
	const [ref, setRef] = createRef()
	const [draggableRef, setDraggableRef] = createRef()

	const [state, setState] = createSignal(props.initialState ?? "open")
	const [pointerDown, setPointerDown] = createSignal<undefined | true>()
	const [pointerOffset, setPointerOffset] = createSignal<number>()
	const [p1, setP1] = createSignal<number>()
	const [p2, setP2] = createSignal<number>()

	const [transition, setTransition] = createSignal<undefined | true>()

	function forceClose() {
		batch(() => {
			setState("closed")
			setPointerDown()
			setPointerOffset()
			setP1()
			setP2()
			setTransition(true)
		})
	}

	if (DEV) {
		document.addEventListener("keydown", e => {
			if (e.key !== "d") { return }
			if (state() === "closed") {
				batch(() => {
					setState("open")
					setTransition(true)
				})
			} else if (state() === "open") {
				batch(() => {
					setState("closed")
					setTransition(true)
				})
			}
		})
	}

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!(e.button === 0 || e.buttons === 1)) { return }
			if (!(backdropRef()!.contains(e.target as HTMLElement) ||
				draggableRef()!.contains(e.target as HTMLElement))) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			batch(() => {
				const clientRect = draggableRef()!.getBoundingClientRect()
				setPointerDown(true)
				setPointerOffset(Math.round(clientRect.top - e.clientY))
				setP1(Math.round(e.clientY))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setP2(Math.round(e.clientY))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)
				if (state() === "closed") {
					if (delta < 0) {
						setState("open")
					}
				} else if (state() === "open") {
					if (delta > 0) {
						setState("closed")
					}
				}
				setPointerDown()
				setPointerOffset()
				setP1()
				setP2()
				setTransition(true)
			})
		}
		document.addEventListener("pointerdown",  handlePointerDown, false)
		document.addEventListener("pointermove",  handlePointerMove, false)
		document.addEventListener("pointerup",    handlePointerUp,   false)
		document.addEventListener("pointerleave", handlePointerUp,   false)
		onCleanup(() => {
			document.removeEventListener("pointerdown",  handlePointerDown, false)
			document.removeEventListener("pointermove",  handlePointerMove, false)
			document.removeEventListener("pointerup",    handlePointerUp,   false)
			document.removeEventListener("pointerleave", handlePointerUp,   false)
		})
	})

	createEffect(() => {
		if (!pointerOffset() || !p1() || !p2()) {
			ref()!.style.setProperty("--bottomsheet-drag-translate-y", "0px")
		} else {
			const delta = (p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)
			ref()!.style.setProperty("--bottomsheet-drag-translate-y", `${delta}px`)
		}
	})

	return <>
		{css`
			.bottomsheet-backdrop {
				position: fixed;
				z-index: 90;
				inset: 0;
			}
			.bottomsheet-backdrop:has(+ .bottomsheet.is-closed) { background-color: transparent; }
			.bottomsheet-backdrop:has(+ .bottomsheet.is-open)   { background-color: hsl(0 0% 0% / 25%); }
			.bottomsheet-backdrop:has(+ .bottomsheet.is-transition) {
				transition: background-color 600ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			:root { --bottomsheet-draggable-height: 40px; }
			.bottomsheet {
				// Runtime values
				--bottomsheet-screen-y: var(--screen-y);
				--bottomsheet-translate-y: 0px;
				--bottomsheet-drag-translate-y: 0px;

				position: fixed;
				z-index: 100;
				inset: 0 0 auto 0;
				min-height: calc(100vh - var(--bottomsheet-draggable-height) * 2);
				border-radius: calc(var(--bottomsheet-draggable-height) / 2) calc(var(--bottomsheet-draggable-height) / 2) 0 0;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
				transform: translateY(calc(var(--bottomsheet-screen-y) + var(--bottomsheet-translate-y) + var(--bottomsheet-drag-translate-y)));
			}
			.bottomsheet.is-closed {
				--bottomsheet-screen-y: var(--screen-y);
				--bottomsheet-translate-y: -1 * var(--bottomsheet-draggable-height);
			}
			.bottomsheet.is-open   {
				--bottomsheet-screen-y: 0px;
				--bottomsheet-translate-y: var(--bottomsheet-draggable-height);
			}
			.bottomsheet.is-transition {
				transition: transform 600ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			.bottomsheet-draggable {
				height: var(--bottomsheet-draggable-height);

				// CSS Grid
				display: grid;
				place-items: center;

				cursor: grab;
			}
			:root:has(.bottomsheet-draggable:active) {
				cursor: grab;
			}

			//////////////////////////////////

			.bottomsheet-drag-indicator {
				height: 4px;
				aspect-ratio: 12;
				border-radius: var(--full);
				background-color: hsl(0 0% 50%);
			}
			.bottomsheet-draggable:active .bottomsheet-drag-indicator {
				background-color: hsl(0 0% 25%);
			}

			//////////////////////////////////

			// COMPAT/Safari: Safari doesn’t disable inert unless there is some CSS
			// listening to the presence of the property
			.bottomsheet-content[inert] { content: ""; }
			.bottomsheet-content {
				height: calc(
					var(--screen-y) -
					var(--bottomsheet-draggable-height) - // .bottomsheet-backdrop
					1px - // <hr>
					var(--bottomsheet-draggable-height)
				);
				overflow-y: auto;
			}
		`}
		<div
			ref={setBackdropRef}
			class="bottomsheet-backdrop"
			onClick={forceClose}
			// @ts-expect-error: Property 'inert' does not exist on type 'HTMLAttributes<HTMLDivElement>'. ts(2322)
			inert={!(state() === "closed") || undefined}
		></div>
		<div
			ref={setRef}
			class={cx(`bottomsheet is-${state()} ${transition() ? "is-transition" : ""}`)}
			onTransitionEnd={e => setTransition()}
		>
			<div ref={setDraggableRef} class="bottomsheet-draggable" tabIndex={0}>
				<div class="bottomsheet-drag-indicator"></div>
			</div>
			<hr class="h-1px [background-color]-hsl(0_0%_75%)" />
			{/* @ts-expect-error: Property 'inert' does not exist on type 'HTMLAttributes<HTMLDivElement>'. ts(2322) */}
			<div class="bottomsheet-content" inert={state() === "closed" || undefined}>
				{props.children}
			</div>
		</div>
	</>
}
