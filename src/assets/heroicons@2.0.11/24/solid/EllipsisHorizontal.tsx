import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@2.0.11/24/solid/ellipsis-horizontal.svg
export function EllipsisHorizontal(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
			<path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd"></path>
		</svg>
	</>
}
