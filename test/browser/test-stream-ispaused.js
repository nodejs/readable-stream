'use strict'

const test = require('tape')

const stream = require('../../lib/ours/index')

test('is paused', function (t) {
  t.plan(4)
  const readable = new stream.Readable() // _read is a noop, here.

  readable._read = () => {} // default state of a stream is not "paused"

  t.notOk(readable.isPaused()) // make the stream start flowing...

  readable.on('data', () => {}) // still not paused.

  t.notOk(readable.isPaused())
  readable.pause()
  t.ok(readable.isPaused())
  readable.resume()
  t.notOk(readable.isPaused())
})
