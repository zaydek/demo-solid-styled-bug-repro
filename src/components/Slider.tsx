export function Slider() {
	return <>
		{/* Use px-($reduced-form-height/2) because of <SectionToggle> */}
		<div class="px-($reduced-form-height/2) h-$form-height flex-col flex-justify-center focus-ring focus-ring-$full" tabindex="0">
			<div class="h-6px rounded-$full background-color:$theme-color flex-row flex-center">
				<div class="h-$form-height aspect-1 rounded-$full background-color:$form-color box-shadow:$inset-box-shadow" />
			</div>
		</div>
	</>
}
