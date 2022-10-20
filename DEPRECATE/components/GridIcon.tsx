import "./GridIcon.scss"

import { VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { AriaButton } from "../aria"
import { cx } from "../solid-utils"
import { IndexedResult, settings } from "../state"

export function GridIcon(props: VoidProps<{
	info: IndexedResult

	active?: boolean
}>) {
	return <>
		<AriaButton as="article" class="group grid grid-center focus-ring-group" onClick={e => {/* TODO */}}>
			<div class={cx(`grid-icon ${props.active && "is-active"} grid grid-center focus-ring focus-ring-32px`)}>
				{/* @ts-expect-error */}
				<Dynamic component={settings.icons()?.[props.info.title]} />
				<div class="typography-sans is-200 has-ellipsis">
					{props.info.kebab}
				</div>
			</div>
		</AriaButton>
	</>
}
