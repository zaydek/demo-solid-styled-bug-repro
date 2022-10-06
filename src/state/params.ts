function createParams() {
	const search = new URLSearchParams(window.location.search)

	function boolean(key: string) {
		const value = search.get(key)
		if (value === null) { return }
		return value === "t" || value === "1"
	}

	function number(key: string) {
		const value = search.get(key)
		if (value === null) { return }
		return Number.isNaN(+value) ? undefined : +value
	}

	function string(key: string) {
		const value = search.get(key)
		if (value === null) { return }
		return value
	}

	return { get: { boolean, number, string } }
}

// TODO: Breaks SSR?
export const params = createParams()
