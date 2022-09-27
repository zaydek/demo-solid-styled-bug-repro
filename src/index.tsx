import "the-new-css-reset"
import "virtual:uno.css"
import "./scss/index.scss"

import { createSignal, onMount } from "solid-js"
import { render } from "solid-js/web"
import { StyleRegistry } from "solid-styled"
import { AriaCheckbox } from "./aria/AriaCheckbox"
import { createRef } from "./solid-utils"
import { AriaRadio, AriaRadiogroup } from "./aria/AriaRadio"
//// import { App } from "./App"

//// function App() {
//// 	const [checked, setChecked] = createSignal(false)
////
//// 	const [ref, setRef] = createRef()
////
//// 	onMount(() => {
//// 		console.log(ref())
//// 	})
////
//// 	return <>
//// 		<style jsx>{`
//// 			/* https://twitter.com/LeaVerou/status/1045768279753666562 */
//// 			.checkbox {
//// 				height: 32px;
//// 				aspect-ratio: 4;
//// 				border-radius: var(--full);
//// 				background-color: red;
//// 			}
//// 			.checkbox[aria-checked=true] {
//// 				background-color: pink;
//// 			}
//// 			.checkbox:focus-visible {
//// 				box-shadow: 0 0 0 4px blue;
//// 			}
//// 		`}</style>
//// 		<div class="grid grid-center min-h-100vh">
//// 			<AriaCheckbox ref={setRef} class="checkbox" checked={checked()} onClick={e => setChecked(curr => !curr)} use:solid-styled>
//// 				<div>Hello, world!</div>
//// 			</AriaCheckbox>
//// 		</div>
//// 		<div class="h-100vh"></div>
//// 		<div class="h-100vh"></div>
//// 		<div class="h-100vh"></div>
//// 	</>
//// }

function App() {
	const [value, setValue] = createSignal("foo")

	return <>
		<style jsx>{`
			.radio {
				height: 24px;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: red;
			}
			.radio[aria-checked=true] {
				background-color: darkred;
			}
			.radio:focus-visible {
				box-shadow: 0 0 0 2px blue;
			}
		`}</style>
		<div class="grid grid-center min-h-100vh">
			<AriaRadiogroup class="radiogroup flex-row gap-16px" value={value()} setValue={setValue} use:solid-styled>
				<AriaRadio class="radio" value="foo" use:solid-styled></AriaRadio>
				<AriaRadio class="radio" value="bar" use:solid-styled></AriaRadio>
				<AriaRadio class="radio" value="baz" use:solid-styled></AriaRadio>
			</AriaRadiogroup>
		</div>
	</>
}

render(() =>
	<StyleRegistry>
		<App />
	</StyleRegistry>,
	document.getElementById("root")!,
)
