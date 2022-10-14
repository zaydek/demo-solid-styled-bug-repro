import { Accessor, batch, createContext, createSignal, onCleanup, onMount, ParentProps, Setter, useContext } from "solid-js"
import { createRef, CSSProps, omitProps, RefProps } from "../../solid-utils"
import { clamp, round } from "../../utils"

export const HorizontalSliderContext = createContext<{
	float:         Accessor<number>
	translateX:    Accessor<undefined | number>
	_setTrackRect: Setter<DOMRect> // Internal
	_setThumbRect: Setter<DOMRect> // Internal
}>()

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

export function AriaSliderThumb(props: ParentProps<RefProps & CSSProps>) {
	const slider = useContext(HorizontalSliderContext)!
	if (!slider) { throw new Error("Missing context: wrap <AriaHorizontalSlider>") }

	const [ref, setRef] = createRef()

	onMount(() => {
		function handleResize() {
			slider._setThumbRect(ref()!.getBoundingClientRect())
		}
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => window.addEventListener("resize", handleResize, false))

		// Add an observer as a fallback
		const observer = new ResizeObserver(handleResize)
		observer.observe(ref()!)
		onCleanup(() => observer.disconnect)
	})

	return <>
		<div
			{...props}
			ref={(el: HTMLElement) => {
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

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

export function AriaSliderTrack(props: ParentProps<RefProps & CSSProps>) {
	const slider = useContext(HorizontalSliderContext)!
	if (!slider) { throw new Error("Missing context: wrap <AriaHorizontalSlider>") }

	const [ref, setRef] = createRef()

	onMount(() => {
		function handleResize() {
			slider._setTrackRect(ref()!.getBoundingClientRect())
		}
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => window.addEventListener("resize", handleResize, false))

		// Add an observer as a fallback
		const observer = new ResizeObserver(handleResize)
		observer.observe(ref()!)
		onCleanup(() => observer.disconnect)
	})

	return <>
		<div
			{...props}
			ref={(el: HTMLElement) => {
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

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

export function AriaHorizontalSlider(props: ParentProps<RefProps & CSSProps & {
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}>) {
	const [ref, setRef] = createRef()

	const [trackRect, setTrackRect] = createSignal<DOMRect>()
	const [thumbRect, setThumbRect] = createSignal<DOMRect>()

	// Normalizes a value; rounds and clamps a number
	function normalize(value: number) {
		const normalized = clamp(round(value), { min: props.min, max: props.max })
		props.setValue(normalized)
	}
	normalize(props.value) // Immediately normalize

	// Derives a float (percentage) from DOM measurements and converts to a
	// number-based value
	function normalizeClientX(clientX: number) {
		const trackX = trackRect()!.x
		const trackW = trackRect()!.width
		const float = (clientX - trackX) / trackW
		const value = float * (props.max - props.min) + props.min
		normalize(value - value % props.step)
	}

	// Derives a float (percentage) from number-based values
	const float = () => (props.value - props.min) / (props.max - props.min)

	const translateX = () => {
		if (!trackRect() || !thumbRect()) { return }
		const trackW = trackRect()!.width
		const thumbW = thumbRect()!.width
		return (float() * trackW) - (thumbW / 2)
	}

	let pointerDown = false
	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!((e.button === 0 || e.buttons === 1) && e.composedPath().includes(ref()!))) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			pointerDown = true
			normalizeClientX(e.clientX)
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown) { return }
			normalizeClientX(e.clientX)
		}
		function handlePointerUp(e: PointerEvent) {
			pointerDown = false
		}
		document.addEventListener("pointerdown",  handlePointerDown, false)
		document.addEventListener("pointermove",  handlePointerMove, false)
		document.addEventListener("pointerup",    handlePointerUp,   false)
		document.addEventListener("pointerleave", handlePointerUp,   false)
		onCleanup(() => {
			document.addEventListener("pointerdown",  handlePointerDown, false)
			document.addEventListener("pointermove",  handlePointerMove, false)
			document.addEventListener("pointerup",    handlePointerUp,   false)
			document.addEventListener("pointerleave", handlePointerUp,   false)
		})
	})

	return <>
		<HorizontalSliderContext.Provider
			value={{
				float,
				translateX,
				_setTrackRect: setTrackRect,
				_setThumbRect: setThumbRect,
			}}
		>
			<div
				{...omitProps(props, ["value", "setValue", "min", "max", "step"])}
				ref={(el: HTMLElement) => {
					batch(() => {
						props.ref?.(el)
						setRef(el)
					})
				}}
				onKeyDown={(e: KeyboardEvent) => {
					if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "PageDown") {
						e.preventDefault()
						normalize(props.value - props.step)
					} else if (e.key === "Home") {
						e.preventDefault()
						normalize(props.min)
					} else if (e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "PageUp") {
						e.preventDefault()
						normalize(props.value + props.step)
					} else if (e.key === "End") {
						e.preventDefault()
						normalize(props.max)
					}
				}}
				role="slider"
				aria-valuenow={props.value}
				aria-valuemin={props.min}
				aria-valuemax={props.max}
				tabIndex={0}
			>
				{props.children}
			</div>
		</HorizontalSliderContext.Provider>
	</>
}
