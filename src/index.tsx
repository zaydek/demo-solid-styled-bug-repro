import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { createMemo, createResource, createRoot, createSignal, For, Show, Suspense } from "solid-js"
import { Dynamic, Portal, render } from "solid-js/web"
import { serialize } from "./serialize"
import { css } from "./solid-utils"
import { range } from "./utils"

////////////////////////////////////////

const _internalCache = new Map<string, unknown>()
async function cache<Value>(key: string, value: Value): Promise<Value> {
	if (_internalCache.has(key)) {
		return _internalCache.get(key) as Value
	} else {
		await new Promise(resolve => setTimeout(resolve, 1_000))
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

const [textarea, setTextarea] = createSignal("")

const ready = () => manifest.state === "ready" && icons.state === "ready"

////////////////////////////////////////

const [searchValue, setSearchValue] = createSignal("")

// Memo because of <Highlight>
const canonicalSearchValue = createMemo(() => {
	return searchValue()
		.trim()
		.replace(/\s+/g, "-")           // Whitespace -> hyphen (takes precedence)
		.replace(/-+/g, "-")            // Hyphens    -> hyphen
		.replace(/[^a-zA-Z0-9-]+/g, "") // Remove non-alphanums
})

const payload = () => manifest()?.manifest.payload
const payloadValues = () => {
	if (!payload()) { return }
	return Object.values(payload()!)
}


type IndexedResult = {
	kebab: string
	camel: string
	title: string
} & { index?: number }

const searchResults = createRoot(() => {
	return (): undefined | IndexedResult[] => {
		if (!manifest()) { return } // Undefined

		const value = canonicalSearchValue()
		if (!value) {
			return payload()
		}
		const matches: IndexedResult[] = []
		for (const info of payloadValues()!) {
			const key = info.kebab
			const index = key.indexOf(value)
			if (index !== -1) {
				matches.push({
					...info,
					index,
				})
			}
		}
		if (matches.length) {
			matches.sort((a, b) => a.index! - b.index!)
			return matches
		} else {
			return // Undefined
		}
	}
})

//// createRoot(() => {
//// 	createEffect(() => {
//// 		if (!searchResults()) { return }
//// 		console.log(searchResults())
//// 	})
//// })

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
			<input class="component-search-bar" placeholder="I am looking for…" value={searchValue()} onInput={e => setSearchValue(e.currentTarget.value)} autofocus />
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
			.component-grid.is-empty {
				min-height: 75vh;
				//// display: grid;
				//// place-items: center;
			}
			.component-grid.is-not-empty {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--grid-cell-height), 1fr));
				gap: 1px;
				//// border-radius: calc((var(--grid-cell-height) * 2 / 3) / 3);
				//// // Decoration
				//// box-shadow: 0 0 0 4px var(--hairline-gray-color);
				//// //// // Behavior
				//// //// overflow: hidden;
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

			//// .component-grid-label-highlight {
			//// 	display: inline-block; // CSS reset
			//// }

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
			<div class="component-grid is-not-empty">
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
			<Show when={searchResults()} fallback={<>
				<div class="component-grid is-empty flex-col flex-center gap-8px">
					<div class="font-family:$sans color:$text-color">No results</div>
					<div class="px-24px h-48px rounded-$full background-color:hsl(0deg_0%_0%/15%) grid grid-center cursor:pointer" onClick={e => {
						setSearchValue("")
						const componentSearchBar = document.getElementsByClassName("component-search-bar")[0]! as HTMLElement
						componentSearchBar.focus()
					}} tabindex="0">
						<div class="font-family:$sans color:$text-color">Search for something else</div>
					</div>
				</div>
			</>}>
				<div class="component-grid is-not-empty">
					<For each={searchResults()}>
						{info => <>
							<div class="component-grid-cell" onClick={e => {
								const serialized = serialize(e.currentTarget.querySelector("svg")!)
								navigator.clipboard.writeText(serialized)
								setTextarea(serialized)
							}}>
								{/* @ts-expect-error */}
								<Dynamic component={icons()?.[info.title]} class="h-32px aspect-1 color:$text-color" />
								<div class="component-grid-label">
									{/* Guard undefined because info.index=0 is OK */}
									<Show when={info.index !== undefined} fallback={info.kebab}>
										<span data-a>{info.kebab.slice(0, info.index!)}</span>
										<span data-b class="component-grid-label-highlight">{canonicalSearchValue()}</span>
										<span data-c>{info.kebab.slice(info.index! + canonicalSearchValue().length)}</span>
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
		<div class="fixed inset-br-16px">
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
						<div class="button" onClick={e => setVersion(version)} tabindex="0">
							{version}
						</div>
					</>}
				</For>
				<hr class="hr" />
				<Show when={version() === "v1"}>
					<For each={["solid", "outline"] as Variant[]}>
						{variant => <>
							<div class="button" onClick={e => setVariant(variant)} tabindex="0">
								{variant}
							</div>
						</>}
					</For>
				</Show>
				<Show when={version() === "v2"}>
					<For each={["20/solid", "24/solid", "24/outline"] as Variant[]}>
						{variant => <>
							<div class="button" onClick={e => setVariant(variant)} tabindex="0">
								{variant}
							</div>
						</>}
					</For>
				</Show>
				<hr class="hr" />
				<textarea class="textarea" rows={textarea().split("\n").length} value={textarea()} placeholder="Click an element to inspect the HTML" onClick={e => {
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

render(() => <App />, document.getElementById("root")!)
