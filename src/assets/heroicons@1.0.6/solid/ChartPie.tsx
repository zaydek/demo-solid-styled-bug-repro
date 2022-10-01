import { JSX, VoidProps } from "solid-js"

// https://unpkg.com/heroicons@1.0.6/solid/chart-pie.svg
export function ChartPie(props: VoidProps<{
	class?: string
	style?: string | JSX.CSSProperties
}>) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
		  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
		</svg>
	</>
}
