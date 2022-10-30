import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	define: {
		"import.meta.vitest": undefined,
	},
	plugins: [
		solidPlugin({ hot: false }),
	],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
})
