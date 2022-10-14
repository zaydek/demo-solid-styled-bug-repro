import { createMemo } from "solid-js"
import { decomment } from "../utils/format"

export type CSS = ([raw]: TemplateStringsArray) => null

export function createCSS(scope?: HTMLElement, { prepend }: { prepend?: boolean } = {}) {
	const cache = new Map<string, true>()

	function css([raw]: TemplateStringsArray) {
		const str = createMemo(() => decomment(raw))
		if (cache.has(str())) { return null }

		// Create <style type="text/css">
		const style = document.createElement("style")
		style.setAttribute("type", "text/css")
		style.textContent = str()
		// Define lifecycle methods
		scope ??= document.head // Globally or locally-scoped
		cache.set(str(), true)
		if (prepend) scope!.prepend(style)
		else scope!.append(style)
		//// onCleanup(() => { // FIXME: Cache eviction isn’t working here
		//// 	cache.delete(str())
		//// 	style.remove()
		//// })

		return null
	}

	return css
}

// Globally-scoped
export const css = createCSS()
