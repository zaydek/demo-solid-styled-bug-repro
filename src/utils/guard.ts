export function guard(...values: any[]) {
	return values.some(value =>
		(typeof value === "function" ? value() : value) === undefined)
}
