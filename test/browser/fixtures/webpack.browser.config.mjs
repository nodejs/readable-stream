import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import webpack from 'webpack'

const require = createRequire(import.meta.url)
const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../')

export default {
  entry: './test/browser/test-browser.js',
  output: {
    filename: 'suite.browser.js',
    path: resolve(rootDir, 'tmp/webpack')
  },
  mode: 'production',
  target: 'web',
  performance: false,
  plugins: [
    new webpack.BannerPlugin({
      banner: 'function setImmediate(fn, ...args) { setTimeout(() => fn(...args), 1) }',
      raw: true
    }),
    new webpack.ProvidePlugin({
      process: require.resolve('process-es6'),
      Buffer: [require.resolve('buffer-es6'), 'Buffer']
    })
  ],
  resolve: {
    aliasFields: ['browser'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify')
    }
  }
}
