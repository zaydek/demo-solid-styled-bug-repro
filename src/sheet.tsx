import { ParentProps, Setter, Show } from "solid-js"
import { Bottomsheet, Sidesheet, SidesheetState } from "solid-sheet"
import { createMediaSignal } from "./utils/solid"

const responsive = createMediaSignal("(max-width: 499px)")

// Renders exclusively for responsive content
export function Responsive(props: ParentProps) {
	return <>
		<Show when={responsive()}>
			{props.children}
		</Show>
	</>
}

// Renders exclusively for non-responsive content
export function NonResponsive(props: ParentProps) {
	return <>
		<Show when={!responsive()}>
			{props.children}
		</Show>
	</>
}

export function BottomsheetOrSidesheet(props: ParentProps<{
	sidesheet:    SidesheetState
	setSidesheet: Setter<SidesheetState>
}>) {
	return <>
		<Responsive>
			<Bottomsheet initialState="closed">
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
