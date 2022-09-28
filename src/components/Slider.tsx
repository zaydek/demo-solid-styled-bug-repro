import { Setter, VoidProps } from "solid-js"
import { AriaHorizontalSlider, AriaSliderThumb, AriaSliderTrack } from "../aria/AriaSlider"

export function Slider(props: VoidProps<{
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}>) {
	return <>
		<style jsx>{`
			.slider {
				/* Query CSS variables */
				--height: var(--form-height);

				padding: 0 calc(var(--height) / 2);
				height: var(--height);
				touch-action: pan-x; /* iOS */
			}
			.slider-track {
				height: 6px;
				border-radius: var(--full);
				background-color: var(--theme-color);
			}
			.slider-thumb {
				height: var(--height);
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: var(--form-color);
				box-shadow: var(--form-box-shadow);
			}
		`}</style>
		<AriaHorizontalSlider {...props} class="slider flex-col flex-justify-center focus-ring focus-ring-$full" use:solid-styled>
			{({ translateX }) => <>
				<AriaSliderTrack class="slider-track flex-row flex-align-center" use:solid-styled>
					<AriaSliderThumb class="slider-thumb focus-ring focus-ring-$full" style={{ "transform": translateX() ? `translateX(${translateX()}px)` : undefined }} use:solid-styled />
				</AriaSliderTrack>
			</>}
		</AriaHorizontalSlider>
	</>
}
