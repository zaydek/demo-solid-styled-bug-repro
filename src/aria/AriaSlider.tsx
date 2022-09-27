import { Accessor, createContext, createSignal, onCleanup, onMount, ParentProps, Setter, splitProps, useContext } from "solid-js"
import { CSSProps } from "../solid-utils/extra-types"
import { bound, round } from "../utils/precision"

export const SliderContext = createContext<{
	state: {
		value:    () => number
		min:      () => number
		max:      () => number
		step:     () => number
		disabled: () => boolean

		trackClientRect: Accessor<undefined | DOMRect>
		thumbClientRect: Accessor<undefined | DOMRect>
	}
	actions: {
		setTrackClientRect: Setter<DOMRect>
		setThumbClientRect: Setter<DOMRect>
	}
}>()

//// export function useSliderContext() {
//// 	return useContext(SliderContext)!
//// }

export function AriaSliderThumb(props: ParentProps<CSSProps>) {
	const slider = useContext(SliderContext)!

	const [ref, setRef] = createSignal<HTMLElement>()

	onMount(() => {
		function handleResize() {
			const el = ref()!
			slider.actions.setThumbClientRect(el.getBoundingClientRect())
		}
		handleResize()
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => {
			window.addEventListener("resize", handleResize, false)
		})
		// Add an observer as a fallback
		const observer = new ResizeObserver(() => {
			handleResize()
		})
		observer.observe(ref()!)
		onCleanup(() => {
			observer.disconnect()
		})
	})

	return <>
		<div {...props} ref={setRef}>
			{props.children}
		</div>
	</>
}

export function AriaSliderTrack(props: ParentProps<CSSProps>) {
	const slider = useContext(SliderContext)!

	const [ref, setRef] = createSignal<HTMLElement>()

	onMount(() => {
		function handleResize() {
			const el = ref()!
			slider.actions.setTrackClientRect(el.getBoundingClientRect())
		}
		handleResize()
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => {
			window.addEventListener("resize", handleResize, false)
		})
		// Add an observer as a fallback
		const observer = new ResizeObserver(() => {
			handleResize()
		})
		observer.observe(ref()!)
		onCleanup(() => {
			observer.disconnect()
		})
	})

	return <>
		<div {...props} ref={setRef}>
			{props.children}
		</div>
	</>
}

export function AriaSlider(props: ParentProps<CSSProps & {
	value: number
	setValue: Setter<number>

	min:  number
	max:  number
	step: number

	// TODO: What about inert?
	disabled?: boolean
}>) {
	const [curr, next] = splitProps(props, ["value", "setValue", "min", "max", "step"])

	const [ref, setRef] = createSignal<HTMLElement>()
	const [trackClientRect, setTrackClientRect] = createSignal<DOMRect>()
	const [thumbClientRect, setThumbClientRect] = createSignal<DOMRect>()

	const normalize = (value: number) => {
		const rounded = round(value)
		const bounded = bound(rounded, { min: props.min, max: props.max })
		curr.setValue(bounded)
	}

	// Normalize immediately
	normalize(props.value)

	const normalizeClientX = (clientX: number) => {
		const thumbWidth = thumbClientRect()!.width
		const trackStart = trackClientRect()!.x
		const trackWidth = trackClientRect()!.width

		const float = ((clientX - thumbWidth / 2) - trackStart) / (trackWidth - thumbWidth)
		const value = float * (props.max - props.min) + props.min
		normalize(value - value % props.step)
	}

	const decrement = () => {
		normalize(curr.value - props.step)
	}

	const decrementAll = () => {
		normalize(props.min)
	}

	const increment = () => {
		normalize(curr.value + props.step)
	}

	const incrementAll = () => {
		normalize(props.max)
	}

	onMount(() => {
		let pointerDown = false
		function handlePointerDown(e: PointerEvent) {
			if (props.disabled) { return }
			if (e.button !== 0 || !e.composedPath().includes(ref()!)) {
				// No-op
				return
			}
			//// e.preventDefault()
			pointerDown = true
			normalizeClientX(e.clientX)
		}
		document.addEventListener("pointerdown", handlePointerDown, false)
		onCleanup(() => document.addEventListener("pointerdown", handlePointerDown, false))

		function handlePointerMove(e: PointerEvent) {
			if (props.disabled) { return }
			if (!pointerDown) {
				// No-op
				return
			}
			e.preventDefault()
			normalizeClientX(e.clientX)
		}
		document.addEventListener("pointermove", handlePointerMove, false)
		onCleanup(() => document.addEventListener("pointermove", handlePointerMove, false))

		function handlePointerUp(e: PointerEvent) {
			if (props.disabled) { return }
			e.preventDefault()
			pointerDown = false
		}
		document.addEventListener("pointerup", handlePointerUp, false)
		onCleanup(() => document.addEventListener("pointerup", handlePointerUp, false))
	})

	return <>
		<SliderContext.Provider
			value={{
				state: {
					value:    () => props.value,
					min:      () => props.min,
					max:      () => props.max,
					step:     () => props.step,
					disabled: () => props.disabled ?? false,

					trackClientRect,
					thumbClientRect,
				},
				actions: {
					setTrackClientRect,
					setThumbClientRect,
				},
			}}
		>
			<div
				ref={setRef}

				// Destructure props for use:solid-styled, etc.
				{...next}

				// Accessibility
				role="slider"
				aria-valuenow={props.value}
				aria-valuemin={props.min}
				aria-valuemax={props.max}
				aria-disabled={props.disabled}

				// Handlers
				onKeyDown={e => {
					//// if (props.disabled) { return }
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
				//// tabIndex={!props.disabled ? 0 : -1}
				tabindex="0"
			>
				{next.children}
			</div>
		</SliderContext.Provider>
	</>
}
