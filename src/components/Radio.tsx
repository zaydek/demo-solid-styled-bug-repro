import "./Radio.scss"

import { FlowProps } from "solid-js"
import { AriaRadio } from "../aria"

export function Radio(props: FlowProps<{ value: string }, string>) {
	return <>
		<AriaRadio class="radio-container focus-ring focus-ring-$full" value={props.value}>
			<div class="radio-label typography-caps">
				<div class="radio-label-icon"></div>
				{props.children}
			</div>
			<div class="radio">
				<div class="radio-icon"></div>
			</div>
		</AriaRadio>
	</>
}
