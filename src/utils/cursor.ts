export function styleGlobalCursor(cursor: string, callback?: () => {}) {
	//// document.body.style.cursor = cursor
	callback?.()
}

export function unstyleGlobalCursor(callback?: () => {}) {
	//// document.body.style.cursor = ""
	//// if (!document.body.style.length) {
	//// 	document.body.removeAttribute("style")
	//// }
	callback?.()
}
