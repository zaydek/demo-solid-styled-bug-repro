import { VoidProps } from "solid-js"
import { AriaRadio } from "../aria/AriaRadio"
import { Icon, IconPlaceholder, Line } from "./Primitives"
import { Smiley } from "./Smiley"

export function Radio(props: VoidProps<{ value: string }>) {
	return <>
		<style jsx>{`
			/* Preamble */
			.radio { position: relative; }
			.radio::before { content: ""; }
			.radio::after { content: ""; } /* NOTE: Uses &::before and &::after */

			/********************************/

			.radio {
				/* Query CSS variables */
				--height: var(--reduced-form-height);

				height: var(--height);
				aspect-ratio: 1;
				border-radius: var(--full);
			}
			.radio::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: var(--form-color);
				box-shadow: var(--form-box-shadow);
			}
			.radio::after {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);

				/* transition */
				transition: calc(100ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group[aria-checked=true] .radio::after {
				background-color: var(--hover-active-color);
				transform: scale(1);
			}

			/********************************/

			.radio > :global(.icon-placeholder) {
				background-color: transparent;
				transform: scale(0);

				/* transition */
				transition: calc(100ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group[aria-checked=true] .radio > :global(.icon-placeholder) {
				background-color: white;
				transform: scale(1);
			}
		`}</style>
		<AriaRadio class="group flex-row gap-($gap*2/3) focus-ring focus-ring-$full" value={props.value} use:solid-styled>
			<div class="flex-grow">
				<div class="px-($reduced-form-height/2) h-$reduced-form-height rounded-$full background-color:$faded-card-color flex-row flex-align-center gap-$gap">
					<Icon icon={Smiley} h="16px" />
					<Line w="35%" />
				</div>
			</div>
			<div class="radio grid grid-center">
				<IconPlaceholder h="8px" />
			</div>
		</AriaRadio>
	</>
}
