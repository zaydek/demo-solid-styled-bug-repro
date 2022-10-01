import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@2.0.11/20/solid/minus-small.svg
export function MinusSmall(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"></path>
		</svg>
	</>
}
