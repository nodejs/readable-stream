'use strict'

const t = require('tap')
const { Writable } = require('../../lib/ours/index')

t.test('a second synchronous _final callback emits ERR_MULTIPLE_CALLBACK', (t) => {
  t.plan(2)
  const writable = new Writable({
    write(buf, enc, cb) {
      cb()
    },
    final(cb) {
      cb()
      cb()
    }
  })
  writable.on('error', (err) => {
    t.equal(err.code, 'ERR_MULTIPLE_CALLBACK')
    t.equal(err.name, 'Error')
  })
  writable.end('hi')
})

t.test('a second _final callback on nextTick does not crash', (t) => {
  t.plan(1)
  const writable = new Writable({
    write(buf, enc, cb) {
      cb()
    },
    final(cb) {
      cb()
      process.nextTick(() => {
        // finish already destroyed the stream, as in Node core.
        // The bug was the TypeError thrown before that check.
        t.doesNotThrow(() => cb())
      })
    }
  })
  writable.on('error', (err) => {
    t.fail(err.message)
  })
  writable.end('hi')
})
