'use strict'

const test = require('tape')

const { EventEmitter: EE } = require('events')

const { Readable, Writable } = require('../../lib/ours/index')

test('push', function (t) {
  t.plan(33)
  const stream = new Readable({
    highWaterMark: 16,
    encoding: 'utf8'
  })
  const source = new EE()

  stream._read = function () {
    // console.error('stream._read');
    readStart()
  }

  let ended = false
  stream.on('end', function () {
    ended = true
  })
  source.on('data', function (chunk) {
    const ret = stream.push(chunk) // console.error('data', stream._readableState.length);

    if (!ret) {
      readStop()
    }
  })
  source.on('end', function () {
    stream.push(null)
  })
  let reading = false

  function readStart() {
    // console.error('readStart');
    reading = true
  }

  function readStop() {
    // console.error('readStop');
    reading = false
    process.nextTick(function () {
      const r = stream.read()

      if (r !== null) {
        writer.write(r)
      }
    })
  }

  const writer = new Writable({
    decodeStrings: false
  })
  const written = []
  const expectWritten = [
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg'
  ]

  writer._write = function (chunk, encoding, cb) {
    // console.error('WRITE %s', chunk);
    written.push(chunk)
    process.nextTick(cb)
  }

  writer.on('finish', finish) // now emit some chunks.

  const chunk = 'asdfg'
  let set = 0
  readStart()
  data()

  function data() {
    t.ok(reading)
    source.emit('data', chunk)
    t.ok(reading)
    source.emit('data', chunk)
    t.ok(reading)
    source.emit('data', chunk)
    t.ok(reading)
    source.emit('data', chunk)
    t.notOk(reading)

    if (set++ < 5) {
      setTimeout(data, 10)
    } else {
      end()
    }
  }

  function finish() {
    // console.error('finish');
    t.deepEqual(written, expectWritten)
  }

  function end() {
    source.emit('end')
    t.notOk(reading)
    writer.end(stream.read())
    setTimeout(function () {
      t.ok(ended)
    })
  }
})
