import { Accessor, batch, createContext, createSignal, FlowProps, JSX, onCleanup, onMount, ParentProps, Setter, useContext } from "solid-js"
import { omitProps } from "solid-use"
import { createRef } from "../solid-utils"
import { CSSProps, RefProps } from "../solid-utils/extra-types"
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

export function AriaSliderThumb(props: ParentProps<RefProps & CSSProps>) {
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
		<div
			{...props}
			// Ref
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
		>
			{props.children}
		</div>
	</>
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function AriaSliderTrack(props: ParentProps<RefProps & CSSProps>) {
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
		<div
			{...props}
			// Ref
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
		>
			{props.children}
		</div>
	</>
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function AriaHorizontalSlider(props: FlowProps<RefProps & CSSProps & {
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}, ({ float, translateX }: { float: Accessor<number>, translateX: Accessor<undefined | number> }) => JSX.Element>) {
	const [ref, setRef] = createRef()
	const [trackRect, setTrackRect] = createSignal<DOMRect>()
	const [thumbRect, setThumbRect] = createSignal<DOMRect>()

	function normalize(value: number) {
		const rounded = round(value)
		const bounded = bound(rounded, { min: props.min, max: props.max })
		props.setValue(bounded)
	}
	normalize(props.value) // Synchronously normalize

	function normalizeClientX(clientX: number) {
		const track_x = trackRect()!.x
		const track_w = trackRect()!.width
		const float = (clientX - track_x) / track_w // Get float from measurements
		const value = float * (props.max - props.min) + props.min
		normalize(value - value % props.step)
	}

	const decrement    = () => normalize(props.value - props.step)
	const decrementAll = () => normalize(props.min)
	const increment    = () => normalize(props.value + props.step)
	const incrementAll = () => normalize(props.max)

	const float = () => (props.value - props.min) / (props.max - props.min) // Get float from values

	const translateX = () => {
		if (!trackRect() || !thumbRect()) { return }
		const track_w = trackRect()!.width
		const thumb_w = thumbRect()!.width
		return (float() * track_w) - (thumb_w / 2)
	}

	let isPointerDown = false
	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (e.button !== 0 || !e.composedPath().includes(ref()!)) { return }
			isPointerDown = true
			normalizeClientX(e.clientX)
		}
		document.addEventListener("pointerdown", handlePointerDown, false)
		onCleanup(() => document.addEventListener("pointerdown", handlePointerDown, false))
	})

	onMount(() => {
		function handlePointerMove(e: PointerEvent) {
			if (!isPointerDown) { return }
			normalizeClientX(e.clientX)
		}
		document.addEventListener("pointermove", handlePointerMove, false)
		onCleanup(() => document.addEventListener("pointermove", handlePointerMove, false))
	})

	onMount(() => {
		function handlePointerUp(e: PointerEvent) {
			isPointerDown = false
		}
		document.addEventListener("pointerup", handlePointerUp, false)
		onCleanup(() => document.addEventListener("pointerup", handlePointerUp, false))
	})

	return <>
		<SliderContext.Provider
			value={{
				state: {}, // No-op
				actions: { setTrackRect, setThumbRect },
			}}
		>
			<div
				// Props
				{...omitProps(props, ["value", "setValue", "min", "max", "step"])}
				// Ref
				ref={el => {
					batch(() => {
						props.ref?.(el)
						setRef(el)
					})
				}}
				// Handlers
				onKeyDown={e => {
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
				tabIndex="0"
			>
				{props.children({ float, translateX })}
			</div>
		</SliderContext.Provider>
	</>
}
