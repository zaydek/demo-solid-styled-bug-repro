import { defineConfig } from "vite"

import unoCSSPlugin from "unocss/vite"
import solidPlugin from "vite-plugin-solid"
//// import solidStyledPlugin from "vite-plugin-solid-styled"

export default defineConfig({
	define: {
		"import.meta.vitest": undefined,
	},
	plugins: [
		unoCSSPlugin(),
		solidPlugin({
			hot: false, // Disable HMR
		}),
		//// solidStyledPlugin({
		//// 	prefix: "styled",
		//// 	filter: {
		//// 		include: "src/**/*.tsx",
		//// 	},
		//// }),
	],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
})
