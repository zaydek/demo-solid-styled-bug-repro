import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { batch, createEffect, createSignal, For, on, onCleanup, onMount } from "solid-js"
import { render } from "solid-js/web"
import { AriaRadiogroup } from "./aria"
import { Bottomsheet, bottomsheetState, Radio, Slider } from "./components"
import { createRef, css, cx } from "./solid-utils"
import { range, styleGlobalCursor, toKebabCase, unstyleGlobalCursor } from "./utils"
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

function App5() {
	return <>
		{/* @ts-expect-error */}
		<div inert={(bottomsheetState() === "OPENING" || bottomsheetState() === "OPEN") || undefined}>
			{css`
				:root {
					--search-bar-height: 64px;
				}

				////////////////////////////////

				.search-bar {
					position: fixed;
					z-index: 10;
					inset: 0;
					bottom: auto;
					padding: 0 24px;
					height: var(--search-bar-height);
					background-color: white;
					box-shadow: 0 4px 0 0 hsl(0 0% 0% / 25%);

					// Flexbox
					display: flex;
					flex-direction: row;
					align-items: center; // Center y-axis
				}

				////////////////////////////////

				.search-bar-icon {
					height: 32px;
					aspect-ratio: 1;
					border-radius: var(--full);
					background-color: gray;
				}

				////////////////////////////////

				.search-bar-text-container {
					padding: 0 16px;

					// Flexbox
					flex-grow: 1;
				}

				////////////////////////////////

				.search-bar-text {
					height: 6px;
					aspect-ratio: 16;
					border-radius: var(--full);
					background-color: gray;
				}
			`}
			<div class="search-bar">
				<div class="search-bar-icon"></div>
				<div class="search-bar-text-container">
					<div class="search-bar-text"></div>
				</div>
				<div class="search-bar-icon"></div>
			</div>
			{css`
				:root {
					--results-grid-icon-height: 64px;
				}
				@media (min-width:  512px) { :root { --results-grid-icon-height: 64px; } }
				@media (min-width:  768px) { :root { --results-grid-icon-height: 68px; } }
				@media (min-width: 1024px) { :root { --results-grid-icon-height: 72px; } }
				//// @media (min-width: 1280px) { :root { --results-grid-icon-height: 76px; } }
				//// @media (min-width: 1536px) { :root { --results-grid-icon-height: 80px; } }

				////////////////////////////////

				.results-grid {
					margin-top: var(--search-bar-height);
					margin-bottom: var(--bottomsheet-tab-height);
					padding: 16px 4px;
					height: calc(var(--screen) - var(--search-bar-height) - var(--bottomsheet-tab-height));
					overflow-y: auto;

					// CSS Grid
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(var(--results-grid-icon-height), 1fr));
					grid-auto-rows: var(--results-grid-icon-height);
					justify-items: center;
				}

				////////////////////////////////

				.results-grid-cell {
					height: var(--results-grid-icon-height);
					aspect-ratio: 1;

					// CSS Grid
					display: grid;
					place-items: center;
				}

				////////////////////////////////

				.results-grid-icon {
					height: 32px;
					aspect-ratio: 1;
					border-radius: var(--full);
					background-color: gray;
				}
				@media (min-width:  512px) { .results-grid-icon { height: calc(64px / 2); } }
				@media (min-width:  768px) { .results-grid-icon { height: calc(68px / 2); } }
				@media (min-width: 1024px) { .results-grid-icon { height: calc(72px / 2); } }
				//// @media (min-width: 1280px) { .results-grid-icon { height: calc(76px / 2); } }
				//// @media (min-width: 1536px) { .results-grid-icon { height: calc(80px / 2); } }

				////////////////////////////////

				.results-grid-text {
					height: 6px;
					aspect-ratio: 8;
					border-radius: var(--full);
					background-color: gray;
				}
			`}
			<div class="results-grid">
				<For each={range(200)}>{() => <>
					<div class="results-grid-cell">
						<div class="results-grid-icon"></div>
						<div class="results-grid-text"></div>
					</div>
				</>}</For>
			</div>
		</div>
		<Bottomsheet>
			<div class="p-16px flex-col gap-16px">
				{() => {
					const [value1, setValue1] = createSignal(35)
					const [value2, setValue2] = createSignal(35)
					const [value3, setValue3] = createSignal(35)
					const [value4, setValue4] = createSignal(35)
					const [value5, setValue5] = createSignal(35)
					const [value6, setValue6] = createSignal(35)
					const [value7, setValue7] = createSignal(35)
					const [value8, setValue8] = createSignal(35)

					const [rdgValue1, setRdgValue1] = createSignal<"foo" | "bar" | "baz">("foo")
					const [rdgValue2, setRdgValue2] = createSignal<"foo" | "bar" | "baz">("foo")
					const [rdgValue3, setRdgValue3] = createSignal<"foo" | "bar" | "baz">("foo")
					const [rdgValue4, setRdgValue4] = createSignal<"foo" | "bar" | "baz">("foo")

					return <>
						<Slider value={value1()} setValue={setValue1} min={0} max={100} step={1} />
						<Slider value={value2()} setValue={setValue2} min={0} max={100} step={1} />
						<Slider value={value3()} setValue={setValue3} min={0} max={100} step={1} />
						<Slider value={value4()} setValue={setValue4} min={0} max={100} step={1} />
						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue1()} setValue={setRdgValue1}>
							<Radio value="foo">HELLO</Radio>
							<Radio value="bar">HELLO</Radio>
							<Radio value="baz">HELLO</Radio>
						</AriaRadiogroup>
						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue2()} setValue={setRdgValue2}>
							<Radio value="foo">HELLO</Radio>
							<Radio value="bar">HELLO</Radio>
							<Radio value="baz">HELLO</Radio>
						</AriaRadiogroup>
						<Slider value={value5()} setValue={setValue5} min={0} max={100} step={1} />
						<Slider value={value6()} setValue={setValue6} min={0} max={100} step={1} />
						<Slider value={value7()} setValue={setValue7} min={0} max={100} step={1} />
						<Slider value={value8()} setValue={setValue8} min={0} max={100} step={1} />
						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue3()} setValue={setRdgValue3}>
							<Radio value="foo">HELLO</Radio>
							<Radio value="bar">HELLO</Radio>
							<Radio value="baz">HELLO</Radio>
						</AriaRadiogroup>
						<AriaRadiogroup class="flex-col gap-8px" value={rdgValue4()} setValue={setRdgValue4}>
							<Radio value="foo">HELLO</Radio>
							<Radio value="bar">HELLO</Radio>
							<Radio value="baz">HELLO</Radio>
						</AriaRadiogroup>
					</>
				}}
			</div>
		</Bottomsheet>
	</>
}

function App6() {
	return <>
		{css`
			.navbar {
				position: fixed;
				z-index: 20;
				inset: 0 0 auto 0; // E.g. inset-top
				height: 64px;
				background-color: white;
				box-shadow: 0 0 0 var(--box-shadow-thickness) hsl(0 0% 0% / 25%);
			}
			.main-content {
				// TODO
				//// --margin-right: calc(var(--sidesheet-width) + -1 * max(0px, var(--__sidesheet-delta-x)));
				margin: var(--navbar-height) var(--sidesheet-width) 0 0;
				height: calc(var(--screen) - var(--navbar-height));
			}
		`}
		<nav class="navbar">
			{/* ... */}
		</nav>
		<main class="main-content">
			<For each={range(1000)}>{index => <>
				{index === 0 ? "" : " "}
				x
			</>}</For>
		</main>
		<Sidesheet />
	</>
}

const TRIGGER_DELTA = 0

function Sidesheet() {
	//// const [ref, setRef] = createRef()
	const [handleRef, setHandleRef] = createRef()

	const [state, setState] = createSignal<undefined | "COLLAPSED" | "EXPANDED">()
	const [transitioning, setTransitioning] = createSignal(false)

	const [start, setStart] = createSignal<{ x: number, y: number }>()
	const [delta, setDelta] = createSignal<{ x: number, y: number }>()

	let pointerDown = false
	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!handleRef()!.contains(e.target as HTMLElement)) { return }
			// COMPAT/Safari: Click-dragging toggles "cursor: text;"
			e.preventDefault()
			styleGlobalCursor("grab", () => pointerDown = true)
			batch(() => {
				setTransitioning(false)
				setStart({ x: e.clientX, y: e.clientY })
				setDelta({ x: 0, y: 0 })
			})
		}
		document.addEventListener("pointerdown", handlePointerDown)
		onCleanup(() => document.removeEventListener("pointerdown", handlePointerDown))

		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown) { return }
			// COMPAT/Safari: Click-dragging toggles "cursor: text;"
			e.preventDefault()
			setDelta({ x: e.clientX - start()!.x, y: start()!.y - e.clientY })
		}
		document.addEventListener("pointermove", handlePointerMove)
		onCleanup(() => document.removeEventListener("pointermove", handlePointerMove))

		// Release condition
		function handlePointerUp(e: PointerEvent) {
			if (!delta()) { return }
			batch(() => {
				const { x } = delta()!
				if (!state()) {
					if (x < -TRIGGER_DELTA) {
						setState("EXPANDED")
					} else if (x > TRIGGER_DELTA) {
						setState("COLLAPSED")
					}
				} else if (state() === "EXPANDED") {
					if (x > 448) {
						setState("COLLAPSED")
					} else if (x > TRIGGER_DELTA) {
						setState()
					}
				} else if (state() === "COLLAPSED") {
					if (x < -448) {
						setState("EXPANDED")
					} else if (x < -TRIGGER_DELTA) {
						setState()
					}
				}
				setTransitioning(true)
				setStart()
				setDelta()
			})
			unstyleGlobalCursor(() => pointerDown = false)
		}
		document.addEventListener("pointerup", handlePointerUp)
		onCleanup(() => document.removeEventListener("pointerup", handlePointerUp))

		// Release condition
		document.addEventListener("pointerleave", handlePointerUp)
		onCleanup(() => document.removeEventListener("pointerleave", handlePointerUp))
	})

	createEffect(on(delta, () => {
		if (delta()) {
			document.body.style.setProperty("--__sidesheet-delta-x", `${delta()!.x}px`)
			document.body.style.setProperty("--__sidesheet-delta-y", `${delta()!.y}px`)
		} else {
			document.body.style.setProperty("--__sidesheet-delta-x", "0px")
			document.body.style.setProperty("--__sidesheet-delta-y", "0px")
		}
	}, { defer: true }))

	return <>
		{css`
			:root {
				--__sidesheet-delta-x:     0px;
				--__sidesheet-delta-y:     0px;
				--__sidesheet-width:       0px;
				--__sidesheet_translate-x: 0px;
			}
			.sidesheet {
				position: fixed;
				z-index: 10;
				inset: var(--navbar-height) 0 0 auto;
				width: calc(var(--sidesheet-width) + var(--__sidesheet-width) + -1 * min(var(--__sidesheet-delta-x), 0px));
				transform: translateX(calc(var(--__sidesheet_translate-x) + max(var(--__sidesheet-delta-x), 0px)));
			}
			.sidesheet.is-expanded  { --__sidesheet-width: 320px; }
			.sidesheet.is-collapsed { --__sidesheet_translate-x: calc(var(--sidesheet-width) - var(--sidesheet-drag-indicator-container-width)); }
			.sidesheet.is-transitioning {
				transition: width 600ms cubic-bezier(0, 1, 0.25, 1),
					transform 600ms cubic-bezier(0, 1, 0.25, 1);
			}
		`}
		<aside class={cx(`
			sidesheet
			${state() ? `is-${toKebabCase(state()!)}` : ""}
			${transitioning() ? "is-transitioning" : ""}
			flex-row
		`)} onTransitionEnd={e => setTransitioning(false)}>
			{/* TODO: [&:hover]:[background-color]-whitesmoke breaks */}
			{/* [cursor]-grab */}
			{/* [&:hover]:[background-color]-whitesmoke */}
			<div ref={setHandleRef} class="w-$sidesheet-drag-indicator-container-width grid grid-center">
				<div class="drag-indicator variant-vertical -mt-$navbar-height"></div>
			</div>
			<div class="flex-grow flex-col [background-color]-white [box-shadow]-0_0_0_$box-shadow-thickness_hsl(0_0%_0%_/_25%)">
				<section class="flex-shrink-0">
					<For each={range(2)}>{() => <>
						<div class="p-16px">Hello, world!</div>
						<hr class="h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)" />
					</>}</For>
				</section>
				<section class="flex-grow overflow-y">
					<For each={range(8)}>{() => <>
						<div class="p-16px">Hello, world!</div>
						<hr class="h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)" />
					</>}</For>
				</section>
				<section class="flex-shrink-0">
					<For each={range(2)}>{index => <>
						<hr class={index === 0
							? "-mt-$thickness h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)" // Collapsible
							: "h-$hairline-thickness [background-color]-hsl(0_0%_0%_/_25%)"
						} />
						<div class="p-16px">Hello, world!</div>
					</>}</For>
				</section>
			</div>
		</aside>
	</>
}

function App7() {
	const [sidesheetRef, setSidesheetRef] = createRef()
	const [draggableRef, setDraggableRef] = createRef()

	const [state, setState] = createSignal<"closed" | "open" | "expanded">("open")
	const [pointerDown, setPointerDown] = createSignal<undefined | true>()

	const [start, setStart] = createSignal<number>()
	const [delta, setDelta] = createSignal<number>()
	const [trans, setTrans] = createSignal<undefined | true>()

	//// onMount(() => {
	//// 	document.addEventListener("keydown", e => {
	//// 		if (e.key === "d") {
	//// 			if (state() === "closed") {
	//// 				batch(() => {
	//// 					setState("open")
	//// 					setTransition(true)
	//// 				})
	//// 			} else if (state() === "open") {
	//// 				batch(() => {
	//// 					setState("expanded")
	//// 					setTransition(true)
	//// 				})
	//// 			} else if (state() === "expanded") {
	//// 				batch(() => {
	//// 					setState("closed")
	//// 					setTransition(true)
	//// 				})
	//// 			}
	//// 		}
	//// 	})
	//// })

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!draggableRef()!.contains(e.target as HTMLElement)) { return }
			batch(() => {
				setPointerDown(true)
				setStart(Math.round(e.clientX))
				setTrans()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setDelta(Math.round(e.clientX - start()!))
		}
		function handlePointerUp(e: PointerEvent) {
			batch(() => {
				if (state() === "open") {
					if (delta()! < 0) {
						setState("expanded")
					} else if (delta()! > 0) {
						setState("closed")
					}
				} else if (state() === "expanded") {
					if (delta()! < 0) {
						// No-op
					} else if (delta()! > 0) {
						setState("open")
					}
				} else if (state() === "closed") {
					if (delta()! < 0) {
						setState("open")
					} else if (delta()! > 0) {
						// No-op
					}
				}
				setPointerDown()
				setStart()
				setDelta()
				setTrans(true)
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
		if (delta() === undefined) {
			sidesheetRef()!.style.setProperty("--sidesheet-drag-offset", "0px")
		} else {
			sidesheetRef()!.style.setProperty("--sidesheet-drag-offset", `${delta()}px`)
		}
	})

	return <>
		{css`
			:root {
				--sidesheet-drag-width: 25px;

				// Runtime values
				--sidesheet-drag-offset: 0px;
				--sidesheet-offset: 0px;
			}
			.sidesheet {
				position: fixed;
				inset: 0 0 0 auto;
				width: 768px;
				transform: translateX(calc(var(--sidesheet-offset) + var(--sidesheet-drag-offset)));
			}
			.sidesheet.is-closed        { --sidesheet-offset: calc(768px - var(--sidesheet-drag-width)); }
			.sidesheet.is-open          { --sidesheet-offset: 320px; }
			.sidesheet.is-open-expanded { --sidesheet-offset: 0px; }
			.sidesheet.is-trans {
				transition: transform 600ms cubic-bezier(0, 1, 0.25, 1);
			}
			.sidesheet-card {
				height: 100%;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
			//// .sidesheet-content {
			//// 	width: calc(448px - var(--sidesheet-drag-width));
			//// }
			//// .sidesheet.is-expanded .sidesheet-content {
			//// 	width: calc(768px - var(--sidesheet-drag-width));
			//// }
			.sidesheet:not(.is-expanded) .sidesheet-content {
				width: calc(448px - var(--sidesheet-drag-width));
			}
			.sidesheet:is(.is-expanded, .is-closed) .sidesheet-content {
				width: calc(768px - var(--sidesheet-drag-width));
			}

			//////////////////////////////////

			.draggable {
				width: var(--sidesheet-drag-width);

				// CSS Grid
				display: grid;
				place-items: center;

				cursor: grab;
			}
			.draggable:is(:hover, .is-pointer-down) {
				background-color: hsl(0 0% 0% / 5%);
			}
			:root:has(.draggable.is-pointer-down) {
				cursor: grab;
			}
			.drag-indicator {
				height: 50px;
				aspect-ratio: 1 / 10;
				border-radius: var(--full);
				background-color: hsl(0 0% 50%);
			}
			.draggable.is-pointer-down .drag-indicator {
				background-color: hsl(0 0% 25%);
			}
		`}
		<div
			ref={setSidesheetRef}
			class={cx(`sidesheet is-${state()} ${trans() ? "is-trans" : ""} flex-row`)}
			onTransitionEnd={e => setTrans()}
		>
			<div ref={setDraggableRef} class={cx(`draggable ${pointerDown() ? "is-pointer-down" : ""}`)}>
				<div class="drag-indicator"></div>
			</div>
			<div class="flex-grow flex-col">
				<div class="sidesheet-card">
					<div class="sidesheet-content">
						<For each={range(200)}>{() => <>
							hello world
						</>}</For>
					</div>
				</div>
			</div>
		</div>
	</>
}

render(() => <>
	{css`
		////////////////////////////////////

		:root {
			--navbar-height: 64px;

			// Describes the container containing .drag-indicator
			--sidesheet-drag-indicator-container-width: 30px;
			--sidesheet-width: calc(448px + var(--sidesheet-drag-indicator-container-width));

			--box-shadow-thickness:     4px;
			--hairline-thickness:       0.5px;
			//// --drag-indicator-thickness: 6px;
			//// --drag-indicator-length:    60px;
		}
	`}
	<App7 />
</>, document.getElementById("root")!)
