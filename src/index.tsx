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
	const [closeButtonRef, setCloseButtonRef] = createRef()
	const [expandFooter, setExpandFooter] = createSignal(false)

	//// onMount(() => {
	//// 	const main = document.querySelector("main")!
	//// 	const footer = document.querySelector("footer")!
	////
	//// 	let expandFooter = false
	//// 	footer.addEventListener("click", e => {
	//// 		expandFooter = !expandFooter
	//// 		if (expandFooter) {
	//// 			main.inert = true
	//// 			footer.style.height = "100vh"
	//// 			footer.style.height = "100dvh"
	//// 			footer.style.overflowY = "auto"
	//// 		} else {
	//// 			main.inert = false
	//// 			footer.style.height = ""
	//// 			footer.style.overflowY = ""
	//// 			if (!footer.style.length) {
	//// 				footer.removeAttribute("style")
	//// 			}
	//// 		}
	//// 	})
	//// })

	//// // TODO
	//// if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
	//// 	window.document.addEventListener('touchmove', e => {
	//// 		if (e.scale !== 1) {
	//// 			e.preventDefault();
	//// 		}
	//// 	}, { passive: false });
	//// }

	const [footerRef, setFooterRef] = createRef()
	const [didScrollFooter, setDidScrollFooter] = createSignal(false)

	onMount(() => {
		if (!footerRef()) { return }
		footerRef()!.addEventListener("scroll", e => {
			setDidScrollFooter(footerRef()!.scrollTop > 0)
		}, false)
	})

	// COMPAT/iOS: iOS Safari doesn’t support calc(100dvh - var(--foo))
	onMount(() => {
		document.documentElement.style
			.setProperty('--device-height', window.innerHeight + "px");
	})

	return <>
		{css`
			* { overscroll-behavior-y: none; }

			:root {
				--device-height:;

				--nav-height: 64px;
				--nav-icon-height: 48px;
				--nav-icon-svg-height: 32px;
				--footer-height: 48px;
			}

			.nav {
				position: sticky;
				z-index: 10;
				inset: 0;
				bottom: auto;
				height: var(--nav-height);
				background-color: white;
				box-shadow: 0 0 0 4px lightgray;
			}
			.main {
				background-color: whitesmoke;
			}
			.footer {
				position: fixed;
				z-index: 20;
				inset: 0;
				background-color: white;
				box-shadow: 0 0 0 4px lightgray;
				overflow-y: auto;
				transform: translateY(calc(100dvh - var(--footer-height)));
				transition: 500ms cubic-bezier(0, 1, 0.25, 1);
				transition-property: transform;
			}
			.footer.is-expanded {
 				transform: translateY(0);
			}
		`}
		<nav class="nav" tabindex="0"></nav>
		{/* @ts-expect-error */}
		<main class="main" inert={expandFooter() || undefined}>
			<div>start</div>
			<For each={range(200)}>{() => <>
				<div tabindex="0">Hello, world!</div>
			</>}</For>
			<div>end</div>
		</main>
		<footer ref={setFooterRef} class={`footer ${expandFooter() && "is-expanded"}`}>
			{css`
				.close-footer-container {
					position: sticky;
					z-index: 10;
					top: 0;
					height: var(--footer-height);
					background-color: white;
				}
				.close-footer-container.has-shadow {
					box-shadow: 0 1px 0 0 red;
					transition: 200ms ease;
					transition-property: box-shadow;
				}
			`}
			<div class={`close-footer-container ${didScrollFooter() && "has-shadow"} grid grid-center`} onClick={e => setExpandFooter(curr => !curr)}>
				<div class="h-8px aspect-8 rounded-$full background-color:gray"></div>
			</div>
			<Show when={expandFooter()}>
				<div>start</div>
				<For each={range(100)}>{(_, index) => <>
					<Show when={index()}><hr /></Show>
					<div tabindex="0">Hello, world!</div>
				</>}</For>
				<div>end</div>
			</Show>
		</footer>
	</>
}

function App4() {
	return <>
		{css`
			html,
			body {
				overscroll-behavior-y: none;
			}
		`}
		<For each={range(400)}>{() => <>
			<div>Hello, world!</div>
		</>}</For>
	</>
}

function App5() {
	const [pointerDown, setPointerDown] = createSignal(false)
	const [start, setStart] = createSignal<{
		x: number // E.g. e.clientX
		y: number
	}>()
	const [transform, setTransform] = createSignal<JSX.CSSProperties>()

	const delta = (to: { x: number, y: number }) => {
		if (!start()) { return }
		const from = start()!
		return {
			x: to.x - from.x,
			y: to.y - from.y,
		}
	}

	return <>
		{css`
			:root {
				--inset-t: 0 auto 0;
				--inset-r: 0 0 0 auto;
				--inset-b: auto 0 0 0;
				--inset-l: 0 auto 0 0;
			}

			.body {
				height: 100vh;
				height: 100dvh;
			}
			.footer {
				position: fixed;
				inset: var(--inset-b);
				height: 72px;
				background-color: whitesmoke;
				box-shadow: 0 0 0 4px lightgray;
			}
		`}
		<div>
			Hello, world!
		</div>
		<div
			class="footer"
			style={transform()}
			onPointerDown={e => {
				batch(() => {
					setPointerDown(true)
					setStart({
						x: e.clientX,
						y: e.clientY,
					})
				})
			}}
			onPointerMove={e => {
				if (!pointerDown()) { return }
				const d = delta({ x: e.clientX, y: e.clientY })!
				setTransform({ "transform": `translateY(${d.y}px)` })
			}}
			onPointerUp={e => setPointerDown(false)}
			onPointerLeave={e => setPointerDown(false)} // Sanity check
		>
			<div>Hello, world!</div>
		</div>
	</>
}

type Point = {
	x: number // E.g. e.clientX
	y: number
}

function App6() {
	const [footerRef, setFooterRef] = createRef()
	const [pointerDown, setPointerDown] = createSignal(false)

	const [p1, setP1] = createSignal<Point>()
	const [p2, setP2] = createSignal<Point>()

	const delta = () => {
		if (!p1() || !p2()) { return }
		return {
			x: p2()!.x - p1()!.x,
			y: p2()!.y - p1()!.y,
		} as Point
	}

	const [open, setOpen] = createSignal(false)

	//// createEffect(() => {
	//// 	if (pointerDown()) {
	//// 		setOpen(false)
	//// 	}
	//// })

	//// const open = () => {
	//// 	if (!delta()) { return false }
	//// 	return delta()!.y <= -300
	//// }

	const [style, setStyle] = createSignal<string | JSX.CSSProperties>()

	createEffect(() => {
		if (!delta()) {
			setStyle({ "transition": "transform 300ms ease" })
		} else {
			if (delta()!.y <= -300) {
				setOpen(true)
				setStyle({
					"--delta-y": `${delta()!.y}px`,
					"transition": "transform 300ms ease",
				})
			} else {
				// TODO: Refactor CSS variables?
				setStyle({ "--delta-y": `${delta()!.y}px` })
			}
		}
	})

	onMount(() => {
		const footer = document.querySelector("footer")!

		////////////////////////////////////

		function handlePointerDown(e: PointerEvent) {
			if (!footer.contains(e.target as HTMLElement)) { return }
			batch(() => {
				setPointerDown(true)
				setP1({ x: e.clientY, y: e.clientY })
			})
		}
		document.addEventListener("pointerdown", handlePointerDown)
		onCleanup(() => document.removeEventListener("pointerdown", handlePointerDown))

		////////////////////////////////////

		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setP2({ x: e.clientY, y: e.clientY })
		}
		document.addEventListener("pointermove", handlePointerMove)
		onCleanup(() => document.removeEventListener("pointermove", handlePointerMove))

		////////////////////////////////////

		function handlePointerUp(e: PointerEvent) {
			batch(() => {
				setPointerDown(false)
				setP1()
				setP2()
			})
		}
		document.addEventListener("pointerup", handlePointerUp)
		onCleanup(() => document.removeEventListener("pointerup", handlePointerUp))

		////////////////////////////////////

		function handlePointerLeave(e: PointerEvent) {
			batch(() => {
				setPointerDown(false) // Sanity check
				setP1()
				setP2()
			})
		}
		document.addEventListener("pointerleave", handlePointerLeave)
		onCleanup(() => document.removeEventListener("pointerleave", handlePointerLeave))
	})

	return <>
		{css`
			* { overscroll-behavior: none; }

			:root {
				--inset:   0;
				--inset-x: auto 0 auto 0;
				--inset-y: 0 auto 0 auto;
				--inset-t: 0 0 auto 0;
				--inset-r: 0 0 0 auto;
				--inset-b: auto 0 0 0;
				--inset-l: 0 auto 0 0;
			}

			:root {
				--tab-height: 72px;
				--delta-x: 0px;
				--delta-y: 0px;
			}

			.main {
				min-height: 100vh;
				min-height: 100dvh;
			}
			// TODO: Add max-height: 100dvh
			.footer {
				position: fixed;
				z-index: 10;
				inset: var(--inset-x);
				//// top: calc(100dv  - 72px);
				//// top: calc(100dvh - 72px); // COMPAT
				padding: 16px;
				border-radius: 16px 16px 0 0;
				background-color: whitesmoke;
				box-shadow: 0 0 0 1px lightgray;
				transform: translateY(calc(-1 * var(--tab-height) + var(--delta-y)));
				-webkit-user-select: none; // COMPAT
				user-select: none;
			}
			.footer.is-expanded {
				transform: translateY(calc(-100vh  + var(--delta-y)));
				transform: translateY(calc(-100dvh + var(--delta-y))); // COMPAT
			}
		`}
		<main class="main">
			<div>Hello, world!</div>
		</main>
		<footer ref={setFooterRef} class={`footer ${open() && "is-expanded"}`} style={style()} onTransitionEnd={e => setStyle()}>
			<For each={range(200)}>{() => <>
				<div>Hello, world!</div>
			</>}</For>
		</footer>
	</>
}

function App7() {
	const [pointerDown, setPointerDown] = createSignal(false)
	const [start, setStart] = createSignal<{
		x: number // E.g. e.clientX
		y: number
	}>()
	const [transform, setTransform] = createSignal<JSX.CSSProperties>()

	const delta = (to: { x: number, y: number }) => {
		if (!start()) { return }
		const from = start()!
		return {
			x: to.x - from.x,
			y: to.y - from.y,
		}
	}

	return <>
		{css`
			:root {
				--inset-t: 0 auto 0;
				--inset-r: 0 0 0 auto;
				--inset-b: auto 0 0 0;
				--inset-l: 0 auto 0 0;
			}

			.body {
				height: 100vh;
				height: 100dvh;
			}
			.footer {
				position: fixed;
				inset: var(--inset-b);
				height: 72px;
				background-color: whitesmoke;
				box-shadow: 0 0 0 4px lightgray;
			}
		`}
		<div>
			Hello, world!
		</div>
		<div
			class="footer"
			style={transform()}
			onPointerDown={e => {
				batch(() => {
					setPointerDown(true)
					setStart({
						x: e.clientX,
						y: e.clientY,
					})
				})
			}}
			onPointerMove={e => {
				if (!pointerDown()) { return }
				const d = delta({ x: e.clientX, y: e.clientY })!
				setTransform({ "transform": `translateY(${d.y}px)` })
			}}
			onPointerUp={e => setPointerDown(false)}
			onPointerLeave={e => setPointerDown(false)} // Sanity check
		>
			<div>Hello, world!</div>
		</div>
	</>
}

function App8() {
	const [active, setActive] = createSignal(false)
	const [expand, setExpand] = createSignal(false)

	const [point1, setPoint1] = createSignal<Point>()
	const [point2, setPoint2] = createSignal<Point>()

	const delta = () => {
		if (!point1() || !point2()) { return }
		const p1 = point1()!
		const p2 = point2()!
		return { x: p1.x - p2.x, y: p1.y - p2.y } as Point
	}

	const [style, setStyle] = createSignal<string | JSX.CSSProperties>()

	// Idle state
	createEffect(on(active, () => {
		if (!active()) {
			setStyle({
				"--bs-delta": "0px",
				"transition": "transform 300ms ease",
			})
		}
	}, { defer: true }))

	createEffect(() => {
		if (!delta()) { return }

		const d = delta()!
		if (!untrack(() => expand())) {
			if (d.y >= 300) { // TODO: Change to var(--bs-trigger-delta)
				batch(() => {
					setActive(false)
					setExpand(true) // ON
					setStyle({
						"--bs-delta": "0px",                  // TODO: This can probably be automated
						"transition": "transform 300ms ease", // TODO: This can probably be automated
					})
				})
			} else {
				setStyle({ "--bs-delta": `${d.y}px` })
			}
		} else {
			if (d.y <= -100) { // TODO: Change to var(--bs-trigger-delta)
				batch(() => {
					setActive(false)
					setExpand(false) // OFF
					setStyle({
						"--bs-delta": "0px",                  // TODO: This can probably be automated
						"transition": "transform 300ms ease", // TODO: This can probably be automated
					})
				})
			} else {
				setStyle({ "--bs-delta": `${d.y}px` })
			}
		}
	})

	onMount(() => {
		const bottomsheet = document.getElementsByClassName("bottomsheet")[0]

		////////////////////////////////////

		function handlePointerDown(e: PointerEvent) {
			if (!bottomsheet.contains(e.target as HTMLElement)) { return }
			batch(() => {
				setActive(true)
				setPoint1({ x: e.clientY, y: e.clientY })
			})
		}
		document.addEventListener("pointerdown", handlePointerDown)
		onCleanup(() => document.removeEventListener("pointerdown", handlePointerDown))

		////////////////////////////////////

		function handlePointerMove(e: PointerEvent) {
			if (!active()) { return }
			setPoint2({ x: e.clientY, y: e.clientY })
		}
		document.addEventListener("pointermove", handlePointerMove)
		onCleanup(() => document.removeEventListener("pointermove", handlePointerMove))

		////////////////////////////////////

		function handlePointerUp(e: PointerEvent) {
			batch(() => {
				setActive(false)
				setPoint1()
				setPoint2()
			})
		}
		document.addEventListener("pointerup", handlePointerUp)
		onCleanup(() => document.removeEventListener("pointerup", handlePointerUp))

		////////////////////////////////////

		function handlePointerLeave(e: PointerEvent) {
			batch(() => {
				setActive(false) // Sanity check
				setPoint1()
				setPoint2()
			})
		}
		document.addEventListener("pointerleave", handlePointerLeave)
		onCleanup(() => document.removeEventListener("pointerleave", handlePointerLeave))
	})

	return <>
		{css`
			html, body { overscroll-behavior-y: none; }
			html, body { position: fixed; inset: 0; overflow: hidden; } // COMPAT/Safari

			:focus { outline: revert; }

			* { overscroll-behavior: none; }

			//////////////////////////////////

			:root {
				--inset:   0;
				--inset-x: auto 0 auto 0;
				--inset-y: 0 auto 0 auto;
				--inset-t: 0 0 auto 0;
				--inset-r: 0 0 0 auto;
				--inset-b: auto 0 0 0;
				--inset-l: 0 auto 0 0;
			}

			:root {
				--bs-delta: 0px;
				--bs-trigger-delta: 600px;

				--tab-height: 72px;
			}

			.body {
				min-height: 100vh;
				min-height: 100dvh; // COMPAT
			}
			// TODO: Add max-height: 100dvh
			.bottomsheet {
				position: fixed;
				z-index: 10;
				inset: var(--inset-x);
				top: 0;
				/*
				 *
				 */
				padding: 16px;
				height: 100vh;  // COMPAT
				height: 100dvh; // COMPAT
				//// overflow-y: auto;
				overflow-y: hidden;
				border-radius: 16px 16px 0 0;
				/*
				 *
				 */
				background-color: whitesmoke;
				box-shadow: 0 0 0 1px lightgray;
				/*
				 *
				 */
				-webkit-user-select: none; // COMPAT
				user-select: none;
				/*
				 *
				 */
				transform: translateY(calc(100vh  - (72px + var(--bs-delta))));
				transform: translateY(calc(100dvh - (72px + var(--bs-delta)))); // COMPAT
			}
			.bottomsheet.is-expanded {
				transform: translateY(calc(0px - var(--bs-delta)));
			}
		`}
		<div class="body">
			<div>Hello, world!</div>
		</div>
		<div class={`bottomsheet ${expand() && "is-expanded"}`} style={style()} onTransitionEnd={e => setStyle()}>
			<For each={range(200)}>{() => <>
				<div>Hello, world!</div>
			</>}</For>
		</div>
	</>
}

const INNER_HEIGHT = window.innerHeight

function App9() {
	document.documentElement.classList.add("disable-overscroll", "disable-scrolling")

	const [bottomsheetBackdrop, setBottomsheetBackdrop] = createRef()
	const [bottomsheet, setBottomsheet] = createRef()
	const [bottomsheetState, setBottomsheetState] = createSignal<"closed" | "open">("closed")

	// Use uninitialized states to dedupe startup effects
	const [pointerDown, setPointerDown] = createSignal<boolean>()
	const [p1, setP1] = createSignal<{ x: number, y: number }>()
	const [p2, setP2] = createSignal<{ x: number, y: number }>()
	const delta = () => {
		if (!p2() || !p1()) { return }
		return { x: p2()!.x - p1()!.x, y: p2()!.y - p1()!.y }
	}

	createEffect(() => {
		if (delta()) {
			if (!pointerDown()) {
				batch(() => {
					//// bottomsheetBackdrop()!.style.setProperty("--__bottomsheet-delta_float", "0%") // Reset
					bottomsheet()!.style.setProperty("--__bottomsheet-delta", "0px")              // Reset
					if (untrack(bottomsheetState) === "open" && delta()!.y >= INNER_HEIGHT / 3) {
						setBottomsheetState("closed")
					}  else if (untrack(bottomsheetState) === "closed" && delta()!.y <= -1 * INNER_HEIGHT / 3) {
						setBottomsheetState("open")
					}
					setPointerDown(false) // Reset
					setP1()               // Reset
					setP2()               // Reset
				})
			} else {
				batch(() => {
					bottomsheet()!.style.setProperty("--__bottomsheet-delta", `${delta()!.y}px`)
					const d = Math.abs(delta()!.y)
					if (untrack(bottomsheetState) === "open") {
						const float = Math.round((1 - d / INNER_HEIGHT) * 100)
						bottomsheetBackdrop()!.style.setProperty("--__bottomsheet-delta-float", `${float}%`)
					} else {
						const float = Math.round((d / INNER_HEIGHT) * 100)
						bottomsheetBackdrop()!.style.setProperty("--__bottomsheet-delta-float", `${float}%`)
					}
				})
			}
		}
	})

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (bottomsheet()!.contains(e.target as HTMLElement)) {
				batch(() => {
					setPointerDown(true)
					setP1({
						x: e.clientX,
						y: e.clientY,
					})
				})
			}
		}
		document.addEventListener("pointerdown", handlePointerDown)
		onCleanup(() => document.removeEventListener("pointerdown", handlePointerDown))

		function handlePointerMove(e: PointerEvent) {
			if (pointerDown()) {
				setP2({
					x: e.clientX,
					y: e.clientY,
				})
			}
		}
		document.addEventListener("pointermove", handlePointerMove)
		onCleanup(() => document.removeEventListener("pointermove", handlePointerMove))

		// Release condition
		function handlePointerUp(e: PointerEvent) {
			setPointerDown(false)
		}
		document.addEventListener("pointerup", handlePointerUp)
		onCleanup(() => document.removeEventListener("pointerup", handlePointerUp))

		// Release condition
		function handlePointerLeave(e: PointerEvent) {
			setPointerDown(false)
		}
		document.addEventListener("pointerleave", handlePointerLeave)
		onCleanup(() => document.removeEventListener("pointerleave", handlePointerLeave))
	})

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
				--inset:   0;
				--inset-x: auto 0 auto 0;
				--inset-y: 0 auto 0 auto;
				--inset-t: 0 0 auto 0;
				--inset-r: 0 0 0 auto;
				--inset-b: auto 0 0 0;
				--inset-l: 0 auto 0 0;
			}

			:root {
				--bottomsheet-z-index: 100;
				--bottomsheet-tab-is-closed-height: 64px;
				--bottomsheet-tab-is-open-negative-height: 24px;

				// Internal
				--__bottomsheet-delta: 0px;
				--__bottomsheet-delta_float: 0%;
			}

			//////////////////////////////////

			.bottomsheet {
				position: fixed;
				z-index: var(--bottomsheet-z-index);
				inset: var(--inset-x);
				top: 0;
				min-height: 200dvh;
				border-radius: 16px 16px 0 0;
				background-color: whitesmoke;
				box-shadow: 0 0 0 4px gray;
				-webkit-user-select: none;
				user-select: none;
			}
			.bottomsheet.is-closed {
				transform: translateY(calc(100dvh - var(--bottomsheet-tab-is-closed-height) + var(--__bottomsheet-delta)));
			}
			.bottomsheet.is-open {
				transform: translateY(calc(var(--bottomsheet-tab-is-open-negative-height) + var(--__bottomsheet-delta)));
			}

			//////////////////////////////////

			.bottomsheet-backdrop {
				position: fixed;
				z-index: calc(var(--bottomsheet-z-index) - 1);
				inset: var(--inset);
				min-height: 100dvh; // TODO: Use lvh?
				background-color: hsl(0 0% 0% / var(--__bottomsheet-delta-float));
			}
			.bottomsheet-backdrop:has(+ .bottomsheet.is-closed) {
				--__bottomsheet-delta-float: 0%;
			}
			.bottomsheet-backdrop:has(+ .bottomsheet.is-open) {
				--__bottomsheet-delta-float: 50%;
			}
		`}
		<div
			ref={setBottomsheetBackdrop}
			class="bottomsheet-backdrop"
			style={{ "transition": pointerDown() === false ? "background-color 500ms cubic-bezier(0, 1, 0.25, 1)" : undefined }}
			onClick={e => setBottomsheetState("closed")}
		></div>
		<div
			ref={setBottomsheet}
			class={`bottomsheet is-${bottomsheetState()}`}
			style={{ "transition": pointerDown() === false ? "transform 500ms cubic-bezier(0, 1, 0.25, 1)" : undefined }}
			onClick={e => setBottomsheetState("open")}
		>
			<For each={range(20)}>{() => <>
				<div>Hello, world!</div>
			</>}</For>
		</div>
	</>
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function App10() {
	document.documentElement.classList.add("disable-overscroll", "disable-scrolling")

	const [ref, setRef] = createRef()
	const [tabRef, setTabRef] = createRef()
	const [backdropRef, setBackdropRef] = createRef()

	const [state, setState] = createSignal<"CLOSED" | "CLOSING" | "OPENING" | "OPEN">("CLOSED")
	const [pointerDown, setPointerDown] = createSignal(false)

	const [origin, setOrigin] = createSignal<{ x: number, y: number }>()
	const [offset, setOffset] = createSignal<{ x: number, y: number }>()

	// DEBUG
	document.addEventListener("keydown", e => {
		if (e.key === "d") {
			setState(curr => curr === "CLOSED" ? "OPEN" : "CLOSED")
		}
	}, false)

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (tabRef()!.contains(e.target as HTMLElement)) {
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
				--inset:   0;
				--inset-x: auto 0 auto 0;
				--inset-y: 0 auto 0 auto;
				--inset-t: 0 0 auto 0;
				--inset-r: 0 0 0 auto;
				--inset-b: auto 0 0 0;
				--inset-l: 0 auto 0 0;
			}

			.bottomsheet {
				// Internal
				--__bottomsheet-delta: 0px;

				--bottomsheet-z-index: 100;
				--bottomsheet-border-radius: 24px;
				--bottomsheet-tab-height: 48px;
				--bottomsheet-negative-tab-height: 32px;
				--bottomsheet-transition: 500ms cubic-bezier(0, 1, 0.25, 1);
			}

			.bottomsheet-backdrop {
				// Internal
				--__bottomsheet-backdrop-delta-percentage: 0%;

				--bottomsheet-backdrop-z-index: calc(var(--bottomsheet-z-index) - 10);
				--bottomsheet-backdrop-transition: 1000ms cubic-bezier(0, 1, 0.25, 1);
			}

			//////////////////////////////////

			.bottomsheet {
				position: fixed;
				z-index: var(--bottomsheet-z-index);
				inset: var(--inset-x);
				top: 0;
				min-height: 200vh; // COMPAT
				//// min-height: 200dvh;
				border-radius: var(--bottomsheet-border-radius) var(--bottomsheet-border-radius) 0 0;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
				-webkit-user-select: none; // COMPAT
				user-select: none;
				transform: var(--__bottomsheet-transform);
			}
			.bottomsheet:is(.is-opening, .is-closing) {
				transition: transform var(--bottomsheet-transition);
			}
			.bottomsheet:is(.is-closing, .is-closed) {
				--__bottomsheet-transform: translateY(calc(100vh - var(--bottomsheet-tab-height) + var(--__bottomsheet-delta))); // COMPAT
				//// --__bottomsheet-transform: translateY(calc(100dvh - var(--bottomsheet-tab-height) + var(--__bottomsheet-delta)));
			}
			.bottomsheet:is(.is-opening, .is-open) { --__bottomsheet-transform: translateY(calc(var(--bottomsheet-negative-tab-height) + var(--__bottomsheet-delta))); }

			//////////////////////////////////

			.bottomsheet-tab {
				display: grid;
				place-items: center;
				height: var(--bottomsheet-tab-height);
			}
			.bottomsheet-tab-icon {
				height: 6px;
				width: 48px;
				border-radius: var(--full);
				background-color: gray;
			}

			//////////////////////////////////

			.bottomsheet-content {
				height: calc(100vh - (var(--bottomsheet-negative-tab-height) + var(--bottomsheet-tab-height))); // COMPAT
				//// height: calc(100dvh - (var(--bottomsheet-negative-tab-height) + var(--bottomsheet-tab-height)));
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
				<div class="h-6px w-48px rounded-$full background-color:gray"></div>
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

render(() => <App10 />, document.getElementById("root")!)
