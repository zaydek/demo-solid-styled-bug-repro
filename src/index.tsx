import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { render } from "solid-js/web"
import { StyleRegistry } from "solid-styled"
import { App } from "./App"

//// function Icon(props: ParentProps<CSSProps & {
//// 	height: string
//// 	color?: string
//// }>) {
//// 	return <>
//// 		{css`
//// 			.icon {
//// 				height: var(--height);
//// 				aspect-ratio: 1;
//// 				border-radius: var(--full);
//// 				background-color: var(--color, orange);
//// 			}
//// 		`}
//// 		<div class={cx("icon", props.class)} style={sx({ "--height": props.height, "--color": props.color })}>
//// 			{props.children}
//// 		</div>
//// 	</>
//// }
////
//// function App() {
//// 	return <>
//// 		<div class="flex-row flex-center gap-8px min-h-100vh">
//// 			<Icon class="grid grid-center" height="36px">
//// 				<Icon height="24px" color="blue" />
//// 			</Icon>
//// 			<Icon class="grid grid-center" height="36px" color="red">
//// 				<Icon height="24px" />
//// 			</Icon>
//// 			<Icon class="grid grid-center" height="88px" color="red">
//// 				<Icon height="36px" />
//// 			</Icon>
//// 		</div>
//// 	</>
//// }

render(() =>
	<StyleRegistry>
		<App />
	</StyleRegistry>,
	document.getElementById("root")!,
)
