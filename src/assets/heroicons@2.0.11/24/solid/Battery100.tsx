import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@2.0.11/24/solid/battery-100.svg
export function Battery100(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
			<path fill-rule="evenodd" d="M3.75 6.75a3 3 0 00-3 3v6a3 3 0 003 3h15a3 3 0 003-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 00-3-3h-15zm15 1.5a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-6a1.5 1.5 0 011.5-1.5h15zM4.5 9.75a.75.75 0 00-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75H4.5z" clip-rule="evenodd"></path>
		</svg>
	</>
}
