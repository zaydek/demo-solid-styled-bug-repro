import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { createResource, createRoot, createSignal, For, Show, Suspense } from "solid-js"
import { Dynamic, Portal, render } from "solid-js/web"
import { css } from "./solid-utils"
import { range } from "./utils"

////////////////////////////////////////

const _internalCache = new Map<string, unknown>()
async function cache<Value>(key: string, value: Value): Promise<Value> {
	if (_internalCache.has(key)) {
		return _internalCache.get(key) as Value
	} else {
		await new Promise(resolve => setTimeout(resolve, 500))
		_internalCache.set(key, value)
		return value
	}
}

////////////////////////////////////////

type Version = "v1" | "v2"
type Variant = "outline" | "solid" | "20/solid" | "24/outline" | "24/solid"

const [version, setVersion] = createSignal<Version>("v2")
const [variant, setVariant] = createSignal<Variant>("20/solid")

const [manifest] = createRoot(() => createResource(version, async version => {
	if (version === "v1") {
		return cache("v1", import("./data/manifest@1.0.6"))
	} else if (version === "v2") {
		return cache("v2", import("./data/manifest@2.0.11"))
	}
}))

let cachedV1Variant: Variant = "solid"
let cachedV2Variant: Variant = "24/solid"

const [icons] = createRoot(() => createResource(() => [version(), variant()] as [Version, Variant], async ([version, variant]) => {
	// Cache the previous variants (by version) for toggling between versions
	if (variant === "solid" || variant === "outline") {
		cachedV1Variant = variant
	} else {
		cachedV2Variant = variant
	}
	// V1
	if (version === "v1") {
		if (variant === "solid") {
			return cache(variant, import("./assets/heroicons@1.0.6/solid"))
		} else if (variant === "outline") {
			return cache(variant, import("./assets/heroicons@1.0.6/outline"))
		}
		// Fallback
		setVariant(cachedV1Variant)
		return cache(variant, import("./assets/heroicons@1.0.6/solid"))
	}
	if (version === "v2") {
		if (variant === "20/solid") {
			return cache(variant, import("./assets/heroicons@2.0.11/20/solid"))
		} else if (variant === "24/solid") {
			return cache(variant, import("./assets/heroicons@2.0.11/24/solid"))
		} else if (variant === "24/outline") {
			return cache(variant, import("./assets/heroicons@2.0.11/24/outline"))
		}
		// Fallback
		setVariant(cachedV2Variant)
		return cache(variant, import("./assets/heroicons@2.0.11/20/solid"))
	}
}))

const ready = () => manifest.state === "ready" && icons.state === "ready"

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
		<Show when={ready()} fallback={<>
			{/* Fallback */}
			<div class="component-search-bar flex-row flex-align-center">
				<div class="h-8px aspect-16 rounded-$full effect-shimmer"></div>
			</div>
		</>}>
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
			<div class="component-grid">
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
			<div class="component-grid">
				<For each={manifest()?.manifest.payload}>
					{info => <>
						<div class="component-grid-cell">
							{/* @ts-expect-error */}
							<Dynamic component={icons()?.[info.title]} class="h-32px aspect-1 color:$text-color" />
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
					.hr {
						margin: 8px 0;
					}
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
					onClick={e => setVersion("v1")}
				>
					v1
				</button>
				<button
					class="button"
					onClick={e => setVersion("v2")}
				>
					v2
				</button>
				<hr class="hr" />
				{/* V1 */}
				<Show when={version() === "v1"}>
					<button
						class="button"
						onClick={e => setVariant("solid")}
					>
						solid
					</button>
					<button
						class="button"
						onClick={e => setVariant("outline")}
					>
						outline
					</button>
				</Show>
				{/* V2 */}
				<Show when={version() === "v2"}>
					<button
						class="button"
						onClick={e => setVariant("20/solid")}
					>
						small/solid
					</button>
					<button
						class="button"
						onClick={e => setVariant("24/solid")}
					>
						large/solid
					</button>
					<button
						class="button"
						onClick={e => setVariant("24/outline")}
					>
						large/outline
					</button>
				</Show>
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
