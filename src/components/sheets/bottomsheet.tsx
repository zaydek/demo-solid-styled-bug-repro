import { batch, createSignal, DEV, onCleanup, onMount, ParentProps } from "solid-js"
import { createRef, css, cx } from "../../solid-utils"
import { only, round } from "../../utils"

export type BottomsheetState = "closed" | "open"

export function Bottomsheet(props: ParentProps<{ initialState: BottomsheetState }>) {
	const [backdrop, setBackdrop] = createRef()
	const [draggable, setDraggable] = createRef()

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
			if (!(backdrop()!.contains(e.target as HTMLElement) ||
				draggable()!.contains(e.target as HTMLElement))) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			batch(() => {
				const clientRect = draggable()!.getBoundingClientRect()
				setPointerDown(true)
				setPointerOffset(round(clientRect.top - e.clientY, { precision: 1 }))
				setP1(round(e.clientY, { precision: 1 }))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setP2(round(e.clientY, { precision: 1 }))
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

	//// createEffect(() => {
	//// 	if (!pointerOffset() || !p1() || !p2()) {
	//// 		ref()!.style.setProperty("--bottomsheet-drag-translate-y", "0px")
	//// 	} else {
	//// 		const delta = (p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)
	//// 		ref()!.style.setProperty("--bottomsheet-drag-translate-y", `${delta}px`)
	//// 	}
	//// })

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
			ref={setBackdrop}
			class="bottomsheet-backdrop"
			onClick={forceClose}
			// @ts-expect-error
			inert={only(state() === "closed")}
		></div>
		<div
			class={cx(`bottomsheet is-${state()} ${transition() ? "is-transition" : ""}`)}
			style={{
				"--bottomsheet-drag-translate-y":
					(!pointerOffset() || !p1() || !p2())
						? "0px"
						: `${(p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)}px`,
			}}
			onTransitionEnd={e => setTransition()}
		>
			<div ref={setDraggable} class="bottomsheet-draggable" tabIndex={0}>
				<div class="bottomsheet-drag-indicator"></div>
			</div>
			<hr class="h-1px [background-color]-hsl(0_0%_75%)" />
			{/* @ts-expect-error */}
			<div class="bottomsheet-content" inert={only(state() === "closed")}>
				{props.children}
			</div>
		</div>
	</>
}
