import { css } from "../solid-utils"
import { Line } from "./Primitives"

export function Textarea() {
	return <>
		{css`
			.css-textarea {
				padding: calc(var(--form-height) / 2);
				height: 112px;
				border-radius: calc(var(--form-height) / 2);
				background-color: var(--card-color);
				box-shadow: var(--card-inset-hairline-box-shadow);
			}
		`}
		<div class="css-textarea flex-col gap-($gap/2) focus-ring focus-ring-16px" tabindex="0">
			<Line w="70%" color="var(--fill-300-color)" />
			<Line w="90%" color="var(--fill-300-color)" />
			<Line w="80%" color="var(--fill-300-color)" />
			<Line w="60%" color="var(--fill-300-color)" />
		</div>
	</>
}
