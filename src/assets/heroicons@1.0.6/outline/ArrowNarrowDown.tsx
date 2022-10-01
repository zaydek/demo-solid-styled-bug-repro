import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/outline/arrow-narrow-down.svg
export function ArrowNarrowDown(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3"></path>
		</svg>
	</>
}
