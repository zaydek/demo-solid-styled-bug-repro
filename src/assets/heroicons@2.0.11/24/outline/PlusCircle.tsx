// https://unpkg.com/heroicons@2.0.11/24/outline/plus-circle.svg
export function PlusCircle(props: {
	class?: string
	style?: string
}) {
	return <>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" {...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
		</svg>
	</>
}
