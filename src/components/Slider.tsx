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
		<AriaHorizontalSlider {...props} class="Slider focus-ring focus-ring-$full">
			{({ float, translateX }) => <>
				<AriaSliderTrack class="SliderTrack" style={{ "--slider-track-percentage": `${float() * 100}%` }}>
					<AriaSliderThumb class="SliderThumb focus-ring focus-ring-$full" style={{ "transform": translateX() ? `translateX(${translateX()}px)` : undefined }} />
				</AriaSliderTrack>
			</>}
		</AriaHorizontalSlider>
	</>
}
