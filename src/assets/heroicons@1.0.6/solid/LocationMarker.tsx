import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/solid/location-marker.svg
export function LocationMarker(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
		</svg>
	</>
}
