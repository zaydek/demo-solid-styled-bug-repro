import { createSignal } from "solid-js"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

const [active, setActive] = createSignal<boolean>()

setInterval(() => {
	setActive(curr => curr === undefined ? true : undefined)
}, 1_000)

export function Checkbox() {
	return <>
		<style jsx>{`
			.checkbox {
				/* Query CSS variables */
				--height: var(--form-height);

				padding: 0 calc(var(--height) / 2);
				height: var(--height);
				border-radius: var(--full);
				background-color: var(--base-color);
				box-shadow: var(--inset-hairline-box-shadow);
			}
			.checkbox:is(:hover:active, [data-state-active]) {
				background-color: var(--hover-active-color);
				box-shadow: revert;
			}

			/********************************/

			.checkbox > :global(:not(:nth-child(3))) {
				transform: translateX(calc(16px / 2));

				/* TRANSITION */
				transition: var(--duration-150) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.checkbox:is(:hover:active, [data-state-active]) > :global(:not(:nth-child(3))) {
				color: white;
				transform: translateX(0);
			}
			/* TODO: Remove this when converting <Line> to <Text> */
			.checkbox:is(:hover:active, [data-state-active]) > :global(.line) {
				background-color: white;
			}

			/********************************/

			.checkbox > :global(:nth-child(3)) {
				color: transparent;
				transform: rotate(180deg) scale(0);

				/* TRANSITION */
				transition: var(--duration-150) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.checkbox:is(:hover:active, [data-state-active]) > :global(:nth-child(3)) {
				color: white;
				transform: rotate(0) scale(1);
			}
		`}</style>
		<div class="checkbox flex-row flex-center gap-$gap focus-ring focus-ring-$full" tabindex="0" data-state-active={active()}>
			<Icon icon={Smiley} h="16px" />
			<Line w="35%" />
			<Icon icon={Smiley} h="16px" />
		</div>
	</>
}
