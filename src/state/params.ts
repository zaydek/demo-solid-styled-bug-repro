// TODO: Breaks SSR?
function createParams() {
	const params = new URLSearchParams(window.location.search)

	return {
		get: {
			boolean(key: string) {
				const value = params.get(key)
				if (value === null) { return }
				return value === "t" || value === "1"
			},
			number(key: string) {
				const value = params.get(key)
				if (value === null) { return }
				return Number.isNaN(+value) ? undefined : +value
			},
			string(key: string) {
				const value = params.get(key)
				if (value === null) { return }
				return value
			},
		},
	}
}

export const params = createParams()
