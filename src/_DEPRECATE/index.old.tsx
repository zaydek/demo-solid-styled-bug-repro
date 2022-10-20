import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

// TODO
import "./css.css"

import { createSignal, For, Suspense, VoidComponent, VoidProps } from "solid-js"
import { Dynamic, render } from "solid-js/web"
import { AriaRadiogroup, Radio, Slider, Smiley } from "./components"
import { useScreenCSSVars } from "./effects"
import { Sheet, Wide } from "./sidebar"
import { IndexedResult, search, settings } from "./state"
import { range } from "./utils"
import { CSSProps } from "./solid-utils"

function NavIcon(props: VoidProps<{ icon: VoidComponent<CSSProps> }>) {
	return <>
		<div class="nav-icon">
			<Dynamic component={props.icon} class="nav-icon-icon" />
		</div>
	</>
}

function GridCell(props: VoidProps<{ info: IndexedResult }>) {
	return <>
		<div class="search-results-grid-cell">
			{/* Use settings.icons()?.[...] because of <Suspense> */}
			{/* @ts-expect-error */}
			<Dynamic component={settings.icons()?.[props.info.title]} class="h-clamp(24px,_50%,_48px) aspect-1 rounded-$full [color]-$fill-100-color" />
			<div class="typography-sans ellipsis [color]-$fill-100-color">
				{props.info.kebab}
			</div>
		</div>
	</>
}

function Entrypoint() {
	useScreenCSSVars()

	const [value1, setValue1] = createSignal(35)
	const [value2, setValue2] = createSignal(35)
	const [value3, setValue3] = createSignal(35)
	const [value4, setValue4] = createSignal(35)
	const [value5, setValue5] = createSignal(35)
	const [value6, setValue6] = createSignal(35)
	const [value7, setValue7] = createSignal(35)
	const [value8, setValue8] = createSignal(35)

	const [rdgValue1, setRdgValue1] = createSignal<"foo" | "bar" | "baz">("foo")
	const [rdgValue2, setRdgValue2] = createSignal<"foo" | "bar" | "baz">("foo")
	const [rdgValue3, setRdgValue3] = createSignal<"foo" | "bar" | "baz">("foo")
	const [rdgValue4, setRdgValue4] = createSignal<"foo" | "bar" | "baz">("foo")

	return <>
		<div class="fixed-search-bar">
			<NavIcon icon={Smiley} />
			<div class="px-8px flex-grow flex-row flex-align-center">
				<div class="h-6px aspect-24 rounded-$full [background-color]-gray"></div>
			</div>
			<NavIcon icon={Smiley} />
		</div>
		<div class="main-content">
			<div class="search-results-grid">
				<Suspense fallback={<>
					<For each={range(96)}>{() => <>
						<div class="search-results-grid-cell">
							<div class="h-clamp(24px,_50%,_48px) aspect-1 rounded-$full [background-color]-$fill-300-color"></div>
							<div class="h-6px aspect-8 rounded-$full [background-color]-$fill-300-color"></div>
						</div>
					</>}</For>
				</>}>
					<For each={search.results()}>{info => <>
						<GridCell info={info} />
					</>}</For>
				</Suspense>
			</div>
		</div>
		<Sheet>
			<Wide>
				<div class="navbar">
					<NavIcon icon={Smiley} />
					<div class="flex-grow"></div>
					<NavIcon icon={Smiley} />
					<NavIcon icon={Smiley} />
				</div>
				<hr />
			</Wide>
			<div class="py-16px flex-col gap-16px">
				<div class="px-16px flex-col gap-8px">
					<Slider value={value1()} setValue={setValue1} min={0} max={100} step={1} />
					<Slider value={value2()} setValue={setValue2} min={0} max={100} step={1} />
					<Slider value={value3()} setValue={setValue3} min={0} max={100} step={1} />
					<Slider value={value4()} setValue={setValue4} min={0} max={100} step={1} />
				</div>
				<hr />
				<AriaRadiogroup class="px-16px flex-col gap-8px" value={rdgValue1()} setValue={setRdgValue1}>
					<Radio value="foo">HELLO</Radio>
					<Radio value="bar">HELLO</Radio>
					<Radio value="baz">HELLO</Radio>
				</AriaRadiogroup>
				<hr />
				<AriaRadiogroup class="px-16px flex-col gap-8px" value={rdgValue2()} setValue={setRdgValue2}>
					<Radio value="foo">HELLO</Radio>
					<Radio value="bar">HELLO</Radio>
					<Radio value="baz">HELLO</Radio>
				</AriaRadiogroup>
				<hr />
				<div class="px-16px flex-col gap-8px">
					<Slider value={value5()} setValue={setValue5} min={0} max={100} step={1} />
					<Slider value={value6()} setValue={setValue6} min={0} max={100} step={1} />
					<Slider value={value7()} setValue={setValue7} min={0} max={100} step={1} />
					<Slider value={value8()} setValue={setValue8} min={0} max={100} step={1} />
				</div>
				<hr />
				<AriaRadiogroup class="px-16px flex-col gap-8px" value={rdgValue3()} setValue={setRdgValue3}>
					<Radio value="foo">HELLO</Radio>
					<Radio value="bar">HELLO</Radio>
					<Radio value="baz">HELLO</Radio>
				</AriaRadiogroup>
				<hr />
				<AriaRadiogroup class="px-16px flex-col gap-8px" value={rdgValue4()} setValue={setRdgValue4}>
					<Radio value="foo">HELLO</Radio>
					<Radio value="bar">HELLO</Radio>
					<Radio value="baz">HELLO</Radio>
				</AriaRadiogroup>
			</div>
		</Sheet>
	</>
}

render(() => <>
	<Entrypoint />
</>, document.getElementById("root")!)
