import "the-new-css-reset"

import "./1-base.css"
import "./2-vars.css"
import "./3-components.css"
import "./uno.generated.css"

import { batch, createContext, createEffect, createRoot, createSignal, onMount, ParentProps, Setter, untrack, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { For, render, Show } from "solid-js/web"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { createMediaQuery } from "./effects"
import { css } from "./solid-utils"
import { only, range, stringify } from "./utils"

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
		document.body.classList.add("ready")
	}))
})

type Element = {
	height: number
	open:   boolean
	computed: {
		translateY: number
	}
}

type State = {
	collapseHeight: () => number
	elements:       Element[]
	boundingBox:    () => undefined | number
	transition:     () => boolean
}

type Actions = {
	createElement: (_: { height: number, open: boolean }) => number
  open:          (index: number) => void
  close:         (index: number) => void
  toggle:        (index: number) => void
  transitionEnd: () => void
}

export const PanelContext = createContext<{
	state:   State
	actions: Actions
}>()

function PanelProvider(props: ParentProps<{ collapseHeight: number }>) {
	const collapseHeight = () => props.collapseHeight

	const [elements, setElements] = createStore<Element[]>([])
	const [boundingBox, setBoundingBox] = createSignal<number>()
	const [transition, setTransition] = createSignal(false)

	function createElement({ height, open }: { height: number, open: boolean }) {
		const index = elements.length
		setElements(curr => [
			...curr, {
				height,
				open,
				computed: {
					translateY: 0,
				},
			},
		])
		return index
	}

	function open(index: number) {
		batch(() => {
			setElements(index, curr => ({
				...curr,
				open: true,
			}))
			//// if (index !== elements.length - 1) {
			setTransition(true)
			//// }
		})
	}

	function close(index: number) {
		batch(() => {
			setElements(index, curr => ({
				...curr,
				open: false,
			}))
			//// if (index !== elements.length - 1) {
			setTransition(true)
			//// }
		})
	}

	function toggle(index: number) {
		if (elements[index].open) {
			close(index)
		} else {
			open(index)
		}
	}

	function transitionEnd() {
		setTransition(false)
	}

	// Synchronize computed.transition and boundingBox
	createEffect(() => {
		if (!elements.length) { return }

		batch(() => {
			let _boundingBox = 0
			for (let index = 0; index < elements.length; index++) {
				const element = elements[index]
				setElements(index, "computed", "translateY", _boundingBox)
				_boundingBox += element.open
					? element.height
					: collapseHeight()
			}
			//// setBoundingBox(_boundingBox)
			if (untrack(boundingBox) === undefined) {
				setBoundingBox(_boundingBox)
			} else {
				if (_boundingBox > untrack(boundingBox)!) {
					setBoundingBox(_boundingBox) // Synchronous
				} else {
					createEffect(() => { // Asynchronous
						if (transition()) { return }
						setBoundingBox(_boundingBox)
					})
				}
			}
		})
	})

	return <>
		{css`
			.debug-panel {
				position: fixed;
				z-index: 10;
				inset: auto auto 16px 16px;
				/* LAYOUT */
				padding: 16px;
				max-height: calc(var(--screen-y) - 16px * 2);
				overflow-y: auto;
				width: 320px;
				border-radius: 16px;
				/* DECORATION */
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
			.debug-panel-typography {
				font: 400 12px / 1.25 Monaco;
				white-space: pre;
			}
		`}
		{/* DEBUG */}
		{/* <div class="debug-panel">
			<div class="debug-panel-typography">
				{stringify({ collapseHeight, elements, boundingBox, transition }, 2)}
			</div>
		</div> */}
		<PanelContext.Provider value={{
			state: { collapseHeight, elements, boundingBox, transition },
			actions: { createElement, open, close, toggle, transitionEnd },
		}}>
			{css`
				.panel-container { position: relative; }
				.panel {
					position: absolute;
					inset:
						auto /* T */
						0    /* R */
						auto /* B */
						0;   /* L */
				}
			`}
			<div
				class="panel-container"
				style={{
					...(boundingBox() && {
						"height": `${boundingBox()!}px`,
						// Disable scrolling on transition
						"overflow-y": transition() ? "clip" : "auto",
					}),
					// DEBUG
					"outline": "8px solid red",
				}}
			>
				{props.children}
				{css`
					.panel-end {
						position: absolute;
						z-index: 50;
						inset: 0 0 auto 0;
						height: 500px;
						background-color: purple;
					}
					:root:has(body.ready) .panel-end {
						transition: transform 1000ms cubic-bezier(0, 1, 0.25, 1);
					}
				`}
				{/* <Show when={transition()}> */}
					<div
						class="panel-end"
						style={{
							...(elements.length > 0 && {
								"transform": `translateY(${elements[elements.length - 1].computed.translateY + (
									elements[elements.length - 1].open
										? elements[elements.length - 1].height
										: collapseHeight()
								)}px)`,
							}),
						}}
						onTransitionEnd={transitionEnd}
					></div>
				{/* </Show> */}
			</div>
		</PanelContext.Provider>
	</>
}

function Panel(props: ParentProps<{ open?: boolean }>) {
	const { state, actions } = useContext(PanelContext)!

	const [ref, setRef] = createSignal<HTMLElement>()
	const [index, setIndex] = createSignal<number>()

	const element = () => {
		if (index() === undefined) { return }
		return state.elements[index()!]
	}

	onMount(() => {
		const height = ref()!.clientHeight
		const open = props.open ?? false
		setIndex(actions.createElement({ height, open }))
	})

	return <>
		{css`
			.panel {
				cursor: pointer;
			}
			:root:has(body.ready) .panel {
				transition: transform 1000ms cubic-bezier(0, 1, 0.25, 1);
			}
		`}
		<div
			ref={setRef}
			class="panel"
			style={{
				...(element() && {
					// DEBUG
					"background-color": `hsl(${index()! * 60} 100% 75%)`,

					// Only clip the current element during non-transitions. This prevents
					// the panel from scrolling "offscreen" content.
					...(!state.transition() && {
						"height": element()!.open
							? `${element()!.height}px`
							: `${state.collapseHeight()}px`,
						"overflow-y": "clip",
					}),
					"transform": `translateY(${element()!.computed.translateY}px)`,
				}),
			}}
			onClick={e => actions.toggle(index()!)}
			onKeyDown={e => {
				if (e.key === " ") {
					e.preventDefault()
					e.currentTarget.click()
				}
			}}
			onTransitionEnd={actions.transitionEnd}
			tabIndex={0}
		>
			{props.children}
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
				/* overflow-y: auto; */
				width: 368px;
				background-color: whitesmoke;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
		`}
		<div class="center">
			<div class="sidebar [display:flex] [flex-direction:column]">
				<PanelProvider collapseHeight={24}>
					<Panel>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
					</Panel>
					<Panel>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
					</Panel>
					<Panel>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
					</Panel>
					<Panel>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
					</Panel>
					<Panel>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
					</Panel>
					<Panel>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
					</Panel>
					<Panel>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
						<div class="[height:24px]">Hello, world!</div>
					</Panel>
				</PanelProvider>
			</div>
		</div>
	</>
}

render(() => <>
	<App2 />
</>, document.getElementById("root")!)
