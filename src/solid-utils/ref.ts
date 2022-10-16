import { splitProps } from "solid-js"

//// export const createRef = <E extends HTMLElement>() => createSignal<E>()

// Type from splitProps:
//
// - export declare function splitProps<T, K extends [readonly (keyof T)[], ...(readonly (keyof T)[])[]]>(props: T, ...keys: K): SplitProps<T, K>
//
export function omitProps<T, K extends [readonly (keyof T)[], ...(readonly (keyof T)[])[]]>(props: T, ...keys: K): Omit<T, K[number][number]> {
	return splitProps(props, ...keys)[1]
}
