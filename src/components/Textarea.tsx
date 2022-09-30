import { css } from "../solid-utils"
import { Line } from "./Primitives"

export function Textarea() {
	return <>
		{css`
			.component-textarea {
				padding: calc(var(--form-height) / 2);
				height: 144px;
				border-radius: calc(var(--form-height) / 2);
				background-color: var(--card-color);
				box-shadow: var(--inset-hairline-box-shadow);
			}
		`}
		<div class="component-textarea flex-col gap-($gap/2) focus-ring focus-ring-16px" tabindex="0">
			<Line w="70%" color="var(--fill-200-color)" />
			<Line w="90%" color="var(--fill-200-color)" />
			<Line w="80%" color="var(--fill-200-color)" />
			<Line w="60%" color="var(--fill-200-color)" />
		</div>
	</>
}
