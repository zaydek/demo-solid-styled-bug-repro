import { defineConfig } from "vite"

import unocssPlugin from "unocss/vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	plugins: [
		unocssPlugin(), // COMPAT/Solid: Takes precedence because of "&" -> "&amp;"
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
