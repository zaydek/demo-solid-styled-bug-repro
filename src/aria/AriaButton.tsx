// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role

import { batch, ParentProps } from "solid-js"
import { omitProps } from "solid-use"
import { createRef } from "../solid-utils"
import { CSSProps, RefProps } from "../solid-utils/extra-types"

export function AriaButton(props: ParentProps<RefProps & CSSProps & { onClick: (e: MouseEvent) => void }>) {
	const [ref, setRef] = createRef()

	return (
		<div
			// Props
			{...omitProps(props, ["onClick"])}
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
			// Accessibility
			role="button"
			tabIndex="0"
		>
			{props.children}
		</div>
	)
}
