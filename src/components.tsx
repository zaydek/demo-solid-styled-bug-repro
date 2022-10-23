import { createSignal, JSX, ParentProps, Setter, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { AriaCheckbox, AriaRadio, AriaRadiogroup, AriaSliderHorizontal, AriaSliderThumb } from "./aria"
import { SmileySVG } from "./smiley-svg"
import { CSSProps, RefProps } from "./utils/solid"

////////////////////////////////////////

export function NavIcon() {
	return <>
		<div class="cp-nav-icon">
			<Dynamic component={SmileySVG} class="cp-nav-icon-svg" />
		</div>
	</>
}

////////////////////////////////////////

export function CheckSVG(props: VoidProps<RefProps & CSSProps>) {
	return <>
		<svg ref={el => props.ref?.(el as unknown as HTMLElement)} class={props.class} style={props.style} fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	</>
}

export function CheckableCheckbox(props: ParentProps) {
	const [checked, setChecked] = createSignal(true)

	return <>
		<AriaCheckbox class="cp-checkable-container" checked={checked()} setChecked={setChecked}>
			<div class="cp-checkable-label">
				<Dynamic component={SmileySVG} class="cp-checkable-label-icon" />
				<div class="cp-checkable-label-text">
					{props.children}
				</div>
			</div>
			<div class="cp-checkable-checkbox">
				<Dynamic component={CheckSVG} class="cp-checkable-checkbox-svg" style={{ "stroke-width": "7" }} />
			</div>
		</AriaCheckbox>
	</>
}

export function CheckableRadio(props: ParentProps<{
	value: string

	style?: JSX.CSSProperties
}>) {
	return <>
		<AriaRadio class="cp-checkable-container" style={props.style} value={props.value}>
			<div class="cp-checkable-label">
				<Dynamic component={SmileySVG} class="cp-checkable-label-icon" />
				<div class="cp-checkable-label-text">
					{props.children}
				</div>
			</div>
			<div class="cp-checkable-radio">
				<div class="cp-checkable-radio-icon"></div>
			</div>
		</AriaRadio>
	</>
}

export function Radiogroup(props: ParentProps<CSSProps>) {
	const [groupValue, setGroupValue] = createSignal("foo")

	return <>
		<AriaRadiogroup class={props.class} style={props.style} groupValue={groupValue()} setGroupValue={setGroupValue}>
			{props.children}
		</AriaRadiogroup>
	</>
}

////////////////////////////////////////

export function Slider(props: VoidProps<{
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}>) {
	return <>
		<div class="cp-slider-container">
			<AriaSliderHorizontal class="cp-slider" value={props.value} setValue={props.setValue} min={props.min} max={props.max} step={props.step}>
				{translate => <>
					<div class="cp-slider-track">
						<AriaSliderThumb
							class="cp-slider-thumb"
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
