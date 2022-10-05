import { createResource, createRoot, createSignal, DEV } from "solid-js"
import { createSearchSignal } from "../solid-utils"

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
	const [versionOpen, setVersionOpen] = createSearchSignal(get => {
		const value = get("versionOpen")
		if (!(value === "1" || value === "0")) { return }
		return value
	}, "0")

	const [version, setVersion] = createSearchSignal<Version>(get => {
		const value = get("version")
		if (!(value === "v1" || value === "v2")) { return }
		return value
	}, "v2")

	const [variantOpen, setVariantOpen] = createSearchSignal(get => {
		const value = get("variantOpen")
		if (!(value === "1" || value === "0")) { return }
		return value
	}, "1")

	const [_variantV1, setVariantV1] = createSearchSignal<VariantV1>(get => {
		const value = get("variant")
		if (!(value === "outline" || value === "solid")) { return }
		return value
	}, "solid")

	const [_variantV2, setVariantV2] = createSearchSignal<VariantV2>(get => {
		const value = get("variant")
		if (!(value === "20/solid" || value === "24/outline" || value === "24/solid")) { return }
		return value
	}, "20/solid")

	const variant = () => version() === "v1"
		? _variantV1()
		: _variantV2()

	const [clipboardOpen, setClipboardOpen] = createSearchSignal(get => {
		const value = get("clipboardOpen")
		if (!(value === "1" || value === "0")) { return }
		return value
	}, "1")

	const [textarea, setTextarea] = createSignal("")

	// TODO: Extract to separate controller
	const [manifest] = createResource(version, async version => {
		if (version === "v1") {
			return cache("v1", import("../data/manifest@1.0.6"))
		} else if (version === "v2") {
			return cache("v2", import("../data/manifest@2.0.11"))
		}
	})

	// TODO: Extract to separate controller
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
		variant,
		clipboardOpen,
		textarea,

		// Resources
		manifest,
		icons,

		// Actions
		setVersionOpen,
		setVersion,
		setVariantOpen,
		setVariantV1,
		setVariantV2,
		setClipboardOpen,
		setTextarea,
	}
})

export const ready = () =>
	settings.manifest.state === "ready" &&
	settings.icons.state === "ready"
