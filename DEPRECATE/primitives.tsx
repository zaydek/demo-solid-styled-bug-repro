import { VoidProps } from "solid-js"

export const Grow = () => <div class="flex-grow"></div>

export function Line(props: VoidProps<{
	h?: string
	w?: string

	color: string
}>) {
	return <>
		<style jsx>{`
			.line {
				height: ${props.h ?? "6px"};
				width: ${props.w ?? "revert"};
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

export function Video(props: VoidProps<{
	h?:       string
	rounded?: string

	color: string
}>) {
	return <>
		<style jsx>{`
			:global(:root) {
				--aspect-ratio-video: 16 / 9;
			}
			.video {
				height: ${props.h ?? "revert"};
				aspect-ratio: var(--aspect-ratio-video);
				border-radius: ${props.rounded ?? "revert"};
				background-color: ${props.color};
			}
		`}</style>
		<div class="video"></div>
	</>
}
