import { createEffect, createRoot } from "solid-js"
import { search } from "./search"
import { settings } from "./settings"

let once = 0
createRoot(() => {
	createEffect(() => {
		const encoded: Record<string, string> = {}

		if (search.canonicalValue())          { encoded["search"]         = "" + (search.canonicalValue()) }
		if (settings.versionOpen.dirty())     { encoded["version-open"]   = "" + (settings.versionOpen() ? "t" : "f") }
		if (settings.version.dirty())         { encoded["version"]        = "" + (settings.version()) }
		if (settings.variantOpen.dirty())     { encoded["variant-open"]   = "" + (settings.variantOpen() ? "t" : "f") }

		if (settings.variantV1.dirty() || settings.variantV2.dirty()) {
			encoded["variant"] = "" + settings.variant().split("/").join("-")
		}

		if (settings.clipboardOpen.dirty())   { encoded["clipboard-open"] = "" + (settings.clipboardOpen() ? "t" : "f") }
		if (settings.densityOpen.dirty())     { encoded["density-open"]   = "" + (settings.densityOpen() ? "t" : "f") }
		if (settings.density.dirty())         { encoded["density"]        = "" + (settings.density()) }
		if (settings.sizeOpen.dirty())        { encoded["size-open"]      = "" + (settings.sizeOpen() ? "t" : "f") }
		if (settings.density.dirty())         { encoded["size"]           = "" + (settings.size()) }
		if (settings.strokeWidthOpen.dirty()) { encoded["stroke-open"]    = "" + (settings.strokeWidthOpen() ? "t" : "f") }
		if (settings.density.dirty())         { encoded["stroke"]         = "" + (settings.strokeWidth()) }

		if (!once) {
			once++
			return
		}

		if (!Object.keys(encoded).length) {
			window.history.replaceState({}, "", "/")
		} else {
			const params = new URLSearchParams(encoded)
			window.history.replaceState({}, "", `/?${params.toString()}`)
		}
	})
})
