// https://youtube.com/watch?v=7f-71kYhK00

import { defineConfig } from "vitest/config"

export default defineConfig({
	define: {
		"import.meta.vitest": "undefined",
	},
	test: {
		includeSource: ["src/**/*.{ts,tsx}"],
	},
})
