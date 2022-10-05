import { createEffect, createRoot, createSignal, onCleanup, Signal } from "solid-js"
import { canonicalize } from "../utils"

function createParams() {
	const urlParams = new URLSearchParams(window.location.search)

	const cache = new Map<string, unknown>()

	return {
		get(key: string) {
			return urlParams.get(key)
		},
		init(key: string) {
			cache.set(key, undefined)
		},
		set<T>(key: string, value: T, { initialValue }: { initialValue: T }) {
			if (value === initialValue && cache.get(key) === undefined) { return }

			cache.set(key, value)
			const encoded: Record<string, string> = {}
			for (const [cacheKey, cacheValue] of cache) {
				if (cacheValue === undefined) { continue }
				encoded[cacheKey] = canonicalize("" + cacheValue)
			}
			if (!Object.keys(encoded).length) {
				window.history.replaceState({}, "", "/")
			} else {
				const next = new URLSearchParams(encoded)
				window.history.replaceState({}, "", `/?${next.toString()}`)
			}
		},
		delete(key: string) {
			cache.delete(key)
		}
	}
}

const params = createParams()

type Validator<T> = (value: null | string) => undefined | T

export function createSignalParam2<T>(initialValue: T, { key, validate }: { key: string, validate: Validator<T> }) {
	const [value, setValue] = createSignal(validate(params.get(key)) ?? initialValue)

	const [once, setOnce] = createSignal(false)
	createRoot(dispose => {
		createEffect(() => {
			if (!once()) {
				setOnce(true)
				params.init(key)
				return
			}
			params.set(key, value(), { initialValue })
		})
		onCleanup(() => {
			params.delete(key)
			dispose()
		})
	})

	return [value, setValue] as Signal<T>
}
