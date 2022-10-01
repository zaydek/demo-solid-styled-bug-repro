import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { createResource, createRoot, createSignal, For, Show, startTransition, Suspense } from "solid-js"
import { Dynamic, Portal, render } from "solid-js/web"
import { css } from "./solid-utils"
import { range } from "./utils"

////////////////////////////////////////

const [manifest] = createResource(async () => {
	await new Promise(r => setTimeout(r, 1_000))
	return import("./data/manifest@2.0.11")
})

const [selected, setSelected] = createSignal("20/solid")
const [iconset] = createRoot(() => createResource(selected, async selected => {
	if (selected === "20/solid") {
		return import("./assets/heroicons@2.0.11/20/solid")
	} else if (selected === "24/solid") {
		return import("./assets/heroicons@2.0.11/24/solid")
	} else if (selected === "24/outline") {
		return import("./assets/heroicons@2.0.11/24/outline")
	}
}))

const loaded = () => {
	return manifest.state === "ready" &&
		iconset.state === "ready"
}

////////////////////////////////////////

function SearchBar() {
	const [value, setValue] = createSignal("")

	return <>
		{css`
			.component-search-bar {
				padding: 0 calc((var(--grid-cell-height) * 2 / 3) / 2);
				height: calc(var(--grid-cell-height) * 2 / 3);
				border-radius: calc((var(--grid-cell-height) * 2 / 3) / 2);
				// Decoration
				box-shadow: 0 0 0 4px var(--hairline-gray-color);
			}
			.component-search-bar.is-loaded {
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
		<Show when={!loaded()}>
			<div class="component-search-bar flex-row flex-align-center">
				<div class="h-8px aspect-16 rounded-$full effect-shimmer"></div>
			</div>
		</Show>
		<Show when={loaded()}>
			<input class="component-search-bar is-loaded" placeholder="I am looking for…" value={value()} onInput={e => setValue(e.currentTarget.value)} />
		</Show>
	</>
}

function Grid() {
	return <>
		{css`
			.component-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--grid-cell-height), 1fr));
				gap: 1px;
				border-radius: calc((var(--grid-cell-height) * 2 / 3) / 2);
				// Decoration
				box-shadow: 0 0 0 4px var(--hairline-gray-color);
				// Behavior
				overflow: hidden;
			}

			//////////////////////////////////

			.component-grid-cell {
				padding: calc(var(--grid-cell-height) / 8) calc(var(--grid-cell-height) / 16);
				display: grid;               // E.g. grid
				grid-template-rows: 1fr 6px;
				place-items: center;         // E.g. grid grid-center
				gap: 6px;
				aspect-ratio: 1;
				outline: 1px solid var(--hairline-gray-color);
			}

			//////////////////////////////////

			.component-grid-label {
				font: 400 12.5px / normal var(--sans);
				letter-spacing: calc(1em / 64);
				color: var(--text-color);
				// Ellipsis
				overflow: hidden; // Sorted alphabetically
				text-align: center;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
			}
		`}
		<Suspense fallback={<>
			{/* Not ready */}
			<div class="component-grid">
				<For each={range(32)}>
					{() => <>
						<div class="component-grid-cell">
							<div class="h-32px aspect-1 rounded-$full effect-shimmer"></div>
							<div class="h-6px aspect-8 rounded-$full effect-shimmer"></div>
						</div>
					</>}
				</For>
			</div>
		</>}>
			{/* Ready */}
			<div class="component-grid">
				<For each={manifest()?.manifest.payload}>
					{info => <>
						<div class="component-grid-cell">
							{/* @ts-expect-error */}
							<Dynamic component={iconset()[info.title]} class="h-32px aspect-1 color:$text-color" />
							<div class="component-grid-label">{info.kebab}</div>
						</div>
					</>}
				</For>
			</div>
		</Suspense>
	</>
}

function Modal() {
	return <>
		{css`
			.component-modal {
				padding: 16px;
				width: 384px;
				border-radius: 16px;
				background-color: var(--card-color);
				box-shadow: 0 0 0 4px var(--hairline-gray-color);
			}
		`}
		<div class="fixed inset-br-16px">
			<div class="component-modal flex-col gap-8px">
				{css`
					.button {
						padding: 8px;
						border-radius: 8px;
						// Decoration
						font-family: var(--sans);
						color: var(--text-color);
						background-color: hsl(0deg 0% 95%);
						// Behavior
						cursor: pointer;
					}
				`}
				<button
					class="button"
					onClick={e => {
						startTransition(() => {
							setSelected("20/solid")
						})
					}}
				>
					small/solid
				</button>
				<button
					class="button"
					onClick={e => {
						startTransition(() => {
							setSelected("24/solid")
						})
					}}
				>
					large/solid
				</button>
				<button
					class="button"
					onClick={e => {
						startTransition(() => {
							setSelected("24/outline")
						})
					}}
				>
					large/outline
				</button>
			</div>
		</div>
	</>
}

function App() {
	return <>
		{css`
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

render(() => <App />, document.getElementById("root")!)
