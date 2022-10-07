import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { batch, createEffect, createSignal, For, JSX, onCleanup, onMount, Show } from "solid-js"
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

render(() => <App6 />, document.getElementById("root")!)
