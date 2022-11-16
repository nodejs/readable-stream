'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Readable } = require('../../lib/ours/index')
const readable = new Readable({
  read() {}
})
function read() {}
readable.setEncoding('utf8')
readable.on('readable', read)
readable.removeListener('readable', read)
process.nextTick(function () {
  readable.on('data', common.mustCall())
  readable.push('hello')
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
