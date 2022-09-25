import "the-new-css-reset"
import "uno.css"
import "./scss/index.scss"

import { render } from "solid-js/web"
import { StyleRegistry } from "solid-styled"
import { App } from "./App"

render(() =>
	<StyleRegistry>
		<App />
	</StyleRegistry>,
	document.getElementById("root")!,
)
