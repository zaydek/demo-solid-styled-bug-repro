import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/outline/check.svg
export function Check(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
		</svg>
	</>
}
