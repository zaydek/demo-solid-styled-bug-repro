import { VoidComponent, VoidProps } from "solid-js"
import { AriaButton } from "../aria"
import { css } from "../solid-utils"
import { CSSProps } from "../solid-utils/extra-types"
import { Icon } from "./Primitives"

export function NavIcon(props: VoidProps<{
	icon: VoidComponent<CSSProps>

	active?: boolean
}>) {
	return <>
		{css`
			// Preamble
			.css-nav-icon { position: relative; }
			.css-nav-icon::before { content: ""; }

			//////////////////////////////////

			.css-nav-icon {
				height: 40px;
				aspect-ratio: 1;
				border-radius: var(--full);
			}
			.css-nav-icon::before {
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
			.css-nav-icon:hover::before {
				background-color: var(--card-color-is-before-active);
				transform: scale(1);
			}
			.css-nav-icon:is(:hover:active, [data-state-active])::before {
				background-color: var(--card-color-is-active);
				transform: scale(1);
			}

			//////////////////////////////////

			.css-nav-icon > .css-icon {
				color: var(--trim-color);
			}
			.css-nav-icon:is(:hover:active, [data-state-active]) > .css-icon {
				color: white;
			}
		`}
		{/* TODO: Use <Show> trick here */}
		<AriaButton class="css-nav-icon grid grid-center focus-ring focus-ring-$full" onClick={e => {/* TODO */}} data-state-active={props.active}>
			<Icon icon={props.icon} h="28px" />
		</AriaButton>
	</>
}
