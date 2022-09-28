import { AriaButton } from "../aria"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

export function GridIcon() {
	return <>
		<style jsx>{`
			/* Preamble */
			.grid-icon-wrapper { position: relative; }
			.grid-icon-wrapper::before { content: ""; }

			/********************************/

			.grid-icon-wrapper { position: relative; }
			.grid-icon-wrapper {
				height: 100%;
				aspect-ratio: 1;
				border-radius: var(--border-radius); /* From search results */
			}
			.grid-icon-wrapper::before { content: ""; }
			.grid-icon-wrapper::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);

				/* transition */
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group:hover .grid-icon-wrapper::before {
				background-color: var(--hover-color);
				transform: scale(1);
			}
			.group:is(:hover:active, [data-state-active]) .grid-icon-wrapper::before {
				background-color: var(--hover-active-color);
				transform: scale(1);
			}

			/********************************/

			.grid-icon-wrapper {
				display: grid;
				grid-template:
					"." calc(32px / 2)
					"a" 1fr
					"b" 32px;
				place-items: center;
			}

			.grid-icon-wrapper > :global(:nth-child(1)) { grid-area: a; }
			.grid-icon-wrapper > :global(:nth-child(2)) { grid-area: b; }

			/********************************/

			.grid-icon-wrapper > :global(.icon) {
				color: var(--fill-100-color);
			}
			.group:is(:hover:active, [data-state-active]) .grid-icon-wrapper > :global(.icon) {
				color: white;
			}

			/********************************/

			/* TODO: Remove this when converting <Line> to <Text> */
			.grid-icon-wrapper > :global(.line) {
				background-color: var(--fill-200-color);
			}
			.group:is(:hover:active, [data-state-active]) .grid-icon-wrapper > :global(.line) {
				background-color: white;
			}
		`}</style>
		<AriaButton as="article" class="group grid grid-center focus-ring-group" onClick={e => {/* TODO */}} use:solid-styled>
			<div class="grid-icon-wrapper grid grid-center focus-ring focus-ring-32px">
				<Icon icon={Smiley} h="32px" />
				<Line w="50%" />
			</div>
		</AriaButton>
	</>
}
