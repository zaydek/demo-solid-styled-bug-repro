import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { createSignal, For } from "solid-js"
import { render } from "solid-js/web"
import { Bottomsheet, bottomsheetState, ColorButton, Radio, Slider } from "./components"
import { css } from "./solid-utils"
import { range } from "./utils"
import { AriaRadiogroup } from "./aria"
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

render(() => <App5 />, document.getElementById("root")!)
