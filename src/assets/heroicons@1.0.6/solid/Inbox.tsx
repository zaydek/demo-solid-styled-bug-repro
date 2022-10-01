import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/solid/inbox.svg
export function Inbox(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clip-rule="evenodd"></path>
		</svg>
	</>
}
