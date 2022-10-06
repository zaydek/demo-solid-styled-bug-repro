function createParams() {
	const search = new URLSearchParams(window.location.search)

	return {
		get: {
			boolean(key: string) {
				const value = search.get(key)
				if (value === null) { return }
				return value === "t" || value === "1"
			},
			number(key: string) {
				const value = search.get(key)
				if (value === null) { return }
				return Number.isNaN(+value) ? undefined : +value
			},
			string(key: string) {
				const value = search.get(key)
				if (value === null) { return }
				return value
			},
		},
	}
}

// TODO: Breaks SSR?
export const params = createParams()
