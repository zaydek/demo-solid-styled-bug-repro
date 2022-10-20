import { JSX } from "solid-js"

export type RefProps = {
	ref?: (element: HTMLElement) => void
}

export type CSSProps = {
	class?: string
	style?: string | JSX.CSSProperties
}
