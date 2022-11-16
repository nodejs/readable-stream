'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { pipeline, Duplex, PassThrough } = require('../../lib/ours/index')
const assert = require('assert')
const remote = new PassThrough()
const local = new Duplex({
  read() {},
  write(chunk, enc, callback) {
    callback()
  }
})
pipeline(
  remote,
  local,
  remote,
  common.mustCall((err) => {
    assert.strictEqual(err.code, 'ERR_STREAM_PREMATURE_CLOSE')
  })
)
setImmediate(() => {
  remote.end()
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
