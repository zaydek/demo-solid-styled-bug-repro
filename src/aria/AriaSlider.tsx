import { Accessor, batch, createContext, createSignal, FlowProps, JSX, onCleanup, onMount, ParentProps, Setter, useContext } from "solid-js"
import { Dynamic } from "solid-js/web"
import { createRef, omitProps } from "../solid-utils"
import { CSSProps, DynamicProps } from "../solid-utils/extra-types"
import { styleGlobalCursor, unstyleGlobalCursor } from "../utils"
import { bound, round } from "../utils/precision"

type Actions = {
	setTrackRect: Setter<DOMRect>
	setThumbRect: Setter<DOMRect>
}

export const SliderContext = createContext<{
	state:   {} // No-op
	actions: Actions
}>()

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function AriaSliderThumb(props: ParentProps<DynamicProps & CSSProps>) {
	const slider = useContext(SliderContext)!

	const [ref, setRef] = createRef()

	onMount(() => {
		function handleResize() {
			slider.actions.setThumbRect(ref()!.getBoundingClientRect())
		}
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => window.addEventListener("resize", handleResize, false))

		// Add an observer as a fallback
		const observer = new ResizeObserver(handleResize)
		observer.observe(ref()!)
		onCleanup(observer.disconnect)
	})

	return <>
		<Dynamic
			// Destructure props
			{...omitProps(props, ["as"])}
			// Component
			component={props.as ?? "div"}
			ref={(el: HTMLElement) => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
		>
			{props.children}
		</Dynamic>
	</>
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function AriaSliderTrack(props: ParentProps<DynamicProps & CSSProps>) {
	const slider = useContext(SliderContext)!

	const [ref, setRef] = createRef()

	onMount(() => {
		function handleResize() {
			slider.actions.setTrackRect(ref()!.getBoundingClientRect())
		}
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => window.addEventListener("resize", handleResize, false))

		// Add an observer as a fallback
		const observer = new ResizeObserver(handleResize)
		observer.observe(ref()!)
		onCleanup(observer.disconnect)
	})

	return <>
		<Dynamic
			// Destructure props
			{...omitProps(props, ["as"])}
			// Component
			component={props.as ?? "div"}
			ref={(el: HTMLElement) => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
		>
			{props.children}
		</Dynamic>
	</>
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function AriaHorizontalSlider(props: FlowProps<DynamicProps & CSSProps & {
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}, ({ float, translateX }: { float: Accessor<number>, translateX: Accessor<undefined | number> }) => JSX.Element>) {
	const [ref, setRef] = createRef()
	const [trackClientRect, setTrackClientRect] = createSignal<DOMRect>()
	const [thumbClientRect, setThumbClientRect] = createSignal<DOMRect>()

	function normalize(value: number) {
		const rounded = round(value)
		const bounded = bound(rounded, { min: props.min, max: props.max })
		props.setValue(bounded)
	}
	normalize(props.value) // Synchronously normalize

	function normalizeClientX(clientX: number) {
		const trackX = trackClientRect()!.x
		const trackW = trackClientRect()!.width
		const float = (clientX - trackX) / trackW // Get float from measurements
		const value = float * (props.max - props.min) + props.min
		normalize(value - value % props.step)
	}

	const decrement    = () => normalize(props.value - props.step)
	const decrementAll = () => normalize(props.min)
	const increment    = () => normalize(props.value + props.step)
	const incrementAll = () => normalize(props.max)

	const float = () => (props.value - props.min) / (props.max - props.min) // Get float from values

	const translateX = () => {
		if (!trackClientRect() || !thumbClientRect()) { return }
		const trackW = trackClientRect()!.width
		const thumbW = thumbClientRect()!.width
		return (float() * trackW) - (thumbW / 2)
	}

	let pointerDown = false
	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (e.button !== 0 || !e.composedPath().includes(ref()!)) { return }
			// COMPAT/Safari: Click-dragging toggles "cursor: text;"
			e.preventDefault()
			styleGlobalCursor("grab", () => pointerDown = true)
			normalizeClientX(e.clientX)
		}
		document.addEventListener("pointerdown", handlePointerDown, false)
		onCleanup(() => document.addEventListener("pointerdown", handlePointerDown, false))

		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown) { return }
			normalizeClientX(e.clientX)
		}
		document.addEventListener("pointermove", handlePointerMove, false)
		onCleanup(() => document.addEventListener("pointermove", handlePointerMove, false))

		// Release condition
		function handlePointerUp(e: PointerEvent) {
			unstyleGlobalCursor(() => pointerDown = false)
		}
		document.addEventListener("pointerup", handlePointerUp, false)
		onCleanup(() => document.addEventListener("pointerup", handlePointerUp, false))

		// Release condition
		document.addEventListener("pointerleave", handlePointerUp, false)
		onCleanup(() => document.addEventListener("pointerleave", handlePointerUp, false))
	})

	return <>
		<SliderContext.Provider
			value={{
				state: {}, // No-op
				actions: { setTrackRect: setTrackClientRect, setThumbRect: setThumbClientRect },
			}}
		>
			<Dynamic
				// Destructure props
				{...omitProps(props, ["as", "value", "setValue", "min", "max", "step"])}
				// Component
				component={props.as ?? "div"}
				ref={(el: HTMLElement) => {
					batch(() => {
						props.ref?.(el)
						setRef(el)
					})
				}}
				// Handlers
				onKeyDown={(e: KeyboardEvent) => {
					if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "PageDown") {
						e.preventDefault()
						decrement()
					} else if (e.key === "Home") {
						e.preventDefault()
						decrementAll()
					} else if (e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "PageUp") {
						e.preventDefault()
						increment()
					} else if (e.key === "End") {
						e.preventDefault()
						incrementAll()
					}
				}}
				// Accessibility
				role="slider"
				aria-valuenow={props.value}
				aria-valuemin={props.min}
				aria-valuemax={props.max}
				tabindex="0"
			>
				{props.children({ float, translateX })}
			</Dynamic>
		</SliderContext.Provider>
	</>
}
