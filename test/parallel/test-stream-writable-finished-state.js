'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const assert = require('assert')

const stream = require('../../lib/ours/index')

const writable = new stream.Writable()

writable._write = (chunk, encoding, cb) => {
  // The state finished should start in false.
  assert.strictEqual(writable._writableState.finished, false)
  cb()
}

writable.on(
  'finish',
  common.mustCall(() => {
    assert.strictEqual(writable._writableState.finished, true)
  })
)
writable.end(
  'testing finished state',
  common.mustCall(() => {
    assert.strictEqual(writable._writableState.finished, true)
  })
)
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
