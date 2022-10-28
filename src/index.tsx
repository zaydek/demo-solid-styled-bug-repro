import "./css"

import { createResource, createSignal, For, JSX, onMount, Show, Suspense } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { AriaButton } from "./aria"
import { Checkbox, NavIcon, Radio, Radiogroup, Slider } from "./components"
import { Drawer } from "./drawer"
import { LoadingBar } from "./loading-bar"
import { Sheet } from "./sheet"
import { SmileySVG } from "./smiley-svg"
import { darkMode, debugCSS, Framework, search, settings, VariantV1, VariantV2, Version } from "./state"
import { css } from "./utils/solid"
import { cx, range, round } from "./utils/vanilla"

////////////////////////////////////////

function Sidebar() {
	return <>
		{css`
			/********************************/
			/* bottomsheet */

			.bottomsheet-content {
				height: calc(var(--screen-y) - var(--sheet-draggable-size) * 2 + 1px);

				/* Flow */
				display: grid;
				grid-template-rows: 1fr auto;
			}
			.bottomsheet-content > :is(:nth-child(1), :nth-child(3)) { display: none; }
			.bottomsheet-content > :nth-child(2) { overflow-y: auto; }

			/********************************/
			/* sidesheet */

			.sidesheet-content {
				height: var(--screen-y);

				/* Flow */
				display: grid;
				grid-template-rows: auto 1fr auto;
			}
			.sidesheet-content > :nth-child(2) { overflow-y: auto; }

			/********************************/
			/* sidebar-nav */

			.sidebar-nav {
				padding:
					0     /* Y */
					24px; /* X */
				height: var(--search-bar-height);

				/* Flow */
				display: grid;
				grid-template-columns: auto 1fr auto auto;
				align-items: center;
				gap: 16px;
			}

			/********************************/
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
					<div>
						VERSION
					</div>
					<div>
						{settings.version().toUpperCase()}
					</div>
				</>} open>
					<div class="drawer-body-content">
						<Radiogroup class="[display:grid] [gap:8px]" groupValue={settings.version()} setGroupValue={settings.setVersion}>
							<For<Version, JSX.Element> each={["v1", "v2"]}>{value => <>
								<Radio value={value}>
									{value.toUpperCase()}
								</Radio>
							</>}</For>
						</Radiogroup>
					</div>
				</Drawer>

				{/****************************/}

				<Show when={settings.version() === "v1"}>
					<div class="hairline-x"></div>
					<Drawer head={<>
						<Dynamic component={SmileySVG} class="drawer-head-icon" />
						<div>
							VARIANT (V1)
						</div>
						<div>
							{settings.variantV1().toUpperCase()}
						</div>
					</>} open>
						<Radiogroup class="[display:grid] [gap:8px]" groupValue={settings.variantV1()} setGroupValue={settings.setVariantV1}>
							<For<VariantV1, JSX.Element> each={["solid", "outline"]}>{value => <>
								<Radio value={value}>
									{value.toUpperCase()}
								</Radio>
							</>}</For>
						</Radiogroup>
					</Drawer>
				</Show>

				{/****************************/}

				<Show when={settings.version() === "v2"}>
					<div class="hairline-x"></div>
					<Drawer head={<>
						<Dynamic component={SmileySVG} class="drawer-head-icon" />
						<div>
							VARIANT (V2)
						</div>
						<div>
							{settings.variantV2().toUpperCase()}
						</div>
					</>} open>
						<Radiogroup class="[display:grid] [gap:8px]" groupValue={settings.variantV2()} setGroupValue={settings.setVariantV2}>
							<For<VariantV2, JSX.Element> each={["20/solid", "24/solid", "24/outline"]}>{value => <>
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
					<div>
						COPY TO CLIPBOARD
					</div>
					<div>
						{settings.framework().toUpperCase()}
					</div>
				</>} open>
					<Checkbox checked={settings.license()} setChecked={settings.setLicense}>
						INCLUDE MIT LICENSE
					</Checkbox>
					<Radiogroup class="[display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:16px]" groupValue={settings.framework()} setGroupValue={settings.setFramework}>
						<For<{ style: JSX.CSSProperties, value: Framework }, JSX.Element> each={[
							{ style: { "--__color": "#ffb13b", "--__alpha-color": "#ffb13b66" }, value: "svg" },
							{ style: { "--__color": "#61dafb", "--__alpha-color": "#61dafb66" }, value: "react" },
							{ style: { "--__color": "#4fc08d", "--__alpha-color": "#4fc08d66" }, value: "vue" },
						]}>{({ style, value }) => <>
							<Radio style={style} value={value}>
								{value.toUpperCase()}
							</Radio>
						</>}</For>
					</Radiogroup>
				</Drawer>

				{/****************************/}

				<div class="hairline-x"></div>
				<Drawer head={<>
					<Dynamic component={SmileySVG} class="drawer-head-icon" />
					<div>
						SIZE
					</div>
					<div>
						{round(settings.scale() * 100)}%,{" "}
						{round(settings.scale() * 32, { precision: 1 }).toFixed(1)}PX
					</div>
					<div>(Reset)</div>
				</>} open>
					<Slider value={settings.scale()} setValue={settings.setScale} min={0.5} max={1.5} step={0.01} />
				</Drawer>

				{/****************************/}

				<div class="hairline-x"></div>
				<Drawer head={<>
					<Dynamic component={SmileySVG} class="drawer-head-icon" />
					<div>
						STROKE
					</div>
					<div>
						{settings.stroke()}
					</div>
					<div>(Reset)</div>
				</>} open>
					<Slider value={settings.stroke()} setValue={settings.setStroke} min={0.5} max={settings.version() === "v1" ? 3.5 : 2.5} step={0.01} />
				</Drawer>
				<div class="hairline-x"></div>

				{/****************************/}

			</div>
			<div>
				<div class="hairline-x collapsed"></div>
				<div class="[padding:16px] [display:grid] [grid-template-columns:auto_1fr] [gap:16px]">
					<div class="[height:80px] [aspect-ratio:16_/_9] [border-radius:8px] [background-color:gray]"></div>
					<div class="[flex-grow:1]">
						<div>Hello, world!</div>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
						<div>Hello, world!</div>
					</div>
				</div>
				<div class="hairline-x"></div>
				<div class="[padding:16px]">
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
			/********************************/
			/* search-bar */

			.search-bar {
				position: fixed;
				z-index: 10;
				inset:
					0    /* T */
					0    /* R */
					auto /* B */
					0;   /* L */
				margin-right: var(--sidebar-width);
				padding:
					0     /* Y */
					24px; /* X */
				height: var(--search-bar-height);
				background-color: var(--card-color);
				box-shadow: var(--card-hairline-box-shadow);

				/* Flow */
				display: grid;
				grid-template-columns: auto 1fr auto;
				align-items: center;
				/* Defer to search-bar-text-field for padding */
			}
			:root:has(.sidesheet.closed)                   .search-bar { margin-right: 0; }   /* Override */
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
					0     /* Y */
					24px; /* X */

				/* Typography */
				font: 400 17px /
					normal system-ui;
				/* letter-spacing: -0.0125em; */
				color: var(--fill-100-color);
			}

			/********************************/
			/* results */

			.results {
				margin:
					var(--search-bar-height) /* T */
					var(--sidebar-width)     /* R */
					0                        /* B */
					0;                       /* L */
				padding:
					16px                        /* T */
					var(--sheet-draggable-size) /* R */
					calc(16px * 3)              /* B */
					16px;                       /* L */

				/* Flow */
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--results-item-height), 1fr));
				grid-auto-rows: var(--results-item-height); /* COMPAT/Safari */
			}
			:root:has(.sidesheet.closed)                   .results { margin-right: 0; }                        /* Override */
			@media (hover: none), not (min-width: 800px) { .results { margin-right: 0; padding-right: 16px; } } /* Override */
			.results-item {
				padding:
					0    /* Y */
					4px; /* X */
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
			.results-item-typography-container {
				height: 24px;

				/* Flow */
				display: grid;
				align-content: start; /* Center children on the y-axis from the start */
			}
			.results-item-typography {
				text-align: center; /* Center x-axis */

				/* Typography */
				font: 400 12px /
					normal system-ui;
				/* letter-spacing: -0.0125em; */
				color: var(--fill-300-color);
			}
			.results-item-typography-highlight {
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
								...(settings.scale.dirty() && { "transform": `scale(${settings.scale()})` }),
								...(settings.stroke.dirty() && { "stroke-width": settings.stroke() }),
							}}
						/>
					</AriaButton>
					<div class="results-item-typography-container">
						<div class={cx(`results-item-typography ${result.parts ? "match" : ""}`)}>
							<Show when={result.parts} fallback={result.kebab}>
								{result.parts![0]}
								<span class="results-item-typography-highlight">
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
			/********************************/
			/* sk-nav */

			.sk-search-bar {
				position: fixed;
				z-index: 10;
				inset:
					0    /* T */
					0    /* R */
					auto /* B */
					0;   /* L */
				margin:
					0                    /* T */
					var(--sidebar-width) /* R */
					0                    /* B */
					0;                   /* L */
				padding:
					0     /* Y */
					24px; /* X */
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

			/********************************/
			/* sk-sidebar */

			.sk-sidebar {
				position: fixed;
				z-index: 10;
				inset:
					0     /* T */
					0     /* R */
					0     /* B */
					auto; /* L */
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

			/********************************/
			/* sk-results */

			.sk-results {
				margin:
					var(--search-bar-height) /* T */
					var(--sidebar-width)     /* R */
					0                        /* B */
					0;                       /* L */
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
					0    /* Y */
					4px; /* X */
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
								...(settings.scale.dirty() && {
									"transform": `scale(${settings.scale()})`
								}),
							}}
						></div>
					</div>
					<div class="sk-results-item-typography-container">
						<div class="sk-results-item-typography"></div>
					</div>
				</div>
			</>}</For>
		</div>
	</>
}

function Root() {
	window.addEventListener("keydown", e => {
		if (e.key === "\\") {
			debugCSS.toggle()
		} else if (e.key === "`") {
			darkMode.toggle()
		}
	})

	//// const [done, setDone] = createSignal(false)
	////
	//// window.addEventListener("keydown", e => {
	//// 	if (e.key === "d") {
	//// 		setDone(true)
	//// 	}
	//// })
	////
	//// const [forever] = createResource(done, _done => {
	const [forever] = createResource(() => {
		//// if (_done) { return "ok" }
		return new Promise(r => setTimeout(r, 10_000))
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

			/* This code is specifically implemented to support bottomsheet panning.
			Dragging the bottomsheet interferes with body scrolling on iOS Safari.
			Therefore disable <body> scrolling on and enable <main> scrolling. */
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
			:root:has(:is(.bottomsheet.open, .sidesheet.expanded)) body {
				overflow-y: hidden;
			}

			/* COMPAT/the-new-css-reset */
			:focus-visible { outline: revert; }

			/******************************/

			/* DEBUG */
			:root.debug-css *:not(svg *) {
				outline: 2px solid hsl(0 100% 50% / 10%);
				outline-offset: -1px;
			}

			/******************************/

			:root {
				--search-bar-height: 72px;
				--sidebar-width: 448px;
				--results-item-height: 96px;

				--sheet-backdrop-background-color: var(--card-backdrop-color);
				--sheet-card-background-color: var(--card-color);
				--sheet-card-box-shadow: var(--card-hairline-box-shadow);

				/* --sheet-backdrop-background-color: hsl(0 0% 0% / 25%); */
				/* --sheet-backdrop-transition-duration: 1200ms; */
				/* --sheet-card-background-color: hsl(0 0% 100%); */
				/* --sheet-card-border-radius: 24px 24px 0 0; */
				/* --sheet-card-box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%); */
				/* --sheet-card-hairline-background-color: hsl(0 0% 90%); */
				/* --sheet-drag-indicator-background-color: hsl(0 0% 50%); */
				/* --sheet-drag-indicator-active-background-color: hsl(0 0% 25%); */
				/* --sheet-drag-indicator-size-aspect-ratio: 12; */
				/* --sheet-drag-indicator-size: 4px; */
				/* --sheet-draggable-size: 40px; */
				/* --sheet-transition-duration: 600ms; */
				/* --sheet-transition-timing-function: cubic-bezier(0, 1, 0.25, 1); */
				/* --sheet-z-index: 100; */

				background-color: var(--card-color);
			}

			/******************************/

			.hairline-y { width:  var(--line-thickness); background-color: var(--card-hairline-color); }
			.hairline-x { height: var(--line-thickness); background-color: var(--card-hairline-color); }

			.hairline-y.collapsed { margin-left: calc(-1 * var(--line-thickness)); }
			.hairline-x.collapsed { margin-top:  calc(-1 * var(--line-thickness)); }
		`}
		<LoadingBar />
		<Suspense fallback={Skeleton}>
			{/* <Show when={forever()} fallback={Skeleton}> */}
			<Show when={settings.icons()} fallback={Skeleton}>
				<App />
			</Show>
		</Suspense>
	</>
}

render(
	() => <Root />,
	document.getElementById("root")!,
)
