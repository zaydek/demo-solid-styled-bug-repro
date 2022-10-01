import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/solid/bookmark.svg
export function Bookmark(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
		</svg>
	</>
}
