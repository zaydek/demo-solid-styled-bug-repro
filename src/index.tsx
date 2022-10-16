import "the-new-css-reset"
import "virtual:uno.css"
import "./1-base.css"
import "./2-vars.css"
import "./3-components.css"

import { createSignal, ParentProps, Setter } from "solid-js"
import { For, render, Show } from "solid-js/web"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { createMediaQuery } from "./effects"
import { css } from "./solid-utils"
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
			<For each={range(1000)}>{() => <>
				x{" "}
			</>}</For>
		</main>
		<Sheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
			<aside class="aside-content">
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
						<div>Hello, world!</div>
					</section>
				</div>
			</aside>
		</Sheet>
	</>
}

////////////////////////////////////////

render(() => <>
	<App />
</>, document.getElementById("root")!)
