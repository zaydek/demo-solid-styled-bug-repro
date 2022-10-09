import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { batch, createEffect, createSignal, For, JSX, on, onCleanup, onMount, Show, untrack } from "solid-js"
import { render } from "solid-js/web"
import { createRef, css } from "./solid-utils"
import { range } from "./utils"
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

function App3() {
	document.documentElement.classList.add("disable-overscroll", "disable-scrolling")

	const [ref, setRef] = createRef()
	const [tabRef, setTabRef] = createRef()
	const [backdropRef, setBackdropRef] = createRef()

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
			if (tabRef()!.contains(e.target as HTMLElement)) {
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
			ref()!.style.setProperty("--__bottomsheet-delta", `${offset()!.y}px`)
			backdropRef()!.style.setProperty("--__bottomsheet-delta", `${offset()!.y}px`)
		} else {
			ref()!.style.setProperty("--__bottomsheet-delta", "0px")
			backdropRef()!.style.setProperty("--__bottomsheet-delta", "0px")
		}
	}, { defer: true }))

	return <>
		{css`
			// Disables overscrolling
			:root.disable-overscroll { overscroll-behavior: none; }

			// Disables scrolling completely
			//
			// Add "inset: 0;" because of the-new-css-reset
			:root.disable-scrolling { position: fixed; inset: 0; overflow: hidden; }

			//////////////////////////////////

			:root {
				--screen: 100vh;
			}
			@supports (height: 100dvh) {
				:root {
					--screen: 100dvh;
				}
			}

			:root {
				--inset:   0;
				--inset-x: auto 0 auto 0;
				--inset-y: 0 auto 0 auto;
				--inset-t: 0 0 auto 0;
				--inset-r: 0 0 0 auto;
				--inset-b: auto 0 0 0;
				--inset-l: 0 auto 0 0;
			}

			//////////////////////////////////

			.bottomsheet {
				// Internal
				--__bottomsheet-delta: 0px;

				// External
				--bottomsheet-z-index: 100;
				--bottomsheet-border-radius: 24px;
				--bottomsheet-tab-height: 48px;
				--bottomsheet-negative-tab-height: 32px;
				--bottomsheet-transition: 500ms cubic-bezier(0, 1, 0.25, 1);
			}

			.bottomsheet-backdrop {
				// Internal
				--__bottomsheet-backdrop-delta-percentage: 0%;

				// External
				--bottomsheet-backdrop-z-index: calc(var(--bottomsheet-z-index) - 10);
				--bottomsheet-backdrop-transition: 1000ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			.bottomsheet {
				position: fixed;
				z-index: var(--bottomsheet-z-index);
				inset: var(--inset-x);
				top: 0;
				min-height: calc(var(--screen) * 2);
				border-radius: var(--bottomsheet-border-radius) var(--bottomsheet-border-radius) 0 0;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
				transform: var(--__bottomsheet-transform);
			}
			.bottomsheet:is(.is-opening, .is-closing) {
				transition: transform var(--bottomsheet-transition);
			}
			.bottomsheet:is(.is-closing, .is-closed) { --__bottomsheet-transform: translateY(calc(var(--screen) - var(--bottomsheet-tab-height) + var(--__bottomsheet-delta))); }
			.bottomsheet:is(.is-opening, .is-open)   { --__bottomsheet-transform: translateY(calc(var(--bottomsheet-negative-tab-height) + var(--__bottomsheet-delta))); }

			//////////////////////////////////

			.bottomsheet-tab {
				display: grid;
				place-items: center;
				height: var(--bottomsheet-tab-height);
				cursor: grab;
				-webkit-user-select: none; // COMPAT
				user-select: none;
			}
			.bottomsheet-tab-icon {
				height: 5px;
				width: 50px;
				border-radius: var(--full);
				background-color: gray;
			}

			//////////////////////////////////

			.bottomsheet-content {
				height: calc(var(--screen) - (var(--bottomsheet-negative-tab-height) + var(--bottomsheet-tab-height)));
				overflow-y: auto;
			}
			// COMPAT/Safari: Safari doesn’t disable inert unless there is some CSS
			// listening to the presence of the property.
			.bottomsheet-content[inert] { content: ""; } // COMPAT/Safari

			//////////////////////////////////

			.bottomsheet-backdrop {
				position: fixed;
				z-index: var(--bottomsheet-backdrop-z-index);
				inset: var(--inset);
				background-color: hsl(0 0% 0% / var(--__bottomsheet-backdrop-delta-percentage));
			}
			.bottomsheet-backdrop:has(+ .bottomsheet:is(.is-opening, .is-closing)) {
				transition: background-color var(--bottomsheet-backdrop-transition);
			}
			.bottomsheet-backdrop:has(+ .bottomsheet:is(.is-closing, .is-closed)) { --__bottomsheet-backdrop-delta-percentage: 0; }
			.bottomsheet-backdrop:has(+ .bottomsheet:is(.is-opening, .is-open)) { --__bottomsheet-backdrop-delta-percentage: 50%; }
		`}
		<div
			ref={setBackdropRef}
			class="bottomsheet-backdrop"
			onClick={e => {
				if (state() === "OPEN") {
					setState("CLOSING")
				}
			}}
		></div>
		<div
			ref={setRef}
			class={`bottomsheet is-${state().toLowerCase()} `}
			onTransitionEnd={e => {
				if (state() === "OPENING") {
					setState("OPEN")
				} else if (state() === "CLOSING") {
					setState("CLOSED")
				}
			}}
		>
			<div ref={setTabRef} class="bottomsheet-tab">
				<div class="bottomsheet-tab-icon"></div>
			</div>
			<hr />
			{/* @ts-expect-error */}
			<div class="bottomsheet-content" inert={!(state() === "OPEN" || state() === "OPENING") || undefined}>
				<For each={range(200)}>{() => <>
					<div>Hello, world!</div>
				</>}</For>
			</div>
		</div>
	</>
}

render(() => <App3 />, document.getElementById("root")!)
