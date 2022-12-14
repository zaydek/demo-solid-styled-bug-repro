import "the-new-css-reset"
import "./css/_index.scss"

// TODO: This can likely be optimized
import svg from "./assets/svg.png"

import { For, JSX, Show, Suspense, VoidComponent } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { AriaButton } from "./aria"
import { Checkbox, NavIcon, Radio, Radiogroup, Slider } from "./components"
import { Drawer } from "./drawer"
import { LoadingBar } from "./loading-bar"
import { Sheet } from "./sheet"
import { darkMode, debugCSS, Framework, search, settings, VariantV1, VariantV2, Version } from "./state"
import { ReactSVG, SmileySVG, VueSVG } from "./svg"
import { css, CSSProps } from "./utils/solid"
import { cx, range } from "./utils/vanilla"

////////////////////////////////////////

function Sidebar() {
	return <>
		{css`
/**************************************/
/* bottomsheet */

.bottomsheet-content {
	height: calc(var(--screen-y) - var(--sheet-draggable-size) * 2 + 1px);

	/* Flow */
	display: grid;
	grid-template-rows: 1fr auto;
}
.bottomsheet-content > :is(:nth-child(1), :nth-child(3)) { display: none; }
.bottomsheet-content > :nth-child(2) { overflow-y: auto; }

/**************************************/
/* sidesheet */

.sidesheet-content {
	height: var(--screen-y);

	/* Flow */
	display: grid;
	grid-template-rows: auto 1fr auto;
}
.sidesheet-content > :nth-child(2) { overflow-y: auto; }

/**************************************/
/* sidebar-nav */

.sidebar-nav {
	padding:
		/* Y */ 0
		/* X */ 24px;
	height: var(--search-bar-height);

	/* Flow */
	display: grid;
	grid-template-columns: auto 1fr auto auto;
	align-items: center;
	gap: 16px;
}

/**************************************/
/* drawer */

/* Use Flexbox here because the number of children is variable */
.drawer-head {
	padding:
		16px
		24px;

	/* Flow */
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;
}
.drawer-head > :nth-child(2) { flex-grow: 1; }
.drawer-head-header {
	font: 500 11px /
		normal system-ui;
	font-feature-settings: "tnum";
	letter-spacing: 0.1em;
	color: var(--fill-100-color);
}
.drawer-head-subheader {
	font: 500 11px /
		normal system-ui;
	font-feature-settings: "tnum";
	letter-spacing: 0.1em;
	color: var(--fill-300-color);
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
	display: grid;
	gap: 8px;
}
/* Repeat flow for nested radiogroups */
.drawer-body > .radiogroup {
	display: grid;
	gap: 8px;
}
.drawer-body > .radiogroup.horizontal {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
}
		`}
		<Sheet>
			<div>
				<nav class="sidebar-nav">
					<NavIcon />
					<div></div>
					<NavIcon />
					<NavIcon />
				</nav>
				<div class="hairline-x"></div>
			</div>
			<div>

				{/****************************/}

				<Drawer head={<>
					<Dynamic component={SmileySVG} class="drawer-head-icon" />
					<div class="drawer-head-header">
						VERSION
					</div>
					<div class="drawer-head-subheader">
						{settings.version().toUpperCase()}
					</div>
				</>} open>
					<Radiogroup class="radiogroup" groupValue={settings.version()} setGroupValue={settings.setVersion}>
						<For<Version, JSX.Element> each={["v1", "v2"]}>{value => <>
							<Radio value={value}>
								{value.toUpperCase()}
							</Radio>
						</>}</For>
					</Radiogroup>
				</Drawer>

				{/****************************/}

				<Show when={settings.version() === "v1"} fallback={<>
					{/* V1 */}
					<div class="hairline-x"></div>
					<Drawer head={<>
						<Dynamic component={SmileySVG} class="drawer-head-icon" />
						<div class="drawer-head-header">
							VARIANT
						</div>
						<div class="drawer-head-subheader">
							{settings.variantV2().toUpperCase().split("/").join(" ?? ")}
						</div>
					</>} open>
						<Radiogroup class="radiogroup" groupValue={settings.variantV2()} setGroupValue={settings.setVariantV2}>
							<For<VariantV2, JSX.Element> each={["20/solid", "24/solid", "24/outline"]}>{value => <>
								<Radio value={value}>
									{value.toUpperCase().split("/").join(" ?? ")}
								</Radio>
							</>}</For>
						</Radiogroup>
					</Drawer>
				</>}>
					{/* V2 */}
					<div class="hairline-x"></div>
					<Drawer head={<>
						<Dynamic component={SmileySVG} class="drawer-head-icon" />
						<div class="drawer-head-header">
							VARIANT
						</div>
						<div class="drawer-head-subheader">
							{settings.variantV1().toUpperCase().split("/").join(" ?? ")}
						</div>
					</>} open>
						<Radiogroup class="radiogroup" groupValue={settings.variantV1()} setGroupValue={settings.setVariantV1}>
							<For<VariantV1, JSX.Element> each={["solid", "outline"]}>{value => <>
								<Radio value={value}>
									{value.toUpperCase()}
								</Radio>
							</>}</For>
						</Radiogroup>
					</Drawer>
				</Show>

				{/****************************/}

				<div class="hairline-x"></div>
				<Drawer head={<>
					<Dynamic component={SmileySVG} class="drawer-head-icon" />
					<div class="drawer-head-header">
						COPY TO CLIPBOARD
					</div>
					<div class="drawer-head-subheader">
						{settings.framework().toUpperCase()}
					</div>
				</>} open>
					<Checkbox checked={settings.license()} setChecked={settings.setLicense}>
						INCLUDE MIT LICENSE
					</Checkbox>
					<Radiogroup class="radiogroup horizontal" groupValue={settings.framework()} setGroupValue={settings.setFramework}>
						<Radio
							icon={svg}
							style={{
								"--__color": "#ffb13b",
								"--__alpha-color": "#ffb13b32",
							}}
							value="svg"
							center
						>
							SVG
						</Radio>
						<Radio
							icon={props => <ReactSVG {...props} strokeWidth={1.5} />}
							style={{
								"--__color": "#61dafb",
								"--__alpha-color": "#61dafb32",
							}}
							value="react"
							center
						>
							REACT
						</Radio>
						<Radio
							icon={VueSVG}
							style={{
								"--__color": "#4fc08d",
								"--__alpha-color": "#4fc08d32",
							}}
							value="vue"
							center
						>
							VUE
						</Radio>

						{/* <For<{
							icon:  VoidComponent<CSSProps> | string
							style: JSX.CSSProperties
							value: Framework
						}, JSX.Element> each={[
							{
								icon:
								svg,
								style: {
									"--__color": "#ffb13b",
									"--__alpha-color": "#ffb13b66",
								},
								value: "svg",
							},
							{
								icon:
								props => <ReactSVG {...props} strokeWidth={1.5} />,
								style: {
									"--__color": "#61dafb",
									"--__alpha-color": "#61dafb66",
								},
								value: "react",
							},
							{
								icon:
								VueSVG,
								style: {
									"--__color": "#4fc08d",
									"--__alpha-color": "#4fc08d66",
								},
								value: "vue",
							},
						]}>{({ icon, style, value }) => <>
							<Radio icon={icon} style={style} value={value} center>
								{value.toUpperCase()}
							</Radio>
						</>}</For> */}
					</Radiogroup>
				</Drawer>

				{/****************************/}

				<div class="hairline-x"></div>
				<Drawer head={<>
					<Dynamic component={SmileySVG} class="drawer-head-icon" />
					<div class="drawer-head-header">
						SIZE
					</div>
					<div class="drawer-head-subheader">
						{settings.size().toFixed(1)}PX
					</div>
					<AriaButton onClick={e => {
						e.stopPropagation()
						settings.setSize(32)
					}}>
						(Reset)
					</AriaButton>
				</>} open>
					<Slider value={settings.size()} setValue={settings.setSize} min={16} max={48} step={0.1} />
				</Drawer>

				{/****************************/}

				<Show when={settings.variant().endsWith("outline")} fallback={<>
					<div class="hairline-x"></div>
				</>}>
					<div class="hairline-x"></div>
					<Drawer head={<>
						<Dynamic component={SmileySVG} class="drawer-head-icon" />
						<div class="drawer-head-header">
							STROKE
						</div>
						<div class="drawer-head-subheader">
							{settings.stroke().toFixed(2)}
						</div>
						<AriaButton onClick={e => {
							e.stopPropagation()
							settings.setStroke(settings.version() === "v1" ? 2 : 1.5)
						}}>
							(Reset)
						</AriaButton>
					</>} open>
						<Slider value={settings.stroke()} setValue={settings.setStroke} min={0.5} max={settings.version() === "v1" ? 3.5 : 2.5} step={0.01} />
					</Drawer>
					<div class="hairline-x"></div>
				</Show>

				{/****************************/}

			</div>
			{css`
				/* TODO: Extract to component? */

				.sidebar-panel {
					padding: 16px;
				}
				.sidebar-panel.type-sponsor {
					display: grid;
					grid-template-columns: auto 1fr;
					gap: 16px;
				}
				.sponsor-media {
					height: 80px;
					aspect-ratio: 16 / 9;
					border-radius: 8px;
					background-color: gray;
				}
			`}
			<div>
				<div class="hairline-x collapsed"></div>
				<div class="sidebar-panel type-sponsor">
					<figure class="sponsor-media"></figure>
					<div>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
					</div>
				</div>
				<div class="hairline-x"></div>
				<div class="sidebar-panel">
					<div>This is the last block</div>
					<div>This is the last block</div>
				</div>
			</div>
		</Sheet>
	</>
}

function App() {
	return <>
		{css`
/**************************************/
/* search-bar */

.search-bar {
	position: fixed;
	z-index: 10;
	inset:
		/* T */ 0
		/* R */ 0
		/* B */ auto
		/* L */ 0;
	margin-right: var(--sidebar-width);
	padding:
		/* Y */ 0
		/* X */ 24px;
	height: var(--search-bar-height);
	background-color: var(--card-color);
	box-shadow: var(--card-hairline-box-shadow);

	/* Flow */
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	/* Defer to search-bar-text-field for padding */
}
:root:has(.sidesheet.state-closed)             .search-bar { margin-right: 0; }   /* Override */
@media (hover: none), not (min-width: 800px) { .search-bar { margin-right: 0; } } /* Override */
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
		/* Y */ 0
		/* X */ 24px;
	font: 400 16px /
		normal system-ui;
	color: var(--fill-100-color);
}

/**************************************/
/* results */

.results {
	margin:
		/* T */ var(--search-bar-height)
		/* R */ var(--sidebar-width)
		/* B */ 0
		/* L */ 0;
	padding:
		/* T */ 16px
		/* R */ var(--sheet-draggable-size)
		/* B */ calc(16px * 3)
		/* L */ 16px;

	/* Flow */
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(var(--results-item-height), 1fr));
	grid-auto-rows: var(--results-item-height); /* COMPAT/Safari */
}
:root:has(.sidesheet.state-closed)             .results { margin-right: 0; }                        /* Override */
@media (hover: none), not (min-width: 800px) { .results { margin-right: 0; padding-right: 16px; } } /* Override */
.results-item {
	padding:
		/* Y */ 0
		/* X */ 4px;
}
.results-item-icon-container {
	height: calc(var(--results-item-height) - 24px);

	/* Flow */
	display: grid;
	place-items: center;
}
.results-item-icon {
	height: 32px;
	aspect-ratio: 1;
	color: var(--fill-100-color);
}
/* This is a trick to create a bounding box and center from the top */
.results-item-label-container {
	height: 24px;

	/* Flow */
	display: grid;
	align-content: start; /* Center children on the y-axis from the start */
}
.results-item-label {
	text-align: center; /* Center x-axis */
	font: 400 12px /
		normal system-ui;
	color: var(--fill-300-color);
}
.results-item-label-highlight {
	border-radius: 1px;
	color: hsl(25 100% 10%);
	background-color: hsl(50 100% 90%);
}
		`}
		<nav class="search-bar">
			<NavIcon />
			<input
				class="search-bar-text-field"
				type="text"
				value={search.value()}
				onInput={e => search.setValue(e.currentTarget.value)}
				autocapitalize="off"
			/>
			<NavIcon />
		</nav>
		<Sidebar />
		<main class="results">
			<For each={search.results()}>{result => <>
				<article class="results-item">
					<AriaButton class="results-item-icon-container">
						<Dynamic
							// @ts-expect-error
							component={settings.icons()?.[result.title]}
							class="results-item-icon"
							style={{
								...(settings.size.dirty() && { "transform": `scale(${settings.size() / 32})` }),
								...(settings.stroke.dirty() && { "stroke-width": settings.stroke() }),
							}}
						/>
					</AriaButton>
					<div class="results-item-label-container">
						<div class={cx(`results-item-label ${result.parts ? "match" : ""}`)}>
							<Show when={result.parts} fallback={result.kebab}>
								{result.parts![0]}
								<span class="results-item-label-highlight">
									{result.parts![1]}
								</span>
								{result.parts![2]}
							</Show>
						</div>
					</div>
				</article>
			</>}</For>
		</main>
	</>
}

function Skeleton() {
	return <>
		{css`
/**************************************/
/* sk-nav */

.sk-search-bar {
	position: fixed;
	z-index: 10;
	inset:
		/* T */ 0
		/* R */ 0
		/* B */ auto
		/* L */ 0;
	margin:
		/* T */ 0
		/* R */ var(--sidebar-width)
		/* B */ 0
		/* L */ 0;
	padding:
		/* Y */ 0
		/* X */ 24px;
	height: var(--search-bar-height);
	background-color: var(--card-color);
	box-shadow: var(--card-hairline-box-shadow);

	/* Flow */
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	/* gap: calc(var(--search-bar-height) / 4); */
}
@media (hover: none), not (min-width: 800px) { .sk-search-bar { margin-right: 0; } } /* Override */
.sk-search-bar-icon {
	height: 32px;
	aspect-ratio: 1;
	border-radius: 1000px;
	background-color: var(--skeleton-color);
}
.sk-search-bar-text-field-container {
	padding: 0 24px;
}
.sk-search-bar-text-field {
	height: 8px;
	aspect-ratio: 10;
	border-radius: 1000px;
	background-color: var(--skeleton-color);
}

/**************************************/
/* sk-sidebar */

.sk-sidebar {
	position: fixed;
	z-index: 10;
	inset:
		/* T */ 0
		/* R */ 0
		/* B */ 0
		/* L */ auto;
	width: var(--sidebar-width);
	background-color: var(--card-color);
	box-shadow: var(--card-hairline-box-shadow);
}
@media (hover: none), not (min-width: 800px) { .sk-sidebar { display: none; } }
.sk-sidebar-nav {
	height: var(--search-bar-height);
	background-color: var(--card-color);
	box-shadow: var(--card-hairline-box-shadow);
}

/**************************************/
/* sk-results */

.sk-results {
	margin:
		/* T */ var(--search-bar-height)
		/* R */ var(--sidebar-width)
		/* B */ 0
		/* L */ 0;
	padding: 16px;
	padding-right: var(--sheet-draggable-size); /* Override */

	/* Flow */
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(var(--results-item-height), 1fr));
	grid-auto-rows: var(--results-item-height); /* COMPAT/Safari */
}
@media (hover: none), not (min-width: 800px) { .sk-results { margin-right: 0; padding-right: 16px; } } /* Override */
.sk-results-item {
	padding:
		/* Y */ 0
		/* X */ 4px;
}
.sk-results-item-icon-container {
	height: calc(var(--results-item-height) - 24px);

	/* Flow */
	display: grid;
	place-items: center;
}
.sk-results-item-icon {
	height: 32px;
	aspect-ratio: 1;
	border-radius: 1000px;
	background-color: var(--skeleton-color);
}
.sk-results-item-label-container {
	padding:
		/* Y */ 4px
		/* X */ 0;
	height: 24px;

	/* Flow */
	display: grid;
	justify-items: center; /* Center children on the x-axis */
}
.sk-results-item-label {
	height: 8px;
	aspect-ratio: 8;
	border-radius: 1000px;
	background-color: var(--skeleton-color);
}
		`}
		<div class="sk-search-bar">
			<div class="sk-search-bar-icon"></div>
			<Show when={search.canonicalValue()}>
				<div class="sk-search-bar-text-field-container">
					<div class="sk-search-bar-text-field"></div>
				</div>
			</Show>
		</div>
		<div class="sk-sidebar">
			<div class="sk-sidebar-nav"></div>
		</div>
		<div class="sk-results">
			<For each={range(256)}>{() => <>
				<div class="sk-results-item">
					<div class="sk-results-item-icon-container">
						<div
							class="sk-results-item-icon"
							style={{
								...(settings.size.dirty() && {
									"transform": `scale(${settings.size() / 32})`
								}),
							}}
						></div>
					</div>
					<div class="sk-results-item-label-container">
						<div class="sk-results-item-label"></div>
					</div>
				</div>
			</>}</For>
		</div>
	</>
}

function Root() {
	// DEBUG
	window.addEventListener("keydown", e => {
		if (e.key === "\\") {
			debugCSS.toggle()
		} else if (e.key === "`") {
			darkMode.toggle()
		}
	})

	return <>
		{css`
:root {
	/* Enable HiDPI antialiasing */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* Disable scroll bounce on <html> */
	overscroll-behavior-y: none;
}
@media (hover: none) { :root { -webkit-text-size-adjust: 100%; } }           /* Disable font scaling */
@media (hover: none) { :root { -webkit-tap-highlight-color: transparent; } } /* Disable touch highlight */

:focus-visible { outline: revert; }
svg { overflow: visible; }

/**************************************/

/* This code is specifically implemented to support bottomsheet panning.
Dragging the bottomsheet interferes with body scrolling on iOS Safari. Therefore
disable <body> scrolling on and enable <main> scrolling. */

/* Disable <body> scrolling */
@media (hover: none) { :root:has(.bottomsheet) {
	position: fixed;
	inset: 0;
	overflow: hidden;
} }
/* Enable <main> scrolling */
:root:has(.bottomsheet) main {
	height: calc(var(--screen-y) - var(--search-bar-height) - var(--sheet-draggable-size));
	overflow-y: auto;
}
/* Disable body scrolling when bottomsheet=open or sidesheet=expanded */
:root:has(:is(.bottomsheet.state-open, .sidesheet.state-expanded)) body {
	overflow-y: hidden;
}

/**************************************/

/* DEBUG */
:root.debug-css *:not(svg *) {
	outline: 2px solid hsl(0 100% 50% / 10%);
	outline-offset: -1px;
}

/**************************************/

:root {
	--search-bar-height: 72px;
	--sidebar-width: 448px;
	--results-item-height: 96px;

	/* solid-sheet */
	/* --sheet-drag-indicator-background-color: var(--card-hairline-color); */
	/* --sheet-drag-indicator-active-background-color: var(--trim-color); */
	--sheet-backdrop-background-color: var(--card-backdrop-color);
	--sheet-card-background-color: var(--card-color);
	--sheet-card-box-shadow: var(--card-hairline-box-shadow);

	background-color: var(--card-color);
}

/**************************************/

.hairline-y { width:  var(--line-thickness); background-color: var(--card-hairline-color); }
.hairline-x { height: var(--line-thickness); background-color: var(--card-hairline-color); }

.hairline-y.collapsed { margin-left: calc(-1 * var(--line-thickness)); }
.hairline-x.collapsed { margin-top:  calc(-1 * var(--line-thickness)); }
		`}
		<LoadingBar />
		<Suspense fallback={Skeleton}>
			<Show when={settings.icons()} fallback={Skeleton}>
				<App />
			</Show>
		</Suspense>
	</>
}

function Foo() {
	return <>
		{css`
/* :focus-visible { outline: revert; } */

.column {
	margin:
		/* Y */ 0
		/* X */ auto;
	padding:
		/* Y */ 64px
		/* X */ 0;
	width: 448px;

	/* Flow */
	display: grid;
	gap: 8px;
}
.column > [role=radiogroup] {
	display: grid;
	gap: 8px;
}
		`}
		<div class="column">
			<Checkbox /* style={{ "--__color": "red"   }} */ center>HELLO WORLD</Checkbox>
			<Checkbox /* style={{ "--__color": "blue"  }} */ center>HELLO WORLD</Checkbox>
			<Checkbox /* style={{ "--__color": "green" }} */ center>HELLO WORLD</Checkbox>
			<Checkbox center>HELLO WORLD</Checkbox>
			<div></div>
			<Radiogroup>
				<Radio /* style={{ "--__color": "red"   }} */ value="foo" center>HELLO WORLD</Radio>
				<Radio /* style={{ "--__color": "blue"  }} */ value="bar" center>HELLO WORLD</Radio>
				<Radio /* style={{ "--__color": "green" }} */ value="baz" center>HELLO WORLD</Radio>
				<Radio value="qux" center>HELLO WORLD</Radio>
			</Radiogroup>
		</div>
	</>
}

render(
	() => <Root />,
	//// () => <Foo />,
	document.getElementById("root")!,
)
