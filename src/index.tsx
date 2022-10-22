import "./css"

import { createSignal, For, ParentProps, VoidProps } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { AriaButton, AriaCheckbox, AriaRadio, AriaRadiogroup, AriaSliderHorizontal, AriaSliderThumb } from "./aria"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { SmileySVG } from "./smiley-svg"
import { createScreenEffect, css, CSSProps, RefProps } from "./utils/solid"
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

function Radiogroup(props: ParentProps<CSSProps>) {
	const [groupValue, setGroupValue] = createSignal("foo")

	return <>
		<AriaRadiogroup class={props.class} style={props.style} groupValue={groupValue()} setGroupValue={setGroupValue}>
			{props.children}
		</AriaRadiogroup>
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
			.results-grid-cell :nth-child(2) { grid-row: 3 / 3; }
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
		<Sheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
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
		</Sheet>
	</>
}

function App2() {
	createScreenEffect()

	const [checked1, setChecked1] = createSignal(false)
	const [checked2, setChecked2] = createSignal(false)
	const [checked3, setChecked3] = createSignal(false)

	const [groupValue, setGroupValue] = createSignal("foo")

	return <>
		{css`
			.cp-highlight-button {
				--color: var(--color);
				height: 40px;
				padding: 0 20px;
				border-radius: 1000px;
				/* Defer background-color and box-shadow */
				/* Defer background-color and box-shadow */

				/* Flow */
				display: flex;
				flex-direction: row;
				justify-content: center; /* Center x-axis */
				align-items: center;     /* Center y-axis */
				gap: 10px;
			}

			/********************************/

			.cp-highlight-button[aria-checked=false] {
				background-color: white;
				box-shadow: 0 0 0 1px hsl(0 0% 0% / 10%), 0 0 0 4px hsl(0 0% 0% / 10%);
			}
			.cp-highlight-button[aria-checked=true] {
				background-color: var(--color);
				box-shadow: /* 0 0 0 1px hsl(0 0% 0% / 10%), */ 0 0 0 4px hsl(0 0% 0% / 10%);
			}

			/********************************/

			.cp-highlight-button-icon {
				height: 20px;
				aspect-ratio: 1;
				/* Defer color */
			}
			.cp-highlight-button[aria-checked=false] { color: var(--color); }
			.cp-highlight-button[aria-checked=true]  { color: white; }

			/********************************/

			.cp-highlight-button-label {
				font: 600 14px / normal system-ui;
				letter-spacing: 0.05em;
				/* Defer color */
			}
			.cp-highlight-button[aria-checked=false] .cp-highlight-button-label { color: hsl(0 0% 25%); }
			.cp-highlight-button[aria-checked=true]  .cp-highlight-button-label { color: white; }

			/********************************/

			.cp-highlight-button-checkbox {
				position: relative;
				height: 24px;
				aspect-ratio: 1;
				border-radius: calc(100% / 3);
				background-color: white;
				box-shadow: 0 0 0 1px hsl(0 0% 0% / 25%);

				/* Flow */
				display: grid;
				place-items: center;
			}
			.cp-highlight-button[aria-checked=false] .cp-highlight-button-checkbox-check { display: none; }
			.cp-highlight-button[aria-checked=true]  .cp-highlight-button-checkbox-check {
				height: 60%;
				aspect-ratio: 1;
				color: var(--color);
			}

			/********************************/

			.cp-highlight-button-radio {
				position: relative;
				height: 24px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: white;
				box-shadow: 0 0 0 1px hsl(0 0% 0% / 25%);

				/* Flow */
				display: grid;
				place-items: center;
			}
			.cp-highlight-button[aria-checked=false] .cp-highlight-button-radio-check { display: none; }
			.cp-highlight-button[aria-checked=true]  .cp-highlight-button-radio-check {
				height: calc(100% / 3);
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: var(--color);
			}
		`}
		<div class="[display:grid] [place-items:center] [height:$screen-y]">
			<div class="[width:448px]">
				<div class="[display:flex] [flex-direction:column] [gap:16px]">
					<div class="[display:grid] [grid-template-columns:repeat(1,_1fr)] [gap:16px]">
						<For each={[
							//// { "--color": "#ffb13b", checked: checked1, setChecked: setChecked1, children: "SVG"   },
							{ "--color": "hsl(200 100% 55%)", checked: checked2, setChecked: setChecked2, children: "INCLUDE MIT LICENSE" },
							//// { "--color": "#4fc08d", checked: checked3, setChecked: setChecked3, children: "VUE"   },
						]}>{props => <>
								<AriaCheckbox class="cp-highlight-button" style={{ "--color": props["--color"] }} checked={props.checked()} setChecked={props.setChecked}>
								<Dynamic component={SmileySVG} class="cp-highlight-button-icon" />
								<div class="cp-highlight-button-label">{props.children}</div>
								<div class="cp-highlight-button-checkbox">
									<Dynamic
										component={CheckSVG}
										class="cp-highlight-button-checkbox-check"
										style={{ "stroke-width": "6" }}
									/>
								</div>
							</AriaCheckbox>
						</>}</For>
					</div>
					<AriaRadiogroup class="[display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:16px]" groupValue={groupValue()} setGroupValue={setGroupValue}>
						<For each={[
							{ "--color": "#ffb13b", value: "foo", children: "SVG"   },
							{ "--color": "#61dafb", value: "bar", children: "REACT" },
							{ "--color": "#4fc08d", value: "baz", children: "VUE"   },
						]}>{props => <>
							<AriaRadio class="cp-highlight-button" style={{ "--color": props["--color"] }} value={props.value}>
								<Dynamic component={SmileySVG} class="cp-highlight-button-icon" />
								<div class="cp-highlight-button-label">{props.children}</div>
								<div class="cp-highlight-button-radio">
									<div class="cp-highlight-button-radio-check"></div>
								</div>
							</AriaRadio>
						</>}</For>
					</AriaRadiogroup>
				</div>
			</div>
		</div>
	</>
}

function CheckSVG(props: VoidProps<RefProps & CSSProps>) {
	return <>
		<svg
			// Base props
			ref={el => props.ref?.(el as unknown as HTMLElement)}
			class={props.class}
			style={props.style}
			// SVG props
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	</>
}

render(() =>
	<App2 />,
	document.getElementById("root")!,
)
