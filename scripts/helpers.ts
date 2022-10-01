import { detab, tab } from "../src/utils"

export function formatSVG(svg: string) {
	return svg
		.trim()
		.replace(/ {2}/, "\t")                                   // Spaces -> tabs
		.replace(/<path ([^/]+)\/>/g, "<path $1></path>") + "\n" // <path ...></path>
}

export function formatJSX(href: string, name: string, svg: string) {
	return detab(`
		import { JSX, VoidProps } from "solid-js"

		// ${href}
		export function ${name}(props: {
			class?: string
			style?: string | JSX.CSSProperties
		}) {
			return <>
				${tab(
					svg
						.trim()
						.replace(/ {2}/, "\t")                             // Spaces -> tabs
						.replace(/<svg ([^>]+)>/, "<svg $1 {...props}>")   // <svg>
						.replace(/<path ([^/]+)\/>/g, "<path $1></path>"), // <path ...></path>
					4,
					{ omitStart: true },
				)}
			</>
		}
	`).trim() + "\n"
}
