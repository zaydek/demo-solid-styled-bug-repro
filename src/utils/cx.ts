export function cx(...args: any[]) {
	const str = args
		.flat()
		.filter(Boolean)
		//// .map(str => removeComments(str))
		.join(" ")
		.trim()
		.replaceAll(/\s+/g, " ")
	if (str === "") { return undefined }
	return str
}
