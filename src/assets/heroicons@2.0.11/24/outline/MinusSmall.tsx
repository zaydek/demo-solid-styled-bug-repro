import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@2.0.11/24/outline/minus-small.svg
export function MinusSmall(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6"></path>
		</svg>
	</>
}
