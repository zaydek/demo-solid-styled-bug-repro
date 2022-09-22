import { For, VoidProps } from "solid-js"
import { Grow, Icon, Line } from "./primitives"

////////////////////////////////////////////////////////////////////////////////
// Components

function SearchBar() {
	return <>
		<style jsx>{`
			:global(:root) {
				--height-search-bar: 40px;
				--width-search-bar: 448px;
			}
			.search-bar {
				padding: 0 calc(var(--height-search-bar) / 8);
				height: var(--height-search-bar);
				width: var(--width-search-bar);
				border-radius: var(--full);
				background-color: whitesmoke;
				box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 15%);
			}
			.search-bar-button {
				height: 75%;
				aspect-ratio: 6;
				border-radius: var(--full);
				background-color: red;
			}
		`}</style>
		<div class="search-bar flex-row flex-center-y gap-8">
			<Icon h="75%" color="red" />
			<Line w="25%" color="red" />
			<Grow />
			<div class="search-bar-button grid grid-center">
				<Line w="50%" color="white" />
			</div>
		</div>
	</>
}

function Navbar() {
	return <>
		<style jsx>{`
			:global(:root) {
				--height-navbar: 64px;
			}
			.navbar-wrapper {
				height: var(--height-navbar);
				background-color: white;
				box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 15%);
			}
			.navbar {
				width: 100%;
				max-width: 1536px;
			}
		`}</style>
		<div class="fixed inset-t navbar-wrapper flex-row flex-center-x">
			<div class="navbar flex-row flex-center-y gap-8">
				<Icon h="32px" color="red" />
				<Icon h="32px" color="red" />
				<Grow />
				<Icon h="32px" color="red" />
				<Icon h="32px" color="red" />
			</div>
			<div class="absolute inset grid grid-center prop-pointer-events">
				<SearchBar />
			</div>
		</div>
	</>
}

////////////////////////////////////////////////////////////////////////////////
// App

function Globals() {
	return <>
		<style jsx global>{`
			:root {
				--full: 1000px;
			}

			/* Position */
			.fixed    { position: fixed;    z-index: 10; }
			.relative { position: relative; z-index: 10; }
			.absolute { position: absolute; z-index: 10; }

			.inset   { inset: 0; }
			.inset-t { inset: 0 0 auto 0; }
			.inset-r { inset: 0 0 0 auto; }
			.inset-b { inset: auto 0 0 0; }
			.inset-l { inset: 0 auto 0 0; }

			/* Pointer events */
			.prop-pointer-events     { pointer-events: none; }
			.prop-pointer-events > * { pointer-events: auto; }

			/* CSS Grid */
			.grid                   { display: grid; }
			.grid.grid-center       { place-items: center; }

			/* Flexbox */
			.flex-row               { display: flex; flex-direction: row; }
			.flex-row.flex-center   { justify-content: center; align-items: center; }
			.flex-row.flex-center-x { justify-content: center; }
			.flex-row.flex-center-y { align-items: center; }

			.flex-col               { display: flex; flex-direction: column; }
			.flex-col.flex-center   { justify-content: center; align-items: center; }
			.flex-col.flex-center-x { align-items: center; }
			.flex-col.flex-center-y { justify-content: center; }

			.flex-wrap-nowrap { flex-wrap: nowrap; }
			.flex-wrap        { flex-grow: 1; }

			.flex-shrink-0 { flex-shrink: 0; }
			.flex-shrink   { flex-shrink: 1; }

			.flex-grow-0 { flex-grow: 0; }
			.flex-grow   { flex-grow: 1; }

			/* Gap */
			.gap-6  { gap:  6px; }
			.gap-8  { gap:  8px; }
			.gap-16 { gap: 16px; }
			.gap-24 { gap: 24px; }
			.gap-32 { gap: 32px; }
			.gap-40 { gap: 40px; }
			.gap-48 { gap: 48px; }
			.gap-56 { gap: 56px; }
			.gap-64 { gap: 64px; }
		`}</style>
	</>
}

function Video(props: VoidProps<{
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

function Thumbnail() {
	return <>
		<style jsx>{`
			:global(:root) {
				--height-thumbnail: 96px;
				--border-radius-thumbnail: 8px;
			}
		`}</style>
		<div class="flex-row gap-16">
			<Video h="var(--height-thumbnail)" rounded="var(--border-radius-thumbnail)" color="red" />
			<div class="flex-grow flex-col gap-6">
				<Line w="70%" color="red" />
				<Line w="90%" color="red" />
				<Line w="80%" color="red" />
				<Line w="60%" color="red" />
			</div>
		</div>
	</>
}

export function App() {
	return <>
		<Globals />
		<style jsx>{`
			.navbar-placeholder {
				height: var(--height-navbar);
			}
			.container {
				padding: 32px 0;
				width: 100%;
				max-width: 1536px;
			}

			main  { flex-grow: 1; }
			aside { width: 448px; }

			aside hr {
				margin: 16px calc(var(--border-radius-thumbnail) / 2);
				height: 4px;
				border-radius: var(--full);
				background-color: hsl(0deg 100% 50% / 50%);
			}
		`}</style>
		<Navbar />
		<div class="navbar-placeholder"></div>
		<div class="flex-row flex-center-x">
			<div class="container flex-row flex-center-x gap-32">
				<main class="flex-col gap-16">
					<Video rounded="8px" color="red" />
				</main>
				<aside class="flex-col gap-16">
					<Thumbnail />
					<hr />
					<For each={[0, 1, 2, 3, 4, 5, 6, 7]}>
						{Thumbnail}
					</For>
				</aside>
			</div>
		</div>
	</>
}
