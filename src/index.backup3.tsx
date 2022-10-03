import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { useLocation, useParams, Outlet, hashIntegration, NavLink, NavLinkProps, Route, Router, Routes } from "@solidjs/router"
import { createRoot, FlowProps, JSX, splitProps } from "solid-js"
import { render } from "solid-js/web"
import { css } from "./solid-utils"

function NavItem(props: FlowProps<NavLinkProps, JSX.Element>) {
	return <>
		{css`
			a:has(.component-link-button) {
				border-radius: var(--full); // For :focus { outline: ... }
			}

			////////////////////////////////

			.component-link-button {
				padding: 0 20px;
				height: 40px;
				border-radius: var(--full);
				background-color: var(--card-color);
				box-shadow: 0 0 0 1px var(--hairline-color);
			}
			a.active > .component-link-button { // Active
				background-color: hsl(0deg 0% 10%);
				box-shadow: none;
			}

			////////////////////////////////

			.component-link-button-text {
				font-family: var(--sans);
				color: hsl(0deg 0% 10%);
			}
			a.active > .component-link-button > .component-link-button-text { // Active
				color: hsl(0deg 0% 90%);
			}
		`}
		<NavLink end {...splitProps(props, ["children"])[1]}>
			<div class="component-link-button flex-row flex-align-center">
				<div class="component-link-button-text">
					{props.children}
				</div>
			</div>
		</NavLink>
	</>
}

function Navbar() {
	return <>
		<nav class="flex-row gap-8px">
			<NavItem href="/">Open        <code>/</code>       </NavItem>
			<NavItem href="/foo">Open     <code>/foo</code>    </NavItem>
			<NavItem href="/foo/foo">Open <code>/foo/foo</code></NavItem>
			<NavItem href="/foo/bar">Open <code>/foo/bar</code></NavItem>
			<NavItem href="/foo/baz">Open <code>/foo/baz</code></NavItem>
			<NavItem href="/bar">Open     <code>/bar</code>    </NavItem>
			<NavItem href="/bar/foo">Open <code>/bar/foo</code></NavItem>
			<NavItem href="/bar/bar">Open <code>/bar/bar</code></NavItem>
			<NavItem href="/bar/baz">Open <code>/bar/baz</code></NavItem>
		</nav>
	</>
}

function Layout() {
	const params = useParams()
	const location = useLocation()
	console.log(JSON.stringify(params))
	console.log(JSON.stringify(location))

	return <>
		<div class="p-32px flex-col gap-16px">
			<Navbar />
			<code class="color:hsl(0deg_0%_10%)">You are currently on {location.pathname}</code>

			{/* Component code goes here */}
			<Outlet />
		</div>
	</>
}

function App() {
	return <>
		<Routes>
			<Route path="/" component={Layout} />
			<Route path="/foo" component={Layout}>
				<Route path="/"    />
				<Route path="/*" element={<div>Oops</div>} />
				<Route path="/foo" />
				<Route path="/bar" />
				<Route path="/baz" />
			</Route>
			<Route path="/bar" component={Layout}>
				<Route path="/"  />
				<Route path="/*" element={<div>Oops</div>} />
				<Route path="/foo" />
				<Route path="/bar" />
				<Route path="/baz" />
			</Route>
		</Routes>
	</>
}

createRoot(() => css`
	:focus { outline: revert; }

	:root {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		// Typography
		--sans: system-ui,
			-apple-system,
			"Segoe UI",
			Roboto,
			Helvetica,
			Arial,
			sans-serif,
			"Apple Color Emoji",
			"Segoe UI Emoji";

		--code: ui-monospace,
			SFMono-Regular,
			Consolas,
			"Liberation Mono",
			Menlo,
			monospace;

		// Colors
		--card-color:             hsl(0deg 0% 100%);
		--hairline-gray-color:    hsl(0deg 0% 85%);
		--text-color:             hsl(0deg 0% 25%);
		--placeholder-text-color: hsl(0deg 0% 50%);

		// DEBUG
		color: red;
	}
	code {
		-webkit-font-smoothing: auto;
		-moz-osx-font-smoothing: auto;

		font-family: var(--code);
	}
`)

render(() => <>
	{/* <Router source={hashIntegration()}> */}
	<Router>
		<App />
	</Router>
</>, document.getElementById("root")!)
