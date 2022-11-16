'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { pipeline, PassThrough } = require('../../lib/ours/index')
const assert = require('assert')
process.on(
  'uncaughtException',
  common.mustCall((err) => {
    assert.strictEqual(err.message, 'error')
  })
)

// Ensure that pipeline that ends with Promise
// still propagates error to uncaughtException.
const s = new PassThrough()
s.end('data')
pipeline(
  s,
  async function (source) {
    for await (const chunk of source) {
    } // eslint-disable-line no-unused-vars, no-empty
  },
  common.mustSucceed(() => {
    throw new Error('error')
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
