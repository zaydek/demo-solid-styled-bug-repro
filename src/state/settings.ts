import { createEffect, createResource, createRoot, createSignal, DEV } from "solid-js"
import { createDirtySignal } from "../solid-utils"
import { params } from "./params"

////////////////////////////////////////

const _cache = new Map<string, unknown>()
async function cache<T>(key: string, value: T): Promise<T> {
	if (_cache.has(key)) {
		return _cache.get(key) as T
	} else {
		if (DEV) {
			await new Promise(resolve => setTimeout(resolve, 500))
		}
		_cache.set(key, value)
		return value
	}
}

////////////////////////////////////////

export type Version = "v1" | "v2"

export type VariantV1 = "outline" | "solid"
export type VariantV2 = "20/solid" | "24/outline" | "24/solid"

export const settings = createRoot(() => {
	const [versionOpen, setVersionOpen] = createDirtySignal(params.get.boolean("version-open"), false)
	const [version, setVersion] = createDirtySignal<Version>((() => {
		const value = params.get.string("version")
		if (!(value === "v1" || value === "v2")) { return }
		return value
	})(), "v2")

	const [variantOpen, setVariantOpen] = createDirtySignal(params.get.boolean("variant-open"), true)
	const [variantV1, setVariantV1] = createDirtySignal<VariantV1>((() => {
		const value = params.get.string("variant")
		if (!(value === "solid" || value === "outline")) { return }
		return value
	})(), "solid")
	const [variantV2, setVariantV2] = createDirtySignal<VariantV2>((() => {
		const value = params.get.string("variant")
		if (!(value === "20-solid" || value === "24-outline" || value === "24-solid")) { return }
		return value.replace("-", "/") as VariantV2
	})(), "20/solid")
	const variant = () => version() === "v1" ? variantV1() : variantV2()

	createEffect(() => {
		console.log({
			version: version(),
			variantV1: variantV1(),
			variantV2: variantV2(),
		})
	})

	const [clipboardOpen, setClipboardOpen] = createDirtySignal(params.get.boolean("clipboard-open"), true)
	const [textarea, setTextarea] = createSignal("")

	const [densityOpen, setDensityOpen] = createDirtySignal(params.get.boolean("density-open"), false)
	const [density, setDensity] = createDirtySignal(params.get.number("density"), 96)

	const [sizeOpen, setSizeOpen] = createDirtySignal(params.get.boolean("size-open"), false)
	const [size, setSize] = createDirtySignal(params.get.number("size"), 28)

	const [strokeWidthOpen, setStrokeWidthOpen] = createDirtySignal(params.get.boolean("stroke-open"), false)
	const [strokeWidth, setStrokeWidth] = createDirtySignal(params.get.number("stroke") || 1.5, 1.5) // TODO: Depends on version

	/*
	 * Resources
	 */
	const [manifest] = createResource(version, async version => {
		if (version === "v1") {
			return cache("v1", import("../data/manifest@1.0.6"))
		} else if (version === "v2") {
			return cache("v2", import("../data/manifest@2.0.11"))
		}
	})

	const [icons] = createResource(() => [version(), variant()] as const, async ([version, variant]) => {
		if (version === "v1" && variant === "solid") {
			return cache(variant, import("../assets/heroicons@1.0.6/solid"))
		} else if (version === "v1" && variant === "outline") {
			return cache(variant, import("../assets/heroicons@1.0.6/outline"))
		} else if (version === "v2" && variant === "20/solid") {
			return cache(variant, import("../assets/heroicons@2.0.11/20/solid"))
		} else if (version === "v2" && variant === "24/solid") {
			return cache(variant, import("../assets/heroicons@2.0.11/24/solid"))
		} else if (version === "v2" && variant === "24/outline") {
			return cache(variant, import("../assets/heroicons@2.0.11/24/outline"))
		}
	})

	return {
		// State
		versionOpen,
		version,
		variantOpen,
		variantV1,
		variantV2,
		variant, // Derived
		clipboardOpen,
		textarea,
		densityOpen,
		density,
		sizeOpen,
		size,
		strokeWidthOpen,
		strokeWidth,
		manifest, // Derived (resources)
		icons,    // Derived (resources)

		// Actions
		setVersionOpen,
		setVersion,
		setVariantOpen,
		setVariantV1,
		setVariantV2,
		setClipboardOpen,
		setTextarea,
		setDensityOpen,
		setDensity,
		setSizeOpen,
		setSize,
		setStrokeWidthOpen,
		setStrokeWidth,
	}
})

export const ready = () => (
	settings.manifest.state === "ready" &&
	settings.icons.state === "ready"
)
