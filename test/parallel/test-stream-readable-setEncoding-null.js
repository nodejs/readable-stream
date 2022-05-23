'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
require('../common')

const assert = require('assert')

const { Readable } = require('../../lib/ours/index')

{
  const readable = new Readable({
    encoding: 'hex'
  })
  assert.strictEqual(readable._readableState.encoding, 'hex')
  readable.setEncoding(null)
  assert.strictEqual(readable._readableState.encoding, 'utf8')
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
