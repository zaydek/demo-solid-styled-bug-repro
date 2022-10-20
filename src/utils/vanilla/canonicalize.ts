export function canonicalize(str: string) {
	return str
		.trim()
		.replace(/\s+/g, "-")           // Whitespace -> hyphen (takes precedence)
		.replace(/-+/g, "-")            // Hyphens    -> hyphen
		.replace(/[^a-zA-Z0-9-]+/g, "") // Remove non-alphanums
}
