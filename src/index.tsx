import "./css"

import { createSignal, For, ParentProps, VoidProps } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { AriaCheckbox, AriaRadio, AriaRadiogroup, AriaSliderHorizontal, AriaSliderThumb } from "./aria"
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

	const [checked, setChecked] = createSignal(false)
	//// const [checked2, setChecked2] = createSignal(false)
	//// const [checked3, setChecked3] = createSignal(false)

	const [groupValue, setGroupValue] = createSignal("foo")

	return <>
		{css`
			.foo-container {
				--color: hsl(200 100% 55%);

				/* padding: 5px; */
				/* padding-right: calc(5px + 2px); */
				/* Defer border-radius */
				/* Defer background-color */
				/* Defer box-shadow */

				display: grid;
				grid-template-columns: 1fr auto;
				align-items: center; /* foo-container and foo-checkbox have different heights */
				gap: 10px;
			}
			.foo-container:has(.foo-checkbox) {
				border-radius: 28px; /* 1000px breaks border-<tr>-radius and border-<br>-radius */
				border-top-right-radius: 20px;
				border-bottom-right-radius: 20px;
			}
			.foo-container:has(.foo-radio) {
				border-radius: 1000px;
			}
			.foo-container[aria-checked=false] {
				background-color: white;
				/* box-shadow: 0 0 0 1px hsl(0 0% 0% / 10%); */
			}
			.foo-container[aria-checked=true] {
				background-color: var(--color);
				/* box-shadow: none; */
			}
			.foo-label {
				padding: 0 10px;
				height: 28px;
				border-radius: 1000px;
				/* Defer background-color */

				/* Flow */
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				gap: 5px;
			}
			.foo-container[aria-checked=false] .foo-label { background-color: hsl(0 0% 92.5%); }
			.foo-container[aria-checked=true]  .foo-label { background-color: transparent; }
			.foo-label-icon {
				height: 60%;
				aspect-ratio: 1;
				/* color: hsl(0 0% calc(100% / 3)); */
				/* Defer color */
			}
			.foo-container[aria-checked=false] .foo-label-icon { color: var(--color); }
			.foo-container[aria-checked=true]  .foo-label-icon { color: white; }
			.foo-label-text {
				font: 600 12px / normal system-ui;
				letter-spacing: 0.05em;
				/* Defer color */
			}
			/* .foo-container[aria-checked=false] .foo-label-text { color: hsl(0 0% 25%); } */
			/* .foo-container[aria-checked=true]  .foo-label-text { color: white; } */

			/********************************/

			.foo-checkbox {
				height: 28px;
				aspect-ratio: 1;
				border-radius: calc(100% / 3);
				background-color: white;
				/* Defer box-shadow */

				/* Flow */
				display: grid;
				place-items: center;
			}
			.foo-container[aria-checked=false] .foo-checkbox {
				box-shadow: 0 0 0 1px hsl(0 0% 0% / 10%),
					0 0 0 4px hsl(0 0% 0% / 10%);
			}
			.foo-container[aria-checked=true] .foo-checkbox {
				box-shadow: /* 0 0 0 1px hsl(0 0% 0% / 10%), */
					0 0 0 4px hsl(0 0% 0% / 10%);
			}
			.foo-container[aria-checked=false] .foo-checkbox-check { display: none; }
			.foo-container[aria-checked=true]  .foo-checkbox-check {
				height: 50%;
				aspect-ratio: 1;
				/* border-radius: 1000px; */
				color: var(--color);
			}

			/********************************/

			.foo-radio {
				height: 28px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: white;
				/* Defer box-shadow */

				/* Flow */
				display: grid;
				place-items: center;
			}
			.foo-container[aria-checked=false] .foo-radio {
				box-shadow: 0 0 0 1px hsl(0 0% 0% / 10%),
					0 0 0 4px hsl(0 0% 0% / 10%);
			}
			.foo-container[aria-checked=true] .foo-radio {
				box-shadow: /* 0 0 0 1px hsl(0 0% 0% / 10%), */
					0 0 0 4px hsl(0 0% 0% / 10%);
			}
			.foo-container[aria-checked=false] .foo-radio-check { display: none; }
			.foo-container[aria-checked=true]  .foo-radio-check {
				height: calc(100% / 3);
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: var(--color);
			}
		`}
		<div class="[display:grid] [place-items:center] [height:$screen-y]">
			<div class="[width:448px] [display:flex] [flex-direction:column] [gap:10px]">
				<AriaCheckbox class="foo-container" checked={checked()} setChecked={setChecked}>
					<div class="foo-label">
						<Dynamic component={SmileySVG} class="foo-label-icon" />
						<div class="foo-label-text">INCLUDE MIT LICENSE</div>
					</div>
					<div class="foo-checkbox">
						<Dynamic component={CheckSVG} class="foo-checkbox-check" style={{ "stroke-width": "8" }} />
					</div>
				</AriaCheckbox>
				<AriaRadiogroup class="[display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:10px]" groupValue={groupValue()} setGroupValue={setGroupValue}>
					<For each={[
						{ style: { "--color": "#ffb13b" }, value: "foo", children: "SVG"   },
						{ style: { "--color": "#61dafb" }, value: "bar", children: "REACT" },
						{ style: { "--color": "#4fc08d" }, value: "baz", children: "VUE"   },
					]}>{p => <>
						<AriaRadio class="foo-container" style={p.style} value={p.value}>
							<div class="foo-label">
								<Dynamic component={SmileySVG} class="foo-label-icon" />
								<div class="foo-label-text">{p.children}</div>
							</div>
							<div class="foo-radio">
								<div class="foo-radio-check"></div>
							</div>
						</AriaRadio>
					</>}</For>
				</AriaRadiogroup>
			</div>
		</div>
	</>
}

function CheckSVG(props: VoidProps<RefProps & CSSProps>) {
	return <>
		<svg ref={el => props.ref?.(el as unknown as HTMLElement)} class={props.class} style={props.style} fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	</>
}

render(() =>
	<App2 />,
	document.getElementById("root")!,
)
