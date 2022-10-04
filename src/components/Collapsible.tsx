import { createRoot, createSignal, onMount, ParentProps, Setter } from "solid-js"
import { AriaButton } from "../aria"
import { createRef, css, sx } from "../solid-utils"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

//// createRoot(() => {
//// 	onMount(() => {
//// 		setTimeout(() => {
//// 			document.body.setAttribute("data-state-mounted", "")
//// 		}, 1_000)
//// 	})
//// })

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
			.css-panel {
				height: var(--max-height);
				overflow-y: hidden;
				// TRANSITION
				//// transition: calc(300ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, var(--spring));
				transition: calc(300ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1);
				transition-property: height;
			}
			.css-panel[data-state-collapsed] {
				height: var(--min-height);
			}

			//////////////////////////////////

			.css-panel-head {
				padding: var(--gap) var(--padding-x);
			}

			//////////////////////////////////

			.css-panel-body {
				padding: var(--padding);
				padding-top: 0; // Override padding
				// TRANSITION
				//// transition: calc(300ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, var(--spring));
				transition: calc(300ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, 1);
				transition-property: transform, opacity;
			}
			//// body[data-state-mounted] .css-panel[data-state-collapsed] .css-panel-body {
			//// 	transform: scale(0.9);
			//// 	opacity: 0;
			//// }
			.css-panel[data-state-collapsed] .css-panel-body {
				//// transform: scale(0.9);
				opacity: 0;
			}
		`}
		<section ref={setRef} class="css-panel" style={sx({ "--min-height": minHeight(), "--max-height": maxHeight() /* , "--spring": spring() */ })} data-state-collapsed={!props.open || undefined}>
			<AriaButton ref={setHeadRef} class="css-panel-head focus-ring-group" onClick={e => props.setOpen(curr => !curr)}>
				<div class="px-calc($reduced-form-height/2) h-$reduced-form-height flex-row flex-align-center gap-$gap focus-ring focus-ring-$full">
					<Smiley class="h-16px aspect-1 color:$theme-color" />
					<div class="type-caps">
						{props.title}
					</div>
					<div class="flex-grow"></div>
					<div class="type-caps is-300">
						{props.subtitle}
					</div>
				</div>
			</AriaButton>
			{/* @ts-expect-error: Property 'inert' does not exist on type 'HTMLAttributes<HTMLDivElement>'. ts(2322) */}
			<div class="css-panel-body flex-col gap-$gap" inert={!props.open || undefined}>
				{props.children}
			</div>
		</section>
	</>
}
