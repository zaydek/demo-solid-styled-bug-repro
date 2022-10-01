import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/solid/newspaper.svg
export function Newspaper(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path>
		  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
		</svg>
	</>
}
