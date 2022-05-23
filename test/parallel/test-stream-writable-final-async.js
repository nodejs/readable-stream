'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const { Duplex } = require('../../lib/ours/index')

const st = require('timers').setTimeout

function setTimeout(ms) {
  return new Promise((resolve) => {
    st(resolve, ms)
  })
}

{
  class Foo extends Duplex {
    async _final(callback) {
      await setTimeout(common.platformTimeout(1))
      callback()
    }

    _read() {}
  }

  const foo = new Foo()
  foo._write = common.mustCall((chunk, encoding, cb) => {
    cb()
  })
  foo.end('test', common.mustCall())
  foo.on('error', common.mustNotCall())
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
