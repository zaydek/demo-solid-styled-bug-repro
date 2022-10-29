import { createSignal, JSX, onMount, ParentProps } from "solid-js"
import { AriaButton } from "./aria"
import { css } from "./utils/solid"
import { cx, only } from "./utils/vanilla"

export function Drawer(props: ParentProps<{
	head: JSX.Element

	open?: boolean
}>) {
	const [ref, setRef] = createSignal<HTMLElement>()
	const [headRef, setHeadRef] = createSignal<HTMLElement>()

	const [open, setOpen] = createSignal(props.open ?? true)

	// DEBUG
	window.addEventListener("keydown", e => {
		if (e.key === "d") {
			setOpen(curr => !curr)
		}
	})

	onMount(() => {
		ref()!.style.setProperty("--__min-height", `${headRef()!.scrollHeight}px`)
		ref()!.style.setProperty("--__max-height", `${ref()!.scrollHeight}px`)
	})

	return <>
		{css`
.drawer {
	--__min-height: auto;
	--__max-height: auto;
}
.drawer {
	transition: 300ms cubic-bezier(0, 1, 0.25, 1.05);
	transition-property: height;

	cursor: pointer;
	-webkit-user-select: none;
	user-select: none;
}
.drawer.closed {
	height: var(--__min-height);
	overflow-y: clip;
}
.drawer.open {
	height: var(--__max-height);
	overflow-y: clip;
}

/**************************************/

.drawer-body {
	transition: 300ms cubic-bezier(0, 1, 0.25, 1.05);
	transition-property: transform, opacity;
}
.drawer.open .drawer-body {
	transform: scale(1);
	opacity: 1;
}
.drawer.closed .drawer-body {
	transform: scale(0.9);
	opacity: 0;
}
		`}
		<div ref={setRef} class={cx(`drawer ${open() ? "open" : "closed"}`)}>
			<AriaButton ref={setHeadRef} class="drawer-head" onClick={e => setOpen(curr => !curr)}>
				{props.head}
			</AriaButton>
			{/* @ts-expect-error */}
			<div class="drawer-body" inert={only(!open())}>
				{props.children}
			</div>
		</div>
	</>
}
