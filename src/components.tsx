import { Accessor, createSignal, JSX, ParentProps, Setter, Show, VoidComponent, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { AriaCheckbox, AriaRadio, AriaRadiogroup, AriaSliderHorizontal, AriaSliderThumb } from "./aria"
import { SmileySVG } from "./smiley-svg"
import { CSSProps, RefProps } from "./utils/solid"

////////////////////////////////////////

export function NavIcon() {
	return <>
		<div class="component-nav-icon">
			<Dynamic component={SmileySVG} class="component-nav-icon-icon" />
		</div>
	</>
}

////////////////////////////////////////

function CheckSVG(props: VoidProps<RefProps & CSSProps>) {
	return <>
		<svg ref={el => props.ref?.(el as unknown as HTMLElement)} class={props.class} style={props.style} fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	</>
}

export function Checkbox(props: ParentProps<{
	checked?:    boolean
	setChecked?: Setter<boolean>
}>) {
	const [fallback, setFallback] = createSignal(false)
	const [checked, setChecked] = [
		typeof props.checked === "boolean"
			? () => props.checked! // Use ! to assert presence for TypeScript
			: fallback,
		props.setChecked ?? setFallback,
	]

	return <>
		<AriaCheckbox class="component-checkable-container" checked={checked()} setChecked={setChecked}>
			<div class="component-checkable-label">
				<Dynamic component={SmileySVG} class="component-checkable-label-icon" />
				<div class="component-checkable-label-text">
					{props.children}
				</div>
			</div>
			<div class="component-checkable-checkbox">
				<Dynamic component={CheckSVG} class="component-checkable-checkbox-svg" style={{ "stroke-width": "7" }} />
			</div>
		</AriaCheckbox>
	</>
}

export function Radio(props: ParentProps<{
	icon?:  VoidComponent<CSSProps> | string
	style?: JSX.CSSProperties
	value:  string
}>) {
	return <>
		<AriaRadio class="component-checkable-container" style={props.style} value={props.value}>
			<div class="component-checkable-label">
				<Show when={!props.icon || typeof props.icon === "function"} fallback={<>
					{/* <img> */}
					<img src={props.icon as string} class="component-checkable-label-icon" />
				</>}>
					{/* <svg> */}
					<Dynamic component={props.icon ?? SmileySVG} class="component-checkable-label-icon" />
				</Show>
				<div class="component-checkable-label-text">
					{props.children}
				</div>
			</div>
			<div class="component-checkable-radio">
				<div class="component-checkable-radio-icon"></div>
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
		<div class="component-slider-container">
			<AriaSliderHorizontal class="component-slider" value={value()} setValue={setValue} min={min()} max={max()} step={step()}>
				{translate => <>
					<div class="component-slider-track">
						<AriaSliderThumb
							class="component-slider-thumb"
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
