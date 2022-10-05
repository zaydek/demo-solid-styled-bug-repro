import "./ColorButton.scss"

import { FlowProps, JSX, Match, Setter, Switch } from "solid-js"
import { AriaCheckbox, AriaRadio } from "../aria"
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
		<Switch>
			<Match when={"checked" in props && "setChecked" in props}>
				{/* @ts-expect-error */}
				<AriaCheckbox class="color-button flex-row flex-center gap-$gap focus-ring focus-ring-$full" style={props.style} checked={props.checked} setChecked={props.setChecked}>
					<Smiley class="h-16px aspect-1" />
					<div class="typography-caps">{props.children}</div>
					<Smiley class="h-16px aspect-1" />
				</AriaCheckbox>
			</Match>
			<Match when={"value" in props}>
				{/* @ts-expect-error */}
				<AriaRadio class="color-button flex-row flex-center gap-$gap focus-ring focus-ring-$full" style={props.style} value={props.value}>
					<Smiley class="h-16px aspect-1" />
					<div class="typography-caps">{props.children}</div>
					<Smiley class="h-16px aspect-1" />
				</AriaRadio>
			</Match>
		</Switch>
	</>
}
