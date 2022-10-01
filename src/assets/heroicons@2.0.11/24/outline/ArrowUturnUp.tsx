import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@2.0.11/24/outline/arrow-uturn-up.svg
export function ArrowUturnUp(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3"></path>
		</svg>
	</>
}
