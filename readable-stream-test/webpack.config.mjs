import { resolve } from 'path'
import { fileURLToPath } from 'url'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../')

export default {
  mode: 'development',
  entry: './readable-stream-test/import.js',
  output: {
    path: resolve(rootDir, 'bundling', 'dist'),
    filename: 'import.js'
  }
}
