import { createRoot, createSignal, onMount, ParentProps, Setter } from "solid-js"
import { AriaButton } from "../aria"
import { createRef, css, sx } from "../solid-utils"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

const [mounted, setMounted] = createSignal<boolean>()

createRoot(() => {
	onMount(() => {
		setTimeout(() => {
			setMounted(true)
		}, 500) // Use an arbitrary timeout
	})
})

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
	const [spring, setSpring] = createSignal<number>(1.15)

	onMount(() => {
		const min = headRef()!.scrollHeight
		const max = ref()!.scrollHeight
		setMinHeight(`${min}px`)
		setMaxHeight(`${max}px`)
		setSpring(1 + min / max * 0.15)
	})

	return <>
		{css`
			.panel {
				height: var(--max-height);
				overflow-y: hidden;

				/* transition */
				transition: calc(500ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, var(--spring));
				transition-property: height;
			}
			.panel[data-state-collapsed] {
				height: var(--min-height);
			}

			/********************************/

			.panel-head {
				padding: var(--gap) var(--padding-x);
			}

			/********************************/

			.panel-body {
				padding: var(--padding);
				padding-top: 0; /* Override */

				/* transition */
				transition: calc(500ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, var(--spring));
				transition-property: transform, opacity;
			}
			/* .panel[data-state-collapsed][data-state-once] .panel-body { */
			/* 	opacity: 0; */
			/* } */
			.panel[data-state-collapsed][data-state-mounted] .panel-body {
				transform: scale(0.9);
				opacity: 0;
			}
		`}
		<section ref={setRef} class="panel" style={sx({ "--min-height": minHeight(), "--max-height": maxHeight(), "--spring": spring() })} data-state-collapsed={!props.open || undefined} data-state-mounted={mounted()}>
			<AriaButton ref={setHeadRef} class="panel-head focus-ring-group" onClick={e => props.setOpen(curr => !curr)}>
				<div class="px-($reduced-form-height/2) h-$reduced-form-height flex-row flex-align-center gap-$gap focus-ring focus-ring-$full">
					<Icon icon={Smiley} h="16px" />
					<Line w="25%" />
					<div class="flex-grow"></div>
					<Line w="10%" color="var(--fill-200-color)" />
				</div>
			</AriaButton>
			{/* @ts-expect-error: Property 'inert' does not exist on type 'HTMLAttributes<HTMLDivElement>'. ts(2322) */}
			<div class="panel-body flex-col gap-$gap" inert={!props.open || undefined}>
				{props.children}
			</div>
		</section>
	</>
}