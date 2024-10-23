import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import commonjs from 'vite-plugin-commonjs'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  mode: 'development',
  build: {
    sourcemap: true
  },
  plugins: [
    commonjs(),
    nodePolyfills()
  ]
})
