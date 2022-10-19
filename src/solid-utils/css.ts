import { template } from "../utils"

export function createCSS(scope?: HTMLElement, { prepend }: { prepend?: boolean } = {}) {
	const cache = new Map<string, true>()

	function css(strings: TemplateStringsArray, ...keys: any[]) {
		const code = template(strings, ...keys)
		if (cache.has(code)) { return null }

		// Create <style type="text/css">
		const style = document.createElement("style")
		style.setAttribute("type", "text/css")
		style.textContent = code
		scope ??= document.head // Globally or locally-scoped
		cache.set(code, true)
		if (prepend) {
			scope!.prepend(style)
		} else {
			scope!.append(style)
		}
		//// onCleanup(() => { // FIXME: Cache eviction isn’t working here
		//// 	cache.delete(code)
		//// 	style.remove()
		//// })

		return null
	}

	return css
}

// Globally-scoped
export const css = createCSS()
