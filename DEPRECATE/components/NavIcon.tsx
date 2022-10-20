import "./NavIcon.scss"

import { VoidComponent, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { AriaButton } from "../aria"
import { cx } from "../solid-utils"
import { CSSProps } from "../solid-utils/extra-types"

export function NavIcon(props: VoidProps<{
	icon: VoidComponent<CSSProps>

	active?: boolean
}>) {
	return <>
		<AriaButton class={cx(`nav-icon ${props.active && "is-active"} grid grid-center focus-ring focus-ring-$full`)} onClick={e => {/* TODO */}}>
			<Dynamic component={props.icon} />
		</AriaButton>
	</>
}
