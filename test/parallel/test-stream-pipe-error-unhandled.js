'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const assert = require('assert')
const { Readable, Writable } = require('../../lib/ours/index')
process.on(
  'uncaughtException',
  common.mustCall((err) => {
    assert.strictEqual(err.message, 'asd')
  })
)
const r = new Readable({
  read() {
    this.push('asd')
  }
})
const w = new Writable({
  autoDestroy: true,
  write() {}
})
r.pipe(w)
w.destroy(new Error('asd'))

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
