import { createEffect, createSignal, For, onCleanup, ParentProps, VoidComponent, VoidProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { Smiley } from "./components/Smiley"
import { Icon, Iconless, Line } from "./primitives"
import { CSSProps } from "./solid-utils/extra-types"
import { cx } from "./utils/cx"
import { range } from "./utils/range"

function NavIcon(props: VoidProps<{ icon: VoidComponent<CSSProps> }>) {
	return <>
		<style jsx>{`
			/* Preamble */
			.nav-icon-wrapper { position: relative; }
			.nav-icon-wrapper::before { content: ""; }

			/********************************/

			.nav-icon-wrapper {
				height: 48px;
				aspect-ratio: 1;
				border-radius: var(--full);
			}
			.nav-icon-wrapper::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);

				/* TRANSITION */
				transition: 150ms cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.nav-icon-wrapper:hover::before {
				background-color: var(--faded-base-color);
				transform: scale(1);
			}
			.nav-icon-wrapper:hover:active::before {
				background-color: var(--theme-color);
				transform: scale(1);
			}

			/********************************/

			svg.nav-icon {
				height: 32px;
				aspect-ratio: 1;
				color: var(--text-100-color);
			}
			.nav-icon-wrapper:hover:active .nav-icon {
				color: white;
			}
		`}</style>
		<div class="nav-icon-wrapper group grid grid-center focus-ring focus-ring-full" tabindex="0">
			<Dynamic component={props.icon} class="nav-icon" use:solid-styled />
		</div>
	</>
}

////////////////////////////////////////

function SectionToggle() {
	return <>
		<div class="px-($reduced-form-height/2) h-$reduced-form-height flex-row flex-align-center gap-$gap focus-ring focus-ring-full" tabindex="0">
			<Icon icon={Smiley} h="16px" />
			<Line w="25%" />
			<div class="flex-grow"></div>
			<Line w="10%" color="var(--text-200-color)" />
		</div>
	</>
}

function Radiobar() {
	return <>
		<div class="flex-row gap-$gap focus-ring focus-ring-full" tabindex="0">
			<div class="flex-grow">
				<div class="px-($reduced-form-height/2) h-$reduced-form-height rounded-$full background-color:$faded-base-color flex-row flex-align-center gap-$gap">
					<Icon icon={Smiley} h="16px" />
					<Line w="40%" />
				</div>
			</div>
			<div class="h-$reduced-form-height aspect-1 rounded-$full background-color:$form-color box-shadow:$inset-box-shadow grid grid-center">
				<Iconless h="8px" />
			</div>
		</div>
	</>
}

function Textarea() {
	return <>
		<style jsx>{`
			.textarea {
				--height: var(--form-height);

				padding: calc(var(--height) / 2);
				height: 144px;
				border-radius: calc(var(--height) / 2);
				background-color: var(--base-color);
				box-shadow: var(--inset-box-shadow);
			}
		`}</style>
		<div class="textarea flex-col gap-6 focus-ring focus-ring-16" tabindex="0">
			<Line w="70%" color="var(--text-200-color)" />
			<Line w="90%" color="var(--text-200-color)" />
			<Line w="80%" color="var(--text-200-color)" />
			<Line w="60%" color="var(--text-200-color)" />
		</div>
	</>
}

function CheckboxButton() {
	return <>
		<style jsx>{`
			.checkbox-button {
				--height: var(--form-height);

				padding: 0 calc(var(--height) / 2);
				height: var(--height);
				border-radius: var(--full);
				background-color: var(--base-color);
				box-shadow: var(--inset-box-shadow);
			}
		`}</style>
		<div class="checkbox-button flex-row flex-center gap-$gap focus-ring focus-ring-full" tabindex="0">
			<Icon icon={Smiley} h="16px" />
			<Line w="35%" />
			<Icon icon={Smiley} h="16px" />
		</div>
	</>
}

function Slider() {
	return <>
		{/* Use px-($reduced-form-height/2) because of <SectionToggle> */}
		<div class="px-($reduced-form-height/2) h-$form-height flex-col flex-justify-center focus-ring focus-ring-full" tabindex="0">
			<div class="h-6 rounded-$full background-color:$theme-color flex-row flex-center">
				{/* TODO: Change box-shadow */}
				<div class="h-$form-height aspect-1 rounded-$full background-color:$form-color box-shadow:inset_0_0_0_1px_$hairline-color" />
			</div>
		</div>
	</>
}

function Col2Contents() {
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
		<div class="flex-grow flex-col focus-ring-scroller focus-ring-14" style={{ "height": height() }}>
			<div class="flex-grow overflow-y:auto">
				<section class="p-$p flex-col gap-$gap">
					<SectionToggle />
					<For each={range(2)}>
						{() => <>
							<Radiobar />
						</>}
					</For>
				</section>
				<hr />
				<section class="p-$p flex-col gap-$gap">
					<SectionToggle />
					<For each={range(2)}>
						{() => <>
							<Radiobar />
						</>}
					</For>
					<div class="relative">
						<Textarea />
						<div class="absolute inset-b-($form-height/2) grid grid-cols-3 gap-$gap">
							<div></div>
							<For each={range(2)}>
								{() => <>
									<CheckboxButton />
								</>}
							</For>
						</div>
					</div>
					<CheckboxButton />
					<div class="grid grid-cols-3 gap-$gap">
						<For each={range(3)}>
							{() => <>
								<CheckboxButton />
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
			<hr class="collapsible" />
			<section class="p-$p flex-row gap-16">
				<div class="h-80 aspect-16/9 rounded-12 background-color:$text-200-color"></div>
				<div class="flex-grow flex-col gap-6">
					<Line w="70%" color="var(--text-200-color)" />
					<Line w="90%" color="var(--text-200-color)" />
					<Line w="80%" color="var(--text-200-color)" />
					<Line w="60%" color="var(--text-200-color)" />
				</div>
			</section>
			<hr />
			<section class="p-$p flex-col gap-6">
				<Line w="calc(70% / 1.25)" color="var(--text-200-color)" />
				<Line w="calc(90% / 1.25)" color="var(--text-200-color)" />
				<Line w="calc(80% / 1.25)" color="var(--text-200-color)" />
				<Line w="calc(60% / 1.25)" color="var(--text-200-color)" />
			</section>
		</div>
	</>
}

////////////////////////////////////////

function Col1Contents() {
	return <>
		<style jsx>{`
			:global(:root) {
				--search-results-grid-height: 96px;
				--search-results-grid-border-radius: 25%;
			}

			/********************************/

			.grid {
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
				box-shadow: var(--box-shadow);
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

function GridIcon() {
	return <>
		<style jsx>{`
			/* Preamble */
			.grid-icon-wrapper { position: relative; }
			.grid-icon-wrapper::before { content: ""; }

			/********************************/

			.grid-icon-wrapper { position: relative; }
			.grid-icon-wrapper {
				height: 100%;
				aspect-ratio: 1;
				border-radius: var(--border-radius);
			}
			.grid-icon-wrapper::before { content: ""; }
			.grid-icon-wrapper::before {
				position: absolute;
				z-index: -10;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				transform: scale(0);

				/* TRANSITION */
				transition: 150ms cubic-bezier(0, 1, 0.25, 1.15);
				transition-property: transform;
			}
			.group:hover .grid-icon-wrapper::before {
				background-color: var(--faded-base-color);
				transform: scale(1);
			}
			.group:hover:active .grid-icon-wrapper::before {
				background-color: var(--theme-color);
				transform: scale(1);
			}

			/********************************/

			.grid-icon-wrapper {
				display: grid;
				grid-template:
					/* TODO */
					"." calc((var(--border-radius) / 2 * 3) / 2) /* E.g. "b" / 2  */
					"a" 1fr
					"b" calc(var(--border-radius) / 2 * 3);
				place-items: center;
			}

			.grid-icon-wrapper > :global(:nth-child(1)) { grid-area: a; }
			.grid-icon-wrapper > :global(:nth-child(2)) { grid-area: b; }

			/********************************/

			svg.grid-icon {
				height: 32px;
				aspect-ratio: 1;
				color: var(--text-100-color);
			}
			.group:hover:active .grid-icon {
				color: white;
			}

			/********************************/

			.grid-text {
				height: 6px;
				width: 50%;
				border-radius: var(--full);
				background-color: var(--text-200-color);
			}
			.group:hover:active .grid-text {
				background-color: white;
			}
		`}</style>
		<div class="group grid grid-center">
			<div class="grid-icon-wrapper grid grid-center focus-ring focus-ring-24" tabindex="0">
				<Smiley class="grid-icon" use:solid-styled />
				<div class="grid-text"></div>
			</div>
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
		<style jsx>{`
			/* TODO: This only works / has been tested on desktop */
			:global(body:has([data-state-sidebar=expanded])) {
				overflow: hidden;
			}

			/********************************/

			.col-1 {
				margin-right: var(--sidebar-width);
				min-height: 100vh;

				/* TRANSITION */
				transition: 300ms ease;
				transition-property: margin-right;
			}
			[data-state-sidebar=collapsed] .col-1 {
				margin-right: 0;
			}
			[data-state-sidebar=expanded] .col-1 {
				-webkit-user-select: none; /* Disable selection */
				user-select: none;
			}

			/********************************/

			.col-2 {
				position: fixed;
				z-index: 10;
				inset: 0 0 0 auto; /* E.g. inset-r */
				width: var(--sidebar-width);
				background-color: var(--base-color);
				box-shadow: var(--box-shadow);

				/* TRANSITION */
				transition: 300ms ease;
				transition-property: width, transform;
			}
			[data-state-sidebar=collapsed] .col-2 {
				transform: translateX(var(--sidebar-width));
			}
			[data-state-sidebar=expanded] .col-2 {
				width: clamp(0px, var(--expanded-sidebar-width), 100vw);
			}
			/* Light mode: disable box-shadow */
			/* :global(:root[data-theme=light]) [data-state-sidebar=expanded] .col-2 { */
			/* 	box-shadow: revert; */
			/* } */

			/********************************/

			.col-2-backdrop {
				position: fixed;
				z-index: 10;
				inset: 0;
				background-color: transparent;
				pointer-events: none; /* Passthrough */

				/* TRANSITION */
				transition: 300ms ease;
				transition-property: background-color, backdrop-filter;
			}
			[data-state-sidebar=expanded] .col-2-backdrop {
				background-color: var(--backdrop-color);
				backdrop-filter: blur(2px);
				pointer-events: revert; /* Enable */
			}
		`}</style>
		<div class="contents" data-state-sidebar={sidebar()}>
			<div class="col-1">
				<Col1Contents />
			</div>
			<div class="col-2-backdrop" onClick={cycleForwards}></div>
			<div ref={setRef} class="col-2 flex-col">
				<Col2Contents />
			</div>
		</div>
	</>
}
