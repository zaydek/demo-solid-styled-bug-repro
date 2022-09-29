import { createSignal } from "solid-js"

export const createRef = <Tag extends HTMLElement>() => createSignal<Tag>()
