import "./Radio.scss"

import { FlowProps } from "solid-js"
import { AriaRadio } from "../aria"
import { Smiley } from "./Smiley"

export function Radio(props: FlowProps<{ value: string }, string>) {
	return <>
		<AriaRadio class="group flex-row gap-$gap focus-ring focus-ring-$full" value={props.value}>
			<div class="flex-grow">
				<div class="px-calc($reduced-form-height/2) h-$reduced-form-height rounded-$full background-color:$card-lightgray-color flex-row flex-align-center gap-$gap">
					<Smiley class="h-16px aspect-1 color:$fill-100-color" />
					<div class="typography-caps">
						{props.children}
					</div>
				</div>
			</div>
			<div class="radio grid grid-center">
				<div></div>
			</div>
		</AriaRadio>
	</>
}
