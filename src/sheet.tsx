import { ParentProps, Show } from "solid-js"
import { Bottomsheet, Sidesheet } from "solid-sheet"
import { createMediaSignal } from "./utils/solid"

const [showBottomsheet] = createMediaSignal(`(hover: none), not (min-width: 500px`)

export function Sheet(props: ParentProps) {
	return <>
		{/* Use <Show> so we can use :root:has(.sidesheet) and
		:root:has(.bottomsheet) */}
		<Show when={showBottomsheet()}>
			<Bottomsheet initialState="closed">
				{props.children}
			</Bottomsheet>
		</Show>
		<Show when={!showBottomsheet()}>
			<Sidesheet initialState={window.innerWidth >= 800 ? "open" : "closed"}>
				{props.children}
			</Sidesheet>
		</Show>
	</>
}
