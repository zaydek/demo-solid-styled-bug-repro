import "./css"

import { createSignal, For } from "solid-js"
import { Dynamic, Portal, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { Checkbox, NavIcon, Radio, Radiogroup, Slider } from "./components"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { SmileyOutlineSVG, SmileySVG } from "./smiley-svg"
import { css } from "./utils/solid"
import { cx, only, range, round } from "./utils/vanilla"

const [sidesheet, setSidesheet] = createSignal<SidesheetState>("open")

function App() {
	// Checkboxes
	const [noName, setNoName] = createSignal(false)

	// Sliders
	const [heightPercentage, setHeightPercentage] = createSignal(50)
	const [strokeWidth, setStrokeWidth] = createSignal(1.5)

	const heightPixel = () => {
		if (noName()) {
			return 112 * heightPercentage() / 100
		} else {
			return (112 - 24) * heightPercentage() / 100
		}
	}

	return <>
		{css`
			.layout-nav {
				position: fixed;
				z-index: 10;
				inset: 0 0 auto 0;
				padding: 16px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 10%);

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
			.typography {
				font: 400 14px /
					normal system-ui;
			}
			.ellipsis {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			/********************************/

			/* .results-grid-container *:not(svg *) { */
			/* 	outline: 2px solid hsl(0 100% 50% / 10%); */
			/* 	outline-offset: -1px; */
			/* } */
			.results-grid-container {
				--label-height: 24px;

				/* Flow */
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
			}
			/* @media (hover: none) { .results-grid-container { */
			/* 	height: var(--screen-y); */
			/* 	overflow-y: auto; */
			/* } } */
			.results-grid-item {
				padding: 8px;
				padding-top: 0; /* Override */
			}
			.results-grid-icon-container {
				height: calc(112px - var(--label-height));

				/* Flow */
				display: grid;
				place-items: center;
			}
			.results-grid-icon-svg {
				height: 50%;
				aspect-ratio: 1;
				color: hsl(0 0% 25%);
			}
			.results-grid-icon-label {
				padding: 4px 8px;
				height: var(--label-height);
				border-radius: 1000px;
				background-color: hsl(0 0% 90%);
			}
			/* Overrides */
			.results-grid-container.no-name .results-grid-item { padding: 0; }
			.results-grid-container.no-name .results-grid-icon-label { display: none; }
			.results-grid-container.no-name .results-grid-icon-container { height: 112px; }
		`}
		{/* @ts-expect-error */}
		<main class="layout-main" inert={only(sidesheet() === "expanded")}>
			<div class={cx(`results-grid-container ${noName() ? "no-name" : ""}`)}>
				<For each={range(200)}>{() => <>
					<div class="results-grid-item">
						<div class="results-grid-icon-container">
							{/* <Dynamic component={SmileySVG} class="icon" style={{ "height": `${height()}%` }} /> */}
							<Dynamic
								component={SmileyOutlineSVG}
								class="results-grid-icon-svg"
								style={{
									"transform": `scale(${heightPercentage() / 50})`,
									"stroke-width": "" + strokeWidth(),
								}}
							/>
						</div>
						<div class="results-grid-icon-label">
							<div class="typography ellipsis [text-align:center]">
								icon-name
							</div>
						</div>
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
						height: 16px;
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
								<Radio value={value}>
									Hello, world!
								</Radio>
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
								<Radio value={value}>
									Hello, world!
								</Radio>
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
						<Checkbox>
							Hello, world!
						</Checkbox>
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
								<Radio style={style} value={value}>
									{value}
								</Radio>
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

		{/* DEBUG */}
		{css`
			.debug-modal {
				position: fixed;
				inset: auto auto 16px 16px;
				padding: 24px;
				width: calc(var(--screen-x) - 16px * 2);
				max-width: 448px;
				border-radius: 24px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 10%);

				/* Flow */
				display: flex;
				flex-direction: column;
				gap: 16px;
			}
		`}
		<Portal ref={el => el.className = "portal"}>
			<div class="debug-modal">
				{css`
					.slider-title {
						display: grid;
						grid-template-columns: 1fr auto;
					}
					.slider-title > :nth-child(2) { font-feature-settings: "tnum"; }
				`}
				<Checkbox checked={noName()} setChecked={setNoName}>
					NO NAME
				</Checkbox>
				<div class="slider-title">
					<div>HEIGHT</div>
					<div>{heightPercentage()}%, {round(heightPixel(), { precision: 1 }).toFixed(1)}PX</div>
				</div>
				<Slider value={heightPercentage()} setValue={setHeightPercentage} min={20} max={80} step={1} />
				<div class="slider-title">
					<div>THICKNESS</div>
					<div>{strokeWidth()}</div>
				</div>
				<Slider value={strokeWidth()} setValue={setStrokeWidth} min={0.5} max={2.5} step={0.1} />
			</div>
		</Portal>

	</>
}

//// function App2() {
//// 	return <>
//// 		{css`
//// 			.icon-list {
//// 				height: var(--screen-y);
//// 				overflow-y: auto;
//// 			}
//// 			.icon-container {
//// 				position: relative;
//// 				padding: 16px;
////
//// 				/* Flow */
//// 				display: grid;
//// 				grid-template-columns: auto 1fr auto auto;
//// 				align-items: center;
//// 				gap: 16px;
//// 			}
//// 			.icon-container:not(:nth-child(1))::before { content: ""; }
//// 			.icon-container:not(:nth-child(1))::before {
//// 				position: absolute;
//// 				inset: 0 0 100% 16px;
//// 				border-top: 1px solid red;
//// 			}
//// 			.icon {
//// 				height: 32px;
//// 				aspect-ratio: 1;
//// 				color: gray;
//// 			}
//// 			.icon-label {
//// 				height: 8px;
//// 				aspect-ratio: 16;
//// 				border-radius: 1000px;
//// 				background-color: lightgray;
//// 			}
//// 			.icon-action-button {
//// 				height: 24px;
//// 				aspect-ratio: 1;
//// 				border-radius: 1000px;
//// 				background-color: lightgray;
////
//// 				/* Flow */
//// 				display: grid;
//// 				place-items: center;
//// 			}
//// 			.icon-action-button-svg {
//// 				height: 75%;
//// 				aspect-ratio: 1;
//// 				color: gray;
//// 			}
//// 			.icon-action-button + .icon-action-button { margin-left: -8px; }
//// 		`}
//// 		<div class="icon-list">
//// 			<For each={range(200)}>{() => <>
//// 				<div class="icon-container">
//// 					<Dynamic component={SmileySVG} class="icon" />
//// 					<div class="icon-label"></div>
//// 					<div class="icon-action-button">
//// 						<Dynamic component={SmileySVG} class="icon-action-button-svg" />
//// 					</div>
//// 					<div class="icon-action-button">
//// 						<Dynamic component={SmileySVG} class="icon-action-button-svg" />
//// 					</div>
//// 				</div>
//// 			</>}</For>
//// 		</div>
//// 	</>
//// }

function App3() {
	// Checkboxes
	const [noName, setNoName] = createSignal(false)

	// Sliders
	const [heightPercentage, setHeightPercentage] = createSignal(50)
	const [strokeWidth, setStrokeWidth] = createSignal(1.5)

	const heightPixel = () => {
		if (noName()) {
			return 112 * heightPercentage() / 100
		} else {
			return (112 - 24) * heightPercentage() / 100
		}
	}

	return <>
		{css`
			.typography {
				font: 400 14px /
					normal system-ui;
			}
			.ellipsis {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			/********************************/

			/* .results-grid-container *:not(svg *) { */
			/* 	outline: 2px solid hsl(0 100% 50% / 10%); */
			/* 	outline-offset: -1px; */
			/* } */
			.results-grid-container {
				--label-height: 24px;

				padding: 16px;

				/* Flow */
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
			}
			@media (hover: none) { .results-grid-container {
				height: var(--screen-y);
				overflow-y: auto;
			} }
			.results-grid-item {
				padding: 8px;
				padding-top: 0; /* Override */
			}
			.results-grid-icon-container {
				height: calc(112px - var(--label-height));

				/* Flow */
				display: grid;
				place-items: center;
			}
			.results-grid-icon-svg {
				height: 50%;
				aspect-ratio: 1;
				color: hsl(0 0% 25%);
			}
			.results-grid-icon-label {
				padding: 4px 8px;
				height: var(--label-height);
				border-radius: 1000px;
				background-color: hsl(0 0% 90%);
			}
			/* Overrides */
			.results-grid-container.no-name .results-grid-item { padding: 0; }
			.results-grid-container.no-name .results-grid-icon-label { display: none; }
			.results-grid-container.no-name .results-grid-icon-container { height: 112px; }
		`}
		<div class={cx(`results-grid-container ${noName() ? "no-name" : ""}`)}>
			<For each={range(200)}>{() => <>
				<div class="results-grid-item">
					<div class="results-grid-icon-container">
						{/* <Dynamic component={SmileySVG} class="icon" style={{ "height": `${height()}%` }} /> */}
						<Dynamic
							component={SmileyOutlineSVG}
							class="results-grid-icon-svg"
							style={{
								"transform": `scale(${heightPercentage() / 50})`,
								"stroke-width": "" + strokeWidth(),
							}}
						/>
					</div>
					<div class="results-grid-icon-label">
						<div class="typography ellipsis [text-align:center]">
							icon-name
						</div>
					</div>
				</div>
			</>}</For>
		</div>
		{css`
			.debug-modal {
				position: fixed;
				inset: auto auto 16px 16px;
				padding: 24px;
				width: calc(var(--screen-x) - 16px * 2);
				max-width: 448px;
				border-radius: 24px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 10%);

				/* Flow */
				display: flex;
				flex-direction: column;
				gap: 16px;
			}
		`}
		<Portal ref={el => el.className = "portal"}>
			<div class="debug-modal">
				{css`
					.slider-title {
						display: grid;
						grid-template-columns: 1fr auto;
					}
					.slider-title > :nth-child(2) { font-feature-settings: "tnum"; }
				`}
				<Checkbox checked={noName()} setChecked={setNoName}>
					NO NAME
				</Checkbox>
				<div class="slider-title">
					<div>HEIGHT</div>
					<div>{heightPercentage()}%, {round(heightPixel(), { precision: 1 }).toFixed(1)}PX</div>
				</div>
				<Slider value={heightPercentage()} setValue={setHeightPercentage} min={20} max={80} step={1} />
				<div class="slider-title">
					<div>THICKNESS</div>
					<div>{strokeWidth()}</div>
				</div>
				<Slider value={strokeWidth()} setValue={setStrokeWidth} min={0.5} max={2.5} step={0.1} />
			</div>
		</Portal>
	</>
}

render(() =>
	<App />,
	document.getElementById("root")!,
)
