import { FlowProps } from "solid-js"
import { css } from "../../solid-utils"
import { AriaRadio } from "../aria"

export function Radio(props: FlowProps<{ value: string }, string>) {
	return <>
		{css`
			:root {
				--radio-height: 30px;
				--radio-label-icon-height: 16px;
				--radio-icon-height: 10px;
			}

			//////////////////////////////////

			.radio-container {
				// Flexbox
				display: flex;
				flex-direction: row;
				gap: 8px;

				cursor: pointer;
			}

			//////////////////////////////////

			// TODO: Add accessibility e.g. <label>
			.radio-label {
				padding: 0 8px;
				height: var(--radio-height);
				border-radius: var(--full);
				background-color: var(--card-lightgray-color);

				// Flexbox
				flex-grow: 1; // Stretch main-axis
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 8px;
			}

			//////////////////////////////////

			.radio-label-icon {
				height: var(--radio-label-icon-height);
				aspect-ratio: 1;
				border-radius: var(--full); // TODO: DEPRECATE
				background-color: var(--fill-200-color);
			}

			//////////////////////////////////

			// Preamble
			.radio { position: relative; z-index: 10; } // For pseudo
			.radio::before { content: ""; }             // For pseudo
			.radio::after { content: ""; }              // For pseudo

			.radio {
				height: var(--radio-height);
				aspect-ratio: 1;
				border-radius: var(--full);

				// CSS Grid
				display: grid;
				place-items: center;
			}

			.radio::before {
				position: absolute;     // For pseudo
				z-index: -10;           // For pseudo
				inset: 0;               // For pseudo
				border-radius: inherit; // For pseudo
				background-color: var(--form-color);
				box-shadow: var(--form-inset-box-shadow);
			}

			.radio::after {
				position: absolute;     // For pseudo
				z-index: -10;           // For pseudo
				inset: 0;               // For pseudo
				border-radius: inherit; // For pseudo
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;

				// INITIAL STATE
				background-color: transparent;
				transform: scale(0);
			}
			[aria-checked=true] .radio::after {
				background-color: var(--trim-color);
				transform: scale(1);
			}

			//////////////////////////////////

			.radio-icon {
				height: var(--radio-icon-height);
				aspect-ratio: 1;
				border-radius: var(--full);
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;

				// INITIAL STATE
				background-color: transparent;
				transform: scale(0);
			}
			[aria-checked=true] .radio-icon {
				background-color: white;
				transform: scale(1);
			}
		`}
		<AriaRadio class="radio-container focus-ring focus-ring-$full" value={props.value}>
			<div class="radio-label typography-caps">
				<div class="radio-label-icon"></div>
				{props.children}
			</div>
			<div class="radio">
				<div class="radio-icon"></div>
			</div>
		</AriaRadio>
	</>
}
