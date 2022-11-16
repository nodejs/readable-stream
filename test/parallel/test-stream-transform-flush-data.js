'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
require('../common')
const assert = require('assert')
const Transform = require('../../lib/ours/index').Transform
const expected = 'asdf'
function _transform(d, e, n) {
  n()
}
function _flush(n) {
  n(null, expected)
}
const t = new Transform({
  transform: _transform,
  flush: _flush
})
t.end(Buffer.from('blerg'))
t.on('data', (data) => {
  assert.strictEqual(data.toString(), expected)
})

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
