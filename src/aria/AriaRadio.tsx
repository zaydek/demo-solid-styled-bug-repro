import { batch, createContext, createEffect, createSignal, on, onCleanup, onMount, ParentProps, Setter, useContext } from "solid-js"
import { omitProps } from "solid-use"
import { createRef } from "../solid-utils"
import { CSSProps, RefProps } from "../solid-utils/extra-types"

type State = {
	value: () => string
}

type Actions = {
	register:   (value: string) => void
	unregister: (value: string) => void
	select:     (value: string) => void
	decrement:  () => void
	increment:  () => void
}

export const RadiogroupContext = createContext<{
	state:   State
	actions: Actions
}>()

export function AriaRadio(props: ParentProps<RefProps & CSSProps & {
	value: string

	// TODO: DEPRECATE?
	tabIndex?: number
}>) {
	const radiogroup = useContext(RadiogroupContext)!

	const [ref, setRef] = createRef()

	const checked = () => props.value === radiogroup.state.value()

	onMount(() => {
		radiogroup.actions.register(props.value)
		onCleanup(() => {
			radiogroup.actions.unregister(props.value)
		})
	})

	createEffect(on(checked, () => {
		if (checked()) {
			ref()!.focus()
		}
	}, { defer: true }))

	return (
		<div
			// Props
			{...omitProps(props, ["value", "children"])}
			// Ref
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
			// Handlers
			onClick={e => {
				e.preventDefault()
				radiogroup.actions.select(props.value)
			}}
			onKeyDown={e => {
				if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
					e.preventDefault()
					radiogroup.actions.decrement()
				} else if (e.code === "ArrowRight" || e.code === "ArrowDown") {
					e.preventDefault()
					radiogroup.actions.increment()
				}
			}}
			// Attributes
			role="radio"
			aria-checked={checked()}
			tabIndex={checked() ?props.tabIndex ?? 0 : -1}
		>
			{props.children}
		</div>
	)
}

export function AriaRadiogroup(props: ParentProps<RefProps & CSSProps & {
	value:    string
	setValue: Setter<string>
}>) {
	const [registeredValues, setRegisteredValues] = createSignal<string[]>([])

	function register(value: string) {
		setRegisteredValues(curr => [...curr, value])
	}

	function unregister(value: string) {
		const index = registeredValues().findIndex(v => value === v)
		if (index === -1) { return }
		setRegisteredValues(curr => [...curr.slice(0, index), ...curr.slice(index + 1)])
	}

	function select(value: string) {
		props.setValue(value)
	}

	function decrement() {
		const index = registeredValues().findIndex(v => props.value === v)
		if (index === -1) { return }
		if (index - 1 < 0) { props.setValue(registeredValues()[registeredValues().length - 1]) }
		else { props.setValue(registeredValues()[index - 1]) }
	}

	function increment() {
		const index = registeredValues().findIndex(v => props.value === v)
		if (index === -1) { return }
		if (index + 1 === registeredValues().length) { props.setValue(registeredValues()[0]) }
		else { props.setValue(registeredValues()[index + 1]) }
	}

	return (
		<RadiogroupContext.Provider
			value={{
				state: { value: () => props.value },
				actions: { register, unregister, select, decrement, increment },
			}}
		>
			<div
				{...omitProps(props, ["value", "setValue", "children"])}
				role="radiogroup"
			>
				{props.children}
			</div>
		</RadiogroupContext.Provider>
	)
}
