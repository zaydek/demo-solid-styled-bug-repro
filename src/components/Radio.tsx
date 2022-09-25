import { active } from "./DEBUG_active";
import { Icon, IconPlaceholder, Line } from "./Primitives";
import { Smiley } from "./Smiley";

export function Radio() {
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
				box-shadow: var(--inset-box-shadow);
			}
			.radio::after {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);

				/* TRANSITION */
				transition: var(--duration-150) cubic-bezier(0, 1, 0.25, 1.15);
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

				/* TRANSITION */
				transition: var(--duration-150) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group:is(:hover:active, [data-state-active]) .radio > :global(.icon-placeholder) {
				background-color: white;
				transform: scale(1);
			}
		`}</style>
		<div class="group flex-row gap-$gap focus-ring focus-ring-$full" tabindex="1" data-state-active={active()}>
			<div class="flex-grow">
				<div class="px-($reduced-form-height/2) h-$reduced-form-height rounded-$full background-color:$faded-base-color flex-row flex-align-center gap-$gap">
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
