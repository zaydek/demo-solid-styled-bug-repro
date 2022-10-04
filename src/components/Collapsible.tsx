import "./Collapsible.scss"

import { createSignal, onMount, ParentProps, Setter } from "solid-js"
import { AriaButton } from "../aria"
import { createRef, cx, sx } from "../solid-utils"
import { Smiley } from "./Smiley"

export function Collapsible(props: ParentProps<{
	title:    string
	subtitle: string

	open:    boolean
	setOpen: Setter<boolean>
}>) {
	const [ref, setRef] = createRef()
	const [headRef, setHeadRef] = createRef()

	const [minHeight, setMinHeight] = createSignal<"auto" | `${string}px`>("auto")
	const [maxHeight, setMaxHeight] = createSignal<"auto" | `${string}px`>("auto")

	onMount(() => {
		setMinHeight(`${headRef()!.scrollHeight}px`)
		setMaxHeight(`${ref()!.scrollHeight}px`)
	})

	return <>
		<section ref={setRef} class={cx(`collapsible ${!props.open && "is-collapsed"}`)} style={sx({ "--collapsible-min-height": minHeight(), "--collapsible-max-height": maxHeight() })}>
			<AriaButton ref={setHeadRef} class="collapsible-head focus-ring-group" onClick={e => props.setOpen(curr => !curr)}>
				<div class="px-calc($form2-height/2) h-$form2-height flex-row flex-align-center gap-$gap focus-ring focus-ring-$full">
					<Smiley class="h-16px aspect-1 color:$theme-color" />
					<div class="typography-caps">{props.title}</div>
					<div class="flex-grow"></div>
					<div class="typography-caps is-300">{props.subtitle}</div>
				</div>
			</AriaButton>
			{/* @ts-expect-error */}
			<div class="collapsible-body flex-col gap-$gap" inert={!props.open || undefined}>
				{props.children}
			</div>
		</section>
	</>
}
