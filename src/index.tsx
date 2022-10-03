import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { createRoot, For, Show, Suspense } from "solid-js"
import { Dynamic, Portal, render } from "solid-js/web"
import { css, cx } from "./solid-utils"
import { ready, search, settings, VariantV1, VariantV2, Version } from "./state"
import { stringify } from "./stringify-svg"
import { range } from "./utils"

////////////////////////////////////////

function SearchBar() {
	return <>
		{css`
			.component-search-bar {
				padding: 0 calc((var(--grid-cell-height) * 2 / 3) / 2);
				height: 64px;
				border-radius: calc((var(--grid-cell-height) * 2 / 3) / 3);
				// Typography
				font: 400 17px / normal var(--sans);
				letter-spacing: calc(1em / 64);
				color: var(--text-color);
				// Decoration
				box-shadow: 0 0 0 4px var(--hairline-gray-color);
			}
			.component-search-bar::placeholder {
				color: var(--placeholder-text-color);
			}
		`}
		<Show when={ready()} fallback={<>
			{/* Fallback */}
			<div class="component-search-bar flex-row flex-align-center">
				<div class="h-8px aspect-16 rounded-$full effect-shimmer"></div>
			</div>
		</>}>
			<input class="component-search-bar" placeholder="I’m searching for…" value={search.value()} onInput={e => search.setValue(e.currentTarget.value)} autofocus />
		</Show>
	</>
}

function Grid() {
	return <>
		{css`
			.component-grid {
				border-radius: calc((var(--grid-cell-height) * 2 / 3) / 3);
				box-shadow: 0 0 0 4px var(--hairline-gray-color);
			}
			.component-grid.has-no-results {
				min-height: 75vh;
			}
			.component-grid.has-results {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--grid-cell-height), 1fr));
				gap: 1px;
			}

			//////////////////////////////////

			.component-grid-cell {
				padding: calc(var(--grid-cell-height) / 8) calc(var(--grid-cell-height) / 32);
				display: grid;               // E.g. grid
				grid-template-rows: 1fr 6px;
				place-items: center;         // E.g. grid grid-center
				gap: 6px;
				aspect-ratio: 1;
				//// outline: 1px solid var(--hairline-gray-color);
				// Behavior
				cursor: pointer;
			}

			//////////////////////////////////

			.component-grid-label {
				// Typography
				font: 400 12.5px / normal var(--sans);
				// Ellipsis (typography)
				overflow: hidden; // Sorted alphabetically
				text-align: center;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
				//// letter-spacing: calc(1em / 64);
				color: var(--text-color);
				// Behavior
				cursor: text;
				user-select: all;
				-webkit-user-select: all;
			}

			//////////////////////////////////

			.component-grid-label-highlight { position: relative; }
			.component-grid-label-highlight::before { content: ""; }
			.component-grid-label-highlight::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: 2px;
				background-color: hsl(200deg 100% 90%);
			}
		`}
		<Suspense fallback={<>
			{/* Loading */}
			<div class="component-grid has-results">
				<For each={range(64)}>
					{() => <>
						<div class="component-grid-cell">
							<div class="h-32px aspect-1 rounded-$full effect-shimmer"></div>
							<div class="h-6px  aspect-8 rounded-$full effect-shimmer"></div>
						</div>
					</>}
				</For>
			</div>
		</>}>
			{/* Loaded -> empty */}
			<Show when={search.results()} fallback={<>
				<div class="component-grid has-no-results flex-col flex-center gap-8px">
					<div class="font-family:$sans color:$text-color">No results</div>
					<div class="px-24px h-48px rounded-$full background-color:hsl(0deg_0%_0%/15%) grid grid-center cursor:pointer" onClick={e => {
						search.setValue("")
						const componentSearchBar = document.getElementsByClassName("component-search-bar")[0]! as HTMLElement
						componentSearchBar.focus()
					}} tabindex="0">
						<div class="font-family:$sans color:$text-color">Search for something else</div>
					</div>
				</div>
			</>}>
			{/* Loaded -> not empty */}
				<div class="component-grid has-results">
					<For each={search.results()}>
						{info => <>
							<div class="component-grid-cell" onClick={e => {
								const serialized = stringify(e.currentTarget.querySelector("svg")!)
								navigator.clipboard.writeText(serialized)
								settings.setTextarea(serialized)
							}}>
								{/* @ts-expect-error */}
								<Dynamic component={settings.icons()?.[info.title]} class="h-32px aspect-1 color:$text-color" />
								<div class="component-grid-label">
									<Show when={info.index !== undefined} fallback={info.kebab}>
										<span data-a>{info.kebab.slice(0, info.index!)}</span>
										<span data-b class="component-grid-label-highlight">{search.canonicalValue()}</span>
										<span data-c>{info.kebab.slice(info.index! + search.canonicalValue().length)}</span>
									</Show>
								</div>
							</div>
						</>}
					</For>
				</div>
			</Show>
		</Suspense>
	</>
}

function Modal() {
	return <>
		{css`
			.component-modal {
				padding: 16px;
				width: 384px;
				border-radius: 24px;
				background-color: var(--card-color);
				box-shadow: 0 0 0 4px var(--hairline-gray-color);
			}
		`}
		<div class="fixed inset-tr-16px">
			<div class="component-modal flex-col gap-8px">
				{css`
					.hr {
						margin: 8px 0;
					}
					.button {
						padding: 8px;
						border-radius: 8px;
						// Typography
						font: 400 16px / normal var(--sans);
						// Decoration
						color: var(--text-color);
						background-color: hsl(0deg 0% 95%);
						// Behavior
						cursor: pointer;
					}
					.textarea {
						padding: 8px;
						border-radius: 8px;
						// Typography
						-webkit-font-smoothing: auto;  // CSS reset
						-moz-osx-font-smoothing: auto; // CSS reset
						font: 400 14px / normal var(--code);
						tab-size: 2;
						white-space: pre;
						// Decoration
						color: var(--text-color);
						background-color: hsl(0deg 0% 95%);
						//// // Behavior
						//// cursor: text;
						//// user-select: all;
						//// -webkit-user-select: all;
					}
					.textarea::placeholder {
						color: var(--placeholder-text-color);
					}
				`}
				<For each={["v1", "v2"] as Version[]}>
					{version => <>
						<div class="button" onClick={e => settings.setVersion(version)} tabindex="0">
							{version}
						</div>
					</>}
				</For>
				<hr class="hr" />
				<Show when={settings.version() === "v1"}>
					<For each={["solid", "outline"] as VariantV1[]}>
						{variant => <>
							<div class="button" onClick={e => settings.setVariantV1(variant)} tabindex="0">
								{variant}
							</div>
						</>}
					</For>
				</Show>
				<Show when={settings.version() === "v2"}>
					<For each={["20/solid", "24/solid", "24/outline"] as VariantV2[]}>
						{variant => <>
							<div class="button" onClick={e => settings.setVariantV2(variant)} tabindex="0">
								{variant}
							</div>
						</>}
					</For>
				</Show>
				<hr class="hr" />
				<textarea class="textarea" rows={settings.textarea().split("\n").length} value={settings.textarea()} placeholder="Click an element to inspect the HTML" onClick={e => {
					// https://stackoverflow.com/a/7313795
					e.currentTarget.focus()
					e.currentTarget.select()
				 }} />
			</div>
		</div>
	</>
}

function App() {
	return <>
		{css`
			:focus { outline: revert; } // CSS reset

			:root {
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;

				// Layout
				--grid-cell-height: 112px;

				// Colors
				--card-color:             hsl(0deg 0% 100%);
				--hairline-gray-color:    hsl(0deg 0% 85%);
				--text-color:             hsl(0deg 0% 25%);
				--placeholder-text-color: hsl(0deg 0% 50%);

				// Typography
				--sans: system-ui,
					-apple-system,
					"Segoe UI",
					Roboto,
					Helvetica,
					Arial,
					sans-serif,
					"Apple Color Emoji",
					"Segoe UI Emoji";
				--code: ui-monospace,
					SFMono-Regular,
					Consolas,
					"Liberation Mono",
					Menlo,
					monospace;

				color: red; // DEBUG
			}
			::placeholder {
				color: red; // DEBUG
			}

			//////////////////////////////////

			// https://codepen.io/havardob/pen/dyGGGzq
			.effect-shimmer {
				--shimmer-width:          32px;
				--shimmer-position-start: left  -40px top;
				--shimmer-position-end:   right -40px top;
				--shimmer-duration:       1000ms;
				background-color: var(--hairline-gray-color);
				background-image:
					linear-gradient(
						90deg,
						hsl(0deg 0% 100% / 0%),
						hsl(0deg 0% 100% / 50%),
						hsl(0deg 0% 100% / 0%)
					);
				background-position: var(--shimmer-position-start); // Sorted alphabetically
				background-repeat: no-repeat; // CSS reset
				background-size: var(--shimmer-width) 100%;
				// Behavior
				animation: shine var(--shimmer-duration) ease infinite;
			}
			@keyframes shine {
				to {
					background-position: var(--shimmer-position-end);
				}
			}
		`}
		<div class="px-($grid-cell-height/4) py-$grid-cell-height pb-($grid-cell-height*2) flex-row flex-justify-center">
			<div class="w-100% max-w-1280px flex-col gap-($grid-cell-height/3)">
				<SearchBar />
				<Grid />
				<Portal>
					<Modal />
				</Portal>
			</div>
		</div>
	</>
}

createRoot(() => css`
	:focus { outline: revert; }

	:root {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		--full:   1000px; // E.g. rounded-$full
		--screen: 100vh;  // E.g. h-$screen

		// Typography
		--sans: system-ui,
			-apple-system,
			"Segoe UI",
			Roboto,
			Helvetica,
			Arial,
			sans-serif,
			"Apple Color Emoji",
			"Segoe UI Emoji";

		--code: ui-monospace,
			SFMono-Regular,
			Consolas,
			"Liberation Mono",
			Menlo,
			monospace;

		// Colors
		--card-color:             hsl(0deg 0% 100%);
		--hairline-gray-color:    hsl(0deg 0% 85%);
		--text-color:             hsl(0deg 0% 25%);
		--placeholder-text-color: hsl(0deg 0% 50%);

		font-family: var(--sans);

		// DEBUG
		color: red;
	}
	code {
		-webkit-font-smoothing: auto;
		-moz-osx-font-smoothing: auto;

		font-family: var(--code);
	}
`)

////////////////////////////////////////

render(() => <App />, document.getElementById("root")!)
