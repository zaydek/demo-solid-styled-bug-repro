// https://unpkg.com/heroicons@2.0.11/24/outline/check.svg
export function Check(props: {
	class?: string
	style?: string
}) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
		</svg>
	</>
}
