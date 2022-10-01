import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/outline/arrow-sm-left.svg
export function ArrowSmLeft(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
		</svg>
	</>
}
