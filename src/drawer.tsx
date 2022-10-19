import { Accessor, batch, createContext, createEffect, createSignal, JSX, onMount, ParentProps, untrack, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { createReady } from "./effects"
import { css, cx } from "./solid-utils"
import { round } from "./utils"

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
	measure:       (index: number, data: { minHeight: number, maxHeight: number }) => void
  open:          (index: number) => void
  close:         (index: number) => void
  toggle:        (index: number) => void
  transitionend: (index: number) => void
}

// Exported for debugging purposes
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
			minHeight: headRef()!.scrollHeight,
			maxHeight: ref()!.scrollHeight,
		})
	})

	return <>
		<div
			ref={setRef}
			class={cx(`drawer ${element.open ? "is-open" : "is-closed"}`)}
			style={{
				// DEBUG
				"background-color": `hsl(${index * 60} 100% 75%)`,

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

//// function DEBUG_VIEW() {
//// 	const { state } = useContext(DrawerContext)!
////
//// 	return <>
//// 		{css`
//// 			.drawer-debug-card {
//// 				position: fixed;
//// 				z-index: 100;
//// 				inset:
//// 					16px  /* T */
//// 					16px  /* R */
//// 					16px  /* B */
//// 					auto; /* L */
//// 				/* LAYOUT */
//// 				padding: 16px;
//// 				max-height: calc(var(--screen-y) - 16px * 2);
//// 				overflow-y: auto;
//// 				width: 320px;
//// 				border-radius: 16px;
//// 				/* DECORATION */
//// 				background-color: white;
//// 				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
//// 			}
//// 			.drawer-debug-typography {
//// 				font: 400 12px / 1.25 Monaco;
//// 				white-space: pre;
//// 			}
//// 		`}
//// 		<Portal ref={el => el.className = "portal"}>
//// 			<div class="drawer-debug-card">
//// 				<div class="drawer-debug-typography">
//// 					{stringify(state, 2)}
//// 				</div>
//// 			</div>
//// 		</Portal>
//// 	</>
//// }

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

createReady()

export function DrawerProvider(props: ParentProps<{
	//// resizeStrategy?: "immediate" | "delayed"
}>) {
	//// const resizeStrategy = () => props.resizeStrategy ?? "delayed"

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

	// Measures an element
	function measure(index: number, data: { minHeight: number, maxHeight: number }) {
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

				/* TODO: This should be implemented in userland */
				.drawer-mask {
					position: absolute;
					z-index: 50;
					inset: 0 0 auto 0;
					/* Defer height and overflow-y to inline styles */
					background-color: white;
				}
				:root.ready .drawer-mask {
					transition: transform 300ms cubic-bezier(0, 1, 0.25, 1);
				}

				/******************************/

				/* TODO: This should be implemented in userland */
				.drawer {
					cursor: pointer;
				}
				:root.ready .drawer {
					transition: transform 300ms cubic-bezier(0, 1, 0.25, 1);
				}

				/******************************/

				/* TODO: This should be implemented in userland */
				:root.ready .drawer-body {
					transition: opacity 300ms cubic-bezier(0, 1, 0.25, 1);
				}
				.drawer.is-closed .drawer-body { opacity: 0; }
				.drawer.is-open   .drawer-body { opacity: 1; }
			`}
			<div
				class="drawer-container"
				style={{
					...(ready() && {
						"height": `${boundingBox()}px`,
						"overflow-y": "auto",
					}),
				}}
				//// // @ts-expect-error
				//// inert={only(ready() && transition())}
			>
				{props.children}
				{/* <Show when={ready()}>
					<div
						class="drawer-mask"
						style={{
							// Lazy but works
							"height": transition()
								? `${boundingBox()}px`
								: "0px",
							// Lazy but works
							"transform": `translateY(${elements[elements.length - 1].translate! + (
								elements[elements.length - 1].open
									? elements[elements.length - 1].maxHeight!
									: elements[elements.length - 1].minHeight!
							)}px)`,
						}}
					></div>
				</Show> */}
			</div>

			{/* DEBUG */}
			{/* <Show when={DEV}>
				<DEBUG_VIEW />
			</Show> */}
		</DrawerContext.Provider>
	</>
}
