'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Readable, PassThrough, pipeline } = require('../../lib/ours/index')
const assert = require('assert')
const _err = new Error('kaboom')
async function run() {
  const source = new Readable({
    read() {}
  })
  source.push('hello')
  source.push('world')
  setImmediate(() => {
    source.destroy(_err)
  })
  const iterator = pipeline(source, new PassThrough(), () => {})
  iterator.setEncoding('utf8')
  for await (const k of iterator) {
    assert.strictEqual(k, 'helloworld')
  }
}
run().catch(common.mustCall((err) => assert.strictEqual(err, _err)))

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
