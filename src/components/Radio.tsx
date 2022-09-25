import { Icon, IconPlaceholder, Line } from "./Primitives";
import { Smiley } from "./Smiley";

export function Radio() {
	return <>
		<div class="flex-row gap-($gap/2) focus-ring focus-ring-$full" tabindex="0">
			<div class="flex-grow">
				<div class="px-($reduced-form-height/2) h-$reduced-form-height rounded-$full background-color:$faded-base-color flex-row flex-align-center gap-$gap">
					<Icon icon={Smiley} h="16px" />
					<Line w="35%" />
				</div>
			</div>
			<div class="h-$reduced-form-height aspect-1 rounded-$full background-color:$form-color box-shadow:$inset-box-shadow grid grid-center">
				{/* <IconPlaceholder h="8px" color="var(--theme-color)" /> */}
			</div>
		</div>
	</>
}
