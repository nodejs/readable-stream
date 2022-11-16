'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const assert = require('assert')
const { Readable } = require('../../lib/ours/index')
{
  const r = new Readable({
    read() {}
  })
  assert.strictEqual(r.readable, true)
  r.destroy()
  assert.strictEqual(r.readable, false)
}
{
  const mustNotCall = common.mustNotCall()
  const r = new Readable({
    read() {}
  })
  assert.strictEqual(r.readable, true)
  r.on('end', mustNotCall)
  r.resume()
  r.push(null)
  assert.strictEqual(r.readable, true)
  r.off('end', mustNotCall)
  r.on(
    'end',
    common.mustCall(() => {
      assert.strictEqual(r.readable, false)
    })
  )
}
{
  const r = new Readable({
    read: common.mustCall(() => {
      process.nextTick(() => {
        r.destroy(new Error())
        assert.strictEqual(r.readable, false)
      })
    })
  })
  r.resume()
  r.on(
    'error',
    common.mustCall(() => {
      assert.strictEqual(r.readable, false)
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
