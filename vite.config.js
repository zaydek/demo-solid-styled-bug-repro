import solidStyled from "babel-plugin-solid-styled"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [
    solid({
      babel: {
        plugins: [
          [solidStyled, { source: true, verbose: false }]     // Not working
          //// [solidStyled, { source: true, verbose: true }] // Working
        ],
      },
      hot: false,
    }),
  ],
})
