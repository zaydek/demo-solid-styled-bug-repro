import { Component, JSX } from "solid-js"

export type DynamicProps = {
	as?:  keyof JSX.IntrinsicElements | Component
	ref?: (element: HTMLElement) => void
}

export type CSSProps = {
	class?: string
	style?: string | JSX.CSSProperties
}
