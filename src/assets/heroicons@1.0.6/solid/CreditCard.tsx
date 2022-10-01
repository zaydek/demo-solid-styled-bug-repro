import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/solid/credit-card.svg
export function CreditCard(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
		  <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
		</svg>
	</>
}
