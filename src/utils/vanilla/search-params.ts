// For example:
//
//   createParams("https://google.com/?foo=bar").string("foo")
//   -> "bar"
//
function createSearchParams(url: string) {
	const params = new URLSearchParams(url)
	function boolean(key: string) {
		const value = params.get(key)
		if (value === null) { return }
		return value === "true" ||
			value === "t" ||
			value === "1"
	}
	function number(key: string) {
		const value = params.get(key)
		if (value === null) { return }
		return Number.isNaN(+value)
			? undefined
			: +value
	}
	function string(key: string) {
		const value = params.get(key)
		if (value === null) { return }
		return value
	}
	return { boolean, number, string }
}

export let searchParams: ReturnType<typeof createSearchParams>
if (typeof window !== "undefined") {
	searchParams = createSearchParams(window.location.search)
}
