'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const Readable = require('../../lib/ours/index').Readable

const _read = common.mustCall(function _read(n) {
  this.push(null)
})

const r = new Readable({
  read: _read
})
r.resume()
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
