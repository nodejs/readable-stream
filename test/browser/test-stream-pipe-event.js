'use strict'

const test = require('tape')

const inherits = require('inherits')

const { Stream } = require('../../lib/ours/index')

test('pipe event', function (t) {
  t.plan(1)

  function Writable() {
    this.writable = true
    Stream.call(this)
  }

  inherits(Writable, Stream)

  function Readable() {
    this.readable = true
    Stream.call(this)
  }

  inherits(Readable, Stream)
  let passed = false
  const w = new Writable()
  w.on('pipe', function (src) {
    passed = true
  })
  const r = new Readable()

  r._read = function () {}

  r.pipe(w)
  t.ok(passed)
})
