import { resolve } from 'path'
import { fileURLToPath } from 'url'

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
  resolve: {
    aliasFields: ['browser'],
  }
}
