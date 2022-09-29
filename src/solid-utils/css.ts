import { onCleanup, onMount } from "solid-js"

const _cssCache: Record<string, true> = {}

export function css([_css]: TemplateStringsArray) {
	if (_css in _cssCache) {
		return null
	} else {
		_cssCache[_css] = true
		onMount(() => {
			const style = document.createElement("style")
			style.setAttribute("type", "text/css")
			style.setAttribute("data-css", "")
			style.textContent = _css
			document.head.appendChild(style)
			onCleanup(() => {
				document.head.removeChild(style)
			})
		})
	}
	return null
}
