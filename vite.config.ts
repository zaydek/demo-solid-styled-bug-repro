import unoCSSPlugin from "unocss/vite"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
//// import { BASE_36, seededHash } from "./src/utils/vanilla"

//// let seed = 0
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
	//// css: {
	//// 	modules: {
	//// 		generateScopedName(name) {
	//// 			const hash = seededHash({ seed: seed++, base: BASE_36, length: 4 })
	//// 			return `${name}__${hash}`
	//// 		},
	//// 	},
	//// },
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
})
