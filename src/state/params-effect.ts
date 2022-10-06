import { createEffect, createRoot } from "solid-js"
import { search } from "./search"
import { settings } from "./settings"

createRoot(() => {
	createEffect(() => {
		const encoded: Record<string, string> = {}

		function encode(key: string, value: unknown) {
			if (typeof value === "boolean") {
				encoded[key] = value ? "t" : "f"
			} else {
				encoded[key] = "" + value
			}
		}

		if (search.canonicalValue())        { encode("search", search.canonicalValue()) }
		if (settings.versionOpen.dirty())   { encode("version-open", settings.versionOpen()) }
		if (settings.version.dirty())       { encode("version", settings.version()) }
		if (settings.variantOpen.dirty())   { encode("variant-open", settings.variantOpen()) }

		if (settings.variantV1.dirty() || settings.variantV2.dirty()) {
			encode("variant", settings.variant().split("/").join("-"))
		}

		if (settings.clipboardOpen.dirty()) { encode("clipboard-open", settings.clipboardOpen()) }
		if (settings.license.dirty())       { encode("license", settings.license()) }
		if (settings.framework.dirty())     { encode("framework", settings.framework()) }
		if (settings.densityOpen.dirty())   { encode("density-open", settings.densityOpen()) }
		if (settings.density.dirty())       { encode("density", settings.density()) }
		if (settings.sizeOpen.dirty())      { encode("size-open", settings.sizeOpen()) }
		if (settings.size.dirty())          { encode("size", settings.size()) }
		if (settings.strokeOpen.dirty())    { encode("stroke-open", settings.strokeOpen()) }
		if (settings.stroke.dirty())        { encode("stroke", settings.stroke()) }

		if (!Object.keys(encoded).length) {
			window.history.replaceState({}, "", "/")
		} else {
			const params = new URLSearchParams(encoded)
			window.history.replaceState({}, "", `/?${params.toString()}`)
		}
	})
})
