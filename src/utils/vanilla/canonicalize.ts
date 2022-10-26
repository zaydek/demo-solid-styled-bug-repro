export function canonicalize(str: string) {
	return str
		.trim()
		.toLowerCase()                  // Uppercase  -> lowercase
		.replace(/[^a-zA-Z0-9-]+/g, "") // Remove non-alphanums
		.replace(/\s+/g, "-")           // Whitespace -> hyphen (takes precedence)
		.replace(/-+/g, "-")            // Hyphens    -> hyphen
}
