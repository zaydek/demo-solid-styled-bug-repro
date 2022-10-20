// TODO: Do something with this

function _recurse(el: Element, tabCount: number): string[] {
	const lines = []

	let tabStr = "\t".repeat(tabCount) // Formatting
	let tagStr = el.tagName            // <tag>
	let keyStr = ""                    // <... attr>

	let sortedKeys = Object.values(el.attributes).map(attr => attr.name).sort()
	let dx = sortedKeys.indexOf("d")
	if (dx > -1) {
		sortedKeys = [
			"d", // Takes precedence
			...sortedKeys.slice(0, dx),
			...sortedKeys.slice(dx + 1),
		]
	}
	for (const key of sortedKeys) {
		const attr = el.getAttributeNode(key)!
		if (attr.name === "class") { continue } // Step over class
		if (keyStr) {
			keyStr += " "
		}
		keyStr += `${attr.name}="${attr.value}"`
	}
	if (tagStr === "path") {
		lines.push(`${tabStr}<${tagStr} ${keyStr} />`)
	} else {
		lines.push(`${tabStr}<${tagStr} ${keyStr}>`)
		for (const child of el.children) {
			lines.push(..._recurse(child, tabCount + 1))
		}
		lines.push(`${tabStr}</${tagStr}>`)
	}
	return lines
}

export function stringify(el: Element) {
	return _recurse(el, 0).join("\n")
}
