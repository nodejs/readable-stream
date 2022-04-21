'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const stream = require('../../lib/ours/index')

process.on('uncaughtException', common.mustCall())
const r = new stream.Readable()

r._read = function (size) {
  r.push(Buffer.allocUnsafe(size))
}

const w = new stream.Writable()

w._write = function (data, encoding, cb) {
  cb(null)
}

r.pipe(w) // end() after pipe should cause unhandled exception

w.end()
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
