import commonjs from '@rollup/plugin-commonjs'
import inject from '@rollup/plugin-inject'
import nodeResolve from '@rollup/plugin-node-resolve'
import { resolve } from 'node:path'
import nodePolyfill from 'rollup-plugin-polyfill-node'

export default {
  input: ['test/browser/test-browser.js'],
  output: {
    intro: 'function setImmediate(fn, ...args) { setTimeout(() => fn(...args), 1) }',
    file: 'tmp/rollup/suite.js',
    format: 'iife',
    name: 'readableStreamTestSuite'
  },
  plugins: [
    commonjs(),
    nodePolyfill(),
    inject({
      process: resolve('node_modules/process-es6/browser.js'),
      Buffer: [resolve('node_modules/buffer-es6/index.js'), 'Buffer']
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    })
  ]
}
