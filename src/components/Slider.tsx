import "./Slider.scss"

import { Setter, VoidProps } from "solid-js"
import { AriaHorizontalSlider, AriaSliderThumb, AriaSliderTrack } from "../aria"

export function Slider(props: VoidProps<{
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}>) {
	return <>
		<AriaHorizontalSlider {...props} class="slider flex-col flex-justify-center focus-ring focus-ring-$full">
			{({ translateX }) => <>
				<AriaSliderTrack class="slider-track flex-row flex-align-center">
					<AriaSliderThumb class="slider-thumb focus-ring focus-ring-$full" style={{ "transform": translateX() ? `translateX(${translateX()}px)` : undefined }} />
				</AriaSliderTrack>
			</>}
		</AriaHorizontalSlider>
	</>
}
