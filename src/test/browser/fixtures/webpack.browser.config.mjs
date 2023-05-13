import { createRequire } from 'module'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
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
      process: require.resolve('process')
    })
  ],
  resolve: {
    aliasFields: ['browser'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify')
    }
  }
}
