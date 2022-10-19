import { Accessor, batch, createContext, createEffect, createSignal, DEV, JSX, onMount, ParentProps, Show, untrack, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { Portal } from "solid-js/web"
import { css, cx } from "./solid-utils"
import { stringify } from "./utils"

type Element = {
	open:           boolean
	collapseHeight: undefined | number
	height:         undefined | number
	translateY:     undefined | number // Computed
	transition:     undefined | boolean
}

type State = {
	elements:    Element[]
	boundingBox: Accessor<undefined | number> // Computed
	transition:  Accessor<undefined |boolean> // Computed
}

type Actions = {
	createElement: (data: { open: boolean }) => [number, Element]
	measure:       (index: number, data: { collapseHeight: number, height: number }) => void
  open:          (index: number) => void
  close:         (index: number) => void
  toggle:        (index: number) => void
  transitionend: (index: number) => void
}

export const DrawerContext = createContext<{
	state:   State
	actions: Actions
}>()

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

export function Drawer(props: ParentProps<{
	open?: boolean

	head: JSX.Element
}>) {
	const { state, actions } = useContext(DrawerContext)!

	const [ref, setRef] = createSignal<HTMLElement>()
	const [headRef, setHeadRef] = createSignal<HTMLElement>()

	const [index, element] = actions.createElement({ open: props.open ?? false })

	onMount(() => {
		actions.measure(index, {
			collapseHeight: headRef()!.scrollHeight,
			height: ref()!.scrollHeight,
		})
	})

	// Convenience accessor
	const elementIsClosed = () => {
		return state.elements.length > 0 &&
			!element.open &&
				(element.transition !== undefined && element.transition === false)
	}

	// Convenience accessor
	const elementHasTranslateY = () => {
		return state.elements.length > 0 &&
			element.translateY !== undefined
	}

	return <>
		<div
			ref={setRef}
			class={cx(`drawer ${element.open ? "is-open" : "is-closed"}`)}
			style={{
				// DEBUG
				"background-color": `hsl(${index * 60} 100% 75%)`,

				...(elementIsClosed() && {
					"height": `${element.collapseHeight!}px`,
					"overflow-y": "clip",
				}),
				...(elementHasTranslateY() && {
					"transform": `translateY(${element.translateY}px)`,
				}),
			}}
			onTransitionEnd={e => actions.transitionend(index)}
		>
			<div
				ref={setHeadRef}
				class="drawer-head"
				onClick={e => actions.toggle(index)}
				onKeyDown={e => {
					if (e.key === " ") {
						e.preventDefault()
						e.currentTarget.click()
					}
				}}
				tabIndex={0}
			>
				{props.head}
			</div>
			<div class="drawer-body">
				{props.children}
			</div>
		</div>
	</>
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function DEBUG_VIEW() {
	const { state } = useContext(DrawerContext)!

	return <>
		{css`
			.drawer-debug-card {
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
			.drawer-debug-typography {
				font: 400 12px / 1.25 Monaco;
				white-space: pre;
			}
		`}
		<Portal ref={el => el.className = "portal"}>
			<div class="drawer-debug-card">
				<div class="drawer-debug-typography">
					{stringify(state, 2)}
				</div>
			</div>
		</Portal>
	</>
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

export function DrawerProvider(props: ParentProps<{
	resizeStrategy?: "immediate" | "delayed"
}>) {
	const resizeStrategy = () => props.resizeStrategy ?? "delayed"

	const [elements, setElements] = createStore<Element[]>([])
	const [boundingBox, setBoundingBox] = createSignal<number>()

	const transition = () => {
		if (!elements.length) { return }
		return elements.some(el => el.transition)
	}

	// Creates (registers an element)
	function createElement(data: { open: boolean }) {
		const index = elements.length
		const el: Element = { // Instantiate element here for TypeScript (el: Element)
			open:           data.open,
			collapseHeight: undefined,
			height:         undefined,
			translateY:     undefined,
			transition:     undefined,
		}
		setElements(curr => [...curr, el])
		return [index, elements[index]] as [number, Element]
	}

	// Measures an element
	function measure(index: number, data: { collapseHeight: number, height: number }) {
		batch(() => {
			setElements(index, "collapseHeight", data.collapseHeight)
			setElements(index, "height", data.height)
		})
	}

	// Opens an element
	function open(index: number) {
		batch(() => {
			setElements(index, "open", true)
			setElements(index, "transition", true)
		})
	}

	// Closes an element
	function close(index: number) {
		batch(() => {
			setElements(index, "open", false)
			setElements(index, "transition", true)
		})
	}

	// Toggles an element (e.g. open or close)
	function toggle(index: number) {
		if (elements[index].open) {
			close(index)
		} else {
			open(index)
		}
	}

	// Signals "transitionend" for an element
	function transitionend(index: number) {
		setElements(index, "transition", false)
	}

	createEffect(() => {
		if (!elements.length) { return }
		batch(() => {
			let sum = 0
			for (let index = 0; index < elements.length; index++) {
				const el = untrack(() => elements[index])
				setElements(index, "translateY", sum)
				sum += el.open
					? el.height!         // TODO: Rename to minHeight
					: el.collapseHeight! // TODO: Rename to maxHeight
			}
			if (untrack(boundingBox) === undefined) {
				setBoundingBox(sum)
			} else {
				if (resizeStrategy() === "immediate") {
					setBoundingBox(sum)
				} else if (resizeStrategy() === "delayed") {
					if (sum > untrack(boundingBox)!) {
						setBoundingBox(sum)
					} else {
						createEffect(() => {
							if (transition()) { return }
							setBoundingBox(sum)
						})
					}
				}
			}
		})
	})

	const ready = () => {
		return elements.length > 0
	}

	return <>
		<DrawerContext.Provider value={{
			state: { elements, boundingBox, transition },
			actions: { createElement, measure, open, close, toggle, transitionend },
		}}>
			{css`
				.drawer-container {
					position: relative;
				}

				/******************************/

				.drawer {
					position: absolute;
					inset:
						auto /* T */
						0    /* R */
						auto /* B */
						0;   /* L */
				}

				/******************************/

				.drawer-end {
					position: absolute;
					z-index: 50;
					inset: 0 0 auto 0;
					height: 500px;
					background-color: purple;
				}
				:root.ready .drawer-end {
					transition: transform 1000ms cubic-bezier(0, 1, 0.25, 1);
				}

				/******************************/

				.drawer {
					cursor: pointer;
				}
				:root.ready .drawer {
					transition: transform 1000ms cubic-bezier(0, 1, 0.25, 1);
				}

				/******************************/

				:root.ready .drawer-body {
					transition: opacity 1000ms cubic-bezier(0, 1, 0.25, 1);
				}
				.drawer.is-closed .drawer-body { opacity: 0; }
				.drawer.is-open   .drawer-body { opacity: 1; }
			`}
			<div
				class="drawer-container"
				style={{
					...(ready() && {
						"height": `${boundingBox()!}px`,
						"overflow-y": transition()! ? "clip" : "auto",
					}),
				}}
			>
				{props.children}
				<Show when={ready()}>
					<div
						class="drawer-end"
						style={{
							"height": transition()! // Lazy but works
								? `${boundingBox()}px`
								: "0px",
							"transform": `translateY(${elements[elements.length - 1].translateY! + ( // Lazy but works
								elements[elements.length - 1].open
									? elements[elements.length - 1].height!
									: elements[elements.length - 1].collapseHeight!
							)}px)`,
						}}
					></div>
				</Show>
			</div>

			{/* DEBUG */}
			<Show when={DEV}>
				<DEBUG_VIEW />
			</Show>
		</DrawerContext.Provider>
	</>
}
