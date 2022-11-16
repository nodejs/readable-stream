'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const assert = require('assert')
const { Readable } = require('../../lib/ours/index')

// Verify that .push() and .unshift() can be called from 'data' listeners.

for (const method of ['push', 'unshift']) {
  const r = new Readable({
    read() {}
  })
  r.once(
    'data',
    common.mustCall((chunk) => {
      assert.strictEqual(r.readableLength, 0)
      r[method](chunk)
      assert.strictEqual(r.readableLength, chunk.length)
      r.on(
        'data',
        common.mustCall((chunk) => {
          assert.strictEqual(chunk.toString(), 'Hello, world')
        })
      )
    })
  )
  r.push('Hello, world')
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
