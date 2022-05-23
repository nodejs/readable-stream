'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const assert = require('assert')

const stream = require('../../lib/ours/index')

const r = new stream.Readable({
  read: () => {}
}) // readableListening state should start in `false`.

assert.strictEqual(r._readableState.readableListening, false)
r.on(
  'readable',
  common.mustCall(() => {
    // Inside the readable event this state should be true.
    assert.strictEqual(r._readableState.readableListening, true)
  })
)
r.push(Buffer.from('Testing readableListening state'))
const r2 = new stream.Readable({
  read: () => {}
}) // readableListening state should start in `false`.

assert.strictEqual(r2._readableState.readableListening, false)
r2.on(
  'data',
  common.mustCall((chunk) => {
    // readableListening should be false because we don't have
    // a `readable` listener
    assert.strictEqual(r2._readableState.readableListening, false)
  })
)
r2.push(Buffer.from('Testing readableListening state'))
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
