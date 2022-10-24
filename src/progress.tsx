import { batch, createSignal, onMount, Show, untrack } from "solid-js"
import { css } from "./utils/solid"
import { cx, round } from "./utils/vanilla"

export function ProgressIndicator() {
	const [progress, setProgress] = createSignal(0)
	const done = () => progress() === 100

	const [show, setShow] = createSignal(true)

	function start() {
		batch(() => {
			setShow(true)
			setProgress(0)
		})
		setTimeout(() => {
			setProgress(75)
			const id = window.setInterval(() => {
				if (untrack(progress) === 100) { // Technically we don’t need untrack because of setInterval
					clearInterval(id)
					return
				}
				setProgress(curr => Math.min(99, curr + round(Math.random() * 25)))
			}, 300)
		}, 300)
	}

	function end() {
		setProgress(100)
	}

	onMount(start)

	// DEBUG
	window.addEventListener("keydown", e => {
		if (e.key === "d") {
			if (progress() === 100) {
				start()
			} else {
				end()
			}
		}
	})

	return <>
		{css`
			/* TODO: Change to transform-based implementation */
			.progress-bar {
				--__progress: 0%;
				position: fixed;
				inset:
					0    /* T */
					0    /* R */
					auto /* B */
					0;   /* L */
				height: 16px;
				width: var(--__progress);
				background-color: hsl(200 100% 50%);
				box-shadow: 0 0 32px 0 hsl(200 100% 50%);

				/* transform: scaleX(var(--__progress)); */
				/* transform-origin: left; */
				transition: width 300ms;

				pointer-events: none;
			}
			.progress-bar.done {
				transition: opacity 300ms 300ms;
				opacity: 0%;
			}
		`}
		<Show when={show()}>
			<div
				class={cx(`progress-bar ${done() ? "done" : ""}`)}
				style={{ "--__progress": `${progress()}%` }}
				onTransitionEnd={e => {
					if (e.propertyName === "opacity") {
						setShow(false)
					}
				}}
			></div>
		</Show>
	</>
}
