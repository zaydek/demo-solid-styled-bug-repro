import { onCleanup } from "solid-js"
import { template } from "../vanilla"

// Returns whether an element has a class name
export function hasClass(element: HTMLElement, className: string) {
	return element.classList.contains(className)
}

// Returns whether an element has a property name
export function hasStyle(element: HTMLElement, propertyName: string) {
	return element.style.getPropertyValue(propertyName) !== "" // Zero value
}

export function createCSS(scope?: HTMLElement, { prepend }: { prepend?: boolean } = {}) {
	const cache = new Map<string, true>()

	function css(strings: TemplateStringsArray, ...keys: any[]) {
		const _css = template(strings, ...keys).trim() + "\n" // EOF
		if (cache.has(_css)) { return }

		// Create <style type="text/css">
		const style = document.createElement("style")
		style.setAttribute("type", "text/css")
		style.textContent = _css
		scope ??= document.head // Globally or locally-scoped?
		cache.set(_css, true)
		if (prepend) {
			scope!.prepend(style)
		} else {
			scope!.append(style)
		}
		onCleanup(() => {
			cache.delete(_css)
			style.remove()
		})

		return void 0
	}

	return css
}

// Globally-scoped
export const css = createCSS()
