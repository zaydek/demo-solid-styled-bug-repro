import { createSignal, JSX, ParentProps, Setter, Show, VoidComponent, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { AriaCheckbox, AriaRadio, AriaRadiogroup, AriaSliderHorizontal, AriaSliderThumb } from "./aria"
import { SmileySVG } from "./svg"
import { CSSProps } from "./utils/solid"
import { cx } from "./utils/vanilla"

////////////////////////////////////////

export function NavIcon() {
	return <>
		<div class="nav-icon">
			<Dynamic component={SmileySVG} class="nav-icon-icon" />
		</div>
	</>
}

////////////////////////////////////////

function CheckSVG(props: VoidProps<CSSProps>) {
	return <>
		<svg class={props.class} style={props.style} fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	</>
}

export function Checkbox(props: ParentProps<{
	icon?:       VoidComponent<CSSProps> | string
	style?:      JSX.CSSProperties
	checked?:    boolean
	setChecked?: Setter<boolean>

	center?: boolean
}>) {
	const variantCenter = () => props.center || undefined

	const [fallback, setFallback] = createSignal(false)
	const [checked, setChecked] = [
		typeof props.checked === "boolean"
			? () => props.checked! // Use ! to assert presence for TypeScript
			: fallback,
		props.setChecked ?? setFallback,
	]

	return <>
		<AriaCheckbox class="checkable-container" style={props.style} checked={checked()} setChecked={setChecked}>
			<div class={cx(`checkable-label ${variantCenter() ? "variant-center" : ""}`)}>
				<Show when={!props.icon || typeof props.icon === "function"} fallback={<>
					<img src={props.icon as string} class="checkable-label-icon" />
				</>}>
					<Dynamic component={props.icon ?? SmileySVG} class="checkable-label-icon" />
				</Show>
				<div class="checkable-label-text">
					{props.children}
				</div>
			</div>
			<div class="checkable-checkbox">
				<Dynamic component={CheckSVG} class="checkable-checkbox-icon" style={{ "stroke-width": "7" }} />
			</div>
		</AriaCheckbox>
	</>
}

export function Radio(props: ParentProps<{
	icon?:  VoidComponent<CSSProps> | string
	style?: JSX.CSSProperties
	value:  string

	center?: boolean
}>) {
	const variantCenter = () => props.center || undefined

	return <>
		<AriaRadio class="checkable-container" style={props.style} value={props.value}>
			<div class={cx(`checkable-label ${variantCenter() ? "variant-center" : ""}`)}>
				<Show when={!props.icon || typeof props.icon === "function"} fallback={<>
					<img src={props.icon as string} class="checkable-label-icon" />
				</>}>
					<Dynamic component={props.icon ?? SmileySVG} class="checkable-label-icon" />
				</Show>
				<div class="checkable-label-text">
					{props.children}
				</div>
			</div>
			<div class="checkable-radio">
				<div class="checkable-radio-icon"></div>
			</div>
		</AriaRadio>
	</>
}

export function Radiogroup(props: ParentProps<CSSProps & {
	groupValue?:    string
	setGroupValue?: Setter<string>
}>) {
	const [fallback, setFallback] = createSignal("foo")
	const [groupValue, setGroupValue] = [
		props.groupValue
			? () => props.groupValue! // Use ! to assert presence for TypeScript
			: fallback,
		props.setGroupValue ?? setFallback,
	]

	return <>
		<AriaRadiogroup class={props.class} style={props.style} groupValue={groupValue()} setGroupValue={setGroupValue}>
			{props.children}
		</AriaRadiogroup>
	</>
}

////////////////////////////////////////

export function Slider(props: VoidProps<{
	value?:    number
	setValue?: Setter<number>
	min?:      number
	max?:      number
	step?:     number
}>) {
	const [fallback, setFallback] = createSignal(50)
	const [value, setValue, min, max, step] = [
		props.value
			? () => props.value! // Use ! to assert presence for TypeScript
			: fallback,
		props.setValue ?? setFallback,
		props.min
			? () => props.min!
			: () => 0,
		props.max
			? () => props.max!
			: () => 100,
		props.step
			? () => props.step!
			: () => 1,
	]

	return <>
		<div class="slider-container">
			<AriaSliderHorizontal class="slider" value={value()} setValue={setValue} min={min()} max={max()} step={step()}>
				{translate => <>
					<div class="slider-track">
						<AriaSliderThumb
							class="slider-thumb"
							style={{
								...(translate() && {
									"transform": `translateX(${translate()!}px)`,
								}),
							}}
						/>
					</div>
				</>}
			</AriaSliderHorizontal>
		</div>
	</>
}
