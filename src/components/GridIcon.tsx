import { Smiley } from "./Smiley";

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
				border-radius: var(--border-radius);
			}
			.grid-icon-wrapper::before { content: ""; }
			.grid-icon-wrapper::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);

				/* TRANSITION */
				transition: 150ms cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group:hover .grid-icon-wrapper::before {
				background-color: var(--faded-base-color);
				transform: scale(1);
			}
			.group:hover:active .grid-icon-wrapper::before {
				background-color: var(--theme-color);
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

			svg.grid-icon {
				height: 32px;
				aspect-ratio: 1;
				color: var(--text-100-color);
			}
			.group:hover:active .grid-icon {
				color: white;
			}

			/********************************/

			.grid-text {
				height: 6px;
				width: 50%;
				border-radius: var(--full);
				background-color: var(--text-200-color);
			}
			.group:hover:active .grid-text {
				background-color: white;
			}
		`}</style>
		<div class="group grid grid-center">
			<div class="grid-icon-wrapper grid grid-center focus-ring focus-ring-32px" tabindex="0">
				<Smiley class="grid-icon" use:solid-styled />
				<div class="grid-text"></div>
			</div>
		</div>
	</>
}
