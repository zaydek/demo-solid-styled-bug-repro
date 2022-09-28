import { JSX, Match, Setter, Switch, VoidProps } from "solid-js"
import { AriaCheckbox, AriaRadio } from "../aria"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

export function ColorButton(props: VoidProps<{
	checked:    boolean
	setChecked: Setter<boolean>

	// Style for CSS variables
	style?: string | JSX.CSSProperties
} | {
	value: string

	// Style for CSS variables
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<style jsx>{`
			.checkbox-button {
				/* Query CSS variables */
				--height: var(--form-height);

				padding: 0 calc(var(--height) / 2);
				height: var(--height);
				border-radius: var(--full);
				background-color: var(--card-color);
				box-shadow: var(--inset-hairline-box-shadow);
			}
			.checkbox-button:is(:hover:active, [aria-checked=true]) {
				background-color: var(--color, var(--theme-color));
				box-shadow: revert;
			}

			/********************************/

			.checkbox-button > :global(:nth-child(1)) {
				color: var(--color, var(--theme-color));
			}

			/********************************/

			.checkbox-button > :global(:not(:nth-child(3))) {
				transform: translateX(calc(16px / 2));

				/* transition */
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.checkbox-button:is(:hover:active, [aria-checked=true]) > :global(:not(:nth-child(3))) {
				color: white;
				transform: translateX(0);
			}
			/* TODO: Remove this when converting <Line> to <Text> */
			.checkbox-button:is(:hover:active, [aria-checked=true]) > :global(.line) {
				background-color: white;
			}

			/********************************/

			.checkbox-button > :global(:nth-child(3)) {
				color: transparent;
				transform: rotate(180deg) scale(0);

				/* transition */
				transition: calc(150ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.checkbox-button:is(:hover:active, [aria-checked=true]) > :global(:nth-child(3)) {
				color: white;
				transform: rotate(0) scale(1);
			}
		`}</style>
		<Switch>
			<Match when={"checked" in props && "setChecked" in props}>
				{/* @ts-expect-error */}
				<AriaCheckbox class="checkbox-button flex-row flex-center gap-$gap focus-ring focus-ring-$full" style={props.style ?? {}} checked={props.checked} setChecked={props.setChecked} use:solid-styled>
					<Icon icon={Smiley} h="16px" />
					<Line w="35%" />
					<Icon icon={Smiley} h="16px" />
				</AriaCheckbox>
			</Match>
			<Match when={"value" in props}>
				{/* @ts-expect-error */}
				<AriaRadio class="checkbox-button flex-row flex-center gap-$gap focus-ring focus-ring-$full" style={props.style ?? {}} value={props.value} use:solid-styled>
					<Icon icon={Smiley} h="16px" />
					<Line w="35%" />
					<Icon icon={Smiley} h="16px" />
				</AriaRadio>
			</Match>
		</Switch>
	</>
}
