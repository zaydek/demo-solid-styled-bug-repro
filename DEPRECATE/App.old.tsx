import { createSignal, For } from "solid-js"
import { css } from "./solid-utils/stylesheet"
import { range } from "./utils/range"

function Globals() {
	return <>
		{css(`
			:root {
				--full: 1000px;

				--sidebar-width: 384px;
				--expanded-sidebar-width: calc(var(--sidebar-width) * 1.5);

				--card-color: white;
				--card-box-shadow: 0 0 0 1px hsl(0deg 0% 90%);

				--duration: 400ms;
				--ease: ease;
			}
		`)}
	</>
}

function NavIcon() {
	return <>
		{css(`
			.nav-icon-context > * { isolation: isolate; }

			// .nav-icon-context
			.nav-icon-context { position: relative; }
			.nav-icon-context {
				height: 48px;
				aspect-ratio: 1;
				border-radius: var(--full);
			}
			.nav-icon-context::before { content: ""; }
			.nav-icon-context::before {
				position: absolute;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);

				// TRANSITION
				transition: 300ms cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.nav-icon-context:hover::before {
				background-color: pink;
				transform: scale(1);
			}
			.nav-icon-context:hover:active::before {
				background-color: red;
				transform: scale(1);
			}

			// .nav-icon
			.nav-icon {
				height: 50%;
				aspect-ratio: 1;
				border-radius: var(--full);
				background-color: red;
			}
			.nav-icon-context:hover:active .nav-icon {
				background-color: white;
			}
		`)}
		<div class="nav-icon-context grid grid-center">
			<div class="nav-icon"></div>
		</div>
	</>
}

const Sidebar = {
	Open:      0,
	Collapsed: 1,
	Expanded:  2,
}

export function App() {
	const [foo, setFoo] = createSignal(0)
	const [scrollY, setScrollY] = createSignal<`${number}px`>() // FIXME: SSR

	window.addEventListener("scroll", e => {
		setScrollY(`${window.scrollY}px`)
	}, false)

	document.addEventListener("click", e => {
		setFoo((foo() === 0 || foo() === 2) ? 1 : 2)
	}, false)

	return <>
		{css(`
			.layout-column-1-camera {
				transform: perspective(100px);
				transform-style: preserve-3d;
			}
			.layout-column-1 {
				margin-right: var(--sidebar-width);
				min-height: 100vh;
				background-color: var(--card-color);
				transition: var(--duration) var(--ease);
				// TODO: Add transition-property?

				transform-origin: 50% 100vh; // Centers translateZ
			}
			.layout-column-2 {
				position: fixed;
				z-index: 30;
				inset: 0 0 0 auto;
				width: var(--sidebar-width);
				background-color: var(--card-color);
				box-shadow: var(--card-box-shadow);
				transition: var(--duration) var(--ease);
				// TODO: Add transition-property?
			}
			.layout-column-2-backdrop {
				position: fixed;
				z-index: 30;
				inset: 0;
				background-color: hsl(0deg 0% 0% / 0%);
				transition: var(--duration) var(--ease);
				// TODO: Add transition-property?

				pointer-events: none;
			}

			${foo() === Sidebar.Collapsed && `
				.layout-column-1 {
					margin-right: revert;
				}
				.layout-column-2 {
					transform: translateX(var(--sidebar-width));
				}
			`}

			${foo() === Sidebar.Expanded && `
				body {
					top: ${scrollY()};
					overflow: hidden; // Hide overflowing content
				}
				.layout-column-1 {
					margin-right: revert;
					transform: scale(0.95);
					transform-origin: 50% 100vh; // Centers translateZ
					overflow: hidden; // Hide overflowing content
				}
				.layout-column-2 {
					width: var(--expanded-sidebar-width);
					box-shadow: revert;
				}
				.layout-column-2-backdrop {
					background-color: hsl(0deg 0% 0% / 35%);
					backdrop-filter: blur(4px);
					pointer-events: revert;
				}
			`}
		`)}
		<Globals />
		<div class="layout-column-1-camera">
			<div class="layout-column-1">
				<div class="sticky inset-t h-80 background-color:$card-color box-shadow:$card-box-shadow">
					<div>Hello, world!</div>
				</div>
				<For each={range(400)}>
					{() => <>
						<div>Hello, world!</div>
					</>}
				</For>
				<div>Hello, world!</div>
				<div>Hello, world!</div>
				<div>Hello, world!</div>
				<div>Hello, world!</div>
			</div>
		</div>
		<div class="layout-column-2-backdrop"></div>
		<div class="layout-column-2">
			<div class="px-16 h-80 flex-row flex-align-center">
				<NavIcon />
				<div class="flex-grow:1"></div>
				<NavIcon />
				<NavIcon />
			</div>
			<hr class="h-1 background-color:hsl(0deg_0%_90%)" />
		</div>
	</>
}
