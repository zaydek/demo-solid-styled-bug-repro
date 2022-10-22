import "./css"

import { createSignal, For } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { CheckableCheckbox, CheckableRadio, NavIcon, Radiogroup, Slider } from "./components"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { SmileySVG } from "./smiley-svg"
import { css } from "./utils/solid"
import { only, range } from "./utils/vanilla"

const [sidesheet, setSidesheet] = createSignal<SidesheetState>("open")

function App() {
	return <>
		{css`
			.layout-nav {
				position: fixed;
				z-index: 10;
				inset: 0 0 auto 0;
				padding: 16px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);

				/* Flow */
				/* TODO: Convert to grid */
				display: flex;
				flex-direction: row;
				align-items: center; /* Center y-axis */
				gap: 16px;
			}
		`}
		{/* @ts-expect-error */}
		<nav class="layout-nav" inert={only(sidesheet() === "expanded")}>
			<NavIcon />
			{/* TODO: Deprecate use of flex-grow */}
			<div class="[flex-grow:1]">
				<div>Hello, world!</div>
			</div>
			<NavIcon />
		</nav>
		{css`
			:root {
				--results-grid-cell-size: 80px;
			}
			@media (min-width: 500px) { :root {
				--results-grid-cell-size: 96px;
			} }

			.results-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--results-grid-cell-size), 1fr));
				place-items: center;
			}
			.results-grid-cell {
				height: var(--results-grid-cell-size);
				aspect-ratio: 1;

				/* Flow */
				display: grid;
				grid-template-rows: 16px 1fr 32px;
				place-items: center;
			}
			.results-grid-cell :nth-child(1) { grid-row: 2; }
			.results-grid-cell :nth-child(2) { grid-row: 3; }
			.results-grid-icon-svg {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color:gray;
			}
		`}
		{/* @ts-expect-error */}
		<main class="layout-main" inert={only(sidesheet() === "expanded")}>
			<div class="results-grid">
				<For each={range(300)}>{() => <>
					<div class="results-grid-cell">
						<div class="results-grid-icon-svg"></div>
						<div class="ellipsis [justify-self:stretch] [text-align:center]">Hello, world! Hello, world!</div>
					</div>
				</>}</For>
			</div>
		</main>
		{css`
			.bottomsheet-content {
				display: grid;
				grid-template-rows: 1fr auto;
			}
			.sidesheet-content {
				display: grid;
				grid-template-rows: auto 1fr auto;
			}
			.bottomsheet-content > :nth-child(1) { overflow-y: auto; }
			.sidesheet-content   > :nth-child(2) { overflow-y: auto; }
		`}
		<Sheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
			<NonResponsive>
				<section>
					{css`
						.navbar {
							padding: 16px;

							/* Flow */
							display: grid;
							grid-template-columns: auto 1fr auto auto;
							gap: 16px;
						}
						.navbar > :nth-child(1) { grid-column: 1; }
						.navbar > :nth-child(2) { grid-column: 3; }
						.navbar > :nth-child(3) { grid-column: 4; }
					`}
					<nav class="navbar">
						<NavIcon />
						<NavIcon />
						<NavIcon />
					</nav>
					<div class="line"></div>
				</section>
			</NonResponsive>
			<section>
				{css`
					/* Use drawer-head-content because of line and line.is-collapsed */
					.drawer-head-content {
						padding: 16px 24px; /* Add 8px to x-axis because of cp-checkable-label */

						/* Flow */
						display: grid;
						grid-template-columns: auto 1fr auto;
						align-items: center;
						gap: 8px;
					}
					.drawer-head-icon {
						height: var(--form-svg-height);
						aspect-ratio: 1;
						color: gray;
					}
					.drawer-body {
						padding: 16px;
						padding-top: 0; /* Override */

						/* Flow */
						display: flex;
						flex-direction: column;
						gap: 8px;
					}
				`}
				<DrawerProvider>
					{/* <Drawer> */}
					<Drawer head={<>
						<div class="drawer-head-content">
							<Dynamic component={SmileySVG} class="drawer-head-icon" />
							<div>Hello, world!</div>
							<div>Foo</div>
						</div>
					</>} open>
						<Radiogroup class="[display:flex] [flex-direction:column] [gap:8px]">
							<For each={["foo", "bar"]}>{value => <>
								<CheckableRadio value={value}>
									Hello, world!
								</CheckableRadio>
							</>}</For>
						</Radiogroup>
					</Drawer>

					{/* <Drawer> */}
					<Drawer head={<>
						<div class="line"></div>
						<div class="drawer-head-content">
							<Dynamic component={SmileySVG} class="drawer-head-icon" />
							<div>Hello, world!</div>
							<div>Foo</div>
						</div>
					</>} open>
						<Radiogroup class="[display:flex] [flex-direction:column] [gap:8px]">
							<For each={["foo", "bar", "baz"]}>{value => <>
								<CheckableRadio value={value}>
									Hello, world!
								</CheckableRadio>
							</>}</For>
						</Radiogroup>
					</Drawer>

					{/* <Drawer> */}
					<Drawer head={<>
						<div class="line"></div>
						<div class="drawer-head-content">
							<Dynamic component={SmileySVG} class="drawer-head-icon" />
							<div>Hello, world!</div>
							<div>Foo</div>
						</div>
					</>} open>
						<CheckableCheckbox>
							Hello, world!
						</CheckableCheckbox>
						{/* <Radiogroup class="[display:flex] [flex-direction:column] [gap:8px]"> */}
						<Radiogroup class="[display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:16px]">
							<For each={[
								{ style: { "--color": "#ffb13b", "--alpha-color": "#ffb13b66" }, value: "foo" },
								{ style: { "--color": "#61dafb", "--alpha-color": "#61dafb66" }, value: "bar" },
								{ style: { "--color": "#4fc08d", "--alpha-color": "#4fc08d66" }, value: "baz" },
							]}>{({ style, value }) => <>
								{/* <Show when={index() > 0}>
									<div class="[margin:8px_0] [border-radius:1000px] [background-color:hsl(0_0%_90%)]"></div>
								</Show> */}
								<CheckableRadio style={style} value={value}>
									{value}
								</CheckableRadio>
							</>}</For>
						</Radiogroup>
					</Drawer>

					{/* <Drawer> */}
					<Drawer head={<>
						<div class="line"></div>
						<div class="drawer-head-content">
							<Dynamic component={SmileySVG} class="drawer-head-icon" />
							<div>Hello, world!</div>
							<div>Foo</div>
						</div>
					</>} open>
						<Slider />
					</Drawer>

					{/* <Drawer> */}
					<Drawer head={<>
						<div class="line"></div>
						<div class="drawer-head-content">
							<Dynamic component={SmileySVG} class="drawer-head-icon" />
							<div>Hello, world!</div>
							<div>Foo</div>
						</div>
					</>} open>
						<Slider />
					</Drawer>

					{/* <Drawer> */}
					<Drawer head={<>
						<div class="line"></div>
						<div class="drawer-head-content">
							<Dynamic component={SmileySVG} class="drawer-head-icon" />
							<div>Hello, world!</div>
							<div>Foo</div>
						</div>
					</>} open>
						<Slider />
					</Drawer>
				</DrawerProvider>
				<div class="line"></div>
			</section>
			<section>
				<div class="line is-collapsed"></div>
				<div class="[padding:16px] [display:flex] [flex-direction:row] [gap:16px]">
					<div class="[height:80px] [aspect-ratio:16_/_9] [border-radius:8px] [background-color:gray]"></div>
					<div class="[flex-grow:1]">
						<div>Hello, world!</div>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
					</div>
				</div>
				<div class="line"></div>
				<div class="[padding:16px]">
					<div>This is the last block</div>
					<div>This is the last block</div>
				</div>
			</section>
		</Sheet>
	</>
}

render(() =>
	<App />,
	document.getElementById("root")!,
)
