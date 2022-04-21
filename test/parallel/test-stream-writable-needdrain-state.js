'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const stream = require('../../lib/ours/index')

const assert = require('assert')

const transform = new stream.Transform({
  transform: _transform,
  highWaterMark: 1
})

function _transform(chunk, encoding, cb) {
  process.nextTick(() => {
    assert.strictEqual(transform._writableState.needDrain, true)
    cb()
  })
}

assert.strictEqual(transform._writableState.needDrain, false)
transform.write(
  'asdasd',
  common.mustCall(() => {
    assert.strictEqual(transform._writableState.needDrain, false)
  })
)
assert.strictEqual(transform._writableState.needDrain, true)
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
