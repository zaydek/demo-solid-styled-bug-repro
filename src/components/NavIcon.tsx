import { createSignal, VoidComponent, VoidProps } from "solid-js"
import { AriaButton } from "../aria"
import { CSSProps } from "../solid-utils/extra-types"
import { Icon } from "./Primitives"

export function NavIcon(props: VoidProps<{ icon: VoidComponent<CSSProps> }>) {
	const [checked, setChecked] = createSignal(false)

	return <>
		<style jsx>{`
			/* Preamble */
			.nav-icon-wrapper { position: relative; }
			.nav-icon-wrapper::before { content: ""; }

			/********************************/

			.nav-icon-wrapper {
				height: 48px;
				aspect-ratio: 1;
				border-radius: var(--full);
			}
			.nav-icon-wrapper::before {
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
			.nav-icon-wrapper:hover::before {
				background-color: var(--hover-color);
				transform: scale(1);
			}
			.nav-icon-wrapper:is(:hover:active, [data-state-active])::before {
				background-color: var(--hover-active-color);
				transform: scale(1);
			}

			/********************************/

			.nav-icon-wrapper > :global(.icon) {
				color: var(--theme-color);
			}
			.nav-icon-wrapper:is(:hover:active, [data-state-active]) > :global(.icon) {
				color: white;
			}
		`}</style>
		<AriaButton class="nav-icon-wrapper grid grid-center focus-ring focus-ring-$full" onClick={e => setChecked(curr => !curr)} use:solid-styled>
			<Icon icon={props.icon} h="32px" />
		</AriaButton>
	</>
}
