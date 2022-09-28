import { createSignal, VoidProps } from "solid-js"
import { AriaHorizontalSlider, AriaSliderThumb, AriaSliderTrack } from "../aria/AriaSlider"

export function Slider(props: VoidProps<{
	//// value:    number
	//// setValue: Setter<number>
	//// min:      number
	//// max:      number
	//// step:     number
}>) {
	const [value, setValue] = createSignal(25)

	return <>
		<style jsx>{`
			.slider {
				/* Query CSS variables */
				--height: 32px;

				height: var(--height);
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
		{/* <AriaHorizontalSlider {...props} class="slider flex-col flex-justify-center touch-action:pan-x" use:solid-styled> */}
		<AriaHorizontalSlider class="slider flex-col flex-justify-center touch-action:pan-x" value={value()} setValue={setValue} min={25} max={125} step={5} use:solid-styled>
			{({ translateX }) => <>
				<AriaSliderTrack class="slider-track flex-row flex-align-center" use:solid-styled>
					<AriaSliderThumb class="slider-thumb" style={{ "transform": translateX() ? `translateX(${translateX()}px)` : undefined }} use:solid-styled />
				</AriaSliderTrack>
			</>}
		</AriaHorizontalSlider>
	</>
}
