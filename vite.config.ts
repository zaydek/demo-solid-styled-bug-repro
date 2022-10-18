import { defineConfig } from "vite"

import unocssPlugin from "unocss/vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	define: {
		"import.meta.vitest": undefined,
	},
	plugins: [
		unocssPlugin(), // COMPAT/Solid: unocssPlugin takes precedence because of "&" -> "&amp;"
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
