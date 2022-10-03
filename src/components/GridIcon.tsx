import { AriaButton } from "../aria"
import { css } from "../solid-utils"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

export function GridIcon() {
	return <>
		{css`
			// Preamble
			.component-grid-icon { position: relative; }
			.component-grid-icon::before { content: ""; }

			//////////////////////////////////

			.component-grid-icon { position: relative; }
			.component-grid-icon {
				height: 100%;
				aspect-ratio: 1;
				border-radius: var(--search-results-grid-border-radius);
			}
			.component-grid-icon::before { content: ""; }
			.component-grid-icon::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);
				// TRANSITION
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group:hover .component-grid-icon::before {
				background-color: var(--hover-color);
				transform: scale(1);
			}
			.group:is(:hover:active, [data-state-active]) .component-grid-icon::before {
				background-color: var(--hover-active-color);
				transform: scale(1);
			}

			//////////////////////////////////

			.component-grid-icon {
				display: grid;
				grid-template:
					"." calc(32px / 2)
					"a" 1fr
					"b" 32px;
				place-items: center;
			}

			.component-grid-icon > :nth-child(1) { grid-area: a; }
			.component-grid-icon > :nth-child(2) { grid-area: b; }

			//////////////////////////////////

			.component-grid-icon > .component-icon {
				color: var(--fill-100-color);
			}
			.group:is(:hover:active, [data-state-active]) .component-grid-icon > .component-icon {
				color: white;
			}

			//////////////////////////////////

			// TODO: Remove when converting from <Line> to <Text>
			.component-grid-icon > .component-line {
				background-color: var(--fill-200-color);
			}
			.group:is(:hover:active, [data-state-active]) .component-grid-icon > .component-line {
				background-color: white;
			}
		`}
		<AriaButton as="article" class="group grid grid-center focus-ring-group" onClick={e => {/* TODO */}}>
			<div class="component-grid-icon grid grid-center focus-ring focus-ring-32px">
				<Icon icon={Smiley} h="32px" />
				<Line w="50%" />
			</div>
		</AriaButton>
	</>
}
