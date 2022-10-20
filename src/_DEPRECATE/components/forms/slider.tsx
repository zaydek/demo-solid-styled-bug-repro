import { Setter, useContext, VoidProps } from "solid-js"
import { css } from "../../solid-utils"
import { AriaHorizontalSlider, AriaSliderThumb, AriaSliderTrack, HorizontalSliderContext } from "../aria"

export function Slider(props: VoidProps<{
	value:    number
	setValue: Setter<number>
	min:      number
	max:      number
	step:     number
}>) {
	return <>
		{css`
			:root {
				--slider-track-height: 6px;
				--slider-thumb-height: 32px;
			}

			//////////////////////////////////

			.slider {
				padding: 0 16px;
				height: var(--slider-thumb-height);

				// Flexbox
				display: flex;
				flex-direction: column;  // Stretch x-axis
				justify-content: center; // Center y-axis

				cursor: grab;
				touch-action: pan-x; // COMPAT/Safari
			}
			:root:has(.slider:active) {
				cursor: grab;
			}

			//////////////////////////////////

			.slider-track {
				height: var(--slider-track-height);
				border-radius: var(--full);
				background-image: linear-gradient(90deg, var(--trim-color) var(--slider-track-percentage),
					var(--card-hairline-color) var(--slider-track-percentage));

				// Flexbox
				display: flex;
				flex-direction: row;
				align-items: center; // Center y-axis

			}

			//////////////////////////////////

			.slider-thumb {
				height: var(--slider-thumb-height);
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: var(--form-color);
				box-shadow: var(--form-box-shadow);
			}
		`}
		<AriaHorizontalSlider {...props} class="slider focus-ring focus-ring-$full">
			{() => {
				const slider = useContext(HorizontalSliderContext)!
				const { float, translateX } = slider
				return <>
					<AriaSliderTrack class="slider-track" style={{ "--slider-track-percentage": `${float() * 100}%` }}>
						<AriaSliderThumb
							class="slider-thumb focus-ring focus-ring-$full"
							style={{ "transform": translateX() ? `translateX(${translateX()}px)` : undefined }}
						/>
					</AriaSliderTrack>
				</>
			}}
		</AriaHorizontalSlider>
	</>
}
