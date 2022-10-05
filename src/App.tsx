import "./columns.scss"

import { Accessor, createSignal, For, JSX, onMount, Setter, Show, Suspense } from "solid-js"
import { AriaRadiogroup } from "./aria"
import { Collapsible, ColorButton, GridIcon, NavIcon, Radio, Slider, Smiley, Textarea } from "./components"
import { FigmaSVG, GitHubSVG, TwitterSVG } from "./components/Brands"
import { css, cx } from "./solid-utils"
import { search, settings, VariantV1, VariantV2, Version } from "./state"
import { range } from "./utils"

function Sidebar() {
	const [open1, setOpen1] = createSignal(false)
	const [open2, setOpen2] = createSignal(false)
	const [open3, setOpen3] = createSignal(false)
	const [open4, setOpen4] = createSignal(false)
	const [open5, setOpen5] = createSignal(false)
	const [open6, setOpen6] = createSignal(false)

	//////////////////////////////////////

	const [rdgValue1, setRdgValue1] = createSignal("foo")
	const [rdgValue2, setRdgValue2] = createSignal("foo")

	//////////////////////////////////////

	const [checked1, setChecked1] = createSignal(true)
	const [checked2, setChecked2] = createSignal(true)
	const [checked3, setChecked3] = createSignal(true)
	const [rdgValue3, setRdgValue3] = createSignal("foo")

	//////////////////////////////////////

	const [sliderValue1, setSliderValue1] = createSignal(25)
	const [sliderValue2, setSliderValue2] = createSignal(25)
	const [sliderValue3, setSliderValue3] = createSignal(25)

	onMount(() => {
		setTimeout(() => {
			//// setOpen1(true)
			setOpen2(true)
			setOpen3(true)
		}, 0)
	})

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
			<Collapsible title="COPY TO CLIPBOARD AS" subtitle="BAR" open={true} setOpen={() => {}}>
				<AriaRadiogroup class="flex-col gap-$gap" value={rdgValue2()} setValue={setRdgValue2}>
					<Radio value="foo" />
					<Radio value="bar" />
				</AriaRadiogroup>
				<div></div>
				<div class="relative">
					<Textarea />
					<div class="absolute inset-b-$gap grid grid-cols-3 gap-$gap">
						<div></div>
						<ColorButton checked={checked1()} setChecked={setChecked1}>SAVE</ColorButton>
						<ColorButton checked={checked2()} setChecked={setChecked2}>COPY</ColorButton>
					</div>
				</div>
				<div></div>
				<div class="grid grid-cols-1 gap-$gap">
					<ColorButton checked={checked3()} setChecked={setChecked3}>
						INCLUDE MIT LICENSE
					</ColorButton>
				</div>
				<AriaRadiogroup class="grid grid-cols-3 gap-$gap" value={rdgValue3()} setValue={setRdgValue3}>
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
			<Collapsible title="GRID DENSITY" subtitle="BAR" open={open4()} setOpen={setOpen4}>
				<Slider value={sliderValue1()} setValue={setSliderValue1} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="PREVIEW SIZE" subtitle="BAR" open={open5()} setOpen={setOpen5}>
				<Slider value={sliderValue2()} setValue={setSliderValue2} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="PREVIEW STROKE WIDTH" subtitle="BAR" open={open6()} setOpen={setOpen6}>
				<Slider value={sliderValue3()} setValue={setSliderValue3} min={0} max={100} step={1} />
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
