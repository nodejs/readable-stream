'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const assert = require('assert')

const Duplex = require('../../lib/ours/index').Duplex

{
  const stream = new Duplex({
    read() {}
  })
  assert.strictEqual(stream.allowHalfOpen, true)
  stream.on('finish', common.mustNotCall())
  assert.strictEqual(stream.listenerCount('end'), 0)
  stream.resume()
  stream.push(null)
}
{
  const stream = new Duplex({
    read() {},

    allowHalfOpen: false
  })
  assert.strictEqual(stream.allowHalfOpen, false)
  stream.on('finish', common.mustCall())
  assert.strictEqual(stream.listenerCount('end'), 0)
  stream.resume()
  stream.push(null)
}
{
  const stream = new Duplex({
    read() {},

    allowHalfOpen: false
  })
  assert.strictEqual(stream.allowHalfOpen, false)
  stream._writableState.ended = true
  stream.on('finish', common.mustNotCall())
  assert.strictEqual(stream.listenerCount('end'), 0)
  stream.resume()
  stream.push(null)
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
