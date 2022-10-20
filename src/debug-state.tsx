import { ParentProps } from "solid-js"
import { Portal } from "solid-js/web"
import { css } from "./solid-utils"
import { stringify } from "./utils"

export function DEBUG_STATE(props: ParentProps<{ state: any }>) {
	return <>
		{css`
			.debug-state-fixed-card {
				position: fixed;
				z-index: 100;
				inset:
					16px  /* T */
					16px  /* R */
					16px  /* B */
					auto; /* L */
				/* LAYOUT */
				padding: 16px;
				max-height: calc(var(--screen-y) - 16px * 2);
				overflow-y: auto;
				width: 320px;
				border-radius: 16px;
				/* DECORATION */
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);
			}
			.debug-state-typography {
				font: 400 12px / 1.25 Monaco;
				white-space: pre;
			}
		`}
		<Portal ref={el => el.className = "portal"}>
			<div class="debug-state-fixed-card">
				<div class="debug-state-typography">
					{stringify(props.state, 2)}
				</div>
			</div>
		</Portal>
	</>
}