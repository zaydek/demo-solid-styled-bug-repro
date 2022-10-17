import "the-new-css-reset"
import "virtual:uno.css"
import "./1-base.css"
import "./2-vars.css"
import "./3-components.css"

//// import { useLocator } from "solid-devtools"
//// useLocator() // https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#3-import-the-script

import { createSignal, ParentProps, Setter } from "solid-js"
import { For, render, Show } from "solid-js/web"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { createMediaQuery } from "./effects"
import { css } from "./solid-utils"
import { echo, only, range } from "./utils"

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

// https://css-tricks.com/snippets/javascript/random-hex-color/
function randColor(floatSeed?: number) {
	return `#${Math.floor((floatSeed ?? Math.random()) * 16777215).toString(16)}`
}

const initialState = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
]

function Collapsible() {
	const [transforms, setTransforms] = createSignal(initialState)

	//// function toggleTab(index?: number) {
	//// 	if (index === undefined) {
	//// 		setTransforms(initialState)
	//// 		return
	//// 	}
	//// 	const next = [...initialState]
	//// 	const length = Object.keys(next).length
	//// 	while (index + 1 < length) {
	//// 		next[index + 1]++
	//// 		index++
	//// 	}
	//// 	setTransforms(next)
	//// }

	function _openTab(index: number) {
		const copy = [...transforms()]
		const length = Object.keys(copy).length
		index++ // Advance
		copy[index] = (index - 1 in copy) ? copy[index - 1] : 0
		for (index++; index < length; index++) {
			copy[index] = copy[index - 1] + 1
		}
		return copy
	}

	function _closeTab(index: number) {
		const copy = [...transforms()]
		const length = Object.keys(copy).length
		index++ // Advance
		copy[index] = copy[index - 1] + 1
		for (index++; index < length; index++) {
			copy[index] = copy[index - 1] + 1
		}
		return copy
	}

	function openTab(index: number) {
		setTransforms(echo(_openTab(index)))
	}

	function closeTab(index: number) {
		setTransforms(echo(_closeTab(index)))
	}

	//// function closeAllTabs() {
	//// 	setTransforms(initialState)
	//// }

	return <>
		{css`
			.edge-section {
				height: 64px;
			}
			.section {
				height: 64px;
			}
			.line {
				height: 4px;
				background-color: hsl(0 0% 75%);
			}

			.tab {
				height: 112px;
				transition: transform 500ms cubic-bezier(0, 1, 0.25, 1);

				cursor: pointer;
			}
			.tab.tab-0 {
				position: relative;
				z-index: 0;
				background-color: ${randColor(0.1)};
			}
			.tab.tab-1 {
				position: relative;
				z-index: 1;
				background-color: ${randColor(0.2)};
			}
			.tab.tab-2 {
				position: relative;
				z-index: 2;
				background-color: ${randColor(0.3)};
			}
			.tab.tab-3 {
				position: relative;
				z-index: 3;
				background-color: ${randColor(0.4)};
			}
			.tab.tab-4 {
				position: relative;
				z-index: 4;
				background-color: ${randColor(0.5)};
			}
			.tab.tab-5 {
				position: relative;
				z-index: 5;
				background-color: ${randColor(0.6)};
			}
			.tab.tab-6 {
				position: relative;
				z-index: 6;
				background-color: ${randColor(0.7)};
			}
			.tab.tab-7 {
				position: relative;
				z-index: 7;
				background-color: ${randColor(0.8)};
			}

			/* https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp */
			input[type=number]::-webkit-outer-spin-button,
			input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
			input[type=number] { -moz-appearance: textfield; }
		`}
		<div class="[flex-shrink:0]">
			<div class="edge-section"></div>
			<div class="line"></div>
		</div>
		<div class="[position:fixed] [z-index:10] [inset:auto_auto_16px_16px] [padding:16px] [width:224px] [border-radius:16px] [background-color:white] [box-shadow:0_0_0_4px_hsl(0_0%_0%_/_25%)]">
			<div class="[font:400_14px_/_1.25_Monaco] [white-space:pre] [display:flex] [flex-direction:column]">
				<div>[</div>
				<div class="[margin-left:2ch] [display:flex] [flex-direction:column]">
					<For each={range(8)}>{index => <>
						<div class="[display:flex] [flex-direction:row] [gap:8px]">
							<input
								class="[width:2ch] [text-align:end]"
								type="number"
								value={transforms()[index]}
								onInput={e => {
									setTransforms(curr => [
										...curr.slice(0, index),
										+e.currentTarget.value,
										...curr.slice(index + 1),
									])
								}}
							/>
							<div class="[margin-left:-8px]">,</div>
							<div class="[flex-grow:1]"></div>
							<div
								class="[width:2ch] [text-align:center]"
								onClick={e => {
									setTransforms(curr => [
										...curr.slice(0, index),
										curr[index] - 1,
										...curr.slice(index + 1),
									])
								}}
								onKeyDown={e => {
									if (e.key === " ") {
										e.preventDefault() // Prevent scrolling
										e.currentTarget.click()
									}
								}}
								tabIndex={0}
							>
								-
							</div>
							<div
								class="[width:2ch] [text-align:center]"
								onClick={e => {
									setTransforms(curr => [
										...curr.slice(0, index),
										curr[index] + 1,
										...curr.slice(index + 1),
									])
								}}
								onKeyDown={e => {
									if (e.key === " ") {
										e.preventDefault() // Prevent scrolling
										e.currentTarget.click()
									}
								}}
								tabIndex={0}
							>
								+
							</div>
						</div>
					</>}</For>
				</div>
				<div>]</div>
			</div>
		</div>
		<div class="[flex-grow:1] [overflow-y:auto]">
			<For each={range(8)}>{index => <>
				<div
					class={`tab tab-${index} [display:flex] [flex-direction:row] [gap:8px]`}
					style={{ "transform": `translateY(${88 * (-1 * transforms()[index])}px)` }}
				>
					<div>Hello, world!</div>
					<div class="[flex-grow:1]"></div>
					<div onClick={e => openTab(index)} tabIndex={0}>
						OPEN
					</div>
					<div onClick={e => closeTab(index)} tabIndex={0}>
						CLOSE
					</div>
				</div>
			</>}</For>
		</div>
		<div class="[flex-shrink:0]">
			<div class="line"></div>
			<div class="edge-section"></div>
		</div>
	</>
}

function App2() {
	return <>
		{css`
			.center {
				display: flex;
				flex-direction: row;
				justify-content: center;
			}
			.sidebar {
				height: var(--screen-y);
				width: 448px;
				background-color: whitesmoke;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
		`}
		<div class="center">
			<div class="sidebar [display:flex] [flex-direction:column]">
				<Collapsible />
			</div>
		</div>
	</>
}

render(() => <>
	<App2 />
</>, document.getElementById("root")!)
