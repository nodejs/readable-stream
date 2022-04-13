'use strict'

const test = require('tape')
const { Stream, Readable } = require('../../lib')

test('readable legacy drain', function (t) {
  t.plan(3)

  const r = new Readable()
  const N = 256
  let reads = 0
  r._read = function (n) {
    return r.push(++reads === N ? null : Buffer.alloc(1))
  }

  r.on('end', function () {
    t.ok(true, 'rended')
  })

  const w = new Stream()
  w.writable = true
  let writes = 0
  let buffered = 0
  w.write = function (c) {
    writes += c.length
    buffered += c.length
    process.nextTick(drain)
    return false
  }

  function drain() {
    if (buffered > 3) {
      t.ok(false, 'to much buffer')
    }
    buffered = 0
    w.emit('drain')
  }

  w.end = function () {
    t.equal(writes, 255)
    t.ok(true, 'wended')
  }

  // Just for kicks, let's mess with the drain count.
  // This verifies that even if it gets negative in the
  // pipe() cleanup function, we'll still function properly.
  r.on('readable', function () {
    w.emit('drain')
  })

  r.pipe(w)
})
