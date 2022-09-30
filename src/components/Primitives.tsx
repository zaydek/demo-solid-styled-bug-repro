import { VoidComponent, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { css, sx } from "../solid-utils"
import { CSSProps } from "../solid-utils/extra-types"

export function Icon(props: VoidProps<{
	icon: VoidComponent<CSSProps>

	// CSS variables
	h:      string
	color?: string
}>) {
	return <>
		{css`
			.component-icon {
				height: var(--height);
				aspect-ratio: 1;
				color: var(--color, var(--fill-100-color));
			}
		`}
		<Dynamic component={props.icon} class="component-icon" style={sx({ "--height": props.h, "--color": props.color })} />
	</>
}

export function IconPlaceholder(props: VoidProps<{
	// CSS variables
	h:      string
	color?: string
}>) {
	return <>
		{css`
			.component-icon-placeholder {
				height: var(--height);
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: var(--color, var(--fill-100-color));
			}
		`}
		<div class="component-icon-placeholder" style={sx({ "--height": props.h, "--color": props.color })}></div>
	</>
}

export function Line(props: VoidProps<{
	// CSS variables
	h?:     string
	w:      string
	color?: string
}>) {
	return <>
		{css`
			.component-line {
				height: var(--height, 6px);
				width: var(--width);
				border-radius: var(--full);
				background-color: var(--color, var(--fill-100-color));
			}
		`}
		<div class="component-line" style={sx({ "--height": props.h, "--width": props.w, "--color": props.color })}></div>
	</>
}
