import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { batch, createEffect, createSignal, DEV, For, onCleanup, onMount, ParentProps, Show } from "solid-js"
import { render } from "solid-js/web"
//// import { Bottomsheet, bottomsheetState, Radio, Slider } from "./components"
import { createRef, css, cx } from "./solid-utils"
import { guard, range } from "./utils"
//// import { App } from "./App"

function NavIcon() {
	return <>
		<div class="h-48px aspect-1 rounded-$full grid grid-center" tabindex="0">
			<div class="h-28px aspect-1 rounded-$full background-color:red"></div>
		</div>
	</>
}

function GridIcon() {
	return <>
		<div class="grid grid-center" tabindex="0">
			<div class="h-48px aspect-1 rounded-$full grid grid-center">
				<div class="h-28px aspect-1 rounded-$full background-color:red"></div>
			</div>
		</div>
	</>
}

function Panel() {
	return <>
		<section class="p-$padding" tabindex="0">
			<div>Hello, world!</div>
		</section>
	</>
}

function App2() {
	return <>
		{css`
			html, body { overscroll-behavior-y: none; }
			html, body { position: fixed; inset: 0; overflow: hidden; } // COMPAT/Safari

			:focus { outline: revert; }

			//////////////////////////////////

			:is(.atom-columns, .has-columns) {
				display: grid;
				grid-template-columns: 1fr 384px;
			}
			:is(.atom-columns, .has-columns):not(.is-reversed) > :nth-child(2) {
				box-shadow: -1px 0 0 0 blue;
			}
			:is(.atom-columns, .has-columns).is-reversed > :nth-child(1) {
				box-shadow: -1px 0 0 0 blue;
			}
			:is(.atom-columns, .has-columns).is-reversed > :nth-child(1) { order: 1; }
			:is(.atom-columns, .has-columns).is-reversed > :nth-child(2) { order: 0; }

			//////////////////////////////////

			.atom-navbar {
				position: sticky;
				z-index: 10;
				top: 0;
				height: var(--search-bar-height);
				background-color: var(--card-color);
				box-shadow: 0 1px 0 0 red;
			}

			//////////////////////////////////

			.atom-grid {
				padding: var(--padding);
				padding-bottom: calc(var(--padding) * 2);

				// CSS Grid
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--main-grid-height), 1fr));
				grid-auto-rows: var(--main-grid-height);

				// Height, overflow, etc.
				height: calc(100vh  - var(--search-bar-height));
				height: calc(100dvh - var(--search-bar-height)); // COMPAT/Safari
				overflow-y: auto;
				overscroll-behavior-y: none; // COMPAT/Safari: Unsupported
			}

			// TODO
			@media (max-width: 768px) {
				:root {
					--padding: 8px;
					--main-grid-height: 64px;
				}
			}

			///////////////////////////////////

			// Defer padding to <section>s
			.atom-sidebar {
				height: calc(100vh  - var(--search-bar-height));
				height: calc(100dvh - var(--search-bar-height)); // COMPAT/Safari
				overflow-y: auto;
				overscroll-behavior-y: none; // COMPAT/Safari: Unsupported
			}

			//////////////////////////////////
		`}
		<nav class="atom-navbar has-columns">
			<div class="px-$padding flex-row flex-align-center">
				<NavIcon />
				<div class="flex-grow"></div>
				<NavIcon />
			</div>
			<div class="px-$padding flex-row flex-align-center">
				<NavIcon />
				<div class="flex-grow"></div>
				<NavIcon />
				<NavIcon />
			</div>
		</nav>
		{/* <main> */}
		<main class="atom-columns is-reversed">
			<div class="atom-sidebar flex-col">
				<div class="flex-shrink:0">
					<Panel />
					<hr />
					<Panel />
					<hr />
				</div>
				<div class="flex-grow overflow-y:auto">
					<Panel />
					<hr />
					<Panel />
					<hr />
				</div>
				<div class="flex-shrink:0">
					<hr />
					<Panel />
					<hr />
					<Panel />
				</div>
			</div>
			<div class="atom-grid">
				<For each={range(200)}>{() => <>
					<GridIcon />
				</>}</For>
			</div>
		</main>
	</>
}

//// function App5() {
//// 	return <>
//// 		{/* @ts-expect-error */}
//// 		<div inert={(bottomsheetState() === "OPENING" || bottomsheetState() === "OPEN") || undefined}>
//// 			{css`
//// 				:root {
//// 					--search-bar-height: 64px;
//// 				}
////
//// 				////////////////////////////////
////
//// 				.search-bar {
//// 					position: fixed;
//// 					z-index: 10;
//// 					inset: 0;
//// 					bottom: auto;
//// 					padding: 0 24px;
//// 					height: var(--search-bar-height);
//// 					background-color: white;
//// 					box-shadow: 0 4px 0 0 hsl(0 0% 0% / 25%);
////
//// 					// Flexbox
//// 					display: flex;
//// 					flex-direction: row;
//// 					align-items: center; // Center y-axis
//// 				}
////
//// 				////////////////////////////////
////
//// 				.search-bar-icon {
//// 					height: 32px;
//// 					aspect-ratio: 1;
//// 					border-radius: var(--full);
//// 					background-color: gray;
//// 				}
////
//// 				////////////////////////////////
////
//// 				.search-bar-text-container {
//// 					padding: 0 16px;
////
//// 					// Flexbox
//// 					flex-grow: 1;
//// 				}
////
//// 				////////////////////////////////
////
//// 				.search-bar-text {
//// 					height: 6px;
//// 					aspect-ratio: 16;
//// 					border-radius: var(--full);
//// 					background-color: gray;
//// 				}
//// 			`}
//// 			<div class="search-bar">
//// 				<div class="search-bar-icon"></div>
//// 				<div class="search-bar-text-container">
//// 					<div class="search-bar-text"></div>
//// 				</div>
//// 				<div class="search-bar-icon"></div>
//// 			</div>
//// 			{css`
//// 				:root {
//// 					--results-grid-icon-height: 64px;
//// 				}
//// 				@media (min-width:  512px) { :root { --results-grid-icon-height: 64px; } }
//// 				@media (min-width:  768px) { :root { --results-grid-icon-height: 68px; } }
//// 				@media (min-width: 1024px) { :root { --results-grid-icon-height: 72px; } }
//// 				//// @media (min-width: 1280px) { :root { --results-grid-icon-height: 76px; } }
//// 				//// @media (min-width: 1536px) { :root { --results-grid-icon-height: 80px; } }
////
//// 				////////////////////////////////
////
//// 				.results-grid {
//// 					margin-top: var(--search-bar-height);
//// 					margin-bottom: var(--bottomsheet-tab-height);
//// 					padding: 16px 4px;
//// 					height: calc(var(--screen) - var(--search-bar-height) - var(--bottomsheet-tab-height));
//// 					overflow-y: auto;
////
//// 					// CSS Grid
//// 					display: grid;
//// 					grid-template-columns: repeat(auto-fill, minmax(var(--results-grid-icon-height), 1fr));
//// 					grid-auto-rows: var(--results-grid-icon-height);
//// 					justify-items: center;
//// 				}
////
//// 				////////////////////////////////
////
//// 				.results-grid-cell {
//// 					height: var(--results-grid-icon-height);
//// 					aspect-ratio: 1;
////
//// 					// CSS Grid
//// 					display: grid;
//// 					place-items: center;
//// 				}
////
//// 				////////////////////////////////
////
//// 				.results-grid-icon {
//// 					height: 32px;
//// 					aspect-ratio: 1;
//// 					border-radius: var(--full);
//// 					background-color: gray;
//// 				}
//// 				@media (min-width:  512px) { .results-grid-icon { height: calc(64px / 2); } }
//// 				@media (min-width:  768px) { .results-grid-icon { height: calc(68px / 2); } }
//// 				@media (min-width: 1024px) { .results-grid-icon { height: calc(72px / 2); } }
//// 				//// @media (min-width: 1280px) { .results-grid-icon { height: calc(76px / 2); } }
//// 				//// @media (min-width: 1536px) { .results-grid-icon { height: calc(80px / 2); } }
////
//// 				////////////////////////////////
////
//// 				.results-grid-text {
//// 					height: 6px;
//// 					aspect-ratio: 8;
//// 					border-radius: var(--full);
//// 					background-color: gray;
//// 				}
//// 			`}
//// 			<div class="results-grid">
//// 				<For each={range(200)}>{() => <>
//// 					<div class="results-grid-cell">
//// 						<div class="results-grid-icon"></div>
//// 						<div class="results-grid-text"></div>
//// 					</div>
//// 				</>}</For>
//// 			</div>
//// 		</div>
//// 		<Bottomsheet>
//// 			<div class="p-16px flex-col gap-16px">
//// 				{() => {
//// 					const [value1, setValue1] = createSignal(35)
//// 					const [value2, setValue2] = createSignal(35)
//// 					const [value3, setValue3] = createSignal(35)
//// 					const [value4, setValue4] = createSignal(35)
//// 					const [value5, setValue5] = createSignal(35)
//// 					const [value6, setValue6] = createSignal(35)
//// 					const [value7, setValue7] = createSignal(35)
//// 					const [value8, setValue8] = createSignal(35)
////
//// 					const [rdgValue1, setRdgValue1] = createSignal<"foo" | "bar" | "baz">("foo")
//// 					const [rdgValue2, setRdgValue2] = createSignal<"foo" | "bar" | "baz">("foo")
//// 					const [rdgValue3, setRdgValue3] = createSignal<"foo" | "bar" | "baz">("foo")
//// 					const [rdgValue4, setRdgValue4] = createSignal<"foo" | "bar" | "baz">("foo")
////
//// 					return <>
//// 						<Slider value={value1()} setValue={setValue1} min={0} max={100} step={1} />
//// 						<Slider value={value2()} setValue={setValue2} min={0} max={100} step={1} />
//// 						<Slider value={value3()} setValue={setValue3} min={0} max={100} step={1} />
//// 						<Slider value={value4()} setValue={setValue4} min={0} max={100} step={1} />
//// 						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue1()} setValue={setRdgValue1}>
//// 							<Radio value="foo">HELLO</Radio>
//// 							<Radio value="bar">HELLO</Radio>
//// 							<Radio value="baz">HELLO</Radio>
//// 						</AriaRadiogroup>
//// 						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue2()} setValue={setRdgValue2}>
//// 							<Radio value="foo">HELLO</Radio>
//// 							<Radio value="bar">HELLO</Radio>
//// 							<Radio value="baz">HELLO</Radio>
//// 						</AriaRadiogroup>
//// 						<Slider value={value5()} setValue={setValue5} min={0} max={100} step={1} />
//// 						<Slider value={value6()} setValue={setValue6} min={0} max={100} step={1} />
//// 						<Slider value={value7()} setValue={setValue7} min={0} max={100} step={1} />
//// 						<Slider value={value8()} setValue={setValue8} min={0} max={100} step={1} />
//// 						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue3()} setValue={setRdgValue3}>
//// 							<Radio value="foo">HELLO</Radio>
//// 							<Radio value="bar">HELLO</Radio>
//// 							<Radio value="baz">HELLO</Radio>
//// 						</AriaRadiogroup>
//// 						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue4()} setValue={setRdgValue4}>
//// 							<Radio value="foo">HELLO</Radio>
//// 							<Radio value="bar">HELLO</Radio>
//// 							<Radio value="baz">HELLO</Radio>
//// 						</AriaRadiogroup>
//// 					</>
//// 				}}
//// 			</div>
//// 		</Bottomsheet>
//// 	</>
//// }

//// <div class="flex-grow flex-col [background-color]-white [box-shadow]-0_0_0_$box-shadow-thickness_hsl(0_0%_0%_/_25%)">
//// 	<section class="flex-shrink-0">
//// 		<For each={range(2)}>{() => <>
//// 			<div class="p-16px">Hello, world!</div>
//// 			<hr class="h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)" />
//// 		</>}</For>
//// 	</section>
//// 	<section class="flex-grow overflow-y">
//// 		<For each={range(8)}>{() => <>
//// 			<div class="p-16px">Hello, world!</div>
//// 			<hr class="h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)" />
//// 		</>}</For>
//// 	</section>
//// 	<section class="flex-shrink-0">
//// 		<For each={range(2)}>{index => <>
//// 			<hr class={index === 0
//// 				? "-mt-$thickness h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)" // Collapsible
//// 				: "h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)"
//// 			} />
//// 			<div class="p-16px">Hello, world!</div>
//// 		</>}</For>
//// 	</section>
//// </div>

type SidesheetState = "closed" | "open" | "expanded"

function Sidesheet(props: ParentProps<{ initialState?: SidesheetState }>) {
	const [backdropRef, setBackdropRef] = createRef()
	const [ref, setRef] = createRef()
	const [draggableRef, setDraggableRef] = createRef()

	const [state, setState] = createSignal(props.initialState ?? "open")
	const [pointerDown, setPointerDown] = createSignal<undefined | true>()

	const [offset, setOffset] = createSignal<number>()
	const [point1, setPoint1] = createSignal<number>()
	const [point2, setPoint2] = createSignal<number>()

	const [transition, setTransition] = createSignal<undefined | true>()

	function forceClose() {
		batch(() => {
			setState("closed")
			setPointerDown()
			setOffset()
			setPoint1()
			setPoint2()
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
				setOffset(Math.round(clientRect.right - e.clientX))
				setPoint1(Math.round(e.clientX))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setPoint2(Math.round(e.clientX))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (point2()! + offset()!) - (point1()! + offset()!)
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
				setOffset()
				setPoint1()
				setPoint2()
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
		if (guard(offset, point1, point2)) {
			ref()!.style.setProperty("--sidesheet-drag-translate-x", "0px")
		} else {
			const delta = (point2()! + offset()!) - (point1()! + offset()!)
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
			.sidesheet-backdrop:has(+ .sidesheet.is-transition) {
				transition: background-color 600ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			.sidesheet {
				--sidesheet-drag-width: 32px;

				// Runtime values
				--sidesheet-translate-x: 0px;
				--sidesheet-drag-translate-x: 0px;

				position: fixed;
				z-index: 100;
				inset: 0 0 0 auto;
				width: calc(768px + var(--sidesheet-drag-width));
				transform: translateX(calc(var(--sidesheet-translate-x) + var(--sidesheet-drag-translate-x)));
			}
			.sidesheet.is-closed   { --sidesheet-translate-x: 768px; }
			.sidesheet.is-open     { --sidesheet-translate-x: 384px; }
			.sidesheet.is-expanded { --sidesheet-translate-x: 0px; }
			.sidesheet.is-transition {
				transition: transform 600ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			.sidesheet-card {
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}

			//////////////////////////////////

			.sidesheet-content {
				overflow-y: auto;
			}
			.sidesheet:is(.is-closed, .is-open) .sidesheet-content { width: 384px; }
			.sidesheet.is-expanded .sidesheet-content { width: 768px; }

			//////////////////////////////////

			.sidesheet-draggable {
				width: var(--sidesheet-drag-width);

				// CSS Grid
				display: grid;
				place-items: center;

				cursor: grab;
			}
			//// .sidesheet-draggable:is(:hover, .is-pointer-down) {
			//// 	background-color: hsl(0 0% 0% / 5%);
			//// }
			:root:has(.sidesheet-draggable.is-pointer-down) {
				cursor: grab;
			}

			//////////////////////////////////

			.sidesheet-drag-indicator {
				width: 4px;
				aspect-ratio: 1 / 12;
				border-radius: var(--full);
				background-color: hsl(0 0% 50%);
			}
			.sidesheet-draggable.is-pointer-down .sidesheet-drag-indicator {
				background-color: hsl(0 0% 25%);
			}
		`}
		<div
			ref={setBackdropRef}
			class="sidesheet-backdrop"
			onClick={forceClose}
			// @ts-expect-error
			inert={!(state() === "expanded") || undefined}
		></div>
		<div
			ref={setRef}
			class={cx(`sidesheet is-${state()} ${transition() ? "is-transition" : ""} flex-row`)}
			onTransitionEnd={e => setTransition()}
		>
			<div ref={setDraggableRef} class={cx(`sidesheet-draggable ${pointerDown() ? "is-pointer-down" : ""}`)}>
				<div class="sidesheet-drag-indicator"></div>
			</div>
			{/* TODO: Wrap inert here */}
			<div class="sidesheet-card flex-grow flex-col">
				<div class="sidesheet-content">
					{props.children}
				</div>
			</div>
		</div>
	</>
}

type BottomsheetState = "closed" | "open"

function Bottomsheet2(props: ParentProps<{ initialState: BottomsheetState }>) {
	const [backdropRef, setBackdropRef] = createRef()
	const [ref, setRef] = createRef()
	const [draggableRef, setDraggableRef] = createRef()

	const [state, setState] = createSignal(props.initialState ?? "open")
	const [pointerDown, setPointerDown] = createSignal<undefined | true>()

	const [offset, setOffset] = createSignal<number>()
	const [point1, setPoint1] = createSignal<number>()
	const [point2, setPoint2] = createSignal<number>()

	const [transition, setTransition] = createSignal<undefined | true>()

	function forceClose() {
		batch(() => {
			setState("closed")
			setPointerDown()
			setOffset()
			setPoint1()
			setPoint2()
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
				setOffset(Math.round(clientRect.top - e.clientY))
				setPoint1(Math.round(e.clientY))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setPoint2(Math.round(e.clientY))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (point2()! + offset()!) - (point1()! + offset()!)
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
				setOffset()
				setPoint1()
				setPoint2()
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
		if (guard(offset, point1, point2)) {
			ref()!.style.setProperty("--bottomsheet-drag-translate-y", "0px")
		} else {
			const delta = (point2()! + offset()!) - (point1()! + offset()!)
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

			.bottomsheet {
				--bottomsheet-draggable-height: 40px;

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
			:root:has(.bottomsheet-draggable.is-pointer-down) {
				cursor: grab;
			}

			//////////////////////////////////

			.bottomsheet-drag-indicator {
				height: 4px;
				aspect-ratio: 12;
				border-radius: var(--full);
				background-color: hsl(0 0% 50%);
			}
			.bottomsheet-draggable.is-pointer-down .bottomsheet-drag-indicator {
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
			// @ts-expect-error
			inert={!(state() === "open") || undefined}
		></div>
		<div
			ref={setRef}
			class={cx(`bottomsheet is-${state()} ${transition() ? "is-transition" : ""}`)}
			onTransitionEnd={e => setTransition()}
		>
			<div ref={setDraggableRef} class={`bottomsheet-draggable ${pointerDown() ? "is-pointer-down" : ""}`}>
				<div class="bottomsheet-drag-indicator"></div>
			</div>
			<hr />
			{/* @ts-expect-error */}
			<div class="bottomsheet-content" inert={state() === "closed" || undefined}>
				{props.children}
			</div>
		</div>
	</>
}

function Entrypoint() {
	const [breakpoint, setBreakpoint] = createSignal(window.matchMedia("(min-width: 501px)").matches)

	onMount(() => {
		function handleBreakpoint(e: MediaQueryListEvent) {
			setBreakpoint(e.matches)
		}
		window.matchMedia("(min-width: 501px)").addEventListener("change", handleBreakpoint)
		onCleanup(() => window.matchMedia("(min-width: 501px)").addEventListener("change", handleBreakpoint))
	})

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
				document.documentElement.removeAttribute("sty;e")
			}
			window.removeEventListener("resize", handleResize, false)
		})
	})

	return <>
		{css`
			:root {
				--navbar-height: 64px;

				--box-shadow-thickness: 4px;
				--hairline-thickness: 0.5px;
			}

			//////////////////////////////////

			// iOS
			@media (hover: none) {
				.main-content {
					padding-bottom: var(--bottomsheet-draggable-height);
					height: var(--screen-y);
					overflow-y: auto;
				}
			}
			// Non-iOS
			@media (hover: hover) {
				:root:has(.sidesheet:is(.is-open, .is-expanded)) .main-content {
					padding-right: calc(384px + var(--sidesheet-drag-width));
				}
			}
		`}
		<div class="main-content">
			<For each={range(2000)}>{() => <>
				hello world
			</>}</For>
		</div>
		<Show when={breakpoint()} fallback={<>
			<Bottomsheet2 initialState="closed">
				<For each={range(400)}>{() => <>
					hello world
				</>}</For>
			</Bottomsheet2>
		</>}>
			<Sidesheet initialState="closed">
				<For each={range(200)}>{() => <>
					hello world
				</>}</For>
			</Sidesheet>
		</Show>
	</>
}

render(() => <>
	<Entrypoint />
</>, document.getElementById("root")!)
