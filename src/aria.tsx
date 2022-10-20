import { Accessor, batch, createContext, createEffect, createSignal, FlowProps, JSX, on, onCleanup, onMount, ParentProps, Setter, useContext } from "solid-js"
import { CSSProps, RefProps } from "./utils/solid"
import { clamp, round } from "./utils/vanilla"

////////////////////////////////////////

export function AriaButton(props: ParentProps<RefProps & CSSProps &
	{ onClick?: (e: MouseEvent) => void }>) {
	return <>
		<div
			// Base props
			ref={props.ref}
			class={props.class}
			style={props.style}
			// Handlers
			onClick={props.onClick}
			onKeyDown={e => {
				if (e.key === " ") {
					e.preventDefault() // Prevent scrolling
					e.currentTarget.click()
				}
			}}
			// Accessibility
			role="button"
			tabIndex={0}
		>
			{props.children}
		</div>
	</>
}

////////////////////////////////////////

export function AriaCheckbox(props: ParentProps<RefProps & CSSProps & {
	checked:    boolean
	setChecked: Setter<boolean>
}>) {
	return <>
		<div
			// Base props
			ref={props.ref}
			class={props.class}
			style={props.style}
			// Handlers
			onClick={e => props.setChecked(curr => !curr)}
			onKeyDown={e => {
				if (e.key === " ") {
					e.preventDefault() // Prevent scrolling
					e.currentTarget.click()
				}
			}}
			// Accessibility
			role="checkbox"
			aria-checked={props.checked}
			tabIndex={0}
		>
			{props.children}
		</div>
	</>
}

////////////////////////////////////////

type RadiogroupState = {
	groupValue: () => string
	values:     () => string[]
}

type RadiogroupActions = {
	register:   (value: string) => void
	deregister: (value: string) => void
	select:     (value: string) => void
	decrement:  () => void
	increment:  () => void
}

const RadiogroupContext = createContext<{
	state:   RadiogroupState
	actions: RadiogroupActions
}>()

export function AriaRadio(props: ParentProps<RefProps & CSSProps & { value: string }>) {
	const { state, actions } = useContext(RadiogroupContext)!

	const [ref, setRef] = createSignal<HTMLElement>()

	const value = () => props.value
	const checked = () => state.groupValue() === value()

	actions.register(props.value)
	onCleanup(() => actions.deregister(props.value))

	createEffect(on(checked, _checked => {
		if (!checked()) { return }
		ref()!.focus()
	}, { defer: true }))

	return <>
		<div
			// Base props
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
			class={props.class}
			style={props.style}
			// Handlers
			onClick={e => actions.select(props.value)}
			onKeyDown={e => {
				if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault()
					actions.decrement()
				} else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault()
					actions.increment()
				}
			}}
			// Accessibility
			role="radio"
			aria-checked={checked()}
			tabIndex={checked() ? 0 : -1}
		>
			{props.children}
		</div>
	</>
}

export function AriaRadiogroup(props: ParentProps<RefProps & CSSProps & {
	groupValue:    string
	setGroupValue: Setter<string>
}>) {
	const [groupValue, setGroupValue] = [() => props.groupValue, props.setGroupValue]
	const [values, setValues] = createSignal<string[]>([])

	// Registers a value
	function register(value: string) {
		setValues(curr => [...curr, value])
	}

	// Deregisters a value
	function deregister(value: string) {
		const index = values().indexOf(value)
		if (index === -1) { return }
		setValues(curr => [
			...curr.slice(0, index),
			...curr.slice(index + 1),
		])
	}

	// Selects a value
	function select(value: string) {
		setGroupValue(value)
	}

	// Decrements to the previous value
	function decrement() {
		const index = values().findIndex(v => v === groupValue())
		if (index === -1) { return }
		if (!(index - 1 >= 0)) { return void setGroupValue(values()[values().length - 1]) }
		setGroupValue(values()[index - 1])
	}

	// Increments to the next value
	function increment() {
		const index = values().findIndex(v => v === groupValue())
		if (index === -1) { return }
		if (!(index + 1 < values().length)) { return void setGroupValue(values()[0]) }
		setGroupValue(values()[index + 1])
	}

	return <>
		<RadiogroupContext.Provider
			value={{
				state: { groupValue, values },
				actions: { register, deregister, select, decrement, increment },
			}}
		>
			<div ref={props.ref} class={props.class} style={props.style} role="radiogroup">
				{props.children}
			</div>
		</RadiogroupContext.Provider>
	</>
}

////////////////////////////////////////

type Rect = {
	y: number
	x: number
	h: number
	w: number
}

type Point = { y: number, x: number }

const SliderContext = createContext<{ setRef: Setter<HTMLElement> }>()

export function AriaSliderThumb(props: ParentProps<RefProps & CSSProps>) {
	const { setRef } = useContext(SliderContext)!

	return <>
		<div
			// Base props
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
			class={props.class}
			style={props.style}
		>
			{props.children}
		</div>

	</>
}

function AriaSlider(props: FlowProps<RefProps & CSSProps & {
	value:    number
	setValue: Setter<number>

	min:  number
	max:  number
	step: number

	direction: "horizontal" | "vertical"
}, (translate: Accessor<undefined | number>) => JSX.Element>) {
	const [trackRef, setTrackRef] = createSignal<HTMLElement>()
	const [thumbRef, setThumbRef] = createSignal<HTMLElement>()

	const [track, setTrack] = createSignal<Rect>()
	const [thumb, setThumb] = createSignal<Rect>()

	const [pointerDown, setPointerDown] = createSignal<true>()
	const [point1, setPoint1] = createSignal<Point>()
	const [point2, setPoint2] = createSignal<Point>()

	const [value, setValue] = [() => props.value, props.setValue]
	const min = () => props.min
	const max = () => props.max
	const step = () => props.step

	const axis = () => props.direction === "horizontal"
		? "x"
		: "y"
	const edge = () => axis() === "y"
		? "h"
		: "w"

	// Normalize a value
	function normalizeValue(value: number) {
		return clamp(value - value % step(), { min: min(), max: max() })
	}
	setValue(normalizeValue(value())) // Immediately normalize

	// Gets a value from translation
	const getValueFromTranslate = () => {
		const f = (point2()![axis()] - point1()![axis()]) /
			(track()![edge()] - thumb()![edge()])
		return normalizeValue(f * (max() - min()))
	}

	// Gets a translation from value
	const getTranslateFromValue = () => {
		if (!(track() && thumb())) { return }
		const f = (value() - min()) / (max() - min())
		return f * (track()![edge()] - thumb()![edge()])
	}

	// Externalize measureDOM(); measure track and thumb onMount() *and*
	// "pointerdown" events
	function measureDOM() {
		batch(() => {
			const track = trackRef()!.getBoundingClientRect()
			const thumb = thumbRef()!.getBoundingClientRect()
			setTrack({ y: track.y, x: track.x, h: track.height, w: track.width })
			setThumb({ y: thumb.y, x: thumb.x, h: thumb.height, w: thumb.width })
		})
	}

	onMount(() => {
		measureDOM()
		window.addEventListener("resize", measureDOM, false)
		onCleanup(() => window.addEventListener("resize", measureDOM, false))

		// Add observer as a fallback
		const observer = new ResizeObserver(measureDOM)
		observer.observe(trackRef()!)
		onCleanup(() => observer.disconnect)
	})

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!(e.button === 0 || e.buttons === 1)) { return }
			if (!e.composedPath().includes(trackRef()!)) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			batch(() => {
				measureDOM()
				setPointerDown(true)
				setPoint1({
					y: round(track()!.y + thumb()!.h / 2), // Use round to dedupe
					x: round(track()!.x + thumb()!.w / 2), // Use round to dedupe
				})
				setPoint2({ y: round(e.clientY), x: round(e.clientX) }) // Use round to dedupe
				setValue(getValueFromTranslate())
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				setPoint2({ y: round(e.clientY), x: round(e.clientX) }) // Use round to dedupe
				setValue(getValueFromTranslate())
			})
		}
		function handlePointerUp(e: PointerEvent) {
			batch(() => {
				setPointerDown()
				setPoint1()
				setPoint2()
			})
		}
		document.addEventListener("pointerdown", handlePointerDown, false)
		document.addEventListener("pointermove", handlePointerMove, false)
		document.addEventListener("pointerup",   handlePointerUp,   false)
		onCleanup(() => {
			document.addEventListener("pointerdown", handlePointerDown, false)
			document.addEventListener("pointermove", handlePointerMove, false)
			document.addEventListener("pointerup",   handlePointerUp,   false)
		})
	})

	return <>
		<SliderContext.Provider value={{ setRef: setThumbRef }}>
			<div
				// Base props
				ref={el => {
					batch(() => {
						props.ref?.(el)
						setTrackRef(el)
					})
				}}
				class={props.class}
				style={props.style}
				// Handlers
				onKeyDown={e => {
					if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft") {
						e.preventDefault()
						setValue(normalizeValue(value() - step()))
					} else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") {
						e.preventDefault()
						setValue(normalizeValue(value() + step()))
					} else if (e.key === "Home") {
						e.preventDefault()
						setValue(normalizeValue(min()))
					} else if (e.key === "End") {
						e.preventDefault()
						setValue(normalizeValue(max()))
					}
				}}
				// Accessibility
				role="slider"
				aria-valuenow={value()}
				aria-valuemin={min()}
				aria-valuemax={max()}
				tabIndex={0}
			>
				{props.children(getTranslateFromValue)}
			</div>
		</SliderContext.Provider>
	</>
}

// For example:
//
//   .horizontal-slider {
//     height: 32px;
//     width: 100%;
//
//     /* Flow */
//     display: grid;
//     align-items: center;
//
//     touch-action: pan-x;
//   }
//   .horizontal-slider-track {
//     height: 8px;
//     width: 100%;
//     border-radius: 32px;
//     background-color: blue;
//
//     /* Flow */
//     display: grid;
//     align-content: center;
//   }
//   .horizontal-slider-thumb {
//     height: 32px;
//     aspect-ratio: 1;
//     border-radius: 1000px;
//     background-color: white;
//     box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
//   }
//
export function AriaSliderHorizontal(props: FlowProps<RefProps & CSSProps & {
	value:    number
	setValue: Setter<number>

	min:  number
	max:  number
	step: number
}, (translate: Accessor<undefined | number>) => JSX.Element>) {
	return <AriaSlider {...props} direction="horizontal" />
}

// For example:
//
//   .vertical-slider {
//     height: 100%;
//     width: 32px;
//
//     /* Flow */
//     display: grid;
//     justify-items: center;
//
//     touch-action: pan-y;
//   }
//   .vertical-slider-track {
//     height: 100%;
//     width: 8px;
//     border-radius: 32px;
//     background-color: blue;
//
//     /* Flow */
//     display: grid;
//     justify-content: center;
//   }
//   .vertical-slider-thumb {
//     height: 32px;
//     aspect-ratio: 1;
//     border-radius: 1000px;
//     background-color: white;
//     box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
//   }
//
export function AriaSliderVertical(props: FlowProps<RefProps & CSSProps & {
	value:    number
	setValue: Setter<number>

	min:  number
	max:  number
	step: number
}, (translate: Accessor<undefined | number>) => JSX.Element>) {
	return <AriaSlider {...props} direction="vertical" />
}
