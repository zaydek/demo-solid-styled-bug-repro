import { FlowProps, JSX, Match, Setter, Switch } from "solid-js"
import { AriaCheckbox, AriaRadio } from "../aria"
import { css } from "../solid-utils"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

export function ColorButton(props: FlowProps<{
	checked:    boolean
	setChecked: Setter<boolean>

	// For CSS variables
	style?: string | JSX.CSSProperties
} | {
	value: string

	// For CSS variables
	style?: string | JSX.CSSProperties
}, string>) {
	return <>
		{css`
			.component-color-button {
				padding: 0 calc(var(--form-height) / 2);
				height: var(--form-height);
				border-radius: var(--full);
				background-color: var(--card-color);
				box-shadow: var(--inset-hairline-box-shadow);
			}
			.component-color-button:is(:hover:active, [aria-checked=true]) {
				background-color: var(--color, var(--theme-color));
				box-shadow: revert;
			}

			//////////////////////////////////

			.component-color-button > :nth-child(1) {
				color: var(--color, var(--theme-color));
			}

			//////////////////////////////////

			.component-color-button > :not(:nth-child(3)) {
				transform: translateX(calc(16px / 2));
				// TRANSITION
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.component-color-button:is(:hover:active, [aria-checked=true]) > :not(:nth-child(3)) {
				color: white;
				transform: translateX(0);
			}

			//////////////////////////////////

			.component-color-button > .typography-caps {
				color: var(--fill-100-color);
			}
			.component-color-button:is(:hover:active, [aria-checked=true]) > .typography-caps {
				font-weight: 600; // +100
				color: white;
			}

			//////////////////////////////////

			.component-color-button > :nth-child(3) {
				color: transparent;
				transform: rotate(180deg) scale(0);
				// TRANSITION
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.component-color-button:is(:hover:active, [aria-checked=true]) > :nth-child(3) {
				color: white;
				transform: rotate(0) scale(1);
			}
		`}
		<Switch>
			<Match when={"checked" in props && "setChecked" in props}>
				{/* @ts-expect-error */}
				<AriaCheckbox class="component-color-button flex-row flex-center gap-$gap focus-ring focus-ring-$full" style={props.style ?? {}} checked={props.checked} setChecked={props.setChecked}>
					<Icon icon={Smiley} h="16px" />
					<div class="typography-caps">{props.children}</div>
					<Icon icon={Smiley} h="16px" />
				</AriaCheckbox>
			</Match>
			<Match when={"value" in props}>
				{/* @ts-expect-error */}
				<AriaRadio class="component-color-button flex-row flex-center gap-$gap focus-ring focus-ring-$full" style={props.style ?? {}} value={props.value}>
					<Icon icon={Smiley} h="16px" />
					<div class="typography-caps">{props.children}</div>
					<Icon icon={Smiley} h="16px" />
				</AriaRadio>
			</Match>
		</Switch>
	</>
}
