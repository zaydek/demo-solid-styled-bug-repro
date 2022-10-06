import "./columns.scss"

import { createSignal, For, JSX, Show, Suspense } from "solid-js"
import { AriaRadiogroup } from "./aria"
import { Collapsible, ColorButton, GridIcon, NavIcon, Radio, Slider, Smiley, Textarea } from "./components"
import { FigmaSVG, GitHubSVG, TwitterSVG } from "./components/Brands"
import { css, cx } from "./solid-utils"
import { search, settings, VariantV1, VariantV2, Version } from "./state"
import { range } from "./utils"

function Sidebar() {
	const [rdgValue2, setRdgValue2] = createSignal("foo")

	const [checked1, setChecked1] = createSignal(true)
	const [checked2, setChecked2] = createSignal(true)
	const [checked3, setChecked3] = createSignal(true)
	const [rdgValue3, setRdgValue3] = createSignal("foo")

	return <>
		<div class="flex-shrink:0">
			<nav class="px-$padding h-$search-bar-height flex-row flex-align-center">
				<NavIcon icon={props => <TwitterSVG {...props} style={{ "color": "var(--twitter-color)" }} />} />
				<div class="flex-grow"></div>
				<NavIcon icon={FigmaSVG} />
				<NavIcon icon={props => <GitHubSVG {...props} style={{ "color": "var(--fill-100-color)" }} />} />
			</nav>
			<hr />
		</div>
		<div class="flex-grow overflow-y:auto" tabindex="-1">
			<Collapsible title="VERSION" subtitle={settings.version().toUpperCase()} open={settings.versionOpen()} setOpen={settings.setVersionOpen}>
				<AriaRadiogroup class="flex-col gap-$gap" value={settings.version()} setValue={settings.setVersion}>
					{/* TODO: Add descriptions */}
					<For<Version, JSX.Element> each={["v1", "v2"]}>{value => <>
						<Radio value={value}>
							{value.toUpperCase()}
						</Radio>
					</>}</For>
				</AriaRadiogroup>
			</Collapsible>
			<hr />
			<Show when={settings.version() === "v2"} fallback={<>
				<Collapsible title="ICON VARIANT" subtitle={settings.variant().toUpperCase()} open={settings.variantOpen()} setOpen={settings.setVariantOpen}>
					<AriaRadiogroup class="flex-col gap-$gap" value={settings.variant()} setValue={settings.setVariantV1}>
						{/* TODO: Add descriptions */}
						<For<VariantV1, JSX.Element> each={["solid", "outline"]}>{value => <>
							<Radio value={value}>
								{value.toUpperCase()}
							</Radio>
						</>}</For>
					</AriaRadiogroup>
				</Collapsible>
			</>}>
				<Collapsible title="ICON VARIANT" subtitle={settings.variant().split("/").join(" / ").toUpperCase()} open={settings.variantOpen()} setOpen={settings.setVariantOpen}>
					<AriaRadiogroup class="flex-col gap-$gap" value={settings.variant()} setValue={settings.setVariantV2}>
						{/* TODO: Add descriptions */}
						<For<VariantV2, JSX.Element> each={["20/solid", "24/solid", "24/outline"]}>{value => <>
							<Radio value={value}>
								{value.split("/").join(" / ").toUpperCase()}
							</Radio>
						</>}</For>
					</AriaRadiogroup>
				</Collapsible>
			</Show>
			<hr />
			<Collapsible title="COPY TO CLIPBOARD AS" subtitle="BAR" open={settings.clipboardOpen()} setOpen={settings.setClipboardOpen}>
				<AriaRadiogroup class="flex-col gap-$gap" value={rdgValue2()} setValue={setRdgValue2}>
					<Radio value="foo" />
					<Radio value="bar" />
				</AriaRadiogroup>
				<div></div>
				<div class="relative">
					<Textarea value={settings.textarea()} setValue={settings.setTextarea} />
					<div class="absolute inset-b-$gap grid grid-cols-3 gap-$gap">
						<div></div>
						<ColorButton checked={checked1()} setChecked={setChecked1}>SAVE</ColorButton>
						<ColorButton checked={checked2()} setChecked={setChecked2}>COPY</ColorButton>
					</div>
				</div>
				<div></div>
				<div class="grid grid-cols-1 gap-$gap">
					<ColorButton checked={settings.license()} setChecked={settings.setLicense}>
						INCLUDE MIT LICENSE
					</ColorButton>
				</div>
				<AriaRadiogroup class="grid grid-cols-3 gap-$gap" value={settings.framework()} setValue={settings.setFramework}>
					<For each={[
						{ color: "var(--svg-color)",   value: "svg",   children: "SVG"   },
						{ color: "var(--react-color)", value: "react", children: "REACT" },
						{ color: "var(--vue-color)",   value: "vue",   children: "VUE"   },
					]}>{({ color, value, children }) => <>
							<ColorButton value={value} style={{ "--color": color }}>
								{children}
							</ColorButton>
					</>}</For>
				</AriaRadiogroup>
			</Collapsible>
			<hr />
			<Collapsible title="GRID DENSITY" subtitle={"" + settings.density()}open={settings.densityOpen()} setOpen={settings.setDensityOpen}>
				<Slider value={settings.density()} setValue={settings.setDensity} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="PREVIEW SIZE" subtitle={"" + settings.size()} open={settings.sizeOpen()} setOpen={settings.setSizeOpen}>
				<Slider value={settings.size()} setValue={settings.setSize} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="PREVIEW STROKE WIDTH" subtitle={"" + settings.stroke()} open={settings.strokeOpen()} setOpen={settings.setStrokeOpen}>
				<Slider value={settings.stroke()} setValue={settings.setStroke} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
		</div>
		<div class="flex-shrink:0">
			<hr class="collapse" />
			<section class="p-$padding flex-row gap-calc($gap*2)">
				<div class="h-80px aspect-16/9 rounded-$gap background-color:$fill-100-color"></div>
				<div class="flex-grow flex-col gap-calc($gap/2)">
					<div class="h-6px w-70% rounded-$full background-color:$fill-100-color"></div>
					<div class="h-6px w-90% rounded-$full background-color:$fill-100-color"></div>
					<div class="h-6px w-80% rounded-$full background-color:$fill-100-color"></div>
					<div class="h-6px w-60% rounded-$full background-color:$fill-100-color"></div>
				</div>
			</section>
			<hr />
			<section class="p-$padding flex-col gap-calc($gap/2)">
				<div class="h-6px w-calc(70%/1.5) rounded-$full background-color:$fill-100-color"></div>
				<div class="h-6px w-calc(90%/1.5) rounded-$full background-color:$fill-100-color"></div>
				<div class="h-6px w-calc(80%/1.5) rounded-$full background-color:$fill-100-color"></div>
				<div class="h-6px w-calc(60%/1.5) rounded-$full background-color:$fill-100-color"></div>
			</section>
		</div>
	</>
}

////////////////////////////////////////

function StickySearchBar() {
	return <>
		<nav class="sticky-search-bar flex-row flex-align-center">
			<NavIcon icon={Smiley} active={!!search.canonicalValue() || undefined} />
			<input class="search-bar typography-search-bar" type="text" placeholder="I’m searching for…" value={search.value()} onInput={e => search.setValue(e.currentTarget.value)} autofocus />
			<NavIcon icon={Smiley} />
		</nav>
	</>
}

function Main() {
	return <>
		{css`
			.sticky-search-bar {
				position: sticky;
				z-index: 10;
				top: 0;
				padding: 0 var(--padding);
				height: var(--search-bar-height);
				background-color: var(--card-color);
				box-shadow: var(--card-hairline-box-shadow);
			}

			//////////////////////////////////

			input[type=text].search-bar { width: 100%; }
			input[type=text].search-bar {
				padding: 0 12px;
				height: var(--search-bar-height);
			}

			//////////////////////////////////

			.main-grid {
				padding: var(--padding);
				padding-bottom: calc(var(--padding) * 2); // Override padding
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--main-grid-height), 1fr));
				grid-auto-rows: var(--main-grid-height);
			}
		`}
		<StickySearchBar />
		<Suspense fallback={<>
			<div class="main-grid">
				<For each={range(64)}>{() => <>
					<div class="grid-icon grid grid-center">
						<div class="h-28px aspect-1 rounded-$full background-color:$card-hairline-color"></div>
						<div class="h-6px  aspect-8 rounded-$full background-color:$card-hairline-color"></div>
					</div>
				</>}</For>
			</div>
		</>}>
			{/* Loaded */}
			<div class="main-grid">
				<For each={search.results()}>{info => <>
					<GridIcon info={info} />
				</>}</For>
			</div>
		</Suspense>
	</>
}

////////////////////////////////////////

export function App() {
	const [sidebar, setSidebar] = createSignal<"open" | "collapsed">("open")

	//// function toggle() {
	//// 	setSidebar(curr => curr === "open" ? "collapsed" : "open")
	//// }

	return <>
		<div class={cx(`column-1 is-sidebar-${sidebar()}`)}>
			<Main />
		</div>
		{/* @ts-expect-error */}
		<div class={cx(`column-2 is-sidebar-${sidebar()} flex-col`)} inert={sidebar() === "collapsed" || undefined}>
			<Sidebar />
		</div>
	</>
}
