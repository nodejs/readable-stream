'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Readable } = require('../../lib/ours/index')
const assert = require('assert')
{
  const read = new Readable({
    read() {}
  })
  read.resume()
  read.on('end', common.mustNotCall('no end event'))
  read.on('close', common.mustCall())
  read.on(
    'error',
    common.mustCall((err) => {
      assert.strictEqual(err.name, 'AbortError')
    })
  )
  read[require('../../lib/ours/primordials').SymbolAsyncDispose]().then(
    common.mustCall(() => {
      assert.strictEqual(read.errored.name, 'AbortError')
      assert.strictEqual(read.destroyed, true)
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
