import "./Textarea.scss"

export function Textarea() {
	return <>
		<div class="textarea flex-col gap-calc($gap/2) focus-ring focus-ring-16px" tabindex="0">
			<div class="h-6px w-70% rounded-$full background-color:$fill-300-color"></div>
			<div class="h-6px w-90% rounded-$full background-color:$fill-300-color"></div>
			<div class="h-6px w-80% rounded-$full background-color:$fill-300-color"></div>
			<div class="h-6px w-60% rounded-$full background-color:$fill-300-color"></div>
		</div>
	</>
}
