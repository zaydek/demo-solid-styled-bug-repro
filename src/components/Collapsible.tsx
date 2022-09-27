import { createSignal, onMount, ParentProps } from "solid-js"
import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

export function Collapsible(props: ParentProps<{
	title:    string
	subtitle: string

	open?: true
}>) {
	const [ref, setRef] = createSignal<HTMLElement>()
	const [headRef, setHeadRef] = createSignal<HTMLElement>()

	const [open, setOpen] = createSignal(props.open)

	const [collapseHeight, setCollapseHeight] = createSignal<"auto" | `${string}px`>("auto")
	const [expandedHeight, setExpandedHeight] = createSignal<"auto" | `${string}px`>("auto")
	const [spring, setSpring] = createSignal<number>(1.15)

	onMount(() => {
		const min = headRef()!.scrollHeight
		const max = ref()!.scrollHeight
		setCollapseHeight(`${min}px`)
		setExpandedHeight(`${max}px`)
		setSpring(1 + min / max * 0.15)
	})

	return <>
		<style jsx>{`
			.panel {
				padding: 0 var(--padding-x);
				height: ${expandedHeight()};
				overflow-y: hidden;

				/* transition */
				transition: calc(500ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, ${spring()});
				transition-property: height;
			}
			.panel:not([data-state-open]) {
				height: ${collapseHeight()};
			}

			/********************************/

			.panel-head {
				padding: var(--padding-y) 0;
				height: calc(var(--padding-y) + var(--reduced-form-height) + var(--gap));
			}

			/********************************/

			.panel-body {
				padding: var(--padding-y) 0;
				padding-top: 0; /* Override */

				/* transition */
				transition: calc(500ms * var(--motion-safe)) cubic-bezier(0, 1, 0.25, ${spring()});
				transition-property: transform, opacity;
			}
			.panel:not([data-state-open]) .panel-body {
				transform: scale(0.9);
				opacity: 0;
			}
		`}</style>
		<div ref={setRef} class="panel" data-state-open={open()}>
			<div ref={setHeadRef} class="panel-head" onClick={e => setOpen(curr => curr === true ? undefined : true)}>
				<div class="px-($reduced-form-height/2) h-$reduced-form-height flex-row flex-align-center gap-$gap focus-ring focus-ring-$full" tabindex="1">
					<Icon icon={Smiley} h="16px" />
					<Line w="25%" />
					<div class="flex-grow"></div>
					<Line w="10%" color="var(--fill-200-color)" />
				</div>
			</div>
			{/* @ts-expect-error: Property 'inert' does not exist on type 'HTMLAttributes<HTMLDivElement>'. ts(2322) */}
			<div class="panel-body flex-col gap-$gap" inert={!open() || undefined}>
				{props.children}
			</div>
		</div>
	</>
}
