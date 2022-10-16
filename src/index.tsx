import "the-new-css-reset"
import "virtual:uno.css"
import "./1-base.css"
import "./2-vars.css"
import "./3-components.css"

import { batch, createSignal, onMount, ParentProps, Setter } from "solid-js"
import { For, render, Show } from "solid-js/web"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { createMediaQuery, createScreenVars } from "./effects"
import { css, cx } from "./solid-utils"
import { only, range } from "./utils"

////////////////////////////////////////

const responsive = createMediaQuery("(max-width: 499px)")

function Sheet(props: ParentProps<{
	sidesheet:    SidesheetState
	setSidesheet: Setter<SidesheetState>
}>) {

	return <>
		<Show when={responsive()}>
			<Bottomsheet initialState="open">
				{props.children}
			</Bottomsheet>
		</Show>
		<Show when={!responsive()}>
			<Sidesheet state={props.sidesheet} setState={props.setSidesheet}>
				{props.children}
			</Sidesheet>
		</Show>
	</>
}

////////////////////////////////////////

function App() {
	const [sidesheet, setSidesheet] = createSignal<SidesheetState>("open")

	return <>
		{css`
			:root {
				--fixed-navbar-height: calc(32px + 16px + 16px);
			}
			.fixed-navbar {
				position: fixed;
				z-index: 10;
				inset: 0 0 auto 0;
				padding: 16px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);

				/* Flow */
				display: flex;
				flex-direction: row;
				align-items: center; /* Center y-axis */
				gap: 16px;
			}
			.navbar {
				padding: 16px;
				/* Defer background-color and box-shadow to .*-card */

				/* Flow */
				display: flex;
				flex-direction: row;
				align-items: center; /* Center y-axis */
				gap: 16px;
			}
			.nav-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: gray;
			}
			.line { height: 1px; background-color: hsl(0 0% 90%); }
			.line.is-collapsed { margin-top: -1px; }
		`}
		{/* @ts-expect-error */}
		<nav class="fixed-navbar" inert={only(sidesheet() === "expanded")}>
			<div class="nav-icon"></div>
			<div class="nav-icon"></div>
			<div class="[flex-grow:1]"></div>
			<div class="nav-icon"></div>
		</nav>
		{/* @ts-expect-error */}
		<main class="main-content" inert={only(sidesheet() === "expanded")}>
			<For each={range(4_000)}>{() => <>
				hello{" "}
			</>}</For>
		</main>
		<Sheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
			<aside class="aside-content [display:flex] [flex-direction:column]">
				<Show when={!responsive()}>
					<div class="[flex-shrink:0]">
						<nav class="navbar">
							<div class="nav-icon"></div>
							<div class="[flex-grow:1]"></div>
							<div class="nav-icon"></div>
							<div class="nav-icon"></div>
						</nav>
						<hr class="line" />
					</div>
				</Show>
				<div class="[flex-grow:1] [overflow-y:auto]">
					<For each={range(40)}>{() => <>
						<section class="[padding:16px]">
							<div>Hello, world!</div>
						</section>
						<hr class="line" />
					</>}</For>
				</div>
				<div class="[flex-shrink:0]">
					<hr class="line is-collapsed" />
					<section class="[padding:16px]">
						<div>This is the last block</div>
					</section>
				</div>
			</aside>
		</Sheet>
	</>
}

////////////////////////////////////////

// TODO: Add uncontrolled vs. controlled API
function Collapsible() {
	const [ref, setRef] = createSignal<HTMLElement>()

	const [state, setState] = createSignal<"closed" | "open">("open")
	const [h1, setH1] = createSignal<number>()
	const [h2, setH2] = createSignal<number>()
	const [transition, setTransition] = createSignal<true>()

	onMount(() => {
		setH1(ref()!.firstElementChild!.scrollHeight)
		setH2(ref()!.scrollHeight)
	})

	return <>
		{css`
			.collapsible {
				/* Runtime values */
				--__height-is-closed: 32px;
				--__height-is-open: initial;
			}
			.collapsible.is-closed { /* height: var(--__height-is-closed); */ overflow-y: hidden; }
			.collapsible.is-open   { /* height: var(--__height-is-open);   */ overflow-y: hidden; }
			/* .collapsible.is-transition { */
			/* 	transition: height 600ms cubic-bezier(0, 1, 0.25, 1); */
			/* } */

			/********************************/

			.collapsible-button:hover {
				cursor: pointer;
			}

			/********************************/

			/* .collapsible-content { */
			/* 	transition: opacity 600ms cubic-bezier(0, 1, 0.25, 1); */
			/* } */
			/* .collapsible.is-closed .collapsible-content { opacity: 0; } */
			/* .collapsible.is-open   .collapsible-content { opacity: 1; } */

			.collapsible-content {
				overflow-y: hidden;
				transition: transform 600ms cubic-bezier(0, 1, 0.25, 1);
			}
			.collapsible.is-closed .collapsible-content { transform: translateY(-100px); }
			.collapsible.is-open   .collapsible-content { transform: translateY(0px); }
		`}
		<div
			ref={setRef}
			class={cx(`collapsible is-${state()} ${transition() ? "is-transition" : ""}`)}
			style={{
				"--__height-is-closed": !h1()
					? "initial"
					: `${h1()}px`,
				"--__height-is-open": !h2()
					? "initial"
					: `${h2()}px`,
			}}
			onTransitionEnd={e => setTransition()}
			// COMPAT/Firefox: Use tabIndex={-1} to prevent "overflow-y: *;" from
			// being focusable
			tabIndex={-1}
		>
			<div
				class="collapsible-button [padding:16px]"
				onClick={e => {
					if (state() === "open") {
						batch(() => {
							setState("closed")
							setTransition(true)
						})
					} else {
						batch(() => {
							setState("open")
							setTransition(true)
						})
					}
				}}
				onKeyDown={e => {
					if (e.key === " ") {
						e.preventDefault() // Prevent scrolling
						e.currentTarget.click()
					}
				}}
				role="button"
				tabIndex={0}
			>
				Title
			</div>
			{/* @ts-expect-error */}
			<div class="collapsible-content [padding:16px] [padding-top:0px_!important]" inert={only(state() === "closed")}>
				<div>Hello, world!</div>
				<div>Hello, world!</div>
				<div>Hello, world!</div>
				<div>Hello, world!</div>
				<div>Hello, world!</div>
				<div>End</div>
			</div>
		</div>
	</>
}

function App2() {
	return <>
		{css`
			.container {
				padding: 96px 0;

				/* Flow */
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.card {
				width: 224px;
				background-color: whitesmoke;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
			.line {
				height: 1px;
				background-color: red;
			}
		`}
		<div class="container">
			<div class="card">
				<Collapsible />
				<div class="line"></div>
				<Collapsible />
				<div class="line"></div>
				<Collapsible />
				<div class="line"></div>
				<Collapsible />
			</div>
		</div>
	</>
}

render(() => <>
	<App2 />
</>, document.getElementById("root")!)
