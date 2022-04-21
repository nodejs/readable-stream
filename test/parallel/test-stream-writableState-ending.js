'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
require('../common')

const assert = require('assert')

const stream = require('../../lib/ours/index')

const writable = new stream.Writable()

function testStates(ending, finished, ended) {
  assert.strictEqual(writable._writableState.ending, ending)
  assert.strictEqual(writable._writableState.finished, finished)
  assert.strictEqual(writable._writableState.ended, ended)
}

writable._write = (chunk, encoding, cb) => {
  // Ending, finished, ended start in false.
  testStates(false, false, false)
  cb()
}

writable.on('finish', () => {
  // Ending, finished, ended = true.
  testStates(true, true, true)
})
const result = writable.end('testing function end()', () => {
  // Ending, finished, ended = true.
  testStates(true, true, true)
}) // End returns the writable instance

assert.strictEqual(result, writable) // Ending, ended = true.
// finished = false.

testStates(true, false, true)
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
