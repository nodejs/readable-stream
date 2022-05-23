import { build } from 'esbuild'
import alias from 'esbuild-plugin-alias'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

build({
  entryPoints: ['test/browser/test-browser.js'],
  outfile: 'tmp/esbuild/suite.browser.js',
  bundle: true,
  platform: 'browser',
  plugins: [
    alias({
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify')
    })
  ],
  define: {
    global: 'globalThis'
  },
  inject: ['test/browser/fixtures/esbuild-browsers-shims.mjs']
}).catch(() => process.exit(1))
