import { createResource, createRoot, createSignal, DEV } from "solid-js"
import { createSignalParam2 } from "../solid-utils"

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
	// ?versionOpen=...
	const [versionOpen, setVersionOpen] = createSignalParam2(false, {
		key: "expandVersion",
		validate: value => value === "true",
	})

	// ?version=...
	const [version, setVersion] = createSignalParam2<Version>("v2", {
		key: "version",
		validate: value => {
			if (!(value === "v1" || value === "v2")) { return }
			return value
		}
	})

	// ?variantOpen=...
	const [variantOpen, setVariantOpen] = createSignalParam2(false, {
		key: "expandVariant",
		validate: value => value === "true",
	})

	// ?variant=...
	const [_variantV1, setVariantV1] = createSignalParam2<VariantV1>("solid", {
		key: "variant",
		validate: value => {
			if (!(value === "outline" || value === "solid")) { return }
			return value
		}
	})
	// ?variant=... (can overwrite { key: "variant", ... })
	const [_variantV2, setVariantV2] = createSignalParam2<VariantV2>("20/solid", {
		key: "variant",
		validate: value => {
			if (!(value === "20/solid" || value === "24/outline" || value === "24/solid")) { return }
			return value
		}
	})

	const variant = () => version() === "v1"
		? _variantV1()
		: _variantV2()

	//// const [clipboardOpen, setClipboardOpen] = createSearchSignal(get => {
	//// 	const value = get("clipboardOpen")
	//// 	if (!(value === "1" || value === "0")) { return }
	//// 	return value
	//// }, "1")

	const [clipboardOpen, setClipboardOpen] = createSignal(true)

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
