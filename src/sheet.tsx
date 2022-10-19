import { ParentProps, Setter, Show } from "solid-js"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { createMediaQuery } from "./effects"

const responsive = createMediaQuery("(max-width: 499px)")

// Renders exclusively for "responsive" devices
export function Responsive(props: ParentProps) {
	return <>
		<Show when={responsive()}>
			{props.children}
		</Show>
	</>
}

// Renders exclusively for "non-responsive" devices
export function NonResponsive(props: ParentProps) {
	return <>
		<Show when={!responsive()}>
			{props.children}
		</Show>
	</>
}

export function Sheet(props: ParentProps<{
	sidesheet:    SidesheetState
	setSidesheet: Setter<SidesheetState>
}>) {
	return <>
		<Responsive>
			<Bottomsheet initialState="open">
				{props.children}
			</Bottomsheet>
		</Responsive>
		<NonResponsive>
			<Sidesheet state={props.sidesheet} setState={props.setSidesheet}>
				{props.children}
			</Sidesheet>
		</NonResponsive>
	</>
}
