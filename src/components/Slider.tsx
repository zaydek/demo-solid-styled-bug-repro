import { Setter, VoidProps } from "solid-js"
import { AriaHorizontalSlider, AriaSliderThumb, AriaSliderTrack } from "../aria"
import { css } from "../solid-utils"

export function Slider(props: VoidProps<{
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}>) {
	return <>
		{css`
			.component-slider {
				padding: 0 calc(var(--form-height) / 2);
				height: var(--form-height);
				touch-action: pan-x; /* iOS */
			}

			/********************************/

			.component-slider-track {
				height: 6px;
				border-radius: var(--full);
				background-color: var(--theme-color);
			}

			/********************************/

			.component-slider-thumb {
				height: var(--form-height);
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: var(--form-color);
				box-shadow: var(--form-box-shadow);
			}
		`}
		<AriaHorizontalSlider {...props} class="component-slider flex-col flex-justify-center focus-ring focus-ring-$full">
			{({ translateX }) => <>
				<AriaSliderTrack class="component-slider-track flex-row flex-align-center">
					<AriaSliderThumb class="component-slider-thumb focus-ring focus-ring-$full" style={{ "transform": translateX() ? `translateX(${translateX()}px)` : undefined }} />
				</AriaSliderTrack>
			</>}
		</AriaHorizontalSlider>
	</>
}
