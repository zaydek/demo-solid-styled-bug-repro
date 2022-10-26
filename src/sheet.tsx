import { ParentProps, Show } from "solid-js"
import { Bottomsheet, Sidesheet } from "solid-sheet"
import { createMediaSignal } from "./utils/solid"

const responsive = createMediaSignal(`
	(hover: none),         /* E.g. touch devices */
	not (min-width: 500px) /* E.g. width < 500px */
`)

export function Sheet(props: ParentProps) {
	return <>
		{/* Use <Show> so we can use :root:has(.sidesheet) and
		:root:has(.bottomsheet) */}
		<Show when={responsive()}>
			<Bottomsheet initialState="closed">
				{props.children}
			</Bottomsheet>
		</Show>
		<Show when={!responsive()}>
			<Sidesheet initialState="open">
				{props.children}
			</Sidesheet>
		</Show>
	</>
}
