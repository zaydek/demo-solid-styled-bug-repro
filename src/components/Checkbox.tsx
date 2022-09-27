import { createSignal, VoidProps } from "solid-js"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

// TODO: Change VoidProps to ParentProps and add { icon: VoidComponent<CSSProps> }
export function Checkbox(props: VoidProps<{ active?: boolean }>) {
	const [checked, setChecked] = createSignal(props.active)

	return <>
		<style jsx>{`
			.checkbox {
				/* Query CSS variables */
				--height: var(--form-height);

				padding: 0 calc(var(--height) / 2);
				height: var(--height);
				border-radius: var(--full);
				background-color: var(--card-color);
				box-shadow: var(--inset-hairline-box-shadow);
			}
			.checkbox:is(:hover:active, [data-state-active]) {
				background-color: var(--hover-active-color);
				box-shadow: revert;
			}

			/********************************/

			.checkbox > :global(:not(:nth-child(3))) {
				transform: translateX(calc(16px / 2));

				/* transition */
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

				/* transition */
				transition: var(--duration-150) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.checkbox:is(:hover:active, [data-state-active]) > :global(:nth-child(3)) {
				color: white;
				transform: rotate(0) scale(1);
			}
		`}</style>
		<div class="checkbox flex-row flex-center gap-$gap focus-ring focus-ring-$full" onClick={e => setChecked(curr => !curr)} tabindex="1" data-state-active={checked() || undefined}>
			<Icon icon={Smiley} h="16px" />
			<Line w="35%" />
			<Icon icon={Smiley} h="16px" />
		</div>
	</>
}
