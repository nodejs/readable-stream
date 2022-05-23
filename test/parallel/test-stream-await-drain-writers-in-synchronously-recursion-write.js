'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const { PassThrough } = require('../../lib/ours/index')

const encode = new PassThrough({
  highWaterMark: 1
})
const decode = new PassThrough({
  highWaterMark: 1
})
const send = common.mustCall((buf) => {
  encode.write(buf)
}, 4)
let i = 0
const onData = common.mustCall(() => {
  if (++i === 2) {
    send(Buffer.from([0x3]))
    send(Buffer.from([0x4]))
  }
}, 4)
encode.pipe(decode).on('data', onData)
send(Buffer.from([0x1]))
send(Buffer.from([0x2]))
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
