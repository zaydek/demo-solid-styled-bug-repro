// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role

import { batch, ParentProps, Setter } from "solid-js"
import { Dynamic } from "solid-js/web"
import { createRef, CSSProps, DynamicProps, omitProps } from "../../solid-utils"

export function AriaCheckbox(props: ParentProps<DynamicProps & CSSProps & {
	checked:    boolean
	setChecked: Setter<boolean>
}>) {
	const [ref, setRef] = createRef()

	return (
		<Dynamic
			// Destructure props
			{...omitProps(props, ["as", "checked", "setChecked"])}
			// Component
			component={props.as ?? "div"}
			ref={(el: HTMLElement) => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
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