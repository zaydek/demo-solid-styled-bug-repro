import { createResource, createRoot, createSignal, DEV } from "solid-js"
import { createDirtySignal } from "../utils/solid"
import { searchParams } from "../utils/vanilla"

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

export type Version   = "v1" | "v2"
export type VariantV1 = "outline" | "solid"
export type VariantV2 = "20/solid" | "24/outline" | "24/solid"
export type Framework = "svg" | "react" | "vue"

export const settings = createRoot(() => {
	// Version
	const [versionOpen, setVersionOpen] = createDirtySignal(searchParams.boolean("version-open"), false)
	const [version, setVersion] = createDirtySignal<Version>((() => {
		const value = searchParams.string("version")
		if (!(value === "v1" || value === "v2")) { return }
		return value
	})(), "v2")

	// Variant
	const [variantOpen, setVariantOpen] = createDirtySignal(searchParams.boolean("variant-open"), true)
	const [variantV1, setVariantV1] = createDirtySignal<VariantV1>((() => {
		const value = searchParams.string("variant")
		if (!(value === "solid" || value === "outline")) { return }
		return value
	})(), "solid")
	const [variantV2, setVariantV2] = createDirtySignal<VariantV2>((() => {
		const value = searchParams.string("variant")
		if (!(value === "20-solid" || value === "24-outline" || value === "24-solid")) { return }
		return value.replace("-", "/") as VariantV2
	})(), "20/solid")
	const variant = () => version() === "v1" ? variantV1() : variantV2()

	// Clipboard
	//
	// TODO: Add selected?
	const [clipboardOpen, setClipboardOpen] = createDirtySignal(searchParams.boolean("clipboard-open"), true)
	const [textarea, setTextarea] = createSignal("")
	const [license, setLicense] = createDirtySignal(searchParams.boolean("license"), true)
	const [framework, setFramework] = createDirtySignal<Framework>((() => {
		const value = searchParams.string("framework")
		if (!(value === "svg" || value === "react" || value === "vue")) { return }
		return value
	})(), "svg")

	// Grid density
	const [densityOpen, setDensityOpen] = createDirtySignal(searchParams.boolean("density-open"), false)
	const [density, setDensity] = createDirtySignal(searchParams.number("density"), 96)

	// Size
	const [sizeOpen, setSizeOpen] = createDirtySignal(searchParams.boolean("size-open"), false)
	const [size, setSize] = createDirtySignal(searchParams.number("size"), 28)

	// Stroke width
	const [strokeOpen, setStrokeOpen] = createDirtySignal(searchParams.boolean("stroke-open"), false)
	const [stroke, setStroke] = createDirtySignal(searchParams.number("stroke") || 1.5, 1.5) // TODO: Depends on version

	// Resources
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
		// STATE
		versionOpen,
		version,
		variantOpen,
		variantV1,
		variantV2,
		variant,
		clipboardOpen,
		textarea,
		license,
		framework,
		densityOpen,
		density,
		sizeOpen,
		size,
		strokeOpen,
		stroke,
		manifest,
		icons,

		// ACTIONS
		setVersionOpen,
		setVersion,
		setVariantOpen,
		setVariantV1,
		setVariantV2,
		setClipboardOpen,
		setTextarea,
		setLicense,
		setFramework,
		setDensityOpen,
		setDensity,
		setSizeOpen,
		setSize,
		setStrokeOpen,
		setStroke,
	}
})

// TODO: Do we need this?
export const ready = () => (
	settings.manifest.state === "ready" &&
	settings.icons.state === "ready"
)
