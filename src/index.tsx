import "the-new-css-reset"

import "./1-base.css"
import "./2-vars.css"
import "./3-components.css"
import "./uno.generated.css"

import { createRoot, createSignal, onMount, ParentProps, Setter } from "solid-js"
import { For, render, Show } from "solid-js/web"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { Drawer, DrawerProvider } from "./drawer"
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
					{/* <For each={range(40)}>{() => <>
						<section class="[padding:16px]">
							<div>Hello, world!</div>
						</section>
						<hr class="line" />
					</>}</For> */}
					<DrawerProvider collapseHeight={32}>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
					</DrawerProvider>
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

	// Internal
	function _openTab(index: number) {
		const copy = [...transforms()]
		for (index++; index < copy.length; index++) {
			if (
				index - 1 >= 0 &&                   // Bounds check
				copy[index] - copy[index - 1] === 0 // The current element is already equal
			) { break }
			copy[index]--
		}
		return copy
	}

	// Internal
	function _closeTab(index: number) {
		const copy = [...transforms()]
		for (index++; index < copy.length; index++) {
			if (
				index - 1 >= 0 &&                   // Bounds check
				copy[index] - copy[index - 1] === 1 // The current element is already incremented
			) { break }
			copy[index]++
		}
		return copy
	}

	function openTab(index: number) {
		setTransforms(_openTab(index))
	}

	function closeTab(index: number) {
		setTransforms(_closeTab(index))
	}

	function isOpen(index: number) {
		return index + 1 < transforms().length && transforms()[index + 1] === transforms()[index]
	}

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
				transition: transform 300ms cubic-bezier(0, 1, 0.25, 1.15);

				cursor: pointer;
			}
			.tab.tab-0 { background-color: hsl(  0 100% 75%); }
			.tab.tab-1 { background-color: hsl( 45 100% 75%); }
			.tab.tab-2 { background-color: hsl( 90 100% 75%); }
			.tab.tab-3 { background-color: hsl(135 100% 75%); }
			.tab.tab-4 { background-color: hsl(180 100% 75%); }
			.tab.tab-5 { background-color: hsl(225 100% 75%); }
			.tab.tab-6 { background-color: hsl(270 100% 75%); }
			.tab.tab-7 { background-color: hsl(315 100% 75%); }
			.tab.tab-8 { background-color: whitesmoke; }
		`}
		{/* <div class="[flex-shrink:0]">
			<div class="edge-section"></div>
			<div class="line"></div>
		</div> */}
		<div class="[flex-grow:1] [overflow-y:auto]">
			<For each={range(9)}>{index => <>
				<div
					class={`tab tab-${index}`}
					style={{ "transform": `translateY(${88 * (-1 * transforms()[index])}px)` }}
				>
					<div
						class="[height:24px]"
						onClick={e => {
							if (isOpen(index)) {
								closeTab(index)
							} else {
								openTab(index)
							}
						}}
						onKeyDown={e => {
							if (e.key === " ") {
								e.preventDefault() // Prevent scrolling
								e.currentTarget.click()
							}
						}}
						tabIndex={0}
					>
						Hello, world!
					</div>
				</div>
			</>}</For>
		</div>
		{/* <div class="[flex-shrink:0]">
			<div class="line"></div>
			<div class="edge-section"></div>
		</div> */}
	</>
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

createRoot(() => {
	onMount(() => setTimeout(() => {
		document.documentElement.classList.add("ready")
	}))
})

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
				/* overflow-y: auto; */
				width: 368px;
				background-color: whitesmoke;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
		`}
		<div class="center">
			<div class="sidebar [display:flex] [flex-direction:column]">
				<DrawerProvider /* resizeStrategy="immediate" */>
					<Drawer head={<>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
					</>}>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
					</Drawer>
					<Drawer head={<>Hello, world!</>}>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
					</Drawer>
					<Drawer head={<>Hello, world!</>}>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
					</Drawer>
					<Drawer head={<>Hello, world!</>}>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
					</Drawer>
					<Drawer head={<>Hello, world!</>}>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
					</Drawer>
					<Drawer head={<>Hello, world!</>}>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
					</Drawer>
					<Drawer head={<>Hello, world!</>}>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
						<div>🤔🤔🤔🤔🤔🤔🤔</div>
					</Drawer>
				</DrawerProvider>
			</div>
		</div>
	</>
}

render(() => <>
	<App2 />
</>, document.getElementById("root")!)
