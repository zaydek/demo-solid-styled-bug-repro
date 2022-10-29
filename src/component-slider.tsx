import { createSignal, Setter, VoidProps } from "solid-js"
import { AriaSliderHorizontal, AriaSliderThumb } from "./aria"
import { css } from "./utils/solid"

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
		{css`
.component-slider-container {
	padding: 0 calc(28px / 2);
}
.component-slider {
	height: 28px;
	width: 100%;

	/* Flow */
	display: grid;
	align-items: center;

	cursor: grab;
	-webkit-user-select: none;
	user-select: none;
	touch-action: pan-x;
}
:root:has(.component-slider:active) { cursor: grabbing; }                   /* Use both */
:root:has(.component-slider:active) .component-slider { cursor: grabbing; } /* Use both */
.component-slider-track {
	height: 6px;
	width: 100%;
	border-radius: 1000px;
	background-color: var(--trim-color);

	/* Flow */
	display: grid;
	align-content: center;
}
.component-slider-thumb {
	height: 28px;
	aspect-ratio: 1;
	border-radius: 1000px;
	background-color: var(--form-input-color);
	box-shadow: var(--form-input-box-shadow);
}

/**************************************/

/* Overrides */
.component-slider:hover .component-slider-thumb {
	box-shadow: 0 0 0 1px hsl(0 0% 0% / 10%),
		0 0 0 4px hsl(0 0% 0% / 10%),
		0 0 0 4px hsl(0 0% 0% / 10%);
}
.component-slider:active .component-slider-thumb {
	box-shadow: 0 0 0 1px hsl(0 0% 0% / 10%),
		0 0 0 4px hsl(0 0% 0% / 10%),
		0 0 0 4px hsl(200 100% 50% / 40%);
}
		`}
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
