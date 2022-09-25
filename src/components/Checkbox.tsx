import { Icon, Line } from "./Primitives"
import { Smiley } from "./Smiley"

export function Checkbox() {
	return <>
		<style jsx>{`
			.checkbox-button {
				/* Query CSS variables */
				--height: var(--form-height);

				padding: 0 calc(var(--height) / 2);
				height: var(--height);
				border-radius: var(--full);
				background-color: var(--base-color);
				box-shadow: var(--inset-box-shadow);
			}
		`}</style>
		<div class="checkbox-button flex-row flex-center gap-$gap focus-ring focus-ring-$full" tabindex="0">
			<Icon icon={Smiley} h="16px" />
			<Line w="35%" />
			<Icon icon={Smiley} h="16px" />
		</div>
	</>
}
