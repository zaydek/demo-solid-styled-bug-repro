// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role

import { batch, ParentProps, Setter } from "solid-js"
import { omitProps } from "solid-use"
import { createRef } from "../solid-utils"
import { CSSProps, RefProps } from "../solid-utils/extra-types"

export function AriaCheckbox(props: ParentProps<RefProps & CSSProps & {
	checked:    boolean
	setChecked: Setter<boolean>

	// TODO: DEPRECATE?
	tabIndex?: number
}>) {
	const [ref, setRef] = createRef()

	return (
		<div
			// Props
			{...omitProps(props, ["checked", "setChecked", "tabIndex"])}
			// Ref
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
			// Handlers
			onClick={e => {
				if (typeof props.setChecked === "function") {
					e.preventDefault()
					props.setChecked(curr => !curr)
				}
			}}
			onKeyDown={e => {
				if (e.code === "Space") {
					if (typeof props.setChecked === "function") {
						e.preventDefault()
						ref()!.click()
					}
				}
			}}
			// Attributes
			role="checkbox"
			aria-checked={props.checked}
			tabIndex={props.tabIndex ?? 0}
		>
			{props.children}
		</div>
	)
}
