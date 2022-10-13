import { batch, createEffect, createSignal, DEV, JSX, onCleanup, onMount, ParentProps } from "solid-js"
import { createRef, css, cx } from "../../solid-utils"

export type SidesheetState = "closed" | "open" | "expanded"

export function Sidesheet(props: ParentProps<{
	style?:        JSX.CSSProperties,
	initialState?: SidesheetState
}>) {
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
					setState("expanded")
					setTransition(true)
				})
			} else if (state() === "expanded") {
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
				setPointerOffset(Math.round(clientRect.right - e.clientX))
				setP1(Math.round(e.clientX))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setP2(Math.round(e.clientX))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)
				if (state() === "closed") {
					if (delta < -384) {
						setState("expanded")
					} else if (delta < 0) {
						setState("open")
					}
				} else if (state() === "open") {
					if (delta < 0) {
						setState("expanded")
					} else if (delta > 0) {
						setState("closed")
					}
				} else if (state() === "expanded") {
					if (delta > 384) {
						setState("closed")
					} else if (delta > 0) {
						setState("open")
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
			ref()!.style.setProperty("--sidesheet-drag-translate-x", "0px")
		} else {
			const delta = (p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)
			ref()!.style.setProperty("--sidesheet-drag-translate-x", `${delta}px`)
		}
	})

	return <>
		{css`
			.sidesheet-backdrop {
				position: fixed;
				z-index: 90;
				inset: 0;
			}
			.sidesheet-backdrop:has(+ .sidesheet.is-closed)   { background-color: transparent; }
			.sidesheet-backdrop:has(+ .sidesheet.is-open)     { background-color: transparent; }
			.sidesheet-backdrop:has(+ .sidesheet.is-expanded) { background-color: hsl(0 0% 0% / 25%); }
			.sidesheet-backdrop:has(+ .sidesheet.transition) {
				transition: background-color 600ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			:root { --sidesheet-draggable-width: 40px; }
			.sidesheet {
				// Runtime values
				--sidesheet-translate-x: 0px;
				--sidesheet-drag-translate-x: 0px;

				position: fixed;
				z-index: 100;
				inset: 0 0 0 auto;
				width: calc(768px + var(--sidesheet-draggable-width));
				transform: translateX(calc(var(--sidesheet-translate-x) + var(--sidesheet-drag-translate-x)));
			}
			.sidesheet.is-closed   { --sidesheet-translate-x: 768px; }
			.sidesheet.is-open     { --sidesheet-translate-x: 384px; }
			.sidesheet.is-expanded { --sidesheet-translate-x: 0px; }
			.sidesheet.transition {
				transition: transform 600ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			.sidesheet-draggable {
				width: var(--sidesheet-draggable-width);

				// CSS Grid
				display: grid;
				place-items: center;

				cursor: grab;
			}
			:root:has(.sidesheet-draggable:active) {
				cursor: grab;
			}

			//////////////////////////////////

			.sidesheet-drag-indicator {
				width: 4px;
				aspect-ratio: 1 / 12;
				border-radius: var(--full);
				background-color: hsl(0 0% 50%);
			}
			.sidesheet-draggable:active .sidesheet-drag-indicator {
				background-color: hsl(0 0% 25%);
			}

			//////////////////////////////////

			.sidesheet-card {
				background-color: white;
				box-shadow: 0 0 0 1px hsl(0 0% 0% / 25%);
			}

			//////////////////////////////////

			.sidesheet-content {
				overflow-y: auto;
			}
			.sidesheet:is(.is-closed, .is-open) .sidesheet-content { width: 384px; }
			.sidesheet.is-expanded .sidesheet-content { width: 768px; }
		`}
		<div
			ref={setBackdropRef}
			class="sidesheet-backdrop"
			onClick={forceClose}
			// @ts-expect-error: Property 'inert' does not exist on type 'HTMLAttributes<HTMLDivElement>'. ts(2322)
			inert={(state() === "closed" || state() === "open") || undefined}
		></div>
		<div
			ref={setRef}
			class={cx(`sidesheet is-${state()} ${transition() ? "transition" : ""} flex-row`)}
			onTransitionEnd={e => setTransition()}
		>
			<div ref={setDraggableRef} class="sidesheet-draggable" tabIndex={0}>
				<div class="sidesheet-drag-indicator"></div>
			</div>
			{/* @ts-expect-error: Property 'inert' does not exist on type 'HTMLAttributes<HTMLDivElement>'. ts(2322) */}
			<div class="sidesheet-card flex-grow flex-col" inert={state() === "closed" || undefined}>
				<div class="sidesheet-content">
					{props.children}
				</div>
			</div>
		</div>
	</>
}
