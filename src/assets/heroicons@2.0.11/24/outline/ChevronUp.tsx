// https://unpkg.com/heroicons@2.0.11/24/outline/chevron-up.svg
export function ChevronUp(props: {
	class?: string
	style?: string
}) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"></path>
		</svg>
	</>
}
