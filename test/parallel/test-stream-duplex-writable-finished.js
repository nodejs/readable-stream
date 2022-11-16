'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Duplex } = require('../../lib/ours/index')
const assert = require('assert')

// basic
{
  // Find it on Duplex.prototype
  assert(Reflect.has(Duplex.prototype, 'writableFinished'))
}

// event
{
  const duplex = new Duplex()
  duplex._write = (chunk, encoding, cb) => {
    // The state finished should start in false.
    assert.strictEqual(duplex.writableFinished, false)
    cb()
  }
  duplex.on(
    'finish',
    common.mustCall(() => {
      assert.strictEqual(duplex.writableFinished, true)
    })
  )
  duplex.end(
    'testing finished state',
    common.mustCall(() => {
      assert.strictEqual(duplex.writableFinished, true)
    })
  )
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
