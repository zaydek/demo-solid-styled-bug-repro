function thing(ref) {
	let ret = {}
	for (const key in ref) {
		if (ref[key] !== true && !Object.keys(ref[key]).length) {
			throw new Error("invalid syntax")
		}
		if (ref[key] === true) {
			ret[key] = ref[key]
		} else {
			ret[key] = thing(ref[key])
		}
	}
	return ret
}

console.log(
	thing({
		foo: true,
		bar: {
			baz: true,
		},
		qux: {
			foo: {
				bar: true,
			},
		},
	})
)
