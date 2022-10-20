import "./css"

import { Accessor, batch, createContext, createEffect, createSignal, FlowProps, For, JSX, on, onCleanup, onMount, ParentProps, Setter, useContext } from "solid-js"
import { render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { DEBUG_component } from "./debug-component"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { css, CSSProps, RefProps } from "./solid-utils"
import { clamp, range, round } from "./utils"

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
				<NonResponsive>
					<div class="[flex-shrink:0]">
						<nav class="navbar">
							<div class="nav-icon"></div>
							<div class="[flex-grow:1]"></div>
							<div class="nav-icon"></div>
							<div class="nav-icon"></div>
						</nav>
						<hr class="line" />
					</div>
				</NonResponsive>
				<div class="[flex-grow:1] [overflow-y:auto]">
					<DrawerProvider>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
					</DrawerProvider>
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

function AriaButton(props: ParentProps<RefProps & CSSProps &
	{ onClick?: (e: MouseEvent) => void }
>) {
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

function AriaCheckbox(props: ParentProps<RefProps & CSSProps & {
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

function AriaRadio(props: ParentProps<RefProps & CSSProps & { value: string }>) {
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

function AriaRadiogroup(props: ParentProps<RefProps & CSSProps & {
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

const SliderContext = createContext<{ setRef: Setter<HTMLElement> }>()

////////////////////////////////////////

function AriaSliderThumb(props: ParentProps<RefProps & CSSProps>) {
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

////////////////////////////////////////

type Rect = {
	y: number
	x: number
	h: number
	w: number
}

type Point = { y: number, x: number }

function AriaSlider(props: FlowProps<RefProps & CSSProps & {
	value:    number
	setValue: Setter<number>

	min:  number
	max:  number
	step: number

	direction?: "horizontal" | "vertical"
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

	const axis = () => (props.direction ?? "horizontal") === "horizontal"
		? "x" // X-axis
		: "y" // Y-axis
	const edge = () => axis() === "y"
		? "h" // Height
		: "w" // Width

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

	onMount(() => {
		function handleResize() {
			batch(() => {
				const track = trackRef()!.getBoundingClientRect()
				const thumb = thumbRef()!.getBoundingClientRect()
				setTrack({ y: track.y, x: track.x, h: track.height, w: track.width })
				setThumb({ y: thumb.y, x: thumb.x, h: thumb.height, w: thumb.width })
			})
		}
		handleResize()
		window.addEventListener("resize", handleResize, false)
		onCleanup(() => window.addEventListener("resize", handleResize, false))

		// Add observer as a fallback
		const observer = new ResizeObserver(handleResize)
		observer.observe(trackRef()!)
		onCleanup(() => observer.disconnect)
	})

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!(e.button === 0 || e.buttons === 1)) { return }
			if (!e.composedPath().includes(trackRef()!)) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			batch(() => {
				setPointerDown(true)
				setPoint1({
					y: round(track()!.y + thumb()!.h / 2),
					x: round(track()!.x + thumb()!.w / 2),
				})
				// Round client measurements
				setPoint2({ y: round(e.clientY), x: round(e.clientX) })
				setValue(getValueFromTranslate())
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				// Round client measurements
				setPoint2({ y: round(e.clientY), x: round(e.clientX) })
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

////////////////////////////////////////

function App2() {
	const [checked, setChecked] = createSignal(false)
	const [groupValue, setGroupValue] = createSignal("foo")
	const [value, setValue] = createSignal(25.5)

	//// createEffect(() => {
	//// 	console.log({ groupValue: groupValue() })
	//// })

	return <>
		{css`
			.center {
				display: grid;
				place-items: center;
				height: 100vh;
			}

			.my-radio {
				position: relative;
				height: 24px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: white;
				box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 25%);
			}
			.my-radio[aria-checked=true]::before {
				content: ""; /* Reset */
				position: absolute;
				inset: 0;
				margin: auto; /* Self-center */
				height: 8px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: purple;
			}

			.my-slider {
				height: 100%;
				aspect-ratio: 1;

				/* Flow */
				display: grid;
				place-items: center;
			}
			.my-slider-track {
				height: 100%;
				border-radius: 32px;
				background-color: blue;

				/* Flow */
				/* display: grid; */
				/* justify-content: center; */
			}
			.my-slider-thumb {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
		`}
		<div class="center">
			{/* <AriaRadiogroup class="[display:flex] [flex-direction:column] [gap:8px]" groupValue={groupValue()} setGroupValue={setGroupValue}>
				<For each={["foo", "bar", "baz", "qux"]}>{value => <>
					<div class="[display:flex] [flex-direction:row] [align-items:center] [gap:8px]">
						<div class="[flex-grow:1]">{value}</div>
						<AriaRadio class="my-radio" value={value} />
					</div>
				</>}</For>
			</AriaRadiogroup> */}
			<div class="[height:640px] [aspect-ratio:1]">
				<AriaSlider class="my-slider" value={value()} setValue={setValue} min={0} max={100} step={1} direction="vertical">
					{translate => <>
						<div class="my-slider-track">
							<AriaSliderThumb
								class="my-slider-thumb"
								style={{
									...(translate() && {
										//// "transform": `translateX(${translate()!}px)`,
										"transform": `translateY(${translate()!}px)`,
									}),
								}}
							/>
						</div>
					</>}
				</AriaSlider>
			</div>
		</div>
	</>
}

////////////////////////////////////////

render(() =>
	<App2 />,
	document.getElementById("root")!,
)
