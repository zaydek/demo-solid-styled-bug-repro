// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role

import { batch, ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { omitProps } from "solid-use"
import { createRef } from "../solid-utils"
import { CSSProps, DynamicProps } from "../solid-utils/extra-types"

export function AriaButton(props: ParentProps<DynamicProps & CSSProps & { onClick: (e: MouseEvent) => void }>) {
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
			{...omitProps(props, ["as", "onClick"])}
			// Handlers
			onClick={(e: MouseEvent) => {
				if (typeof props.onClick === "function") {
					e.preventDefault()
					props.onClick(e)
				}
			}}
			onKeyDown={(e: KeyboardEvent) => {
				if (e.code === "Space") {
					if (typeof props.onClick === "function") {
						e.preventDefault()
						ref()!.click()
					}
				}
			}}
			// Accessibility
			role="button"
			tabindex="0"
		>
			{props.children}
		</Dynamic>
	)
}
