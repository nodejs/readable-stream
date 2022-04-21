'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const { Readable } = require('../../lib/ours/index') // readable.resume() should not lead to a ._read() call being scheduled
// when we exceed the high water mark already.

const readable = new Readable({
  read: common.mustNotCall(),
  highWaterMark: 100
}) // Fill up the internal buffer so that we definitely exceed the HWM:

for (let i = 0; i < 10; i++) readable.push('a'.repeat(200)) // Call resume, and pause after one chunk.
// The .pause() is just so that we don’t empty the buffer fully, which would
// be a valid reason to call ._read().

readable.resume()
readable.once(
  'data',
  common.mustCall(() => readable.pause())
)
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
