'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Writable } = require('../../lib/ours/index')
{
  const w = new Writable({
    write(chunk, encoding, callback) {
      callback(null)
    },
    final(callback) {
      queueMicrotask(callback)
    }
  })
  w.end()
  w.destroy()
  w.on('prefinish', common.mustNotCall())
  w.on('finish', common.mustNotCall())
  w.on('close', common.mustCall())
}

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
