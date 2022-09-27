import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { render } from "solid-js/web"
import { StyleRegistry } from "solid-styled"
import { App } from "./App"

//// function Panel(props: ParentProps<{
//// 	title:    string
//// 	subtitle: string
////
//// 	open?: true
//// }>) {
//// 	const [ref, setRef] = createSignal<HTMLElement>()
//// 	const [headRef, setHeadRef] = createSignal<HTMLElement>()
////
//// 	const [open, setOpen] = createSignal(props.open)
////
//// 	const [collapseHeight, setCollapseHeight] = createSignal<"auto" | `${string}px`>("auto")
//// 	const [expandedHeight, setExpandedHeight] = createSignal<"auto" | `${string}px`>("auto")
//// 	const [spring, setSpring] = createSignal<number>(1.15)
////
//// 	onMount(() => {
//// 		const min = headRef()!.scrollHeight
//// 		const max = ref()!.scrollHeight
//// 		setCollapseHeight(`${min}px`)
//// 		setExpandedHeight(`${max}px`)
//// 		setSpring(1 + min / max * 0.15)
//// 	})
////
//// 	return <>
//// 		<style jsx>{`
//// 			.panel,
//// 			.panel * {
//// 				outline: 1px solid red;
//// 			}
////
//// 			/********************************/
////
//// 			.panel {
//// 				height: ${expandedHeight()};
//// 				box-shadow: 0 0 0 1px hsl(0deg 0% 50%);
//// 				overflow-y: hidden;
////
//// 				/* transition */
//// 				transition: 500ms cubic-bezier(0, 1, 0.25, ${spring()});
//// 				transition-property: height;
//// 			}
//// 			.panel:not([data-state-open]) {
//// 				height: ${collapseHeight()};
//// 			}
////
//// 			/********************************/
////
//// 			.panel-head {
//// 				padding: 16px;
//// 				gap: var(--gap);
//// 			}
////
//// 			/********************************/
////
//// 			.panel-body {
//// 				padding: 16px;
//// 				padding-top: 0; /* Override padding */
//// 				opacity: 1;
////
//// 				/* transition */
//// 				transition: 500ms cubic-bezier(0, 1, 0.25, ${spring()});
//// 				transition-property: opacity;
//// 			}
//// 			.panel:not([data-state-open]) .panel-body {
//// 				opacity: 0;
//// 			}
//// 		`}</style>
//// 		<div ref={setRef} class="panel" data-state-open={open()} onClick={e => setOpen(curr => curr === true ? undefined : true)}>
//// 			<div ref={setHeadRef} class="panel-head flex-row flex-align-center cursor:pointer user-select:none">
//// 				{/* <div>{props.title}</div>
//// 				<div class="flex-grow"></div>
//// 				<div>{props.subtitle}</div> */}
//// 				<Icon icon={Smiley} h="16px" />
//// 				<Line w="25%" />
//// 				<div class="flex-grow"></div>
//// 				<Line w="10%" color="var(--fill-200-color)" />
//// 			</div>
//// 			<div class="panel-body">
//// 				{props.children}
//// 			</div>
//// 		</div>
//// 	</>
//// }
////
//// function App() {
//// 	return <>
//// 		<div class="p-128px grid grid-center">
//// 			<div class="w-100% max-w-384px">
//// 				<Panel title="foo" subtitle="bar" open>
//// 					<div>Hello, world!</div>
//// 					<div>Hello, world!</div>
//// 					<div>Hello, world!</div>
//// 					<div>Hello, world!</div>
//// 					<div>Hello, world!</div>
//// 					<div>Hello, world!</div>
//// 					<div>Hello, world!</div>
//// 					<div>Hello, world!</div>
//// 				</Panel>
//// 			</div>
//// 		</div>
//// 	</>
//// }

render(() =>
	<StyleRegistry>
		<App />
	</StyleRegistry>,
	document.getElementById("root")!,
)
