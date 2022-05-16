import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../')

export default {
  entry: './test/browser/test-browser.js',
  output: {
    filename: 'suite.node.js',
    path: resolve(rootDir, 'tmp/webpack')
  },
  mode: 'production',
  target: 'node',
  performance: false
}
