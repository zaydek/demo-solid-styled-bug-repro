import { createSignal, VoidProps } from "solid-js"
import { Icon, IconPlaceholder, Line } from "./Primitives"
import { Smiley } from "./Smiley"

// TODO: Change VoidProps to ParentProps and add { icon: VoidComponent<CSSProps> }
export function Radio(props: VoidProps<{ active?: boolean }>) {
	const [checked, setChecked] = createSignal(props.active)

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
				transition: var(--duration-100) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group:is(:hover:active, [data-state-active]) .radio::after {
				background-color: var(--hover-active-color);
				transform: scale(1);
			}

			/********************************/

			.radio > :global(.icon-placeholder) {
				background-color: transparent;
				transform: scale(0);

				/* transition */
				transition: var(--duration-100) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group:is(:hover:active, [data-state-active]) .radio > :global(.icon-placeholder) {
				background-color: white;
				transform: scale(1);
			}
		`}</style>
		<div class="group flex-row gap-($gap*2/3) focus-ring focus-ring-$full" onClick={e => setChecked(curr => !curr)} tabindex="1" data-state-active={checked() || undefined}>
			<div class="flex-grow">
				<div class="px-($reduced-form-height/2) h-$reduced-form-height rounded-$full background-color:$faded-card-color flex-row flex-align-center gap-$gap">
					<Icon icon={Smiley} h="16px" />
					<Line w="35%" />
				</div>
			</div>
			<div class="radio grid grid-center">
				<IconPlaceholder h="8px" />
			</div>
		</div>
	</>
}
