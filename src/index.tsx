import "./css"

import { createSignal, For, ParentProps, VoidProps } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { AriaRadio, AriaRadiogroup, AriaSliderHorizontal, AriaSliderThumb } from "./aria"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { SmileySVG } from "./smiley-svg"
import { css, CSSProps } from "./utils/solid"
import { only, range } from "./utils/vanilla"

////////////////////////////////////////

function NavIcon() {
	return <>
		<div class="cp-nav-icon">
			<Dynamic component={SmileySVG} class="cp-nav-icon-svg" />
		</div>
	</>
}

////////////////////////////////////////

function Radiogroup(props: ParentProps<CSSProps>) {
	const [groupValue, setGroupValue] = createSignal("foo")

	return <>
		<AriaRadiogroup class={props.class} style={props.style} groupValue={groupValue()} setGroupValue={setGroupValue}>
			{props.children}
		</AriaRadiogroup>
	</>
}

function Radio(props: VoidProps<{ value: string }>) {
	return <>
		<AriaRadio class="cp-radio-container" value={props.value}>
			<div class="cp-radio-label">
				<Dynamic component={SmileySVG} class="cp-radio-label-svg" />
				{/* TODO */}
				<div class="[flex-grow:1]">Hello, world!</div>
			</div>
			<div class="cp-radio">
				<div class="cp-radio-check"></div>
			</div>
		</AriaRadio>
	</>
}

////////////////////////////////////////

function Slider() {
	const [value, setValue] = createSignal(50)

	return <>
		<div class="cp-slider-container">
			<AriaSliderHorizontal class="cp-slider" value={value()} setValue={setValue} min={0} max={100} step={1}>
				{translate => <>
					<div class="cp-slider-track">
						<AriaSliderThumb
							class="cp-slider-thumb"
							style={{
								...(translate() && {
									"transform": `translateX(${translate()!}px)`,
								}),
							}}
						/>
					</div>
				</>}
			</AriaSliderHorizontal>
		</div>
	</>
}

////////////////////////////////////////

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
				display: flex;
				flex-direction: row;
				align-items: center; /* Center y-axis */
				gap: 16px;
			}
		`}
		{/* @ts-expect-error */}
		<nav class="layout-nav" inert={only(sidesheet() === "expanded")}>
			<NavIcon />
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
			.results-grid-cell :nth-child(1) { grid-row: 2 / 3; }
			.results-grid-cell :nth-child(2) {
				grid-row: 3 / 3;
				justify-self: stretch; /* Stretch x-axis */
			}
			.results-grid-icon-svg {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color:gray;
			}
			/* * { */
			/* 	outline: 1px solid red; */
			/* } */
		`}
		{/* @ts-expect-error */}
		<main class="layout-main" inert={only(sidesheet() === "expanded")}>
			<div class="results-grid">
				<For each={range(300)}>{() => <>
					<div class="results-grid-cell">
						<div class="results-grid-icon-svg"></div>
						<div class="ellipsis [text-align:center]">Hello, world! Hello, world!</div>
					</div>
				</>}</For>
			</div>
		</main>
		<Sheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
			{/* Add Flexbox to enable support for "flex-shrink: 0;" and
			"flex-grow: 1; overflow-y: auto;" */}
			<aside class="layout-sheet [display:flex] [flex-direction:column]">
				<NonResponsive>
					<div class="[flex-shrink:0]">
						{css`
							.navbar {
								padding: 16px;
								/* Defer background-color and box-shadow to .*-card */

								/* Flow */
								display: flex;
								flex-direction: row;
								align-items: center; /* Center y-axis */
								gap: 16px;
							}
						`}
						<nav class="navbar">
							<NavIcon />
							<div class="[flex-grow:1]"></div>
							<NavIcon />
							<NavIcon />
						</nav>
						<div class="line"></div>
					</div>
				</NonResponsive>
				<div class="[flex-grow:1] [overflow-y:auto]">
					{css`
						/* Use drawer-head-content because of line */
						.drawer-head-content {
							/* Use 24px for the x-axis padding because of <Radio> */
							padding: 16px 24px;

							/* Flow */
							display: flex;
							flex-direction: row;
							align-items: center;
							gap: 8px;
						}
						.drawer-head-svg {
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
						{/* Omit <div class="line"> here */}
						<Drawer head={<>
							<div class="drawer-head-content">
								<Dynamic component={SmileySVG} class="drawer-head-svg" />
								<div class="[flex-grow:1]">Hello, world!</div>
								<div>Foo</div>
							</div>
						</>} open>
							<Radiogroup class="[display:flex] [flex-direction:column] [gap:8px]">
								<For each={["foo", "bar", "baz"]}>{value => <>
									<Radio value={value} />
								</>}</For>
							</Radiogroup>
						</Drawer>
						<Drawer head={<>
							<div class="line"></div>
							<div class="drawer-head-content">
								<Dynamic component={SmileySVG} class="drawer-head-svg" />
								<div class="[flex-grow:1]">Hello, world!</div>
								<div>Foo</div>
							</div>
						</>} open>
							<Radiogroup class="[display:flex] [flex-direction:column] [gap:8px]">
								<For each={["foo", "bar", "baz"]}>{value => <>
									<Radio value={value} />
								</>}</For>
							</Radiogroup>
						</Drawer>
						<Drawer head={<>
							<div class="line"></div>
							<div class="drawer-head-content">
								<Dynamic component={SmileySVG} class="drawer-head-svg" />
								<div class="[flex-grow:1]">Hello, world!</div>
								<div>Foo</div>
							</div>
						</>} open>
							<Radiogroup class="[display:flex] [flex-direction:column] [gap:8px]">
								<For each={["foo", "bar", "baz"]}>{value => <>
									<Radio value={value} />
								</>}</For>
							</Radiogroup>
						</Drawer>
						<Drawer head={<>
							<div class="line"></div>
							<div class="drawer-head-content">
								<Dynamic component={SmileySVG} class="drawer-head-svg" />
								<div class="[flex-grow:1]">Hello, world!</div>
								<div>Foo</div>
							</div>
						</>} open>
							<Slider />
						</Drawer>
						<Drawer head={<>
							<div class="line"></div>
							<div class="drawer-head-content">
								<Dynamic component={SmileySVG} class="drawer-head-svg" />
								<div class="[flex-grow:1]">Hello, world!</div>
								<div>Foo</div>
							</div>
						</>} open>
							<Slider />
						</Drawer>
						<Drawer head={<>
							<div class="line"></div>
							<div class="drawer-head-content">
								<Dynamic component={SmileySVG} class="drawer-head-svg" />
								<div class="[flex-grow:1]">Hello, world!</div>
								<div>Foo</div>
							</div>
						</>} open>
							<Slider />
						</Drawer>
					</DrawerProvider>
					<div class="line"></div>
				</div>
				<div class="[flex-shrink:0]">
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
				</div>
			</aside>
		</Sheet>
	</>
}

render(() =>
	<App />,
	document.getElementById("root")!,
)
