export function echo<T>(arg: T) {
	console.log(arg)
	return arg
}

if (import.meta.vitest) {
	const { expect, it: test, vi } = import.meta.vitest
	test("echo", () => {
		const spy = vi.spyOn(console, "log")
		echo("Hello, world!")
		expect(spy).toBeCalledTimes(1)
	})
}
