import { Accessor, batch, createContext, createSignal, ParentProps, Show, untrack } from "solid-js"
import { createScreen, css } from "./utils/solid"
import { cx, round } from "./utils/vanilla"

type State = {
	progress: Accessor<number>
}

type Actions = {
	start: () => void
	end:   () => void
}

export const ProgressContext = createContext<{
	state:   State
	actions: Actions
}>()

export function ProgressProvider(props: ParentProps) {
	createScreen({ suppressWarning: true })

	const [progress, setProgress] = createSignal(0)
	const done = () => progress() === 100

	const [show, setShow] = createSignal(true)

	function start() {
		batch(() => {
			setShow(true)
			setProgress(0)
		})
		setProgress(0)
		setTimeout(() => {
			setProgress(75)
			const id = window.setInterval(() => {
				// Technically we don’t need untrack because of setInterval
				if (untrack(progress) === 100) {
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

	return <>
		{css`
			/* TODO: Extract stylesheet? */
			.progress-bar {
				--__progress: 0%;
				position: fixed;
				z-index: 10;
				inset:
					0    /* T */
					0    /* R */
					auto /* B */
					0;   /* L */
				height: 4px;
				width: var(--__progress);
				background-color: hsl(200 100% 50%);
				box-shadow: 0 0 8px 0 hsl(200 100% 50%);
				transition: width 300ms ease;
			}
			.progress-bar.done {
				transition: opacity 300ms ease 300ms;
				opacity: 0%;
			}
		`}
		<ProgressContext.Provider
			value={{
				state: {
					progress,
				},
				actions: {
					start,
					end,
				}
			}}
		>
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
			{props.children}
		</ProgressContext.Provider>
	</>
}
