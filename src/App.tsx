import { createEffect, createSignal, For, onCleanup } from "solid-js"
import { Checkbox, GridIcon, Icon, Line, NavIcon, Radio, Slider, Smiley, Textarea } from "./components"
import { range } from "./utils/range"

// TODO: Extract <CollapsibleSection>?
function SectionToggle() {
	return <>
		<div class="px-($reduced-form-height/2) h-$reduced-form-height flex-row flex-align-center gap-$gap focus-ring focus-ring-$full" tabindex="0">
			<Icon icon={Smiley} h="16px" />
			<Line w="25%" />
			<div class="flex-grow"></div>
			<Line w="10%" color="var(--fill-200-color)" />
		</div>
	</>
}

function Sidebar() {
	const [ref1, setRef1] = createSignal<HTMLElement>()
	const [ref2, setRef2] = createSignal<HTMLElement>()

	const height = (): undefined | `${string}px` => {
		if (!(ref1() && ref2())) { return }
		return `${ref1()!.offsetHeight + ref2()!.offsetHeight}px`
	}

	return <>
		<div ref={setRef1} class="flex-shrink:0">
			<section class="px-$px h-$search-bar-height flex-row flex-align-center">
				<NavIcon icon={Smiley} />
				<div class="flex-grow"></div>
				<NavIcon icon={Smiley} />
				<NavIcon icon={Smiley} />
			</section>
			<hr />
		</div>
		<div class="flex-grow flex-col focus-ring-scroller focus-ring-14px" style={{ "height": height() }}>
			<div class="flex-grow overflow-y:auto">
				<section class="p-$p flex-col gap-$gap">
					<SectionToggle />
					<For each={range(2)}>
						{() => <>
							<Radio />
						</>}
					</For>
				</section>
				<hr />
				<section class="p-$p flex-col gap-$gap">
					<SectionToggle />
					<For each={range(2)}>
						{() => <>
							<Radio />
						</>}
					</For>
					<div class="relative">
						<Textarea />
						<div class="absolute inset-b-$gap grid grid-cols-3 gap-$gap">
							<div></div>
							<For each={range(2)}>
								{() => <>
									<Checkbox />
								</>}
							</For>
						</div>
					</div>
					<Checkbox />
					<div class="grid grid-cols-3 gap-$gap">
						<For each={range(3)}>
							{() => <>
								<Checkbox />
							</>}
						</For>
					</div>
				</section>
				<hr />
				<section class="p-$p flex-col gap-$gap">
					<SectionToggle />
					<Slider />
				</section>
				<hr />
				<section class="p-$p flex-col gap-$gap">
					<SectionToggle />
					<Slider />
				</section>
				<hr />
				<section class="p-$p flex-col gap-$gap">
					<SectionToggle />
					<Slider />
				</section>
				<hr />
			</div>
		</div>
		<div ref={setRef2} class="flex-shrink:0">
			<hr />
			<section class="p-$p flex-row gap-$gap">
				<div class="h-80px aspect-16/9 rounded-$gap background-color:$fill-200-color"></div>
				<div class="flex-grow flex-col gap-($gap/2)">
					<Line w="70%" color="var(--fill-200-color)" />
					<Line w="90%" color="var(--fill-200-color)" />
					<Line w="80%" color="var(--fill-200-color)" />
					<Line w="60%" color="var(--fill-200-color)" />
				</div>
			</section>
			<hr />
			<section class="p-$p flex-col gap-($gap/2)">
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
		<div class="grid p-$p pb-($py*2)">
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
				padding: 0 var(--px);
				height: var(--search-bar-height);
				background-color: var(--base-color);
				box-shadow: var(--hairline-box-shadow);
			}
		`}</style>
		<div class="sticky-search-bar flex-row flex-align-center">
			<NavIcon icon={Smiley} />
			{/* TODO */}
			<div class="flex-grow">
				<div class="px-$px h-$search-bar-height flex-row flex-align-center">
					<Line w="15%" />
				</div>
			</div>
			<NavIcon icon={Smiley} />
		</div>
	</>
}

////////////////////////////////////////

export function App() {
	const [ref, setRef] = createSignal<HTMLElement>()
	const [sidebar, setSidebar] = createSignal<"open" | "collapsed" | "expanded">("open")

	// Cycles sidebar states forwards
	function cycleForwards() {
		if (sidebar() === "open") {
			setSidebar("expanded")
		} else if (sidebar() === "expanded") {
			//// setSidebar("collapsed")
			setSidebar("open") // DEBUG
		} else if (sidebar() === "collapsed") {
			setSidebar("open")
		}
	}

	// Cycles sidebar states backwards
	function cycleBackwards() {
		if (sidebar() === "open") {
			setSidebar("collapsed")
		} else if (sidebar() === "collapsed") {
			setSidebar("expanded")
		} else if (sidebar() === "expanded") {
			setSidebar("open")
		}
	}

	document.addEventListener("keydown", e => {
		if (e.key === "d") {
			cycleForwards()
		} else if (e.key === "D") {
			cycleBackwards()
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
		onCleanup(() => clearTimeout(timeoutId))
		if (sidebar() === "expanded") {
			timeoutId = setTimeout(() => {
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

				/* TRANSITION */
				transition: var(--duration-300) ease;
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
				background-color: var(--base-color);
				box-shadow: var(--hairline-box-shadow);

				/* TRANSITION */
				transition: var(--duration-300) ease;
				transition-property: width, box-shadow, transform;
			}
			[data-state-sidebar=collapsed] .column-2 {
				transform: translateX(var(--sidebar-width));
			}
			[data-state-sidebar=expanded] .column-2 {
				width: clamp(0px, var(--expanded-sidebar-width), 100vw);
				box-shadow: var(--box-shadow);
			}

			/********************************/

			.column-2-backdrop {
				position: fixed;
				z-index: 10;
				inset: 0;
				background-color: transparent;
				pointer-events: none; /* Passthrough */

				/* TRANSITION */
				transition: var(--duration-300) ease;
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
			<div class="column-2-backdrop" onClick={cycleForwards}></div>
			<div ref={setRef} class="column-2 flex-col">
				<Sidebar />
			</div>
		</div>
	</>
}
