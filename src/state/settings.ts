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
	const [version, setVersion] = createSearchSignal<Version>(get => {
		const v = get("version")
		if (!v) { return }
		if (!(v === "v1" || v === "v2")) { return }
		return v
	}, "v2")

	const [_variantV1, setVariantV1] = createSearchSignal<VariantV1>(get => {
		const v = get("variant")
		if (!v) { return }
		if (!(v === "outline" || v === "solid")) { return }
		return v
	}, "solid")

	const [_variantV2, setVariantV2] = createSearchSignal<VariantV2>(get => {
		const v = get("variant")
		if (!v) { return }
		if (!(v === "20/solid" || v === "24/outline" || v === "24/solid")) { return }
		return v
	}, "20/solid")

	const variant = () => version() === "v1"
		? _variantV1()
		: _variantV2()

	// TODO: Memoize?
	const variantCompliment = () => {
		if (!(variant() === "24/outline" || variant() === "24/solid")) { return }
		return variant() === "24/outline"
			? "24/solid"   as VariantV2
			: "24/outline" as VariantV2
	}

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

	const [textarea, setTextarea] = createSignal("")

	return {
		// State
		version,
		variant,
		variantCompliment, // Derived
		manifest,          // Derived
		icons,             // Derived
		textarea,          // Derived

		// Actions
		setVersion,
		setVariantV1,
		setVariantV2,
		setTextarea,
	}
})

export const ready = () =>
	settings.manifest.state === "ready" &&
	settings.icons.state === "ready"
