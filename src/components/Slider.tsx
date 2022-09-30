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
			.slider {
				padding: 0 calc(var(--form-height) / 2);
				height: var(--form-height);
				touch-action: pan-x; /* iOS */
			}

			/********************************/

			.slider-track {
				height: 6px;
				border-radius: var(--full);
				background-color: var(--theme-color);
			}

			/********************************/

			.slider-thumb {
				height: var(--form-height);
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: var(--form-color);
				box-shadow: var(--form-box-shadow);
			}
		`}
		<AriaHorizontalSlider {...props} class="slider flex-col flex-justify-center focus-ring focus-ring-$full">
			{({ translateX }) => <>
				<AriaSliderTrack class="slider-track flex-row flex-align-center">
					<AriaSliderThumb class="slider-thumb focus-ring focus-ring-$full" style={{ "transform": translateX() ? `translateX(${translateX()}px)` : undefined }} use:solid-styled />
				</AriaSliderTrack>
			</>}
		</AriaHorizontalSlider>
	</>
}
