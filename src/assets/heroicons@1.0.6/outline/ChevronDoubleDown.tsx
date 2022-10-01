import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/outline/chevron-double-down.svg
export function ChevronDoubleDown(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7"></path>
		</svg>
	</>
}
