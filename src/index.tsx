import "./css"

import { createSignal } from "solid-js"
import { For, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { css } from "./solid-utils"
import { only, range } from "./utils"

////////////////////////////////////////

function App() {
	const [sidesheet, setSidesheet] = createSignal<SidesheetState>("open")

	return <>
		{css`
			:root {
				--fixed-navbar-height: calc(32px + 16px + 16px);
			}
			.fixed-navbar {
				position: fixed;
				z-index: 10;
				inset: 0 0 auto 0;
				padding: 16px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);

				/* Flow */
				display: flex;
				flex-direction: row;
				align-items: center; /* Center y-axis */
				gap: 16px;
			}
			.navbar {
				padding: 16px;
				/* Defer background-color and box-shadow to .*-card */

				/* Flow */
				display: flex;
				flex-direction: row;
				align-items: center; /* Center y-axis */
				gap: 16px;
			}
			.nav-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: gray;
			}
			.line { height: 1px; background-color: hsl(0 0% 90%); }
			.line.is-collapsed { margin-top: -1px; }
		`}
		{/* @ts-expect-error */}
		<nav class="fixed-navbar" inert={only(sidesheet() === "expanded")}>
			<div class="nav-icon"></div>
			<div class="[flex-grow:1]"></div>
			<div class="nav-icon"></div>
		</nav>
		{/* @ts-expect-error */}
		<main class="main-content" inert={only(sidesheet() === "expanded")}>
			<For each={range(4_000)}>{() => <>
				hello{" "}
			</>}</For>
		</main>
		<Sheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
			<aside class="aside-content [display:flex] [flex-direction:column]">
				<NonResponsive>
					<div class="[flex-shrink:0]">
						<nav class="navbar">
							<div class="nav-icon"></div>
							<div class="[flex-grow:1]"></div>
							<div class="nav-icon"></div>
							<div class="nav-icon"></div>
						</nav>
						<hr class="line" />
					</div>
				</NonResponsive>
				<div class="[flex-grow:1] [overflow-y:auto]">
					<DrawerProvider>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
						<Drawer head={<>Hello, world!</>}>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
							<div>🤔🤔🤔🤔🤔🤔🤔</div>
						</Drawer>
					</DrawerProvider>
				</div>
				<div class="[flex-shrink:0]">
					<hr class="line is-collapsed" />
					<section class="[padding:16px]">
						<div>This is the last block</div>
					</section>
				</div>
			</aside>
		</Sheet>
	</>
}

render(() => <App />, document.getElementById("root")!)
