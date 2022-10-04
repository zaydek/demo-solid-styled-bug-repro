import { FlowProps } from "solid-js"
import { AriaRadio } from "../aria"
import { css } from "../solid-utils"
import { IconPlaceholder } from "./Primitives"
import { Smiley } from "./Smiley"

export function Radio(props: FlowProps<{ value: string }, string>) {
	return <>
		{css`
			// Preamble
			.css-radio { position: relative; }
			.css-radio::before { content: ""; }
			.css-radio::after { content: ""; }

			//////////////////////////////////

			.css-radio {
				height: var(--reduced-form-height);
				aspect-ratio: 1;
				border-radius: var(--full);
			}
			.css-radio::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: var(--form-color);
				box-shadow: var(--form-box-shadow);
			}
			.css-radio::after {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);
				// TRANSITION
				transition: calc(100ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group[aria-checked=true] .css-radio::after {
				background-color: var(--card-color-is-active);
				transform: scale(1);
			}

			//////////////////////////////////

			.css-radio > .css-icon-placeholder {
				background-color: transparent;
				transform: scale(0);
				// TRANSITION
				transition: calc(100ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group[aria-checked=true] .css-radio > .css-icon-placeholder {
				background-color: white;
				transform: scale(1);
			}
		`}
		<AriaRadio class="group flex-row gap-$gap focus-ring focus-ring-$full" value={props.value}>
			<div class="flex-grow">
				<div class="px-calc($reduced-form-height/2) h-$reduced-form-height rounded-$full background-color:$card-lightgray-color flex-row flex-align-center gap-$gap">
					<Smiley class="h-16px aspect-1 color:$fill-100-color" />
					<div class="type-caps">
						{props.children}
					</div>
				</div>
			</div>
			<div class="css-radio grid grid-center">
				<IconPlaceholder h="8px" />
			</div>
		</AriaRadio>
	</>
}
