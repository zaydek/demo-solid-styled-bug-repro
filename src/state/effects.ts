import { createDeferred, createEffect, createRoot, on, onCleanup } from "solid-js"
import { search } from "./search"
import { settings } from "./settings"

function getTitle({ visible }: { visible?: boolean } = {}) {
	visible ??= true
	if (!visible) { return "Heroicons" }
	if (!settings.icons()) {
		return "Loading…"
	}
	const length = search.results()!.length
	return `${length} Icon${length === 1 ? "" : "s"}`
}

function getURL() {
	const params: Record<string, string> = {}

	if (search.canonicalValue())    { params["search"]    = "" + search.canonicalValue() }
	if (settings.version.dirty())   { params["version"]   = "" + settings.version() }
	if (settings.variantV1.dirty() || settings.variantV2.dirty()) {
		params["variant"] = "" + settings.variant().split("/").join("-")
	}
	if (settings.license.dirty())   { params["license"]   = "" + settings.license() }
	if (settings.framework.dirty()) { params["framework"] = "" + settings.framework() }
	if (settings.scale.dirty())     { params["scale"]     = "" + settings.scale() }
	if (settings.stroke.dirty())    { params["stroke"]    = "" + settings.stroke() }

	if (!Object.keys(params).length) { return "/" }
	const urlParams = new URLSearchParams(params)
	return `/?${urlParams.toString()}`
}

createRoot(() => {
	const url = createDeferred(getURL, { timeoutMs: 500 })
	createEffect(on(url, () => {
		const url = getURL()
		const timeoutId = window.setTimeout(() => {
			window.history.replaceState({}, "", url)
		}, 100)
		onCleanup(() => window.clearTimeout(timeoutId))
	}, { defer: true }))

	createEffect(() => {
		function handleVisibilityChange(e: Event) {
			document.title = getTitle({ visible: !document.hidden })
		}
		document.title = getTitle()
		window.addEventListener("visibilitychange", handleVisibilityChange, false)
		onCleanup(() => window.removeEventListener("visibilitychange", handleVisibilityChange, false))
	})
})
