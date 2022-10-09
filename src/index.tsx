import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { For } from "solid-js"
import { render } from "solid-js/web"
import { Bottomsheet } from "./components"
import { css } from "./solid-utils"
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

function App5() {
	return <>
		{/* <div class="main-content"> */}
		{css`
			:root {
				--search-bar-height: 64px;
			}
			.search-bar {
				position: fixed;
				z-index: 10;
				inset: 0;
				bottom: auto;
				padding: 0 24px;
				height: var(--search-bar-height);
				background-color: white;
				box-shadow: 0 4px 0 0 hsl(0 0% 0% / 25%);
			}
			.search-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: gray;
			}
		`}
		<div class="search-bar flex-row flex-align-center">
			<div class="search-icon"></div>
			<div class="flex-grow"></div>
			<div class="search-icon"></div>
		</div>
		{css`
			:root {
				--grid-icon-height: 64px;
			}
			.results-grid {
				margin-top: var(--search-bar-height);
				margin-bottom: var(--bottomsheet-tab-height);
				padding: 16px 8px;
				height: calc(var(--screen) - var(--search-bar-height) - var(--bottomsheet-tab-height));
				overflow-y: auto;

				// CSS Grid
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--grid-icon-height), 1fr));
				grid-auto-rows: var(--grid-icon-height);
				justify-items: center;
				gap: 8px;
			}
			.grid-cell {
				height: var(--grid-icon-height);
				aspect-ratio: 1;

				// CSS Grid
				display: grid;
				place-items: center;
			}
			.grid-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: gray;
			}
			.grid-name {
				height: 6px;
				aspect-ratio: 8;
				border-radius: var(--full);
				background-color: gray;
			}
		`}
		<div class="results-grid">
			<For each={range(200)}>{() => <>
				<div class="grid-cell">
					<div class="grid-icon"></div>
					<div class="grid-name"></div>
				</div>
			</>}</For>
		</div>
		{/* </div> */}
		<Bottomsheet>
			<For each={range(200)}>{() => <>
				<div>x</div>
			</>}</For>
		</Bottomsheet>
	</>
}

render(() => <App5 />, document.getElementById("root")!)
