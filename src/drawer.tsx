import { Accessor, batch, createContext, createEffect, createSignal, JSX, onMount, ParentProps, untrack, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { createMounted, css } from "./utils/solid"
import { cx, only, round } from "./utils/vanilla"

type Element = {
	open:       boolean
	minHeight:  undefined | number // Computed
	maxHeight:  undefined | number // Computed
	translate:  undefined | number // Computed
	transition: undefined | boolean
}

type State = {
	ready:       Accessor<boolean>
	elements:    Element[]
	boundingBox: Accessor<undefined | number> // Computed
	transition:  Accessor<undefined |boolean> // Computed
}

type Actions = {
	createElement: (data: { open: boolean }) => [number, Element]
	measureDOM:    (index: number, data: { minHeight: number, maxHeight: number }) => void
  open:          (index: number) => void
  close:         (index: number) => void
  toggle:        (index: number) => void
  transitionend: (index: number) => void
}

////////////////////////////////////////

const DrawerContext = createContext<{
	state:   State
	actions: Actions
}>()

export function Drawer(props: ParentProps<{
	open?: boolean

	head: JSX.Element
}>) {
	const { state, actions } = useContext(DrawerContext)!

	const [ref, setRef] = createSignal<HTMLElement>()
	const [headRef, setHeadRef] = createSignal<HTMLElement>()

	const [index, element] = actions.createElement({ open: props.open ?? false })

	onMount(() => {
		actions.measureDOM(index, {
			minHeight: headRef()!.scrollHeight,
			maxHeight: ref()!.scrollHeight,
		})
	})

	return <>
		<div
			ref={setRef}
			class={cx(`drawer ${element.open ? "open" : "closed"}`)}
			style={{
				//// // DEBUG
				//// "background-color": `hsl(${index * 60} 100% 75%)`,
				"background-color": "white",

				...(state.ready() && !element.open && !element.transition && {
					"height": `${element.minHeight!}px`,
					"overflow-y": "clip",
				}),
				...(state.ready() && element.translate && {
					"transform": `translateY(${element.translate}px)`,
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
			<div
				class="drawer-body"
				// @ts-expect-error
				inert={only(!element.open)}
			>
				{props.children}
			</div>
		</div>
	</>
}

////////////////////////////////////////

createMounted()

export function DrawerContainer(props: ParentProps<{
	//// resizeStrategy?: "immediate" | "delayed"
}>) {
	//// const resizeStrategy = () => props.resizeStrategy ?? "delayed"

	// TODO: Rename to mounted?
	const ready = () => elements.length > 0

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
			open:       data.open,
			minHeight:  undefined, // Defer initialization
			maxHeight:  undefined, // Defer initialization
			translate:  undefined, // Defer initialization
			transition: undefined, // Defer initialization
		}
		setElements(curr => [...curr, el])
		return [index, elements[index]] as [number, Element]
	}

	// Measures DOM elements
	function measureDOM(index: number, data: { minHeight: number, maxHeight: number }) {
		batch(() => {
			setElements(index, "minHeight", round(data.minHeight))
			setElements(index, "maxHeight", round(data.maxHeight))
		})
	}

	// Opens an element
	function open(index: number) {
		batch(() => {
			setElements(index, "open", true)
			setElements(index, "transition", true) // Kick off transition
		})
	}

	// Closes an element
	function close(index: number) {
		batch(() => {
			setElements(index, "open", false)
			setElements(index, "transition", true) // Kick off transition
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

	// Signals "transitionend"
	function transitionend(index: number) {
		setElements(index, "transition", false)
	}

	createEffect(() => {
		if (!elements.length) { return }
		batch(() => {
			let sum = 0
			for (let index = 0; index < elements.length; index++) {
				const el = untrack(() => elements[index])
				setElements(index, "translate", sum)
				sum += el.open
					? el.maxHeight!
					: el.minHeight!
			}
			setBoundingBox(sum)
			//// if (!untrack(boundingBox)) {
			//// 	setBoundingBox(sum)
			//// } else {
			//// 	if (resizeStrategy() === "immediate") {
			//// 		setBoundingBox(sum)
			//// 	} else if (resizeStrategy() === "delayed") {
			//// 		if (sum > untrack(boundingBox)!) {
			//// 			setBoundingBox(sum)
			//// 		} else {
			//// 			createEffect(() => {
			//// 				if (transition()) { return }
			//// 				setBoundingBox(sum)
			//// 			})
			//// 		}
			//// 	}
			//// }
		})
	})

	return <>
		<DrawerContext.Provider value={{
			state: { ready, elements, boundingBox, transition },
			actions: { createElement, measureDOM, open, close, toggle, transitionend },
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
				/* TODO: This should be implemented in userland */
				:root.mounted .drawer {
					transition: transform 300ms cubic-bezier(0, 1, 0.25, 1.1);
				}

				/******************************/

				.drawer-head {
					cursor: pointer;
				}

				/******************************/

				/* TODO: This should be implemented in userland */
				:root.mounted .drawer-body {
					transition: opacity 300ms cubic-bezier(0, 1, 0.25, 1.1);
				}
				.drawer.closed .drawer-body { opacity: 0; }
				.drawer.open   .drawer-body { opacity: 1; }
			`}
			<div
				class="drawer-container"
				style={{
					...(ready() && {
						"height": `${boundingBox()}px`,
						"overflow-y": "auto",
					}),
				}}
			>
				{props.children}
			</div>
		</DrawerContext.Provider>
	</>
}
