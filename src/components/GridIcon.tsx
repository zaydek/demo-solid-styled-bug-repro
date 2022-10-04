import { Show, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { AriaButton } from "../aria"
import { css } from "../solid-utils"
import { IndexedResult, search, settings } from "../state"

export function GridIcon(props: VoidProps<{ info: IndexedResult }>) {
	return <>
		{css`
			// Preamble
			.css-grid-icon { position: relative; }
			.css-grid-icon::before { content: ""; }

			//////////////////////////////////

			.css-grid-icon { position: relative; }
			.css-grid-icon {
				height: 100%;
				aspect-ratio: 1;
				border-radius: 32px;
			}
			.css-grid-icon::before { content: ""; }
			.css-grid-icon::before {
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
			.group:hover .css-grid-icon::before {
				background-color: var(--card-color-is-before-active);
				transform: scale(1);
			}
			.group:is(:hover:active, [data-state-active]) .css-grid-icon::before {
				background-color: var(--card-color-is-active);
				transform: scale(1);
			}

			//////////////////////////////////

			.css-grid-icon {
				padding: 0 8px;
				display: grid;
				grid-template:
					"." calc(32px / 2)
					"a" 1fr
					"b" 32px;
				place-items: center;
			}
			.css-grid-icon > :nth-child(1) { grid-area: a; }
			.css-grid-icon > :nth-child(2) { grid-area: b; }

			//////////////////////////////////

			svg.css-grid-icon-svg {
				height: 28px;
				color: var(--fill-100-color);
			}
			.group:is(:hover:active, [data-state-active]) svg.css-grid-icon-svg {
				color: white;
			}

			//////////////////////////////////

			//// .css-grid-icon-label {
			//// 	cursor: text;
			//// 	user-select: all;
			//// 	-webkit-user-select: all;
			//// }
			.group:is(:hover:active, [data-state-active]) .css-grid-icon-label {
				color: white;
			}

			//////////////////////////////////

			//// .css-grid-icon-label-highlight {
			//// 	color: var(--highlight-color);
			//// }
			//// .group:is(:hover:active, [data-state-active]) .css-grid-icon-label-highlight {
			//// 	color: white;
			//// }
			////
			//// .css-grid-icon-label-highlight { position: relative; }
			//// .css-grid-icon-label-highlight::before { content: ""; }
			//// .css-grid-icon-label-highlight::before {
			//// 	position: absolute;
			//// 	z-index: -10;
			//// 	inset: 0;
			//// 	border-radius: 2px;
			//// 	background-color: var(--highlight-backdrop-color);
			//// }
			//// .group:is(:hover:active, [data-state-active]) .css-grid-icon-label-highlight::before {
			//// 	background-color: transparent;
			//// }
		`}
		<AriaButton as="article" class="group grid grid-center focus-ring-group" onClick={e => {/* TODO */}}>
			<div class="css-grid-icon grid grid-center focus-ring focus-ring-32px">
				{/* @ts-expect-error */}
				<Dynamic class="css-grid-icon-svg" component={settings.icons()?.[props.info.title]} />
				<div class="css-grid-icon-label type-sans is-200 has-ellipsis">
					{/* <Show when={props.info.index !== undefined} fallback={props.info.kebab}>
						<span>{props.info.kebab.slice(0, props.info.index!)}</span>
						<span class="css-grid-icon-label-highlight">{search.canonicalValue()}</span>
						<span>{props.info.kebab.slice(props.info.index! + search.canonicalValue().length)}</span>
					</Show> */}
					{props.info.kebab}
				</div>
			</div>
		</AriaButton>
	</>
}
