import { defineConfig } from "vite"

import unoCSSPlugin from "unocss/vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	define: {
		"import.meta.vitest": undefined,
	},
	plugins: [
		unoCSSPlugin(),
		solidPlugin({
			hot: false, // Disable HMR
		}),
	],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
})
