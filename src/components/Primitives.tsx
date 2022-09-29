import { VoidComponent, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { CSSProps } from "../solid-utils/extra-types"

export function Icon(props: VoidProps<{
	icon: VoidComponent<CSSProps>

	// CSS
	h:      string
	color?: string
}>) {
	return <>
		<style jsx>{`
			.icon {
				height: ${props.h};
				aspect-ratio: 1;
				color: ${props.color ??
					"var(--fill-100-color)"};
			}
		`}</style>
		<Dynamic component={props.icon} class="icon" use:solid-styled />
	</>
}

export function IconPlaceholder(props: VoidProps<{
	h:      string
	color?: string
}>) {
	return <>
		<style jsx>{`
			.icon-placeholder {
				height: ${props.h};
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: ${props.color ??
					"var(--fill-100-color)"};
			}
		`}</style>
		<div class="icon-placeholder"></div>
	</>
}

export function Line(props: VoidProps<{
	h?:     string
	w:      string
	color?: string
}>) {
	return <>
		<style jsx>{`
			.line {
				height: ${props.h ?? "6px"};
				width: ${props.w};
				border-radius: var(--full);
				background-color: ${props.color ??
					"var(--fill-100-color)"};
			}
		`}</style>
		<div class="line"></div>
	</>
}
