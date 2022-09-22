import { VoidProps } from "solid-js"

export const Grow = () => <div class="flex-grow"></div>

export function Icon(props: VoidProps<{
	h: string

	color: string
}>) {
	return <>
		<style jsx>{`
			.icon-wrapper {
				height: ${props.h};
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: red;
			}
			.icon {
				height: 50%;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: white;
			}
		`}</style>
		<div class="icon-wrapper grid grid-center">
			<div class="icon"></div>
		</div>
	</>
}

export function Line(props: VoidProps<{
	w: string

	color: string
}>) {
	return <>
		<style jsx>{`
			.line {
				height: 6px;
				width: ${props.w};
				border-radius: var(--full);
				background-color: ${props.color};
			}
		`}</style>
		<div class="line"></div>
	</>
}

export function LineByAspectRatio(props: VoidProps<{
	aspect: string
	color:  string
}>) {
	return <>
		<style jsx>{`
			.line {
				height: 6px;
				aspect-ratio: ${props.aspect};
				border-radius: var(--full);
				background-color: ${props.color};
			}
		`}</style>
		<div class="line"></div>
	</>
}
