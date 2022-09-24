import { createMemo, createRenderEffect, FlowProps, onCleanup, onMount } from "solid-js"

function removeComments(str: string) {
	return str
		.replace(/\n?\t*\/\/.*/g, "")                // E.g. // ...
		.replace(/\n?\t*\/\*(?:\n?.*?)*?\*\//gm, "") // E.g. /* ... */
}

function removeFalse(str: string) {
	return str.replace(/false/g, "")
}

//// export function Stylesheet(props: FlowProps<{ id?: string }, string>) {
export function css(str: string) {
	const textContent = createMemo(() => removeComments(removeFalse(str)))

	onMount(() => {
		const style = document.createElement("style")
		//// // TODO: Change to setAttribute?
		//// style.type = "text/css"
		//// if (props.id) {
		//// 	style.id = props.id
		//// }
		document.head.appendChild(style)
		createRenderEffect(() => {
			style.textContent = textContent()
			console.log(style.textContent)
		})
		onCleanup(() => {
			document.head.removeChild(style)
		})
	})

	return null
}
