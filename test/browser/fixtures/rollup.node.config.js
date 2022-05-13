import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
export default {
  input: ['test/browser/test-browser.js'],
  output: {
    file: 'tmp/rollup/suite.node.js',
    format: 'cjs',
    name: 'readableStreamTestSuite',
    exports: 'auto'
  },
  plugins: [
    commonjs(),
    nodeResolve({
      browser: false,
      preferBuiltins: true
    })
  ]
}
