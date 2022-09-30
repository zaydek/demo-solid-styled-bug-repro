import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { render } from "solid-js/web"
import { createSignal, For } from "solid-js"
import { css } from "./solid-utils"
import { range } from "./utils"

function App() {
	const [value, setValue] = createSignal("")

	return <>
		{css`
			:root {
				// Layout
				--grid-cell-height: 128px;
				// Colors
				--card-color:             hsl(0deg 0% 100%);
				--hairline-gray-color:    hsl(0deg 0% 90%);
				--text-color:             hsl(0deg 0% 15%);
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
			}
		`}
		<div class="fixed inset-br-16px">
			{css`
				.component-modal-card {
					height: 192px;
					width: 512px;
					border-radius: 16px;
					background-color: var(--card-color);
					box-shadow: 0 0 0 4px var(--hairline-gray-color);
				}
			`}
			<div class="component-modal-card">
				{/* ... */}
			</div>
		</div>
		<div class="mx-auto py-($grid-cell-height/2) flex-col gap-32px w-100% max-w-1280px">
			{css`
				.component-search-bar {
					padding: 0 calc(var(--grid-cell-height) / 4);
					display: block; // CSS reset
					width: 100%;    // CSS reset
					height: calc(var(--grid-cell-height) / 2);
					border-radius: calc(var(--grid-cell-height) / 4);
					// Typography
					font: 400 18px / normal var(--sans);
					letter-spacing: calc(1em / 32);
					color: var(--text-color);
					// Decoration
					box-shadow: 0 0 0 4px var(--hairline-gray-color);
				}
				.component-search-bar::placeholder {
					color: var(--placeholder-text-color);
				}
			`}
			<input
				class="component-search-bar"
				placeholder="I am looking for…"
				value={value()}
				onInput={e => setValue(e.currentTarget.value)}
			/>
			{css`
				.component-grid {
					display: grid;
					grid-template-columns: repeat(
						auto-fill,
						minmax(var(--grid-cell-height), 1fr)
					);
					gap: 1px;
					border-radius: calc(var(--grid-cell-height) / 4);
					// Decoration
					box-shadow: 0 0 0 4px var(--hairline-gray-color);
					// Behavior
					overflow: hidden;
				}
				.component-grid-cell {
					outline: 1px solid var(--hairline-gray-color);
				}
			`}
			<div class="component-grid">
				<For each={range(200)}>
					{() => <>
						<div class="component-grid-cell grid grid-center aspect-1">
							<div class="h-32px aspect-1 rounded-$full background-color:red"></div>
						</div>
					</>}
				</For>
			</div>
		</div>
	</>
}

render(() => <>
		<App />
	</>,
	document.getElementById("root")!,
)
