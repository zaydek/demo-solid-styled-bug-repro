import { Accessor, createEffect, createSignal, on } from "solid-js"

// Dirty describes whether a signal is initial=false OR dirty=true
export type DirtyAccessor<T> = Accessor<T> & { dirty(): Accessor<boolean> }

export function createDirtySignal<T>(restoreValue: undefined | T, initialValue: T) {
	const [dirty, setDirty] = createSignal(false)
	const [value, setValue] = createSignal(restoreValue ?? initialValue)

	Object.assign(value, {
		dirty: () => value() !== initialValue || dirty()
	})

	createEffect(on(value, () => {
		console.log("here")
		setDirty(true)
	}, { defer: true }))

	return [value as DirtyAccessor<T>, setValue] as const
}
