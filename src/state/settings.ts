import { createResource, createRoot, createSignal, Setter, startTransition } from "solid-js"
import { loadingBar } from "../loading-bar"
import { createDirtySignal } from "../utils/solid"
import { searchParams } from "../utils/vanilla"

////////////////////////////////////////

const _internalCache = new Map<string, unknown>()
async function cache<T>(key: string, value: T): Promise<T> {
	if (_internalCache.has(key)) {
		return _internalCache.get(key) as T
	} else {
		_internalCache.set(key, value)
		return value
	}
}

////////////////////////////////////////

export type Version   = "v1" | "v2"
export type VariantV1 = "solid" | "outline"
export type VariantV2 = "20/solid" | "24/solid" | "24/outline"
export type Framework = "svg" | "react" | "vue"

export const settings = createRoot(() => {
	// Version
	//// const [versionOpen, setVersionOpen] = createDirtySignal(searchParams.boolean("version-open"), false)
	const [version, _setVersion] = createDirtySignal<Version>((() => {
		const value = searchParams.string("version")
		if (!(value === "v1" || value === "v2")) { return }
		return value
	})(), "v2")

	// Alias for <LoadingBar>
	const setVersion = ((next: Version) => {
		if (!(_internalCache.has(next))) {
			loadingBar.start()
		}
		startTransition(() => _setVersion(next))
	}) as Setter<Version>

	// Variant
	//// const [variantOpen, setVariantOpen] = createDirtySignal(searchParams.boolean("variant-open"), true)
	const [variantV1, _setVariantV1] = createDirtySignal<VariantV1>((() => {
		const value = searchParams.string("variant")
		if (!(value === "solid" || value === "outline")) { return }
		return value
	})(), "solid")

	// Alias for <LoadingBar>
	const setVariantV1 = ((next: VariantV1) => {
		if (!(_internalCache.has(next))) {
			loadingBar.start()
		}
		startTransition(() => _setVariantV1(next))
	}) as Setter<VariantV1>

	const [variantV2, _setVariantV2] = createDirtySignal<VariantV2>((() => {
		const value = searchParams.string("variant")
		if (!(value === "20-solid" || value === "24-outline" || value === "24-solid")) { return }
		return value.replace("-", "/") as VariantV2
	})(), "20/solid")

	// Alias for <LoadingBar>
	const setVariantV2 = ((next: VariantV2) => {
		if (!(_internalCache.has(next))) {
			loadingBar.start()
		}
		startTransition(() => _setVariantV2(next))
	}) as Setter<VariantV2>

	const variant = () => version() === "v1"
		? variantV1()
		: variantV2()

	// Clipboard
	//
	// TODO: Add selected?
	//// const [clipboardOpen, setClipboardOpen] = createDirtySignal(searchParams.boolean("clipboard-open"), true)
	const [textarea, setTextarea] = createSignal("")
	const [license, setLicense] = createDirtySignal(searchParams.boolean("license"), true)
	const [framework, setFramework] = createDirtySignal<Framework>((() => {
		const value = searchParams.string("framework")
		if (!(value === "svg" || value === "react" || value === "vue")) { return }
		return value
	})(), "svg")

	//// // Grid density
	//// const [densityOpen, setDensityOpen] = createDirtySignal(searchParams.boolean("density-open"), false)
	//// const [density, setDensity] = createDirtySignal(searchParams.number("density"), 96)

	// Scale
	//// const [scaleOpen, setScaleOpen] = createDirtySignal(searchParams.boolean("scale-open"), false)
	const [scale, setScale] = createDirtySignal(searchParams.number("scale"), 1)

	// Stroke width
	//// const [strokeOpen, setStrokeOpen] = createDirtySignal(searchParams.boolean("stroke-open"), false)
	const [stroke, setStroke] = createDirtySignal(searchParams.number("stroke"), version() === "v1" ? 2 : 1.5)

	// Resources
	const [manifest] = createResource(version, async version => {
		if (version === "v1") {
			return cache("v1", import("../data/manifest@1.0.6"))
		} else if (version === "v2") {
			return cache("v2", import("../data/manifest@2.0.11"))
		}
	})

	const [icons] = createResource(() => [version(), variant()] as const, async ([version, variant]) => {
		//// if (DEV) { await new Promise(r => setTimeout(r, 500)) }
		let assets // Infer type
		if (version === "v1" && variant === "solid") {
			assets = cache(variant, await import("../assets/heroicons@1.0.6/solid"))
		} else if (version === "v1" && variant === "outline") {
			assets = cache(variant, await import("../assets/heroicons@1.0.6/outline"))
		} else if (version === "v2" && variant === "20/solid") {
			assets = cache(variant, await import("../assets/heroicons@2.0.11/20/solid"))
		} else if (version === "v2" && variant === "24/solid") {
			assets = cache(variant, await import("../assets/heroicons@2.0.11/24/solid"))
		} else if (version === "v2" && variant === "24/outline") {
			assets = cache(variant, await import("../assets/heroicons@2.0.11/24/outline"))
		}
		loadingBar.end()
		return assets
	})

	return {
		// STATE
		//// versionOpen,
		version,
		//// variantOpen,
		variantV1,
		variantV2,
		variant,
		//// clipboardOpen,
		textarea,
		license,
		framework,
		//// densityOpen,
		//// density,
		//// scaleOpen,
		scale,
		//// strokeOpen,
		stroke,
		manifest,
		icons,

		// ACTIONS
		//// setVersionOpen,
		setVersion,
		//// setVariantOpen,
		setVariantV1,
		setVariantV2,
		//// setClipboardOpen,
		setTextarea,
		setLicense,
		setFramework,
		//// setDensityOpen,
		//// setDensity,
		//// setScaleOpen,
		setScale,
		//// setStrokeOpen,
		setStroke,
	}
})
