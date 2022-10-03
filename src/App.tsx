import { createEffect, createSignal, For, onCleanup, onMount } from "solid-js"
import { AriaRadiogroup } from "./aria"
import { ColorButton, GridIcon, Line, NavIcon, Radio, Slider, Smiley, Textarea } from "./components"
import { Collapsible } from "./components/Collapsible"
import { createRef, css } from "./solid-utils"
import { range } from "./utils/range"

function Sidebar() {
	const [open1, setOpen1] = createSignal(false)
	const [open2, setOpen2] = createSignal(false)
	const [open3, setOpen3] = createSignal(false)
	const [open4, setOpen4] = createSignal(false)
	const [open5, setOpen5] = createSignal(false)

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
			setOpen1(true)
			setOpen2(true)
			setOpen3(true)
		}, 0)
	})

	return <>
		<div class="flex-shrink:0">
			<nav class="px-$padding-x h-$search-bar-height flex-row flex-align-center">
				<NavIcon icon={Smiley} />
				<div class="flex-grow"></div>
				<NavIcon icon={Smiley} />
				<NavIcon icon={Smiley} />
			</nav>
			<hr />
		</div>
		{/* Use tabindex="-1" to disable :focus for overflow-y */}
		<div class="flex-grow overflow-y:auto" tabindex="-1">
			<Collapsible title="foo" subtitle="bar" open={open1()} setOpen={setOpen1}>
				<AriaRadiogroup class="flex-col gap-$gap" value={rdgValue1()} setValue={setRdgValue1}>
					<Radio value="foo" />
					<Radio value="bar" />
				</AriaRadiogroup>
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open={open2()} setOpen={setOpen2}>
				<AriaRadiogroup class="flex-col gap-$gap" value={rdgValue2()} setValue={setRdgValue2}>
					<Radio value="foo" />
					<Radio value="bar" />
				</AriaRadiogroup>
				<div></div>
				<div class="relative">
					<Textarea />
					<div class="absolute inset-b-$gap grid grid-cols-3 gap-$gap">
						<div></div>
						<ColorButton checked={checked1()} setChecked={setChecked1} />
						<ColorButton checked={checked2()} setChecked={setChecked2} />
					</div>
				</div>
				<div></div>
				<div class="grid grid-cols-1 gap-$gap">
					<ColorButton checked={checked3()} setChecked={setChecked3} />
				</div>
				<AriaRadiogroup class="grid grid-cols-3 gap-$gap" value={rdgValue3()} setValue={setRdgValue3}>
					<ColorButton value="foo" style={{ "--color": "var(--svg-color)" }} />
					<ColorButton value="bar" style={{ "--color": "var(--react-color)" }} />
					<ColorButton value="baz" style={{ "--color": "var(--vue-color)" }} />
				</AriaRadiogroup>
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open={open3()} setOpen={setOpen3}>
				<Slider value={sliderValue1()} setValue={setSliderValue1} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open={open4()} setOpen={setOpen4}>
				<Slider value={sliderValue2()} setValue={setSliderValue2} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open={open5()} setOpen={setOpen5}>
				<Slider value={sliderValue3()} setValue={setSliderValue3} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
		</div>
		<div class="flex-shrink:0">
			<hr class="collapsible" />
			<section class="p-$padding flex-row gap-($gap*2)">
				<div class="h-80px aspect-16/9 rounded-$gap background-color:$fill-200-color"></div>
				<div class="flex-grow flex-col gap-($gap/2)">
					<Line w="70%" color="var(--fill-200-color)" />
					<Line w="90%" color="var(--fill-200-color)" />
					<Line w="80%" color="var(--fill-200-color)" />
					<Line w="60%" color="var(--fill-200-color)" />
				</div>
			</section>
			<hr />
			<section class="p-$padding flex-col gap-($gap/2)">
				<Line w="calc(70%/1.25)" color="var(--fill-200-color)" />
				<Line w="calc(90%/1.25)" color="var(--fill-200-color)" />
				<Line w="calc(80%/1.25)" color="var(--fill-200-color)" />
				<Line w="calc(60%/1.25)" color="var(--fill-200-color)" />
			</section>
		</div>
	</>
}

////////////////////////////////////////

function SearchBar() {
	return <>
		{css`
			.component-search-bar {
				padding: 0 var(--padding-x);
				height: var(--search-bar-height);
				background-color: var(--card-color);
				box-shadow: var(--hairline-box-shadow);
			}

			//////////////////////////////////

			.component-search-bar-field {
				// Typography
				font: 400 17px / normal var(--sans);
				letter-spacing: calc(1em / 64);
				color: var(--text-color);
			}
		`}
		<nav class="component-search-bar flex-row flex-align-center">
			<NavIcon icon={Smiley} />
			{/* <div class="flex-grow">
				<div class="px-$padding-x h-$search-bar-height flex-row flex-align-center">
					<Line w="15%" />
				</div>
			</div> */}
			<input class="component-search-bar-field" type="text" value="hello, world!" />
			<NavIcon icon={Smiley} />
		</nav>
	</>
}

function Main() {
	return <>
		<div class="sticky inset-t">
			<SearchBar />
		</div>
		{css`
			.component-search-results {
				padding: var(--padding);
				padding-bottom: calc(var(--padding-y) * 2); // Override padding
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--search-results-grid-height), 1fr));
				grid-auto-rows: var(--search-results-grid-height);
			}
		`}
		<div class="component-search-results">
			<For each={range(400)}>
				{() => <>
					<GridIcon />
				</>}
			</For>
		</div>
	</>
}

////////////////////////////////////////

export function App() {
	const [ref, setRef] = createRef()
	const [sidebar, setSidebar] = createSignal<"open" | "collapsed" | "expanded">("open")

	function toggle() {
		if (sidebar() === "open") {
			setSidebar("expanded")
		} else if (sidebar() === "expanded") {
			setSidebar("open")
		}
	}

	//// // Cycles sidebar states forwards
	//// function cycleForwards() {
	//// 	if (sidebar() === "open") {
	//// 		setSidebar("expanded")
	//// 	} else if (sidebar() === "expanded") {
	//// 		setSidebar("collapsed")
	//// 	} else if (sidebar() === "collapsed") {
	//// 		setSidebar("open")
	//// 	}
	//// }
	////
	//// // Cycles sidebar states backwards
	//// function cycleBackwards() {
	//// 	if (sidebar() === "open") {
	//// 		setSidebar("collapsed")
	//// 	} else if (sidebar() === "collapsed") {
	//// 		setSidebar("expanded")
	//// 	} else if (sidebar() === "expanded") {
	//// 		setSidebar("open")
	//// 	}
	//// }
	////
	//// document.addEventListener("keydown", e => {
	//// 	if (e.key === "d") {
	//// 		cycleForwards()
	//// 	} else if (e.key === "D") {
	//// 		cycleBackwards()
	//// 	}
	//// }, false)

	document.addEventListener("keydown", e => {
		if (e.key === "d") {
			toggle()
		}
	}, false)

	//////////////////////////////////////

	const [theme, setTheme] = createSignal<"light" | "dark">(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

	document.addEventListener("keydown", e => {
		if (e.key === "`") {
			setTheme(curr => curr === "light" ? "dark" : "light")
		}
	}, false)

	createEffect(() => {
		const root = document.documentElement
		root.setAttribute("data-theme", theme())
	})

	//////////////////////////////////////

	let timeoutId = 0
	createEffect(() => {
		clearTimeout(timeoutId)
		onCleanup(() => window.clearTimeout(timeoutId))
		if (sidebar() === "expanded") {
			timeoutId = window.setTimeout(() => {
				ref()!.style.transitionDuration = "revert"
			}, 400)
		} else {
			ref()!.style.transitionDuration = ""
			if (!ref()!.style.length) {
				ref()!.removeAttribute("style")
			}
		}
	})

	return <>
		{/* TODO: Add inert somewhere */}
		{css`
			// TODO: Only tested for desktop
			body:has([data-state-sidebar=expanded]) {
				overflow: hidden;
			}

			/********************************/

			.component-column-1 {
				margin-right: var(--sidebar-width);
				min-height: 100vh;
				// TRANSITION
				transition: calc(250ms * var(--motion-safe)) ease;
				transition-property: margin-right;
			}
			[data-state-sidebar=collapsed] .component-column-1 {
				margin-right: 0;
			}
			[data-state-sidebar=expanded] .component-column-1 {
				-webkit-user-select: none; // COMPAT/Safari
				user-select: none;         // Disable
			}

			/********************************/

			.component-column-2 {
				position: fixed;
				z-index: 10;
				inset: 0 0 0 auto; // E.g. inset-r
				width: var(--sidebar-width);
				background-color: var(--card-color);
				box-shadow: var(--hairline-box-shadow);
				// TRANSITION
				transition: calc(250ms * var(--motion-safe)) ease;
				transition-property: width, transform;
			}
			[data-state-sidebar=collapsed] .component-column-2 {
				transform: translateX(var(--sidebar-width));
			}
			[data-state-sidebar=expanded] .component-column-2 {
				width: clamp(0px, var(--expanded-sidebar-width), 100vw);
				box-shadow: var(--card-box-shadow);
			}

			/********************************/

			.component-column-2-backdrop {
				position: fixed;
				z-index: 10;
				inset: 0;
				background-color: transparent;
				pointer-events: none; // Disable
				// TRANSITION
				// NOTE: background-color, backdrop-filter values don’t change
				// meaningfully between light and dark modes
				transition: calc(250ms * var(--motion-safe)) ease;
				transition-property: background-color, backdrop-filter;
			}
			[data-state-sidebar=expanded] .component-column-2-backdrop {
				background-color: var(--backdrop-color);
				backdrop-filter: blur(2px);
				pointer-events: revert; // Enable
			}
		`}
		<div class="contents" data-state-sidebar={sidebar()}>
			<div class="component-column-1">
				<Main />
			</div>
			<div class="component-column-2-backdrop" onClick={toggle}></div>
			<div ref={setRef} class="component-column-2 flex-col">
				<Sidebar />
			</div>
		</div>
	</>
}
