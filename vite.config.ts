import { defineConfig } from "vite"

import solidStyledPlugin from "babel-plugin-solid-styled"
import unocssPlugin from "unocss/vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	plugins: [
		unocssPlugin(), // COMPAT/Solid: Takes precedence because of "&" -> "&amp;"
		solidPlugin({
			babel: {
				plugins: [
					[solidStyledPlugin, { verbose: true }]
				],
			},
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
