'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const assert = require('assert')

const stream = require('../../lib/ours/index')

process.on(
  'uncaughtException',
  common.mustCall((err) => {
    assert.strictEqual(err.message, 'kaboom')
  })
)
const writable = new stream.Writable()

const _err = new Error('kaboom')

writable._write = (chunk, encoding, cb) => {
  cb()
}

writable._final = (cb) => {
  cb(_err)
}

writable.write('asd')
writable.end(
  common.mustCall((err) => {
    assert.strictEqual(err, _err)
  })
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
