'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const assert = require('assert')
const { PassThrough } = require('../../lib/ours/index')
const pt = new PassThrough({
  highWaterMark: 0
})
pt.on('drain', common.mustCall())
assert(!pt.write('hello1'))
pt.read()
pt.read()

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
