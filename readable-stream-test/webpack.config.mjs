import { resolve } from 'path'
import { fileURLToPath } from 'url'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../')

export default {
  mode: 'development',
  entry: './readable-stream-test/import.js',
  output: {
    path: resolve(rootDir, 'readable-stream-test', 'dist'),
    filename: 'import.js'
  }
}
