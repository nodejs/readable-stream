'use strict'

const test = require('tape')
const { Readable, Writable } = require('../../lib/ours/index')

test('base64 single char read end', function (t) {
  t.plan(1)

  const src = new Readable({ encoding: 'base64' })
  const dst = new Writable()
  let hasRead = false
  const accum = []

  src._read = function (n) {
    if (!hasRead) {
      hasRead = true
      process.nextTick(function () {
        src.push(Buffer.from('1'))
        src.push(null)
      })
    }
  }

  dst._write = function (chunk, enc, cb) {
    accum.push(chunk)
    cb()
  }

  src.on('end', function () {
    t.equal(Buffer.concat(accum) + '', 'MQ==')
    clearTimeout(timeout)
  })

  src.pipe(dst)

  const timeout = setTimeout(function () {
    t.fail('timed out waiting for _write')
  }, 100)
})
