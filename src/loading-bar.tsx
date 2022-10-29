import { batch, createRoot, createSignal, Show } from "solid-js"
import { css } from "./utils/solid"
import { cx, round } from "./utils/vanilla"

export const loadingBar = createRoot(() => {
	const [show, setShow] = createSignal(false)
	const [progress, setProgress] = createSignal(0)

	let timeoutId = 0
	function start() {
		batch(() => {
			setShow(true)
			setProgress(0)
		})
		window.clearTimeout(timeoutId)
		timeoutId = window.setTimeout(() => {
			setProgress(50)
			const id = window.setInterval(() => {
 				if (progress() === 100) {
					clearInterval(id)
					return
				}
				setProgress(curr => Math.min(99, curr + round(Math.random() * 25)))
			}, 300)
		}, 0)
	}

	function end() {
		setProgress(100)
	}

	function done() {
		setShow(false)
	}

	return {
		// STATE
		show,
		progress,

		// ACTIONS
		start,
		end,
		done,
	}
})

export function LoadingBar() {
	return <>
		{css`
			.loading-bar {
				--__progress: 0;
				position: fixed;
				z-index: 1000;
				inset:
					0    /* T */
					0    /* R */
					auto /* B */
					0;   /* L */
				height: 4px;
				width: calc(var(--__progress) * 1%);
				background-color: var(--trim-color);
				transition: 300ms ease;
				transition-property: width;
			}
			.loading-bar.done {
				transition: opacity 300ms ease 300ms;
				opacity: 0%;
			}
		`}
		<Show when={loadingBar.show()}>
			<div
				class={cx(`loading-bar ${loadingBar.progress() < 100 ? "" : "done"}`)}
				style={{ "--__progress": loadingBar.progress() }}
				onTransitionEnd={e => {
					if (e.propertyName === "opacity") {
						loadingBar.done()
					}
				}}
			></div>
		</Show>
	</>
}
