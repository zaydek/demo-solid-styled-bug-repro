export function stringify(state: any, space?: number | string) {
	return JSON.stringify(state, (_, v) => {
		if (typeof v === "function") {
			return v()
		} else {
			return v
		}
	}, space)
}
