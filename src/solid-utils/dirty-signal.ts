import { Accessor, createEffect, createSignal, on } from "solid-js"
import { params } from "../state"

export type DirtyAccessor<T> = Accessor<T> & { dirty: Accessor<boolean> }

export function createDirtySignal<T>(initialValue: T) {
	const [dirty, setDirty] = createSignal(false)
	const [value, setValue] = createSignal(initialValue)

	// Accessor<T> -> DirtyAccessor<T>
	Object.assign(value, { dirty })

	if (!dirty()) {
		createEffect(on(value, () => {
			setDirty(true)
		}, { defer: true }))
	}

	return [value as DirtyAccessor<T>, setValue] as const
}

export type InitialAccessor<T> = Accessor<T> & { initial(): Accessor<boolean> }

function createCreateParam() {
	return {
		// TODO: Generic how?
		boolean<T>({ key }: { key: string }, initial: T) {
			const [value, setValue] = createSignal(params.get.boolean(key) ?? initial)
			Object.assign(value, {
				initial: () => value() === initial
			})
			return [value as InitialAccessor<T>, setValue] as const
		},
		number<T>({ key }: { key: string }, initial: T) {
			const [value, setValue] = createSignal(params.get.number(key) ?? initial)
			Object.assign(value, {
				initial: () => value() === initial
			})
			return [value as InitialAccessor<T>, setValue] as const
		},
		string<T>({ key }: { key: string }, initial: T) {
			const [value, setValue] = createSignal(params.get.string(key) ?? initial)
			Object.assign(value, {
				initial: () => value() === initial
			})
			return [value as InitialAccessor<T>, setValue] as const
		},
	}
}

export const createParam = createCreateParam()
