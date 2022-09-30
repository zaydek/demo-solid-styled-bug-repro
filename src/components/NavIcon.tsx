import { VoidComponent, VoidProps } from "solid-js"
import { AriaButton } from "../aria"
import { css } from "../solid-utils"
import { CSSProps } from "../solid-utils/extra-types"
import { Icon } from "./Primitives"

export function NavIcon(props: VoidProps<{ icon: VoidComponent<CSSProps> }>) {
	return <>
		{css`
			/* Preamble */
			.component-nav-icon { position: relative; }
			.component-nav-icon::before { content: ""; }

			/********************************/

			.component-nav-icon {
				height: 48px;
				aspect-ratio: 1;
				border-radius: var(--full);
			}
			.component-nav-icon::before {
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
			.component-nav-icon:hover::before {
				background-color: var(--hover-color);
				transform: scale(1);
			}
			.component-nav-icon:is(:hover:active, [data-state-active])::before {
				background-color: var(--hover-active-color);
				transform: scale(1);
			}

			/********************************/

			.component-nav-icon > .component-icon {
				color: var(--theme-color);
			}
			.component-nav-icon:is(:hover:active, [data-state-active]) > .component-icon {
				color: white;
			}
		`}
		{/* TODO: Use <Show> trick here */}
		<AriaButton class="component-nav-icon grid grid-center focus-ring focus-ring-$full" onClick={e => {/* TODO */}}>
			<Icon icon={props.icon} h="32px" />
		</AriaButton>
	</>
}
