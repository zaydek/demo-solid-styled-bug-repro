import { VoidComponent, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { CSSProps } from "../solid-utils/extra-types"

export function NavIcon(props: VoidProps<{ icon: VoidComponent<CSSProps> }>) {
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

				/* TRANSITION */
				transition: 150ms cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.nav-icon-wrapper:hover::before {
				background-color: var(--faded-base-color);
				transform: scale(1);
			}
			.nav-icon-wrapper:hover:active::before {
				background-color: var(--theme-color);
				transform: scale(1);
			}

			/********************************/

			svg.nav-icon {
				height: 32px;
				aspect-ratio: 1;
				color: var(--text-100-color);
			}
			.nav-icon-wrapper:hover:active .nav-icon {
				color: white;
			}
		`}</style>
		<div class="nav-icon-wrapper group grid grid-center focus-ring focus-ring-$full" tabindex="0">
			<Dynamic component={props.icon} class="nav-icon" use:solid-styled />
		</div>
	</>
}
