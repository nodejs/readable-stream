'use strict'

const test = require('tape')
const stream = require('../../lib/ours/index')

test('Error Listener Catches', function (t) {
  t.plan(3)

  let count = 1000

  const source = new stream.Readable()
  source._read = function (n) {
    n = Math.min(count, n)
    count -= n
    source.push(Buffer.alloc(n))
  }

  let unpipedDest
  source.unpipe = function (dest) {
    unpipedDest = dest
    stream.Readable.prototype.unpipe.call(this, dest)
  }

  const dest = new stream.Writable()
  dest._write = function (chunk, encoding, cb) {
    cb()
  }

  source.pipe(dest)

  let gotErr = null
  dest.on('error', function (err) {
    gotErr = err
  })

  let unpipedSource
  dest.on('unpipe', function (src) {
    unpipedSource = src
  })

  const err = new Error('This stream turned into bacon.')
  dest.emit('error', err)
  t.strictEqual(gotErr, err)
  t.strictEqual(unpipedSource, source)
  t.strictEqual(unpipedDest, dest)
})

test('Error Without Listener Throws', function testErrorWithoutListenerThrows(t) {
  t.plan(3)

  let count = 1000

  const source = new stream.Readable()
  source._read = function (n) {
    n = Math.min(count, n)
    count -= n
    source.push(Buffer.alloc(n))
  }

  let unpipedDest
  source.unpipe = function (dest) {
    unpipedDest = dest
    stream.Readable.prototype.unpipe.call(this, dest)
  }

  const dest = new stream.Writable()
  dest._write = function (chunk, encoding, cb) {
    cb()
  }

  source.pipe(dest)

  let unpipedSource
  dest.on('unpipe', function (src) {
    unpipedSource = src
  })

  const err = new Error('This stream turned into bacon.')
  const onerror = global.onerror

  dest.emit('error', err)

  global.onerror = (_u1, _u2, _u3, _u4, gotErr) => {
    t.strictEqual(gotErr, err)
    t.strictEqual(unpipedSource, source)
    t.strictEqual(unpipedDest, dest)
    global.onerror = onerror
  }
})
