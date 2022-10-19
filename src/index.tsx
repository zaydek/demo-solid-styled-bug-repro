import "./css"

import { batch, createContext, createEffect, createSignal, For, on, onCleanup, ParentProps, Setter, splitProps, useContext } from "solid-js"
import { render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { StyleRegistry } from "solid-styled"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { css, CSSProps, RefProps } from "./solid-utils"
import { echo, range } from "./utils"

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

function App2() {
	const [checked, setChecked] = createSignal(false)
	const [groupValue, setGroupValue] = createSignal("foo")

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
		`}
		<div class="center">
			<AriaRadiogroup class="[display:flex] [flex-direction:column] [gap:8px]" groupValue={groupValue()} setGroupValue={setGroupValue}>
				<For each={["foo", "bar", "baz", "qux"]}>{value => <>
					<div class="[display:flex] [flex-direction:row] [align-items:center] [gap:8px]">
						<div class="[flex-grow:1]">{value}</div>
						<AriaRadio class="my-radio" value={value} />
					</div>
				</>}</For>
			</AriaRadiogroup>
		</div>
	</>
}

render(() =>
	<>
		<StyleRegistry>
			<App2 />
		</StyleRegistry>
	</>,
	document.getElementById("root")!,
)
