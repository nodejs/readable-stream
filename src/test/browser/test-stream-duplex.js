'use strict'

const test = require('tape')
const { Duplex } = require('../../lib')

test('duplex', function (t) {
  t.plan(4)

  const stream = new Duplex({ objectMode: true })

  t.ok(stream._readableState.objectMode)
  t.ok(stream._writableState.objectMode)

  let written
  let read

  stream._write = function (obj, _, cb) {
    written = obj
    cb()
  }

  stream._read = function () {}

  stream.on('data', function (obj) {
    read = obj
  })

  stream.on('end', function () {
    t.equal(read.val, 1)
    t.equal(written.val, 2)
  })

  stream.push({ val: 1 })
  stream.end({ val: 2 })
  stream.push(null)
})
