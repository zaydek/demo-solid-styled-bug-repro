import { Accessor, batch, createContext, createEffect, createSignal, DEV, JSX, onMount, ParentProps, Show, untrack, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { Portal } from "solid-js/web"
import { css, cx } from "./solid-utils"
import { stringify } from "./utils"

type Element = {
	height:     number
	open:       boolean
	transition: boolean
	computed: {
		translateY: number
		clipHeight: number
	}
}

type State = {
	collapseHeight: Accessor<number>
	elements:       Element[]
	boundingBox:    Accessor<undefined | number>
	maskTransition: Accessor<boolean>
}

type Actions = {
	createElement: (_: { height: number, open: boolean }) => number
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
		<div
			ref={setRef}
			class={element() === undefined
				? "drawer"
				: cx(`drawer ${element()!.open ? "is-open" : "is-closed"}`)
			}
			style={{
				...(element() && {
					// DEBUG
					"background-color": `hsl(${index()! * 60} 100% 75%)`,

					...(!element()!.transition && {
						"height": `${element()!.computed.clipHeight}px`,
						"overflow-y": "clip",
					}),
					"transform": `translateY(${element()!.computed.translateY}px)`,
				}),
			}}
			onTransitionEnd={e => actions.transitionend(index()!)}
		>
			<div
				class="drawer-head"
				onClick={e => actions.toggle(index()!)}
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

export function DrawerProvider(props: ParentProps<{ collapseHeight: number }>) {
	const collapseHeight = () => props.collapseHeight

	const [elements, setElements] = createStore<Element[]>([])
	const [boundingBox, setBoundingBox] = createSignal<number>()
	const [maskTransition, setMaskTransition] = createSignal(false)

	function createElement({ height, open }: { height: number, open: boolean }) {
		const index = elements.length
		setElements(curr => [
			...curr, {
				height,
				open,
				transition: false,
				computed: {
					translateY: 0, // Defer initialization; TODO: Shouldn’t this be undefined?
					clipHeight: 0, // Defer initialization; TODO: Shouldn’t this be undefined?
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
				transition: true,
			}))
			setMaskTransition(true)
		})
	}

	function close(index: number) {
		batch(() => {
			setElements(index, curr => ({
				...curr,
				open: false,
				transition: true,
			}))
			setMaskTransition(true)
		})
	}

	function transitionend(index: number) {
		setElements(index, "transition", false)
	}

	function toggle(index: number) {
		if (elements[index].open) {
			close(index)
		} else {
			open(index)
		}
	}

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
			// Now that we know the bounding box for all elements, compute the
			// clipHeight per element
			for (let index = 0; index < elements.length; index++) {
				setElements(index, "computed", curr => ({
					...curr,
					clipHeight: _boundingBox - curr.translateY,
				}))
			}
			if (untrack(boundingBox) === undefined) { // Initialize
				setBoundingBox(_boundingBox)
			} else {
				if (_boundingBox > untrack(boundingBox)!) {
					setBoundingBox(_boundingBox) // Synchronous
				} else {
					createEffect(() => { // Asynchronous
						if (maskTransition()) { return }
						setBoundingBox(_boundingBox)
					})
				}
			}
		})
	})

	return <>
		<DrawerContext.Provider value={{
			state: { collapseHeight, elements, boundingBox,  maskTransition },
			actions: { createElement, open, close, toggle, transitionend },
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
				:root:has(body.ready) .drawer-end {
					transition: transform 1000ms cubic-bezier(0, 1, 0.25, 1);
				}

				/******************************/

				.drawer {
					cursor: pointer;
				}
				:root:has(body.ready) .drawer {
					transition: transform 1000ms cubic-bezier(0, 1, 0.25, 1);
				}

				/******************************/

				.drawer-head {
					height: 32px;
				}

				/******************************/

				:root:has(body.ready) .drawer-body {
					transition: opacity 1000ms cubic-bezier(0, 1, 0.25, 1);
				}
				.drawer.is-closed .drawer-body { opacity: 0; }
				.drawer.is-open   .drawer-body { opacity: 1; }
			`}
			<div
				class="drawer-container"
				style={{
					...((boundingBox() !== undefined && maskTransition() !== undefined) && {
						"height": `${boundingBox()!}px`,
						"overflow-y": maskTransition()
							? "clip"
							: "auto",
					}),
				}}
			>
				{props.children}
				<Show when={elements.length > 0}>
					<div
						class="drawer-end"
						style={{
							"height": maskTransition()
								? `${boundingBox()}px` // Lazy but works
								: "0px",
							"transform": `translateY(${elements[elements.length - 1].computed.translateY + (
								elements[elements.length - 1].open
									? elements[elements.length - 1].height
									: collapseHeight()
							)}px)`,
						}}
						onTransitionEnd={e => setMaskTransition(false)}
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
