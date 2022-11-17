'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const assert = require('assert')
const { Readable } = require('../../lib/ours/index')
const rs = new Readable({
  read() {}
})
let closed = false
let errored = false
rs.on(
  'close',
  common.mustCall(() => {
    closed = true
    assert(errored)
  })
)
rs.on(
  'error',
  common.mustCall((err) => {
    errored = true
    assert(!closed)
  })
)
rs.destroy(new Error('kaboom'))

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
