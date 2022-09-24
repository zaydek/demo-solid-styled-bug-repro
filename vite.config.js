import { defineConfig } from "vite"

import solidStyled from "babel-plugin-solid-styled"
import unocss from "unocss/vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [
		unocss(), // COMPAT/Solid: Takes precedence because of "&" -> "&amp;"
    solid({
      babel: {
        plugins: [
          [solidStyled, {}]
        ],
      },
      hot: false,
    }),
  ],
})
