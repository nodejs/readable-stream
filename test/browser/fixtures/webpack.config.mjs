import { resolve } from 'path'
import { fileURLToPath } from 'url'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../')

export default {
  mode: 'development',
  entry: './test/browser/import-all.js',
  output: {
    path: resolve(rootDir, 'tmp/webpack'),
    filename: 'import-all.js'
  }
}
