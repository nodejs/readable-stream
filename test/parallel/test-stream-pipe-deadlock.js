'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Readable, Writable } = require('../../lib/ours/index')

// https://github.com/nodejs/node/issues/48666
;(async () => {
  // Prepare src that is internally ended, with buffered data pending
  const src = new Readable({
    read() {}
  })
  src.push(Buffer.alloc(100))
  src.push(null)
  src.pause()

  // Give it time to settle
  await new Promise((resolve) => setImmediate(resolve))
  const dst = new Writable({
    highWaterMark: 1000,
    write(buf, enc, cb) {
      process.nextTick(cb)
    }
  })
  dst.write(Buffer.alloc(1000)) // Fill write buffer
  dst.on('finish', common.mustCall())
  src.pipe(dst)
})().then(common.mustCall())

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
