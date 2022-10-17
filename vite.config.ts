import { defineConfig } from "vite"

import unocssPlugin from "unocss/vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	plugins: [
		unocssPlugin(),       // COMPAT/Solid: unocssPlugin takes precedence because of "&" -> "&amp;"
		//// solidDevToolsPlugin({ // https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#4-add-vite-plugin-optional
		//// 	name: true,
		//// }),
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
