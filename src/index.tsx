import "./css"

import { createSignal, For } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { AriaSliderHorizontal, AriaSliderThumb } from "./aria"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { SmileySVG } from "./smiley-svg"
import { css } from "./solid-utils"
import { only, range } from "./utils"

////////////////////////////////////////

function NavIcon() {
	return <>
		<div class="comp-nav-icon">
			<Dynamic class="comp-nav-icon-svg" component={SmileySVG} />
		</div>
	</>
}

function Slider() {
	const [value, setValue] = createSignal(50)

	return <>
		<AriaSliderHorizontal class="comp-slider" value={value()} setValue={setValue} min={0} max={100} step={1}>
			{translate => <>
				<div class="comp-slider-track">
					<AriaSliderThumb
						class="comp-slider-thumb"
						style={{
							...(translate() && {
								"transform": `translateX(${translate()!}px)`,
							}),
						}}
					/>
				</div>
			</>}
		</AriaSliderHorizontal>
	</>
}

function App() {
	const [sidesheet, setSidesheet] = createSignal<SidesheetState>("open")

	const [value, setValue] = createSignal(50)

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
			.line { height: 1px; background-color: hsl(0 0% 90%); }
			.line.is-collapsed { margin-top: -1px; }
		`}
		{/* @ts-expect-error */}
		<nav class="fixed-navbar" inert={only(sidesheet() === "expanded")}>
			<NavIcon />
			<div class="[flex-grow:1]"></div>
			<NavIcon />
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
							<NavIcon />
							<div class="[flex-grow:1]"></div>
							<NavIcon />
							<NavIcon />
						</nav>
						<hr class="line" />
					</div>
				</NonResponsive>
				<div class="[flex-grow:1] [overflow-y:auto]">
					<DrawerProvider>

						{/************************/}

						<Drawer head={<>
							<div class="line"></div>
							<div class="[padding:16px]">
								Hello, world!
							</div>
						</>}>
							<div class="[padding:16px] [padding-top:0_!important]">
								<Slider />
							</div>
						</Drawer>

						{/************************/}

						<Drawer head={<>
							<div class="line"></div>
							<div class="[padding:16px]">
								Hello, world!
							</div>
						</>}>
							<div class="[padding:16px] [padding-top:0_!important]">
								<Slider />
							</div>
						</Drawer>

						{/************************/}

						<Drawer head={<>
							<div class="line"></div>
							<div class="[padding:16px]">
								Hello, world!
							</div>
						</>}>
							<div class="[padding:16px] [padding-top:0_!important]">
								<Slider />
							</div>
						</Drawer>

						{/************************/}

						<Drawer head={<>
							<div class="line"></div>
							<div class="[padding:16px]">
								Hello, world!
							</div>
						</>}>
							<div class="[padding:16px] [padding-top:0_!important]">
								<Slider />
							</div>
						</Drawer>

						{/************************/}

					</DrawerProvider>
					<div class="line"></div>
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

////////////////////////////////////////

render(() =>
	<App />,
	document.getElementById("root")!,
)
