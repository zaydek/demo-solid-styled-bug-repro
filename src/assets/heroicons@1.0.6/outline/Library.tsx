import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/outline/library.svg
export function Library(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
		</svg>
	</>
}
