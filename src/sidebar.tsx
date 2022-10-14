import { JSX, ParentProps, Show } from "solid-js";
import { Bottomsheet, Sidesheet } from "./components";
import { createMediaQuery } from "./effects";

const query = createMediaQuery("(min-width: 501px)")

export function Wide(props: ParentProps<{ fallback?: JSX.Element }>) {
	return <>
		<Show when={query()} fallback={props.fallback}>
			{props.children}
		</Show>
	</>
}

export function Sheet(props: ParentProps) {
	return <>
		<Wide fallback={<>
			<Bottomsheet initialState="closed">
				{props.children}
			</Bottomsheet>
		</>}>
			<Sidesheet initialState="open">
				{props.children}
			</Sidesheet>
		</Wide>
	</>
}
