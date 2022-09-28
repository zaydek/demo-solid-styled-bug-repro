import { createEffect, createSignal, For, onCleanup } from "solid-js"
import { AriaRadiogroup } from "./aria/AriaRadio"
import { Checkbox, GridIcon, Line, NavIcon, Radio, Slider, Smiley, Textarea } from "./components"
import { Collapsible } from "./components/Collapsible"
import { createRef } from "./solid-utils"
import { range } from "./utils/range"

function Sidebar() {
	const [rdgValue1, setRdgValue1] = createSignal("foo")
	const [rdgValue2, setRdgValue2] = createSignal("foo")

	const [sliderValue1, setSliderValue1] = createSignal(25)
	const [sliderValue2, setSliderValue2] = createSignal(25)
	const [sliderValue3, setSliderValue3] = createSignal(25)

	return <>
		<div class="flex-shrink:0">
			<section class="px-$padding-x h-$search-bar-height flex-row flex-align-center">
				<NavIcon icon={Smiley} />
				<div class="flex-grow"></div>
				<NavIcon icon={Smiley} />
				<NavIcon icon={Smiley} />
			</section>
			<hr />
		</div>
		{/* Use tabindex="-1" to disable scroller focus-ring */}
		<div class="flex-grow overflow-y:auto" tabindex="-1">
			<Collapsible title="foo" subtitle="bar" open>
				<AriaRadiogroup class="flex-col gap-$gap" value={rdgValue1()} setValue={setRdgValue1}>
					<Radio value="foo" />
					<Radio value="bar" />
				</AriaRadiogroup>
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open>
				<AriaRadiogroup class="flex-col gap-$gap" value={rdgValue2()} setValue={setRdgValue2}>
					<Radio value="foo" />
					<Radio value="bar" />
				</AriaRadiogroup>
				<div></div>
				<div class="relative">
					<Textarea />
					<div class="absolute inset-b-$gap grid grid-cols-3 gap-$gap">
						<div></div>
						<Checkbox />
						<Checkbox />
					</div>
				</div>
				<div></div>
				<div class="grid grid-cols-1 gap-$gap">
					<Checkbox active />
				</div>
				<div class="grid grid-cols-3 gap-$gap">
					<Checkbox active />
					<Checkbox active />
					<Checkbox />
				</div>
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open>
				<Slider value={sliderValue1()} setValue={setSliderValue1} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open>
				<Slider value={sliderValue2()} setValue={setSliderValue2} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
			<Collapsible title="foo" subtitle="bar" open>
				<Slider value={sliderValue3()} setValue={setSliderValue3} min={0} max={100} step={1} />
			</Collapsible>
			<hr />
		</div>
		<div class="flex-shrink:0">
			<hr class="collapsible" />
			<section class="p-$padding flex-row gap-$gap">
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

function Main() {
	return <>
		<style jsx>{`
			.grid {
				/* Query CSS variables */
				--height: var(--search-results-grid-height);
				--border-radius: var(--search-results-grid-border-radius);

				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(var(--height), 1fr));
				grid-auto-rows: var(--height);
			}
		`}</style>
		<StickySearchBar />
		<div class="grid p-$padding pb-($padding-y*2)">
			<For each={range(400)}>
				{() => <>
					<GridIcon />
				</>}
			</For>
		</div>
	</>
}

function StickySearchBar() {
	return <>
		<style jsx>{`
			.sticky-search-bar {
				position: sticky;
				z-index: 10;
				top: 0;
				padding: 0 var(--padding-x);
				height: var(--search-bar-height);
				background-color: var(--card-color);
				box-shadow: var(--hairline-box-shadow);
			}
		`}</style>
		<div class="sticky-search-bar flex-row flex-align-center">
			<NavIcon icon={Smiley} />
			<div class="flex-grow">
				<div class="px-$padding-x h-$search-bar-height flex-row flex-align-center">
					<Line w="15%" />
				</div>
			</div>
			<NavIcon icon={Smiley} />
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
		<style jsx>{`
			/* TODO: This only works / has been tested on desktop */
			:global(body:has([data-state-sidebar=expanded])) {
				overflow: hidden;
			}

			/********************************/

			.column-1 {
				margin-right: var(--sidebar-width);
				min-height: 100vh;

				/* transition */
				transition: calc(250ms * var(--motion-safe)) ease;
				transition-property: margin-right;
			}
			[data-state-sidebar=collapsed] .column-1 {
				margin-right: 0;
			}
			[data-state-sidebar=expanded] .column-1 {
				-webkit-user-select: none; /* Disable selection */
				user-select: none;
			}

			/********************************/

			.column-2 {
				position: fixed;
				z-index: 10;
				inset: 0 0 0 auto; /* E.g. inset-r */
				width: var(--sidebar-width);
				background-color: var(--card-color);
				box-shadow: var(--hairline-box-shadow);

				/* transition */
				transition: calc(250ms * var(--motion-safe)) ease;
				transition-property: width, transform;
			}
			[data-state-sidebar=collapsed] .column-2 {
				transform: translateX(var(--sidebar-width));
			}
			[data-state-sidebar=expanded] .column-2 {
				width: clamp(0px, var(--expanded-sidebar-width), 100vw);
				box-shadow: var(--card-box-shadow);
			}

			/********************************/

			.column-2-backdrop {
				position: fixed;
				z-index: 10;
				inset: 0;
				background-color: transparent;
				pointer-events: none; /* Passthrough */

				/* transition */
				/* NOTE: background-color, backdrop-filter values don’t change
				meaningfully between light and dark modes */
				transition: calc(250ms * var(--motion-safe)) ease;
				transition-property: background-color, backdrop-filter;
			}
			[data-state-sidebar=expanded] .column-2-backdrop {
				background-color: var(--backdrop-color);
				backdrop-filter: blur(2px);
				pointer-events: revert; /* Enable */
			}
		`}</style>
		<div class="contents" data-state-sidebar={sidebar()}>
			<div class="column-1">
				<Main />
			</div>
			<div class="column-2-backdrop" onClick={toggle}></div>
			<div ref={setRef} class="column-2 flex-col">
				<Sidebar />
			</div>
		</div>
	</>
}
