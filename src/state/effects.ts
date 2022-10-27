import { createEffect, createRoot, onCleanup } from "solid-js"
import { search } from "./search"
import { settings } from "./settings"

createRoot(() => {
	// Gets the next document.title
	const title = ({ visible }: { visible?: boolean } = {}) => {
		visible ??= true
		if (!visible) { return "Heroicons" }
		if (!search.canonicalValue()) {
			return "Heroicons"
		} else if (!search.results()) {
			return "0 results"
		}
		const { length } = search.results()!
		return `${search.canonicalValue()} — ${length} Icon${length === 1 ? "" : "s"}`
	}

	// https://.../?foo=bar
	createEffect(() => {
		const encoded: Record<string, string> = {}

		if (search.canonicalValue())        { encoded["search"]       = "" + search.canonicalValue() }
		if (settings.versionOpen.dirty())   { encoded["version-open"] = "" + settings.versionOpen() }
		if (settings.version.dirty())       { encoded["version"]      = "" + settings.version() }
		if (settings.variantOpen.dirty())   { encoded["variant-open"] = "" + settings.variantOpen() }

		if (settings.variantV1.dirty() || settings.variantV2.dirty()) {
			encoded["variant"] = "" + settings.variant().split("/").join("-")
		}

		if (settings.clipboardOpen.dirty()) { encoded["clipboard-open"] = "" + settings.clipboardOpen() }
		if (settings.license.dirty())       { encoded["license"]        = "" + settings.license() }
		if (settings.framework.dirty())     { encoded["framework"]      = "" + settings.framework() }
		if (settings.densityOpen.dirty())   { encoded["density-open"]   = "" + settings.densityOpen() }
		if (settings.density.dirty())       { encoded["density"]        = "" + settings.density() }
		if (settings.scaleOpen.dirty())     { encoded["scale-open"]     = "" + settings.scaleOpen() }
		if (settings.scale.dirty())         { encoded["scale"]          = "" + settings.scale() }
		if (settings.strokeOpen.dirty())    { encoded["stroke-open"]    = "" + settings.strokeOpen() }
		if (settings.stroke.dirty())        { encoded["stroke"]         = "" + settings.stroke() }

		if (!Object.keys(encoded).length) {
			window.history.replaceState({}, "", "/")
		} else {
			const params = new URLSearchParams(encoded)
			window.history.replaceState({}, "", `/?${params.toString()}`)
		}
	})

	// <title>...</title>
	createEffect(() => {
		function handleVisibilityChange(e: Event) {
			document.title = title({ visible: !document.hidden })
		}
		document.title = title()
		window.addEventListener("visibilitychange", handleVisibilityChange, false)
		onCleanup(() => window.removeEventListener("visibilitychange", handleVisibilityChange, false))
	})
})
