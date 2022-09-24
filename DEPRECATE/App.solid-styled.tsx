import { createSignal, For, Show, VoidProps } from "solid-js"
import { Globals } from "./globals"
import { Grow, Line, Video } from "./primitives"

////////////////////////////////////////////////////////////////////////////////
// Components

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
				background-color: hsl(0deg 0% 100% / 75%);
			}
		`}</style>
		<div class="icon-wrapper grid grid-center">
			<div class="icon"></div>
		</div>
	</>
}

function SearchBar() {
	return <>
		<style jsx>{`
			:global(:root) {
				--height-search-bar: 40px;
				--width-search-bar: 512px;
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
				<Line w="50%" color="hsl(0deg 0% 100% / 75%)" />
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
				padding: 0 var(--global-padding-x);
				height: var(--height-navbar);
				background-color: white;
				box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 15%);
			}
			.navbar {
				width: 100%;
				max-width: 1536px;
			}
		`}</style>
		<div class="navbar-wrapper fixed inset-t flex-row flex-center-x">
			<div class="navbar flex-row flex-center-y gap-8">
				<Icon h="32px" color="red" />
				<Icon h="32px" color="red" />
				<Grow />
				<Icon h="32px" color="red" />
				<Icon h="32px" color="red" />
			</div>
			<div class="absolute inset grid grid-center auto-pointer-events">
				<SearchBar />
			</div>
		</div>
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

function ActionButton() {
	return <>
		<style jsx>{`
			.button {
				height: 36px;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: red;
			}
			.icon {
				height: 50%;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: hsl(0deg 0% 100% / 75%);
			}
		`}</style>
		<div class="button grid grid-center">
			<div class="icon"></div>
		</div>
	</>
}

function SubscribeButton() {
	return <>
		<style jsx>{`
			.button {
				height: 36px;
				aspect-ratio: 4;
				border-radius: 8px;
				background-color: red;
			}
		`}</style>
		<div class="button grid grid-center">
			<Line w="50%" color="hsl(0deg 0% 100% / 75%)" />
		</div>
	</>
}

function VideoMeta() {
	return <>
		<style jsx>{`
			.container {
				padding: 16px 0;
			}
		`}</style>
		<div class="container flex-row flex-center-y gap-16">
			<div class="flex-grow flex-col gap-12">
				<Line h="12px" w="70%" color="red" />
				<Line h="12px" w="35%" color="red" />
			</div>
			<div class="flex-row gap-8">
				<ActionButton />
				<ActionButton />
				<ActionButton />
			</div>
			<SubscribeButton />
		</div>
	</>
}

function Comment() {
	return <>
		<style jsx>{`
			.container {
				padding: 8px 0;
			}
			.user-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: red;
			}
		`}</style>
		<div class="container flex-row flex-center-y gap-8">
			<div class="user-icon"></div>
			<div class="flex-grow flex-col gap-6">
				<Line w="25%" color="red" />
				<Line w="20%" color="red" />
			</div>
		</div>
	</>
}

////////////////////////////////////////////////////////////////////////////////
// App

function DebugCSS() {
	return <>
		<style jsx global>{`
			* {
				outline: 2px solid hsl(195deg 100% 50% / 50%);
				outline-offset: -1px;
			}
			.flex-grow:empty { align-self: stretch; }
		`}</style>
	</>
}

export function App() {
	const [debug, setDebug] = createSignal(false)

	document.addEventListener("keydown", e => {
		if (e.key === "d") {
			setDebug(curr => !curr)
		}
	})

	return <>
		<Globals />
		<Show when={debug()}>
			<DebugCSS />
		</Show>

		<style jsx>{`
			:global(:root) {
				--global-padding-x: 16px;
				--global-padding-y: 32px;
				--global-padding:
					var(--global-padding-y)
					var(--global-padding-x);
			}

			.navbar-placeholder {
				height: var(--height-navbar);
			}
			.container-wrapper {
				padding: var(--global-padding);
			}
			.container {
				width: 100%;
				max-width: 1536px;
			}

			main  { flex-grow: 1; }
			aside { width: 448px; }

			hr {
				height: 4px;
				border-radius: var(--full);
				background-color: hsl(0deg 100% 50% / 50%);
			}
		`}</style>
		<Navbar />
		<div class="navbar-placeholder"></div>
		<div class="container-wrapper flex-row flex-center-x">
			<div class="container flex-row flex-center-x gap-32">
				<main class="flex-col gap-16">
					<Video rounded="8px" color="red" />
					<VideoMeta />
					<hr />
					<div></div>
					<Comment />
					<Comment />
					<Comment />
					<Comment />
				</main>
				<aside class="flex-col gap-16">
					<Thumbnail />
					<div></div>
					<hr />
					<div></div>
					<For each={[0, 1, 2, 3, 4, 5, 6, 7]}>
						{Thumbnail}
					</For>
				</aside>
			</div>
		</div>
	</>
}
