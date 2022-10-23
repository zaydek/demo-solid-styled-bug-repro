import "./css"

import { createEffect, createSignal, For, Show } from "solid-js"
import { Dynamic, Portal, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { Checkbox, NavIcon, Radio, Radiogroup, Slider } from "./components"
import { Drawer, DrawerProvider } from "./drawer"
import { NonResponsive, Sheet } from "./sheet"
import { SmileySVG } from "./smiley-svg"
import { createScreen, css } from "./utils/solid"
import { cx, only, range } from "./utils/vanilla"

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
			:root { --results-grid-cell-size: 80px; }
			@media (min-width: 500px) { :root { --results-grid-cell-size: 96px; } }

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
	</>
}

function App2() {
	return <>
		{css`
			.icon-list {
				height: var(--screen-y);
				overflow-y: auto;
			}
			.icon-container {
				position: relative;
				padding: 16px;

				/* Flow */
				display: grid;
				grid-template-columns: auto 1fr auto auto;
				align-items: center;
				gap: 16px;
			}
			.icon-container:not(:nth-child(1))::before { content: ""; }
			.icon-container:not(:nth-child(1))::before {
				position: absolute;
				inset: 0 0 100% 16px;
				border-top: 1px solid red;
			}
			.icon {
				height: 32px;
				aspect-ratio: 1;
				color: gray;
			}
			.icon-label {
				height: 8px;
				aspect-ratio: 16;
				border-radius: 1000px;
				background-color: lightgray;
			}
			.icon-action-button {
				height: 24px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: lightgray;

				/* Flow */
				display: grid;
				place-items: center;
			}
			.icon-action-button-svg {
				height: 75%;
				aspect-ratio: 1;
				color: gray;
			}
			.icon-action-button + .icon-action-button { margin-left: -8px; }
		`}
		<div class="icon-list">
			<For each={range(200)}>{() => <>
				<div class="icon-container">
					<Dynamic component={SmileySVG} class="icon" />
					<div class="icon-label"></div>
					<div class="icon-action-button">
						<Dynamic component={SmileySVG} class="icon-action-button-svg" />
					</div>
					<div class="icon-action-button">
						<Dynamic component={SmileySVG} class="icon-action-button-svg" />
					</div>
				</div>
			</>}</For>
		</div>
	</>
}

//// // FIXME: Use suppressWarning because of bottomsheet
//// const { screenX } = createScreen({ suppressWarning: true })
////
//// createEffect(() => {
//// 	console.log(screenX() / 96)
//// })

function App3() {
	const [ref, setRef] = createSignal<HTMLElement>()

	// Checkboxes
	const [list, setList] = createSignal(false)
	const [noName, setNoName] = createSignal(false)

	// Sliders
	//// const [minmax, setMinmax] = createSignal(96)
	//// const [columns, setColumns] = createSignal(8)
	const [height, setHeight] = createSignal(50)

	//// const [once, setOnce] = createSignal(false)
	//// createEffect(() => {
	//// 	if (!once()) {
	//// 		setOnce(true)
	//// 		return
	//// 	}
	//// 	ref()!.style.setProperty("--__columns", "" + columns())
	//// })

	return <>
		{css`
			/* * { */
			/* 	outline: 2px solid hsl(0 100% 50% / 10%); */
			/* 	outline-offset: -1px; */
			/* } */
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

			.container {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
			}
			.item {
				padding: 8px;
				padding-top: 0; /* Override */
			}
			.icon-container {
				/* Flow */
				display: grid;
				place-items: center;
			}
			.icon {
				height: 50%;
				aspect-ratio: 1;
				color: hsl(0 0% 25%);
			}
			.icon-label {
				padding: 4px 8px;
				height: 24px;
				border-radius: 1000px;
				background-color: hsl(0 0% 90%);
			}

			/* Overrides */
			.container.no-name .item { padding: 0; }
			.container.no-name .icon-label { display: none; }
		`}
		<div ref={setRef} class={cx(`container ${list() ? "list" : "grid"} ${(!list() && noName()) ? "no-name" : ""}`)}>
			<For each={range(200)}>{() => <>
				<div class="item">
					<div class="icon-container">
						<Dynamic component={SmileySVG} class="icon" style={{ "height": `${height()}%` }} />
					</div>
					<div class="icon-label">
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
				inset: auto auto 24px 24px;
				padding: 24px;
				/* width: 100%; */
				/* max-width: 1536px; */
				width: calc(var(--screen-x) - 24px - 24px);
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
				<Checkbox checked={list()} setChecked={setList}>
					LIST
				</Checkbox>
				<Show when={!list()}>
					<Checkbox checked={noName()} setChecked={setNoName}>
						NO NAME
					</Checkbox>
				</Show>
				{css`
					.slider-title {
						display: grid;
						grid-template-columns: 1fr auto;
					}
					.slider-title > :nth-child(2) { font-feature-settings: "tnum"; }
				`}
				{/* <div class="slider-title">
					<div>COLUMNS</div>
					<div>{columns()}</div>
				</div>
				<Slider value={columns()} setValue={setColumns} min={1} max={32} step={1} /> */}
				<div class="slider-title">
					<div>HEIGHT</div>
					<div>{height()}%</div>
				</div>
				<Slider value={height()} setValue={setHeight} min={25} max={75} step={1} />
			</div>
		</Portal>
	</>
}

//// function App4() {
//// 	return <>
//// 		{css`
//// 			/* * { */
//// 			/* 	outline: 2px solid hsl(0 100% 50% / 25%); */
//// 			/* 	outline-offset: -1px; */
//// 			/* } */
//// 			.typography {
//// 				font: 400 14px /
//// 					normal system-ui;
//// 			}
//// 			.ellipsis {
//// 				overflow: hidden;
//// 				text-overflow: ellipsis;
//// 				white-space: nowrap;
//// 			}
////
//// 			.container {
//// 				min-height: var(--screen-y);
////
//// 				/* Flow */
//// 				display: grid;
//// 				grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
//// 				/* gap: 8px; */
//// 			}
//// 			.item {
//// 				padding: 8px;
//// 				padding-top: revert; /* Override */
//// 			}
//// 			.icon-container {
//// 				height: calc(112px - 24px);
////
//// 				/* Flow */
//// 				display: grid;
//// 				place-items: center;
//// 			}
//// 			.icon {
//// 				height: 50%;
//// 				aspect-ratio: 1;
//// 				border-radius: 1000px;
//// 				background-color: hsl(0 0% 50%);
//// 			}
//// 			.icon-label {
//// 				padding: 4px 8px;
//// 				height: 24px;
//// 				border-radius: 1000px;
//// 				background-color: hsl(0 0% 90%);
//// 			}
//// 		`}
//// 		<div class="container">
//// 			<For each={range(200)}>{() => <>
//// 				<div class="item">
//// 					<div class="icon-container">
//// 						<div class="icon"></div>
//// 					</div>
//// 					<div class="icon-label">
//// 						<div class="typography ellipsis [text-align:center]">
//// 							icon-name
//// 						</div>
//// 					</div>
//// 				</div>
//// 			</>}</For>
//// 		</div>
//// 	</>
//// }

render(() =>
	<App3 />,
	document.getElementById("root")!,
)
