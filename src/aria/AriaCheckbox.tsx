// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role

import { batch, ParentProps, Setter } from "solid-js"
import { Dynamic } from "solid-js/web"
import { omitProps } from "solid-use"
import { createRef } from "../solid-utils"
import { CSSProps, DynamicProps } from "../solid-utils/extra-types"

export function AriaCheckbox(props: ParentProps<DynamicProps & CSSProps & {
	checked:    boolean
	setChecked: Setter<boolean>
}>) {
	const [ref, setRef] = createRef()

	return (
		<Dynamic
			// Component
			component={props.as ?? "div"}
			ref={(el: HTMLElement) => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
			// Props
			{...omitProps(props, ["as", "checked", "setChecked"])}
			// Handlers
			onClick={(e: MouseEvent) => {
				if (typeof props.setChecked === "function") {
					e.preventDefault()
					props.setChecked(curr => !curr)
				}
			}}
			onKeyDown={(e: KeyboardEvent) => {
				if (e.code === "Space") {
					if (typeof props.setChecked === "function") {
						e.preventDefault()
						ref()!.click()
					}
				}
			}}
			// Accessibility
			role="checkbox"
			aria-checked={props.checked}
			tabindex="0"
		>
			{props.children}
		</Dynamic>
	)
}
