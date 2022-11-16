'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
require('../common')
const assert = require('assert')
const { Duplex } = require('../../lib/ours/index')
{
  const d = new Duplex({
    objectMode: true,
    highWaterMark: 100
  })
  assert.strictEqual(d.writableObjectMode, true)
  assert.strictEqual(d.writableHighWaterMark, 100)
  assert.strictEqual(d.readableObjectMode, true)
  assert.strictEqual(d.readableHighWaterMark, 100)
}
{
  const d = new Duplex({
    readableObjectMode: false,
    readableHighWaterMark: 10,
    writableObjectMode: true,
    writableHighWaterMark: 100
  })
  assert.strictEqual(d.writableObjectMode, true)
  assert.strictEqual(d.writableHighWaterMark, 100)
  assert.strictEqual(d.readableObjectMode, false)
  assert.strictEqual(d.readableHighWaterMark, 10)
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
