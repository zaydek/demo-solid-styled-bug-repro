// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role

import { batch, ParentProps } from "solid-js"
import { omitProps } from "solid-use"
import { createRef } from "../solid-utils"
import { CSSProps, RefProps } from "../solid-utils/extra-types"

export function AriaCheckbox(props: ParentProps<RefProps & CSSProps & {
	checked: boolean
	onClick: (e: MouseEvent) => void

	// TODO: DEPRECATE?
	tabIndex?: number
}>) {
	const [ref, setRef] = createRef()

	return (
		<div
			// Props
			{...omitProps(props, ["checked", "onClick", "tabIndex"])}
			// Ref
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
			// Handlers
			onClick={e => {
				if (typeof props.onClick === "function") {
					e.preventDefault()
					props.onClick(e)
				}
			}}
			onKeyDown={e => {
				if (e.code === "Space") {
					if (typeof props.onClick === "function") {
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
