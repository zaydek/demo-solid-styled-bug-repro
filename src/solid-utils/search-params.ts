import { createEffect, createRoot, createSignal, onCleanup, Signal } from "solid-js"
import { canonicalize } from "../utils"

function createSearchParams() {
	const search = new URLSearchParams(window.location.search)
	const cached = new Map<string, unknown>()

	return {
		get(key: string) {
			return search.get(key) ?? undefined
		},
		set<T>(key: string, value: T) {
			cached.set(canonicalize(key), value)
			const serialized: Record<string, string> = {}
			for (const [$key, $value] of cached) {
				if ($value === undefined) { continue }
				serialized[$key] = canonicalize(
					typeof $value === "string"
						? $value
						: `${$value}`,
				)
			}
			if (!Object.keys(serialized).length) {
				window.history.replaceState({}, "", "/")
			} else {
				const next = new URLSearchParams(serialized)
				window.history.replaceState({}, "", `/?${next.toString()}`)
			}
		},
		delete(key: string) {
			cached.delete(canonicalize(key))
		}
	}
}

const searchParams = createSearchParams()

export type Validator<T> = (get: (key: string) => undefined | string) => undefined | T

export function createSearchSignal<T>(validate: Validator<T>, fallback: T) {
	let key: string

	const valid = validate(($key: string) => {
		key = $key
		return searchParams.get($key)
	}) ?? fallback
	const [value, setValue] = createSignal(valid)

	createRoot(dispose => {
		createEffect(() => searchParams.set(key, value() === fallback ? undefined : value()))
		onCleanup(() => {
			searchParams.delete(key)
			dispose()
		})
	})

	return [value, setValue] as Signal<T>
}
