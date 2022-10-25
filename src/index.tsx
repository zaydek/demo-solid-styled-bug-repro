import "./css"

import { createResource, createSignal, For, Index, onMount, Resource, Show, Suspense } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { SidesheetState } from "solid-sheet"
import { Checkbox, NavIcon, Radio, Radiogroup, Slider } from "./components"
import { Drawer, DrawerProvider } from "./drawer"
import { ProgressBarProvider, useProgressBar } from "./progress-bar"
import { BottomsheetOrSidesheet, NonResponsive, Responsive } from "./sheet"
import { SmileyOutlineSVG, SmileySVG } from "./smiley-svg"
import { darkMode, debugCSS, search, settings } from "./state"
import { createMediaSignal, createScreen, css } from "./utils/solid"
import { cx, only, range, round } from "./utils/vanilla"

////////////////////////////////////////

const [sidesheet, setSidesheet] = createSignal<SidesheetState>("open")

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

////////////////////////////////////////

function Nav() {
	return <>
		{css`
			/* Reuse layout-nav because of margin-right (see layout.css) */
			.layout-nav {
				position: fixed;
				z-index: 10;
				inset:
					0    /* T */
					0    /* R */
					auto /* B */
					0;   /* L */
				padding: 0 16px;
				height: 64px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 10%);

				/* Flow */
				display: grid;
				grid-template-columns: auto 1fr auto;
				align-items: center;
				gap: 16px;
			}
		`}
		<nav class="layout-nav">
			<NavIcon />
			<div class="[height:64px] [display:grid] [align-items:center]">
				<div>Hello, world!</div>
			</div>
			<NavIcon />
		</nav>
	</>
}

////////////////////////////////////////

//// <div class="debug-modal">
//// 	{css`
//// 		.slider-title {
//// 			display: grid;
//// 			grid-template-columns: 1fr auto;
//// 		}
//// 		.slider-title > :nth-child(2) { font-feature-settings: "tnum"; }
//// 	`}
//// 	<Checkbox checked={noName()} setChecked={setNoName}>
//// 		NO NAME
//// 	</Checkbox>
//// 	<div class="slider-title">
//// 		<div>HEIGHT</div>
//// 		<div>{heightPercentage()}%, {round(heightPixel(), { precision: 1 }).toFixed(1)}PX</div>
//// 	</div>
//// 	<Slider value={heightPercentage()} setValue={setHeightPercentage} min={20} max={80} step={1} />
//// 	<div class="slider-title">
//// 		<div>THICKNESS</div>
//// 		<div>{strokeWidth()}</div>
//// 	</div>
//// 	<Slider value={strokeWidth()} setValue={setStrokeWidth} min={0.5} max={2.5} step={0.1} />
//// </div>

function Main() {
	return <>
		{css`
			.results-grid-container {
				--label-height: 28px;

				padding: 16px;

				/* Flow */
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
			}
			/* Defer padding-right to layout-main on touch devices */
			@media (hover: hover) { .results-grid-container { padding-right: 0; } } /* Override */
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
				padding:
					0    /* Y */
					8px; /* X */
				height: var(--label-height);
				border-radius: 1000px;
				background-color: hsl(0 0% 90%);

				/* Flow */
				display: grid;
				align-items: center; /* Use align-items because of ellipsis */
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
									// TODO: Change to dirty signals?
									...(heightPercentage() !== 50 && {
										"transform": `scale(${heightPercentage() / 50})`,
									}),
									...(strokeWidth() !== 1.5 && {
										"stroke-width": "" + strokeWidth(),
									}),
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
	</>
}

////////////////////////////////////////

function Aside() {
	return <>
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

			/********************************/

			.aside-navbar {
				padding: 16px;

				/* Flow */
				display: grid;
				grid-template-columns: auto 1fr auto auto;
				gap: 16px;
			}
			.aside-navbar > :nth-child(1) { grid-column: 1; }
			.aside-navbar > :nth-child(2) { grid-column: 3; }
			.aside-navbar > :nth-child(3) { grid-column: 4; }

			/********************************/

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
		<BottomsheetOrSidesheet sidesheet={sidesheet()} setSidesheet={setSidesheet}>
			<NonResponsive>
				<section>
					<nav class="aside-navbar">
						<NavIcon />
						<NavIcon />
						<NavIcon />
					</nav>
					<div class="line"></div>
				</section>
			</NonResponsive>
			<section>
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
							<div>HEIGHT</div>
							<div>{heightPercentage()}%, {round(heightPixel(), { precision: 1 }).toFixed(1)}PX</div>
						</div>
					</>} open>
						<Slider value={heightPercentage()} setValue={setHeightPercentage} min={20} max={80} step={1} />
					</Drawer>

					{/* <Drawer> */}
					<Drawer head={<>
						<div class="line"></div>
						<div class="drawer-head-content">
							<Dynamic component={SmileySVG} class="drawer-head-icon" />
							<div>STROKE WIDTH</div>
							<div>{strokeWidth()}</div>
						</div>
					</>} open>
						<Slider value={strokeWidth()} setValue={setStrokeWidth} min={0.5} max={2.5} step={0.1} />
					</Drawer>
				</DrawerProvider>
				<div class="line"></div>
			</section>
			<section>
				<div class="line collapsed"></div>
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
		</BottomsheetOrSidesheet>
	</>
}

////////////////////////////////////////

function App() {
	console.log(darkMode.theme())
	darkMode.toggle()

	console.log(debugCSS.enabled())
	debugCSS.toggle()

	const progressBar = useProgressBar()
	onMount(() => {
		progressBar.actions.start()
	})

	return <>
		<Nav />
		<Main />
		<Aside />
	</>
}

////////////////////////////////////////

const desktop = window.matchMedia("(hover: hover)").matches

function Demo() {
	createScreen({ suppressWarning: true })

	return <>
		{css`
			/********************************/
			/* search-bar */

			.search-bar {
				position: sticky;
				z-index: 10;
				inset:
					0     /* T */
					auto  /* R */
					auto  /* B */
					auto; /* L */
				padding:
					0     /* Y */
					32px; /* X */
				height: 96px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 10%);

				/* Flow */
				display: grid;
				grid-template-columns: auto 1fr;
				align-items: center;
				/* gap: 24px; */
			}
			.search-bar-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: lightgray;
			}
			.search-bar-text-field { height: 100%; }                /* CSS reset */
			.search-bar-text-field:focus-visible { outline: none; } /* CSS reset */
			.search-bar-text-field {
				padding:
					0     /* Y */
					24px; /* X */
			}

			/********************************/
			/* results */

			.results {
				padding: 16px;

				/* Flow */
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--grid-size), 1fr));
			}
			.results-item {
				padding:
					0    /* Y */
					8px; /* X */
			}
			.results-item-icon-container {
				height: calc(var(--grid-size) - 24px);

				/* Flow */
				display: grid;
				place-items: center;
			}
			.results-item-icon {
				height: 32px;
				aspect-ratio: 1;
				/* border-radius: 1000px; */
				color: hsl(0 0% 25%);
			}
			/* This is a trick to create a
			bounding box and center from the
			top */
			.results-item-typography-container {
				height: 24px;

				/* Flow */
				display: grid;
				align-content: start; /* Center children on the y-axis from the start */
			}
			.results-item-typography {
				font: 400 12px /
					normal system-ui;
				text-align: center; /* Center x-axis */
			}
			.results-item-typography-icon { display: inline-block; }
			.results-item-typography-icon {
				margin-right: 6px;
 				height: 1.125em;
				aspect-ratio: 1;
				color: hsl(0 0% calc(100% * 2 / 3));
				vertical-align: middle; /* Center y-axis */
			}
		`}
		<div class="search-bar">
			<div class="search-bar-icon"></div>
			<input
				class="search-bar-text-field"
				type="text"
				value={search.value()}
				onInput={e => search.setValue(e.currentTarget.value)}
			/>
		</div>
		<div class="results">
			<For each={search.results()}>{result => <>
				<div class="results-item">
					<div class="results-item-icon-container">
						{/* NOTE: Use ?. syntax here because of <Suspense> */}
						{/* @ts-expect-error */}
						<Dynamic component={settings.icons()?.[result.title]} class="results-item-icon" />
					</div>
					<div class="results-item-typography-container">
						<div class="results-item-typography">
							{/* <Show when={desktop}> */}
								{/* @ts-expect-error */}
								<Dynamic component={settings.icons()?.[result.title]} class="results-item-typography-icon" />
							{/* </Show> */}
							{result.kebab}
						</div>
					</div>
				</div>
			</>}</For>
		</div>
	</>
}

function Skeleton() {
	return <>
		{css`
			/********************************/
			/* sk-nav */

			.sk-search-bar {
				position: sticky;
				z-index: 10;
				inset:
					0     /* T */
					auto  /* R */
					auto  /* B */
					auto; /* L */
				padding:
					0     /* Y */
					32px; /* X */
				height: 96px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 10%);

				/* Flow */
				display: grid;
				grid-template-columns: auto 1fr;
				align-items: center;
				gap: 24px;
			}
			.sk-search-bar-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: lightgray;
			}
			.sk-search-bar-text-field {
				height: 8px;
				aspect-ratio: 16;
				border-radius: 1000px;
				background-color: lightgray;
			}

			/********************************/
			/* .sk-results */

			.sk-results {
				padding: 16px;

				/* Flow */
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--grid-size), 1fr));
			}
			.sk-results-item {
				padding:
					0    /* Y */
					8px; /* X */
			}
			.sk-results-item-icon-container {
				height: calc(var(--grid-size) - 24px);

				/* Flow */
				display: grid;
				place-items: center;
			}
			.sk-results-item-icon {
				height: 32px;
				aspect-ratio: 1;
				border-radius: 1000px;
				background-color: lightgray;
			}
			.sk-results-item-typography-container {
				padding:
					4px /* Y */
					0;  /* X */
				height: 24px;

				/* Flow */
				display: grid;
				justify-items: center; /* Center children on the x-axis */
			}
			.sk-results-item-typography {
				height: 10px;
				aspect-ratio: 8;
				border-radius: 1000px;
				background-color: lightgray;
			}
		`}
		<div class="sk-search-bar">
			<div class="sk-search-bar-icon"></div>
			<div class="sk-search-bar-text-field"></div>
		</div>
		<div class="sk-results">
			<For each={range(32)}>{() => <>
				<div class="sk-results-item">
					<div class="sk-results-item-icon-container">
						<div class="sk-results-item-icon"></div>
					</div>
					<div class="sk-results-item-typography-container">
						<div class="sk-results-item-typography"></div>
					</div>
				</div>
			</>}</For>
		</div>
	</>
}

function Controller() {
	return <>
		<Suspense fallback={Skeleton}>
			<Demo />
		</Suspense>
	</>
}

render(
	function Root() {
		onMount(() => {
			window.addEventListener("keydown", e => {
				if (e.key === "`") {
					debugCSS.toggle()
				}
			})
		})

		return <>
			{css`
				:root.debug-css *:not(svg *) {
					outline: 2px solid hsl(0 100% 50% / 10%);
					outline-offset: -1px;
				}

				:root {
					--grid-size: 128px;
				}
			`}
			<ProgressBarProvider>
				<Controller />
			</ProgressBarProvider>
		</>
	},
	document.getElementById("root")!,
)
