'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Writable } = require('../../lib/ours/index')

// Don't emit 'drain' if ended

const w = new Writable({
  write(data, enc, cb) {
    process.nextTick(cb)
  },
  highWaterMark: 1
})
w.on('drain', common.mustNotCall())
w.write('asd')
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
