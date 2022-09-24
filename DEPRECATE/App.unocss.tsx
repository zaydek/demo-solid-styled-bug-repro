import { For, Show } from "solid-js"

function NavIcon() {
	return <>
		<div class="h-$nav-content-height aspect-1 rounded-$full background-color:$color display:grid place-items:center">
			<div class="h-50% aspect-1 rounded-$full background-color:$nested-color"></div>
		</div>
	</>
}

function SearchBar() {
	return <>
		<style jsx>{`
			:global(:root) {
				--search-bar-height: var(--nav-content-height);
			}
		`}</style>
		<div class="p-4px h-$search-bar-height aspect-12 rounded-$full background-color:$color display:flex flex-direction:row align-items:center gap:8px">
			<div class="h-100% aspect-1 rounded-$full background-color:$nested-color"></div>
			<div class="h-6px w-35% rounded-$full background-color:$nested-color"></div>
			<div class="flex-grow:1"></div>
			<div class="h-100% w-160px rounded-$full background-color:$nested-color display:grid place-items:center">
				<div class="h-6px w-50% rounded-$full background-color:$color"></div>
			</div>
		</div>
	</>
}

function Navbar() {
	return <>
		<style jsx>{`
			:global(:root) {
				--navbar-height: calc(var(--padding) * 2 + var(--nav-content-height));
				--nav-content-height: 40px;
			}
		`}</style>
		<div class="p-$padding fixed inset-t background-color:$base-color box-shadow:$hairline-box-shadow display:flex flex-direction:row justify-content:center [&>*]:flex-basis:$container-basis">
			<div class="relative display:flex flex-direction:row align-items:center gap:8px">
				<NavIcon />
				<NavIcon />
				<div class="flex-grow:1"></div>
				<NavIcon />
				<NavIcon />
				<div class="absolute inset display:flex flex-direction:row justify-content:center align-items:center">
					<SearchBar />
				</div>
			</div>
		</div>
		<div class="h-$navbar-height"></div>
	</>
}

////////////////////////////////////////////////////////////////////////////////

const ActionButton = NavIcon

function SubscribeButton() {
	return <>
		<div class="h-$nav-content-height aspect-4 rounded-8px background-color:$color display:grid place-items:center">
			<div class="h-6px w-50% rounded-$full background-color:$nested-color"></div>
		</div>
	</>
}

function Player() {
	return <>
		<div class="aspect-16/9 rounded-8px background-color:$color"></div>
	</>
}

function PlayerMeta() {
	return <>
		<div class="display:flex flex-direction:row align-items:center gap:16px h-96px">
			<div class="flex-grow:1 display:flex flex-direction:column gap:12px">
				<div class="h-12px w-50% rounded-$full background-color:$color"></div>
				<div class="h-12px w-40% rounded-$full background-color:$color"></div>
			</div>
			<ActionButton />
			<ActionButton />
			<ActionButton />
			<SubscribeButton />
		</div>
	</>
}

function Comment() {
	return <>
		<div class="display:flex flex-direction:row align-items:center gap:16px">
			<div class="h-48px aspect-1 rounded-$full background-color:$color"></div>
			<div class="flex-grow:1 display:flex flex-direction:column gap:6px">
				<div class="h-6px w-30% rounded-$full background-color:$color"></div>
				<div class="h-6px w-40% rounded-$full background-color:$color"></div>
				<div class="h-6px w-20% rounded-$full background-color:$color"></div>
			</div>
		</div>
	</>
}

function Main() {
	return <>
		<div class="flex-grow:1">
			<Player />
			<PlayerMeta />
			<div class="display:flex flex-direction:column gap:32px">
				<For each={[0, 1, 2, 3]}>
					{(_, index) => <>
						<Show when={index() === 0}>
							<hr />
						</Show>
						<Comment />
					</>}
				</For>
			</div>
		</div>
	</>
}

////////////////////////////////////////////////////////////////////////////////

function SidebarPreview() {
	return <>
		<div class="display:flex flex-direction:row gap:16px">
			<div class="h-96px aspect-16/9 rounded-8px background-color:$color"></div>
			<div class="flex-grow:1 display:flex flex-direction:column gap:6px">
				<div class="h-6px w-70% rounded-$full background-color:$color"></div>
				<div class="h-6px w-90% rounded-$full background-color:$color"></div>
				<div class="h-6px w-80% rounded-$full background-color:$color"></div>
				<div class="h-6px w-60% rounded-$full background-color:$color"></div>
			</div>
		</div>
	</>
}

function Sidebar() {
	return <>
		<div class="w-448px display:flex flex-direction:column gap:16px">
			<SidebarPreview />
			<div></div>
			<hr />
			<div></div>
			<For each={[0, 1, 2, 3, 4, 5, 6, 7]}>
				{() => <>
					<SidebarPreview />
				</>}
			</For>
		</div>
	</>
}

////////////////////////////////////////////////////////////////////////////////

function Globals() {
	return <>
		<style jsx>{`
			:global(:root) {
				--full: 1000px;

				/* Globals */
				--padding: 16px;
				--container-basis: 1536px;

				--base-color:   hsl(0deg 100% 100%);
				--color:        hsl(0deg 100%  50%);
				--nested-color: hsl(0deg 100% 100% / 75%);

				/* Hairline */
				--hairline-color: hsl(0deg 100%  50% / 25%);
				--hairline-box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 15%);
			}:

			:global(hr) {
				height: 1px;
				background-color: var(--hairline-color);
			}
		`}</style>
	</>
}

export function App() {
	return <>
		<Globals />
		<Navbar />
		<div class="p-$padding pt-($padding*2) display:flex flex-direction:row justify-content:center [&>*]:flex-basis:$container-basis">
			<div class="display:flex flex-direction:row gap:32px">
				<Main />
				<Sidebar />
			</div>
		</div>
	</>
}
